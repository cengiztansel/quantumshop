import { useState } from 'react'
import { categoryInfo, hueOf } from '../lib/format'
import { imageFor } from '../lib/images'

interface Props {
  name: string
  sku: string
  category: string
  large?: boolean
}

// Resim varsa onu gösterir; yoksa ya da yüklenemezse isimden türetilen renkli yedek görsele döner
export default function ProductVisual({ name, sku, category, large }: Props) {
  const [failed, setFailed] = useState(false)
  const src = imageFor(sku)
  const className = `visual${large ? ' visual-lg' : ''}`

  if (src && !failed) {
    return (
      <div className={className}>
        <img src={src} alt={name} loading="lazy" onError={() => setFailed(true)} />
      </div>
    )
  }

  const hue = hueOf(name)
  return (
    <div
      className={className}
      style={{ background: `linear-gradient(135deg, hsl(${hue} 70% 55%), hsl(${(hue + 40) % 360} 70% 38%))` }}
      aria-hidden="true"
    >
      <span>{categoryInfo(category).icon}</span>
    </div>
  )
}
