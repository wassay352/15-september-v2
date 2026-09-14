import { memo, useCallback, useEffect, useRef, useState, type MouseEvent, type PointerEvent, type RefObject } from 'react'
import HTMLFlipBook from 'react-pageflip'
import styles from './PdfFlipbook.module.css'

const MOBILE_BREAKPOINT = '(max-width: 700px)'
const scrapbookPages = [
  '/Scrapbook/1.png',
  '/Scrapbook/2.png',
  '/Scrapbook/3.png',
  '/Scrapbook/4.png',
  '/Scrapbook/5.png',
  '/Scrapbook/6.png',
  '/Scrapbook/7.png',
  '/Scrapbook/8.png',
  '/Scrapbook/9.png',
  '/Scrapbook/10.png',
  '/Scrapbook/11.png',
  '/Scrapbook/12.png',
]

interface FlipBookHandle {
  pageFlip: () => {
    flipNext: () => void
    flipPrev: () => void
  }
}

interface FlipBookCanvasProps {
  bookRef: RefObject<FlipBookHandle>
  isMobile: boolean
  onFlip: (page: number) => void
}

interface ZoomViewportProps {
  bookRef: RefObject<FlipBookHandle>
  isMobile: boolean
  scale: number
  onFlip: (page: number) => void
  onZoomChange: (scale: number) => void
}

interface OrientationState {
  isMobile: boolean
  isPortrait: boolean
}

function getOrientationState(): OrientationState {
  if (typeof window === 'undefined') {
    return { isMobile: false, isPortrait: false }
  }

  return {
    isMobile: window.innerWidth < 768,
    isPortrait: window.innerHeight > window.innerWidth,
  }
}

const FlipBookCanvas = memo(function FlipBookCanvas({ bookRef, isMobile, onFlip }: FlipBookCanvasProps) {
  return (
    <HTMLFlipBook
      ref={bookRef}
      style={{}}
      startPage={0}
      width={390}
      height={520}
      size="stretch"
      minWidth={260}
      maxWidth={520}
      minHeight={350}
      maxHeight={690}
      startZIndex={0}
      autoSize
      showCover
      showPageCorners
      usePortrait={isMobile}
      mobileScrollSupport
      drawShadow
      maxShadowOpacity={0.5}
      flippingTime={900}
      swipeDistance={30}
      useMouseEvents
      clickEventForward
      disableFlipByClick={false}
      onFlip={(event) => onFlip(event.data)}
      className={styles.flipBook}
    >
      {scrapbookPages.map((src, index) => (
        <div key={src} className={styles.pageSheet}>
          <picture>
            <source srcSet={src.replace('.png', '.webp')} type="image/webp" />
            <img
              src={src}
              alt={`Page ${index + 1}`}
              className={styles.pageImage}
              loading={index === 0 ? 'eager' : 'lazy'}
              decoding="async"
            />
          </picture>
        </div>
      ))}
    </HTMLFlipBook>
  )
})

const MIN_ZOOM = 1
const MAX_ZOOM = 2.5
const ZOOM_STEP = 0.25

