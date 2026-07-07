import { useState } from 'react'
import PracticalShell from '../PracticalShell'

const MATERIALS = [
  { name: 'Iron nail', emoji: '🔩', magnetic: true },
  { name: 'Steel paperclip', emoji: '📎', magnetic: true },
  { name: 'Aluminium spoon', emoji: '🥄', magnetic: false },
  { name: 'Plastic ruler', emoji: '📏', magnetic: false },
  { name: 'Copper wire', emoji: '🔌', magnetic: false },
  { name: 'Cobalt bolt', emoji: '🔧', magnetic: true },
  { name: 'Wooden pencil', emoji: '✏️', magnetic: false },
  { name: 'Steel bottle cap', emoji: '🧴', magnetic: true },
]

const MAGNETIC_OBJECTS = [
  { name: 'Steel paperclip', emoji: '📎', mass: 1 },
  { name: 'Iron nail', emoji: '🔩', mass: 3 },
  { name: 'Cobalt bolt', emoji: '🔧', mass: 6 },
]

const FORCE_CONSTANT = 300
const FRICTION_PER_MASS = 4.7

function magneticForce(distanceCm) {
  return FORCE_CONSTANT / (distanceCm * distanceCm)
}

const USES = [
  { emoji: '🧭', label: 'Magnetic compass', detail: 'A freely-turning magnetised needle lines up with the Earth’s magnetic field to show direction.' },
  { emoji: '🔊', label: 'Loudspeakers', detail: 'A magnet interacts with an electric current in a coil to make the speaker cone vibrate and produce sound.' },
  { emoji: '🚪', label: 'Refrigerator door seal', detail: 'A magnetic strip in the door seal holds the fridge door firmly closed.' },
  { emoji: '🧲', label: 'Separating mixtures', detail: 'A magnet pulls out magnetic materials like iron filings from a mixture with non-magnetic substances.' },
  { emoji: '🎪', label: 'Magic tricks & toys', detail: 'Hidden magnets make objects move or stick together, creating a ‘magic’ effect.' },
]

export default function Magnetism() {
  return (
    <PracticalShell
      slug="magnetism"
      strand="Force and Energy · Magnetism"
      title="Magnetism"
      outcome="Demonstrate the properties of a magnet, classify materials as magnetic or non-magnetic, and appreciate the uses of magnets in day-to-day life."
      reflection="Name two materials from your test that were not attracted to the magnet. What do they have in common?"
    >
      <div className="space-y-10">
        <MaterialTester />
        <ForceDistanceLab />
        <PoleDemo />
        <UsesGrid />
      </div>
    </PracticalShell>
  )
}

