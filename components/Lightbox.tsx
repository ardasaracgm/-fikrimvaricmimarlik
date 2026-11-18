'use client'

import { useCallback, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

export type LightboxImage = { src: string; alt: string }

// Tam ekran fotoğraf görüntüleyici: fotoğraf kırpılmadan, orijinal oranıyla gösterilir.
// Oklar / klavye ←→ / parmakla kaydırma ile gezinilir; ✕, Esc ya da fotoğraf dışına tıklama kapatır.
// Kullanıldığı yerler: proje galerileri, proje kapak fotoğrafı, Fitout AVM fotoğrafları.
export function Lightbox({
  images,
  index,
  isEn,
  onChange,
  onClose
}: {
  images: LightboxImage[]
  index: number
  isEn: boolean
  onChange: (i: number) => void
  onClose: () => void
}) {
  const touchX = useRef<number | null>(null)
  const count = images.length
  const prev = useCallback(() => onChange((index - 1 + count) % count), [index, count, onChange])
  const next = useCallback(() => onChange((index + 1) % count), [index, count, onChange])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowLeft' && count > 1) prev()
      else if (e.key === 'ArrowRight' && count > 1) next()
    }
    window.addEventListener('keydown', onKey)
    const oldOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = oldOverflow
    }
  }, [prev, next, onClose, count])

  const roundButton = (extra: React.CSSProperties): React.CSSProperties => ({
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: '50%',
    border: 'none',
    background: 'rgba(255,255,255,0.15)',
    color: '#fff',
    fontSize: 22,
    cursor: 'pointer',
    ...extra
  })
  const stop = (fn: () => void) => (e: React.MouseEvent) => {
    e.stopPropagation()
    fn()
  }

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={isEn ? 'Photo viewer' : 'Fotoğraf görüntüleyici'}
      onClick={onClose}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null || count < 2) return
        const dx = e.changedTouches[0].clientX - touchX.current
        touchX.current = null
        if (Math.abs(dx) > 50) (dx < 0 ? next : prev)()
      }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: 'rgba(0,0,0,0.92)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={images[index].src}
        alt={images[index].alt}
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '92vw', maxHeight: '86vh', objectFit: 'contain', borderRadius: 4, userSelect: 'none' }}
      />

      <button
        type="button"
        onClick={stop(onClose)}
        aria-label={isEn ? 'Close' : 'Kapat'}
        style={roundButton({ right: 16, top: 16, width: 44, height: 44, fontSize: 20 })}
      >
        ✕
      </button>

      {count > 1 && (
        <>
          <button
            type="button"
            onClick={stop(prev)}
            aria-label={isEn ? 'Previous' : 'Önceki'}
            style={roundButton({ left: 16, top: '50%', transform: 'translateY(-50%)' })}
          >
            ←
          </button>
          <button
            type="button"
            onClick={stop(next)}
            aria-label={isEn ? 'Next' : 'Sonraki'}
            style={roundButton({ right: 16, top: '50%', transform: 'translateY(-50%)' })}
          >
            →
          </button>
          <div
            style={{
              position: 'absolute',
              bottom: 20,
              left: '50%',
              transform: 'translateX(-50%)',
              color: 'rgba(255,255,255,0.8)',
              fontSize: 14,
              letterSpacing: '0.08em'
            }}
          >
            {index + 1} / {count}
          </div>
        </>
      )}
    </div>,
    document.body
  )
}

/** Kaydırmalı listelerde sürükleme sonrası parmağı kaldırmak tıklama sayılmasın diye: 8 pikselden fazla kaydıysa tıklama değil. */
export function useTapDetector() {
  const downX = useRef<number | null>(null)
  return {
    onPointerDown: (e: React.PointerEvent) => {
      downX.current = e.clientX
    },
    isTap: (clientX: number) => {
      const moved = downX.current !== null && Math.abs(clientX - downX.current) > 8
      downX.current = null
      return !moved
    }
  }
}
