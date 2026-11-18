import {NextRequest, NextResponse} from 'next/server'
import {isAdminAuthenticated} from '@/lib/adminAuth'
import {adminClient} from '@/sanity/lib/adminClient'

export async function POST(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({error: 'Yetkisiz'}, {status: 401})
  }

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  if (!file) {
    return NextResponse.json({error: 'Dosya bulunamadı'}, {status: 400})
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer())
    const asset = await adminClient.assets.upload('image', buffer, {filename: file.name})
    return NextResponse.json({assetId: asset._id, url: asset.url})
  } catch (err) {
    console.error('[admin/upload] Sanity asset yükleme hatası:', err)
    const message = err instanceof Error ? err.message : 'Bilinmeyen hata'
    return NextResponse.json({error: `Görsel yüklenemedi: ${message}`}, {status: 500})
  }
}
