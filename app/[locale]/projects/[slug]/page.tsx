import {notFound} from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import type {Metadata} from 'next'
import {PortableText} from '@portabletext/react'
import {client} from '@/sanity/lib/client'
import {urlFor} from '@/sanity/lib/image'
import {
  projectBySlugQuery,
  allProjectSlugsQuery,
  projectSequenceQuery,
} from '@/sanity/lib/queries'
import {isValidLocale, type Locale} from '@/lib/i18n'
import {portableTextToText} from '@/lib/portableText'
import {ProjectGallerySlider} from '@/components/ProjectGallerySlider'
import {ZoomableHero} from '@/components/ZoomableHero'

// SSG: tüm proje slug'larını önceden üret
export async function generateStaticParams() {
  const slugs: string[] = await client.fetch(allProjectSlugsQuery)
  return slugs.flatMap((slug) => [
    {locale: 'tr', slug},
    {locale: 'en', slug},
  ])
}

// Henüz Sanity'de hiç proje yokken generateStaticParams boş dizi döndürüyor;
// bu durumda Vercel'in builder'ı statik/dinamik ayrımında hataya düşüyordu
// ("Unable to find lambda for route"). force-dynamic ile bu belirsizliği
// tamamen ortadan kaldırıyoruz — sayfa her istekte SSR ile üretilir.
export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{locale: string; slug: string}>
}): Promise<Metadata> {
  const {locale: rawLocale, slug} = await params
  if (!isValidLocale(rawLocale)) return {}
  const locale = rawLocale as Locale
  const isEn = locale === 'en'

  const project = await client.fetch(projectBySlugQuery, {slug})
  if (!project || !project.isPublished) return {}

  const title = isEn && project.titleEn ? project.titleEn : project.title
  const location = isEn && project.locationEn ? project.locationEn : project.location
  const concept = isEn && project.conceptEn ? project.conceptEn : project.concept
  const description =
    (isEn ? project.pullQuoteEn : project.pullQuote) ||
    portableTextToText(concept).slice(0, 160) ||
    `${title} — ${location}`

  return {
    title: `${title} — ${location}`,
    description,
    alternates: {canonical: `/${locale}/projects/${slug}`},
  }
}

type GalleryItem = {
  _key: string
  size: 'full' | 'wide' | 'medium' | 'narrow'
  image: any
}

type Project = {
  _id: string
  title: string
  titleEn?: string
  slug: string
  location: string
  locationEn?: string
  year: number
  area?: string
  category: string
  heroImage: any
  concept: any
  conceptEn?: any
  pullQuote?: string
  pullQuoteEn?: string
  details?: any
  detailsEn?: any
  gallery1?: GalleryItem[]
  gallery2?: GalleryItem[]
  isPublished: boolean
}

const categoryLabel: Record<string, {tr: string; en: string}> = {
  konut: {tr: 'Konut', en: 'Residential'},
  ofis: {tr: 'Ofis', en: 'Office'},
  ticari: {tr: 'Ticari', en: 'Commercial'},
  magaza: {tr: 'Mağaza', en: 'Retail'},
}

