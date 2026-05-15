import Image from 'next/image'
import Link from 'next/link'
import {client} from '@/sanity/lib/client'
import {urlFor} from '@/sanity/lib/image'
import {projectsListQuery} from '@/sanity/lib/queries'
import type {Locale} from '@/lib/i18n'

type ProjectListItem = {
  _id: string
  title: string
  titleEn?: string
  slug: string
  location: string
  locationEn?: string
  year: number
  category: string
  heroImage: any
}

const categoryLabel: Record<string, {tr: string; en: string}> = {
  konut: {tr: 'Konut', en: 'Residential'},
  ofis: {tr: 'Ofis', en: 'Office'},
  ticari: {tr: 'Ticari', en: 'Commercial'},
  magaza: {tr: 'Mağaza', en: 'Retail'},
}

export default async function ProjectGrid({
  locale = 'tr',
  limit,
}: {
  locale?: Locale
  limit?: number
}) {
  const projects: ProjectListItem[] = await client.fetch(projectsListQuery)
  const isEn = locale === 'en'
  const items = typeof limit === 'number' ? projects.slice(0, limit) : projects

  if (!items.length) {
    return (
      <div className="project-grid-empty">
        {isEn ? 'No projects yet.' : 'Henüz proje yok.'}
      </div>
    )
  }

  return (
    <div className="project-grid">
      {items.map((p) => {
        const title = isEn && p.titleEn ? p.titleEn : p.title
        const location = isEn && p.locationEn ? p.locationEn : p.location
        const category = categoryLabel[p.category]?.[locale] ?? p.category
        return (
          <Link
            key={p._id}
            href={`/${locale}/projects/${p.slug}`}
            className="project-card"
          >
            <div className="project-image-wrap">
              <Image
                src={urlFor(p.heroImage).width(1200).height(1200).quality(80).url()}
                alt={title}
                width={1200}
                height={1200}
                className="project-image"
              />
            </div>
            <div className="project-card-meta">
              <h3 className="project-card-title">{title}</h3>
              <div className="project-card-sub">
                <span>{location}</span>
                <span className="project-card-dot">·</span>
                <span>{p.year}</span>
                <span className="project-card-dot">·</span>
                <span>{category}</span>
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}