function MaterialTester() {
  const [selected, setSelected] = useState(null)
  const [prediction, setPrediction] = useState(null)
  const [tested, setTested] = useState(false)
  const [log, setLog] = useState([])

  function pick(material) {
    setSelected(material)
    setPrediction(null)
    setTested(false)
  }

  function bringMagnetNear() {
    if (!selected || !prediction) return
    setTested(true)
    setLog((prev) => [
      { name: selected.name, prediction, actual: selected.magnetic, correct: prediction === (selected.magnetic ? 'Magnetic' : 'Non-magnetic') },
      ...prev.filter((entry) => entry.name !== selected.name),
    ])
  }

  const testedNames = new Set(log.map((e) => e.name))
  const scoreCorrect = log.filter((e) => e.correct).length

  return (
    <div>
      <h2 className="font-semibold text-slate-900 mb-1">1. Test materials with a magnet</h2>
      <p className="text-sm text-slate-500 mb-4">
        Only certain metals - mainly iron, steel, nickel and cobalt - are attracted to a magnet. Most other
        materials, including plastic, wood, aluminium and copper, are not.
      </p>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        <div>
          <div className="flex flex-wrap gap-2">
            {MATERIALS.map((m) => (
              <button
                key={m.name}
                onClick={() => pick(m)}
                className={`text-sm px-3 py-1.5 rounded-full border transition ${
                  selected?.name === m.name
                    ? 'bg-brand-600 text-white border-brand-600'
                    : testedNames.has(m.name)
                    ? 'border-brand-200 bg-brand-50 text-brand-700'
                    : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {m.emoji} {m.name}
                {testedNames.has(m.name) && ' ✓'}
              </button>
            ))}
          </div>

          {selected && !tested && (
            <div className="mt-6">
              <p className="text-sm font-medium text-slate-700 mb-2">Predict: will the magnet attract it?</p>
              <div className="flex gap-2 mb-4">
                {['Magnetic', 'Non-magnetic'].map((c) => (
                  <button
                    key={c}
                    onClick={() => setPrediction(c)}
                    className={`text-sm px-4 py-1.5 rounded-lg border transition ${
                      prediction === c
                        ? 'bg-slate-800 text-white border-slate-800'
                        : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
              <button
                onClick={bringMagnetNear}
                disabled={!prediction}
                className="bg-brand-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-brand-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                Bring the magnet near
              </button>
            </div>
          )}

          {log.length > 0 && (
            <p className="text-xs text-slate-400 mt-6">{scoreCorrect}/{log.length} predictions correct</p>
          )}
        </div>

        <div className="flex flex-col items-center">
          <svg viewBox="0 0 220 140" className="w-full max-w-xs h-32">
            <rect x="150" y="50" width="50" height="30" rx="4" fill="#ef4444" stroke="#334155" strokeWidth="2" />
            <rect x="150" y="50" width="25" height="30" rx="4" fill="#3b82f6" stroke="#334155" strokeWidth="2" />
            <text x="175" y="40" textAnchor="middle" fontSize="10" fill="#334155">Magnet</text>

            {selected && (
              <text
                x={tested ? (selected.magnetic ? 145 : 30) : 30}
                y="70"
                fontSize="26"
                textAnchor="middle"
                style={{ transition: 'x 0.6s ease' }}
              >
                {selected.emoji}
              </text>
            )}
          </svg>
          {selected && tested ? (
            <p className={`text-sm font-medium mt-2 ${selected.magnetic ? 'text-brand-600' : 'text-slate-500'}`}>
              {selected.name} is {selected.magnetic ? 'magnetic - it was pulled toward the magnet.' : 'non-magnetic - it stayed still.'}
            </p>
          ) : (
            <p className="text-sm text-slate-400 mt-2">
              {selected ? 'Predict, then bring the magnet near' : 'Select a material to begin'}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

function ForceDistanceLab() {
  const [objectId, setObjectId] = useState(0)
  const [distance, setDistance] = useState(8)
  const [showMaths, setShowMaths] = useState(false)

  const object = MAGNETIC_OBJECTS[objectId]
  const force = magneticForce(distance)
  const threshold = object.mass * FRICTION_PER_MASS
  const pulled = force >= threshold

  const trackMin = 20
  const trackMax = 200
  const objectX = pulled ? trackMax - 10 : trackMin + ((distance - 1) / 11) * (trackMax - trackMin - 20)

  return (
    <div>
      <h2 className="font-semibold text-slate-900 mb-1">2. How distance affects the pulling force</h2>
      <p className="text-sm text-slate-500 mb-4 max-w-2xl">
        A magnet's pull follows an inverse-square law - force = k ÷ distance². This is computed live from the
        distance you set, not a scripted animation, so heavier objects need the magnet much closer before
        they're pulled in.
      </p>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        <div>
          <p className="text-sm font-medium text-slate-700 mb-2">Object</p>
          <div className="flex gap-2 mb-4">
            {MAGNETIC_OBJECTS.map((o, i) => (
              <button
                key={o.name}
                onClick={() => setObjectId(i)}
                className={`text-sm px-3 py-1.5 rounded-full border transition ${
                  objectId === i ? 'bg-brand-600 text-white border-brand-600' : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {o.emoji} {o.name}
              </button>
            ))}
          </div>

          <div className="flex justify-between text-sm mb-1">
            <span className="text-slate-600">Distance from magnet</span>
            <span className="font-mono text-slate-500">{distance} cm</span>
          </div>
          <input
            type="range"
            min={1}
            max={12}
            value={distance}
            onChange={(e) => setDistance(Number(e.target.value))}
            className="w-full accent-brand-600"
          />

          <button
            onClick={() => setShowMaths((s) => !s)}
            className="text-xs text-slate-500 hover:text-slate-800 underline mt-4 block"
          >
            {showMaths ? 'Hide the maths' : 'Show the maths'}
          </button>
          {showMaths && (
            <div className="text-xs font-mono text-slate-500 bg-slate-50 border border-slate-200 rounded-lg p-3 mt-2 space-y-1">
              <div>force = {FORCE_CONSTANT} ÷ {distance}² = {force.toFixed(1)}</div>
              <div>hold threshold ({object.name}) = {object.mass} × {FRICTION_PER_MASS} = {threshold.toFixed(1)}</div>
              <div>{pulled ? 'force ≥ threshold → pulled in' : 'force < threshold → stays put'}</div>
            </div>
          )}
        </div>

        <div className="flex flex-col items-center">
          <svg viewBox="0 0 220 100" className="w-full max-w-xs h-24">
            <rect x="200" y="35" width="16" height="30" rx="3" fill="#ef4444" stroke="#334155" strokeWidth="1.5" />
            <rect x="200" y="35" width="8" height="30" fill="#3b82f6" stroke="#334155" strokeWidth="1.5" />
            <text x={objectX} y="55" fontSize="22" textAnchor="middle" style={{ transition: 'x 0.3s ease' }}>
              {object.emoji}
            </text>
          </svg>
          <div className="w-full max-w-xs mt-2">
            <div className="flex justify-between text-xs text-slate-400 mb-1">
              <span>Force: {force.toFixed(1)}</span>
              <span>Threshold: {threshold.toFixed(1)}</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full ${pulled ? 'bg-brand-500' : 'bg-slate-400'}`}
                style={{ width: `${Math.min(100, (force / threshold) * 100)}%`, transition: 'width 0.2s ease' }}
              />
            </div>
          </div>
          <p className={`text-sm font-medium mt-3 ${pulled ? 'text-brand-600' : 'text-slate-500'}`}>
            {pulled ? `Pulled in! Force overcame the ${object.name.toLowerCase()}'s resistance.` : 'Not close enough yet - reduce the distance.'}
          </p>
        </div>
      </div>
    </div>
  )
}

function PoleDemo() {
  const [rightPole, setRightPole] = useState('S')

  const repelling = rightPole === 'N'

  return (
    <div>
      <h2 className="font-semibold text-slate-900 mb-1">3. Poles and directional force</h2>
      <p className="text-sm text-slate-500 mb-4">
        Every magnet has a north and a south pole. Like poles repel each other; unlike poles attract.
      </p>
      <div className="flex flex-col items-center">
        <svg viewBox="0 0 300 100" className="w-full max-w-sm h-24">
          <g transform={repelling ? 'translate(-14,0)' : 'translate(6,0)'} style={{ transition: 'transform 0.4s ease' }}>
            <rect x="60" y="35" width="60" height="30" fill="#3b82f6" stroke="#334155" strokeWidth="2" />
            <rect x="30" y="35" width="30" height="30" fill="#ef4444" stroke="#334155" strokeWidth="2" />
            <text x="45" y="55" textAnchor="middle" fontSize="12" fill="white" fontWeight="700">N</text>
            <text x="90" y="55" textAnchor="middle" fontSize="12" fill="white" fontWeight="700">S</text>
          </g>
          <g transform={repelling ? 'translate(14,0)' : 'translate(-6,0)'} style={{ transition: 'transform 0.4s ease' }}>
            <rect x="180" y="35" width="30" height="30" fill={rightPole === 'N' ? '#ef4444' : '#3b82f6'} stroke="#334155" strokeWidth="2" />
            <rect x="210" y="35" width="30" height="30" fill={rightPole === 'N' ? '#3b82f6' : '#ef4444'} stroke="#334155" strokeWidth="2" />
            <text x="195" y="55" textAnchor="middle" fontSize="12" fill="white" fontWeight="700">{rightPole}</text>
            <text x="225" y="55" textAnchor="middle" fontSize="12" fill="white" fontWeight="700">{rightPole === 'N' ? 'S' : 'N'}</text>
          </g>
        </svg>
        <button
          onClick={() => setRightPole((p) => (p === 'N' ? 'S' : 'N'))}
          className="mt-3 border border-slate-300 text-slate-700 px-5 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition"
        >
          Flip the right-hand magnet
        </button>
        <p className={`text-sm font-medium mt-3 ${repelling ? 'text-red-600' : 'text-brand-600'}`}>
          {repelling ? 'Like poles (N-N) repel - the magnets push apart.' : 'Unlike poles (N-S) attract - the magnets pull together.'}
        </p>
      </div>
    </div>
  )
}

function UsesGrid() {
  return (
    <div>
      <h2 className="font-semibold text-slate-900 mb-1">4. Uses of magnets in day-to-day life</h2>
      <p className="text-sm text-slate-500 mb-4">Tap a use to see how it depends on magnetism.</p>
      <UsesCards />
    </div>
  )
}

function UsesCards() {
  const [openIndex, setOpenIndex] = useState(null)
  return (
    <div className="grid sm:grid-cols-3 gap-3">
      {USES.map((u, i) => (
        <button
          key={u.label}
          onClick={() => setOpenIndex(openIndex === i ? null : i)}
          className="text-left border border-slate-200 rounded-xl p-4 hover:border-brand-300 hover:shadow-sm transition"
        >
          <div className="text-2xl mb-2">{u.emoji}</div>
          <div className="font-medium text-slate-900 text-sm mb-1">{u.label}</div>
          {openIndex === i && <div className="text-xs text-slate-500 mt-2">{u.detail}</div>}
        </button>
      ))}
    </div>
  )
}
