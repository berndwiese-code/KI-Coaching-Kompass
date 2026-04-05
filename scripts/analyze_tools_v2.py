"""
Verbesserte Analyse der tools_pages Tabelle.
Gruppiert nach tool_id, filtert Noise heraus, nutzt die tools-Tabelle für Metadaten.

Ausführen: python scripts/analyze_tools_v2.py
Output:    scripts/tools_analysis_v2.txt
"""

import os, json, re
from collections import defaultdict
from supabase import create_client

URL = "YOUR_SUPABASE_URL"
KEY = "YOUR_SUPABASE_KEY"

supabase = create_client(URL, KEY)

# ── 1. Alle verfügbaren Tabellen / Spalten der tools-Tabelle erkunden ──────────
print("=== Erkunde Datenbankstruktur ===")

# Welche Tabellen gibt es? (Versuch mit bekannten Namen)
for table_name in ["tools", "tool", "ki_tools", "coaching_tools", "products"]:
    try:
        r = supabase.table(table_name).select("*").limit(2).execute()
        if r.data:
            print(f"\n✅ Tabelle '{table_name}' gefunden!")
            print(f"   Spalten: {list(r.data[0].keys())}")
            print(f"   Beispiel: {json.dumps(r.data[0], ensure_ascii=False)[:400]}")
    except Exception as e:
        print(f"   '{table_name}': nicht gefunden oder kein Zugriff")

# ── 2. tools_pages vollständig laden ──────────────────────────────────────────
print("\n=== Lade tools_pages ===")

# Noise-Filter: Seiten die wir ignorieren
NOISE_PATTERNS = [
    r'/privacy', r'/datenschutz', r'/terms', r'/tos', r'/impressum',
    r'/agb', r'/legal', r'/cookie', r'/affiliate', r'/api', r'llms\.txt',
    r'/imprint', r'/contact', r'/about-us', r'/karriere', r'/jobs',
]

def is_noise(url: str, titel: str) -> bool:
    url_lower = (url or "").lower()
    for pattern in NOISE_PATTERNS:
        if re.search(pattern, url_lower):
            return True
    return False

all_pages = []
offset = 0
batch_size = 1000
while True:
    r = supabase.table("tools_pages").select(
        "id,tool_id,url,titel,beschreibung,volltext"
    ).range(offset, offset + batch_size - 1).execute()
    if not r.data:
        break
    all_pages.extend(r.data)
    print(f"  Geladen: {len(all_pages)}")
    if len(r.data) < batch_size:
        break
    offset += batch_size

print(f"Gesamt: {len(all_pages)} Seiten")

# Noise rausfiltern
clean_pages = [p for p in all_pages if not is_noise(p.get("url",""), p.get("titel",""))]
print(f"Nach Noise-Filter: {len(clean_pages)} relevante Seiten")

# ── 3. Nach tool_id gruppieren ────────────────────────────────────────────────
print("\n=== Gruppiere nach tool_id ===")

by_tool = defaultdict(list)
for page in clean_pages:
    tid = page.get("tool_id") or "unbekannt"
    by_tool[tid].append(page)

print(f"Eindeutige Tools: {len(by_tool)}")

# ── 4. Pro Tool: besten Text extrahieren ──────────────────────────────────────
def best_excerpt(pages, max_chars=1200):
    """Nimmt die Hauptseite oder den längsten Text eines Tools."""
    # Hauptseite bevorzugen (kürzeste URL ohne viele Slashes)
    sorted_pages = sorted(pages, key=lambda p: len((p.get("url") or "").split("/")))
    for page in sorted_pages:
        vt = page.get("volltext") or page.get("beschreibung") or ""
        if len(vt) > 200:
            # Bereinigen
            text = re.sub(r'\s+', ' ', vt).strip()
            return text[:max_chars]
    return ""

def tool_name(pages):
    """Versucht den Tool-Namen aus Titel oder URL zu extrahieren."""
    for page in pages:
        t = page.get("titel") or ""
        if t and len(t) > 3 and len(t) < 100:
            # Nehme den ersten Teil vor Trennzeichen
            name = re.split(r'[|\-–—·•]', t)[0].strip()
            if name:
                return name
    # Fallback: Domain aus URL
    url = pages[0].get("url") or ""
    m = re.search(r'https?://(?:www\.)?([^/]+)', url)
    return m.group(1) if m else url[:60]

def main_url(pages):
    sorted_pages = sorted(pages, key=lambda p: len((p.get("url") or "").split("/")))
    return sorted_pages[0].get("url", "") if sorted_pages else ""

# Coaching-Relevanz Score
COACH_KW = [
    "coach", "coaching", "coachee", "klient", "klientin", "session", "sitzung",
    "einzelcoaching", "gruppencoaching", "supervision", "mentor",
    "zielsetzung", "reflexion", "fortschritt", "protokoll", "transskript",
    "feedback", "buchung", "terminplanung", "ki", "ai", "künstliche intelligenz",
]

def relevance_score(text):
    t = text.lower()
    return sum(t.count(kw) for kw in COACH_KW)

