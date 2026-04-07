const { createClient } = require('@sanity/client');

require('dotenv').config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_WRITE_TOKEN,
  apiVersion: '2024-03-01',
  useCdn: false,
});

async function migrate() {
  const doc = {
    _id: "beratung",
    _type: "beratung",
    heroEyebrow: "Beratung",
    heroTitel: "KI-Coaching-Software<br /><em>gezielt einsetzen.</em>",
    heroLead: "Der Markt für KI-Coaching-Tools wächst rasant — über 249 Lösungen, jede mit eigenen Stärken, Risiken und Anwendungsfällen. Ich helfe Unternehmen und Coaches, in diesem Markt die richtige Wahl zu treffen.",
    kontaktEmail: "bernd.wiese@googlemail.com",
    
    // UNTERNEHMEN
    unternehmenChallenge: "<strong>Die Ausgangssituation:</strong> Unternehmen erkennen, dass Coaching ein strategisches Werkzeug für Führungskräfteentwicklung, Mitarbeiterbindung und kulturellen Wandel ist. Doch der Markt ist unübersichtlich: Soll es eine All-in-One-Plattform sein, oder spezialisierte Tools? Wie lässt sich Qualität messen? Was kostet wirklich was — und was rechnet sich? Und wie stellt man DSGVO-Konformität sicher, wenn KI-Systeme sensible Gesprächsdaten verarbeiten?",
    unternehmenFacts: [
      { num: "249+", label: "KI-Coaching-Tools<br />im Markt", _key: "uf1" },
      { num: "9", label: "Funktionale<br />Kategorien", _key: "uf2" },
      { num: "∅ 3×", label: "Mehr Engagement<br />mit KI-Unterstützung", _key: "uf3" },
      { num: "ROI", label: "Messbar &<br />nachweisbar", _key: "uf4" }
    ],
    unternehmenLeistungenLabel: "Was ich biete",
    unternehmenLeistungenTitel: "Von der Analyse bis<br /><em>zum laufenden Betrieb</em>",
    unternehmenLeistungenBody: "Ich begleite Sie durch den gesamten Prozess der Einführung von KI-Coaching — von der ersten Bedarfsklärung bis zur nachhaltigen Verankerung in Ihrer Organisation.",
    unternehmenLeistungenListe: [
      { icon: "🔍", title: "Bedarfsanalyse", body: "Was wollen Sie mit Coaching wirklich erreichen? Wir klären Zielgruppen, Anwendungsfälle, Skalierungserwartungen und kulturelle Voraussetzungen — bevor wir auch nur ein Tool in Betracht ziehen.", _key: "ul1" },
      { icon: "🧭", title: "Tool-Auswahl & Bewertung", body: "Auf Basis Ihres Bedarfs erstelle ich eine strukturierte Shortlist aus dem Markt: von Praxis-Management-Software über KI-Coaching-Plattformen bis hin zu spezialisierten Assessment- und Analytics-Tools.", _key: "ul2" },
      { icon: "🛡", title: "DSGVO & Compliance", body: "Sensible Coaching-Gespräche dürfen nicht in unsichere Systeme fließen. Ich prüfe Datenverarbeitung, Serverstandorte, Verschlüsselung und Auftragsverarbeitungsverträge — bevor der Vertrag unterschrieben wird.", _key: "ul3" },
      { icon: "🚀", title: "Pilotierung & Rollout", body: "Kleine Piloten mit echten Nutzern — bevor das Budget freigegeben wird. Ich begleite Pilot-Setup, Evaluierung und die strukturierte Ausweitung auf die gesamte Organisation.", _key: "ul4" },
      { icon: "📊", title: "ROI-Messung", body: "Coaching-Investitionen müssen sich rechtfertigen lassen. Ich helfe Ihnen, aussagekräftige KPIs zu definieren, Coaching-Daten auszuwerten und den Mehrwert intern sichtbar zu machen.", _key: "ul5" },
      { icon: "🤝", title: "Coach-Pool & Qualität", body: "Welche Coaches passen zu welchen Tools und Zielgruppen? Ich unterstütze beim Aufbau oder der Qualifizierung interner und externer Coach-Pools — einschließlich KI-Kompetenz als Kriterium.", _key: "ul6" }
    ],
    unternehmenProzessLabel: "Vorgehen",
    unternehmenProzessTitel: "Vier Phasen zum<br /><em>laufenden System</em>",
    unternehmenProzessListe: [
      { number: "01", title: "Analyse", body: "Ziele, Zielgruppen, Volumina, bestehende HR-Systeme und kulturelle Rahmenbedingungen werden erfasst. Ergebnis: ein klares Anforderungsprofil.", _key: "up1" },
      { number: "02", title: "Marktcheck", body: "Systematische Bewertung relevanter Tools aus einer Datenbank von 249+ Lösungen — nach Funktion, Skalierbarkeit, Preis und DSGVO-Status.", _key: "up2" },
      { number: "03", title: "Pilot", body: "3–6 Wochen Praxistest mit ausgewählter Gruppe. Messung, Feedback, Optimierung. Erst dann folgt die Entscheidung über den Rollout.", _key: "up3" },
      { number: "04", title: "Rollout", body: "Skalierte Einführung mit begleitenden Trainings, Change-Kommunikation und definierten Erfolgskennzahlen für die Dauerbeobachtung.", _key: "up4" }
    ],
    unternehmenToolsLabel: "Tool-Landschaft",
    unternehmenToolsTitel: "Relevante Plattformen<br /><em>für Unternehmen</em>",
    unternehmenToolsBody: "Je nach Anforderung kommen grundlegend verschiedene Tool-Kategorien infrage. Hier ein Überblick über die relevantesten Lösungsfelder aus der analysierten Marktdatenbank:",
    unternehmenToolsListe: [
      { title: "Skalierbare KI-Coaching-Plattformen", tools: "<strong>Retorio, AIcoach.chat, Sherlock AI, BetterUp</strong> — KI-gestützte Coaching-Erfahrungen für große Mitarbeitergruppen, oft mit Rollenspiel-Simulationen und automatisiertem Feedback.", _key: "ut1" },
      { title: "Corporate Learning & L&D", tools: "<strong>Sharpist, Optify, Torch, CoachHub, Excelia</strong> — Plattformen für strukturierte Führungskräfteentwicklung mit kombinierten Human-Coach- und KI-Angeboten.", _key: "ut2" },
      { title: "Analytics & ROI-Messung", tools: "<strong>Hoolr, Cloverleaf, Flowit</strong> — Tools zur Auswertung von Coaching-Daten, Benchmarking und Nachweis messbarer Wirksamkeit gegenüber dem Management.", _key: "ut3" },
      { title: "Self-Coaching für alle Mitarbeiter", tools: "<strong>Evoach, Bestselfy, Symbolon, Mindsera</strong> — Skalierbare Selbstcoaching-Angebote, die Coaching ohne menschlichen Coach zugänglich machen.", _key: "ut4" }
    ],
    unternehmenCtaTitel: "Bereit für den ersten Schritt<br /><em>in Ihrer Organisation?</em>",
    unternehmenCtaBody: "Ein unverbindliches Erstgespräch klärt, ob und wie KI-Coaching zu Ihrem Unternehmen passt. Ohne Tool-Bias, ohne Verkaufsdruck.",
    unternehmenCtaButton: "Erstgespräch anfragen",
    
    // COACHES
    coachesChallenge: "<strong>Die Ausgangssituation:</strong> KI verändert die Coaching-Praxis grundlegend — schneller als die meisten Coaches verarbeiten können. Welches Tool übernimmt administrative Aufgaben, welches unterstützt im Prozess, welches dokumentiert DSGVO-konform? Und wie bleibe ich als Coach authentisch, wenn KI zunehmend Aufgaben übernimmt, die bisher meine Stärke waren?",
    coachesFacts: [
      { num: "249+", label: "Tools im Markt —<br />analysiert", _key: "cf1" },
      { num: "7", label: "Funktionale<br />Tool-Kategorien", _key: "cf2" },
      { num: "ICF", label: "Kompatibel &<br />geprüft", _key: "cf3" },
      { num: "DSGVO", label: "Immer ein<br />Kriterium", _key: "cf4" }
    ],
    coachesLeistungenLabel: "Was ich biete",
    coachesLeistungenTitel: "Orientierung im<br /><em>KI-Tool-Dschungel</em>",
    coachesLeistungenBody: "Ich begleite Coaches dabei, KI-Tools sinnvoll, sicher und qualitätsbewusst in ihre Praxis zu integrieren — von der ersten Orientierung bis zur vollständigen Einbindung in den eigenen Prozess.",
    coachesLeistungenListe: [
      { icon: "🗺", title: "Tool-Orientierung", body: "Welche Tools gibt es, und welche passen zu meiner Praxis? Ich liefere einen strukturierten Überblick nach Anwendungsfall — ohne Werbung, ohne Affiliate-Interessen.", _key: "cl1" },
      { icon: "🎯", title: "Bedarfsklärung", body: "Wo verlieren Sie heute Zeit? Wo würden Sie sich Unterstützung wünschen? Auf Basis Ihrer konkreten Situation erstelle ich eine personalisierte Tool-Shortlist.", _key: "cl2" },
      { icon: "🔬", title: "Hands-on Testing", body: "Ich teste Tools mit Ihnen gemeinsam — live, an realen Anwendungsfällen. Kein Lesen von Testberichten, sondern direktes Ausprobieren in der eigenen Praxissituation.", _key: "cl3" },
      { icon: "⚖️", title: "DSGVO & ICF-Check", body: "KI-Transkription, Cloud-Speicherung, KI-Analyse von Sitzungsinhalten — ich prüfe, was ethisch und rechtlich vertretbar ist, und was Ihre Zertifizierung gefährden könnte.", _key: "cl4" },
      { icon: "🔧", title: "Implementierung", body: "Einrichtung, Konfiguration, Workflows — ich begleite die technische Integration in Ihre bestehende Praxis, bis alles reibungslos läuft.", _key: "cl5" },
      { icon: "🌱", title: "Kontinuierliche Begleitung", body: "Der Markt entwickelt sich schnell. Auf Wunsch bleibe ich als laufender Sparringspartner, der neue Tools beobachtet und bewertet, bevor Sie Zeit damit verlieren.", _key: "cl6" }
    ],
    coachesProzessLabel: "Vorgehen",
    coachesProzessTitel: "Von der Verwirrung zur<br /><em>klaren Entscheidung</em>",
    coachesProzessListe: [
      { number: "01", title: "Situationscheck", body: "Wo stehen Sie heute? Was kostet Ihnen aktuell die meiste Zeit? Wo wünschen Sie sich Entlastung oder Qualitätsgewinn?", _key: "cp1" },
      { number: "02", title: "Tool-Shortlist", body: "Auf Basis Ihrer Situation wähle ich 3–5 konkrete Tools aus, die für Ihren Anwendungsfall wirklich relevant sind.", _key: "cp2" },
      { number: "03", title: "Live-Test", body: "Gemeinsames Ausprobieren, Bewertung nach Praxis-tauglichkeit, Datenschutz, Kosten und Einlernaufwand.", _key: "cp3" },
      { number: "04", title: "Integration", body: "Das ausgewählte Tool wird vollständig in Ihren Praxis-Workflow eingebettet — mit klaren Prozessen und Grenzen für die KI-Nutzung.", _key: "cp4" }
    ],
    coachesToolsLabel: "Die Tool-Landschaft für Coaches",
    coachesToolsTitel: "Was es gibt —<br /><em>und wofür es taugt</em>",
    coachesToolsBody: "Der Markt lässt sich in sieben funktionale Kategorien einteilen. Jede hat unterschiedliche Reifegrade, Preismodelle und ethische Implikationen:",
    coachesToolsListe: [
      { title: "Praxis-Management", tools: "<strong>CoachAccountable, Simply.Coach, CoachVantage, Delenta, Paperbell</strong> — Terminplanung, Klientenmanagement, Aufgaben und Abrechnungen in einem System. Die Basis für eine effiziente Praxis.", _key: "ct1" },
      { title: "Gesprächsanalyse & Transkription", tools: "<strong>Gerty.health, Fireflies.ai, Fathom</strong> — Automatische Mitschriften, ICF-orientiertes Feedback auf Ihre Gesprächsführung, strukturierte Sitzungszusammenfassungen.", _key: "ct2" },
      { title: "Online-Coaching-Umgebung", tools: "<strong>CoachingSpace, LINC Coaching Board, CAI World</strong> — Digitale Whiteboards, DSGVO-konforme Videokonferenz und interaktive Methoden für Online-Sitzungen in einer Umgebung.", _key: "ct3" },
      { title: "KI als Co-Coach", tools: "<strong>Evoach, CoachBot, BeCoach</strong> — KI übernimmt strukturierte Coaching-Sequenzen zwischen den Sitzungen. Klienten reflektieren eigenständig, Sie sehen die Ergebnisse.", _key: "ct4" },
      { title: "KI-Avatar des Coaches", tools: "<strong>CoachVox, CoachClone</strong> — Eine KI-Version von Ihnen selbst, trainiert auf Ihre Methode und Sprache. Für Lead-Generierung, Community und skalierbare Erstbegleitung.", _key: "ct5" },
      { title: "Assessment & Diagnostik", tools: "<strong>Coachmetrix, Flowit, Hedy AI</strong> — 360°-Feedback, Zielmessung und Fortschrittstracking für strukturierte Coaching-Prozesse mit nachweisbarer Wirksamkeit.", _key: "ct6" }
    ],
    coachesCtaTitel: "Starten Sie mit einem<br /><em>Orientierungsgespräch</em>",
    coachesCtaBody: "60 Minuten, in denen wir Ihre aktuelle Praxis anschauen und klären, welche KI-Tools für Sie wirklich sinnvoll sind — und welche nicht.",
    coachesCtaButton: "Orientierungsgespräch buchen"
  };

  try {
    const res = await client.createOrReplace(doc);
    console.log("Migration erfolgreich:", res._id);
  } catch (err) {
    console.error("Migration fehlgeschlagen:", err.message);
  }
}

migrate();
