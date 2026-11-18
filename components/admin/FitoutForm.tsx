'use client'

import {useState} from 'react'
import {useRouter} from 'next/navigation'
import {uploadFile} from '@/lib/adminUpload'
import {CompletedProjectsPreviewSlider} from './CompletedProjectsPreviewSlider'

type ImageValue = {assetId: string; previewUrl: string} | null
type ServiceItem = {key: string; title: string; text: string; titleEn: string; textEn: string}
type CompletedProject = {key: string; image: ImageValue; title: string; location: string; year: string; order: string}

export interface FitoutFormInitial {
  heroImage: ImageValue
  title: string
  text1: string
  text2: string
  subheading: string
  services: ServiceItem[]
  completedProjects: CompletedProject[]
  titleEn: string
  text1En: string
  text2En: string
  subheadingEn: string
}

export function FitoutForm({initial}: {initial: FitoutFormInitial}) {
  const router = useRouter()
  const [values, setValues] = useState<FitoutFormInitial>(initial)
  const [saving, setSaving] = useState(false)
  const [translating, setTranslating] = useState(false)
  const [uploadingHero, setUploadingHero] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const set = <K extends keyof FitoutFormInitial>(key: K, value: FitoutFormInitial[K]) =>
    setValues((v) => ({...v, [key]: value}))

  const handleHeroUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingHero(true)
    setError('')
    try {
      const uploaded = await uploadFile(file)
      set('heroImage', uploaded)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Görsel yüklenemedi')
    }
    setUploadingHero(false)
  }

  const addService = () => {
    set('services', [...values.services, {key: Math.random().toString(36).slice(2, 10), title: '', text: '', titleEn: '', textEn: ''}])
  }

  const updateService = (key: string, patch: Partial<ServiceItem>) => {
    set('services', values.services.map((s) => (s.key === key ? {...s, ...patch} : s)))
  }

  const removeService = (key: string) => {
    set('services', values.services.filter((s) => s.key !== key))
  }

  const addCompletedProject = () => {
    set('completedProjects', [
      ...values.completedProjects,
      {key: Math.random().toString(36).slice(2, 10), image: null, title: '', location: '', year: '', order: ''},
    ])
  }

  const updateCompletedProject = (key: string, patch: Partial<CompletedProject>) => {
    set('completedProjects', values.completedProjects.map((p) => (p.key === key ? {...p, ...patch} : p)))
  }

  const removeCompletedProject = (key: string) => {
    set('completedProjects', values.completedProjects.filter((p) => p.key !== key))
  }

  const [uploadingProjectKey, setUploadingProjectKey] = useState<string | null>(null)

  const handleProjectImageUpload = async (key: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingProjectKey(key)
    setError('')
    try {
      const uploaded = await uploadFile(file)
      updateCompletedProject(key, {image: uploaded})
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Görsel yüklenemedi')
    }
    setUploadingProjectKey(null)
  }

  const handleTranslate = async () => {
    setTranslating(true)
    setError('')
    try {
      const texts = [
        values.title,
        values.text1,
        values.text2,
        values.subheading,
        ...values.services.flatMap((s) => [s.title, s.text]),
      ]
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({texts, sourceLang: 'TR', targetLang: 'EN'}),
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      const translations = data.translations as string[]
      const [titleEn, text1En, text2En, subheadingEn, ...serviceTranslations] = translations

      const services = values.services.map((s, i) => ({
        ...s,
        titleEn: serviceTranslations[i * 2] ?? s.titleEn,
        textEn: serviceTranslations[i * 2 + 1] ?? s.textEn,
      }))

      setValues((v) => ({...v, titleEn, text1En, text2En, subheadingEn, services}))
    } catch {
      setError('Çeviri başarısız oldu.')
    }
    setTranslating(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSaved(false)

    const payload = {
      heroImage: values.heroImage
        ? {_type: 'image', asset: {_type: 'reference', _ref: values.heroImage.assetId}}
        : undefined,
      title: values.title,
      text1: values.text1,
      text2: values.text2,
      subheading: values.subheading,
      services: values.services.map((s) => ({_key: s.key, _type: 'serviceItem', title: s.title, text: s.text})),
      completedProjects: values.completedProjects
        .filter((p) => p.image)
        .map((p) => ({
          _key: p.key,
          _type: 'completedProject',
          image: {_type: 'image', asset: {_type: 'reference', _ref: p.image!.assetId}},
          title: p.title,
          location: p.location,
          year: p.year ? Number(p.year) : undefined,
          order: p.order !== '' ? Number(p.order) : undefined,
        })),
      titleEn: values.titleEn,
      text1En: values.text1En,
      text2En: values.text2En,
      subheadingEn: values.subheadingEn,
      servicesEn: values.services.map((s) => ({_key: s.key, _type: 'serviceItemEn', title: s.titleEn, text: s.textEn})),
    }

    const res = await fetch('/api/admin/fitout', {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(payload),
    })

    setSaving(false)
    if (!res.ok) {
      setError('Kaydedilemedi')
      return
    }

    setSaved(true)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Kapak Görseli</h3>
        </div>
        <div className="card-body">
          {values.heroImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={values.heroImage.previewUrl} alt="" className="img-fluid mb-2 rounded" style={{maxHeight: 240, objectFit: 'cover'}} />
          )}
          <input type="file" accept="image/*" className="form-control-file" onChange={handleHeroUpload} />
          {uploadingHero && <small className="text-muted">Yükleniyor...</small>}
        </div>
      </div>

      <div className="row">
        <div className="col-lg-6">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">🇹🇷 Türkçe İçerik</h3>
            </div>
            <div className="card-body">
              <div className="form-group">
                <label>Başlık *</label>
                <input
                  className="form-control"
                  required
                  value={values.title}
                  onChange={(e) => set('title', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Metin 1 * <small className="text-muted">(kalın yazmak için **böyle** yazın)</small></label>
                <textarea
                  className="form-control"
                  rows={5}
                  required
                  value={values.text1}
                  onChange={(e) => set('text1', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Metin 2 *</label>
                <textarea
                  className="form-control"
                  rows={5}
                  required
                  value={values.text2}
                  onChange={(e) => set('text2', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Alt Başlık *</label>
                <input
                  className="form-control"
                  required
                  value={values.subheading}
                  onChange={(e) => set('subheading', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h3 className="card-title">🇬🇧 İngilizce (Otomatik Çeviri)</h3>
              <button
                type="button"
                className="btn btn-sm btn-outline-primary"
                onClick={handleTranslate}
                disabled={translating || !values.title || !values.text1}
              >
                {translating ? 'Çevriliyor...' : "Türkçe'den Çevir"}
              </button>
            </div>
            <div className="card-body">
              <div className="form-group">
                <label>Title</label>
                <input className="form-control" value={values.titleEn} readOnly />
              </div>
              <div className="form-group">
                <label>Text 1</label>
                <textarea className="form-control" rows={5} value={values.text1En} readOnly />
              </div>
              <div className="form-group">
                <label>Text 2</label>
                <textarea className="form-control" rows={5} value={values.text2En} readOnly />
              </div>
              <div className="form-group">
                <label>Subheading</label>
                <input className="form-control" value={values.subheadingEn} readOnly />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h3 className="card-title">Hizmetler / Süreç Adımları</h3>
          <button type="button" className="btn btn-sm btn-outline-primary" onClick={addService}>
            <i className="fas fa-plus mr-1" /> Ekle
          </button>
        </div>
        <div className="card-body">
          {values.services.map((s) => (
            <div key={s.key} className="border rounded p-3 mb-3">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <strong>Hizmet</strong>
                <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => removeService(s.key)}>
                  <i className="fas fa-trash" />
                </button>
              </div>
              <div className="form-group">
                <label className="small">Başlık (TR)</label>
                <input className="form-control" value={s.title} onChange={(e) => updateService(s.key, {title: e.target.value})} />
              </div>
              <div className="form-group mb-0">
                <label className="small">Açıklama (TR)</label>
                <textarea className="form-control" rows={2} value={s.text} onChange={(e) => updateService(s.key, {text: e.target.value})} />
              </div>
              {(s.titleEn || s.textEn) && (
                <p className="small text-muted mt-2 mb-0">EN: {s.titleEn} — {s.textEn}</p>
              )}
            </div>
          ))}
          {values.services.length === 0 && <p className="text-muted mb-0">Henüz hizmet eklenmedi.</p>}
        </div>
      </div>

      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h3 className="card-title">Tamamlanmış Projeler</h3>
          <button type="button" className="btn btn-sm btn-outline-primary" onClick={addCompletedProject}>
            <i className="fas fa-plus mr-1" /> Ekle
          </button>
        </div>
        <div className="card-body">
          {values.completedProjects.map((p) => (
            <div key={p.key} className="border rounded p-3 mb-3">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <strong>Proje</strong>
                <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => removeCompletedProject(p.key)}>
                  <i className="fas fa-trash" />
                </button>
              </div>
              {p.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.image.previewUrl} alt="" className="img-fluid mb-2 rounded" style={{maxHeight: 160, objectFit: 'cover'}} />
              )}
              <div className="form-group">
                <label className="small">Görsel</label>
                <input
                  type="file"
                  accept="image/*"
                  className="form-control-file"
                  onChange={(e) => handleProjectImageUpload(p.key, e)}
                />
                {uploadingProjectKey === p.key && <small className="text-muted">Yükleniyor...</small>}
              </div>
              <div className="form-group">
                <label className="small">Proje Adı</label>
                <input className="form-control" value={p.title} onChange={(e) => updateCompletedProject(p.key, {title: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="small">Konum</label>
                <input className="form-control" value={p.location} onChange={(e) => updateCompletedProject(p.key, {location: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="small">Yıl</label>
                <input
                  type="number"
                  className="form-control"
                  value={p.year}
                  onChange={(e) => updateCompletedProject(p.key, {year: e.target.value})}
                />
              </div>
              <div className="form-group mb-0">
                <label className="small">Sıra No</label>
                <input
                  type="number"
                  min={1}
                  className="form-control"
                  placeholder="Örn. 1"
                  value={p.order}
                  onChange={(e) => updateCompletedProject(p.key, {order: e.target.value})}
                />
                <small className="text-muted">Küçük numara önce gösterilir. Boş bırakılanlar en sona, yeniden eskiye yıla göre dizilir.</small>
              </div>
            </div>
          ))}
          {values.completedProjects.length === 0 && <p className="text-muted mb-0">Henüz proje eklenmedi.</p>}
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Canlı Önizleme (Slider)</h3>
        </div>
        <div className="card-body">
          <CompletedProjectsPreviewSlider projects={values.completedProjects} />
        </div>
      </div>

      {error && <p className="text-danger">{error}</p>}
      {saved && <p className="text-success">Kaydedildi.</p>}

      <button type="submit" className="btn btn-primary" disabled={saving}>
        {saving ? 'Kaydediliyor...' : 'Kaydet'}
      </button>
    </form>
  )
}
