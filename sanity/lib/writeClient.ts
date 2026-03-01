import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'

// Write client - for mutations (server-side only)
// This client uses a token with write permissions
export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Must be false for mutations
  token: process.env.SANITY_API_TOKEN, // Server-side only
})
