'use client'

import {useState} from 'react'
import Link from 'next/link'
import {useRouter} from 'next/navigation'

export function ProjectRowActions({
  id,
  title,
  isPublished,
}: {
  id: string
  title: string
  isPublished: boolean
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const togglePublish = async () => {
    setLoading(true)
    await fetch(`/api/admin/projects/${id}`, {
      method: 'PATCH',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({isPublished: !isPublished}),
    })
    setLoading(false)
    router.refresh()
  }

  const handleDelete = async () => {
    if (!confirm(`"${title}" projesini silmek istediğinize emin misiniz?`)) return
    setLoading(true)
    await fetch(`/api/admin/projects/${id}`, {method: 'DELETE'})
    setLoading(false)
    router.refresh()
  }

  return (
    <div className="btn-group">
      <button
        type="button"
        className="btn btn-sm btn-outline-secondary"
        onClick={togglePublish}
        disabled={loading}
        title={isPublished ? 'Yayından kaldır' : 'Yayınla'}
      >
        <i className={`fas ${isPublished ? 'fa-eye-slash' : 'fa-eye'}`} />
      </button>
      <Link href={`/admin/projects/${id}`} className="btn btn-sm btn-outline-primary">
        <i className="fas fa-edit" />
      </Link>
      <button
        type="button"
        className="btn btn-sm btn-outline-danger"
        onClick={handleDelete}
        disabled={loading}
      >
        <i className="fas fa-trash" />
      </button>
    </div>
  )
}
