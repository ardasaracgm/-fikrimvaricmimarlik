import {useState} from 'react'
import {DocumentActionComponent, useClient, SanityDocument} from 'sanity'

// Portable Text bloklarından düz metin çıkarır (sadece string'leri toplar)
function extractTextFromBlocks(blocks: any[]): string[] {
  if (!Array.isArray(blocks)) return []
  return blocks
    .filter((b) => b._type === 'block')
    .map((b) =>
      (b.children || [])
        .filter((c: any) => c._type === 'span')
        .map((c: any) => c.text || '')
        .join('')
    )
    .filter(Boolean)
}

// Düz metin dizisini portable text bloklarına dönüştürür
function textsToBlocks(texts: string[]): any[] {
  return texts.map((text) => ({
    _type: 'block',
    _key: Math.random().toString(36).slice(2, 11),
    style: 'normal',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: Math.random().toString(36).slice(2, 11),
        text,
        marks: [],
      },
    ],
  }))
}

export const TranslateAction: DocumentActionComponent = (props) => {
  const {draft, published, id, type} = props
  const client = useClient({apiVersion: '2024-01-01'})
  const [isLoading, setIsLoading] = useState(false)

  // Sadece project tipi için göster
  if (type !== 'project') return null

  const doc = (draft || published) as SanityDocument | null
  if (!doc) return null

  return {
    label: isLoading ? 'Çevriliyor...' : '🌍 İngilizce\'ye Çevir',
    disabled: isLoading,
    onHandle: async () => {
      setIsLoading(true)
      try {
        // 1. Türkçe alanları topla
        const title = (doc as any).title as string | undefined
        const location = (doc as any).location as string | undefined
        const pullQuote = (doc as any).pullQuote as string | undefined
        const concept = (doc as any).concept as any[] | undefined
        const details = (doc as any).details as any[] | undefined

        const conceptTexts = extractTextFromBlocks(concept || [])
        const detailsTexts = extractTextFromBlocks(details || [])

        // Tüm metinleri tek bir listeye topla (sıra önemli!)
        const allTexts: string[] = []
        const tracker: {
          titleIdx?: number
          locationIdx?: number
          pullQuoteIdx?: number
          conceptStart: number
          conceptLen: number
          detailsStart: number
          detailsLen: number
        } = {
          conceptStart: 0,
          conceptLen: 0,
          detailsStart: 0,
          detailsLen: 0,
        }

        if (title) {
          tracker.titleIdx = allTexts.length
          allTexts.push(title)
        }
        if (location) {
          tracker.locationIdx = allTexts.length
          allTexts.push(location)
        }
        if (pullQuote) {
          tracker.pullQuoteIdx = allTexts.length
          allTexts.push(pullQuote)
        }
        tracker.conceptStart = allTexts.length
        tracker.conceptLen = conceptTexts.length
        allTexts.push(...conceptTexts)
        tracker.detailsStart = allTexts.length
        tracker.detailsLen = detailsTexts.length
        allTexts.push(...detailsTexts)

        if (allTexts.length === 0) {
          alert('Çevrilecek Türkçe içerik bulunamadı.')
          setIsLoading(false)
          return
        }

        // 2. /api/translate endpoint'ine yolla
        const res = await fetch('/api/translate', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({texts: allTexts}),
        })

        if (!res.ok) {
          const err = await res.json().catch(() => ({}))
          throw new Error(err.error || `Hata: ${res.status}`)
        }

        const {translations} = (await res.json()) as {translations: string[]}

        // 3. Gelen çevirileri ilgili EN alanlarına eşle
        const patch: Record<string, any> = {}
        if (tracker.titleIdx !== undefined) {
          patch.titleEn = translations[tracker.titleIdx]
        }
        if (tracker.locationIdx !== undefined) {
          patch.locationEn = translations[tracker.locationIdx]
        }
        if (tracker.pullQuoteIdx !== undefined) {
          patch.pullQuoteEn = translations[tracker.pullQuoteIdx]
        }
        if (tracker.conceptLen > 0) {
          patch.conceptEn = textsToBlocks(
            translations.slice(
              tracker.conceptStart,
              tracker.conceptStart + tracker.conceptLen
            )
          )
        }
        if (tracker.detailsLen > 0) {
          patch.detailsEn = textsToBlocks(
            translations.slice(
              tracker.detailsStart,
              tracker.detailsStart + tracker.detailsLen
            )
          )
        }

        // 4. Sanity dokümanını güncelle
        await client.patch(id).set(patch).commit()

        alert('Çeviri başarıyla yapıldı ✓ İngilizce sekmesini kontrol edebilirsiniz.')
      } catch (err: any) {
        console.error(err)
        alert(`Hata: ${err.message || 'Bilinmeyen hata'}`)
      } finally {
        setIsLoading(false)
      }
    },
  }
}