const priceFormat = new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' })
export const formatPrice = (value: number) => priceFormat.format(value)

export function formatDate(iso: string | null): string {
  return iso ? new Date(iso).toLocaleString('tr-TR', { dateStyle: 'medium', timeStyle: 'short' }) : '—'
}

// API'de kategori alanı yok, SKU önekinden türetiyoruz (TV-SAM-001 -> TV)
const CATEGORIES: Record<string, { label: string; icon: string }> = {
  TV: { label: 'TV & Display', icon: '📺' },
  LAP: { label: 'Computers', icon: '💻' },
  AUD: { label: 'Audio', icon: '🎧' },
  PHN: { label: 'Phones', icon: '📱' },
}

export function categoryCode(sku: string): string {
  return (sku.split('-')[0] || 'OTHER').toUpperCase()
}

export function categoryInfo(code: string): { label: string; icon: string } {
  return CATEGORIES[code] ?? { label: code === 'OTHER' ? 'Other' : code, icon: '🛍️' }
}

export function hueOf(text: string): number {
  let h = 0
  for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) % 360
  return h
}
