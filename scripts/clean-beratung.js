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
  const docs = await client.fetch('*[_type == "beratung"]{ _id, _createdAt }');
  console.log(docs);
  
  if (docs.length > 1) {
    // Keep 'beratung', delete any auto-generated uuids
    const toDelete = docs.filter(d => d._id !== 'beratung');
    for (const d of toDelete) {
      await client.delete(d._id);
      console.log('Deleted duplicate: ', d._id);
    }
  }
}
run();