const sectionLabels = {
  tr: {concept: 'Konsept', details: 'Detaylar', location: 'Konum', year: 'Yıl', area: 'Alan', category: 'Kategori', backToProjects: 'Projeler', nextProject: 'Sonraki Proje', viewProject: 'Projeyi Gör'},
  en: {concept: 'Concept', details: 'Details', location: 'Location', year: 'Year', area: 'Area', category: 'Category', backToProjects: 'Projects', nextProject: 'Next Project', viewProject: 'View Project'},
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{locale: string; slug: string}>
}) {
  const {locale: rawLocale, slug} = await params

  if (!isValidLocale(rawLocale)) notFound()
  const locale = rawLocale as Locale

  const project: Project | null = await client.fetch(projectBySlugQuery, {slug})
  if (!project || !project.isPublished) notFound()
  // Sonraki proje: Projeler sayfasındaki sırayla bir sonraki, sondaysa baştaki (tek proje varsa gösterilmez)
  const sequence: {title: string; titleEn?: string; slug: string}[] = await client.fetch(projectSequenceQuery)
  const currentIndex = sequence.findIndex((p) => p.slug === slug)
  const nextProject =
    sequence.length > 1 ? sequence[(currentIndex + 1) % sequence.length] : null

  const labels = sectionLabels[locale]
  const isEn = locale === 'en'

  const heroHotspot = project.heroImage?.hotspot
  const heroObjectPosition = heroHotspot
    ? `${heroHotspot.x * 100}% ${heroHotspot.y * 100}%`
    : '50% 50%'
  // Dikey (portre) fotoğraflarda cover kırpması önemli kısımları (ör. yüz) kesebiliyor;
  // asset ref'teki gerçek boyuttan bakıp sadece belirgin dikey fotoğraflarda contain'e geçiyoruz.
  const heroAssetRef: string | undefined = project.heroImage?.asset?._ref
  const heroDims = heroAssetRef?.match(/-(\d+)x(\d+)-/)
  const heroIsPortrait = heroDims ? Number(heroDims[2]) > Number(heroDims[1]) * 1.15 : false

  const title = isEn && project.titleEn ? project.titleEn : project.title
  const location = isEn && project.locationEn ? project.locationEn : project.location
  const concept = isEn && project.conceptEn ? project.conceptEn : project.concept
  const pullQuote = isEn && project.pullQuoteEn ? project.pullQuoteEn : project.pullQuote
  const details = isEn && project.detailsEn ? project.detailsEn : project.details
  const category = categoryLabel[project.category]?.[locale] ?? project.category

  return (
    <article className="project-detail">
      {/* Hero */}
      <section className="pd-hero">
        <div className="pd-hero-image">
          {heroIsPortrait && (
            <div
              className="pd-hero-backdrop"
              style={{backgroundImage: `url(${urlFor(project.heroImage).width(200).quality(30).url()})`}}
            />
          )}
          <Image
            src={urlFor(project.heroImage).width(2400).quality(85).url()}
            alt={title}
            fill
            priority
            sizes="100vw"
            style={{
              objectFit: heroIsPortrait ? 'contain' : 'cover',
              objectPosition: heroObjectPosition,
            }}
          />
          <div className="pd-hero-overlay" />
          <ZoomableHero
            src={urlFor(project.heroImage).width(2400).fit('max').quality(90).url()}
            alt={title}
            isEn={isEn}
          />
          {/* Breadcrumb — artık fotoğrafın üstünde, ayrı bir boşluk bırakmıyor */}
          <div className="pd-breadcrumb">
            <Link href={`/${locale}/projects`}>{labels.backToProjects}</Link>
            <span>/</span>
            <span>{title}</span>
          </div>
          <h1 className="pd-hero-title">{title}</h1>
        </div>
      </section>

      {/* Meta */}
      <section className="pd-meta">
        <div className="pd-meta-item">
          <div className="pd-meta-label">{labels.location}</div>
          <div className="pd-meta-value">{location}</div>
        </div>
        <div className="pd-meta-item">
          <div className="pd-meta-label">{labels.year}</div>
          <div className="pd-meta-value">{project.year}</div>
        </div>
        {project.area && (
          <div className="pd-meta-item">
            <div className="pd-meta-label">{labels.area}</div>
            <div className="pd-meta-value">{project.area}</div>
          </div>
        )}
        <div className="pd-meta-item">
          <div className="pd-meta-label">{labels.category}</div>
          <div className="pd-meta-value">{category}</div>
        </div>
      </section>

      {/* Konsept */}
      {concept && (
        <section className="pd-section">
          <div className="pd-section-grid">
            <div className="pd-section-label">{labels.concept}</div>
            <div className="pd-section-body">
              <PortableText value={concept} />
            </div>
          </div>
        </section>
      )}

      {/* Galeri 1 */}
      {project.gallery1 && project.gallery1.length > 0 && (
        <section className="pd-gallery">
          <ProjectGallerySlider items={project.gallery1} title={title} isEn={isEn} />
        </section>
      )}

      {/* Pull quote */}
      {pullQuote && (
        <section className="pd-quote">
          <blockquote>{pullQuote}</blockquote>
        </section>
      )}

      {/* Detaylar */}
      {details && (
        <section className="pd-section">
          <div className="pd-section-grid">
            <div className="pd-section-label">{labels.details}</div>
            <div className="pd-section-body">
              <PortableText value={details} />
            </div>
          </div>
        </section>
      )}

      {/* Galeri 2 */}
      {project.gallery2 && project.gallery2.length > 0 && (
        <section className="pd-gallery">
          <ProjectGallerySlider items={project.gallery2} title={title} isEn={isEn} />
        </section>
      )}
	  {/* Sonraki proje */}
      {nextProject && nextProject.slug && (
        <section className="pd-next">
          <div className="pd-next-label">{labels.nextProject}</div>
          <Link
            href={`/${locale}/projects/${nextProject.slug}`}
            className="pd-next-link"
          >
            <h2 className="pd-next-title">
              {isEn && nextProject.titleEn ? nextProject.titleEn : nextProject.title}
            </h2>
            <span className="pd-next-cta">{labels.viewProject} →</span>
          </Link>
        </section>
      )}
    </article>
  )
}