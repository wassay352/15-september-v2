import { LetterScene } from './LetterScene'
import styles from './Page4.module.css'

export interface Page4Props {
  onComplete: () => void
}

export default function Page4({ onComplete }: Page4Props) {
  return (
    <div className={styles.page}>
      <LetterScene onComplete={onComplete} />
    </div>
  )
}
