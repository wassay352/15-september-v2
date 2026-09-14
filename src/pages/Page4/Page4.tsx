import { useAppContext } from '../../context/AppContext'
import { PageNavigation } from '../../components/PageNavigation/PageNavigation'
import styles from './Page4.module.css'

export interface Page4Props {
  onComplete: () => void
}

const LETTER = [
  'Dearest Arfa,',
  'There are some people who become part of our lives so quietly that we do not notice the moment they arrive.',
  'You are one of those people.',
  'As you turn sixteen, I wanted to leave something behind for you: a small piece of a moment you can return to someday.',
  'I hope life gives you moments that make you stop and think, I wish I could keep this moment forever.',
  'You are allowed to change, dream again, outgrow old versions of yourself, and take your time.',
  'Your story is still being written. There are pages ahead that are completely untouched.',
  'Happy 16th Birthday, Arfa.',
  'May the year ahead be gentle with your heart, generous with your dreams, and full of moments worth remembering.',
  'Here is to sixteen. Here is to you. And here is to every beautiful chapter that has yet to begin.',
]

export default function Page4({ onComplete }: Page4Props) {
  const { dispatch } = useAppContext()

  return (
    <main className={styles.page}>
      <article className={styles.letter} aria-label="Birthday letter for Arfa">
        {LETTER.map((line, index) => (
          <p key={line} className={index === 0 ? styles.salutation : index >= 7 ? styles.emphasis : ''}>
            {line}
          </p>
        ))}
      </article>
      <button type="button" className={styles.continue} onClick={onComplete}>Continue</button>
      <PageNavigation
        onPrevious={() => dispatch({ type: 'PREV_PAGE' })}
        onNext={onComplete}
        nextLabel="Continue to the final page"
      />
    </main>
  )
}
