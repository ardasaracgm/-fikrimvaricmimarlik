import {NextRequest, NextResponse} from 'next/server'

export const runtime = 'nodejs'

type TranslateRequest = {
  texts: string[]
  sourceLang?: string
  targetLang?: string
}

// MyMemory (ücretsiz, anahtar/kayıt gerektirmeyen çeviri API'si) tek istekte
// ~500 karakterle sınırlı — daha uzun metinleri cümle sınırlarından bölüp
// ayrı ayrı çevirip birleştiriyoruz.
const MAX_CHUNK_LENGTH = 450

function splitIntoChunks(text: string): string[] {
  if (text.length <= MAX_CHUNK_LENGTH) return [text]

  const sentences = text.split(/(?<=[.!?])\s+/)
  const chunks: string[] = []
  let current = ''

  for (const sentence of sentences) {
    if ((current + ' ' + sentence).trim().length > MAX_CHUNK_LENGTH && current) {
      chunks.push(current.trim())
      current = sentence
    } else {
      current = (current + ' ' + sentence).trim()
    }
  }
  if (current) chunks.push(current.trim())

  return chunks
}

async function translateChunk(chunk: string, langpair: string): Promise<string> {
  const url = new URL('https://api.mymemory.translated.net/get')
  url.searchParams.set('q', chunk)
  url.searchParams.set('langpair', langpair)

  const r = await fetch(url.toString())
  if (!r.ok) throw new Error(`MyMemory hatası: ${r.status}`)

  const data = await r.json()
  const translated = data?.responseData?.translatedText
  if (!translated) throw new Error('Çeviri alınamadı')
  return translated
}

async function translateText(text: string, langpair: string): Promise<string> {
  if (!text.trim()) return ''
  const chunks = splitIntoChunks(text)
  const translated = await Promise.all(chunks.map((chunk) => translateChunk(chunk, langpair)))
  return translated.join(' ')
}

export async function POST(req: NextRequest) {
  try {
    const body: TranslateRequest = await req.json()
    const {texts, sourceLang = 'TR', targetLang = 'EN'} = body

    if (!Array.isArray(texts) || texts.length === 0) {
      return NextResponse.json({error: 'texts boş olamaz'}, {status: 400})
    }

    const langpair = `${sourceLang.toLowerCase()}|${targetLang.toLowerCase()}`
    const translations = await Promise.all(texts.map((t) => translateText(t, langpair)))

    return NextResponse.json({translations})
  } catch (err: any) {
    console.error('[translate] HATA:', err)
    return NextResponse.json({error: err.message || 'Bilinmeyen hata'}, {status: 500})
  }
}
