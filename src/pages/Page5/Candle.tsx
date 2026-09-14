import type { MouseEventHandler } from 'react'
import styles from './Candle.module.css'

export interface CandleProps {
  blown?: boolean
  onClick?: MouseEventHandler<HTMLDivElement>
}

export function Candle({ blown = false, onClick }: CandleProps) {
  return (
    <div className={styles.container} onClick={onClick}>
      <div className={styles.candle}>
        <div className={`${styles.flameGroup} ${blown ? styles.blown : ''}`}>
          <div className={styles.wick} />
          <div className={styles.baseGlow} />
          <div className={styles.flame} />
          <div className={styles.flameCore} />
          <div className={styles.smoke} />
        </div>
      </div>
    </div>
  )
}
