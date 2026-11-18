'use client'

import { useState } from 'react'
import { Lightbox } from '@/components/Lightbox'

// Proje kapak fotoğrafının üstüne serilen görünmez tıklama alanı: tıklayınca fotoğraf tam ekran, kırpılmadan açılır.
// Başlık ve "Projeler / ..." linki bunun üstünde kalır (z-index 2), link tıklanabilir.
export function ZoomableHero({ src, alt, isEn }: { src: string; alt: string; isEn: boolean }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={isEn ? 'View photo full screen' : 'Fotoğrafı tam ekran gör'}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          border: 'none',
          padding: 0,
          background: 'transparent',
          cursor: 'zoom-in'
        }}
      />
      {open && (
        <Lightbox images={[{ src, alt }]} index={0} isEn={isEn} onChange={() => {}} onClose={() => setOpen(false)} />
      )}
    </>
  )
}
