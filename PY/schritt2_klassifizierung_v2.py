"""
Schritt 2 (v2): Claude Klassifizierung
- Kleinere Batches (10 statt 50)
- Höhere max_tokens (8000)
- URL-only Fallback wenn kein Titel vorhanden
- Robustere JSON-Fehlerbehandlung

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

BATCH_SIZE     = 10   # Klein für zuverlässiges JSON
PAUSE_SEKUNDEN = 1

# ── Clients ────────────────────────────────────────────────────
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
client   = anthropic.Anthropic(api_key=ANTHROPIC_KEY)

# ── System-Prompt ──────────────────────────────────────────────
SYSTEM_PROMPT = """Du bist ein Klassifizierungs-Assistent für KI-Coaching-Kompass.
Klassifiziere jeden Eintrag anhand von URL, Titel und Textauszug.

Kategorien:
- tool       → Software, App, SaaS, KI-Tool (hat Pricing, Login, Features)
- artikel    → Blogartikel, Fachbeitrag, Magazinartikel, Whitepaper, PDF
- studie     → Wissenschaftliche Studie, RCT, Meta-Analyse, Forschungsbericht
- video      → YouTube, Vimeo, Webinar-Aufzeichnung
- social     → LinkedIn-Post, Twitter/X, Reddit, Forum
- irrelevant → Nicht relevant für KI-Coaching
- unklar     → Zu wenig Information zur Einordnung

WICHTIG: Antworte NUR mit einem JSON-Array. Kein Text davor oder danach.
Keine Markdown-Formatierung. Kein ```json```. Nur das reine Array.

Format:
[{"id":"...","kategorie":"tool","begruendung":"kurze Begründung","konfidenz":"hoch"},...]

konfidenz: "hoch" | "mittel" | "niedrig"
Begruendung: maximal 10 Wörter, keine Sonderzeichen oder Anführungszeichen im Text."""

# ── Batch klassifizieren ───────────────────────────────────────
def klassifiziere_batch(rows: list) -> list:
    eintraege = []
    for row in rows:
        url     = (row.get("url_sauber") or row.get("url") or "")[:100]
        titel   = (row.get("meta_title") or "")[:80]
        snippet = (row.get("text_snippet") or "")[:150]
        eintraege.append(f'ID:{row["id"]} URL:{url} Titel:{titel} Text:{snippet}')

    user_message = "Klassifiziere:\n\n" + "\n---\n".join(eintraege)

    message = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=8000,
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content": user_message}],
    )

    raw = message.content[0].text.strip()

    # Alle möglichen Wrapper entfernen
    if "```" in raw:
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
    raw = raw.strip()

    return json.loads(raw)


# ── Einzelnen Eintrag klassifizieren (Fallback) ────────────────
def klassifiziere_einzeln(row: dict) -> dict:
    """Fallback: einen einzelnen Eintrag klassifizieren."""
    url   = (row.get("url_sauber") or row.get("url") or "")[:100]
    titel = (row.get("meta_title") or "")[:80]

    message = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=200,
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content":
            f"Klassifiziere:\n\nID:{row['id']} URL:{url} Titel:{titel}"}],
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
    response = (
        supabase.table("import_750")
        .select("id, url_sauber, url, meta_title, meta_description, text_snippet")
        .is_("kategorie", "null")
        .execute()
    )
    rows = response.data
    print(f"▶ {len(rows)} Datensätze zu klassifizieren.")

    stats = {"tool":0,"artikel":0,"studie":0,"video":0,
             "social":0,"irrelevant":0,"unklar":0}

    batches = [rows[i:i+BATCH_SIZE] for i in range(0, len(rows), BATCH_SIZE)]

    for batch_nr, batch in enumerate(batches, 1):
        print(f"\n── Batch {batch_nr}/{len(batches)} ({len(batch)} Einträge) ──")

        ergebnisse = []
        try:
            ergebnisse = klassifiziere_batch(batch)
        except json.JSONDecodeError as e:
            print(f"  ⚠ JSON-Fehler im Batch: {e}")
            print(f"  → Versuche Einträge einzeln...")
            for row in batch:
                try:
                    e = klassifiziere_einzeln(row)
                    ergebnisse.append(e)
                    time.sleep(0.3)
                except Exception as ex:
                    print(f"  ✗ Einzelfehler {row.get('url_sauber','')[:40]}: {ex}")
                    ergebnisse.append({
                        "id": row["id"],
                        "kategorie": "unklar",
                        "begruendung": "Klassifizierung fehlgeschlagen",
                        "konfidenz": "niedrig"
                    })
        except Exception as e:
            print(f"  ⚠ API-Fehler: {e} – überspringe Batch.")
            time.sleep(PAUSE_SEKUNDEN)
            continue

        for eintrag in ergebnisse:
            row_id      = eintrag.get("id")
            kategorie   = eintrag.get("kategorie", "unklar")
            begruendung = eintrag.get("begruendung", "")
            konfidenz   = eintrag.get("konfidenz", "niedrig")

            supabase.table("import_750").update({
                "kategorie":             kategorie,
                "kategorie_begruendung": begruendung,
                "kategorie_konfidenz":   konfidenz,
            }).eq("id", row_id).execute()

            stats[kategorie] = stats.get(kategorie, 0) + 1
            symbol = {"tool":"🔧","artikel":"📄","studie":"🔬","video":"🎥",
                      "social":"💬","irrelevant":"✗","unklar":"?"}.get(kategorie,"·")
            k = konfidenz[:1].upper() if konfidenz else "?"
            print(f"  {symbol} [{k}] {kategorie:<12} {begruendung[:55]}")

        time.sleep(PAUSE_SEKUNDEN)

    print(f"\n{'='*55}")
    print("✅ Klassifizierung abgeschlossen\n")
    for kat, anzahl in sorted(stats.items(), key=lambda x: -x[1]):
        print(f"  {kat:<12} {anzahl:>4}  {'█' * min(anzahl, 40)}")
    print("\nNächster Schritt: schritt3_migration.py")

if __name__ == "__main__":
    main()
