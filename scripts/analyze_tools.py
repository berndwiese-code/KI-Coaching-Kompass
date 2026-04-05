"""
Analysiert die tools_pages Tabelle in Supabase und erstellt eine strukturierte
Zusammenfassung für die Erstellung der Beratungsseite.

Ausführen: python scripts/analyze_tools.py
Output: scripts/tools_summary.json + scripts/tools_summary.txt
"""

import os, json, re
from collections import Counter, defaultdict
from supabase import create_client

# Credentials aus .env.local
URL = "YOUR_SUPABASE_URL"
KEY = "YOUR_SUPABASE_KEY"

supabase = create_client(URL, KEY)

print("Lade Daten aus Supabase...")

# Alle Zeilen laden (in Batches wegen Supabase-Limit)
all_rows = []
batch_size = 1000
offset = 0
while True:
    result = supabase.table("tools_pages").select("*").range(offset, offset + batch_size - 1).execute()
    batch = result.data
    if not batch:
        break
    all_rows.extend(batch)
    print(f"  Geladen: {len(all_rows)} Zeilen...")
    if len(batch) < batch_size:
        break
    offset += batch_size

print(f"Gesamt: {len(all_rows)} Zeilen geladen.\n")

# Spaltenübersicht
if all_rows:
    print("Verfügbare Spalten:", list(all_rows[0].keys()))

# ─── Analyse ───────────────────────────────────────────────────────────────────

# Schlüsselbegriffe für Coaches
coach_keywords = [
    "coach", "coaching", "coachee", "supervision", "mentor", "begleitung",
    "sitzung", "session", "klient", "klientin", "einzelcoaching", "gruppencoaching",
    "einzel", "gruppe", "team", "leadership", "führung", "karriere",
    "reflexion", "zielsetzung", "ziele", "fortschritt", "protokoll", "notizen",
    "transskript", "aufzeichnung", "feedback", "auswertung", "bericht",
    "buchung", "terminplanung", "kalender", "video", "online", "remote",
    "ki", "ai", "künstliche intelligenz", "chatbot", "automatisierung",
    "ergebnis", "outcome", "wirksamkeit", "evaluation"
]

# Schlüsselbegriffe für Unternehmenseinführung
company_keywords = [
    "unternehmen", "organisation", "firma", "betrieb", "corporate", "enterprise",
    "hr", "personal", "mitarbeiter", "führungskraft", "manager", "team",
    "einführung", "implementierung", "rollout", "skalierung", "lizenz",
    "integration", "plattform", "sso", "api", "datenschutz", "compliance",
    "dsgvo", "gdpr", "sicherheit", "zertifizierung", "roi", "budget",
    "strategie", "transformation", "kulturwandel", "change"
]

def score_text(text, keywords):
    """Gibt einen Score zurück basierend auf Keyword-Häufigkeit."""
    if not text:
        return 0
    text_lower = text.lower()
    return sum(text_lower.count(kw) for kw in keywords)

def extract_price_info(text):
    """Extrahiert Preisinformationen aus dem Text."""
    if not text:
        return None
    patterns = [
        r'\$[\d,]+(?:\.\d+)?(?:/(?:mo|month|yr|year|user))?',
        r'€[\d,]+(?:\.\d+)?(?:/(?:mo|monat|jahr))?',
        r'free(?:mium)?',
        r'kostenlos',
        r'open.?source',
        r'auf anfrage',
        r'custom pricing',
        r'ab \$[\d,]+',
        r'ab €[\d,]+',
    ]
    found = []
    for p in patterns:
        matches = re.findall(p, text[:2000], re.IGNORECASE)
        found.extend(matches[:2])
    return list(set(found))[:5] if found else None

def extract_features(text, max_chars=800):
    """Extrahiert die wichtigsten Feature-Aussagen."""
    if not text:
        return ""
    # Erste 800 Zeichen sind meist die Kernaussage
    excerpt = text[:max_chars].replace('\n', ' ').strip()
    # Mehrfache Leerzeichen bereinigen
    excerpt = re.sub(r'\s+', ' ', excerpt)
    return excerpt

# Kategorien sammeln
categories = Counter()
for row in all_rows:
    cat = row.get("kategorie") or row.get("category") or row.get("typ") or row.get("type") or "Unbekannt"
    categories[cat] += 1

print("\nTop-Kategorien:")
for cat, count in categories.most_common(20):
    print(f"  {cat}: {count}")

# Tools nach Coach-Relevanz bewerten
print("\nAnalysiere Tools...")
tools_analyzed = []
for row in all_rows:
    volltext = row.get("volltext") or ""
    name = (row.get("name") or row.get("tool_name") or row.get("titel") or
            row.get("title") or row.get("url") or "Unbekannt")
    kategorie = (row.get("kategorie") or row.get("category") or
                 row.get("typ") or row.get("type") or "")

    coach_score = score_text(volltext, coach_keywords)
    company_score = score_text(volltext, company_keywords)
    preise = extract_price_info(volltext)
    excerpt = extract_features(volltext)

    tools_analyzed.append({
        "name": str(name)[:100],
        "kategorie": str(kategorie)[:60],
        "coach_score": coach_score,
        "company_score": company_score,
        "preise": preise,
        "excerpt": excerpt,
        "url": str(row.get("url") or row.get("link") or "")[:200],
    })

