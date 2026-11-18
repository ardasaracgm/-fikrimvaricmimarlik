'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import useEmblaCarousel from 'embla-carousel-react'
import { urlFor } from '@/sanity/lib/image'
import { useTapDetector } from '@/components/Lightbox'

type CompletedProject = { image: any; title: string; location: string; year?: number; order?: number }

// projects zaten "Sıra No"ya göre sıralı gelir (fitout-management/page.tsx → sortCompletedProjects).
// Numara sitede gösterilmez (kullanıcı isteği), sadece admin önizlemede görünür.
// onOpen verilirse fotoğrafa dokununca büyütme penceresi açılır (kaydırma dokunuş sayılmaz).
export function FitoutGallerySlider({
  projects,
  onOpen
}: {
  projects: CompletedProject[]
  onOpen?: (index: number) => void
}) {
  const tap = useTapDetector()
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: 'start' })
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([])
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])
  const scrollTo = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    setScrollSnaps(emblaApi.scrollSnapList())
    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap())
      setCanScrollPrev(emblaApi.canScrollPrev())
      setCanScrollNext(emblaApi.canScrollNext())
    }
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
    onSelect()
  }, [emblaApi])

  return (
    <div style={{ marginTop: 40 }}>
      <div ref={emblaRef} style={{ overflow: 'hidden' }}>
        <div style={{ display: 'flex', gap: 24 }}>
          {projects.map((p, i) => (
            <div key={i} style={{ flex: '0 0 280px', minWidth: 0 }}>
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '4 / 3',
                  overflow: 'hidden',
                  borderRadius: 8,
                  cursor: onOpen ? 'zoom-in' : undefined,
                }}
                onPointerDown={tap.onPointerDown}
                onClick={(e) => onOpen && tap.isTap(e.clientX) && onOpen(i)}
              >
                <Image
                  src={urlFor(p.image).width(800).height(600).quality(80).url()}
                  alt={p.title}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <h4 style={{ marginBottom: 4, marginTop: 12 }}>{p.title}</h4>
              <p style={{ margin: 0, color: '#666' }}>
                {p.location}
                {p.year ? ` · ${p.year}` : ''}
              </p>
            </div>
          ))}
        </div>
      </div>

      {projects.length > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, marginTop: 24 }}>
          <button
            type="button"
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            aria-label="Önceki"
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              border: '1px solid #e5e5e5',
              background: '#fff',
              cursor: canScrollPrev ? 'pointer' : 'default',
              opacity: canScrollPrev ? 1 : 0.35,
            }}
          >
            ←
          </button>
          <div style={{ display: 'flex', gap: 8 }}>
            {scrollSnaps.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => scrollTo(i)}
                aria-label={`${i + 1}. görsele git`}
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  border: 'none',
                  padding: 0,
                  background: i === selectedIndex ? '#111' : '#ccc',
                  cursor: 'pointer',
                }}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={scrollNext}
            disabled={!canScrollNext}
            aria-label="Sonraki"
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              border: '1px solid #e5e5e5',
              background: '#fff',
              cursor: canScrollNext ? 'pointer' : 'default',
              opacity: canScrollNext ? 1 : 0.35,
            }}
          >
            →
          </button>
        </div>
      )}
    </div>
  )
}
