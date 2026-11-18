'use client'

import {useCallback, useEffect, useState} from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import {sortCompletedProjects, displayNumber} from '@/lib/sortCompletedProjects'

type PreviewProject = {
  key: string
  image: {assetId: string; previewUrl: string} | null
  title: string
  location: string
  year: string
  order: string
}

export function CompletedProjectsPreviewSlider({projects}: {projects: PreviewProject[]}) {
  // Sitedekiyle aynı sıra ve numaralar
  const items = sortCompletedProjects(projects.filter((p) => p.image))
  const [emblaRef, emblaApi] = useEmblaCarousel({loop: false, align: 'start'})
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([])

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])
  const scrollTo = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap())
    setScrollSnaps(emblaApi.scrollSnapList())
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
    onSelect()
  }, [emblaApi, items.length])

  if (items.length === 0) {
    return <p className="text-muted small mb-0">Görsel eklenince önizleme burada görünecek.</p>
  }

  return (
    <div>
      <div ref={emblaRef} style={{overflow: 'hidden'}}>
        <div style={{display: 'flex', gap: 16}}>
          {items.map((p, i) => (
            <div key={p.key} style={{flex: '0 0 200px', minWidth: 0}}>
              <div style={{position: 'relative'}}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.image!.previewUrl}
                  alt={p.title}
                  style={{width: '100%', aspectRatio: '4 / 3', objectFit: 'cover', borderRadius: 8, display: 'block'}}
                />
                <span className="fitout-number">{displayNumber(i + 1)}</span>
              </div>
              <p className="small font-weight-bold mb-0 mt-2">{p.title || '(başlıksız)'}</p>
              <p className="small text-muted mb-0">
                {p.location}
                {p.year ? ` · ${p.year}` : ''}
              </p>
            </div>
          ))}
        </div>
      </div>

      {items.length > 1 && (
        <div className="d-flex justify-content-center align-items-center mt-3" style={{gap: 12}}>
          <button type="button" className="btn btn-sm btn-outline-secondary" onClick={scrollPrev}>
            ←
          </button>
          <div className="d-flex" style={{gap: 6}}>
            {scrollSnaps.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => scrollTo(i)}
                aria-label={`${i + 1}. görsele git`}
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  border: 'none',
                  padding: 0,
                  background: i === selectedIndex ? '#111' : '#ccc',
                  cursor: 'pointer',
                }}
              />
            ))}
          </div>
          <button type="button" className="btn btn-sm btn-outline-secondary" onClick={scrollNext}>
            →
          </button>
        </div>
      )}
    </div>
  )
}
