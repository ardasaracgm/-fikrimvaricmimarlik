// Fitout "Tamamlanmış Projeler" sıralaması (site ve admin önizleme aynı kuralı kullanır):
// Sıra No verilenler küçükten büyüğe; verilmeyenler en sonda, yeniden eskiye yıla göre.
// Eşitlikte admin paneldeki eklenme sırası korunur.
type Sortable = {order?: number | string | null; year?: number | string | null}

const toNumber = (v: unknown): number | null =>
  v === '' || v === null || v === undefined || Number.isNaN(Number(v)) ? null : Number(v)

export function sortCompletedProjects<T extends Sortable>(items: T[]): T[] {
  return items
    .map((item, index) => ({item, index}))
    .sort((a, b) => {
      const oa = toNumber(a.item.order)
      const ob = toNumber(b.item.order)
      if (oa !== null && ob !== null) return oa - ob || a.index - b.index
      if (oa !== null) return -1
      if (ob !== null) return 1
      const ya = toNumber(a.item.year)
      const yb = toNumber(b.item.year)
      if (ya !== yb) {
        if (ya === null) return 1
        if (yb === null) return -1
        return yb - ya
      }
      return a.index - b.index
    })
    .map(({item}) => item)
}

/** Sitede kartın üzerinde gösterilen numara: 1 → "01" */
export const displayNumber = (position: number) => String(position).padStart(2, '0')