# Nach Coach-Relevanz sortieren
tools_analyzed.sort(key=lambda x: x["coach_score"], reverse=True)

# ─── Top-Tools für Coaches ────────────────────────────────────────────────────
top_coach_tools = tools_analyzed[:80]

# ─── Kategorien-Übersicht für Coaches ─────────────────────────────────────────
coach_categories = defaultdict(list)
for tool in top_coach_tools:
    coach_categories[tool["kategorie"] or "Sonstiges"].append(tool["name"])

# ─── Themen-Analyse: Was beschäftigt Coaches? ────────────────────────────────
all_volltext = " ".join([r.get("volltext") or "" for r in all_rows[:500]])
# Häufige Coaching-Themen finden
themen_keywords = {
    "Transkription & Protokoll": ["transcript", "transcription", "protokoll", "aufzeichnung", "notizen", "notes"],
    "Terminplanung & Buchung": ["booking", "scheduling", "kalender", "calendar", "buchung", "terminplan"],
    "Video & Remote Coaching": ["video", "zoom", "online", "remote", "virtuell", "telecoaching"],
    "KI-Gesprächsanalyse": ["sentiment", "emotion", "analyse", "analysis", "insight", "pattern"],
    "Klienten-Management": ["crm", "client management", "klienten", "portfolio", "progress tracking"],
    "Dokumentation & Berichte": ["report", "bericht", "documentation", "template", "vorlage"],
    "Fragebogen & Assessment": ["assessment", "fragebogen", "survey", "test", "evaluation", "360"],
    "Ressourcen & Übungen": ["exercise", "übung", "ressource", "tool", "methode", "intervention"],
    "Preisgestaltung & Business": ["pricing", "invoice", "rechnung", "business", "revenue", "subscription"],
    "Zertifizierung & Ausbildung": ["certification", "training", "ausbildung", "icf", "weiterbildung"],
}

themen_scores = {}
sample_text = all_volltext.lower()
for thema, kws in themen_keywords.items():
    score = sum(sample_text.count(kw) for kw in kws)
    themen_scores[thema] = score

themen_scores = dict(sorted(themen_scores.items(), key=lambda x: x[1], reverse=True))

# ─── Output strukturieren ─────────────────────────────────────────────────────
summary = {
    "gesamt_tools": len(all_rows),
    "kategorien": dict(categories.most_common(25)),
    "themen_coaching_markt": themen_scores,
    "top_tools_fuer_coaches": [
        {
            "name": t["name"],
            "kategorie": t["kategorie"],
            "coach_relevanz": t["coach_score"],
            "preise": t["preise"],
            "beschreibung": t["excerpt"][:400],
            "url": t["url"],
        }
        for t in top_coach_tools[:50]
    ],
    "kategorien_nach_coach_relevanz": {
        kat: tools[:8] for kat, tools in sorted(
            coach_categories.items(),
            key=lambda x: len(x[1]),
            reverse=True
        )
    },
}

# JSON speichern
out_json = os.path.join(os.path.dirname(__file__), "tools_summary.json")
with open(out_json, "w", encoding="utf-8") as f:
    json.dump(summary, f, ensure_ascii=False, indent=2)
print(f"\n✅ JSON gespeichert: {out_json}")

# Lesbares Text-Summary erstellen
out_txt = os.path.join(os.path.dirname(__file__), "tools_summary.txt")
with open(out_txt, "w", encoding="utf-8") as f:
    f.write(f"KI-COACHING-KOMPASS · TOOLS-ANALYSE\n")
    f.write(f"{'='*60}\n")
    f.write(f"Gesamt analysierte Tools: {len(all_rows)}\n\n")

    f.write("THEMEN-RELEVANZ IM COACHING-MARKT\n")
    f.write("-"*40 + "\n")
    for thema, score in themen_scores.items():
        f.write(f"  {thema}: {score} Erwähnungen\n")

    f.write("\n\nTOP 50 TOOLS NACH COACH-RELEVANZ\n")
    f.write("-"*40 + "\n")
    for i, t in enumerate(summary["top_tools_fuer_coaches"], 1):
        f.write(f"\n{i}. {t['name']} [{t['kategorie']}] (Score: {t['coach_relevanz']})\n")
        if t["preise"]:
            f.write(f"   Preis: {', '.join(t['preise'])}\n")
        if t["beschreibung"]:
            f.write(f"   {t['beschreibung'][:300]}\n")

    f.write("\n\nKATEGORIEN-ÜBERSICHT (nach Relevanz)\n")
    f.write("-"*40 + "\n")
    for kat, tools in summary["kategorien_nach_coach_relevanz"].items():
        f.write(f"\n  {kat}:\n")
        for tool in tools:
            f.write(f"    - {tool}\n")

print(f"✅ Text-Summary gespeichert: {out_txt}")
print("\nFertig! Bitte beide Dateien (tools_summary.json + tools_summary.txt)")
print("in den Chat hochladen oder den Inhalt von tools_summary.txt einfügen.")
