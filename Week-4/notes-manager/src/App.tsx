import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'

type Note = {
  id: number
  title: string
  content: string
  created_at: string | null
}

function App() {
  const [notes, setNotes] = useState<Note[]>([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<string | null>(null)

  const fetchNotes = async (options?: { keepStatus?: boolean }) => {
    const { keepStatus = false } = options ?? {}

    setLoading(true)
    setError(null)
    if (!keepStatus) {
      setStatus(null)
    }

    const { data, error } = await supabase.from('notes').select('*')

    if (error) {
      setError(`Unable to load notes: ${error.message}`)
      setNotes([])
    } else if (data) {
      const notesData = [...(data as Note[])]
      notesData.sort((a, b) => {
        const aTime = a.created_at ? new Date(a.created_at).getTime() : 0
        const bTime = b.created_at ? new Date(b.created_at).getTime() : 0
        return bTime - aTime
      })
      setNotes(notesData)
    }

    setLoading(false)
  }

  useEffect(() => {
    fetchNotes()
  }, [])

  const handleSubmit = async () => {
    setError(null)
    setStatus(null)

    if (!title.trim() || !content.trim()) {
      setError('Both title and content are required.')
      return
    }

    setLoading(true)
    const payload = { title: title.trim(), content: content.trim() }

    if (editingId !== null) {
      const { error } = await supabase.from('notes').update(payload).eq('id', editingId)
      if (error) {
        console.error('Update note error', error)
        setError(`Unable to update note: ${error.message}`)
        setLoading(false)
        return
      }

      setEditingId(null)
      setTitle('')
      setContent('')
      await fetchNotes({ keepStatus: true })
      setStatus('Note updated successfully.')
      return
    }

    const { error } = await supabase.from('notes').insert(payload)
    if (error) {
      console.error('Insert note error', error)
      setError(`Unable to add note: ${error.message}`)
      setLoading(false)
      return
    }

    setTitle('')
    setContent('')
    await fetchNotes({ keepStatus: true })
    setStatus('Note added successfully.')
  }

  const handleEdit = (note: Note) => {
    setEditingId(note.id)
    setTitle(note.title)
    setContent(note.content)
  }

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm('Delete this note permanently?')
    if (!confirmed) return

    setLoading(true)
    const { error } = await supabase.from('notes').delete().eq('id', id)
    if (error) {
      console.error('Delete note error', error)
      setError(`Unable to delete note: ${error.message}`)
      setLoading(false)
      return
    }

    await fetchNotes({ keepStatus: true })
    setStatus('Note deleted successfully.')
    setLoading(false)
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setTitle('')
    setContent('')
    setError(null)
    setStatus(null)
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Notes Manager</h1>

        <div className="bg-white rounded-3xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Add or Update a Note</h2>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Note title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <textarea
              placeholder="Note content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              className="w-full border border-gray-300 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 bg-indigo-600 text-white py-3 rounded-2xl font-medium hover:bg-indigo-700 transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {editingId !== null ? 'Update Note' : 'Add Note'}
              </button>
              {editingId !== null && (
                <button
                  onClick={handleCancelEdit}
                  className="flex-1 bg-gray-200 text-gray-900 py-3 rounded-2xl font-medium hover:bg-gray-300 transition-colors duration-300"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </div>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-3xl p-4 mb-6">{error}</div>}
        {status && <div className="bg-green-50 border border-green-200 text-green-700 rounded-3xl p-4 mb-6">{status}</div>}

        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">View All Notes</h2>
            <p className="text-sm text-gray-500">Edit or delete notes stored in Supabase.</p>
          </div>
          <div className="text-sm text-gray-600">
            {notes.length} {notes.length === 1 ? 'note' : 'notes'}
          </div>
        </div>

        {loading && <p className="text-center text-gray-500">Loading notes...</p>}

        {!loading && notes.length === 0 && (
          <div className="bg-white rounded-3xl shadow-sm p-6 text-center text-gray-500">
            No notes yet. Add one above to get started.
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          {notes.map((note) => (
            <div key={note.id} className="bg-white rounded-3xl shadow-sm p-5 flex flex-col justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">{note.title}</h3>
                <p className="text-gray-600 text-sm whitespace-pre-line mb-4">{note.content}</p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-xs text-gray-500">
                  {note.created_at ? new Date(note.created_at).toLocaleString() : 'No date'}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleEdit(note)}
                    className="text-sm text-indigo-600 font-medium hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(note.id)}
                    className="text-sm text-red-500 font-medium hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App