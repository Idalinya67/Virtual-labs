import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from '../../Auth/AuthContext'
import { getProgress, saveReflection } from '../../../lib/progress'

export default function PracticalShell({ slug, strand, title, outcome, reflection, children }) {
  const { user } = useAuth()
  const [reflectionAnswer, setReflectionAnswer] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    getProgress(user?.id)
      .then((progress) => {
        if (cancelled) return
        const entry = progress[slug]
        if (entry) {
          setReflectionAnswer(entry.reflection)
          setSubmitted(true)
        }
      })
      .catch(() => setError('Could not load your saved progress.'))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [user?.id, slug])

  async function handleSubmit() {
    setSaving(true)
    setError('')
    try {
      await saveReflection(user?.id, slug, reflectionAnswer.trim())
      setSubmitted(true)
    } catch {
      setError('Could not save your reflection. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <Link to="/app" className="text-sm text-brand-600 hover:underline mb-4 inline-block">
        ← Back to practicals
      </Link>

      <div className="text-xs font-medium text-brand-600 mb-1">{strand}</div>
      <h1 className="text-2xl font-bold text-slate-900 mb-2">{title}</h1>
      <p className="text-slate-500 mb-8 max-w-2xl">
        <span className="font-medium text-slate-700">Learning outcome: </span>
        {outcome}
      </p>

      <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 mb-8">
        {children}
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6">
        <h2 className="font-semibold text-slate-900 mb-3">Reflection</h2>
        <p className="text-slate-500 text-sm mb-4">{reflection}</p>
        {loading ? (
          <p className="text-sm text-slate-400">Loading your progress...</p>
        ) : submitted ? (
          <div>
            <p className="text-brand-600 text-sm font-medium mb-3">Saved. Well done!</p>
            <button
              onClick={() => setSubmitted(false)}
              className="text-sm text-slate-500 hover:text-slate-800 underline"
            >
              Edit answer
            </button>
          </div>
        ) : (
          <>
            <textarea
              value={reflectionAnswer}
              onChange={(e) => setReflectionAnswer(e.target.value)}
              rows={3}
              className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
              placeholder="Write your answer..."
            />
            {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
            <button
              onClick={handleSubmit}
              disabled={!reflectionAnswer.trim() || saving}
              className="mt-3 bg-brand-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-brand-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              {saving ? 'Saving...' : 'Submit reflection'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
