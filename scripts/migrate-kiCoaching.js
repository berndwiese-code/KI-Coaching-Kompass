const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_WRITE_TOKEN,
  apiVersion: '2024-03-01',
  useCdn: false
});

const kiCoachingDoc = {
  _id: "kiCoaching",
  _type: "kiCoaching",
  navCta: "Kontakt",
  navCtaUrl: "mailto:bernd.wiese@googlemail.com",
  heroEyebrow: "KI-Coaching",
  heroTitlePart1: "KI-Coaching:",
  heroTitleHighlight: "Was es ist. Was es kann.",
  heroTitlePart2: "Und was nicht.",
  heroLead: "Der Markt für KI-Coaching-Tools wächst rasant — über 249 Lösungen, jede mit eigenen Stärken, Risiken und Anwendungsfällen. Ich helfe Unternehmen und Coaches, in diesem Markt die richtige Wahl zu treffen.",
  
  cards: [
    {
      _key: "card-unternehmen",
      icon: "🏢",
      label: "Für Unternehmen",
      title: "KI-Coaching einführen — strukturiert und sicher",
      body: "Von der Bedarfsanalyse über die Toolauswahl bis zum Rollout: ich begleite Organisationen durch den gesamten Prozess.",
      arrowText: "Zur Beratung →",
      url: "/ki-coaching/beratung-unternehmen"
    },
    {
      _key: "card-coaches",
      icon: "🎯",
      label: "Für Coaches",
      title: "KI-Tools sinnvoll in die eigene Praxis integrieren",
      body: "Orientierung im Tool-Dschungel, DSGVO-Check, Hands-on Testing — für Coaches, die KI nutzen wollen, ohne ihre Qualität zu kompromittieren.",
      arrowText: "Zur Beratung →",
      url: "/ki-coaching/beratung-coaches"
    }
  ],
  links: [
    { _key: "link-workshop", label: "Workshop: KI-Coaching einführen", url: "/ki-coaching/workshop" },
    { _key: "link-kompass", label: "KI-Tools entdecken", url: "/ki-coaching/kompass" }
  ]
};

async function run() {
  try {
    const result = await client.createOrReplace(kiCoachingDoc);
    console.log("Migration successful for KI-Coaching: ", result._id);
  } catch (err) {
    console.error("Migration failed: ", err);
  }
}

run();
