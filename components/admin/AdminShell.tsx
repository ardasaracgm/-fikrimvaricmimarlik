'use client'

import {useEffect, useState} from 'react'
import Link from 'next/link'
import {usePathname, useRouter} from 'next/navigation'

const NAV_ITEMS = [
  {href: '/admin', icon: 'fas fa-tachometer-alt', label: 'Panel', exact: true},
  {href: '/admin/projects', icon: 'fas fa-building', label: 'Projeler', exact: false},
  {href: '/admin/fitout', icon: 'fas fa-clipboard-list', label: 'Fitout Management', exact: false},
]

export function AdminShell({children}: {children: React.ReactNode}) {
  const pathname = usePathname()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)

  // AdminLTE'nin CSS'i body.sidebar-mini.layout-fixed seçicilerine dayanıyor —
  // ana sitenin body'sini etkilememek için bu class'lar sadece admin
  // panelindeyken eklenip çıkışta temizleniyor.
  useEffect(() => {
    document.body.classList.add('hold-transition', 'sidebar-mini', 'layout-fixed')
    return () => {
      document.body.classList.remove('hold-transition', 'sidebar-mini', 'layout-fixed', 'sidebar-collapse')
    }
  }, [])

  useEffect(() => {
    document.body.classList.toggle('sidebar-collapse', collapsed)
  }, [collapsed])

  const handleLogout = async () => {
    await fetch('/api/admin/logout', {method: 'POST'})
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <div className="wrapper">
      {/* Navbar */}
      <nav className="main-header navbar navbar-expand navbar-white navbar-light">
        <ul className="navbar-nav">
          <li className="nav-item">
            <button
              type="button"
              className="nav-link btn btn-link"
              onClick={() => setCollapsed((c) => !c)}
              aria-label="Menüyü aç/kapat"
            >
              <i className="fas fa-bars" />
            </button>
          </li>
          <li className="nav-item d-none d-sm-inline-block">
            <Link href="/tr" target="_blank" className="nav-link">
              Siteyi Görüntüle ↗
            </Link>
          </li>
        </ul>
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <button type="button" className="nav-link btn btn-link" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt mr-1" /> Çıkış Yap
            </button>
          </li>
        </ul>
      </nav>

      {/* Sidebar */}
      <aside className="main-sidebar sidebar-dark-primary elevation-4">
        <Link href="/admin" className="brand-link">
          <span className="brand-text font-weight-light ml-2">Hauzart Admin</span>
        </Link>
        <div className="sidebar">
          <nav className="mt-2">
            <ul className="nav nav-pills nav-sidebar flex-column" role="menu">
              {NAV_ITEMS.map((item) => {
                const active = item.exact ? pathname === item.href : pathname.startsWith(item.href)
                return (
                  <li className="nav-item" key={item.href}>
                    <Link href={item.href} className={`nav-link ${active ? 'active' : ''}`}>
                      <i className={`nav-icon ${item.icon}`} />
                      <p>{item.label}</p>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>
      </aside>

      {/* Content */}
      <div className="content-wrapper">
        <div className="content p-4">{children}</div>
      </div>

      <footer className="main-footer text-center text-muted small">Hauzart Admin Paneli</footer>
    </div>
  )
}
