const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_WRITE_TOKEN,
  apiVersion: '2024-03-01',
  useCdn: false
});

const zuhoerenDoc = {
  _id: "zuhoeren",
  _type: "zuhoeren",
  
  heroTitel: "Die meisten Menschen<br />werden gehört.<br />Aber nur selten<br /><em>wirklich.</em>",
  heroSubtitel: "Hier geht es nicht um Antworten.\nSondern darum, dass du dich selbst wieder hörst.",
  heroCta: "Gespräch anfragen",

  andersLabel: "Was hier anders ist",
  andersProse1: "<p>Zuhören, wie ich es verstehe, ist kein Technik-Tool.<br />Kein Coaching-Format.</p><p>Es ist ein <em>Raum.</em></p><p>Ein Raum, in dem nichts bewertet wird.<br />Nichts optimiert werden muss.</p><p>In dem du sagen kannst, was da ist —<br />auch das, was noch unfertig ist.</p>",
  zitatKlarheit: "„Klarheit entsteht nicht, weil jemand sie dir gibt. Sondern weil sie in dir bereits da ist.“",
  andersProse2: "<p>Und oft passiert genau dort etwas Entscheidendes:<br />Dinge ordnen sich.<br />Innere Spannungen lösen sich.</p><p>Nicht, weil ich etwas <em>mache</em>.<br />Sondern weil Zuhören wirkt.</p>",

  warumLabel: "Warum Zuhören wirkt",
  warumProse: "<p>Viele versuchen, ihre Gedanken mit ihrem Kopf zu ordnen.<br />Das ist oft, als würde man versuchen, sich selbst aus dem Sumpf zu ziehen.</p><p>Wenn du jedoch wirklich gehört wirst, passiert etwas anderes:</p><p>Dein System beginnt, sich selbst zu regulieren.<br />Deine Wahrnehmung wird feiner.<br />Du kommst näher an das, was für dich wirklich stimmt.</p><p>Zuhören ist kein passiver Prozess.<br />Es ist ein aktiver Raum, in dem <em>Bewusstsein entsteht.</em></p>",

  fuerWenLabel: "Für wen diese Sitzungen sind",
  fuerWenIntro: "<p>Menschen kommen zu mir, wenn sie…</p>",
  fuerWenListe: [
    "viel im Kopf sind und nicht mehr klar sehen",
    "vor einer Entscheidung stehen und keine Ratschläge, sondern Klarheit brauchen",
    "sich im Kreis drehen und merken: Es wäre gut, das einmal auszusprechen",
    "etwas sagen wollen, ohne bewertet zu werden",
    "beruflich viel Verantwortung tragen und selten wirklich gehört werden",
    "spüren, dass „irgendetwas nicht stimmt\", es aber nicht greifen können",
    "einfach einmal vollständig gehört werden wollen — ohne Rolle, ohne Funktion"
  ],
  fuerWenOutro: "<p>Du musst nicht wissen, worum es genau geht.<br />Es reicht, dass du merkst: Es wäre gut, das einmal auszusprechen.</p>",

  gespraechLabel: "Was im Gespräch passiert",
  gespraechProse: "<p>Wir sprechen.</p><p>Und ich höre zu.<br /><em>Wirklich.</em></p><p>Ohne zu unterbrechen.<br />Ohne dich in eine Richtung zu lenken.</p><p>Ich stelle Fragen — nicht, um dich zu steuern,<br />sondern um dich tiefer zu dir selbst zu bringen.</p><p>Es gibt kein Ziel, das erreicht werden muss.</p>",
  zitatGespraech: "„Und genau deshalb entsteht oft das, was sonst schwer zugänglich ist: echte Klarheit.“",

  abgrenzungTitel: "Das ist kein klassisches Coaching.",
  abgrenzungProse: "<p>Ich gebe dir keine Strategien vor.</p><p>Ich analysiere dich nicht.</p><p>Und ich versuche nicht, dich zu „verbessern\".</p><p>Stattdessen entsteht ein Raum,<br />in dem du dich selbst wieder besser wahrnehmen kannst.</p><p>Und das ist oft nachhaltiger<br />als jede gut gemeinte Lösung von außen.</p>",

  wirkungLabel: "Was du mitnehmen kannst",
  wirkungIntro: "<p>Viele gehen aus einem Gespräch mit…</p>",
  wirkungListe: [
    "mehr innerer Ruhe und einem Gefühl von Ordnung",
    "klareren Gedanken, die sich von selbst geordnet haben",
    "einer spürbaren Entlastung, die länger anhält",
    "oder einer Entscheidung, die sich plötzlich stimmig anfühlt"
  ],
  wirkungOutro: "<p>Nicht, weil etwas „gemacht\" wurde.<br />Sondern weil Raum da war.</p>",

  kiLabel: "Eine neue Dimension",
  kiTitel: "Zuhören<br /><em>+ KI</em>",
  kiProse1: "<p>Neben den klassischen Zuhör-Sitzungen biete ich auch eine erweiterte Form an: Zuhören in Kombination mit KI-gestützter Reflexion.</p>",
  kiProse2: "<p>Hier wird das Gespräch — wenn du möchtest — zusätzlich durch eine KI gespiegelt. Nicht als Ersatz, sondern als Erweiterung.</p>",
  kiListe: [
    "Muster in deinen Worten sichtbar machen",
    "Gedanken strukturieren und sortieren",
    "neue Perspektiven anbieten, die du noch nicht bedacht hast",
    "das, was zwischen den Zeilen liegt, in Sprache bringen"
  ],
  kiNote: "Du bleibst dabei immer im Zentrum. Die KI ist kein „Coach\", sondern ein Werkzeug für zusätzliche Klarheit — menschliches Zuhören und kollektive Intelligenz, die zusammenwirken.",

  ctaEyebrow: "Einladung",
  ctaTitel: "Wenn du das Gefühl hast,<br />dass es Zeit ist, einmal<br /><em>wirklich gehört zu werden.</em>",
  ctaBody: "Du musst nichts vorbereiten.\nDu darfst genau so kommen, wie du gerade bist.",
  ctaButton: "Gespräch anfragen",
  ctaNote: "Ohne Verpflichtung. Einfach, um es einmal zu erleben.",
  kontaktEmail: "bernd.wiese@googlemail.com",
};

async function run() {
  try {
    const result = await client.createOrReplace(zuhoerenDoc);
    console.log("Migration successful for Zuhören: ", result._id);
  } catch (err) {
    console.error("Migration failed: ", err);
  }
}

run();
