"""
tools_url_root.py
Extrahiert die Root-URL aus url_sauber und speichert sie in url_root.
Beispiel: https://www.retorio.com/de/ueber-uns → https://www.retorio.com

Umgebungsvariablen:
  SUPABASE_URL  = https://xxxx.supabase.co
  SUPABASE_KEY  = Service-Role-Key
"""

import os
from urllib.parse import urlparse
from supabase import create_client

SUPABASE_URL = os.environ["SUPABASE_URL"]
SUPABASE_KEY = os.environ["SUPABASE_KEY"]

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)


def extrahiere_root(url: str) -> str | None:
    """Extrahiert Schema + Netloc ohne Trailing-Slash."""
    if not url:
        return None
    try:
        parsed = urlparse(url)
        if not parsed.scheme or not parsed.netloc:
            return None
        return f"{parsed.scheme}://{parsed.netloc}"
    except Exception:
        return None


def main():
    print("▶ Lade Tools aus Supabase...")
    response = (
        supabase.table("tools")
        .select("id, url_sauber, url_root")
        .execute()
    )
    tools = response.data
    print(f"✓ {len(tools)} Tools geladen\n")

    ok = 0
    fehler = 0
    uebersprungen = 0

    for tool in tools:
        # Überspringen wenn bereits befüllt
        if tool.get("url_root"):
            uebersprungen += 1
            continue

        url_root = extrahiere_root(tool.get("url_sauber"))

        if not url_root:
            print(f"  ⚠ Keine Root extrahierbar: {tool.get('url_sauber')}")
            fehler += 1
            continue

        try:
            supabase.table("tools").update(
                {"url_root": url_root}
            ).eq("id", tool["id"]).execute()
            print(f"  ✓ {url_root}")
            ok += 1
        except Exception as e:
            print(f"  ⚠ Fehler bei {tool.get('url_sauber')}: {e}")
            fehler += 1

    print(f"\n{'=' * 55}")
    print(f"✅ Fertig!\n")
    print(f"  Befüllt:        {ok}")
    print(f"  Übersprungen:   {uebersprungen}")
    print(f"  Fehler:         {fehler}")


if __name__ == "__main__":
    main()
