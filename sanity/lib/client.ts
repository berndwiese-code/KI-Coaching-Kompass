import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  stega: {
    // Tells Visual Editing overlays where to open the studio
    studioUrl: process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || 'https://ki-coaching-kompass.sanity.studio',
  },
})
