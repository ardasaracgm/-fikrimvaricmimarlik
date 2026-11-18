import {redirect} from 'next/navigation'
import {isAdminAuthenticated} from '@/lib/adminAuth'
import {AdminShell} from '@/components/admin/AdminShell'

export default async function AdminDashboardLayout({children}: {children: React.ReactNode}) {
  const authed = await isAdminAuthenticated()
  if (!authed) redirect('/admin/login')

  return (
    <>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/admin-lte@3.2/dist/css/adminlte.min.css" />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
      <AdminShell>{children}</AdminShell>
    </>
  )
}
