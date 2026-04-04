"""
Schritt 1 (v2): Apify Website Content Crawler
Robustere Version - verwendet apify/website-content-crawler
statt web-scraper mit eigenem JavaScript.

Voraussetzungen:
  pip install supabase apify-client

Umgebungsvariablen:
  SUPABASE_URL   = https://xxxx.supabase.co
  SUPABASE_KEY   = Service-Role-Key
  APIFY_TOKEN    = Apify API Token
"""

import os, time
from supabase import create_client
from apify_client import ApifyClient

# ── Konfiguration ──────────────────────────────────────────────
SUPABASE_URL  = os.environ["SUPABASE_URL"]
SUPABASE_KEY  = os.environ["SUPABASE_KEY"]
APIFY_TOKEN   = os.environ["APIFY_TOKEN"]

BATCH_SIZE    = 10   # Kleinere Batches für mehr Stabilität
PAUSE_SEKUNDEN = 3

# ── Clients ────────────────────────────────────────────────────
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
apify    = ApifyClient(APIFY_TOKEN)

# ── Batch crawlen ──────────────────────────────────────────────
def fetch_batch(urls: list[str]) -> dict:
    """Gibt dict {url: {title, description, text}} zurück."""

    run_input = {
        "startUrls": [{"url": u} for u in urls],
        "maxCrawlDepth": 0,          # Nur die angegebene Seite, keine Links folgen
        "maxCrawlPages": len(urls),
        "crawlerType": "cheerio",    # Schnell, kein Browser nötig
        "removeCookieWarnings": True,
        "saveMarkdown": False,
        "saveHtml": False,
    }

    try:
        run   = apify.actor("apify/website-content-crawler").call(
            run_input=run_input,
            timeout_secs=120
        )
        items = list(apify.dataset(run["defaultDatasetId"]).iterate_items())
    except Exception as e:
        print(f"  ⚠ Apify-Fehler: {e}")
        return {}

    result = {}
    for item in items:
        url = item.get("url", "")
        if url:
            # Text auf 600 Zeichen kürzen
            text = item.get("text", "") or ""
            text = " ".join(text.split())[:600]

            result[url] = {
                "title":       (item.get("title") or "")[:500],
                "description": (item.get("description") or "")[:500],
                "text":        text,
            }
    return result


# ── Hauptprogramm ─────────────────────────────────────────────
def main():
    # Alle Zeilen holen die noch kein meta_title haben
    response = (
        supabase.table("import_750")
        .select("id, url_sauber, url")
        .is_("meta_title", "null")
        .execute()
    )
    rows = response.data
    print(f"▶ {len(rows)} URLs zu verarbeiten (je {BATCH_SIZE} pro Batch).")

    if not rows:
        print("Nichts zu tun — alle Zeilen haben bereits meta_title.")
        return

    batches = [rows[i:i+BATCH_SIZE] for i in range(0, len(rows), BATCH_SIZE)]
    gesamt_ok = 0
    gesamt_leer = 0

    for batch_nr, batch in enumerate(batches, 1):
        urls_map = {}
        for row in batch:
            url = row.get("url_sauber") or row.get("url")
            if url:
                urls_map[url] = row["id"]

        if not urls_map:
            continue

        print(f"\n── Batch {batch_nr}/{len(batches)} ({len(urls_map)} URLs) ──")

        results = fetch_batch(list(urls_map.keys()))

        for url, row_id in urls_map.items():
            data = results.get(url, {})
            update = {
                "meta_title":       data.get("title", ""),
                "meta_description": data.get("description", ""),
                "text_snippet":     data.get("text", ""),
            }
            supabase.table("import_750").update(update).eq("id", row_id).execute()

            if data.get("title"):
                gesamt_ok += 1
                print(f"  ✓ {data['title'][:60]}")
            else:
                gesamt_leer += 1
                print(f"  – (kein Inhalt) {url[:60]}")

        time.sleep(PAUSE_SEKUNDEN)

    print(f"\n{'='*50}")
    print(f"✅ Fertig! {gesamt_ok} erfolgreich, {gesamt_leer} ohne Inhalt.")
    print("Nächster Schritt: python schritt2_claude_klassifizierung.py")

if __name__ == "__main__":
    main()
