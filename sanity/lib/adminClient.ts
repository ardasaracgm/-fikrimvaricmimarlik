import {createClient} from 'next-sanity'
import {apiVersion, dataset, projectId} from '../env'

// Yazma yetkili istemci — sadece sunucu tarafında (API route'larda) kullanılır,
// SANITY_API_TOKEN client'a asla gönderilmez (NEXT_PUBLIC_ öneki yok).
export const adminClient = createClient({
  projectId,
  dataset,
  apiVersion,
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})
