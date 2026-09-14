import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { gsap } from 'gsap'
import { useBeep } from '../../hooks/useBeep'
import styles from './CountdownPhase.module.css'

export interface CountdownPhaseProps {
  /** The exact moment the birthday "arrives" — e.g. Sep 15, 2026 00:00:00 local time. */
  targetDate: Date
  onComplete: () => void
}

const FINAL_STRETCH_MS = 10_000 // last 10 seconds get the big bounce-and-beep treatment

function msRemaining(target: Date): number {
  return Math.max(0, target.getTime() - Date.now())
}

function splitDuration(ms: number) {
  const totalSeconds = Math.floor(ms / 1000)
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  }
}

const pad = (n: number) => String(n).padStart(2, '0')

function isAuthorizedDevLink(): boolean {
  if (typeof window === 'undefined') return false
  const params = new URLSearchParams(window.location.search)
  return window.location.hostname === '15september.vercel.app'
    && window.location.pathname === '/'
    && params.get('dev') === 'letmein-birthday'
}

export function CountdownPhase({ targetDate, onComplete }: CountdownPhaseProps) {
  const [countdownTargetMs, setCountdownTargetMs] = useState(() => targetDate.getTime())
  const [remainingMs, setRemainingMs] = useState(() => msRemaining(targetDate))
  const { beep } = useBeep()
  const prefersReducedMotion = useReducedMotion()
  const lastBeepedSecond = useRef<number | null>(null)
  const numberRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const onCompleteRef = useRef(onComplete)

  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  // Ticks continuously against the real clock, so it survives tab throttling,
  // refreshes, and works correctly no matter when the page is opened.
  useEffect(() => {
    const tick = () => {
      const ms = Math.max(0, countdownTargetMs - Date.now())
      setRemainingMs(ms)

      if (ms <= 0) {
        if (lastBeepedSecond.current !== 0) {
          lastBeepedSecond.current = 0
          beep(1046, 0.4, 'triangle', 0.18)
        }
        return
      }

      if (ms <= FINAL_STRETCH_MS) {
        const secondsLeft = Math.ceil(ms / 1000)
        if (secondsLeft !== lastBeepedSecond.current) {
          lastBeepedSecond.current = secondsLeft
          beep(660, 0.08)
        }
      }
    }
    tick()
    const interval = window.setInterval(tick, 100)
    return () => window.clearInterval(interval)
  }, [countdownTargetMs, beep])

  const reachedZero = remainingMs <= 0
  const secondsLeft = Math.ceil(remainingMs / 1000)
  const skipToTenSeconds = () => {
    const tenSecondTarget = Date.now() + FINAL_STRETCH_MS
    setCountdownTargetMs(tenSecondTarget)
    setRemainingMs(FINAL_STRETCH_MS)
    lastBeepedSecond.current = null
  }
  useEffect(() => {
    if (reachedZero) {
      const timeout = window.setTimeout(() => onCompleteRef.current(), 1100)
      return () => window.clearTimeout(timeout)
    }
  }, [reachedZero])

  useEffect(() => {
    if (remainingMs > FINAL_STRETCH_MS || !numberRef.current || !ringRef.current) return

    const number = numberRef.current
    const ring = ringRef.current
    const label = secondsLeft > 0 ? String(secondsLeft) : ''
    number.textContent = label

    if (prefersReducedMotion) {
      gsap.set([number, ring], { clearProps: 'all' })
      return
    }

    const timeline = gsap.timeline()
    timeline
      .set(ring, { scale: 0.55, opacity: 0 })
      .to(number, { scale: 0.72, opacity: 0, duration: 0.12, ease: 'power2.in' })
      .to(ring, { scale: 1.8, opacity: 0, duration: 0.72, ease: 'power2.out' }, '<')
      .fromTo(number, { scale: 1.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.58, ease: 'back.out(1.7)' })

    return () => {
      timeline.kill()
    }
  }, [prefersReducedMotion, secondsLeft])

  // --- Final 10 seconds: the big spring-bounce number, ticking every second ---
  if (remainingMs <= FINAL_STRETCH_MS) {
    return (
      <div className={styles.wrap} data-parity={secondsLeft % 2 === 0 ? 'even' : 'odd'}>
        <div className={styles.finalTimer}>
          <div ref={ringRef} className={styles.ring} aria-hidden="true" />
          <div ref={numberRef} className={styles.number} aria-live="polite">
            {secondsLeft > 0 ? secondsLeft : ''}
          </div>
          {secondsLeft > 0 && <p className={styles.label}>Get ready…</p>}
        </div>
      </div>
    )
  }

  // --- More than 10 seconds out: a live days/hours/minutes/seconds display ---
  const { days, hours, minutes, seconds } = splitDuration(remainingMs)
  const units = [
    { value: days, label: days === 1 ? 'Day' : 'Days' },
    { value: hours, label: 'Hours' },
    { value: minutes, label: 'Minutes' },
    { value: seconds, label: 'Seconds' },
  ]

  return (
    <div className={styles.longWrap}>
      <p className={styles.eyebrow}>Counting down to</p>
      <h1 className={styles.targetLabel}>
        {targetDate.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
      </h1>
      <div className={styles.unitRow}>
        {units.map((u, i) => (
          <div key={u.label} className={styles.unitGroup}>
            <div className={styles.unit}>
              <span className={styles.unitValue}>{pad(u.value)}</span>
              <span className={styles.unitLabel}>{u.label}</span>
            </div>
            {i < units.length - 1 && <span className={styles.divider}>:</span>}
          </div>
        ))}
      </div>
      {remainingMs > FINAL_STRETCH_MS && isAuthorizedDevLink() && (
        <button type="button" className={styles.skipButton} onClick={skipToTenSeconds}>
          dev:skip timing (to 10s)
        </button>
      )}
    </div>
  )
}
