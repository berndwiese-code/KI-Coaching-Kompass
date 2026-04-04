"""
Apify Test: Playwright Browser Crawler
Testet 5 URLs mit echtem Browser — holt Volltext in text_apify_crawl.

Voraussetzungen:
  pip install supabase apify-client

Umgebungsvariablen:
  SUPABASE_URL  = https://xxxx.supabase.co
  SUPABASE_KEY  = Service-Role-Key
  APIFY_TOKEN   = Apify API Token
"""

import os
from supabase import create_client
from apify_client import ApifyClient

# ── Konfiguration ──────────────────────────────────────────────
SUPABASE_URL = os.environ["SUPABASE_URL"]
SUPABASE_KEY = os.environ["SUPABASE_KEY"]
APIFY_TOKEN  = os.environ["APIFY_TOKEN"]

# ── Die 5 Test-URLs mit ihren Supabase-IDs ────────────────────
TEST_URLS = [
    {
        "id":  "9f48c262-5c57-4c75-b46a-0a3437a95333",
        "url": "https://aisuperior.com/de/ai-companies-for-coaching/"
    },
    {
        "id":  "9c450f5d-2581-4c08-bf7d-55e6763205d1",
        "url": "https://hybrid.management/blog/ki-gestuetztes-coaching/"
    },
    {
        "id":  "cfec559f-fcaf-41b3-843e-5c202d7c9639",
        "url": "https://www.dranbleiben.support/article/so-begleitest-du-deine-teilnehmer-individuell-bei-der-umsetzung/"
    },
    {
        "id":  "676eb25b-7408-4a6f-9abd-5bb50759ea62",
        "url": "https://aijourn.com/the-ai-revolution-in-executive-coaching-beyond-traditional-boundaries/"
    },
    {
        "id":  "3ba9aa15-1d8d-4aee-adcd-46b0db869f23",
        "url": "https://ineko.de/workshops/ki-in-coaching-mediation-und-beratung"
    },
]

# ── Clients ────────────────────────────────────────────────────
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
apify    = ApifyClient(APIFY_TOKEN)

# ── Hauptprogramm ─────────────────────────────────────────────
def main():
    print(f"▶ Starte Apify Playwright Test mit {len(TEST_URLS)} URLs...\n")

    run_input = {
        "startUrls": [{"url": t["url"]} for t in TEST_URLS],
        "crawlerType": "playwright:firefox",  # Echter Browser
        "maxCrawlDepth": 0,                   # Nur diese Seite, keine Links
        "maxCrawlPages": len(TEST_URLS),
        "removeCookieWarnings": True,
        "saveMarkdown": True,                 # Sauberer Text ohne HTML
        "saveHtml": False,
        "maxSessionRotations": 3,
    }

    print("⏳ Apify läuft (echter Browser) — das dauert 1-2 Minuten...\n")

    try:
        run   = apify.actor("apify/website-content-crawler").call(
            run_input=run_input,
            timeout_secs=300
        )
        items = list(apify.dataset(run["defaultDatasetId"]).iterate_items())
    except Exception as e:
        print(f"✗ Apify-Fehler: {e}")
        return

    print(f"✓ Apify fertig — {len(items)} Seiten gecrawlt.\n")

    # Ergebnisse URL→Inhalt mappen
    results = {}
    for item in items:
        url  = item.get("url", "")
        text = item.get("markdown") or item.get("text") or ""
        text = " ".join(text.split())  # Whitespace bereinigen
        results[url] = {
            "title": item.get("title", ""),
            "text":  text,
        }

    # In Supabase schreiben und Ergebnis anzeigen
    print("── Ergebnisse ──────────────────────────────────────")
    for test in TEST_URLS:
        data = results.get(test["url"], {})
        text = data.get("text", "")

        if text:
            # Volltext in Supabase speichern
            supabase.table("import_750").update({
                "text_apify_crawl": text[:50000],  # Max 50k Zeichen
                "meta_title":       data.get("title", "")[:500] or None,
            }).eq("id", test["id"]).execute()

            print(f"\n✓ {test['url'][:60]}")
            print(f"  Titel:  {data.get('title','')[:70]}")
            print(f"  Länge:  {len(text):,} Zeichen")
            print(f"  Vorschau: {text[:200]}...")
        else:
            print(f"\n✗ {test['url'][:60]}")
            print(f"  → Kein Inhalt gefunden")

    print(f"\n{'='*55}")
    print("✅ Test abgeschlossen!")
    print("\nPrüfe jetzt in Supabase → import_750 → text_apify_crawl")
    print("ob die Texte vollständig und lesbar sind.")

if __name__ == "__main__":
    main()
