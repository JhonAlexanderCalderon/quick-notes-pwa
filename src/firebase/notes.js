import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore'
import { db } from './config'

// Same document shape the watch's Side Service reads/writes
// (quick-notes/utils/firestore-sync.js): a single doc at notes/data with
// one `json` string field holding { personal: [...], ti: [...], reuniones: [...] }.
// Kept as one blob (not decomposed into native Firestore fields) so the
// already-working watch-side code doesn't need to change.
const NOTES_DOC = doc(db, 'notes', 'data')

export function emptyNotesData() {
  return { personal: [], ti: [], reuniones: [] }
}

export async function getNotesData() {
  const snap = await getDoc(NOTES_DOC)
  if (!snap.exists()) return emptyNotesData()
  const raw = snap.data().json
  return raw ? JSON.parse(raw) : emptyNotesData()
}

export function watchNotesData(cb) {
  return onSnapshot(NOTES_DOC, (snap) => {
    if (!snap.exists()) { cb(emptyNotesData()); return }
    const raw = snap.data().json
    cb(raw ? JSON.parse(raw) : emptyNotesData())
  })
}

export function saveNotesData(data) {
  return setDoc(NOTES_DOC, { json: JSON.stringify(data) })
}
