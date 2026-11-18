'use client'

import { useState } from 'react'
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'
import { FitoutGallerySlider } from '@/components/FitoutGallerySlider'
import { Lightbox } from '@/components/Lightbox'

type CompletedProject = { image: any; title: string; location: string; year?: number; order?: number }

// Fitout "Tamamlanmış Projeler" (AVM'ler): masaüstünde hizmet kutularıyla aynı 4'lü ızgara,
// mobilde kaydırmalı slider (.fitout-grid-desktop / .fitout-slider-mobile, globals.css'te 900px eşiği).
// İkisinde de fotoğrafa tıklayınca büyütme penceresi açılır.
// projects "Sıra No"ya göre sıralı gelir (fitout-management/page.tsx → sortCompletedProjects); numara sitede gösterilmez.
export function FitoutProjectsGrid({ projects, isEn }: { projects: CompletedProject[]; isEn: boolean }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const lightboxImages = projects.map((p) => ({
    src: urlFor(p.image).width(2400).fit('max').quality(90).url(),
    alt: [p.title, p.location, p.year].filter(Boolean).join(' · ')
  }))

  return (
    <>
      <div
        className="fitout-grid-desktop"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 24,
          marginTop: 40,
        }}
      >
        {projects.map((p, i) => (
          <div key={i} style={{ minWidth: 0 }}>
            <button
              type="button"
              onClick={() => setLightboxIndex(i)}
              aria-label={isEn ? `View ${p.title} full screen` : `${p.title} fotoğrafını büyüt`}
              style={{
                position: 'relative',
                display: 'block',
                width: '100%',
                aspectRatio: '4 / 3',
                overflow: 'hidden',
                borderRadius: 8,
                border: 'none',
                padding: 0,
                background: '#eee',
                cursor: 'zoom-in'
              }}
            >
              <Image
                src={urlFor(p.image).width(800).height(600).quality(80).url()}
                alt={p.title}
                fill
                sizes="(max-width: 900px) 100vw, 300px"
                style={{ objectFit: 'cover' }}
              />
            </button>
            <h4 style={{ marginBottom: 4, marginTop: 12 }}>{p.title}</h4>
            <p style={{ margin: 0, color: '#666' }}>
              {p.location}
              {p.year ? ` · ${p.year}` : ''}
            </p>
          </div>
        ))}
      </div>
      <div className="fitout-slider-mobile">
        <FitoutGallerySlider projects={projects} onOpen={setLightboxIndex} />
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          images={lightboxImages}
          index={lightboxIndex}
          isEn={isEn}
          onChange={setLightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  )
}
