export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-05-10'

// Sabit değerler: site iki Vercel projesinden yayınlanıyor (fikrim-var-mimarlik.vercel.app
// ve fikrimvaricmimarlik.com). Eski projenin env'i eski Sanity'yi (bw0fswaq) gösterdiği için
// env'e güvenilmiyor; ikisi de aynı içeriği (iqlp8bdl/production) okusun. Proje ID gizli değildir.
export const dataset = 'production'

export const projectId = 'iqlp8bdl'
