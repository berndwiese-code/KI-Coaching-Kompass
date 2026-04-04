"""
Neu-Klassifizierung mit Volltext
Läuft über alle Einträge in import_750 die apify_text haben
und klassifiziert neu — diesmal mit echtem Seiteninhalt.
Überschreibt kategorie, kategorie_begruendung, kategorie_konfidenz.

Umgebungsvariablen:
  SUPABASE_URL   = https://xxxx.supabase.co
  SUPABASE_KEY   = Service-Role-Key
  ANTHROPIC_KEY  = Anthropic API Key
"""

import os, time, json
from supabase import create_client
import anthropic

# ── Konfiguration ──────────────────────────────────────────────
SUPABASE_URL  = os.environ["SUPABASE_URL"]
SUPABASE_KEY  = os.environ["SUPABASE_KEY"]
ANTHROPIC_KEY = os.environ["ANTHROPIC_KEY"]

BATCH_SIZE     = 10
PAUSE_SEKUNDEN = 1

# ── Clients ────────────────────────────────────────────────────
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
client   = anthropic.Anthropic(api_key=ANTHROPIC_KEY)

# ── System-Prompt ──────────────────────────────────────────────
SYSTEM_PROMPT = """Du bist ein Klassifizierungs-Assistent für KI-Coaching-Kompass.
Klassifiziere jeden Eintrag anhand von URL, Titel und Volltext.

Kategorien:
- tool       → Software, App, SaaS, KI-Tool (hat Pricing, Login, Features)
- artikel    → Blogartikel, Fachbeitrag, Magazinartikel, Whitepaper, PDF
- studie     → Wissenschaftliche Studie, RCT, Meta-Analyse, Forschungsbericht
- video      → YouTube, Vimeo, Webinar-Aufzeichnung
- social     → LinkedIn-Post, Twitter/X, Reddit, Forum
- irrelevant → Nicht relevant für KI-Coaching
- ausbildung → Kurs, Zertifizierung, Ausbildungsprogramm, Akademie, Institut, Workshop-Reihe
- unklar     → Wirklich nicht zuordenbar

WICHTIG: Antworte NUR mit einem JSON-Array. Kein Text davor oder danach.
Keine Markdown-Formatierung. Kein ```json```. Nur das reine Array.

Format:
[{"id":"...","kategorie":"tool","begruendung":"kurze Begruendung","konfidenz":"hoch"},...]

konfidenz: "hoch" | "mittel" | "niedrig"
Begruendung: maximal 10 Woerter, keine Sonderzeichen."""

# ── Batch klassifizieren ───────────────────────────────────────
def klassifiziere_batch(rows: list) -> list:
    eintraege = []
    for row in rows:
        url     = (row.get("url_sauber") or row.get("url") or "")[:100]
        titel   = (row.get("apify_title") or row.get("meta_title") or "")[:80]
        # Volltext bevorzugen, dann Snippet als Fallback
        text    = (row.get("apify_text") or row.get("text_snippet") or "")[:3000]
        eintraege.append(
            f'ID:{row["id"]}\nURL:{url}\nTitel:{titel}\nText:{text}'
        )

    user_message = "Klassifiziere:\n\n" + "\n---\n".join(eintraege)

    message = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=8000,
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content": user_message}],
    )

    raw = message.content[0].text.strip()
    if "```" in raw:
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
    return json.loads(raw.strip())


# ── Einzeln klassifizieren (Fallback) ─────────────────────────
def klassifiziere_einzeln(row: dict) -> dict:
    url   = (row.get("url_sauber") or row.get("url") or "")[:100]
    titel = (row.get("apify_title") or row.get("meta_title") or "")[:80]
    text  = (row.get("apify_text") or row.get("text_snippet") or "")[:3000]

    message = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=300,
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content":
            f"Klassifiziere:\n\nID:{row['id']}\nURL:{url}\nTitel:{titel}\nText:{text}"}],
    )
    raw = message.content[0].text.strip()
    if "```" in raw:
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
    result = json.loads(raw.strip())
    return result[0] if isinstance(result, list) else result


