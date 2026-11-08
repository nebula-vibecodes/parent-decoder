/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export type SavedMessage = { id: string; text: string; savedAt: number }
export type AgeBand = 'under-13' | '13-15' | '16-18' | 'adult' | ''
export type FamilyPrefs = { ageBand: AgeBand; topics: string[] }
type Toast = { id: number; message: string }
type AppState = {
  savedTerms: string[]
  savedMessages: SavedMessage[]
  toggleTerm: (slug: string) => void
  saveMessage: (text: string) => void
  removeMessage: (id: string) => void
  clearMessages: () => void
  clearTerms: () => void
  notify: (message: string) => void
  openSearch: () => void
  closeSearch: () => void
  searchOpen: boolean
  prefs: FamilyPrefs
  setPrefs: (prefs: FamilyPrefs) => void
}

const AppContext = createContext<AppState | null>(null)

function useStored<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key)
      return stored ? JSON.parse(stored) : initial
    } catch { return initial }
  })
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(value)) } catch { /* storage may be unavailable */ }
  }, [key, value])
  return [value, setValue] as const
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [savedTerms, setSavedTerms] = useStored<string[]>('parent-decoder-saved-terms', [])
  const [savedMessages, setSavedMessages] = useStored<SavedMessage[]>('parent-decoder-saved-messages', [])
  const [toasts, setToasts] = useState<Toast[]>([])
  const [searchOpen, setSearchOpen] = useState(false)
  const [prefs, setPrefsState] = useStored<FamilyPrefs>('parent-decoder-prefs', { ageBand: '', topics: [] })

  const notify = useCallback((message: string) => {
    const id = Date.now()
    setToasts((items) => [...items, { id, message }])
    window.setTimeout(() => setToasts((items) => items.filter((item) => item.id !== id)), 2800)
  }, [])

  const value = useMemo<AppState>(() => ({
    savedTerms,
    savedMessages,
    toggleTerm: (slug) => {
      const removing = savedTerms.includes(slug)
      setSavedTerms((items) => removing ? items.filter((item) => item !== slug) : [...items, slug])
      notify(removing ? 'Removed from your saved terms' : 'Saved in this browser')
    },
    saveMessage: (text) => {
      const clean = text.trim().slice(0, 600)
      if (!clean) return
      setSavedMessages((items) => [{ id: `${Date.now()}`, text: clean, savedAt: Date.now() }, ...items.filter((item) => item.text !== clean)].slice(0, 20))
      notify('Message saved only in this browser')
    },
    removeMessage: (id) => setSavedMessages((items) => items.filter((item) => item.id !== id)),
    clearMessages: () => setSavedMessages([]),
    clearTerms: () => setSavedTerms([]),
    notify,
    openSearch: () => setSearchOpen(true),
    closeSearch: () => setSearchOpen(false),
    searchOpen,
    prefs,
    setPrefs: (next) => { setPrefsState(next); notify('Family preferences saved in this browser') },
  }), [savedTerms, savedMessages, setSavedTerms, setSavedMessages, notify, searchOpen, prefs, setPrefsState])

  return <AppContext.Provider value={value}>
    {children}
    <div className="toast-stack" aria-live="polite" aria-atomic="true">
      {toasts.map((toast) => <div className="toast" key={toast.id}>{toast.message}</div>)}
    </div>
  </AppContext.Provider>
}

export function useApp() {
  const value = useContext(AppContext)
  if (!value) throw new Error('useApp must be used within AppProvider')
  return value
}

export async function copyText(text: string) {
  await navigator.clipboard.writeText(text)
}
