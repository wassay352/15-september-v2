import { useAppContext } from '../../context/AppContext'
import { PageNavigation } from '../../components/PageNavigation/PageNavigation'
import { PdfFlipbook } from './PdfFlipbook'
import styles from './Page3.module.css'

export interface Page3Props {
  onComplete: () => void
}

export function Page3({ onComplete }: Page3Props) {
  const { dispatch } = useAppContext()

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Memories &amp; Moments</h1>
        <p>Turn the pages and stay awhile in the memories.</p>
      </header>
      <PdfFlipbook />
      <PageNavigation onPrevious={() => dispatch({ type: 'PREV_PAGE' })} onNext={onComplete} />
    </div>
  )
}
