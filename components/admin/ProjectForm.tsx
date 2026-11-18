'use client'

import {useState} from 'react'
import {useRouter} from 'next/navigation'
import {textToPortableText, portableTextToText} from '@/lib/portableText'
import {uploadFile} from '@/lib/adminUpload'

type ImageValue = {assetId: string; previewUrl: string} | null
type GalleryItemValue = {key: string; assetId: string; previewUrl: string; size: 'full' | 'wide' | 'medium' | 'narrow'}

export interface ProjectFormInitial {
  id?: string
  title: string
  slug: string
  location: string
  category: string
  year: string
  area: string
  concept: string
  pullQuote: string
  details: string
  titleEn: string
  locationEn: string
  conceptEn: string
  pullQuoteEn: string
  detailsEn: string
  order: string
  isPublished: boolean
  heroImage: ImageValue
  gallery1: GalleryItemValue[]
  gallery2: GalleryItemValue[]
}

const EMPTY: ProjectFormInitial = {
  title: '',
  slug: '',
  location: '',
  category: 'konut',
  year: new Date().getFullYear().toString(),
  area: '',
  concept: '',
  pullQuote: '',
  details: '',
  titleEn: '',
  locationEn: '',
  conceptEn: '',
  pullQuoteEn: '',
  detailsEn: '',
  order: '100',
  isPublished: false,
  heroImage: null,
  gallery1: [],
  gallery2: [],
}

function slugify(text: string): string {
  const trMap: Record<string, string> = {ç: 'c', ğ: 'g', ı: 'i', ö: 'o', ş: 's', ü: 'u', Ç: 'c', Ğ: 'g', İ: 'i', Ö: 'o', Ş: 's', Ü: 'u'}
  return text
    .split('')
    .map((ch) => trMap[ch] ?? ch)
    .join('')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 96)
}

