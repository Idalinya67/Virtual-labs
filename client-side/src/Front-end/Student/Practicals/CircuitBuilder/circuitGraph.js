export const COMPONENT_DEFS = {
  battery: {
    label: 'Battery',
    width: 60,
    height: 110,
    terminals: [
      { id: 'plus', dx: 0, dy: -55, label: '+' },
      { id: 'minus', dx: 0, dy: 55, label: '−' },
    ],
  },
  bulb: {
    label: 'Bulb',
    width: 80,
    height: 80,
    terminals: [
      { id: 'left', dx: -40, dy: 0 },
      { id: 'right', dx: 40, dy: 0 },
    ],
  },
  switch: {
    label: 'Switch',
    width: 90,
    height: 50,
    terminals: [
      { id: 'left', dx: -45, dy: 0 },
      { id: 'right', dx: 45, dy: 0 },
    ],
  },
}

export function terminalKey(componentId, terminalId) {
  return `${componentId}_${terminalId}`
}

export function terminalPosition(component, terminalId) {
  const def = COMPONENT_DEFS[component.type]
  const t = def.terminals.find((t) => t.id === terminalId)
  return { x: component.x + t.dx, y: component.y + t.dy }
}

function connected(edges, start, target) {
  const adjacency = {}
  edges.forEach(([a, b]) => {
    ;(adjacency[a] ??= []).push(b)
    ;(adjacency[b] ??= []).push(a)
  })
  const visited = new Set([start])
  const stack = [start]
  while (stack.length) {
    const current = stack.pop()
    for (const neighbour of adjacency[current] || []) {
      if (!visited.has(neighbour)) {
        visited.add(neighbour)
        stack.push(neighbour)
      }
    }
  }
  return visited.has(target)
}

function reachableFrom(edges, start) {
  const adjacency = {}
  edges.forEach(([a, b]) => {
    ;(adjacency[a] ??= []).push(b)
    ;(adjacency[b] ??= []).push(a)
  })
  const visited = new Set([start])
  const stack = [start]
  while (stack.length) {
    const current = stack.pop()
    for (const neighbour of adjacency[current] || []) {
      if (!visited.has(neighbour)) {
        visited.add(neighbour)
        stack.push(neighbour)
      }
    }
  }
  return visited
}

/**
 * A bulb is lit when, ignoring its own body, current can still reach one of
 * its terminals from battery+ and the other from battery-. That correctly
 * lights bulbs in both series and parallel wiring without requiring a bulb to
 * be a graph "bridge".
 */
export function evaluateCircuit(components, wires) {
  const battery = components.find((c) => c.type === 'battery')
  const bulbs = components.filter((c) => c.type === 'bulb')
  const switches = components.filter((c) => c.type === 'switch')

  if (!battery) {
    return { isShort: false, bulbStates: {}, circuitClosed: false, isEnergized: () => false, batteryMissing: true }
  }

  const batPlus = terminalKey(battery.id, 'plus')
  const batMinus = terminalKey(battery.id, 'minus')

  const wireEdges = wires.map((w) => [w.from, w.to])
  const switchEdges = switches.filter((s) => s.closed).map((s) => [terminalKey(s.id, 'left'), terminalKey(s.id, 'right')])
  const bulbEdgeMap = Object.fromEntries(bulbs.map((b) => [b.id, [terminalKey(b.id, 'left'), terminalKey(b.id, 'right')]]))

  const edgesBase = [...wireEdges, ...switchEdges]
  const isShort = connected(edgesBase, batPlus, batMinus)

  const bulbStates = {}
  for (const bulb of bulbs) {
    if (isShort) {
      bulbStates[bulb.id] = false
      continue
    }
    const [t1, t2] = bulbEdgeMap[bulb.id]
    const otherBulbEdges = bulbs.filter((b) => b.id !== bulb.id).map((b) => bulbEdgeMap[b.id])
    const edgesWithoutThis = [...edgesBase, ...otherBulbEdges]

    const forward = connected(edgesWithoutThis, batPlus, t1) && connected(edgesWithoutThis, t2, batMinus)
    const backward = connected(edgesWithoutThis, batPlus, t2) && connected(edgesWithoutThis, t1, batMinus)
    bulbStates[bulb.id] = forward || backward
  }

  const allEdges = [...edgesBase, ...Object.values(bulbEdgeMap)]
  const circuitClosed = connected(allEdges, batPlus, batMinus)

  const energizedNodes = isShort || !circuitClosed ? new Set() : reachableFrom(allEdges, batPlus)
  const isEnergized = (wire) => energizedNodes.has(wire.from) && energizedNodes.has(wire.to)

  return { isShort, bulbStates, circuitClosed, isEnergized, batteryMissing: false }
}
