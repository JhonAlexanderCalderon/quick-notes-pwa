import { useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase/config'
import { Spinner } from './components/ui/Spinner'
import { AuthPage } from './pages/AuthPage'
import { NotesPage } from './pages/NotesPage'

export default function App() {
  const [user, setUser] = useState(undefined) // undefined = loading

  useEffect(() => onAuthStateChanged(auth, setUser), [])

  if (user === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  return user ? <NotesPage /> : <AuthPage />
}
