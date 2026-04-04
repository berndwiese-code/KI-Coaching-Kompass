"""
tool_enrichment.py
Lädt Prompts aus der prompts-Tabelle und befüllt die tools-Tabelle
mit Claude Haiku. Nutzt tools_pages als primäre Textquelle,
fällt auf apify_text zurück wenn keine Pages vorhanden.

Umgebungsvariablen:
  SUPABASE_URL    = https://xxxx.supabase.co
  SUPABASE_KEY    = Service-Role-Key
  ANTHROPIC_KEY   = Anthropic API Key

Verwendung:
  python tool_enrichment.py --force
  python tool_enrichment.py
  python tool_enrichment.py --felder zusammenfassung,zielgruppe
  python tool_enrichment.py --force --ids id1,id2,id3
  python tool_enrichment.py --force --skip 146
"""

import os
import sys
import time
import argparse
import anthropic
from supabase import create_client

SUPABASE_URL  = os.environ["SUPABASE_URL"]
SUPABASE_KEY  = os.environ["SUPABASE_KEY"]
ANTHROPIC_KEY = os.environ["ANTHROPIC_KEY"]

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
client   = anthropic.Anthropic(api_key=ANTHROPIC_KEY)

ALLE_FELDER   = ["zusammenfassung", "zusammenfassung_kurz", "zielgruppe", "schwerpunkt", "produktkategorie", "technologie_fokus", "firmensitz", "kostenmodell", "sprache_website", "sprache_tool_ui", "sprache_llm", "relevanz_bewertung", "relevanz_begruendung", "ap1_name", "ap1_rolle", "ap1_email"]
MIN_TEXT_LEN  = 200
MAX_INPUT_LEN = 15000  # Zeichen die an Claude geschickt werden


def lade_prompts(felder):
    response = (
        supabase.table("prompts")
        .select("zielfeld, prompt_text, modell, max_tokens")
        .eq("zieltabelle", "tools")
        .eq("aktiv", True)
        .in_("zielfeld", felder)
        .execute()
    )
    return {row["zielfeld"]: row for row in response.data}


def lade_pages_text(tool_id):
    """Lädt und kombiniert Volltexte aus tools_pages für ein Tool."""
    response = (
        supabase.table("tools_pages")
        .select("url, volltext")
        .eq("tool_id", tool_id)
        .execute()
    )
    seiten = response.data
    if not seiten:
        return None

    # Texte zusammenführen mit URL als Trenner
    teile = []
    for seite in seiten:
        volltext = seite.get("volltext") or ""
        url      = seite.get("url") or ""
        if len(volltext) >= MIN_TEXT_LEN:
            teile.append(f"[Seite: {url}]\n{volltext}")

    if not teile:
        return None

    kombiniert = "\n\n---\n\n".join(teile)
    return kombiniert[:MAX_INPUT_LEN]


def lade_tools(limit=None, force=False, felder=None, ids=None):
    query = (
        supabase.table("tools")
        .select("id, url_sauber, apify_text, " + ", ".join(felder))
        .eq("status", "aktiv")
    )
    if ids:
        query = query.in_("id", ids)

    tools = query.execute().data

    if not force:
        tools = [
            t for t in tools
            if any(not t.get(f) or t.get(f) == "" for f in felder)
        ]

    # Nur Tools mit irgendeinem Text (pages oder apify_text)
    tools = [
        t for t in tools
        if t.get("apify_text") and len(t.get("apify_text", "")) >= MIN_TEXT_LEN
    ]

    if limit and not ids:
        tools = tools[:limit]

    return tools


def hole_input_text(tool):
    """Holt den besten verfügbaren Text — pages bevorzugt, sonst apify_text."""
    pages_text = lade_pages_text(tool["id"])
    if pages_text and len(pages_text) >= MIN_TEXT_LEN:
        return pages_text, "pages"
    apify = tool.get("apify_text", "")[:MAX_INPUT_LEN]
    return apify, "apify"


SMALLINT_FELDER = {"relevanz_bewertung"}

