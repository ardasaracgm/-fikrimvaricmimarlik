import Link from 'next/link'
import {redirect} from 'next/navigation'
import {client} from '@/sanity/lib/client'
import {groq} from 'next-sanity'
import {isAdminAuthenticated} from '@/lib/adminAuth'

export default async function AdminDashboardHome() {
  if (!(await isAdminAuthenticated())) redirect('/admin/login')

  const [total, published] = await Promise.all([
    client.fetch<number>(groq`count(*[_type == "project"])`),
    client.fetch<number>(groq`count(*[_type == "project" && isPublished == true])`),
  ])

  return (
    <div>
      <h1 className="mb-4">Panel</h1>

      <div className="row">
        <div className="col-lg-3 col-6">
          <div className="small-box bg-info">
            <div className="inner">
              <h3>{total}</h3>
              <p>Toplam Proje</p>
            </div>
            <div className="icon">
              <i className="fas fa-building" />
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-6">
          <div className="small-box bg-success">
            <div className="inner">
              <h3>{published}</h3>
              <p>Yayında</p>
            </div>
            <div className="icon">
              <i className="fas fa-check-circle" />
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-6">
          <div className="small-box bg-warning">
            <div className="inner">
              <h3>{total - published}</h3>
              <p>Taslak</p>
            </div>
            <div className="icon">
              <i className="fas fa-pencil-alt" />
            </div>
          </div>
        </div>
      </div>

      <Link href="/admin/projects/new" className="btn btn-primary">
        <i className="fas fa-plus mr-1" /> Yeni Proje Ekle
      </Link>
    </div>
  )
}
