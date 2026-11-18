// AdminLTE formunda zengin metin editörü yerine basit bir textarea kullanıyoruz;
// bu iki fonksiyon Sanity'nin portable text (block array) formatı ile düz metin
// (paragraflar arası boş satır) arasında dönüşüm yapar. Site tarafındaki
// PortableText render'ı bozulmadan çalışmaya devam eder.

function randomKey(): string {
  return Math.random().toString(36).slice(2, 10)
}

export function textToPortableText(text: string): any[] {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((paragraph) => ({
      _type: 'block',
      _key: randomKey(),
      style: 'normal',
      markDefs: [],
      children: [{_type: 'span', _key: randomKey(), text: paragraph, marks: []}],
    }))
}

export function portableTextToText(blocks: any[] | undefined | null): string {
  if (!blocks || !Array.isArray(blocks)) return ''
  return blocks
    .map((block) => (block.children ?? []).map((c: any) => c.text ?? '').join(''))
    .join('\n\n')
}
