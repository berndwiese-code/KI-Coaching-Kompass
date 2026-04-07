import { createClient } from 'next-sanity';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  apiVersion: '2023-05-03',
  token: process.env.SANITY_WRITE_TOKEN
});

async function main() {
  console.log("Fetching startseite document...");
  const startseite = await client.fetch('*[_type == "startseite"][0]');
  
  if (!startseite) {
    console.error("Fehler: Dokument 'startseite' wurde noch nicht angelegt. Bitte erstelle es zuerst über das Sanity Studio!");
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
    console.log("Patche Sanity Felder:", updates);
    await client.patch(startseite._id).set(updates).commit();
    console.log("✅ Sanity Dokument erfolgreich migriert!");
  } else {
    console.log("✅ Sanity Dokument hat bereits die aktuellen Werte. Keine Migration nötig.");
  }
}

main().catch(console.error);
