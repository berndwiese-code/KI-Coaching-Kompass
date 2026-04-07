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
    fs.appendFileSync('scripts/migrate-all.log', msg + '\n');
  };
  
  log("Fetching startseite document...");
  const startseite = await client.fetch('*[_type == "startseite"][0]');
  
  if (!startseite) {
    log("Fehler: Dokument 'startseite' existiert noch nicht!");
    process.exit(1);
  }
  
  const updates = {};
  
  // -- HERO --
  if (!startseite.heroEyebrow) updates.heroEyebrow = "KI-Coaching Kompass";
  if (!startseite.heroTitel) updates.heroTitel = "KI verändert, wie wir uns begegnen.\nDie Frage ist nur: <em>wie?</em>";
  if (!startseite.heroUntertitel) updates.heroUntertitel = "Ich begleite Unternehmen, Coaches und Menschen, die das herausfinden wollen — mit Methode, Präsenz und ohne Hype.";
  
  // -- WEGE --
  if (!startseite.wegeEyebrow) updates.wegeEyebrow = "Die drei Wege";
  if (!startseite.wegeTitel) updates.wegeTitel = "Was kann ich für dich tun?";
  if (!startseite.wegeLead) updates.wegeLead = "Drei Zielgruppen. Drei Formate. Ein gemeinsamer Ausgangspunkt: KI ist kein Selbstzweck — sie ist ein Spiegel.";
  if (!startseite.wegeListe || startseite.wegeListe.length === 0) {
    updates.wegeListe = [
      {
        _key: "weg_1",
        nummer: "01",
        eyebrow: "Für Unternehmen",
        titel: "KI-Coaching kommt.\n<em>Seid ihr bereit dafür?</em>",
        text: "Nicht als Hype-Welle, die man einfach surft. Sondern als echte Entscheidung: Was soll KI in eurem Coaching-Prozess können — und was soll sie lassen? Ich begleite euch dabei, das herauszufinden.",
        linkUrl: "/ki-coaching/beratung",
        linkText: "Beratung entdecken →"
      },
      {
        _key: "weg_2",
        nummer: "02",
        eyebrow: "Für Coaches",
        titel: "KI im Coaching —\n<em>muss das sein?</em>",
        text: "Spoiler: Ja. Aber nicht so, wie du vielleicht denkst. Nicht als Konkurrenz zu deiner Arbeit — als Werkzeug, das dir Zeit, Klarheit und neue Möglichkeiten zurückgibt.",
        linkUrl: "/ki-coaching/workshop",
        linkText: "Workshop entdecken →"
      },
      {
        _key: "weg_3",
        nummer: "03",
        eyebrow: "Für dich",
        titel: "Manchmal braucht es jemanden,\n<em>der einfach zuhört.</em>",
        text: "Kein Programm. Kein Tool. Nur ein Gespräch — in dem du dich selbst hören kannst. Mit mir, in echter Präsenz.",
        linkUrl: "/zuhoeren",
        linkText: "Gehört werden →"
      }
    ];
  }
  
  // -- TOOLS (KOMPASS) --
  if (!startseite.toolsEyebrow) updates.toolsEyebrow = "Der Kompass";
  if (!startseite.toolsTitel) updates.toolsTitel = "Tools, Studien, Meinungen —\n<em>ohne Affiliate-Brille.</em>";
  if (!startseite.toolsFooterText) updates.toolsFooterText = "Ich habe aufgehört zu zählen, wie viele KI-Tools sich als Coaching-Revolution vermarkten. Deshalb habe ich angefangen zu sortieren. Der Kompass ist kein Versprechen — er ist das, was ich selbst gebraucht hätte.";
  if (!startseite.toolsFooterCta) updates.toolsFooterCta = "Zum Kompass";
  
  if (!startseite.kompassZitat) {
    updates.kompassZitat = "Keine leeren Versprechen,\nsondern kuratiertes Wissen.\nFür alle, die den Unterschied\nerkennen wollen.";
  }
  if (!startseite.kompassStats || startseite.kompassStats.length === 0) {
    updates.kompassStats = [
      { "nummer": "40+", "label": "Tools bewertet", "_key": "stat_1" },
      { "nummer": "3", "label": "Perspektiven", "_key": "stat_2" },
      { "nummer": "0", "label": "Affiliate-Links", "_key": "stat_3" }
    ];
  }
  
  // -- TESTIMONIALS --
  if (!startseite.testimonialsEyebrow) updates.testimonialsEyebrow = "Stimmen";
  if (!startseite.testimonialsTitel) updates.testimonialsTitel = "Was Menschen sagen,\n<em>die dabei waren.</em>";

  // -- ÜBER MINI --
  if (!startseite.ueberEyebrow) updates.ueberEyebrow = "Über mich";
  if (!startseite.ueberTitel) updates.ueberTitel = "Bernd Wiese";
  if (!startseite.ueberText1) updates.ueberText1 = "Ich liebe echte Präsenz — und ich finde es faszinierend, was gerade mit KI entsteht. Nicht nur technologisch. Sondern in dem, was es über uns sichtbar macht.";
  if (!startseite.ueberText2) updates.ueberText2 = "Ich arbeite in der Spannung zwischen einem Zuhören, das nichts will, und einer Technologie, die unglaublich viel kann. Als Zuhörcoach und KI-Berater aus Freiburg.";
  if (!startseite.ueberCtaText) updates.ueberCtaText = "Mehr über mich";

  // -- FOOTER --
  if (!startseite.footerCopyright) updates.footerCopyright = "© 2025 KI-Coaching Kompass · Bernd Wiese · Freiburg";

  if (Object.keys(updates).length > 0) {
    log("Patche Sanity Felder mit:");
    log(JSON.stringify(updates, null, 2));
    await client.patch(startseite._id).set(updates).commit();
    log("Sanity Dokument erfolgreich um alle Texte migriert!");
  } else {
    log("Sanity Dokument hat bereits alle Texte!");
  }
}

main().catch(e => fs.appendFileSync('scripts/migrate-all.log', e.toString() + '\n'));
