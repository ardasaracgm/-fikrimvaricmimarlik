import {defineField, defineType} from 'sanity'

// Tekil belge (singleton) — sadece bir tane olacak, sabit _id ile
// (bkz. lib/singletons.ts) admin panelinden upsert ediliyor.
export const fitoutPageType = defineType({
  name: 'fitoutPage',
  title: 'Fitout Management Sayfası',
  type: 'document',
  fields: [
    defineField({name: 'heroImage', title: 'Kapak Görseli', type: 'image', options: {hotspot: true}}),
    defineField({name: 'title', title: 'Başlık (TR)', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'text1', title: 'Metin 1 (TR)', type: 'text', rows: 4, validation: (Rule) => Rule.required()}),
    defineField({name: 'text2', title: 'Metin 2 (TR)', type: 'text', rows: 4, validation: (Rule) => Rule.required()}),
    defineField({name: 'subheading', title: 'Alt Başlık (TR)', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({
      name: 'services',
      title: 'Hizmetler / Süreç Adımları (TR)',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'serviceItem',
          fields: [
            defineField({name: 'title', title: 'Başlık', type: 'string', validation: (Rule) => Rule.required()}),
            defineField({name: 'text', title: 'Açıklama', type: 'text', rows: 3, validation: (Rule) => Rule.required()}),
          ],
          preview: {select: {title: 'title', subtitle: 'text'}},
        },
      ],
    }),
    defineField({
      name: 'completedProjects',
      title: 'Tamamlanmış Projeler',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'completedProject',
          fields: [
            defineField({name: 'image', title: 'Görsel', type: 'image', options: {hotspot: true}, validation: (Rule) => Rule.required()}),
            defineField({name: 'title', title: 'Proje Adı', type: 'string', validation: (Rule) => Rule.required()}),
            defineField({name: 'location', title: 'Konum', type: 'string', validation: (Rule) => Rule.required()}),
            defineField({name: 'year', title: 'Yıl', type: 'number'}),
            defineField({name: 'order', title: 'Sıra No', type: 'number', description: 'Küçük numara önce gösterilir. Boş bırakılanlar en sona, yeniden eskiye yıla göre dizilir.'}),
          ],
          preview: {select: {title: 'title', subtitle: 'location', media: 'image'}},
        },
      ],
    }),
    defineField({name: 'titleEn', title: 'Title (EN)', type: 'string', readOnly: true}),
    defineField({name: 'text1En', title: 'Text 1 (EN)', type: 'text', rows: 4, readOnly: true}),
    defineField({name: 'text2En', title: 'Text 2 (EN)', type: 'text', rows: 4, readOnly: true}),
    defineField({name: 'subheadingEn', title: 'Subheading (EN)', type: 'string', readOnly: true}),
    defineField({
      name: 'servicesEn',
      title: 'Services (EN)',
      type: 'array',
      readOnly: true,
      of: [
        {
          type: 'object',
          name: 'serviceItemEn',
          fields: [
            defineField({name: 'title', title: 'Title', type: 'string'}),
            defineField({name: 'text', title: 'Description', type: 'text', rows: 3}),
          ],
        },
      ],
    }),
  ],
})
