import { AppProvider, useAppContext } from './context/AppContext'
import { CustomCursor } from './components/CustomCursor/CustomCursor'
import { BirthdayDoodles } from './components/BirthdayDoodles/BirthdayDoodles'
import { Page1 } from './pages/Page1/Page1'
import { Page2 } from './pages/Page2/Page2'
import { Page3 } from './pages/Page3/Page3'
import Page4 from './pages/Page4/Page4'
import { Page5 } from './pages/Page5/Page5'
import styles from './App.module.css'

function Router() {
  const { currentPage, dispatch } = useAppContext()
  const next = () => dispatch({ type: 'NEXT_PAGE' })

  // Clean sequential router without password gate checks
  if (currentPage === 1) return <Page1 onComplete={next} />
  if (currentPage === 2) return <Page2 onComplete={next} />
  if (currentPage === 3) return <Page3 onComplete={next} />
  if (currentPage === 4) return <Page4 onComplete={next} />
  if (currentPage === 5) return <Page5 onComplete={next} />

  return (
    <div className={styles.placeholder}>
      <p className={styles.placeholderEmoji}>🎂</p>
      <h1>The celebration is complete ✨</h1>
      <p>Thank you for being part of this little birthday experience.</p>
      <button 
        type="button" 
        className={styles.replayBtn} 
        onClick={() => dispatch({ type: 'SET_STATE', payload: 'page1-countdown' })}
      >
        ↺ Replay Page 1
      </button>
    </div>
  )
}

function AppShell() {
  const { currentState } = useAppContext()

  return (
    <>
      <CustomCursor />
      {currentState !== 'page1-blowout' && <BirthdayDoodles />}
      <Router />
    </>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  )
}