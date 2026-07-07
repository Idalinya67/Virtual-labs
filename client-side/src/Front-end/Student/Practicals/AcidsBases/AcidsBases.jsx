import { useState } from 'react'
import PracticalShell from '../PracticalShell'

const SUBSTANCES = [
  { name: 'Lemon juice', pH: 2, color: '#ef4444', class: 'Acidic' },
  { name: 'Vinegar', pH: 3, color: '#f97316', class: 'Acidic' },
  { name: 'Milk', pH: 6.5, color: '#a3e635', class: 'Neutral' },
  { name: 'Pure water', pH: 7, color: '#22c55e', class: 'Neutral' },
  { name: 'Baking soda solution', pH: 9, color: '#38bdf8', class: 'Basic' },
  { name: 'Soap solution', pH: 11, color: '#6366f1', class: 'Basic' },
  { name: 'Caustic soda solution', pH: 13, color: '#a855f7', class: 'Basic' },
]

const CLASSES = ['Acidic', 'Neutral', 'Basic']

const PLANT_EXTRACTS = [
  { id: 'red-cabbage', name: 'Red cabbage leaves', neutralColor: '#7c3aed', acidColor: '#f472b6', baseColor: '#22c55e' },
  { id: 'hibiscus', name: 'Hibiscus flowers', neutralColor: '#be123c', acidColor: '#f87171', baseColor: '#65a30d' },
  { id: 'bougainvillea', name: 'Bougainvillea bracts', neutralColor: '#db2777', acidColor: '#fb7185', baseColor: '#4d7c0f' },
]

function classify(pH) {
  if (pH < 6.5) return 'Acidic'
  if (pH > 7.5) return 'Basic'
  return 'Neutral'
}

const PH_COLOR_STOPS = [
  { pH: 0, color: '#ef4444' },
  { pH: 2, color: '#f97316' },
  { pH: 4, color: '#facc15' },
  { pH: 6, color: '#a3e635' },
  { pH: 7, color: '#22c55e' },
  { pH: 8, color: '#38bdf8' },
  { pH: 10, color: '#6366f1' },
  { pH: 12, color: '#a855f7' },
  { pH: 14, color: '#7e22ce' },
]

function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

function rgbToHex([r, g, b]) {
  return `#${[r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')}`
}

function colorForPH(pH) {
  const clamped = Math.min(14, Math.max(0, pH))
  let lower = PH_COLOR_STOPS[0]
  let upper = PH_COLOR_STOPS[PH_COLOR_STOPS.length - 1]
  for (let i = 0; i < PH_COLOR_STOPS.length - 1; i++) {
    if (clamped >= PH_COLOR_STOPS[i].pH && clamped <= PH_COLOR_STOPS[i + 1].pH) {
      lower = PH_COLOR_STOPS[i]
      upper = PH_COLOR_STOPS[i + 1]
      break
    }
  }
  const span = upper.pH - lower.pH || 1
  const t = (clamped - lower.pH) / span
  const a = hexToRgb(lower.color)
  const b = hexToRgb(upper.color)
  return rgbToHex(a.map((v, i) => v + (b[i] - v) * t))
}

function litmusResult(substanceClass) {
  if (substanceClass === 'Acidic') return { red: 'stays red', blue: 'turns red' }
  if (substanceClass === 'Basic') return { red: 'turns blue', blue: 'stays blue' }
  return { red: 'stays red', blue: 'stays blue' }
}

