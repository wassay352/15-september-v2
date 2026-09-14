const ICONS = [
  { type: 'balloon', x: 7, y: 12, size: 34, rotate: -12 },
  { type: 'cake', x: 20, y: 9, size: 42, rotate: 7 },
  { type: 'star', x: 34, y: 16, size: 25, rotate: -8 },
  { type: 'gift', x: 49, y: 8, size: 31, rotate: 10 },
  { type: 'balloon', x: 64, y: 13, size: 30, rotate: 16 },
  { type: 'star', x: 78, y: 10, size: 28, rotate: 5 },
  { type: 'cake', x: 91, y: 17, size: 40, rotate: -10 },
  { type: 'gift', x: 12, y: 34, size: 27, rotate: 8 },
  { type: 'star', x: 27, y: 39, size: 21, rotate: -15 },
  { type: 'balloon', x: 42, y: 31, size: 29, rotate: -5 },
  { type: 'cake', x: 59, y: 38, size: 36, rotate: 12 },
  { type: 'gift', x: 74, y: 31, size: 28, rotate: -7 },
  { type: 'star', x: 88, y: 42, size: 23, rotate: 14 },
  { type: 'balloon', x: 5, y: 65, size: 32, rotate: 10 },
  { type: 'gift', x: 19, y: 76, size: 29, rotate: -11 },
  { type: 'cake', x: 34, y: 66, size: 39, rotate: 6 },
  { type: 'star', x: 51, y: 75, size: 24, rotate: -9 },
  { type: 'balloon', x: 66, y: 64, size: 31, rotate: 8 },
  { type: 'gift', x: 81, y: 76, size: 28, rotate: 12 },
  { type: 'star', x: 95, y: 67, size: 22, rotate: -4 },
  { type: 'cake', x: 8, y: 91, size: 34, rotate: -8 },
  { type: 'balloon', x: 28, y: 93, size: 28, rotate: 13 },
  { type: 'gift', x: 47, y: 91, size: 30, rotate: -5 },
  { type: 'star', x: 69, y: 94, size: 25, rotate: 11 },
  { type: 'cake', x: 88, y: 91, size: 36, rotate: -13 },
] as const

const backgroundStyles = `
  .page4-background-decor {
    position: fixed;
    inset: 0;
    z-index: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    opacity: 0.3;
  }
  .page4-background-decor use {
    fill: none;
    stroke: #7b4353;
    stroke-width: 1.15;
    stroke-linecap: round;
    stroke-linejoin: round;
    vector-effect: non-scaling-stroke;
  }
`

export function BackgroundDecor() {
  return (
    <>
      <style>{backgroundStyles}</style>
      <svg className="page4-background-decor" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <g id="decor-balloon">
            <ellipse cx="0" cy="-5" rx="5" ry="7" />
            <path d="M-1.4 2 L0 4 L1.4 2 M0 4 C1 10 -2 13 1 17" />
          </g>
          <g id="decor-star">
            <path d="M0-9 L2.2-2.8 L9-2.8 L3.4 1.2 L5.6 8 L0 4 L-5.6 8 L-3.4 1.2 L-9-2.8 L-2.2-2.8 Z" />
          </g>
          <g id="decor-gift">
            <rect x="-8" y="-4" width="16" height="12" rx="1" />
            <path d="M-8 0 H8 M0-4 V8 M-7-4 C-10-10 -2-10 0-4 C2-10 10-10 7-4" />
          </g>
          <g id="decor-cake">
            <path d="M-10 2 C-7-2 -4 6 0 2 C4-2 7 6 10 2 V9 H-10 Z M-8 9 H8" />
            <path d="M-5 2 V-6 M0 2 V-8 M5 2 V-6 M-6-8 V-11 M0-10 V-13 M6-8 V-11" />
          </g>
        </defs>
        {ICONS.map((icon, index) => (
          <use
            key={`${icon.type}-${index}`}
            href={`#decor-${icon.type}`}
            transform={`translate(${icon.x} ${icon.y}) rotate(${icon.rotate}) scale(${icon.size / 160})`}
          />
        ))}
      </svg>
    </>
  )
}