# ── 5. Tool-Steckbriefe erstellen ─────────────────────────────────────────────
print("\n=== Erstelle Tool-Steckbriefe ===")

tool_profiles = []
for tool_id, pages in by_tool.items():
    name = tool_name(pages)
    url = main_url(pages)
    excerpt = best_excerpt(pages, max_chars=1000)
    score = relevance_score(excerpt)

    tool_profiles.append({
        "tool_id": tool_id,
        "name": name,
        "url": url,
        "seiten_anzahl": len(pages),
        "coach_relevanz": score,
        "excerpt": excerpt,
    })

# Nach Relevanz sortieren
tool_profiles.sort(key=lambda x: x["coach_relevanz"], reverse=True)

print(f"Tool-Steckbriefe erstellt: {len(tool_profiles)}")

# ── 6. Thematische Cluster erkennen ───────────────────────────────────────────
CLUSTER_KW = {
    "KI-Coaching-Plattformen": ["ai coach", "ki coach", "ai coaching platform", "ki-coaching", "artificial intelligence coach"],
    "Coaching-Software (Praxis-Management)": ["coaching software", "coaching platform", "client management", "session notes", "coachaccountable", "simply.coach", "coachvantage"],
    "Transkription & Gesprächsanalyse": ["transcript", "transcription", "conversation intelligence", "call recording", "protokoll", "aufzeichnung"],
    "Video & Remote Coaching": ["video coaching", "online coaching", "zoom", "virtual coaching", "telecoaching", "remote coaching"],
    "Assessment & Diagnostik": ["assessment", "360", "fragebogen", "psychometric", "survey", "test", "evaluation"],
    "Terminplanung & CRM": ["scheduling", "booking", "calendar", "crm", "client portal"],
    "ICF & Zertifizierung": ["icf", "acc", "pcc", "mcc", "certification", "akkreditierung", "zertifikat"],
    "KI-Avatar / KI-Version des Coaches": ["ai version", "ki version", "coachvox", "coachclone", "digital twin", "ai clone"],
    "Corporate Learning & L&D": ["lms", "learning management", "corporate training", "l&d", "leadership development", "upskilling"],
    "Mental Health & Wellbeing": ["mental health", "wellbeing", "burnout", "stress", "mindfulness", "resilience"],
}

def detect_cluster(text):
    text_lower = text.lower()
    best_cluster = "Sonstiges"
    best_score = 0
    for cluster, keywords in CLUSTER_KW.items():
        score = sum(text_lower.count(kw) for kw in keywords)
        if score > best_score:
            best_score = score
            best_cluster = cluster
    return best_cluster

for tp in tool_profiles:
    tp["cluster"] = detect_cluster(tp["excerpt"])

# ── 7. Output schreiben ────────────────────────────────────────────────────────
out_path = os.path.join(os.path.dirname(__file__), "tools_analysis_v2.txt")

with open(out_path, "w", encoding="utf-8") as f:
    f.write("KI-COACHING-KOMPASS · TIEFENANALYSE DER TOOL-DATENBANK\n")
    f.write("=" * 65 + "\n")
    f.write(f"Analysierte Seiten gesamt: {len(all_pages)}\n")
    f.write(f"Nach Noise-Filter: {len(clean_pages)} relevante Seiten\n")
    f.write(f"Eindeutige Tools: {len(tool_profiles)}\n\n")

    # Cluster-Übersicht
    cluster_counts = defaultdict(list)
    for tp in tool_profiles:
        cluster_counts[tp["cluster"]].append(tp["name"])

    f.write("THEMATISCHE CLUSTER\n")
    f.write("-" * 40 + "\n")
    for cluster, names in sorted(cluster_counts.items(), key=lambda x: -len(x[1])):
        f.write(f"\n  {cluster} ({len(names)} Tools):\n")
        for n in names[:12]:
            f.write(f"    · {n}\n")

    # Top 60 Tools mit vollem Steckbrief
    f.write("\n\nTOP 60 TOOLS NACH COACHING-RELEVANZ (mit Beschreibung)\n")
    f.write("=" * 65 + "\n")

    for i, tp in enumerate(tool_profiles[:60], 1):
        f.write(f"\n{'─'*60}\n")
        f.write(f"{i}. {tp['name']}\n")
        f.write(f"   URL:     {tp['url']}\n")
        f.write(f"   Cluster: {tp['cluster']} | Relevanz: {tp['coach_relevanz']} | Seiten: {tp['seiten_anzahl']}\n")
        f.write(f"\n   {tp['excerpt'][:700]}\n")

    # Weitere 60-120 kürzer
    f.write("\n\nWEITERE TOOLS (Rang 61–120, Kurzprofile)\n")
    f.write("=" * 65 + "\n")
    for i, tp in enumerate(tool_profiles[60:120], 61):
        f.write(f"\n{i}. {tp['name']} [{tp['cluster']}]\n")
        f.write(f"   {tp['url']}\n")
        if tp["excerpt"]:
            f.write(f"   {tp['excerpt'][:250]}\n")

print(f"\n✅ Analyse gespeichert: {out_path}")
print("Bitte tools_analysis_v2.txt in den Chat hochladen.")
