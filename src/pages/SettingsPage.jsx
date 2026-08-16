import { ArrowLeft, ExternalLink, LogOut } from 'lucide-react'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase/config'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'

export function SettingsPage({ onBack }) {
  const user = auth.currentUser

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <div className="bg-white border-b border-gray-100 px-5 pt-12 pb-5 flex items-center gap-3">
        <button onClick={onBack} className="text-gray-500" aria-label="Volver">
          <ArrowLeft size={22} />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Ajustes</h1>
      </div>

      <div className="px-4 py-4 flex flex-col gap-4">
        <Card className="p-5">
          <p className="text-xs text-gray-400 mb-3">Perfil</p>
          <div className="flex items-center gap-3">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="" className="w-12 h-12 rounded-full object-cover" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-bold">
                {user?.displayName?.[0]?.toUpperCase() ?? '?'}
              </div>
            )}
            <div className="min-w-0">
              <p className="font-semibold text-gray-900 truncate">{user?.displayName}</p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <p className="text-xs text-gray-400 mb-3">Sobre la app</p>
          <p className="text-sm font-semibold text-gray-900 mb-1">Quick Notes</p>
          <p className="text-sm text-gray-500 mb-4">
            Notas rapidas organizadas por categoria, sincronizadas con el reloj Amazfit Bip 5.
            La edicion vive aca y en Ajustes de la app Zepp; el reloj es solo de consulta.
          </p>
          <div className="flex flex-col gap-2">
            <a
              href="https://github.com/JhonAlexanderCalderon/quick-notes-pwa"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-indigo-700"
            >
              <ExternalLink size={14} /> Codigo de esta PWA
            </a>
            <a
              href="https://github.com/JhonAlexanderCalderon/quick-notes-watch"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-indigo-700"
            >
              <ExternalLink size={14} /> Codigo de la app del reloj
            </a>
          </div>
        </Card>

        <Button onClick={() => signOut(auth)} variant="danger" className="w-full mt-2">
          <LogOut size={16} /> Cerrar sesion
        </Button>
      </div>
    </div>
  )
}
