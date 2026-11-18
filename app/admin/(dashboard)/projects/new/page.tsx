import {redirect} from 'next/navigation'
import {isAdminAuthenticated} from '@/lib/adminAuth'
import {ProjectForm} from '@/components/admin/ProjectForm'

export default async function NewProjectPage() {
  if (!(await isAdminAuthenticated())) redirect('/admin/login')

  return (
    <div>
      <h1 className="mb-4">Yeni Proje</h1>
      <ProjectForm />
    </div>
  )
}
