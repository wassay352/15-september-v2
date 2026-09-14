import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import type { Particle } from './types'
import styles from './CelebrationPhase.module.css'

export interface CelebrationPhaseProps {
  onComplete: () => void
}

const COLORS = ['#ff75a0', '#fce38a', '#4ecdc4', '#b18cff', '#ff9f68']
const CELEBRATION_DURATION_MS = 10_000

export function CelebrationPhase({ onComplete }: CelebrationPhaseProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const prefersReducedMotion = useReducedMotion()
  const [started, setStarted] = useState(false)

  useEffect(() => {
    setStarted(true)
    const completeTimeout = window.setTimeout(onComplete, CELEBRATION_DURATION_MS)
    return () => {
      window.clearTimeout(completeTimeout)
    }
  }, [onComplete])

  useEffect(() => {
    if (!started) return

    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context || prefersReducedMotion) return

    const particles: Particle[] = []
    let animationFrame = 0
    let burstTimer = 0

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const burst = (x: number, y: number) => {
      for (let index = 0; index < 64; index += 1) {
        const angle = (Math.PI * 2 * index) / 64
        const speed = 2 + Math.random() * 3.5
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1.2,
          life: 0,
          maxLife: 70 + Math.random() * 45,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          size: 1.5 + Math.random() * 2.5,
        })
      }
    }

    const frame = () => {
      context.clearRect(0, 0, canvas.width, canvas.height)
      for (const particle of particles) {
        particle.x += particle.vx
        particle.y += particle.vy
        particle.vy += 0.025
        particle.life += 1
        context.globalAlpha = Math.max(0, 1 - particle.life / particle.maxLife)
        context.fillStyle = particle.color
        context.beginPath()
        context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        context.fill()
      }
      context.globalAlpha = 1
      for (let index = particles.length - 1; index >= 0; index -= 1) {
        if (particles[index].life >= particles[index].maxLife) particles.splice(index, 1)
      }
      animationFrame = requestAnimationFrame(frame)
    }

    resize()
    burst(canvas.width * 0.5, canvas.height * 0.3)
    burstTimer = window.setInterval(() => {
      burst(canvas.width * (0.12 + Math.random() * 0.76), canvas.height * (0.16 + Math.random() * 0.36))
    }, 700)
    window.addEventListener('resize', resize)
    animationFrame = requestAnimationFrame(frame)

    return () => {
      window.clearInterval(burstTimer)
      window.cancelAnimationFrame(animationFrame)
      window.removeEventListener('resize', resize)
    }
  }, [prefersReducedMotion, started])

  return (
    <div className={`${styles.wrap} ${started ? styles.active : ''}`} aria-live="polite">
      <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
      <div className={styles.sparkles} aria-hidden="true">✦　✧　✦　⋆　✧　✦</div>
      <p className={styles.celebrationLabel}>Make a wish ✦</p>
    </div>
  )
}

export default CelebrationPhase
