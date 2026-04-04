"""
Schritt 1: Apify Crawler
Liest alle URLs aus import_750, fetcht Metadaten via Apify,
schreibt meta_title, meta_description, text_snippet zurück.

Voraussetzungen:
  pip install supabase apify-client

Umgebungsvariablen (.env oder direkt setzen):
  SUPABASE_URL      = https://xxxx.supabase.co
  SUPABASE_KEY      = dein Service-Role-Key (nicht der anon key!)
  APIFY_TOKEN       = dein Apify API Token
"""

import os, time, json
from supabase import create_client
from apify_client import ApifyClient

# ── Konfiguration ──────────────────────────────────────────────
SUPABASE_URL   = os.environ["SUPABASE_URL"]
SUPABASE_KEY   = os.environ["SUPABASE_KEY"]   # Service-Role-Key
APIFY_TOKEN    = os.environ["APIFY_TOKEN"]

BATCH_SIZE     = 20    # Wie viele URLs pro Apify-Run
PAUSE_SEKUNDEN = 2     # Pause zwischen Batches (Rate Limiting)

# ── Clients ────────────────────────────────────────────────────
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
apify    = ApifyClient(APIFY_TOKEN)

# ── Hilfsfunktion: Apify Web Scraper für einen Batch ──────────
def fetch_batch(urls: list[str]) -> dict:
    """Gibt dict {url: {title, description, text}} zurück."""
    run_input = {
        "startUrls": [{"url": u} for u in urls],
        "pageFunction": """
async function pageFunction(context) {
    const { page, request } = context;
    const title       = await page.title();
    const description = await page.$eval(
        'meta[name="description"]',
        el => el.getAttribute('content')
    ).catch(() => '');
    const ogDesc      = await page.$eval(
        'meta[property="og:description"]',
        el => el.getAttribute('content')
    ).catch(() => '');
    const bodyText    = await page.$eval(
        'body',
        el => el.innerText.replace(/\\s+/g, ' ').trim().slice(0, 600)
    ).catch(() => '');
    return {
        url:         request.url,
        title:       title || '',
        description: description || ogDesc || '',
        text:        bodyText,
    };
}
""",
        "maxConcurrency": 5,
        "maxRequestsPerCrawl": len(urls),
        "ignoreSslErrors": True,
    }

    run    = apify.actor("apify/web-scraper").call(run_input=run_input)
    items  = list(apify.dataset(run["defaultDatasetId"]).iterate_items())
    return {item["url"]: item for item in items if "url" in item}


# ── Hauptprogramm ─────────────────────────────────────────────
def main():
    # Nur Zeilen holen, die noch kein meta_title haben
    response = (
        supabase.table("import_750")
        .select("id, url_sauber, url")
        .is_("meta_title", "null")
        .execute()
    )
    rows = response.data
    print(f"▶ {len(rows)} URLs zu verarbeiten.")

    # In Batches aufteilen
    batches = [rows[i:i+BATCH_SIZE] for i in range(0, len(rows), BATCH_SIZE)]

    for batch_nr, batch in enumerate(batches, 1):
        urls_map = {}
        for row in batch:
            url = row.get("url_sauber") or row.get("url")
            if url:
                urls_map[url] = row["id"]

        if not urls_map:
            continue

        print(f"\n── Batch {batch_nr}/{len(batches)} ({len(urls_map)} URLs) ──")

        try:
            results = fetch_batch(list(urls_map.keys()))
        except Exception as e:
            print(f"  ⚠ Apify-Fehler: {e} – Batch wird übersprungen.")
            time.sleep(PAUSE_SEKUNDEN)
            continue

        for url, row_id in urls_map.items():
            data = results.get(url, {})
            update = {
                "meta_title":       (data.get("title")       or "")[:500],
                "meta_description": (data.get("description") or "")[:500],
                "text_snippet":     (data.get("text")        or "")[:600],
            }
            supabase.table("import_750").update(update).eq("id", row_id).execute()
            status = "✓" if data else "–"
            print(f"  {status} {url[:70]}")

        time.sleep(PAUSE_SEKUNDEN)

    print("\n✅ Schritt 1 abgeschlossen.")

if __name__ == "__main__":
    main()
