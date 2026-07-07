import { useState } from 'react'
import PracticalShell from '../PracticalShell'

const MIXTURES = [
  {
    id: 'salt-water',
    label: 'Salt dissolved in water',
    emoji: '🧂',
    description: 'A solid (salt) fully dissolved in water. You want to recover the dry salt.',
    correctTechnique: 'evaporation',
    options: ['evaporation', 'simple-distillation', 'sublimation'],
  },
  {
    id: 'copper-sulphate',
    label: 'Copper sulphate solution',
    emoji: '💎',
    description: 'A dissolved salt where you want large, pure crystals - not a scorched powder.',
    correctTechnique: 'crystallisation',
    options: ['crystallisation', 'evaporation', 'chromatography'],
  },
  {
    id: 'salty-water-drink',
    label: 'Salty water (want the water back)',
    emoji: '💧',
    description: 'The same salt-water mixture, but this time you want to recover pure drinking water.',
    correctTechnique: 'simple-distillation',
    options: ['simple-distillation', 'evaporation', 'crystallisation'],
  },
  {
    id: 'water-ethanol',
    label: 'Water & ethanol mixture',
    emoji: '🧪',
    description: 'Two liquids that mix completely (miscible), with close but different boiling points.',
    correctTechnique: 'fractional-distillation',
    options: ['fractional-distillation', 'simple-distillation', 'solvent-extraction'],
  },
  {
    id: 'iodine-salt',
    label: 'Iodine mixed with salt',
    emoji: '🟣',
    description: 'Two solids mixed dry - iodine turns to vapour on heating without melting; salt does not.',
    correctTechnique: 'sublimation',
    options: ['sublimation', 'evaporation', 'crystallisation'],
  },
  {
    id: 'groundnut-oil',
    label: 'Oil trapped in crushed groundnuts',
    emoji: '🥜',
    description: 'Oil is locked inside solid plant material, not dissolved in a liquid.',
    correctTechnique: 'solvent-extraction',
    options: ['solvent-extraction', 'simple-distillation', 'chromatography'],
  },
  {
    id: 'black-ink',
    label: 'Dyes in black ink',
    emoji: '🖊️',
    description: 'Black ink is actually a mixture of several coloured dyes.',
    correctTechnique: 'chromatography',
    options: ['chromatography', 'fractional-distillation', 'evaporation'],
  },
]

const TECHNIQUE_LABELS = {
  evaporation: 'Evaporation',
  crystallisation: 'Crystallisation',
  'simple-distillation': 'Simple distillation',
  'fractional-distillation': 'Fractional distillation',
  sublimation: 'Sublimation',
  'solvent-extraction': 'Solvent extraction',
  chromatography: 'Chromatography',
}

const WHY_WRONG = {
  'salt-water': {
    'simple-distillation': 'Distillation collects the liquid (water), not the dissolved solid - the salt would stay in the flask, not the receiver you want.',
    sublimation: 'Salt does not turn into a vapour when heated - only certain solids like iodine do that.',
  },
  'copper-sulphate': {
    evaporation: 'Evaporating a solution fully to dryness heats it too strongly and can decompose the compound, leaving an impure powder instead of clean crystals.',
    chromatography: 'Chromatography separates dissolved coloured substances of different solubility - it will not recover solid crystals from a solution.',
  },
  'salty-water-drink': {
    evaporation: 'Evaporation drives the water off as vapour into the air - you would be left with the salt, and the water would be lost, not collected.',
    crystallisation: 'Crystallisation is used to recover a dissolved solid, not the liquid it was dissolved in.',
  },
  'water-ethanol': {
    'simple-distillation': 'Water and ethanol boil at temperatures too close together - simple distillation cannot separate them cleanly; a fractionating column is needed.',
    'solvent-extraction': 'Both substances are already completely mixed as liquids - there is no separate solid to pull out with a solvent.',
  },
  'iodine-salt': {
    evaporation: 'There is no liquid or solution here - evaporation only works on a dissolved solid in a liquid.',
    crystallisation: 'Crystallisation needs a solution to cool and form crystals from - this is a dry mixture of two solids.',
  },
  'groundnut-oil': {
    'simple-distillation': 'The oil is not already dissolved in a low-boiling liquid mixture, so there is nothing yet to boil off and collect.',
    chromatography: 'Chromatography separates small amounts of dissolved coloured substances on paper - it cannot extract bulk oil from solid plant tissue.',
  },
  'black-ink': {
    'fractional-distillation': 'The dyes in ink are dissolved solids, not liquids with different boiling points - there is nothing to distil.',
    evaporation: 'Evaporating the ink would leave all the dyes mixed together as a solid smear, not separated into visible bands.',
  },
}