# ── Hauptprogramm ─────────────────────────────────────────────
def main():
    # Alle Einträge holen — auch bereits klassifizierte werden neu bewertet
    response = (
        supabase.table("import_750")
        .select("id, url_sauber, url, apify_title, apify_text, "
                "meta_title, text_snippet, kategorie")
        .eq("neu_klassifiziert", False)
        .execute()
    )
    rows = response.data
    gesamt = len(rows)
    print(f"▶ {gesamt} Datensätze zur Neu-Klassifizierung.")
    print(f"  (Volltext vorhanden: "
          f"{sum(1 for r in rows if r.get('apify_text'))} Einträge)\n")

    stats = {"tool":0,"artikel":0,"studie":0,"ausbildung":0,
             "video":0,"social":0,"irrelevant":0,"unklar":0}
    geaendert = 0

    batches = [rows[i:i+BATCH_SIZE] for i in range(0, gesamt, BATCH_SIZE)]

    for batch_nr, batch in enumerate(batches, 1):
        print(f"── Batch {batch_nr}/{len(batches)} ({len(batch)} Einträge) ──")

        ergebnisse = []
        try:
            ergebnisse = klassifiziere_batch(batch)
        except json.JSONDecodeError as e:
            print(f"  ⚠ JSON-Fehler: {e} → Einzelverarbeitung...")
            for row in batch:
                try:
                    e = klassifiziere_einzeln(row)
                    ergebnisse.append(e)
                    time.sleep(0.3)
                except Exception as ex:
                    print(f"  ✗ {row.get('url_sauber','')[:40]}: {ex}")
                    ergebnisse.append({
                        "id":          row["id"],
                        "kategorie":   row.get("kategorie") or "unklar",
                        "begruendung": "Fehler bei Klassifizierung",
                        "konfidenz":   "niedrig"
                    })
        except Exception as e:
            print(f"  ⚠ API-Fehler: {e}")
            time.sleep(PAUSE_SEKUNDEN)
            continue

        for eintrag in ergebnisse:
            row_id      = eintrag.get("id")
            kategorie   = eintrag.get("kategorie", "unklar")
            begruendung = eintrag.get("begruendung", "")
            konfidenz   = eintrag.get("konfidenz", "niedrig")

            # Alte Kategorie zum Vergleich holen
            alte_kat = next(
                (r.get("kategorie") for r in batch if r["id"] == row_id), None
            )

            supabase.table("import_750").update({
                "kategorie":             kategorie,
                "kategorie_begruendung": begruendung,
                "kategorie_konfidenz":   konfidenz,
                "neu_klassifiziert":     True,
            }).eq("id", row_id).execute()

            stats[kategorie] = stats.get(kategorie, 0) + 1
            if alte_kat and alte_kat != kategorie:
                geaendert += 1
                aenderung = f" (war: {alte_kat})"
            else:
                aenderung = ""

            symbol = {"tool":"🔧","artikel":"📄","studie":"🔬","ausbildung":"🎓",
                      "video":"🎥","social":"💬","irrelevant":"✗","unklar":"?"}.get(kategorie,"·")
            k = konfidenz[:1].upper()
            print(f"  {symbol} [{k}] {kategorie:<12} {begruendung[:45]}{aenderung}")

        time.sleep(PAUSE_SEKUNDEN)

    # Abschlussbericht
    print(f"\n{'='*55}")
    print(f"✅ Neu-Klassifizierung abgeschlossen!")
    print(f"   {geaendert} Einträge haben ihre Kategorie geändert.\n")
    for kat, anzahl in sorted(stats.items(), key=lambda x: -x[1]):
        balken = "█" * min(anzahl, 40)
        print(f"  {kat:<12} {anzahl:>4}  {balken}")
    print(f"\nNächster Schritt: python schritt3_migration.py")

if __name__ == "__main__":
    main()
