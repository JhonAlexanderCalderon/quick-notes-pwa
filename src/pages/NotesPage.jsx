import { useEffect, useState } from 'react'
import { Plus, Trash2, LogOut } from 'lucide-react'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase/config'
import { watchNotesData, saveNotesData, emptyNotesData } from '../firebase/notes'
import { CATEGORIES } from '../utils/categories'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input, Textarea } from '../components/ui/Input'
import { Spinner } from '../components/ui/Spinner'

function genId() {
  return 'n' + Date.now() + Math.floor(Math.random() * 1000)
}

export function NotesPage() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(emptyNotesData())
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].id)

  useEffect(() => {
    const unsub = watchNotesData((notesData) => {
      setData(notesData)
      setLoading(false)
    })
    return unsub
  }, [])

  // Typing updates local state immediately (responsive input); the Firestore
  // write only happens on blur, so we're not writing on every keystroke.
  function setNotesLocal(notes) {
    setData((prev) => ({ ...prev, [activeCategory]: notes }))
  }

  function persist() {
    saveNotesData(data)
  }

  function addNote() {
    const next = [...(data[activeCategory] ?? []), { id: genId(), title: 'Nueva nota', body: '' }]
    const nextData = { ...data, [activeCategory]: next }
    setData(nextData)
    saveNotesData(nextData)
  }

  function updateField(id, field, value) {
    setNotesLocal((data[activeCategory] ?? []).map((n) => (n.id === id ? { ...n, [field]: value } : n)))
  }

  function deleteNote(id, title) {
    if (!confirm(`Borrar "${title || 'esta nota'}"? Esto no se puede deshacer.`)) return
    const next = (data[activeCategory] ?? []).filter((n) => n.id !== id)
    const nextData = { ...data, [activeCategory]: next }
    setData(nextData)
    saveNotesData(nextData)
  }

  const notes = data[activeCategory] ?? []
  const activeCat = CATEGORIES.find((c) => c.id === activeCategory)

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <div className="bg-white border-b border-gray-100 px-5 pt-12 pb-5 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Quick Notes</h1>
          <p className="text-gray-400 text-sm mt-1">Se sincroniza con el reloj</p>
        </div>
        <button
          onClick={() => signOut(auth)}
          className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 text-gray-500"
          aria-label="Cerrar sesion"
        >
          <LogOut size={16} />
        </button>
      </div>

      <div className="px-4 py-4">
        <div className="flex rounded-2xl bg-gray-100 p-1 mb-4">
          {CATEGORIES.map((cat) => {
            const active = activeCategory === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                style={active ? { boxShadow: `inset 0 -3px 0 ${cat.color}` } : undefined}
                className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all ${active ? 'bg-white text-gray-900' : 'text-gray-500'}`}
              >
                {cat.label}
              </button>
            )
          })}
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Spinner />
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <Button onClick={addNote} variant="secondary" className="w-full">
              <Plus size={16} /> Agregar nota
            </Button>

            {notes.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-8">Sin notas todavia en esta categoria.</p>
            )}

            {notes.map((note) => (
              <Card
                key={note.id}
                style={{ borderLeft: `4px solid ${activeCat?.color ?? '#e5e7eb'}` }}
                className="p-4 flex flex-col gap-3"
              >
                <Input
                  value={note.title}
                  maxLength={60}
                  onChange={(e) => updateField(note.id, 'title', e.target.value)}
                  onBlur={persist}
                  placeholder="Titulo"
                />
                <Textarea
                  value={note.body}
                  maxLength={2000}
                  rows={4}
                  onChange={(e) => updateField(note.id, 'body', e.target.value)}
                  onBlur={persist}
                  placeholder="Detalle"
                />
                <Button onClick={() => deleteNote(note.id, note.title)} variant="danger" className="self-end">
                  <Trash2 size={14} /> Borrar
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
