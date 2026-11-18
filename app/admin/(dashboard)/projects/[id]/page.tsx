import {notFound, redirect} from 'next/navigation'
import {groq} from 'next-sanity'
import {client} from '@/sanity/lib/client'
import {urlFor} from '@/sanity/lib/image'
import {portableTextToText} from '@/lib/portableText'
import {isAdminAuthenticated} from '@/lib/adminAuth'
import {ProjectForm, type ProjectFormInitial} from '@/components/admin/ProjectForm'

const projectByIdQuery = groq`
  *[_type == "project" && _id == $id][0] {
    _id,
    title,
    "slug": slug.current,
    location,
    category,
    year,
    area,
    concept,
    pullQuote,
    details,
    titleEn,
    locationEn,
    conceptEn,
    pullQuoteEn,
    detailsEn,
    order,
    isPublished,
    heroImage,
    gallery1[]{_key, size, image},
    gallery2[]{_key, size, image}
  }
`

export default async function EditProjectPage({params}: {params: Promise<{id: string}>}) {
  if (!(await isAdminAuthenticated())) redirect('/admin/login')

  const {id} = await params
  const project = await client.fetch(projectByIdQuery, {id})
  if (!project) notFound()

  const initial: ProjectFormInitial = {
    id: project._id,
    title: project.title ?? '',
    slug: project.slug ?? '',
    location: project.location ?? '',
    category: project.category ?? 'konut',
    year: project.year?.toString() ?? '',
    area: project.area ?? '',
    concept: portableTextToText(project.concept),
    pullQuote: project.pullQuote ?? '',
    details: portableTextToText(project.details),
    titleEn: project.titleEn ?? '',
    locationEn: project.locationEn ?? '',
    conceptEn: portableTextToText(project.conceptEn),
    pullQuoteEn: project.pullQuoteEn ?? '',
    detailsEn: portableTextToText(project.detailsEn),
    order: project.order?.toString() ?? '100',
    isPublished: Boolean(project.isPublished),
    heroImage: project.heroImage
      ? {assetId: project.heroImage.asset._ref, previewUrl: urlFor(project.heroImage).width(800).url()}
      : null,
    gallery1: (project.gallery1 ?? []).map((item: any) => ({
      key: item._key,
      assetId: item.image.asset._ref,
      previewUrl: urlFor(item.image).width(200).url(),
      size: item.size,
    })),
    gallery2: (project.gallery2 ?? []).map((item: any) => ({
      key: item._key,
      assetId: item.image.asset._ref,
      previewUrl: urlFor(item.image).width(200).url(),
      size: item.size,
    })),
  }

  return (
    <div>
      <h1 className="mb-4">{project.title} — Düzenle</h1>
      <ProjectForm initial={initial} />
    </div>
  )
}
