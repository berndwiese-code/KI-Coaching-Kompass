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
    fs.appendFileSync('scripts/migrate.log', msg + '\n');
  };
  
  log("Fetching startseite document...");
  const startseite = await client.fetch('*[_type == "startseite"][0]');
  
  if (!startseite) {
    log("Fehler: Dokument 'startseite' wurde noch nicht angelegt.");
    process.exit(1);
  }
  
  const updates = {};
  
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
  
  if (!startseite.ueberEyebrow) updates.ueberEyebrow = "Über mich";
  if (!startseite.ueberTitel) updates.ueberTitel = "Bernd Wiese";
  if (!startseite.ueberText1) updates.ueberText1 = "Ich liebe echte Präsenz — und ich finde es faszinierend, was gerade mit KI entsteht. Nicht nur technologisch. Sondern in dem, was es über uns sichtbar macht.";
  if (!startseite.ueberText2) updates.ueberText2 = "Ich arbeite in der Spannung zwischen einem Zuhören, das nichts will, und einer Technologie, die unglaublich viel kann. Als Zuhörcoach und KI-Berater aus Freiburg.";
  if (!startseite.ueberCtaText) updates.ueberCtaText = "Mehr über mich";

  if (Object.keys(updates).length > 0) {
    log("Patche Sanity Felder...");
    await client.patch(startseite._id).set(updates).commit();
    log("Sanity Dokument erfolgreich migriert!");
  } else {
    log("Sanity Dokument hat bereits die aktuellen Werte. Keine Migration nötig.");
  }
}

main().catch(e => fs.appendFileSync('scripts/migrate.log', e.toString() + '\n'));
