import {NextRequest, NextResponse} from 'next/server'

export const runtime = 'nodejs'

type TranslateRequest = {
  texts: string[]
  sourceLang?: string
  targetLang?: string
}

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.DEEPL_API_KEY
    console.log('[translate] API key tanımlı mı?', apiKey ? 'EVET' : 'HAYIR')
    console.log('[translate] Key uzunluğu:', apiKey?.length)
    console.log('[translate] Key sonu :fx ile mi bitiyor?', apiKey?.endsWith(':fx'))

    if (!apiKey) {
      return NextResponse.json(
        {error: 'DEEPL_API_KEY tanımlı değil'},
        {status: 500}
      )
    }

    const body: TranslateRequest = await req.json()
    const {texts, sourceLang = 'TR', targetLang = 'EN'} = body
    console.log('[translate] Gelen metin sayısı:', texts?.length)

    if (!Array.isArray(texts) || texts.length === 0) {
      return NextResponse.json({error: 'texts boş olamaz'}, {status: 400})
    }

    const isFree = apiKey.endsWith(':fx')
    const endpoint = isFree
      ? 'https://api-free.deepl.com/v2/translate'
      : 'https://api.deepl.com/v2/translate'
    console.log('[translate] Endpoint:', endpoint)

const form = new URLSearchParams()
    form.append('source_lang', sourceLang)
    form.append('target_lang', targetLang)
    form.append('preserve_formatting', '1')
    texts.forEach((t) => form.append('text', t))

    const r = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `DeepL-Auth-Key ${apiKey}`,
      },
      body: form,
    })

    console.log('[translate] DeepL status:', r.status)

    if (!r.ok) {
      const errText = await r.text()
      console.error('[translate] DeepL hata cevabı:', errText)
      return NextResponse.json(
        {error: `DeepL hatası: ${r.status}`, detail: errText},
        {status: 500}
      )
    }

    const data = await r.json()
    const translations: string[] = (data.translations || []).map(
      (t: any) => t.text
    )
    console.log('[translate] Başarılı, çeviri sayısı:', translations.length)
    return NextResponse.json({translations})
  } catch (err: any) {
    console.error('[translate] HATA:', err)
    return NextResponse.json(
      {error: err.message || 'Bilinmeyen hata', stack: err.stack},
      {status: 500}
    )
  }
}