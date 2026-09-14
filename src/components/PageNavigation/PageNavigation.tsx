import styles from './PageNavigation.module.css'

export interface PageNavigationProps {
  onPrevious: () => void
  onNext: () => void
  previousLabel?: string
  nextLabel?: string
}

export function PageNavigation({ onPrevious, onNext, previousLabel = 'Previous page', nextLabel = 'Next page' }: PageNavigationProps) {
  return (
    <nav className={styles.navigation} aria-label="Page navigation">
      <button type="button" className={styles.button} onClick={onPrevious} aria-label={previousLabel}>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6" /></svg>
      </button>
      <button type="button" className={styles.button} onClick={onNext} aria-label={nextLabel}>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
      </button>
    </nav>
  )
}
