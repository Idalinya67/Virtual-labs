import { useState } from 'react'
import PracticalShell from '../PracticalShell'

export default function BunsenBurner() {
  const [airHoleOpen, setAirHoleOpen] = useState(false)
  const [matchLit, setMatchLit] = useState(false)
  const [gasOn, setGasOn] = useState(false)
  const [ignited, setIgnited] = useState(false)
  const [riskyIgnition, setRiskyIgnition] = useState(false)

  function toggleMatch() {
    const next = !matchLit
    setMatchLit(next)
    if (next && gasOn && !ignited) {
      setIgnited(true)
      setRiskyIgnition(true)
    }
  }

  function toggleGas() {
    const next = !gasOn
    setGasOn(next)
    if (!next) {
      setIgnited(false)
      setRiskyIgnition(false)
      return
    }
    if (next && matchLit && !ignited) {
      setIgnited(true)
      setRiskyIgnition(false)
    }
  }

  function reset() {
    setAirHoleOpen(false)
    setMatchLit(false)
    setGasOn(false)
    setIgnited(false)
    setRiskyIgnition(false)
  }

  const gasLeaking = gasOn && !ignited

  const statusMessage = riskyIgnition
    ? 'Dangerous! Gas was already flowing before the match was lit - this can cause a flare-up. Always light the match first.'
    : gasLeaking
    ? 'Gas is escaping unburned - light the match before opening the gas valve.'
    : ignited && airHoleOpen
    ? 'Air hole open: hot, roaring blue flame - used for heating.'
    : ignited
    ? 'Air hole closed: yellow, flickering safety flame - visible but not for heating.'
    : 'Burner is off. Correct order: close the air hole, light the match, then open the gas valve.'

  const statusColor = riskyIgnition || gasLeaking ? 'text-red-600' : ignited ? 'text-brand-600' : 'text-slate-500'

  return (
    <PracticalShell
      slug="bunsen-burner"
      strand="Scientific Investigation · Laboratory Apparatus and Instruments"
      title="Using the Bunsen Burner"
      outcome="Assemble and light a Bunsen burner safely, and explain how the air hole controls the flame."
      reflection="Why should you always light the match before turning on the gas tap? What flame colour should be used for heating, and why?"
    >
      <div className="flex flex-col items-center">
        <svg viewBox="0 0 340 320" className="w-full max-w-sm h-72">
          {/* Base */}
          <rect x="90" y="270" width="120" height="20" rx="4" fill="#475569" />
          {/* Gas inlet tube */}
          <path d="M 90 280 L 40 280 L 40 260" stroke="#475569" strokeWidth="8" fill="none" strokeLinecap="round" />
          {/* Barrel */}
          <rect x="130" y="120" width="40" height="150" fill="#cbd5e1" stroke="#334155" strokeWidth="2" />
          {/* Collar / air hole indicator */}
          <rect
            id="air-hole-collar"
            x="130"
            y="230"
            width="40"
            height="24"
            fill={airHoleOpen ? '#fca5a5' : '#94a3b8'}
            stroke="#334155"
            strokeWidth="2"
            className="cursor-pointer"
            onClick={() => setAirHoleOpen((o) => !o)}
          />
          <text x="150" y="316" textAnchor="middle" fontSize="11" fill="#334155">
            Air hole: {airHoleOpen ? 'open' : 'closed'} (click collar)
          </text>

          {/* Flame */}
          {ignited && !airHoleOpen && (
            <path
              d="M 150 120 C 140 95 160 85 150 55 C 165 75 175 95 158 120 Z"
              fill="#facc15"
              stroke="#eab308"
              strokeWidth="1"
              className="flame-flicker"
            />
          )}
          {ignited && airHoleOpen && (
            <path
              d="M 150 120 C 143 100 157 90 150 40 C 160 70 168 100 156 120 Z"
              fill="#60a5fa"
              stroke="#2563eb"
              strokeWidth="1"
              opacity="0.9"
              className="flame-flicker"
            />
          )}

          {/* Gas leak wisp */}
          {gasLeaking && (
            <g fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" opacity="0.7">
              <path d="M 150 118 C 145 105 158 100 150 88" />
            </g>
          )}

          {/* Match */}
          <g className="cursor-pointer" onClick={toggleMatch}>
            <line x1="230" y1="200" x2="200" y2="150" stroke="#92400e" strokeWidth="4" strokeLinecap="round" />
            <circle cx="198" cy="146" r="6" fill={matchLit ? '#f97316' : '#78350f'} />
            <text x="232" y="205" fontSize="11" fill="#334155">
              {matchLit ? 'Match lit' : 'Click to'}
            </text>
            <text x="232" y="218" fontSize="11" fill="#334155">
              {matchLit ? '(click to put out)' : 'strike match'}
            </text>
          </g>
        </svg>

        <div className="flex gap-3 mt-2">
          <button
            onClick={toggleGas}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition ${
              gasOn ? 'bg-slate-700 text-white hover:bg-slate-800' : 'bg-brand-600 text-white hover:bg-brand-700'
            }`}
          >
            {gasOn ? 'Turn gas off' : 'Turn gas on'}
          </button>
          <button
            onClick={reset}
            className="border border-slate-300 text-slate-700 px-5 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition"
          >
            Reset
          </button>
        </div>

        <p className={`text-sm font-medium mt-4 text-center max-w-md ${statusColor}`}>{statusMessage}</p>
      </div>
    </PracticalShell>
  )
}
