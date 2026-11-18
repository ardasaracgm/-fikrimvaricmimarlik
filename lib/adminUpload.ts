// Telefon fotoğrafları/ekran görüntüleri birkaç MB olabiliyor ve Vercel'in
// sunucu fonksiyonlarında ~4.5MB istek boyutu sınırı var — bu sınırı aşan
// yüklemeler sessizce başarısız oluyordu. Tarayıcıda kaydetmeden önce
// görseli makul bir boyuta küçültüp yeniden sıkıştırıyoruz.
async function resizeImage(file: File, maxDimension = 2400, quality = 0.85): Promise<Blob> {
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height))
  const width = Math.round(bitmap.width * scale)
  const height = Math.round(bitmap.height * scale)

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) return file
  ctx.drawImage(bitmap, 0, 0, width, height)

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob ?? file), 'image/jpeg', quality)
  })
}

export async function uploadFile(file: File): Promise<{assetId: string; previewUrl: string}> {
  let uploadBlob: Blob = file
  try {
    uploadBlob = await resizeImage(file)
  } catch {
    // Küçültme başarısız olursa orijinal dosyayla devam et
  }

  const formData = new FormData()
  formData.append('file', uploadBlob, file.name.replace(/\.[^.]+$/, '.jpg'))
  const res = await fetch('/api/admin/upload', {method: 'POST', body: formData})
  if (!res.ok) {
    const errBody = await res.json().catch(() => null)
    throw new Error(errBody?.error || `Görsel yüklenemedi (${res.status})`)
  }
  const data = await res.json()
  return {assetId: data.assetId, previewUrl: data.url}
}
