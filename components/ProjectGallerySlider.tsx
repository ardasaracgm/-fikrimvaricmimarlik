'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import useEmblaCarousel from 'embla-carousel-react'
import { urlFor } from '@/sanity/lib/image'
import { Lightbox, useTapDetector } from '@/components/Lightbox'

type GalleryItem = { _key: string; image: any }

export function ProjectGallerySlider({
  items,
  title,
  isEn
}: {
  items: GalleryItem[]
  title: string
  isEn: boolean
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: 'start' })
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([])
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const tap = useTapDetector()

  const alt = (i: number) => `${title} — ${isEn ? 'gallery image' : 'galeri görseli'} ${i + 1}`
  const lightboxImages = items.map((item, i) => ({
    src: urlFor(item.image).width(2400).fit('max').quality(90).url(),
    alt: alt(i)
  }))
  const closeLightbox = useCallback(() => {
    if (lightboxIndex !== null) emblaApi?.scrollTo(lightboxIndex, true) // galeri kapatılan fotoğrafta kalsın
    setLightboxIndex(null)
  }, [emblaApi, lightboxIndex])

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])
  const scrollTo = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap())
      setCanScrollPrev(emblaApi.canScrollPrev())
      setCanScrollNext(emblaApi.canScrollNext())
    }
    setScrollSnaps(emblaApi.scrollSnapList())
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
    onSelect()
  }, [emblaApi])

  return (
    <div style={{ position: 'relative' }}>
      <div ref={emblaRef} style={{ overflow: 'hidden' }}>
        <div style={{ display: 'flex' }}>
          {items.map((item, i) => (
            <div
              key={item._key}
              style={{
                flex: '0 0 100%',
                minWidth: 0,
                position: 'relative',
                height: '70vh',
                minHeight: 320,
                maxHeight: 640,
                overflow: 'hidden',
                borderRadius: 4,
                background: '#eee',
                cursor: 'zoom-in'
              }}
              className="pd-gallery-slide"
              onPointerDown={tap.onPointerDown}
              onClick={(e) => tap.isTap(e.clientX) && setLightboxIndex(i)}
            >
              <Image
                src={urlFor(item.image).width(2400).quality(85).url()}
                alt={alt(i)}
                fill
                sizes="100vw"
                style={{ objectFit: 'cover' }}
              />
            </div>
          ))}
        </div>
      </div>

      {items.length > 1 && (
        <>
          <button
            type="button"
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            aria-label={isEn ? 'Previous' : 'Önceki'}
            style={{
              position: 'absolute',
              left: 16,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 2,
              width: 40,
              height: 40,
              borderRadius: '50%',
              border: 'none',
              background: 'rgba(255,255,255,0.9)',
              boxShadow: '0 2px 10px rgba(0,0,0,0.25)',
              cursor: canScrollPrev ? 'pointer' : 'default',
              opacity: canScrollPrev ? 1 : 0.35
            }}
          >
            ←
          </button>
          <button
            type="button"
            onClick={scrollNext}
            disabled={!canScrollNext}
            aria-label={isEn ? 'Next' : 'Sonraki'}
            style={{
              position: 'absolute',
              right: 16,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 2,
              width: 40,
              height: 40,
              borderRadius: '50%',
              border: 'none',
              background: 'rgba(255,255,255,0.9)',
              boxShadow: '0 2px 10px rgba(0,0,0,0.25)',
              cursor: canScrollNext ? 'pointer' : 'default',
              opacity: canScrollNext ? 1 : 0.35
            }}
          >
            →
          </button>
          <div
            style={{
              position: 'absolute',
              left: '50%',
              bottom: 16,
              transform: 'translateX(-50%)',
              zIndex: 2,
              display: 'flex',
              gap: 8,
              padding: '6px 10px',
              borderRadius: 999,
              background: 'rgba(0,0,0,0.35)',
              backdropFilter: 'blur(2px)'
            }}
          >
            {scrollSnaps.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => scrollTo(i)}
                aria-label={`${i + 1}`}
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  border: 'none',
                  padding: 0,
                  background: i === selectedIndex ? '#fff' : 'rgba(255,255,255,0.5)',
                  cursor: 'pointer'
                }}
              />
            ))}
          </div>
        </>
      )}

      {lightboxIndex !== null && (
        <Lightbox
          images={lightboxImages}
          index={lightboxIndex}
          isEn={isEn}
          onChange={setLightboxIndex}
          onClose={closeLightbox}
        />
      )}
    </div>
  )
}
