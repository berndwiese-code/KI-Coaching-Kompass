"""
Schritt 3: Migration
Überführt klassifizierte Einträge aus import_750
in die Zieltabellen: tools, artikel, studien, ausbildung.
"""
import os
from supabase import create_client

SUPABASE_URL = os.environ["SUPABASE_URL"]
SUPABASE_KEY = os.environ["SUPABASE_KEY"]
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

ZIEL = {
    "tool":       "tools",
    "artikel":    "artikel",
    "studie":     "studien",
    "ausbildung": "ausbildung",
    "video":      "artikel",
    "social":     "artikel",
}

GEMEINSAME_FELDER = [
    "url_sauber", "seitentitel", "art_inhalts", "art_inhalts_genau",
    "zusammenfassung", "zielgruppe", "sprache_website",
    "relevanz_bewertung", "relevanz_begruendung",
    "interessant", "veroeffentlicht",
    "apify_title", "apify_description", "apify_text",
    "apify_status", "apify_crawl_datum",
    "meta_title", "meta_description", "text_snippet",
]

EXTRA_FELDER = {
    "tools": [
        "firmensitz", "kostenmodell", "schwerpunkt", "technologie_fokus",
        "sprache_tool_ui", "sprache_llm", "dsgvo_text", "dsgvo_jn",
        "kooperation", "kooperation_wunsch", "kooperation_wunsch_art",
        "provision", "wettbewerber", "produktkategorie", "letzter_check",
    ],
    "artikel": [],
    "studien": [],
    "ausbildung": [
        "kostenmodell", "dsgvo_text", "dsgvo_jn",
        "kooperation", "kooperation_wunsch", "provision",
    ],
}

BOOLEAN_FELDER = {
    "interessant", "veroeffentlicht",
    "dsgvo_jn", "kooperation", "kooperation_wunsch",
}

RELEVANZ_MAP = {
    "sehr hoch": 5,
    "hoch":      4,
    "mittel":    3,
    "niedrig":   2,
    "keine":     1,
}


def zu_bool(wert):
    if wert is None:
        return None
    if isinstance(wert, bool):
        return wert
    s = str(wert).strip().lower()
    if s in ("ja", "true", "1", "yes"):
        return True
    if s in ("nein", "false", "0", "no"):
        return False
    return None  # "Unklar", "nicht verfügbar" etc. → weglassen


def zu_relevanz(wert):
    if wert is None:
        return None
    if isinstance(wert, int):
        return wert
    s = str(wert).strip().lower()
    for key, num in RELEVANZ_MAP.items():
        if s.startswith(key):
            return num
    return None


def migriere_eintrag(row: dict, zieltabelle: str, kategorie: str) -> bool:
    data = {}

    for feld in GEMEINSAME_FELDER:
        wert = row.get(feld)
        if wert is None:
            continue
        if feld in BOOLEAN_FELDER:
            wert = zu_bool(wert)
            if wert is None:
                continue
        elif feld == "relevanz_bewertung":
            wert = zu_relevanz(wert)
            if wert is None:
                continue
        data[feld] = wert

    for feld in EXTRA_FELDER.get(zieltabelle, []):
        wert = row.get(feld)
        if wert is None:
            continue
        if feld in BOOLEAN_FELDER:
            wert = zu_bool(wert)
            if wert is None:
                continue
        data[feld] = wert

    if kategorie in ("video", "social"):
        data["art_inhalts_genau"] = kategorie

    if not data:
        return False

    try:
        supabase.table(zieltabelle).insert(data).execute()
        return True
    except Exception as e:
        print(f"    ⚠ Fehler bei Insert: {e}")
        return False


def main():
    response = (
        supabase.table("import_750")
        .select("*")
        .in_("kategorie", list(ZIEL.keys()))
        .execute()
    )
    rows = response.data
    gesamt = len(rows)
    print(f"▶ {gesamt} Einträge zu migrieren.\n")

    stats = {t: {"ok": 0, "fehler": 0} for t in set(ZIEL.values())}
    nicht_migriert = 0

    for i, row in enumerate(rows, 1):
        kategorie   = row.get("kategorie")
        zieltabelle = ZIEL.get(kategorie)
        if not zieltabelle:
            nicht_migriert += 1
            continue

        erfolg = migriere_eintrag(row, zieltabelle, kategorie)
        stats[zieltabelle]["ok" if erfolg else "fehler"] += 1
        symbol = {"tools": "🔧", "artikel": "📄", "studien": "🔬", "ausbildung": "🎓"}.get(zieltabelle, "·")
        status = "✓" if erfolg else "✗"
        url = (row.get("url_sauber") or "")[:55]
        print(f"  [{i}/{gesamt}] {status} {symbol} {zieltabelle:<12} {url}")

    print(f"\n{'=' * 55}")
    print("✅ Migration abgeschlossen!\n")
    for tabelle, s in stats.items():
        print(f"  {tabelle:<12} ✓ {s['ok']:>4}   ✗ {s['fehler']:>3}")
    if nicht_migriert:
        print(f"\n  Nicht migriert (irrelevant/unklar): {nicht_migriert}")


if __name__ == "__main__":
    main()
