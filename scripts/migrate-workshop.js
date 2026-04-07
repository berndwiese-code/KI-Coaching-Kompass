const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });
const fs = require('fs');

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  apiVersion: '2023-05-03',
  token: process.env.SANITY_WRITE_TOKEN
});

async function main() {
  const log = (msg) => {
    console.log(msg);
  };
  
  log("Fetching workshop document...");
  const workshop = await client.fetch('*[_type == "workshop"][0]');
  
  if (!workshop) {
    log("Fehler: Dokument 'workshop' existiert noch nicht im Sanity Studio. Bitte dort zuerst anlegen.");
    process.exit(1);
  }
  
  const updates = {};
  
  // NAV
  if (!workshop.navLinks || workshop.navLinks.length === 0) {
    updates.navLinks = [
      { _key: "n1", label: "Beratung", url: "/ki-coaching/beratung" },
      { _key: "n2", label: "Workshop", url: "/ki-coaching/workshop" },
      { _key: "n3", label: "Zuhören ↗", url: "https://isha.de", isExternal: true },
      { _key: "n4", label: "Kompass", url: "/ki-coaching/kompass" },
      { _key: "n5", label: "Kontakt", url: "#" }
    ];
  }
  if (!workshop.navCta) updates.navCta = "Anmelden";

  // HERO
  if (!workshop.heroEyebrow) updates.heroEyebrow = "Zweitägiger Online-Workshop";
  if (!workshop.heroTitel) updates.heroTitel = "KI-Coaching im<br /><em>Unternehmen</em>";
  if (!workshop.heroUntertitel) updates.heroUntertitel = "verstehen — bewerten — einführen";
  if (!workshop.heroPill1) updates.heroPill1 = "2 Nachmittage à 4 Stunden";
  if (!workshop.heroPill2) updates.heroPill2 = "Online via Zoom";
  if (!workshop.heroPill3) updates.heroPill3 = "Max. 12 Teilnehmer";
  if (!workshop.heroPill4) updates.heroPill4 = "399 EUR pro Person";
  if (!workshop.heroCtaPrimary) updates.heroCtaPrimary = "Jetzt anmelden";
  if (!workshop.heroCtaSecondary) updates.heroCtaSecondary = "Mehr erfahren";
  
  // ZIELGRUPPE
  if (!workshop.zielgruppeEyebrow) updates.zielgruppeEyebrow = "Zielgruppe";
  if (!workshop.zielgruppeTitel) updates.zielgruppeTitel = "Ist dieser Workshop <em>für Sie?</em>";
  if (!workshop.zielgruppeLead) updates.zielgruppeLead = "Dieser Workshop ist für Sie, wenn Sie sich fragen:";
  if (!workshop.zielgruppeKarten || workshop.zielgruppeKarten.length === 0) {
    updates.zielgruppeKarten = [
      { _key: "zg1", icon: "🧭", text: "Sollen wir KI-Coaching in unserem Unternehmen einführen &mdash; <strong>und wenn ja, wie?</strong>" },
      { _key: "zg2", icon: "🔍", text: "Was unterscheidet einen <strong>seriösen KI-Coaching-Anbieter</strong> von einem schlechten?" },
      { _key: "zg3", icon: "🤝", text: "Wie überzeugen wir den Betriebsrat &mdash; und <strong>was muss rechtlich geregelt sein?</strong>" },
      { _key: "zg4", icon: "🤖", text: "Was kann KI wirklich leisten &mdash; und <strong>was bleibt dem menschlichen Coach vorbehalten?</strong>" },
      { _key: "zg5", icon: "🚀", text: "Wie starte ich mit einem Pilot, <strong>ohne große Risiken einzugehen?</strong>" },
    ];
  }

  // MITNAHMEN
  if (!workshop.mitnahmenEyebrow) updates.mitnahmenEyebrow = "Ihr Ergebnis";
  if (!workshop.mitnahmenTitel) updates.mitnahmenTitel = "Was Sie <em>mitnehmen</em>";
  if (!workshop.mitnahmenLead) updates.mitnahmenLead = "Nach zwei Nachmittagen haben Sie:";
  if (!workshop.mitnahmenKarten || workshop.mitnahmenKarten.length === 0) {
    updates.mitnahmenKarten = [
      { _key: "m1", nummer: "01", text: "<strong>Eine klare Entscheidungsgrundlage</strong> &mdash; ob und wie KI-Coaching zu Ihrem Unternehmen passt" },
      { _key: "m2", nummer: "02", text: "<strong>Einen ersten konkreten Pilotplan</strong> &mdash; mit Ziel, Zielgruppe, Tool und Messung" },
      { _key: "m3", nummer: "03", text: "<strong>Orientierung im Tool-Markt</strong> &mdash; welche Kriterien wirklich zählen" },
      { _key: "m4", nummer: "04", text: "<strong>Antworten auf die Datenschutz- und Betriebsratsfragen</strong>" },
      { _key: "m5", nummer: "05", text: "<strong>Ein Netzwerk</strong> &mdash; Menschen aus anderen Unternehmen, die vor denselben Fragen stehen" },
    ];
  }

  // DIDAKTIK
  if (!workshop.didaktikEyebrow) updates.didaktikEyebrow = "Didaktik";
  if (!workshop.didaktikTitel) updates.didaktikTitel = "Kein Folienvortrag.<br />Kein Hype.<br /><em>Kein Verkaufsgespräch.</em>";
  if (!workshop.didaktikText1) updates.didaktikText1 = "Dieser Workshop pendelt bewusst zwischen tiefen Fragen &mdash; <em>Was ist Coaching wirklich? Was kann KI, was kann sie nicht?</em> &mdash; und konkreter Praxis: Wie plane ich eine Einführung? Wie wähle ich das richtige Tool?";
  if (!workshop.didaktikText2) updates.didaktikText2 = "Sie arbeiten mit echten Werkzeugen: einer Pilot-Canvas, einer Toolbewertungs-Checkliste, einem Entscheidungsleitfaden. Und Sie diskutieren mit anderen, die vor denselben Fragen stehen.";
  
  if (!workshop.agendaTag1Titel) updates.agendaTag1Titel = "Nachmittag 1 &mdash; Verstehen";
  if (!workshop.agendaTag1 || workshop.agendaTag1.length === 0) {
    updates.agendaTag1 = [
      { _key: "a1_1", zeit: "13:00", thema: "Ankommen &mdash; wer ist im Raum, was bringen wir mit?", format: "Gesprächsrunde" },
      { _key: "a1_2", zeit: "13:45", thema: "Was ist Coaching wirklich? &mdash; und warum erreicht es so wenige", format: "Impuls + Übung" },
      { _key: "a1_3", zeit: "14:45", thema: "Pause", format: "15 Min." },
      { _key: "a1_4", zeit: "15:00", thema: "Was kann KI &mdash; was kann sie nicht? Forschung und Realität", format: "Impuls + Demo" },
      { _key: "a1_5", zeit: "16:00", thema: "Das Staffelstab-Modell &mdash; Mensch und KI als Team", format: "Gruppenarbeit" },
      { _key: "a1_6", zeit: "16:45", thema: "Reflexion &mdash; was nehme ich mit in die Nacht?", format: "Stille Runde" },
    ];
  }
  
  if (!workshop.agendaTag2Titel) updates.agendaTag2Titel = "Nachmittag 2 &mdash; Gestalten";
  if (!workshop.agendaTag2 || workshop.agendaTag2.length === 0) {
    updates.agendaTag2 = [
      { _key: "a2_1", zeit: "13:00", thema: "Rückblick &mdash; was ist über Nacht aufgetaucht?", format: "Kurzrunde" },
      { _key: "a2_2", zeit: "13:15", thema: "Einführung planen &mdash; Ziel, Zielgruppe, erster Schritt", format: "Canvas-Arbeit" },
      { _key: "a2_3", zeit: "14:15", thema: "Toolauswahl &mdash; welche Kriterien zählen wirklich?", format: "Marktüberblick" },
      { _key: "a2_4", zeit: "15:00", thema: "Pause", format: "15 Min." },
      { _key: "a2_5", zeit: "15:15", thema: "Datenschutz, Vertrauen, Unternehmenskultur", format: "Diskussion" },
      { _key: "a2_6", zeit: "16:00", thema: "Was kann ich messen &mdash; und was nicht?", format: "Impuls" },
      { _key: "a2_7", zeit: "16:30", thema: "Nächste Schritte &mdash; was tue ich in zwei Wochen?", format: "Abschlussrunde" },
    ];
  }

  // LEISTUNGSUMFANG
  if (!workshop.enthaltenEyebrow) updates.enthaltenEyebrow = "Leistungsumfang";
  if (!workshop.enthaltenTitel) updates.enthaltenTitel = "Was im Preis <em>enthalten ist</em>";
  if (!workshop.enthaltenListe || workshop.enthaltenListe.length === 0) {
    updates.enthaltenListe = [
      { _key: "e1", titel: "Persönliches Vorgespräch (15 Min. via Zoom)", text: "Vor dem Workshop &mdash; Ihre Fragen, Ihre Situation" },
      { _key: "e2", titel: "Vorbereitungsmaterialien", text: "Sofort nach Anmeldung: Entscheidungs-Leitfaden, Vergleichsdokument Mensch vs. KI" },
      { _key: "e3", titel: "Nachmittag 1 &mdash; Verstehen", text: "4 Stunden: Was ist Coaching? Was kann KI? Das Staffelstab-Modell" },
      { _key: "e4", titel: "Nachmittag 2 &mdash; Gestalten", text: "4 Stunden: Pilotplanung, Toolauswahl, Datenschutz, Messung" },
      { _key: "e5", titel: "Alle Arbeitsmaterialien (5 Dokumente)", text: "Pilot-Canvas, Toolbewertungs-Checkliste, Toolübersicht u.a." },
      { _key: "e6", titel: "Persönliches Nachgespräch (15 Min. via Zoom)", text: "Nach dem Workshop &mdash; nächste Schritte, offene Fragen, Einstieg in Zusammenarbeit" },
    ];
  }

  // FORSCHUNG
  if (!workshop.forschungEyebrow) updates.forschungEyebrow = "Wissenschaftlicher Hintergrund";
  if (!workshop.forschungTitel) updates.forschungTitel = "Was die <em>Forschung sagt</em>";
  if (!workshop.forschungStats || workshop.forschungStats.length === 0) {
    updates.forschungStats = [
      { _key: "f1", nummer: "&gt;80%", label: "Abbruchrate bei KI-Coaching ohne menschliche Begleitung" },
      { _key: "f2", nummer: "5–15%", label: "der Belegschaft erreicht klassisches Coaching im Schnitt" }
    ];
  }
  if (!workshop.forschungText1) updates.forschungText1 = "Die Studienlage zu KI-Coaching ist klar: KI allein &mdash; ohne menschliche Begleitung &mdash; erzeugt in kontrollierten Studien keine messbaren Entwicklungseffekte.";
  if (!workshop.forschungText2) updates.forschungText2 = "Gleichzeitig hat KI echte Stärken: Verfügbarkeit rund um die Uhr, Skalierung auf die gesamte Belegschaft, niedrige Hemmschwelle. Richtig eingesetzt kann sie Coaching für deutlich mehr Mitarbeitende zugänglich machen &mdash; ohne die Qualität menschlicher Begleitung zu opfern.";
  if (!workshop.forschungText3) updates.forschungText3 = "Der Schlüssel liegt nicht in der Entscheidung für oder gegen KI &mdash; sondern in der klugen Verbindung beider. Genau das ist das Thema dieses Workshops.";
  if (!workshop.forschungQuelle) updates.forschungQuelle = "Quelle: De Haan, Terblanche & Nowack (2026), RCT mit 114 Führungskräften";

  // ÜBER
  if (!workshop.ueberEyebrow) updates.ueberEyebrow = "Workshopleitung";
  if (!workshop.ueberName) updates.ueberName = "Bernd Wiese";
  if (!workshop.ueberRole) updates.ueberRole = "Zuhörcoach nach Nancy Kline<br />Betreiber ki-coaching-kompass.de<br />Freiburg";
  if (!workshop.ueberText1) updates.ueberText1 = "Bernd Wiese betreibt ki-coaching-kompass.de &mdash; eine unabhängige deutschsprachige Plattform, die KI-Coaching-Tools, Studien und Artikel für den deutschsprachigen Raum kuratiert.";
  if (!workshop.ueberText2) updates.ueberText2 = "Als Zuhörcoach nach Nancy Kline und ehemaliger CRM-Vertriebsberater bringt er zwei Perspektiven zusammen: tiefes Verständnis von Coaching und 30 Jahre Erfahrung darin, wie Unternehmen Technologie wirklich einführen &mdash; und was dabei scheitert.";
  if (!workshop.ueberHinweisTitel) updates.ueberHinweisTitel = "Transparenzhinweis";
  if (!workshop.ueberHinweisText) updates.ueberHinweisText = "Bernd Wiese ist Partneranbieter ausgewählter KI-Coaching-Tools und erhält bei Einführungen eine Provision vom Anbieter. Dies wird offen kommuniziert &mdash; und bedeutet: Empfohlen werden nur Tools, die persönlich geprüft und eingesetzt wurden.";

  // CTA
  if (!workshop.ctaEyebrow) updates.ctaEyebrow = "Anmeldung";
  if (!workshop.ctaTitel) updates.ctaTitel = "Nächster <em>Termin</em>";
  if (!workshop.ctaPreis) updates.ctaPreis = "399 EUR";
  if (!workshop.ctaPreisLabel) updates.ctaPreisLabel = "pro Person · inkl. aller Materialien und Gespräche";
  if (!workshop.ctaTermin) updates.ctaTermin = "Nächster Termin: wird bekannt gegeben";
  if (!workshop.ctaButton) updates.ctaButton = "Jetzt anmelden";
  if (!workshop.ctaButtonSecondary) updates.ctaButtonSecondary = "Fragen vorab schreiben";
  if (!workshop.ctaEmail) updates.ctaEmail = "kontakt@ki-coaching-kompass.de";
  if (!workshop.ctaBody) updates.ctaBody = "Mit Anmeldung erhalten Sie sofort Zugang zu Ihren Vorbereitungsmaterialien und einen Buchungslink für Ihr persönliches Vorgespräch.";

  // FOOTER
  if (!workshop.footerCopyright) updates.footerCopyright = "© 2025 KI-Coaching Kompass · Bernd Wiese · Staufen";
  if (!workshop.footerLinks || workshop.footerLinks.length === 0) {
    updates.footerLinks = [
      { _key: "fl1", label: "Start", url: "/" },
      { _key: "fl2", label: "Beratung", url: "/ki-coaching/beratung" },
      { _key: "fl3", label: "Kompass", url: "/ki-coaching/kompass" },
      { _key: "fl4", label: "Gehört werden", url: "/zuhoeren" },
      { _key: "fl5", label: "Über mich", url: "/ueber-mich" },
      { _key: "fl6", label: "Impressum", url: "/impressum" },
      { _key: "fl7", label: "Datenschutz", url: "/datenschutz" },
    ];
  }

  if (Object.keys(updates).length > 0) {
    log("Patche Sanity Felder mit den Defaults!");
    await client.patch(workshop._id).set(updates).commit();
    log("Sanity Dokument 'workshop' erfolgreich um alle Texte migriert!");
  } else {
    log("Sanity Dokument hat bereits alle Texte!");
  }
}

main().catch(console.error);
