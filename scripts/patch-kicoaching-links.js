const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_WRITE_TOKEN,
  apiVersion: '2024-03-01',
  useCdn: false
});

async function run() {
  try {
    const doc = await client.getDocument('kiCoaching');
    if (!doc) {
      console.log('Document not found');
      return;
    }

    const updatedCards = doc.cards.map((card) => {
      if (card.label === 'Für Unternehmen' && card.url === '/ki-coaching/beratung') {
        return { ...card, url: '/ki-coaching/beratung-unternehmen' };
      }
      if (card.label === 'Für Coaches' && card.url === '/ki-coaching/beratung') {
        return { ...card, url: '/ki-coaching/beratung-coaches' };
      }
      return card;
    });

    await client
      .patch('kiCoaching')
      .set({ cards: updatedCards })
      .commit();
    
    console.log("Migration successful");
  } catch (err) {
    console.error("Migration failed: ", err);
  }
}

run();
