const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_WRITE_TOKEN,
  apiVersion: '2024-03-01',
  useCdn: false
});

const ueberMichDoc = {
  _id: "ueberMich",
  _type: "ueberMich",
  eyebrow: "Über mich",
  name: "Bernd Wiese",
  subname: "Zuhörcoach · KI-Berater · Freiburg",
  portraitLinkText: "LinkedIn ↗",
  portraitLinkUrl: "https://www.linkedin.com/in/bernd-wiese-9303341/",
  prose: "<p>Ich liebe echte Präsenz.<br />Momente, in denen nichts optimiert werden muss.<br />In denen jemand einfach da sein darf — und gehört wird.</p><p>Und gleichzeitig fasziniert mich, was gerade mit KI entsteht.</p><p>Nicht nur technologisch.<br />Sondern in dem, was es über uns sichtbar macht.</p><p>Denn KI kann viel.<br />Sie analysiert, strukturiert, spiegelt.<br />Manchmal überraschend klar.</p><p>Aber genau darin liegt für mich die eigentliche Frage:<br />Was passiert, wenn etwas uns <em>perfekt antwortet</em> —<br />ohne uns wirklich zu begegnen?</p><p>Ich arbeite genau in dieser Spannung.</p><p>Zwischen einem Zuhören, das nichts will,<br />und einer Technologie, die unglaublich viel kann —<br />aber nichts fühlt.</p><p>Für mich ist KI kein Ersatz für menschliche Tiefe.<br />Aber sie ist ein Werkzeug, das uns herausfordert:<br />ehrlicher zu werden, klarer zu sehen, bewusster zu sprechen.</p><p>Und manchmal sogar: <em>uns selbst besser zu hören.</em></p><p>Ich verbinde beides —<br />menschliche Präsenz und KI-gestützte Reflexion.</p><p>Nicht, um Prozesse zu beschleunigen.<br />Sondern um Räume zu öffnen,<br />in denen echte Erkenntnis entstehen kann.</p>",
  contactLabel: "Kontakt",
  emailText: "Wiese@ISHA.de",
  emailUrl: "mailto:Wiese@ISHA.de",
  linkedInText: "LinkedIn",
  linkedInUrl: "https://www.linkedin.com/in/bernd-wiese-9303341/",
  phoneText: "+49 176 1406 18 16",
  phoneUrl: "tel:+4917614061816"
};

async function run() {
  try {
    const result = await client.createOrReplace(ueberMichDoc);
    console.log("Migration successful for Über mich: ", result._id);
  } catch (err) {
    console.error("Migration failed: ", err);
  }
}

run();
