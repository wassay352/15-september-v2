import { useMemo, type CSSProperties } from 'react'
import styles from './BirthdayDoodles.module.css'

const TYPES = ['balloon', 'cake', 'slice', 'gift', 'star'] as const

export function BirthdayDoodles() {
  const doodles = useMemo(() => Array.from({ length: 120 }, (_, index) => ({
    type: TYPES[index % TYPES.length],
    style: {
      '--left': `${Math.random() * 100}%`,
      '--top': `${Math.random() * 100}%`,
      '--size': `${14 + Math.random() * 24}px`,
      '--rotation': `${-25 + Math.random() * 50}deg`,
      '--delay': `${Math.random() * -8}s`,
    } as CSSProperties,
  })), [])

  return (
    <div className={styles.cloud} aria-hidden="true">
      {doodles.map(({ type, style }, index) => (
        <svg key={`${type}-${index}`} className={styles.glyph} style={style} viewBox="0 0 24 24">
          {type === 'balloon' && <><path d="M12 16v1a2 2 0 0 0 2 2h1a2 2 0 0 1 2 2v1" /><path d="M12 6a2 2 0 0 1 2 2" /><path d="M18 8c0 4-3.5 8-6 8s-6-4-6-8a6 6 0 0 1 12 0" /></>}
          {type === 'cake' && <><path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8" /><path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1" /><path d="M2 21h20M7 8v3M12 8v3M17 8v3M7 4h.01M12 4h.01M17 4h.01" /></>}
          {type === 'slice' && <><path d="M16 13H3M16 17H3" /><path d="m7.2 7.9-3.388 2.5A2 2 0 0 0 3 12.01V20a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-8.654c0-2-2.44-6.026-6.44-8.026a1 1 0 0 0-1.082.057L10.4 5.6" /><circle cx="9" cy="7" r="2" /></>}
          {type === 'gift' && <><path d="M12 7v14M20 11v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8" /><path d="M7.5 7a1 1 0 0 1 0-5A4.8 8 0 0 1 12 7a4.8 8 0 0 1 4.5-5 1 1 0 0 1 0 5" /><rect x="3" y="7" width="18" height="4" rx="1" /></>}
          {type === 'star' && <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.123 2.123 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.123 2.123 0 0 0 1.597-1.16z" />}
        </svg>
      ))}
    </div>
  )
}
