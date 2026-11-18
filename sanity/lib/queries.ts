import {groq} from 'next-sanity'

// Tüm yayınlanmış projeleri (liste için, sıralı)
export const projectsListQuery = groq`
  *[_type == "project" && isPublished == true] | order(order asc, _createdAt desc) {
    _id,
    title,
    titleEn,
    "slug": slug.current,
    location,
    locationEn,
    year,
    category,
    heroImage
  }
`

// Yayınlanmış proje sayısı (boş state kontrolü için)
export const publishedProjectsCountQuery = groq`
  count(*[_type == "project" && isPublished == true])
`

// Tek bir projeyi slug ile çek (detay sayfası için)
export const projectBySlugQuery = groq`
  *[_type == "project" && slug.current == $slug][0] {
    _id,
    title,
    titleEn,
    "slug": slug.current,
    location,
    locationEn,
    year,
    area,
    category,
    heroImage,
    concept,
    conceptEn,
    pullQuote,
    pullQuoteEn,
    details,
    detailsEn,
    gallery1[]{
      _key,
      size,
      image
    },
    gallery2[]{
      _key,
      size,
      image
    },
    isPublished
  }
`

// Slug listesi (Next.js static generation için)
export const allProjectSlugsQuery = groq`
  *[_type == "project" && isPublished == true][].slug.current
`
// "Sonraki proje" için: Projeler sayfasıyla (projectsListQuery) AYNI sırada tüm yayınlanmış projeler.
// Sıradaki proje bu listeden bulunur; sıra numaraları (order) eşit olsa bile döngü bütün projeleri gezer.
export const projectSequenceQuery = groq`
  *[_type == "project" && isPublished == true] | order(order asc, _createdAt desc) {
    title,
    titleEn,
    "slug": slug.current,
    heroImage
  }
`