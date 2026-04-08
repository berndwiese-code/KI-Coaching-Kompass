import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  stega: {
    enabled: true,
    // Tells Visual Editing overlays where to open the studio
    studioUrl: '/studio',
  },
})
