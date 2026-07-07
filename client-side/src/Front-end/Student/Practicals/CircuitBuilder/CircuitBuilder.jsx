import { useRef, useState } from 'react'
import PracticalShell from '../PracticalShell'
import RotateHint from '../RotateHint'
import { COMPONENT_DEFS, evaluateCircuit, terminalKey, terminalPosition } from './circuitGraph'

let uid = 0
const nextId = (prefix) => `${prefix}${uid++}`

const LIMITS = { battery: 1, bulb: 4, switch: 2 }

function clamp(v, min, max) {
  return Math.min(max, Math.max(min, v))
}

function clientToSvgPoint(svg, clientX, clientY) {
  const pt = svg.createSVGPoint()
  pt.x = clientX
  pt.y = clientY
  const ctm = svg.getScreenCTM()
  if (!ctm) return { x: clientX, y: clientY }
  const p = pt.matrixTransform(ctm.inverse())
  return { x: p.x, y: p.y }
}

export default function CircuitBuilder() {
  const [components, setComponents] = useState([{ id: nextId('battery'), type: 'battery', x: 110, y: 200 }])
  const [wires, setWires] = useState([])
  const [selectedTerminal, setSelectedTerminal] = useState(null)
  const [selectedComponent, setSelectedComponent] = useState(null)
  const [hoveredWire, setHoveredWire] = useState(null)
  const dragRef = useRef(null)

  const { isShort, bulbStates, circuitClosed, isEnergized, batteryMissing } = evaluateCircuit(components, wires)

  const bulbs = components.filter((c) => c.type === 'bulb')
  const switches = components.filter((c) => c.type === 'switch')
  const litCount = Object.values(bulbStates).filter(Boolean).length

  function addComponent(type) {
    const countOfType = components.filter((c) => c.type === type).length
    if (countOfType >= LIMITS[type]) return
    const index = countOfType
    const position =
      type === 'battery'
        ? { x: 110, y: 200 }
        : type === 'bulb'
        ? { x: 420 + (index % 2) * 140, y: 120 + Math.floor(index / 2) * 160 }
        : { x: 260, y: 120 + index * 160 }
    const extra = type === 'switch' ? { closed: false } : {}
    setComponents((prev) => [...prev, { id: nextId(type), type, ...position, ...extra }])
  }

  function removeSelected() {
    if (!selectedComponent) return
    setComponents((prev) => prev.filter((c) => c.id !== selectedComponent))
    setWires((prev) => prev.filter((w) => !w.from.startsWith(selectedComponent + '_') && !w.to.startsWith(selectedComponent + '_')))
    setSelectedComponent(null)
  }

  function clearAll() {
    setComponents([{ id: nextId('battery'), type: 'battery', x: 110, y: 200 }])
    setWires([])
    setSelectedTerminal(null)
    setSelectedComponent(null)
  }

  function loadPreset(kind) {
    uid = 0
    const battery = { id: nextId('battery'), type: 'battery', x: 110, y: 200 }
    const sw = { id: nextId('switch'), type: 'switch', x: 260, y: 120, closed: true }
    const bulb1 = { id: nextId('bulb'), type: 'bulb', x: 420, y: 120 }
    const bulb2 = { id: nextId('bulb'), type: 'bulb', x: 420, y: 280 }
    const newComponents = [battery, sw, bulb1, bulb2]
    const b = terminalKey(battery.id, 'plus')
    const bm = terminalKey(battery.id, 'minus')
    const sl = terminalKey(sw.id, 'left')
    const sr = terminalKey(sw.id, 'right')
    const b1l = terminalKey(bulb1.id, 'left')
    const b1r = terminalKey(bulb1.id, 'right')
    const b2l = terminalKey(bulb2.id, 'left')
    const b2r = terminalKey(bulb2.id, 'right')

    const newWires =
      kind === 'series'
        ? [
            { id: nextId('wire'), from: b, to: sl },
            { id: nextId('wire'), from: sr, to: b1l },
            { id: nextId('wire'), from: b1r, to: b2l },
            { id: nextId('wire'), from: b2r, to: bm },
          ]
        : [
            { id: nextId('wire'), from: b, to: sl },
            { id: nextId('wire'), from: sr, to: b1l },
            { id: nextId('wire'), from: sr, to: b2l },
            { id: nextId('wire'), from: b1r, to: bm },
            { id: nextId('wire'), from: b2r, to: bm },
          ]

    setComponents(newComponents)
    setWires(newWires)
    setSelectedTerminal(null)
    setSelectedComponent(null)
  }

  function handleTerminalClick(key) {
    setSelectedComponent(null)
    if (!selectedTerminal) {
      setSelectedTerminal(key)
      return
    }
    if (selectedTerminal === key) {
      setSelectedTerminal(null)
      return
    }
    const alreadyWired = wires.some(
      (w) => (w.from === selectedTerminal && w.to === key) || (w.from === key && w.to === selectedTerminal)
    )
    if (!alreadyWired) {
      setWires((prev) => [...prev, { id: nextId('wire'), from: selectedTerminal, to: key }])
    }
    setSelectedTerminal(null)
  }

  function removeWire(id) {
    setWires((prev) => prev.filter((w) => w.id !== id))
  }

  function toggleSwitch(id) {
    setComponents((prev) => prev.map((c) => (c.id === id ? { ...c, closed: !c.closed } : c)))
  }

  function startDrag(e, comp) {
    e.stopPropagation()
    const svg = e.currentTarget.ownerSVGElement
    const p = clientToSvgPoint(svg, e.clientX, e.clientY)
    dragRef.current = { id: comp.id, startX: p.x, startY: p.y, origX: comp.x, origY: comp.y, moved: false }
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  function onDragMove(e) {
    if (!dragRef.current) return
    const p = clientToSvgPoint(e.currentTarget, e.clientX, e.clientY)
    const dx = p.x - dragRef.current.startX
    const dy = p.y - dragRef.current.startY
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) dragRef.current.moved = true
    const newX = clamp(dragRef.current.origX + dx, 40, 720)
    const newY = clamp(dragRef.current.origY + dy, 60, 360)
    const draggedId = dragRef.current.id
    setComponents((prev) => prev.map((c) => (c.id === draggedId ? { ...c, x: newX, y: newY } : c)))
  }

  function endDrag(e, comp) {
    if (dragRef.current && !dragRef.current.moved) {
      setSelectedComponent((prev) => (prev === comp.id ? null : comp.id))
      setSelectedTerminal(null)
    }
    dragRef.current = null
  }

  const statusMessage = batteryMissing
    ? 'Add a battery to power the circuit.'
    : !wires.length
    ? 'Drag components into place, then click two terminals to join them with a wire.'
    : isShort
    ? 'Short circuit - current is bypassing the bulbs through a direct wire. Remove it.'
    : !circuitClosed
    ? switches.some((s) => s.closed) || switches.length === 0
      ? 'Circuit incomplete - check that every component is wired into the loop.'
      : 'Wiring looks good - close the switch to complete the circuit.'
    : litCount === bulbs.length && bulbs.length > 0
    ? `All ${bulbs.length} bulb${bulbs.length > 1 ? 's' : ''} lit!`
    : litCount > 0
    ? `${litCount} of ${bulbs.length} bulbs lit - check the other branch.`
    : 'Circuit is closed, but no bulb is on a complete path yet.'

  const statusColor = isShort ? 'text-red-600' : litCount > 0 ? 'text-brand-600' : 'text-slate-500'

  return (
    <PracticalShell
      slug="circuits"
      strand="Force and Energy · Electrical Energy"
      title="Electric Circuits"
      outcome="Build series and parallel circuits from individual components, and explain how each behaves."
      reflection="Compare a series and a parallel circuit. If one bulb is removed, what happens to the other bulb in each case, and why?"
    >
      <div className="flex flex-col items-center">
        <RotateHint>Rotate your device to landscape - the circuit bench needs the extra width.</RotateHint>
        <p className="text-sm text-slate-500 mb-3 text-center max-w-xl">
          Drag components from the palette onto the bench, then click one terminal and another to wire them
          together. Current only flows - and bulbs only light - when the loop is actually complete.
        </p>

        <div className="flex flex-wrap gap-2 mb-2 items-center justify-center">
          <PaletteButton label="+ Battery" onClick={() => addComponent('battery')} disabled={components.filter((c) => c.type === 'battery').length >= LIMITS.battery} />
          <PaletteButton label="+ Bulb" onClick={() => addComponent('bulb')} disabled={bulbs.length >= LIMITS.bulb} />
          <PaletteButton label="+ Switch" onClick={() => addComponent('switch')} disabled={switches.length >= LIMITS.switch} />
          <button
            onClick={removeSelected}
            disabled={!selectedComponent}
            className="text-sm border border-red-200 text-red-600 rounded-lg px-4 py-1.5 hover:bg-red-50 disabled:opacity-30 disabled:cursor-not-allowed transition"
          >
            Remove selected
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mb-4 items-center justify-center">
          <button onClick={() => loadPreset('series')} className="text-sm border border-slate-300 rounded-lg px-4 py-1.5 hover:bg-slate-50 transition">
            Load series example
          </button>
          <button onClick={() => loadPreset('parallel')} className="text-sm border border-slate-300 rounded-lg px-4 py-1.5 hover:bg-slate-50 transition">
            Load parallel example
          </button>
          <button onClick={clearAll} className="text-sm border border-slate-300 rounded-lg px-4 py-1.5 hover:bg-slate-50 transition">
            Clear bench
          </button>
        </div>

        <svg
          viewBox="0 0 780 400"
          className="w-full max-w-3xl bg-gradient-to-b from-white to-slate-50 border border-slate-200 rounded-xl"
          onPointerMove={onDragMove}
        >
          <defs>
            <radialGradient id="bulbGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fde047" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#facc15" stopOpacity="0.15" />
            </radialGradient>
            <linearGradient id="batteryBody" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#94a3b8" />
              <stop offset="50%" stopColor="#e2e8f0" />
              <stop offset="100%" stopColor="#94a3b8" />
            </linearGradient>
          </defs>

          {wires.map((w) => {
            const [fromComp, fromT] = splitKey(w.from, components)
            const [toComp, toT] = splitKey(w.to, components)
            if (!fromComp || !toComp) return null
            const a = terminalPosition(fromComp, fromT)
            const b = terminalPosition(toComp, toT)
            const midX = (a.x + b.x) / 2
            const path = `M ${a.x} ${a.y} L ${midX} ${a.y} L ${midX} ${b.y} L ${b.x} ${b.y}`
            const isHovered = hoveredWire === w.id
            const energized = isEnergized && isEnergized(w)
            return (
              <g key={w.id}>
                <path
                  d={path}
                  stroke="transparent"
                  strokeWidth="16"
                  fill="none"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredWire(w.id)}
                  onMouseLeave={() => setHoveredWire(null)}
                  onClick={() => removeWire(w.id)}
                />
                <path
                  d={path}
                  stroke={isHovered ? '#ef4444' : energized ? '#16a34a' : '#334155'}
                  strokeWidth="4"
                  fill="none"
                  strokeLinejoin="round"
                  pointerEvents="none"
                  className={energized && !isHovered ? 'current-flow' : ''}
                />
              </g>
            )
          })}

          {components.map((comp) => (
            <ComponentView
              key={comp.id}
              comp={comp}
              selected={selectedComponent === comp.id}
              selectedTerminal={selectedTerminal}
              lit={comp.type === 'bulb' ? bulbStates[comp.id] : false}
              onTerminalClick={handleTerminalClick}
              onDragStart={startDrag}
              onDragEnd={endDrag}
              onToggleSwitch={toggleSwitch}
            />
          ))}
        </svg>

        <p className={`text-sm font-medium mt-4 ${statusColor}`}>{statusMessage}</p>
      </div>
    </PracticalShell>
  )
}

