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
// Mevcut projeden sonraki projeyi getir (order'a göre)
// Eğer sıradaki yoksa, baştaki ilk projeyi getir (döngü)
export const nextProjectQuery = groq`
  *[_type == "project" && isPublished == true && order > $currentOrder]
    | order(order asc)[0] {
      title,
      titleEn,
      "slug": slug.current,
      heroImage
    }
`

export const firstProjectQuery = groq`
  *[_type == "project" && isPublished == true && slug.current != $currentSlug]
    | order(order asc)[0] {
      title,
      titleEn,
      "slug": slug.current,
      heroImage
    }
`