import {defineField, defineType} from 'sanity'

export const projectType = defineType({
  name: 'project',
  title: 'Proje',
  type: 'document',

  groups: [
    {name: 'tr', title: '🇹🇷 Türkçe İçerik', default: true},
    {name: 'en', title: '🇬🇧 İngilizce (Otomatik)'},
    {name: 'meta', title: 'Bilgiler & Galeri'},
  ],

  fields: [
    // ---------- Türkçe İçerik ----------
    defineField({
      name: 'title',
      title: 'Proje Adı',
      type: 'string',
      validation: (Rule) => Rule.required(),
      group: 'tr',
    }),
    defineField({
      name: 'slug',
      title: 'URL (otomatik üretilir)',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      validation: (Rule) => Rule.required(),
      group: 'tr',
    }),
    defineField({
      name: 'location',
      title: 'Konum',
      type: 'string',
      placeholder: 'İstanbul, Türkiye',
      validation: (Rule) => Rule.required(),
      group: 'tr',
    }),
    defineField({
      name: 'category',
      title: 'Kategori',
      type: 'string',
      options: {
        list: [
          {title: 'Konut', value: 'konut'},
          {title: 'Ofis', value: 'ofis'},
          {title: 'Ticari', value: 'ticari'},
          {title: 'Mağaza', value: 'magaza'},
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
      group: 'tr',
    }),
    defineField({
      name: 'concept',
      title: 'Konsept Metni',
      type: 'array',
      of: [{type: 'block', styles: [{title: 'Normal', value: 'normal'}]}],
      validation: (Rule) => Rule.required(),
      group: 'tr',
    }),
    defineField({
      name: 'pullQuote',
      title: 'Vurgu Cümlesi (opsiyonel)',
      type: 'text',
      rows: 2,
      group: 'tr',
    }),
    defineField({
      name: 'details',
      title: 'Detay Metni (opsiyonel)',
      type: 'array',
      of: [{type: 'block', styles: [{title: 'Normal', value: 'normal'}]}],
      group: 'tr',
    }),

    // ---------- İngilizce (Otomatik) ----------
    defineField({
      name: 'titleEn',
      title: 'Project Title',
      type: 'string',
      readOnly: true,
      description: 'Otomatik çeviri ile doldurulacak',
      group: 'en',
    }),
    defineField({
      name: 'locationEn',
      title: 'Location',
      type: 'string',
      readOnly: true,
      group: 'en',
    }),
    defineField({
      name: 'conceptEn',
      title: 'Concept',
      type: 'array',
      of: [{type: 'block', styles: [{title: 'Normal', value: 'normal'}]}],
      readOnly: true,
      group: 'en',
    }),
    defineField({
      name: 'pullQuoteEn',
      title: 'Pull Quote',
      type: 'text',
      rows: 2,
      readOnly: true,
      group: 'en',
    }),
    defineField({
      name: 'detailsEn',
      title: 'Details',
      type: 'array',
      of: [{type: 'block', styles: [{title: 'Normal', value: 'normal'}]}],
      readOnly: true,
      group: 'en',
    }),

    // ---------- Bilgiler & Galeri ----------
    defineField({
      name: 'year',
      title: 'Yıl',
      type: 'number',
      validation: (Rule) => Rule.required().min(2000).max(2100).integer(),
      group: 'meta',
    }),
    defineField({
      name: 'area',
      title: 'Alan',
      type: 'string',
      placeholder: '220 m²',
      group: 'meta',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Görseli',
      type: 'image',
      options: {hotspot: true},
      validation: (Rule) => Rule.required(),
      group: 'meta',
    }),
    defineField({
      name: 'gallery1',
      title: 'Galeri 1',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'galleryItem',
          fields: [
            defineField({
              name: 'image',
              title: 'Görsel',
              type: 'image',
              options: {hotspot: true},
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'size',
              title: 'Boyut',
              type: 'string',
              options: {
                list: [
                  {title: 'Tam Genişlik (full)', value: 'full'},
                  {title: 'Geniş (wide)', value: 'wide'},
                  {title: 'Orta (medium)', value: 'medium'},
                  {title: 'Dar / Dikey (narrow)', value: 'narrow'},
                ],
                layout: 'radio',
              },
              initialValue: 'medium',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {media: 'image', subtitle: 'size'},
            prepare({media, subtitle}) {
              return {title: 'Görsel', subtitle: subtitle ?? '', media}
            },
          },
        },
      ],
      group: 'meta',
    }),
    defineField({
      name: 'gallery2',
      title: 'Galeri 2 (opsiyonel)',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'galleryItem',
          fields: [
            defineField({
              name: 'image',
              title: 'Görsel',
              type: 'image',
              options: {hotspot: true},
            }),
            defineField({
              name: 'size',
              title: 'Boyut',
              type: 'string',
              options: {
                list: [
                  {title: 'Tam Genişlik (full)', value: 'full'},
                  {title: 'Geniş (wide)', value: 'wide'},
                  {title: 'Orta (medium)', value: 'medium'},
                  {title: 'Dar / Dikey (narrow)', value: 'narrow'},
                ],
                layout: 'radio',
              },
              initialValue: 'medium',
            }),
          ],
        },
      ],
      group: 'meta',
    }),
    defineField({
      name: 'order',
      title: 'Sıralama',
      type: 'number',
      description: 'Küçük sayı önce gösterilir',
      initialValue: 100,
      group: 'meta',
    }),
    defineField({
      name: 'isPublished',
      title: 'Yayında',
      type: 'boolean',
      description: 'Kapalıysa proje sitede görünmez',
      initialValue: false,
      group: 'meta',
    }),
  ],

  preview: {
    select: {
      title: 'title',
      subtitle: 'category',
      media: 'heroImage',
    },
  },

  orderings: [
    {
      title: 'Sıralama',
      name: 'orderAsc',
      by: [{field: 'order', direction: 'asc'}],
    },
    {
      title: 'Yıl (Yeni → Eski)',
      name: 'yearDesc',
      by: [{field: 'year', direction: 'desc'}],
    },
  ],
})