const STEPS_BY_TECHNIQUE = {
  evaporation: ['heat', 'done'],
  crystallisation: ['heat-partial', 'cool', 'done'],
  'simple-distillation': ['heat', 'condense', 'done'],
  'fractional-distillation': ['heat', 'fractionate', 'done'],
  sublimation: ['heat', 'vapourise', 'done'],
  'solvent-extraction': ['soak', 'drain', 'done'],
  chromatography: ['spot', 'run', 'done'],
}

const ACTION_LABEL = {
  heat: 'Heat the mixture',
  'heat-partial': 'Warm gently to a saturated solution',
  cool: 'Let the solution cool slowly',
  condense: 'Cool the vapour in a condenser',
  fractionate: 'Let vapours rise through the fractionating column',
  vapourise: 'Watch the iodine turn to vapour',
  soak: 'Soak the solid in a solvent',
  drain: 'Drain off the oil-solvent mixture',
  spot: 'Spot the ink near the base of the paper',
  run: 'Dip the paper edge in solvent and let it run',
}

const STEP_TEXT = {
  evaporation: {
    heat: 'Step 1: The solution is gently heated in an evaporating dish until the water boils away.',
    done: 'Done: dry salt crystals remain in the dish - the water escaped as vapour.',
  },
  crystallisation: {
    'heat-partial': 'Step 1: The solution is warmed gently until it becomes saturated (not fully dried out).',
    cool: 'Step 2: The saturated solution is left to cool slowly and undisturbed.',
    done: 'Done: pure copper sulphate crystals form; the leftover liquid is drained off.',
  },
  'simple-distillation': {
    heat: 'Step 1: The salty water is heated in a flask until it boils.',
    condense: 'Step 2: Steam passes into a condenser and cools back into a liquid.',
    done: 'Done: pure water collects in the receiver; the salt stays behind in the flask.',
  },
  'fractional-distillation': {
    heat: 'Step 1: The water-ethanol mixture is heated in a flask fitted with a fractionating column.',
    fractionate: 'Step 2: Ethanol (the lower boiling point liquid) vaporises first and rises through the column.',
    done: 'Done: ethanol is collected first from the condenser; water follows later at a higher temperature.',
  },
  sublimation: {
    heat: 'Step 1: The iodine-salt mixture is gently heated in a covered dish.',
    vapourise: 'Step 2: Iodine turns directly into a purple vapour without melting - salt does not.',
    done: 'Done: iodine vapour deposits back into solid crystals on the cool lid; pure salt remains below.',
  },
  'solvent-extraction': {
    soak: 'Step 1: Crushed groundnuts are soaked in a solvent that dissolves oil but not the solid pulp.',
    drain: 'Step 2: The oil-solvent mixture is drained away from the leftover solid residue.',
    done: 'Done: the solvent is evaporated off, leaving pure oil behind.',
  },
  chromatography: {
    spot: 'Step 1: A small spot of ink is placed near the bottom of a strip of chromatography paper.',
    run: 'Step 2: The paper’s edge is dipped in solvent, which rises up and carries the dyes at different speeds.',
    done: 'Done: separate coloured bands appear, revealing the different dyes that made up the ink.',
  },
}

