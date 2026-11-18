import {redirect} from 'next/navigation'
import {groq} from 'next-sanity'
import {client} from '@/sanity/lib/client'
import {urlFor} from '@/sanity/lib/image'
import {getDictionary} from '@/lib/content'
import {isAdminAuthenticated} from '@/lib/adminAuth'
import {FITOUT_PAGE_ID} from '@/lib/singletons'
import {FitoutForm, type FitoutFormInitial} from '@/components/admin/FitoutForm'

const fitoutPageQuery = groq`*[_type == "fitoutPage" && _id == $id][0]`

export default async function AdminFitoutPage() {
  if (!(await isAdminAuthenticated())) redirect('/admin/login')

  const [sanityDoc, dictTr] = await Promise.all([
    client.fetch(fitoutPageQuery, {id: FITOUT_PAGE_ID}),
    Promise.resolve(getDictionary('tr')),
  ])

  const servicesEn = sanityDoc?.servicesEn ?? []

  const initial: FitoutFormInitial = {
    heroImage: sanityDoc?.heroImage
      ? {assetId: sanityDoc.heroImage.asset._ref, previewUrl: urlFor(sanityDoc.heroImage).width(1200).url()}
      : null,
    title: sanityDoc?.title ?? dictTr.fitout.title,
    text1: sanityDoc?.text1 ?? dictTr.fitout.text1,
    text2: sanityDoc?.text2 ?? dictTr.fitout.text2,
    subheading: sanityDoc?.subheading ?? dictTr.fitout.subheading,
    services: (sanityDoc?.services ?? []).map((s: any, i: number) => ({
      key: s._key,
      title: s.title,
      text: s.text,
      titleEn: servicesEn[i]?.title ?? '',
      textEn: servicesEn[i]?.text ?? '',
    })),
    completedProjects: (sanityDoc?.completedProjects ?? []).map((p: any) => ({
      key: p._key,
      image: p.image ? {assetId: p.image.asset._ref, previewUrl: urlFor(p.image).width(600).url()} : null,
      title: p.title ?? '',
      location: p.location ?? '',
      year: p.year ? String(p.year) : '',
      order: p.order !== undefined && p.order !== null ? String(p.order) : '',
    })),
    titleEn: sanityDoc?.titleEn ?? '',
    text1En: sanityDoc?.text1En ?? '',
    text2En: sanityDoc?.text2En ?? '',
    subheadingEn: sanityDoc?.subheadingEn ?? '',
  }

  return (
    <div>
      <h1 className="mb-4">Fitout Management Sayfası</h1>
      <p className="text-muted mb-4">
        Bu form, sitedeki &quot;Fitout Management&quot; sayfasının içeriğini düzenler.
      </p>
      <FitoutForm initial={initial} />
    </div>
  )
}