function splitKey(key, components) {
  for (const comp of components) {
    const def = COMPONENT_DEFS[comp.type]
    for (const t of def.terminals) {
      if (terminalKey(comp.id, t.id) === key) return [comp, t.id]
    }
  }
  return [null, null]
}

function PaletteButton({ label, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="text-sm bg-brand-600 text-white rounded-lg px-4 py-1.5 hover:bg-brand-700 disabled:opacity-30 disabled:cursor-not-allowed transition"
    >
      {label}
    </button>
  )
}

function ComponentView({ comp, selected, selectedTerminal, lit, onTerminalClick, onDragStart, onDragEnd, onToggleSwitch }) {
  const def = COMPONENT_DEFS[comp.type]
  return (
    <g>
      {selected && (
        <rect
          x={comp.x - def.width / 2 - 8}
          y={comp.y - def.height / 2 - 8}
          width={def.width + 16}
          height={def.height + 16}
          rx="10"
          fill="none"
          stroke="#f97316"
          strokeWidth="2"
          strokeDasharray="4 3"
        />
      )}

      {comp.type === 'battery' && (
        <g
          onPointerDown={(e) => onDragStart(e, comp)}
          onPointerUp={(e) => onDragEnd(e, comp)}
          className="cursor-move"
        >
          <rect x={comp.x - 20} y={comp.y - 50} width="40" height="100" rx="8" fill="url(#batteryBody)" stroke="#334155" strokeWidth="2" />
          <rect x={comp.x - 10} y={comp.y - 58} width="20" height="10" rx="2" fill="#d97706" stroke="#334155" strokeWidth="1" />
          <rect x={comp.x - 20} y={comp.y + 46} width="40" height="6" fill="#1e293b" />
          <text x={comp.x} y={comp.y - 62} textAnchor="middle" fontSize="12" fill="#334155">Battery</text>
        </g>
      )}
      {comp.type === 'battery' && (
        <>
          <Terminal comp={comp} terminalId="plus" selectedTerminal={selectedTerminal} onClick={onTerminalClick} label="+" />
          <Terminal comp={comp} terminalId="minus" selectedTerminal={selectedTerminal} onClick={onTerminalClick} label="−" />
        </>
      )}

      {comp.type === 'switch' && (
        <g onPointerDown={(e) => onDragStart(e, comp)} onPointerUp={(e) => onDragEnd(e, comp)} className="cursor-move">
          <rect x={comp.x - 45} y={comp.y - 25} width="90" height="50" rx="6" fill="#fafafa" stroke="#334155" strokeWidth="2" />
          <text x={comp.x} y={comp.y - 32} textAnchor="middle" fontSize="12" fill="#334155">
            Switch ({comp.closed ? 'closed' : 'open'})
          </text>
          <circle cx={comp.x - 35} cy={comp.y} r="4" fill="#334155" />
          <circle cx={comp.x + 35} cy={comp.y} r="4" fill="#334155" />
          <line
            x1={comp.x - 35}
            y1={comp.y}
            x2={comp.closed ? comp.x + 35 : comp.x + 8}
            y2={comp.closed ? comp.y : comp.y - 22}
            stroke="#334155"
            strokeWidth="4"
            strokeLinecap="round"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation()
              onToggleSwitch(comp.id)
            }}
            className="cursor-pointer"
          />
        </g>
      )}
      {comp.type === 'switch' && (
        <>
          <Terminal comp={comp} terminalId="left" selectedTerminal={selectedTerminal} onClick={onTerminalClick} />
          <Terminal comp={comp} terminalId="right" selectedTerminal={selectedTerminal} onClick={onTerminalClick} />
        </>
      )}

      {comp.type === 'bulb' && (
        <g onPointerDown={(e) => onDragStart(e, comp)} onPointerUp={(e) => onDragEnd(e, comp)} className="cursor-move">
          {lit && <circle cx={comp.x} cy={comp.y} r="48" fill="url(#bulbGlow)" />}
          <circle cx={comp.x} cy={comp.y} r="32" fill={lit ? '#fef08a' : '#e2e8f0'} stroke="#334155" strokeWidth="2" />
          <path
            d={`M ${comp.x - 14} ${comp.y - 10} L ${comp.x} ${comp.y + 4} L ${comp.x - 6} ${comp.y + 4} L ${comp.x + 14} ${comp.y - 12}`}
            fill="none"
            stroke={lit ? '#b45309' : '#94a3b8'}
            strokeWidth="2"
            className={lit ? 'filament-glow' : ''}
          />
          <text x={comp.x} y={comp.y - 42} textAnchor="middle" fontSize="12" fill="#334155">Bulb</text>
        </g>
      )}
      {comp.type === 'bulb' && (
        <>
          <Terminal comp={comp} terminalId="left" selectedTerminal={selectedTerminal} onClick={onTerminalClick} />
          <Terminal comp={comp} terminalId="right" selectedTerminal={selectedTerminal} onClick={onTerminalClick} />
        </>
      )}
    </g>
  )
}

function Terminal({ comp, terminalId, selectedTerminal, onClick, label }) {
  const { x, y } = terminalPosition(comp, terminalId)
  const key = terminalKey(comp.id, terminalId)
  const isSelected = selectedTerminal === key
  return (
    <g>
      <circle
        cx={x}
        cy={y}
        r="18"
        fill="transparent"
        className="cursor-pointer"
        onClick={(e) => {
          e.stopPropagation()
          onClick(key)
        }}
      />
      <circle
        cx={x}
        cy={y}
        r="9"
        fill={isSelected ? '#f97316' : '#2196f3'}
        stroke="#fff"
        strokeWidth="1.5"
        pointerEvents="none"
      />
      {label && (
        <text x={x + 16} y={y + 4} fontSize="12" fontWeight="700" fill="#334155">
          {label}
        </text>
      )}
    </g>
  )
}