export function ProjectForm({initial}: {initial?: ProjectFormInitial}) {
  const router = useRouter()
  const isEdit = Boolean(initial?.id)
  const [values, setValues] = useState<ProjectFormInitial>(initial ?? EMPTY)
  const [slugTouched, setSlugTouched] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [translating, setTranslating] = useState(false)
  const [uploadingHero, setUploadingHero] = useState(false)
  const [error, setError] = useState('')

  const set = <K extends keyof ProjectFormInitial>(key: K, value: ProjectFormInitial[K]) =>
    setValues((v) => ({...v, [key]: value}))

  const handleTitleChange = (title: string) => {
    set('title', title)
    if (!slugTouched) set('slug', slugify(title))
  }

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

  const handleGalleryUpload = async (
    galleryKey: 'gallery1' | 'gallery2',
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files ?? [])
    if (files.length === 0) return
    setError('')
    try {
      const uploaded = await Promise.all(files.map(uploadFile))
      const newItems: GalleryItemValue[] = uploaded.map((u) => ({
        key: Math.random().toString(36).slice(2, 10),
        assetId: u.assetId,
        previewUrl: u.previewUrl,
        size: 'medium',
      }))
      set(galleryKey, [...values[galleryKey], ...newItems])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Galeri görselleri yüklenemedi')
    }
    e.target.value = ''
  }

  const updateGalleryItemSize = (
    galleryKey: 'gallery1' | 'gallery2',
    key: string,
    size: GalleryItemValue['size']
  ) => {
    set(
      galleryKey,
      values[galleryKey].map((item) => (item.key === key ? {...item, size} : item))
    )
  }

  const removeGalleryItem = (galleryKey: 'gallery1' | 'gallery2', key: string) => {
    set(galleryKey, values[galleryKey].filter((item) => item.key !== key))
  }

  const handleTranslate = async () => {
    setTranslating(true)
    setError('')
    try {
      const texts = [values.title, values.location, values.concept, values.pullQuote, values.details]
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({texts, sourceLang: 'TR', targetLang: 'EN'}),
      })
      if (!res.ok) throw new Error('Çeviri başarısız')
      const data = await res.json()
      const [titleEn, locationEn, conceptEn, pullQuoteEn, detailsEn] = data.translations as string[]
      setValues((v) => ({...v, titleEn, locationEn, conceptEn, pullQuoteEn, detailsEn}))
    } catch {
      setError('Çeviri başarısız oldu — DEEPL_API_KEY tanımlı mı kontrol edin.')
    }
    setTranslating(false)
  }

  const imageValueToSanity = (img: ImageValue) =>
    img ? {_type: 'image', asset: {_type: 'reference', _ref: img.assetId}} : undefined

  const galleryToSanity = (items: GalleryItemValue[]) =>
    items.map((item) => ({
      _key: item.key,
      _type: 'galleryItem',
      size: item.size,
      image: {_type: 'image', asset: {_type: 'reference', _ref: item.assetId}},
    }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    const payload = {
      title: values.title,
      slug: {_type: 'slug', current: values.slug},
      location: values.location,
      category: values.category,
      year: Number(values.year),
      area: values.area || undefined,
      concept: textToPortableText(values.concept),
      pullQuote: values.pullQuote || undefined,
      details: values.details ? textToPortableText(values.details) : undefined,
      titleEn: values.titleEn || undefined,
      locationEn: values.locationEn || undefined,
      conceptEn: values.conceptEn ? textToPortableText(values.conceptEn) : undefined,
      pullQuoteEn: values.pullQuoteEn || undefined,
      detailsEn: values.detailsEn ? textToPortableText(values.detailsEn) : undefined,
      order: Number(values.order) || 100,
      isPublished: values.isPublished,
      heroImage: imageValueToSanity(values.heroImage),
      gallery1: galleryToSanity(values.gallery1),
      gallery2: galleryToSanity(values.gallery2),
    }

    const res = isEdit
      ? await fetch(`/api/admin/projects/${initial!.id}`, {
          method: 'PATCH',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(payload),
        })
      : await fetch('/api/admin/projects', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(payload),
        })

    setSaving(false)
    if (!res.ok) {
      setError('Kaydedilemedi')
      return
    }

    router.push('/admin/projects')
    router.refresh()
  }

  const sizeOptions: {value: GalleryItemValue['size']; label: string}[] = [
    {value: 'full', label: 'Tam Genişlik'},
    {value: 'wide', label: 'Geniş'},
    {value: 'medium', label: 'Orta'},
    {value: 'narrow', label: 'Dar / Dikey'},
  ]

  return (
    <form onSubmit={handleSubmit}>
      <div className="row">
        <div className="col-lg-8">
          {/* Türkçe İçerik */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">🇹🇷 Türkçe İçerik</h3>
            </div>
            <div className="card-body">
              <div className="form-group">
                <label>Proje Adı *</label>
                <input
                  className="form-control"
                  required
                  value={values.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>URL (slug) *</label>
                <input
                  className="form-control"
                  required
                  value={values.slug}
                  onChange={(e) => {
                    setSlugTouched(true)
                    set('slug', e.target.value)
                  }}
                />
              </div>
              <div className="form-group">
                <label>Konum *</label>
                <input
                  className="form-control"
                  required
                  placeholder="İstanbul, Türkiye"
                  value={values.location}
                  onChange={(e) => set('location', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Kategori *</label>
                <select
                  className="form-control"
                  value={values.category}
                  onChange={(e) => set('category', e.target.value)}
                >
                  <option value="konut">Konut</option>
                  <option value="ofis">Ofis</option>
                  <option value="ticari">Ticari</option>
                  <option value="magaza">Mağaza</option>
                </select>
              </div>
              <div className="form-group">
                <label>Konsept Metni * (paragraflar arasına boş satır bırakın)</label>
                <textarea
                  className="form-control"
                  rows={6}
                  required
                  value={values.concept}
                  onChange={(e) => set('concept', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Vurgu Cümlesi (opsiyonel)</label>
                <textarea
                  className="form-control"
                  rows={2}
                  value={values.pullQuote}
                  onChange={(e) => set('pullQuote', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Detay Metni (opsiyonel)</label>
                <textarea
                  className="form-control"
                  rows={6}
                  value={values.details}
                  onChange={(e) => set('details', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* İngilizce (Otomatik) */}
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h3 className="card-title">🇬🇧 İngilizce (Otomatik Çeviri)</h3>
              <button
                type="button"
                className="btn btn-sm btn-outline-primary"
                onClick={handleTranslate}
                disabled={translating || !values.title || !values.concept}
              >
                {translating ? 'Çevriliyor...' : 'Türkçe\'den Çevir'}
              </button>
            </div>
            <div className="card-body">
              <div className="form-group">
                <label>Project Title</label>
                <input className="form-control" value={values.titleEn} readOnly />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input className="form-control" value={values.locationEn} readOnly />
              </div>
              <div className="form-group">
                <label>Concept</label>
                <textarea className="form-control" rows={4} value={values.conceptEn} readOnly />
              </div>
              <div className="form-group">
                <label>Pull Quote</label>
                <textarea className="form-control" rows={2} value={values.pullQuoteEn} readOnly />
              </div>
              <div className="form-group">
                <label>Details</label>
                <textarea className="form-control" rows={4} value={values.detailsEn} readOnly />
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          {/* Bilgiler & Galeri */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Bilgiler & Galeri</h3>
            </div>
            <div className="card-body">
              <div className="form-group">
                <label>Yıl *</label>
                <input
                  type="number"
                  className="form-control"
                  required
                  min={2000}
                  max={2100}
                  value={values.year}
                  onChange={(e) => set('year', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Alan</label>
                <input
                  className="form-control"
                  placeholder="220 m²"
                  value={values.area}
                  onChange={(e) => set('area', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Sıra No</label>
                <input
                  type="number"
                  min={1}
                  className="form-control"
                  placeholder="Örn. 1"
                  value={values.order}
                  onChange={(e) => set('order', e.target.value)}
                />
                <small className="text-muted">Küçük numara önce gösterilir (Projeler sayfası ve &quot;Sonraki Proje&quot;). Numara sitede görünmez.</small>
              </div>
              <div className="form-group">
                <label>Hero Görseli *</label>
                {values.heroImage && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={values.heroImage.previewUrl} alt="" className="img-fluid mb-2 rounded" />
                )}
                <input type="file" accept="image/*" className="form-control-file" onChange={handleHeroUpload} />
                {uploadingHero && <small className="text-muted">Yükleniyor...</small>}
              </div>
              <div className="custom-control custom-switch">
                <input
                  type="checkbox"
                  className="custom-control-input"
                  id="isPublished"
                  checked={values.isPublished}
                  onChange={(e) => set('isPublished', e.target.checked)}
                />
                <label className="custom-control-label" htmlFor="isPublished">
                  Yayında
                </label>
              </div>
            </div>
          </div>

          {(['gallery1', 'gallery2'] as const).map((galleryKey) => (
            <div className="card" key={galleryKey}>
              <div className="card-header">
                <h3 className="card-title">{galleryKey === 'gallery1' ? 'Galeri 1' : 'Galeri 2 (opsiyonel)'}</h3>
              </div>
              <div className="card-body">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="form-control-file mb-3"
                  onChange={(e) => handleGalleryUpload(galleryKey, e)}
                />
                {values[galleryKey].map((item) => (
                  <div key={item.key} className="d-flex align-items-center gap-2 mb-2 border-bottom pb-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.previewUrl} alt="" style={{width: 60, height: 45, objectFit: 'cover'}} className="rounded mr-2" />
                    <select
                      className="form-control form-control-sm mr-2"
                      style={{width: 140}}
                      value={item.size}
                      onChange={(e) => updateGalleryItemSize(galleryKey, item.key, e.target.value as GalleryItemValue['size'])}
                    >
                      {sizeOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => removeGalleryItem(galleryKey, item.key)}
                    >
                      <i className="fas fa-trash" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {error && <p className="text-danger">{error}</p>}

      <button type="submit" className="btn btn-primary" disabled={saving || !values.heroImage}>
        {saving ? 'Kaydediliyor...' : isEdit ? 'Güncelle' : 'Kaydet'}
      </button>
    </form>
  )
}
