"""
Schritt 1 (v3): Direktes Fetching ohne Apify
Holt Metadaten (Titel, Description, Textauszug) direkt per HTTP.
Kein externer Service nötig — läuft komplett lokal.

Voraussetzungen:
  pip install supabase requests beautifulsoup4 lxml

Umgebungsvariablen:
  SUPABASE_URL  = https://xxxx.supabase.co
  SUPABASE_KEY  = Service-Role-Key
"""

import os, time
import requests
from bs4 import BeautifulSoup
from supabase import create_client

# ── Konfiguration ──────────────────────────────────────────────
SUPABASE_URL  = os.environ["SUPABASE_URL"]
SUPABASE_KEY  = os.environ["SUPABASE_KEY"]

TIMEOUT       = 10   # Sekunden pro URL
PAUSE         = 0.5  # Sekunden zwischen URLs (höfliches Crawling)

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/122.0.0.0 Safari/537.36"
    ),
    "Accept-Language": "de-DE,de;q=0.9,en;q=0.8",
}

# ── Client ─────────────────────────────────────────────────────
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# ── Eine URL fetchen ───────────────────────────────────────────
def fetch_url(url: str) -> dict:
    try:
        r = requests.get(url, headers=HEADERS, timeout=TIMEOUT, allow_redirects=True)
        r.raise_for_status()
    except Exception:
        return {}

    try:
        soup = BeautifulSoup(r.content, "lxml")
    except Exception:
        soup = BeautifulSoup(r.content, "html.parser")

    # Titel
    title = ""
    if soup.title:
        title = soup.title.string or ""
    if not title:
        og = soup.find("meta", property="og:title")
        title = og["content"] if og and og.get("content") else ""

    # Description
    desc = ""
    meta_desc = soup.find("meta", attrs={"name": "description"})
    if meta_desc and meta_desc.get("content"):
        desc = meta_desc["content"]
    if not desc:
        og_desc = soup.find("meta", property="og:description")
        desc = og_desc["content"] if og_desc and og_desc.get("content") else ""

    # Textauszug aus Body
    for tag in soup(["script", "style", "nav", "footer", "header"]):
        tag.decompose()
    text = " ".join(soup.get_text(separator=" ").split())[:600]

    return {
        "title":       title.strip()[:500],
        "description": desc.strip()[:500],
        "text":        text,
    }


# ── Hauptprogramm ─────────────────────────────────────────────
def main():
    response = (
        supabase.table("import_750")
        .select("id, url_sauber, url")
        .is_("meta_title", "null")
        .execute()
    )
    rows = response.data
    gesamt = len(rows)
    print(f"▶ {gesamt} URLs zu verarbeiten.\n")

    ok, leer, fehler = 0, 0, 0

    for i, row in enumerate(rows, 1):
        url = row.get("url_sauber") or row.get("url")
        if not url:
            continue

        data = fetch_url(url)

        update = {
            "meta_title":       data.get("title", ""),
            "meta_description": data.get("description", ""),
            "text_snippet":     data.get("text", ""),
        }
        supabase.table("import_750").update(update).eq("id", row["id"]).execute()

        if data.get("title"):
            ok += 1
            print(f"  [{i}/{gesamt}] ✓ {data['title'][:65]}")
        elif data:
            leer += 1
            print(f"  [{i}/{gesamt}] ~ (kein Titel) {url[:55]}")
        else:
            fehler += 1
            print(f"  [{i}/{gesamt}] ✗ (nicht erreichbar) {url[:50]}")

        time.sleep(PAUSE)

    print(f"\n{'='*55}")
    print(f"✅ Fertig!  ✓ {ok} OK   ~ {leer} kein Titel   ✗ {fehler} Fehler")
    print("Nächster Schritt: python schritt2_claude_klassifizierung.py")

if __name__ == "__main__":
    main()