def befuelle_feld(tool, prompt_row, input_text, zielfeld=None):
    prompt = f"{prompt_row['prompt_text']}\n\n---\nWebsitetext:\n{input_text}"
    try:
        message = client.messages.create(
            model=prompt_row["modell"],
            max_tokens=prompt_row["max_tokens"],
            messages=[{"role": "user", "content": prompt}]
        )
        wert = message.content[0].text.strip()

        # Smallint-Konvertierung
        if zielfeld in SMALLINT_FELDER:
            try:
                return int(wert[0])  # Nur erste Ziffer nehmen
            except Exception:
                return None

        return wert
    except Exception as e:
        print(f"      ⚠ Claude-Fehler: {e}")
        return None


def speichere_felder(tool_id, updates):
    try:
        supabase.table("tools").update(updates).eq("id", tool_id).execute()
        return True
    except Exception as e:
        print(f"      ⚠ Speicher-Fehler: {e}")
        return False


def main():
    parser = argparse.ArgumentParser(description="Tool Enrichment mit Claude")
    parser.add_argument("--limit",  type=int, default=None)
    parser.add_argument("--felder", type=str, default=",".join(ALLE_FELDER))
    parser.add_argument("--force",  action="store_true")
    parser.add_argument("--ids",    type=str, default=None)
    parser.add_argument("--skip",   type=int, default=0)
    args = parser.parse_args()

    felder = [f.strip() for f in args.felder.split(",")]
    ids    = [i.strip() for i in args.ids.split(",")] if args.ids else None

    ungueltig = [f for f in felder if f not in ALLE_FELDER]
    if ungueltig:
        print(f"⚠ Unbekannte Felder: {ungueltig}")
        print(f"  Verfügbar: {ALLE_FELDER}")
        sys.exit(1)

    print(f"▶ Lade Prompts für: {felder}")
    prompts = lade_prompts(felder)
    fehlende = [f for f in felder if f not in prompts]
    if fehlende:
        print(f"⚠ Keine aktiven Prompts für: {fehlende}")
        sys.exit(1)
    print(f"✓ {len(prompts)} Prompts geladen\n")

    info = f"(IDs: {len(ids)})" if ids else f"(limit: {args.limit})" if args.limit else "(alle)"
    print(f"▶ Lade Tools {info}...")
    tools = lade_tools(limit=args.limit, force=args.force, felder=felder, ids=ids)
    gesamt = len(tools)
    print(f"✓ {gesamt} Tools zu verarbeiten\n")

    if not tools:
        print("Keine Tools zu verarbeiten.")
        print("Tipp: --force um vorhandene Inhalte zu überschreiben.")
        sys.exit(0)

    if args.skip > 0:
        print(f"⏭ Überspringe die ersten {args.skip} Tools\n")
        tools = tools[args.skip:]

    stats = {"ok": 0, "fehler": 0, "uebersprungen": 0, "pages": 0, "apify": 0}

    for i, tool in enumerate(tools, args.skip + 1):
        url = (tool.get("url_sauber") or "")[:55]
        print(f"  [{i}/{gesamt}] {url}")

        # Besten Text holen
        input_text, quelle = hole_input_text(tool)
        print(f"      📄 Quelle: {quelle} ({len(input_text)} Zeichen)")
        stats[quelle] += 1

        updates = {}
        for feld in felder:
            if not args.force and tool.get(feld):
                print(f"      ↷ {feld} bereits befüllt")
                stats["uebersprungen"] += 1
                continue

            ergebnis = befuelle_feld(tool, prompts[feld], input_text, zielfeld=feld)
            if ergebnis:
                updates[feld] = ergebnis
                anzeige = str(ergebnis); print(f"      ✓ {feld}: {anzeige[:60]}{'...' if len(anzeige) > 60 else ''}")
            else:
                stats["fehler"] += 1

            time.sleep(0.3)

        if updates:
            if speichere_felder(tool["id"], updates):
                stats["ok"] += 1
            else:
                stats["fehler"] += 1

    print(f"\n{'=' * 55}")
    print("✅ Enrichment abgeschlossen!\n")
    print(f"  Verarbeitet:      {stats['ok']}")
    print(f"  Übersprungen:     {stats['uebersprungen']}")
    print(f"  Fehler:           {stats['fehler']}")
    print(f"  Quelle pages:     {stats['pages']}")
    print(f"  Quelle apify:     {stats['apify']}")


if __name__ == "__main__":
    main()
