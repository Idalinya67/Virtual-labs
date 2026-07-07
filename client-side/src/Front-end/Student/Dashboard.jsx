import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from '../Auth/AuthContext'
import { getProgress } from '../../lib/progress'

const practicals = [
  {
    slug: 'separating-mixtures',
    title: 'Separating Mixtures',
    strand: 'Mixtures, Elements & Compounds',
    outcome: 'Choose and apply the appropriate method to separate different homogeneous mixtures.',
    emoji: '🧪',
  },
  {
    slug: 'acids-bases',
    title: 'Acids, Bases & Indicators',
    strand: 'Mixtures, Elements & Compounds',
    outcome: 'Identify acids and bases using litmus paper and a plant-extract indicator.',
    emoji: '🌈',
  },
  {
    slug: 'magnetism',
    title: 'Magnetism',
    strand: 'Force and Energy',
    outcome: 'Demonstrate the properties of a magnet and classify materials as magnetic or non-magnetic.',
    emoji: '🧲',
  },
  {
    slug: 'circuits',
    title: 'Electric Circuits',
    strand: 'Force and Energy',
    outcome: 'Construct series and parallel circuits with a battery, switch and two bulbs.',
    emoji: '🔌',
  },
  {
    slug: 'bunsen-burner',
    title: 'Using the Bunsen Burner',
    strand: 'Scientific Investigation',
    outcome: 'Assemble and light a Bunsen burner safely, and control the flame with the air hole.',
    emoji: '🔥',
  },
]

export default function Dashboard() {
  const { user } = useAuth()
  const [completed, setCompleted] = useState(new Set())

  useEffect(() => {
    let cancelled = false
    getProgress(user?.id)
      .then((progress) => {
        if (!cancelled) setCompleted(new Set(Object.keys(progress)))
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [user?.id])

  const doneCount = practicals.filter((p) => completed.has(p.slug)).length

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Grade 7 · Integrated Science</h1>
      <div className="flex items-center gap-3 mb-8">
        <p className="text-slate-500">Pick a practical to get started</p>
        <span className="text-xs font-medium bg-brand-50 text-brand-600 px-2 py-0.5 rounded-full">
          {doneCount}/{practicals.length} completed
        </span>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {practicals.map((p) => {
          const isDone = completed.has(p.slug)
          return (
            <Link
              key={p.slug}
              to={`/app/practicals/${p.slug}`}
              className="relative block border border-slate-200 bg-brand-50 p-6 hover:shadow-md hover:border-brand-300 transition"
            >
              {isDone && (
                <span className="absolute top-4 right-4 text-xs font-medium bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full">
                  ✓ Done
                </span>
              )}
              <div className="text-3xl mb-3">{p.emoji}</div>
              <div className="text-xs font-medium text-brand-600 mb-2">{p.strand}</div>
              <h3 className="font-semibold text-lg text-slate-900 mb-2">{p.title}</h3>
              <p className="text-slate-500 text-sm">{p.outcome}</p>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