export default function SeparatingMixtures() {
  const [mixtureId, setMixtureId] = useState(null)
  const [wrongAttempts, setWrongAttempts] = useState([])
  const [confirmedTechnique, setConfirmedTechnique] = useState(null)
  const [stepIndex, setStepIndex] = useState(0)

  const mixture = MIXTURES.find((m) => m.id === mixtureId)

  function pickMixture(id) {
    setMixtureId(id)
    setWrongAttempts([])
    setConfirmedTechnique(null)
    setStepIndex(0)
  }

  function chooseTechnique(techniqueId) {
    if (techniqueId === mixture.correctTechnique) {
      setConfirmedTechnique(techniqueId)
      setStepIndex(0)
    } else {
      setWrongAttempts((prev) => (prev.includes(techniqueId) ? prev : [...prev, techniqueId]))
    }
  }

  function reset() {
    setMixtureId(null)
    setWrongAttempts([])
    setConfirmedTechnique(null)
    setStepIndex(0)
  }

  const steps = confirmedTechnique ? STEPS_BY_TECHNIQUE[confirmedTechnique] : null
  const step = steps ? steps[stepIndex] : null

  function next() {
    setStepIndex((i) => Math.min(i + 1, steps.length - 1))
  }

  return (
    <PracticalShell
      slug="separating-mixtures"
      strand="Mixtures, Elements & Compounds · Separation of Homogeneous Mixtures"
      title="Separating Mixtures"
      outcome="Choose and apply the appropriate method to separate different homogeneous mixtures, and explain their real-life applications."
      reflection="For the mixture you separated, why would the other methods not have worked as well?"
    >
      {!mixture ? (
        <div>
          <p className="text-sm font-medium text-slate-700 mb-3">Choose a mixture to separate</p>
          <div className="grid sm:grid-cols-3 gap-3">
            {MIXTURES.map((m) => (
              <button
                key={m.id}
                onClick={() => pickMixture(m.id)}
                className="text-left border border-slate-200 p-4 hover:border-brand-300 hover:shadow-sm transition"
              >
                <div className="text-2xl mb-2">{m.emoji}</div>
                <div className="font-medium text-slate-900 text-sm mb-1">{m.label}</div>
                <div className="text-xs text-slate-500">{m.description}</div>
              </button>
            ))}
          </div>
        </div>
      ) : !confirmedTechnique ? (
        <div>
          <button onClick={reset} className="text-xs text-slate-400 hover:text-slate-600 mb-3">
            ← Choose a different mixture
          </button>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">{mixture.emoji}</span>
            <p className="font-medium text-slate-900 text-sm">{mixture.label}</p>
          </div>
          <p className="text-sm text-slate-500 mb-4">{mixture.description}</p>
          <p className="text-sm font-medium text-slate-700 mb-2">Which method will separate this mixture?</p>
          <div className="flex flex-col gap-2 max-w-sm">
            {mixture.options.map((techniqueId) => {
              const wasWrong = wrongAttempts.includes(techniqueId)
              return (
                <button
                  key={techniqueId}
                  onClick={() => chooseTechnique(techniqueId)}
                  disabled={wasWrong}
                  className={`text-left text-sm px-4 py-2.5 rounded-lg border transition ${
                    wasWrong
                      ? 'border-red-200 bg-red-50 text-red-600 cursor-not-allowed'
                      : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {TECHNIQUE_LABELS[techniqueId]} {wasWrong && '✗'}
                </button>
              )
            })}
          </div>
          {wrongAttempts.length > 0 && (
            <div className="mt-4 text-sm text-red-600 max-w-sm space-y-1">
              {wrongAttempts.map((id) => (
                <p key={id}>{WHY_WRONG[mixture.id][id]}</p>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <div className="text-xs font-medium text-brand-600 mb-2">{TECHNIQUE_LABELS[confirmedTechnique]}</div>
          <div key={step} className="step-fade-in">
            <MixtureScene technique={confirmedTechnique} step={step} />
          </div>

          <div key={`${step}-text`} className="text-center mb-4 max-w-md step-fade-in">
            <p className="text-sm text-slate-600">{STEP_TEXT[confirmedTechnique][step]}</p>
          </div>

          <div className="flex gap-3">
            {step !== 'done' ? (
              <button
                onClick={next}
                className="bg-brand-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-brand-700 transition"
              >
                {ACTION_LABEL[step]}
              </button>
            ) : (
              <button
                onClick={reset}
                className="border border-slate-300 text-slate-700 px-6 py-2.5 rounded-lg font-medium hover:bg-slate-50 transition"
              >
                Try another mixture
              </button>
            )}
          </div>
        </div>
      )}
    </PracticalShell>
  )
}

function Flask({ children }) {
  return (
    <g>
      <path d="M135 40 L165 40 L165 90 L195 160 Q150 180 105 160 L135 90 Z" fill="none" stroke="#334155" strokeWidth="3" />
      {children}
    </g>
  )
}

function HeatSource({ x = 150 }) {
  return (
    <g>
      <rect x={x - 30} y="165" width="60" height="10" fill="#475569" />
      <path d={`M ${x - 10} 165 C ${x - 16} 155 ${x - 4} 150 ${x - 10} 140`} stroke="#f97316" strokeWidth="2" fill="none" />
      <path d={`M ${x + 10} 165 C ${x + 4} 155 ${x + 16} 150 ${x + 10} 140`} stroke="#f97316" strokeWidth="2" fill="none" />
    </g>
  )
}

function MixtureScene({ technique, step }) {
  const heating = ['heat', 'heat-partial', 'fractionate'].includes(step)

  if (technique === 'evaporation' || technique === 'crystallisation') {
    return (
      <svg viewBox="0 0 300 220" className="w-full max-w-xs h-56">
        <Flask>
          {step !== 'done' && <path d="M112 130 L188 130 L192 155 Q150 172 108 155 Z" fill="#93c5fd" opacity="0.7" />}
          {step === 'cool' && (
            <g>
              {Array.from({ length: 8 }).map((_, i) => (
                <rect key={i} x={122 + (i % 4) * 14} y={140 + Math.floor(i / 4) * 10} width="6" height="6" fill="#38bdf8" transform="rotate(45)" style={{ transformOrigin: `${122 + (i % 4) * 14}px ${140 + Math.floor(i / 4) * 10}px` }} />
              ))}
            </g>
          )}
          {step === 'done' && (
            <g>
              {Array.from({ length: 10 }).map((_, i) => (
                <rect
                  key={i}
                  x={115 + (i % 5) * 14}
                  y={148 + Math.floor(i / 5) * 10}
                  width="7"
                  height="7"
                  fill={technique === 'crystallisation' ? '#38bdf8' : '#e2e8f0'}
                  transform="rotate(45)"
                  style={{ transformOrigin: `${115 + (i % 5) * 14}px ${148 + Math.floor(i / 5) * 10}px` }}
                />
              ))}
            </g>
          )}
        </Flask>
        {heating && <HeatSource />}
        {(step === 'heat' || step === 'heat-partial') && (
          <g fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" opacity="0.7">
            <path d="M140 38 C135 25 148 20 140 5" />
            <path d="M160 38 C155 25 168 20 160 5" />
          </g>
        )}
      </svg>
    )
  }

  if (technique === 'simple-distillation' || technique === 'fractional-distillation') {
    return (
      <svg viewBox="0 0 340 220" className="w-full max-w-sm h-56">
        <Flask>
          <path d="M112 130 L188 130 L192 155 Q150 172 108 155 Z" fill="#93c5fd" opacity="0.7" />
        </Flask>
        {technique === 'fractional-distillation' && (
          <rect x="142" y="10" width="16" height="35" fill="none" stroke="#334155" strokeWidth="2" />
        )}
        <path d="M165 30 L230 30 L230 60" stroke="#334155" strokeWidth="3" fill="none" />
        <rect x="215" y="60" width="30" height="70" rx="4" fill="none" stroke="#334155" strokeWidth="2" />
        {(step === 'condense' || step === 'fractionate') && (
          <g fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round">
            <path d="M175 30 C185 24 195 34 205 28" opacity="0.8" />
          </g>
        )}
        <rect x="205" y="130" width="50" height="40" rx="4" fill="none" stroke="#334155" strokeWidth="2" />
        {step === 'done' && <rect x="209" y="150" width="42" height="16" fill="#bfdbfe" opacity="0.85" />}
        {heating && <HeatSource />}
        <text x="230" y="185" textAnchor="middle" fontSize="10" fill="#64748b">
          {technique === 'fractional-distillation' ? 'Ethanol, then water' : 'Pure water'}
        </text>
      </svg>
    )
  }

  if (technique === 'sublimation') {
    return (
      <svg viewBox="0 0 280 200" className="w-full max-w-xs h-52">
        <ellipse cx="140" cy="140" rx="90" ry="30" fill="none" stroke="#334155" strokeWidth="3" />
        <ellipse cx="140" cy="90" rx="95" ry="18" fill="none" stroke="#334155" strokeWidth="2" />
        {step === 'heat' && (
          <g>
            {Array.from({ length: 10 }).map((_, i) => (
              <circle key={i} cx={100 + (i % 5) * 18} cy={130 + Math.floor(i / 5) * 10} r="3" fill="#a855f7" />
            ))}
            {Array.from({ length: 10 }).map((_, i) => (
              <circle key={`s-${i}`} cx={104 + (i % 5) * 18} cy={125 + Math.floor(i / 5) * 10} r="2.5" fill="#e2e8f0" />
            ))}
          </g>
        )}
        {step === 'vapourise' && (
          <g fill="#c084fc" opacity="0.6">
            {Array.from({ length: 14 }).map((_, i) => (
              <circle key={i} cx={90 + (i % 7) * 16} cy={80 - Math.floor(i / 7) * 20} r="4" />
            ))}
          </g>
        )}
        {step === 'done' && (
          <g>
            <g>
              {Array.from({ length: 10 }).map((_, i) => (
                <circle key={`salt-${i}`} cx={104 + (i % 5) * 18} cy={130 + Math.floor(i / 5) * 10} r="2.5" fill="#e2e8f0" />
              ))}
            </g>
            <g>
              {Array.from({ length: 8 }).map((_, i) => (
                <circle key={`i-${i}`} cx={95 + (i % 4) * 24} cy="90" r="3" fill="#a855f7" />
              ))}
            </g>
          </g>
        )}
        {heating && <HeatSource x={140} />}
        <text x="140" y="30" textAnchor="middle" fontSize="10" fill="#64748b">
          {step === 'done' ? 'Iodine deposits on lid · salt stays below' : 'Iodine + salt'}
        </text>
      </svg>
    )
  }

  if (technique === 'solvent-extraction') {
    return (
      <svg viewBox="0 0 280 220" className="w-full max-w-xs h-56">
        <rect x="90" y="60" width="100" height="110" rx="8" fill="none" stroke="#334155" strokeWidth="3" />
        {step === 'soak' && (
          <g>
            <rect x="94" y="120" width="92" height="46" fill="#fde68a" opacity="0.5" />
            {Array.from({ length: 10 }).map((_, i) => (
              <circle key={i} cx={105 + (i % 5) * 16} cy={140 + Math.floor(i / 5) * 12} r="4" fill="#92400e" />
            ))}
          </g>
        )}
        {(step === 'drain' || step === 'done') && (
          <g>
            <path d="M94 155 L186 155 L182 166 Q140 176 98 166 Z" fill="#fbbf24" opacity="0.7" />
            {Array.from({ length: 8 }).map((_, i) => (
              <circle key={i} cx={105 + (i % 4) * 20} cy={135 + Math.floor(i / 4) * 10} r="4" fill="#92400e" />
            ))}
          </g>
        )}
        {(step === 'drain' || step === 'done') && (
          <g>
            <rect x="130" y="170" width="20" height="10" fill="none" stroke="#334155" strokeWidth="2" />
            <rect x="200" y="185" width="50" height="30" rx="4" fill="none" stroke="#334155" strokeWidth="2" />
            {step === 'done' && <rect x="204" y="200" width="42" height="11" fill="#fbbf24" opacity="0.85" />}
          </g>
        )}
        <text x="140" y="200" textAnchor="middle" fontSize="10" fill="#64748b">
          {step === 'done' ? 'Pure oil collected' : 'Crushed groundnuts + solvent'}
        </text>
      </svg>
    )
  }

  // chromatography
  return (
    <svg viewBox="0 0 220 220" className="w-full max-w-xs h-56">
      <rect x="90" y="180" width="60" height="16" fill="none" stroke="#334155" strokeWidth="2" />
      {step === 'run' && <rect x="94" y="182" width="52" height="10" fill="#bfdbfe" opacity="0.8" />}
      {step === 'done' && <rect x="94" y="182" width="52" height="10" fill="#bfdbfe" opacity="0.8" />}
      <rect x="100" y="20" width="20" height="170" fill="#fafafa" stroke="#334155" strokeWidth="2" />
      {step === 'spot' && <circle cx="110" cy="170" r="4" fill="#1e293b" />}
      {step === 'run' && (
        <g>
          <rect x="100" y="150" width="20" height="30" fill="#e2e8f0" opacity="0.6" />
          <circle cx="110" cy="150" r="4" fill="#1e293b" opacity="0.7" />
        </g>
      )}
      {step === 'done' && (
        <g>
          <rect x="100" y="120" width="20" height="8" fill="#3b82f6" opacity="0.8" />
          <rect x="100" y="90" width="20" height="8" fill="#ef4444" opacity="0.8" />
          <rect x="100" y="60" width="20" height="8" fill="#eab308" opacity="0.8" />
        </g>
      )}
      <text x="110" y="210" textAnchor="middle" fontSize="10" fill="#64748b">
        {step === 'done' ? 'Dyes separated by colour' : 'Ink spot on paper'}
      </text>
    </svg>
  )
}