export default function AcidsBases() {
  const [stage, setStage] = useState('litmus')

  return (
    <PracticalShell
      slug="acids-bases"
      strand="Mixtures, Elements & Compounds · Acids, Bases and Indicators"
      title="Acids, Bases & Indicators"
      outcome="Identify acids and bases using litmus paper, prepare an acid-base indicator from a plant extract, and classify common substances."
      reflection="Pick two substances you tested. Which had the lowest pH, and what does that tell you about it?"
    >
      <div className="flex gap-2 mb-6 border-b border-slate-200 overflow-x-auto">
        {[
          { id: 'litmus', label: '1. Litmus test' },
          { id: 'indicator', label: '2. Make a plant indicator' },
          { id: 'ph', label: '3. Universal indicator & pH' },
          { id: 'mixing', label: '4. Mixing lab' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setStage(tab.id)}
            className={`text-sm px-3 py-2 border-b-2 -mb-px transition whitespace-nowrap shrink-0 ${
              stage === tab.id
                ? 'border-brand-600 text-brand-700 font-medium'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {stage === 'litmus' && <LitmusStage />}
      {stage === 'indicator' && <IndicatorStage />}
      {stage === 'ph' && <PhStage />}
      {stage === 'mixing' && <MixingLabStage />}
    </PracticalShell>
  )
}

function LitmusStage() {
  const [selected, setSelected] = useState(null)
  const [dipped, setDipped] = useState(false)
  const [tested, setTested] = useState(new Set())

  function pick(s) {
    setSelected(s)
    setDipped(false)
  }

  function dip() {
    setDipped(true)
    setTested((prev) => new Set(prev).add(selected.name))
  }

  const result = selected ? litmusResult(selected.class) : null

  return (
    <div className="grid md:grid-cols-2 gap-8 items-start">
      <div>
        <p className="text-sm text-slate-500 mb-4">
          Litmus paper is the simplest acid-base indicator: red litmus turns blue in a base, and blue litmus
          turns red in an acid. Neither strip changes colour in a neutral substance.
        </p>
        <p className="text-sm font-medium text-slate-700 mb-3">Choose a substance to test</p>
        <div className="flex flex-wrap gap-2">
          {SUBSTANCES.map((s) => (
            <button
              key={s.name}
              onClick={() => pick(s)}
              className={`text-sm px-3 py-1.5 rounded-full border transition ${
                selected?.name === s.name
                  ? 'bg-brand-600 text-white border-brand-600'
                  : tested.has(s.name)
                  ? 'border-brand-200 bg-brand-50 text-brand-700'
                  : 'border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {s.name}
              {tested.has(s.name) && ' ✓'}
            </button>
          ))}
        </div>
        {selected && !dipped && (
          <button
            onClick={dip}
            className="mt-6 bg-brand-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-brand-700 transition"
          >
            Dip red & blue litmus paper
          </button>
        )}
      </div>

      <div className="flex flex-col items-center">
        <div className="flex gap-6">
          <LitmusStrip color="red" changed={dipped && selected.class === 'Basic'} label="Red litmus" />
          <LitmusStrip color="blue" changed={dipped && selected.class === 'Acidic'} label="Blue litmus" />
        </div>
        {selected && dipped ? (
          <div className="text-center mt-4">
            <p className="text-sm text-slate-600">
              Red litmus {result.red} · Blue litmus {result.blue}
            </p>
            <div className="text-lg font-bold text-brand-700 mt-2">{selected.class}</div>
            <div className="text-xs text-slate-400">{selected.name}</div>
          </div>
        ) : (
          <p className="text-sm text-slate-400 mt-4 text-center max-w-[12rem]">
            {selected ? 'Dip both strips to see the result' : 'Select a substance to begin'}
          </p>
        )}
      </div>
    </div>
  )
}

function LitmusStrip({ color, changed, label }) {
  const base = color === 'red' ? '#ef4444' : '#3b82f6'
  const flipped = color === 'red' ? '#3b82f6' : '#ef4444'
  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 30 90" className="w-6 h-24">
        <rect x="10" y="0" width="10" height="60" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
        <rect x="10" y="30" width="10" height="30" fill={changed ? flipped : base} style={{ transition: 'fill 0.4s ease' }} />
      </svg>
      <span className="text-xs text-slate-500 mt-1">{label}</span>
    </div>
  )
}