function ZoomViewport({ bookRef, isMobile, scale, onFlip, onZoomChange }: ZoomViewportProps) {
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const pointers = useRef(new Map<number, { x: number; y: number }>())
  const panStart = useRef({ x: 0, y: 0, offsetX: 0, offsetY: 0 })
  const pinchStart = useRef({ distance: 0, scale: MIN_ZOOM })
  const lastTap = useRef(0)

  const updateZoom = useCallback((nextScale: number) => {
    const clampedScale = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, nextScale))
    onZoomChange(clampedScale)
    if (clampedScale === MIN_ZOOM) setOffset({ x: 0, y: 0 })
  }, [onZoomChange])

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY })
    event.currentTarget.setPointerCapture(event.pointerId)

    if (pointers.current.size === 1 && scale > MIN_ZOOM) {
      event.stopPropagation()
      panStart.current = { x: event.clientX, y: event.clientY, offsetX: offset.x, offsetY: offset.y }
    }

    if (pointers.current.size === 2) {
      event.stopPropagation()
      const [first, second] = [...pointers.current.values()]
      pinchStart.current = {
        distance: Math.hypot(second.x - first.x, second.y - first.y),
        scale,
      }
    }
  }

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!pointers.current.has(event.pointerId)) return
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY })

    if (pointers.current.size === 2) {
      event.stopPropagation()
      const [first, second] = [...pointers.current.values()]
      const distance = Math.hypot(second.x - first.x, second.y - first.y)
      updateZoom(pinchStart.current.scale * (distance / pinchStart.current.distance))
      return
    }

    if (scale > MIN_ZOOM) {
      event.stopPropagation()
      setOffset({
        x: panStart.current.offsetX + event.clientX - panStart.current.x,
        y: panStart.current.offsetY + event.clientY - panStart.current.y,
      })
    }
  }

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const wasZoomed = scale > MIN_ZOOM || pointers.current.size > 1
    pointers.current.delete(event.pointerId)
    if (wasZoomed) event.stopPropagation()
  }

  const handleDoubleClick = (event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
    updateZoom(scale === MIN_ZOOM ? 1.75 : MIN_ZOOM)
  }

  const handleClick = () => {
    const now = Date.now()
    if (now - lastTap.current < 320) updateZoom(scale === MIN_ZOOM ? 1.75 : MIN_ZOOM)
    lastTap.current = now
  }

  return (
    <div
      className={styles.zoomViewport}
      onPointerDownCapture={handlePointerDown}
      onPointerMoveCapture={handlePointerMove}
      onPointerUpCapture={handlePointerUp}
      onPointerCancelCapture={handlePointerUp}
      onDoubleClick={handleDoubleClick}
      onClick={handleClick}
      style={{ touchAction: scale > MIN_ZOOM ? 'none' : 'auto' }}
    >
      <div
        className={styles.zoomContent}
        style={{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})` }}
      >
        <FlipBookCanvas bookRef={bookRef} isMobile={isMobile} onFlip={onFlip} />
      </div>
    </div>
  )
}

function useOrientationState() {
  const [orientation, setOrientation] = useState<OrientationState>(getOrientationState)

  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_BREAKPOINT)
    const update = () => {
      setOrientation({
        isMobile: mediaQuery.matches || window.innerWidth < 768,
        isPortrait: window.innerHeight > window.innerWidth,
      })
    }

    update()
    mediaQuery.addEventListener('change', update)
    window.addEventListener('resize', update)
    window.addEventListener('orientationchange', update)

    return () => {
      mediaQuery.removeEventListener('change', update)
      window.removeEventListener('resize', update)
      window.removeEventListener('orientationchange', update)
    }
  }, [])

  return orientation
}

export function PdfFlipbook() {
  const bookRef = useRef<FlipBookHandle>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [zoomScale, setZoomScale] = useState(MIN_ZOOM)
  const [rotationTipDismissed, setRotationTipDismissed] = useState(false)
  const { isMobile, isPortrait } = useOrientationState()
  const showRotationTip = isMobile && isPortrait && !rotationTipDismissed
  const pageCount = scrapbookPages.length
  const handleFlip = useCallback((page: number) => setCurrentPage(page), [])

  const flipPrevious = () => bookRef.current?.pageFlip().flipPrev()
  const flipNext = () => bookRef.current?.pageFlip().flipNext()
  const zoomIn = () => setZoomScale((value) => Math.min(MAX_ZOOM, value + ZOOM_STEP))
  const zoomOut = () => setZoomScale((value) => Math.max(MIN_ZOOM, value - ZOOM_STEP))

  return (
    <section className={styles.wrapper} aria-label="Interactive scrapbook">
      {showRotationTip && (
        <div className={styles.rotationTip} role="status">
          <span className={styles.rotationTipIcon} aria-hidden="true">↻</span>
          <span>Tip: Rotate for a full-screen spread</span>
          <button type="button" onClick={() => setRotationTipDismissed(true)} aria-label="Dismiss rotation tip">×</button>
        </div>
      )}
      <div className={styles.bookFrame}>
        <ZoomViewport
          bookRef={bookRef}
          isMobile={isMobile}
          scale={zoomScale}
          onFlip={handleFlip}
          onZoomChange={setZoomScale}
        />
      </div>
      {pageCount > 0 && (
        <div className={styles.controls}>
          <button type="button" onClick={flipPrevious} disabled={currentPage === 0 || zoomScale > MIN_ZOOM}>
            Previous page
          </button>
          <button type="button" className={styles.zoomButton} onClick={zoomOut} disabled={zoomScale === MIN_ZOOM} aria-label="Zoom out">−</button>
          <span aria-live="polite">Page {Math.min(currentPage + 1, pageCount)} of {pageCount}</span>
          <button type="button" className={styles.zoomButton} onClick={zoomIn} disabled={zoomScale === MAX_ZOOM} aria-label="Zoom in">+</button>
          <button type="button" onClick={flipNext} disabled={currentPage >= pageCount - 1 || zoomScale > MIN_ZOOM}>
            Next page
          </button>
        </div>
      )}
    </section>
  )
}