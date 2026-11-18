import Link from 'next/link'
import {redirect} from 'next/navigation'
import {groq} from 'next-sanity'
import {client} from '@/sanity/lib/client'
import {urlFor} from '@/sanity/lib/image'
import {isAdminAuthenticated} from '@/lib/adminAuth'
import {ProjectRowActions} from '@/components/admin/ProjectRowActions'

type AdminProjectRow = {
  _id: string
  title: string
  slug: string
  category: string
  year: number
  isPublished: boolean
  order: number
  heroImage: any
}

const adminProjectsQuery = groq`
  *[_type == "project"] | order(order asc, _createdAt desc) {
    _id,
    title,
    "slug": slug.current,
    category,
    year,
    isPublished,
    order,
    heroImage
  }
`

const categoryLabel: Record<string, string> = {
  konut: 'Konut',
  ofis: 'Ofis',
  ticari: 'Ticari',
  magaza: 'Mağaza',
}

export default async function AdminProjectsListPage() {
  if (!(await isAdminAuthenticated())) redirect('/admin/login')

  const projects = await client.fetch<AdminProjectRow[]>(adminProjectsQuery)

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Projeler</h1>
        <Link href="/admin/projects/new" className="btn btn-primary">
          <i className="fas fa-plus mr-1" /> Yeni Proje
        </Link>
      </div>

      <div className="card">
        <div className="card-body p-0">
          <table className="table table-hover mb-0">
            <thead>
              <tr>
                <th style={{width: 80}}>Sıra No</th>
                <th style={{width: 70}}></th>
                <th>Proje Adı</th>
                <th>Kategori</th>
                <th>Yıl</th>
                <th>Durum</th>
                <th style={{width: 160}} className="text-right">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p._id}>
                  <td className="align-middle font-weight-bold">{p.order ?? '—'}</td>
                  <td>
                    {p.heroImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={urlFor(p.heroImage).width(80).height(60).url()}
                        alt=""
                        style={{width: 60, height: 45, objectFit: 'cover', borderRadius: 4}}
                      />
                    ) : (
                      <div
                        style={{
                          width: 60,
                          height: 45,
                          background: '#eee',
                          borderRadius: 4,
                        }}
                      />
                    )}
                  </td>
                  <td className="align-middle">{p.title}</td>
                  <td className="align-middle">{categoryLabel[p.category] ?? p.category}</td>
                  <td className="align-middle">{p.year}</td>
                  <td className="align-middle">
                    <span className={`badge ${p.isPublished ? 'badge-success' : 'badge-secondary'}`}>
                      {p.isPublished ? 'Yayında' : 'Taslak'}
                    </span>
                  </td>
                  <td className="align-middle text-right">
                    <ProjectRowActions id={p._id} title={p.title} isPublished={p.isPublished} />
                  </td>
                </tr>
              ))}
              {projects.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center text-muted py-5">
                    Henüz proje eklenmedi.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
