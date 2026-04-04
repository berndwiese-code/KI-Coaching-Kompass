"""
Apify Volltext-Crawler (final)
Crawlt alle URLs in import_750 mit echtem Playwright-Browser.
Schreibt in apify_title, apify_text, apify_description,
apify_crawl_datum, apify_status.

Voraussetzungen:
  pip install supabase apify-client

Umgebungsvariablen:
  SUPABASE_URL  = https://xxxx.supabase.co
  SUPABASE_KEY  = Service-Role-Key
  APIFY_TOKEN   = Apify API Token
"""

import os, time
from datetime import datetime, timezone
from supabase import create_client
from apify_client import ApifyClient

# ── Konfiguration ──────────────────────────────────────────────
SUPABASE_URL = os.environ["SUPABASE_URL"]
SUPABASE_KEY = os.environ["SUPABASE_KEY"]
APIFY_TOKEN  = os.environ["APIFY_TOKEN"]

BATCH_SIZE     = 10   # URLs pro Apify-Run (konservativ für Stabilität)
PAUSE_SEKUNDEN = 2    # Pause zwischen Batches

# ── Clients ────────────────────────────────────────────────────
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
apify    = ApifyClient(APIFY_TOKEN)

# ── Einen Batch crawlen ────────────────────────────────────────
def crawle_batch(urls: list[str]) -> dict:
    """Gibt dict {url: {title, description, text, status}} zurück."""

    run_input = {
        "startUrls":          [{"url": u} for u in urls],
        "crawlerType":        "playwright:firefox",
        "maxCrawlDepth":      0,
        "maxCrawlPages":      len(urls),
        "removeCookieWarnings": True,
        "saveMarkdown":       True,
        "saveHtml":           False,
        "maxSessionRotations": 3,
    }

    try:
        run   = apify.actor("apify/website-content-crawler").call(
            run_input=run_input,
            timeout_secs=300
        )
        items = list(apify.dataset(run["defaultDatasetId"]).iterate_items())
    except Exception as e:
        print(f"  ⚠ Apify-Fehler: {e}")
        return {}

    result = {}
    for item in items:
        url      = item.get("url", "")
        markdown = item.get("markdown") or item.get("text") or ""

        # Titel aus erster Markdown-Ueberschrift extrahieren
        title = item.get("title") or ""
        if not title:
            for line in markdown.splitlines():
                line = line.strip()
                if line.startswith("#"):
                    title = line.lstrip("#").strip()
                    break

        # Description: erster Fliestext-Absatz nach dem Titel
        description = item.get("description") or ""
        if not description:
            found_title = False
            for line in markdown.splitlines():
                line = line.strip()
                if line.startswith("#"):
                    found_title = True
                    continue
                if found_title and line and not line.startswith("#") \
                        and not line.startswith("!") and len(line) > 30:
                    description = line[:500]
                    break

        # Text bereinigen
        text = " ".join(markdown.split())

        # Status bestimmen
        status_code = item.get("statusCode", 0)
        if status_code == 403:
            status = "geblockt"
        elif status_code == 404:
            status = "nicht_gefunden"
        elif not text:
            status = "kein_inhalt"
        else:
            status = "ok"

        result[url] = {
            "title":       title[:500],
            "description": description[:500],
            "text":        text[:50000],
            "status":      status,
        }

    return result


# ── Hauptprogramm ─────────────────────────────────────────────
def main():
    # Alle URLs holen die noch nicht gecrawlt wurden
    response = (
        supabase.table("import_750")
        .select("id, url_sauber, url")
        .is_("apify_status", "null")
        .execute()
    )
    rows = response.data
    gesamt = len(rows)
    print(f"▶ {gesamt} URLs zu crawlen (Batches à {BATCH_SIZE}).\n")

    if not rows:
        print("Nichts zu tun — alle URLs bereits gecrawlt.")
        return

    # Statistik
    stats = {"ok": 0, "geblockt": 0, "nicht_gefunden": 0,
             "kein_inhalt": 0, "fehler": 0}

    batches = [rows[i:i+BATCH_SIZE] for i in range(0, rows.__len__(), BATCH_SIZE)]
    jetzt   = datetime.now(timezone.utc).isoformat()

    for batch_nr, batch in enumerate(batches, 1):
        urls_map = {}
        for row in batch:
            url = row.get("url_sauber") or row.get("url")
            if url:
                urls_map[url] = row["id"]

        if not urls_map:
            continue

        print(f"── Batch {batch_nr}/{len(batches)} ({len(urls_map)} URLs) ──")

        results = crawle_batch(list(urls_map.keys()))

        for url, row_id in urls_map.items():
            data = results.get(url)

            if data:
                status = data["status"]
                update = {
                    "apify_title":       data["title"] or None,
                    "apify_description": data["description"] or None,
                    "apify_text":        data["text"] or None,
                    "apify_status":      status,
                    "apify_crawl_datum": jetzt,
                }
            else:
                status = "fehler"
                update = {
                    "apify_status":      "fehler",
                    "apify_crawl_datum": jetzt,
                }

            supabase.table("import_750").update(update).eq("id", row_id).execute()
            stats[status] = stats.get(status, 0) + 1

            symbol = {"ok":"✓","geblockt":"🔒","nicht_gefunden":"✗",
                      "kein_inhalt":"~","fehler":"⚠"}.get(status, "?")
            titel  = (data or {}).get("title", url)[:60] if data else url[:60]
            laenge = len((data or {}).get("text",""))
            laenge_str = f"{laenge:,} Z." if laenge else ""
            print(f"  {symbol} [{status}] {titel}  {laenge_str}")

        time.sleep(PAUSE_SEKUNDEN)

    # Abschlussbericht
    print(f"\n{'='*55}")
    print("✅ Crawling abgeschlossen!\n")
    print(f"  ✓ OK:             {stats['ok']:>4}")
    print(f"  🔒 Geblockt:      {stats['geblockt']:>4}")
    print(f"  ✗ Nicht gefunden: {stats['nicht_gefunden']:>4}")
    print(f"  ~ Kein Inhalt:    {stats['kein_inhalt']:>4}")
    print(f"  ⚠ Fehler:        {stats['fehler']:>4}")
    print(f"\nNächster Schritt: python schritt3_migration.py")

if __name__ == "__main__":
    main()