function IndicatorStage() {
  const [extractId, setExtractId] = useState(PLANT_EXTRACTS[0].id)
  const [extracted, setExtracted] = useState(false)
  const [testedOn, setTestedOn] = useState(null)

  const extract = PLANT_EXTRACTS.find((e) => e.id === extractId)

  function changeExtract(id) {
    setExtractId(id)
    setExtracted(false)
    setTestedOn(null)
  }

  const colorForTest =
    testedOn === 'acid' ? extract.acidColor : testedOn === 'base' ? extract.baseColor : extract.neutralColor

  return (
    <div className="grid md:grid-cols-2 gap-8 items-start">
      <div>
        <p className="text-sm text-slate-500 mb-4">
          Many plants contain natural pigments that change colour in acids and bases, so they can be crushed
          into an indicator when you don't have litmus paper.
        </p>
        <p className="text-sm font-medium text-slate-700 mb-2">Choose a plant material</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {PLANT_EXTRACTS.map((e) => (
            <button
              key={e.id}
              onClick={() => changeExtract(e.id)}
              className={`text-sm px-3 py-1.5 rounded-full border transition ${
                extractId === e.id
                  ? 'bg-brand-600 text-white border-brand-600'
                  : 'border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {e.name}
            </button>
          ))}
        </div>
        {!extracted ? (
          <button
            onClick={() => setExtracted(true)}
            className="bg-brand-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-brand-700 transition"
          >
            Crush & extract juice
          </button>
        ) : (
          <div>
            <p className="text-sm font-medium text-slate-700 mb-2">Test the extract on:</p>
            <div className="flex gap-2">
              <button
                onClick={() => setTestedOn('acid')}
                className={`text-sm px-4 py-1.5 rounded-lg border transition ${
                  testedOn === 'acid' ? 'bg-slate-800 text-white border-slate-800' : 'border-slate-300 hover:bg-slate-50'
                }`}
              >
                An acid (vinegar)
              </button>
              <button
                onClick={() => setTestedOn('base')}
                className={`text-sm px-4 py-1.5 rounded-lg border transition ${
                  testedOn === 'base' ? 'bg-slate-800 text-white border-slate-800' : 'border-slate-300 hover:bg-slate-50'
                }`}
              >
                A base (soap solution)
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col items-center">
        <svg viewBox="0 0 160 160" className="w-32 h-32">
          <circle cx="80" cy="80" r="70" fill={extracted ? colorForTest : '#e2e8f0'} opacity={extracted ? 0.85 : 0.5} style={{ transition: 'fill 0.4s ease, opacity 0.4s ease' }} />
        </svg>
        <p className="text-sm text-slate-600 mt-3 text-center max-w-[14rem]">
          {!extracted
            ? 'Extract the plant juice to see its natural colour.'
            : !testedOn
            ? `Natural colour of ${extract.name.toLowerCase()} extract. Now test it on an acid or a base.`
            : testedOn === 'acid'
            ? `Turns ${prettyColorName(extract.acidColor)} in an acid.`
            : `Turns ${prettyColorName(extract.baseColor)} in a base.`}
        </p>
      </div>
    </div>
  )
}

function prettyColorName(hex) {
  const names = {
    '#f472b6': 'pink',
    '#22c55e': 'green',
    '#f87171': 'red',
    '#65a30d': 'olive green',
    '#fb7185': 'rose',
    '#4d7c0f': 'dark green',
  }
  return names[hex] || 'a different colour'
}

function PhStage() {
  const [selected, setSelected] = useState(null)
  const [prediction, setPrediction] = useState(null)
  const [dipped, setDipped] = useState(false)
  const [log, setLog] = useState([])

  const actual = selected ? classify(selected.pH) : null
  const correct = dipped && prediction === actual

  function pick(substance) {
    setSelected(substance)
    setPrediction(null)
    setDipped(false)
  }

  function dip() {
    if (!selected || !prediction) return
    const result = classify(selected.pH)
    setDipped(true)
    setLog((prev) => [
      { name: selected.name, pH: selected.pH, prediction, actual: result, correct: prediction === result },
      ...prev.filter((entry) => entry.name !== selected.name),
    ])
  }

  const testedNames = new Set(log.map((entry) => entry.name))
  const scoreCorrect = log.filter((entry) => entry.correct).length

  return (
    <div className="grid md:grid-cols-2 gap-8 items-start">
      <div>
        <p className="text-sm text-slate-500 mb-4">
          A universal indicator gives a range of colours across the pH scale, so you can tell not just
          whether something is acidic or basic, but how strong it is.
        </p>
        <p className="text-sm font-medium text-slate-700 mb-3">Choose a substance to test</p>
        <div className="flex flex-wrap gap-2">
          {SUBSTANCES.map((s) => (
            <button
              key={s.name}
              onClick={() => pick(s)}
              className={`text-sm px-3 py-1.5 rounded-full border transition ${
                selected?.name === s.name
                  ? 'bg-brand-600 text-white border-brand-600'
                  : testedNames.has(s.name)
                  ? 'border-brand-200 bg-brand-50 text-brand-700'
                  : 'border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {s.name}
              {testedNames.has(s.name) && ' ✓'}
            </button>
          ))}
        </div>

        {selected && !dipped && (
          <div className="mt-6">
            <p className="text-sm font-medium text-slate-700 mb-2">
              Predict: is {selected.name.toLowerCase()} acidic, neutral or basic?
            </p>
            <div className="flex gap-2 mb-4">
              {CLASSES.map((c) => (
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
              onClick={dip}
              disabled={!prediction}
              className="bg-brand-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-brand-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              Dip universal indicator
            </button>
          </div>
        )}

        {log.length > 0 && (
          <div className="mt-8">
            <div className="flex items-baseline justify-between mb-2">
              <p className="text-sm font-medium text-slate-700">Lab results log</p>
              <span className="text-xs text-slate-400">{scoreCorrect}/{log.length} predictions correct</span>
            </div>
            <table className="w-full text-xs border border-slate-200 rounded-lg overflow-hidden">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="text-left px-3 py-2 font-medium">Substance</th>
                  <th className="text-left px-3 py-2 font-medium">Predicted</th>
                  <th className="text-left px-3 py-2 font-medium">Actual (pH)</th>
                </tr>
              </thead>
              <tbody>
                {log.map((entry) => (
                  <tr key={entry.name} className="border-t border-slate-100">
                    <td className="px-3 py-2 text-slate-700">{entry.name}</td>
                    <td className="px-3 py-2 text-slate-500">{entry.prediction}</td>
                    <td className="px-3 py-2">
                      <span className={entry.correct ? 'text-brand-600' : 'text-red-600'}>
                        {entry.actual} (pH {entry.pH}) {entry.correct ? '✓' : '✗'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="flex flex-col items-center">
        <svg viewBox="0 0 200 220" className="w-40 h-44">
          <rect x="60" y="40" width="80" height="130" rx="8" fill="none" stroke="#334155" strokeWidth="3" />
          {selected && (
            <rect
              x="64"
              y="90"
              width="72"
              height="76"
              fill={dipped ? selected.color : '#cbd5e1'}
              opacity={dipped ? 0.85 : 0.5}
              style={{ transition: 'fill 0.4s ease, opacity 0.4s ease' }}
            />
          )}
          {selected && dipped && (
            <rect x="96" y="10" width="8" height="90" fill={selected.color} stroke="#334155" strokeWidth="1.5" />
          )}
        </svg>

        {selected && dipped ? (
          <div className="text-center mt-2">
            <div className="text-2xl font-bold" style={{ color: selected.color }}>
              pH {selected.pH}
            </div>
            <div className="text-sm font-medium text-slate-700">{actual}</div>
            <div className="text-xs text-slate-400 mt-1">{selected.name}</div>
            <div
              className={`text-sm font-medium mt-3 px-3 py-1 rounded-full inline-block ${
                correct ? 'bg-brand-50 text-brand-700' : 'bg-red-50 text-red-600'
              }`}
            >
              {correct ? 'Your prediction was correct!' : `You predicted ${prediction} - not quite.`}
            </div>
          </div>
        ) : (
          <p className="text-sm text-slate-400 mt-2 text-center max-w-[10rem]">
            {selected ? 'Make a prediction, then dip the indicator strip' : 'Select a substance to begin'}
          </p>
        )}

        <div className="mt-8 w-full">
          <p className="text-xs font-medium text-slate-500 mb-1">Universal indicator colour scale</p>
          <div className="h-3 rounded-full overflow-hidden flex">
            {['#ef4444', '#f97316', '#facc15', '#a3e635', '#22c55e', '#38bdf8', '#6366f1', '#a855f7'].map((c) => (
              <div key={c} className="flex-1" style={{ backgroundColor: c }} />
            ))}
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 mt-1">
            <span>0 (strong acid)</span>
            <span>7 (neutral)</span>
            <span>14 (strong base)</span>
          </div>
        </div>
      </div>
    </div>
  )
}

const MIX_ACIDS = [
  { name: 'Hydrochloric acid', pH: 1 },
  { name: 'Lemon juice', pH: 2 },
  { name: 'Vinegar', pH: 3 },
]

const MIX_BASES = [
  { name: 'Caustic soda solution', pH: 13 },
  { name: 'Soap solution', pH: 11 },
  { name: 'Baking soda solution', pH: 9 },
]

function computeMixedPH({ acid, acidVolume, base, baseVolume, waterVolume }) {
  const molesH = Math.pow(10, -acid.pH) * acidVolume
  const molesOH = Math.pow(10, -(14 - base.pH)) * baseVolume
  const totalVolume = acidVolume + baseVolume + waterVolume

  if (totalVolume === 0) {
    return { pH: 7, molesH, molesOH, totalVolume, net: 0 }
  }

  const net = molesH - molesOH
  let pH
  if (Math.abs(net) < 1e-12) {
    pH = 7
  } else if (net > 0) {
    pH = -Math.log10(net / totalVolume)
  } else {
    const pOH = -Math.log10(-net / totalVolume)
    pH = 14 - pOH
  }

  return { pH: Math.min(14, Math.max(0, pH)), molesH, molesOH, totalVolume, net }
}

function MixingLabStage() {
  const [acidId, setAcidId] = useState(0)
  const [baseId, setBaseId] = useState(0)
  const [acidVolume, setAcidVolume] = useState(20)
  const [baseVolume, setBaseVolume] = useState(20)
  const [waterVolume, setWaterVolume] = useState(0)
  const [showMaths, setShowMaths] = useState(false)

  const acid = MIX_ACIDS[acidId]
  const base = MIX_BASES[baseId]
  const result = computeMixedPH({ acid, acidVolume, base, baseVolume, waterVolume })
  const swatch = colorForPH(result.pH)

  return (
    <div>
      <p className="text-sm text-slate-500 mb-4 max-w-2xl">
        This is a live calculation, not a lookup table: pH is worked out from the actual volumes and
        concentrations you set, using real acid-base neutralisation chemistry (assuming the acid and base
        fully dissociate, like hydrochloric acid and sodium hydroxide). Change any slider and the result
        recomputes.
      </p>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        <div className="space-y-5">
          <div>
            <p className="text-sm font-medium text-slate-700 mb-2">Acid</p>
            <div className="flex gap-2 mb-2">
              {MIX_ACIDS.map((a, i) => (
                <button
                  key={a.name}
                  onClick={() => setAcidId(i)}
                  className={`text-sm px-3 py-1.5 rounded-full border transition ${
                    acidId === i ? 'bg-red-600 text-white border-red-600' : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {a.name} (pH {a.pH})
                </button>
              ))}
            </div>
            <VolumeSlider label="Acid volume" value={acidVolume} onChange={setAcidVolume} color="accent-red-600" />
          </div>

          <div>
            <p className="text-sm font-medium text-slate-700 mb-2">Base</p>
            <div className="flex gap-2 mb-2">
              {MIX_BASES.map((b, i) => (
                <button
                  key={b.name}
                  onClick={() => setBaseId(i)}
                  className={`text-sm px-3 py-1.5 rounded-full border transition ${
                    baseId === i ? 'bg-indigo-600 text-white border-indigo-600' : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {b.name} (pH {b.pH})
                </button>
              ))}
            </div>
            <VolumeSlider label="Base volume" value={baseVolume} onChange={setBaseVolume} color="accent-indigo-600" />
          </div>

          <VolumeSlider label="Water added (dilutes both)" value={waterVolume} onChange={setWaterVolume} color="accent-sky-600" />

          <button
            onClick={() => setShowMaths((s) => !s)}
            className="text-xs text-slate-500 hover:text-slate-800 underline"
          >
            {showMaths ? 'Hide the maths' : 'Show the maths'}
          </button>
          {showMaths && (
            <div className="text-xs font-mono text-slate-500 bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-1">
              <div>moles H⁺ = 10^-{acid.pH} × {acidVolume} = {result.molesH.toExponential(3)}</div>
              <div>moles OH⁻ = 10^-(14-{base.pH}) × {baseVolume} = {result.molesOH.toExponential(3)}</div>
              <div>total volume = {acidVolume} + {baseVolume} + {waterVolume} = {result.totalVolume}</div>
              <div>net = moles H⁺ − moles OH⁻ = {result.net.toExponential(3)}</div>
              <div>pH = {result.pH.toFixed(2)}</div>
            </div>
          )}
        </div>

        <div className="flex flex-col items-center">
          <svg viewBox="0 0 160 180" className="w-32 h-40">
            <rect x="30" y="20" width="100" height="140" rx="8" fill="none" stroke="#334155" strokeWidth="3" />
            <rect x="34" y="60" width="92" height="96" fill={swatch} opacity="0.85" style={{ transition: 'fill 0.2s ease' }} />
          </svg>
          <div className="text-3xl font-bold mt-2" style={{ color: swatch }}>
            pH {result.pH.toFixed(2)}
          </div>
          <div className="text-sm font-medium text-slate-700">{classify(result.pH)}</div>
          <p className="text-xs text-slate-400 mt-2 text-center max-w-[14rem]">
            Try setting acid and base volumes so moles of H⁺ and OH⁻ are equal - the mixture will land exactly
            on pH 7.
          </p>
        </div>
      </div>
    </div>
  )
}

function VolumeSlider({ label, value, onChange, color }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-slate-600">{label}</span>
        <span className="font-mono text-slate-500">{value} mL</span>
      </div>
      <input
        type="range"
        min={0}
        max={50}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={`w-full ${color}`}
      />
    </div>
  )
}
