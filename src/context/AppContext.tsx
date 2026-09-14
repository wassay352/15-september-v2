import { createContext, useContext, useReducer, type ReactNode } from 'react'
import { BIRTHDAY_TARGET, RECIPIENT_NAME } from '../config'
import type { AppAction, AppContextType, AppState, UserData } from '../types'

// Maps each AppState to the numeric page it belongs to, so components can
// derive `currentPage` without duplicating that logic everywhere.
const STATE_TO_PAGE: Record<AppState, number> = {
  'page1-countdown': 1,
  'page1-fireworks': 1,
  'page1-cake': 1,
  'page1-blowout': 1,
  'page1-balloons': 1,
  'page2-music': 2,
  'page3-locker': 3,
  'page3-gallery': 3,
  'page4-letter': 4,
  'page5-finale': 5,
  complete: 6,
}

interface ReducerState {
  currentState: AppState
  userData: UserData
}

function reducer(state: ReducerState, action: AppAction): ReducerState {
  switch (action.type) {
    case 'SET_STATE':
      return { ...state, currentState: action.payload }
    case 'NEXT_PAGE': {
      const nextPageStart: Partial<Record<number, AppState>> = {
        1: 'page2-music',
        2: 'page3-locker',
        3: 'page4-letter',
        4: 'page5-finale',
        5: 'complete',
      }
      const currentPage = STATE_TO_PAGE[state.currentState]
      const next = nextPageStart[currentPage]
      return next ? { ...state, currentState: next } : state
    }
    case 'PREV_PAGE': {
      const prevPageStart: Partial<Record<number, AppState>> = {
        2: 'page1-countdown',
        3: 'page2-music',
        4: 'page3-gallery',
        5: 'page4-letter',
      }
      const currentPage = STATE_TO_PAGE[state.currentState]
      const prev = prevPageStart[currentPage]
      return prev ? { ...state, currentState: prev } : state
    }
    case 'UPDATE_USER_DATA':
      return { ...state, userData: { ...state.userData, ...action.payload } }
    default:
      return state
  }
}

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    currentState: 'page1-countdown' as AppState,
    userData: {
      name: RECIPIENT_NAME,
      birthday: BIRTHDAY_TARGET.toISOString(),
      wishText: '',
    },
  })

  const value: AppContextType = {
    currentPage: STATE_TO_PAGE[state.currentState],
    currentState: state.currentState,
    dispatch,
    userData: state.userData,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useAppContext(): AppContextType {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useAppContext must be used within an AppProvider')
  return ctx
}
