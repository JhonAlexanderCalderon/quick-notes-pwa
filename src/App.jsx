import { useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase/config'
import { Spinner } from './components/ui/Spinner'
import { AuthPage } from './pages/AuthPage'
import { NotesPage } from './pages/NotesPage'
import { SettingsPage } from './pages/SettingsPage'

export default function App() {
  const [user, setUser] = useState(undefined) // undefined = loading
  const [screen, setScreen] = useState('notes')

  useEffect(() => onAuthStateChanged(auth, setUser), [])

  if (user === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!user) return <AuthPage />

  return screen === 'settings' ? (
    <SettingsPage onBack={() => setScreen('notes')} />
  ) : (
    <NotesPage onOpenSettings={() => setScreen('settings')} />
  )
}
