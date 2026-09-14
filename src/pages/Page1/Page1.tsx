'use client'

import {
  useCallback,
  useState,
} from 'react'

import {
  AnimatePresence,
  motion,
} from 'framer-motion'

import { BIRTHDAY_TARGET, ENTRY_PASSCODE } from '../../config'

import { CountdownPhase } from './CountdownPhase'
import { FireworksPhase } from './FireworksPhase'
import CakeAssembly from './CakeAssembly'
import { CelebrationPhase } from './CelebrationPhase'

import type { Page1State } from './types'

import styles from './Page1.module.css'


export interface Page1Props {
  onComplete: () => void
}


export function Page1({
  onComplete,
}: Page1Props) {
  const [phase, setPhase] =
    useState<Page1State>(
      'countdown',
    )

  const [assembled, setAssembled] =
    useState(false)
  const [entryCode, setEntryCode] = useState('')
  const [entryError, setEntryError] = useState(false)

  /*
   * ==========================================================
   * CAKE ASSEMBLED
   * ==========================================================
   */

  const handleAssembled =
    useCallback(() => {
      setAssembled(true)
    }, [])


  /*
   * ==========================================================
   * BLOW CANDLE
   * ==========================================================
   */

  const handleBlowOut =
    useCallback(() => {
      setPhase('blowOut')
    }, [])


  /*
   * ==========================================================
   * CAKE VISIBILITY
   * ==========================================================
   */

  const showCakeScene =
    phase === 'cakeAssembly' ||
    phase === 'blowOut'

  const submitEntryCode = () => {
    if (entryCode === ENTRY_PASSCODE) {
      setEntryError(false)
      setPhase('cakeAssembly')
      return
    }
    setEntryError(true)
    setEntryCode('')
  }


  /*
   * ==========================================================
   * RENDER
   * ==========================================================
   */

  return (
    <div className={styles.page}>

      {/* ======================================================
          COUNTDOWN / FIREWORKS
      ====================================================== */}

      <AnimatePresence mode="wait">

        {phase === 'countdown' && (
          <motion.div
            key="countdown"
            exit={{
              opacity: 0,
            }}
          >
            <CountdownPhase
              targetDate={
                BIRTHDAY_TARGET
              }
              onComplete={() =>
                setPhase('fireworks')
              }
            />
          </motion.div>
        )}


        {phase === 'fireworks' && (
          <motion.div
            key="fireworks"
            exit={{
              opacity: 0,
            }}
          >
            <FireworksPhase
              onComplete={() =>
                setPhase('passcode')
              }
            />
          </motion.div>
        )}

      </AnimatePresence>

      {phase === 'passcode' && (
        <div className={styles.passcodeGate} role="dialog" aria-labelledby="entry-gate-title">
          <div className={styles.passcodePanel}>
            <p className={styles.passcodeEyebrow}>A private birthday room</p>
            <h1 id="entry-gate-title">Enter the passcode</h1>
            <p className={styles.passcodeHint}>The next part is only for you.</p>
            <input
              autoFocus
              className={styles.passcodeInput}
              type="text"
              inputMode="text"
              autoComplete="off"
              maxLength={ENTRY_PASSCODE.length}
              value={entryCode}
              onChange={(event) => {
                setEntryError(false)
                setEntryCode(event.target.value.slice(0, ENTRY_PASSCODE.length))
              }}
              onKeyDown={(event) => event.key === 'Enter' && submitEntryCode()}
              aria-invalid={entryError}
              aria-describedby={entryError ? 'entry-error' : undefined}
            />
            <button type="button" className={styles.passcodeButton} onClick={submitEntryCode}>Unlock</button>
            {entryError && <p id="entry-error" className={styles.passcodeError}>That passcode is not quite right.</p>}
          </div>
        </div>
      )}


      {/* ======================================================
          CAKE SCENE
      ====================================================== */}

      {showCakeScene && (
        <div
          className={
            styles.cakeScene
          }
        >

          <img
            className={styles.birthdayImage}
            src="/Happy-Birthday.png"
            alt=""
            aria-hidden="true"
            decoding="async"
          />

          <CakeAssembly
            onAssembled={
              handleAssembled
            }
            blown={
              phase === 'blowOut'
            }
          />

          {phase === 'blowOut' && (
            <CelebrationPhase onComplete={onComplete} />
          )}

          {assembled &&
            phase ===
              'cakeAssembly' && (
              <>
                <button
                  type="button"
                  className={
                    styles.cta
                  }
                  onClick={
                    handleBlowOut
                  }
                >
                  Blow the Candle 🕯️
                </button>
                <button
                  type="button"
                  className={styles.nextCta}
                  onClick={onComplete}
                >
                  Next Page <span aria-hidden="true">→</span>
                </button>
              </>
            )}

        </div>
      )}


    </div>
  )
}
