"""
Schritt 2: Claude API Klassifizierung
Liest alle Zeilen aus import_750 (mit meta_title / text_snippet),
lässt Claude entscheiden: tool | artikel | studie | video | social | irrelevant | unklar
Schreibt kategorie, kategorie_begruendung, kategorie_konfidenz zurück.

Voraussetzungen:
  pip install supabase anthropic

Umgebungsvariablen:
  SUPABASE_URL   = https://xxxx.supabase.co
  SUPABASE_KEY   = dein Service-Role-Key
  ANTHROPIC_KEY  = dein Anthropic API Key
"""

import os, time, json
from supabase import create_client
import anthropic

# ── Konfiguration ──────────────────────────────────────────────
SUPABASE_URL  = os.environ["SUPABASE_URL"]
SUPABASE_KEY  = os.environ["SUPABASE_KEY"]
ANTHROPIC_KEY = os.environ["ANTHROPIC_KEY"]

BATCH_SIZE      = 50    # Datensätze pro Claude-Aufruf
PAUSE_SEKUNDEN  = 1     # Pause zwischen Batches

# ── Clients ────────────────────────────────────────────────────
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
client   = anthropic.Anthropic(api_key=ANTHROPIC_KEY)

# ── System-Prompt für Claude ───────────────────────────────────
SYSTEM_PROMPT = """Du bist ein Klassifizierungs-Assistent für die Plattform KI-Coaching-Kompass.
Deine Aufgabe: Klassifiziere jeden Datensatz anhand von URL, Seitentitel und Textauszug.

Mögliche Kategorien:
- tool       → Software-Produkt, App, SaaS-Plattform, KI-Tool (hat Pricing, Login, Features)
- artikel    → Blogartikel, Fachbeitrag, Magazinartikel, Whitepaper, PDF-Dokument
- studie     → Wissenschaftliche Studie, RCT, Meta-Analyse, Forschungsbericht, Dissertation
- video      → YouTube, Vimeo, Webinar-Aufzeichnung
- social     → LinkedIn-Post, Twitter/X-Post, Reddit-Thread, Forum-Eintrag
- irrelevant → Nicht relevant für KI-Coaching (allgemeine News, E-Commerce, etc.)
- unklar     → Nicht eindeutig zuordenbar – zu wenig Information

Antworte NUR mit einem JSON-Array. Kein erklärender Text davor oder danach.
Format:
[
  {
    "id": "...",
    "kategorie": "tool",
    "begruendung": "SaaS-Plattform mit Pricing-Seite und Coach-Features",
    "konfidenz": "hoch"
  },
  ...
]
konfidenz ist immer: "hoch" | "mittel" | "niedrig"
"""

# ── Hilfsfunktion: Batch klassifizieren ───────────────────────
def klassifiziere_batch(rows: list) -> list:
    """Gibt Liste von {id, kategorie, begruendung, konfidenz} zurück."""

    eintraege = []
    for row in rows:
        url     = row.get("url_sauber") or row.get("url") or ""
        titel   = row.get("meta_title") or ""
        desc    = row.get("meta_description") or ""
        snippet = row.get("text_snippet") or ""
        eintraege.append(
            f'ID: {row["id"]}\n'
            f'URL: {url}\n'
            f'Titel: {titel}\n'
            f'Beschreibung: {desc[:200]}\n'
            f'Textauszug: {snippet[:300]}\n'
        )

    user_message = (
        "Klassifiziere die folgenden Einträge:\n\n"
        + "\n---\n".join(eintraege)
    )

    message = client.messages.create(
        model="claude-haiku-4-5-20251001",   # Haiku: schnell + günstig für Klassifizierung
        max_tokens=4000,
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content": user_message}],
    )

    raw = message.content[0].text.strip()

    # JSON-Fences entfernen falls vorhanden
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]

    return json.loads(raw)


# ── Hauptprogramm ─────────────────────────────────────────────
def main():
    # Nur Zeilen holen, die noch keine Kategorie haben
    response = (
        supabase.table("import_750")
        .select("id, url_sauber, url, meta_title, meta_description, text_snippet")
        .is_("kategorie", "null")
        .execute()
    )
    rows = response.data
    print(f"▶ {len(rows)} Datensätze zu klassifizieren.")

    # Statistik am Ende
    stats = {"tool": 0, "artikel": 0, "studie": 0,
             "video": 0, "social": 0, "irrelevant": 0, "unklar": 0}

    batches = [rows[i:i+BATCH_SIZE] for i in range(0, len(rows), BATCH_SIZE)]

    for batch_nr, batch in enumerate(batches, 1):
        print(f"\n── Batch {batch_nr}/{len(batches)} ({len(batch)} Einträge) ──")

        try:
            ergebnisse = klassifiziere_batch(batch)
        except json.JSONDecodeError as e:
            print(f"  ⚠ JSON-Fehler: {e} – Batch wird übersprungen.")
            time.sleep(PAUSE_SEKUNDEN)
            continue
        except Exception as e:
            print(f"  ⚠ API-Fehler: {e} – Batch wird übersprungen.")
            time.sleep(PAUSE_SEKUNDEN)
            continue

        for eintrag in ergebnisse:
            row_id    = eintrag.get("id")
            kategorie = eintrag.get("kategorie", "unklar")
            begruendung = eintrag.get("begruendung", "")
            konfidenz   = eintrag.get("konfidenz", "niedrig")

            supabase.table("import_750").update({
                "kategorie":              kategorie,
                "kategorie_begruendung":  begruendung,
                "kategorie_konfidenz":    konfidenz,
            }).eq("id", row_id).execute()

            stats[kategorie] = stats.get(kategorie, 0) + 1
            symbol = {"tool":"🔧","artikel":"📄","studie":"🔬",
                      "video":"🎥","social":"💬","irrelevant":"✗","unklar":"?"}.get(kategorie,"·")
            print(f"  {symbol} [{konfidenz[:1].upper()}] {kategorie:<12} {begruendung[:60]}")

        time.sleep(PAUSE_SEKUNDEN)

    # Abschlussbericht
    print("\n" + "="*50)
    print("✅ Klassifizierung abgeschlossen\n")
    print("Ergebnis:")
    for kat, anzahl in sorted(stats.items(), key=lambda x: -x[1]):
        balken = "█" * anzahl
        print(f"  {kat:<12} {anzahl:>4}  {balken}")
    print()
    unklar = stats.get("unklar", 0)
    if unklar > 0:
        print(f"⚠ {unklar} Einträge als 'unklar' markiert → bitte manuell prüfen.")
    print("\nNächster Schritt: schritt3_migration.py ausführen")

if __name__ == "__main__":
    main()
