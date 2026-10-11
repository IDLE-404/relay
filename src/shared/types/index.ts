import type { IconType } from 'react-icons'

// Scenario for the shared FlowCanvas (src/components/FlowCanvas).
export type FlowTile = {
  id: string
  server: string
  icon: IconType
  color?: string
  tools: string[]
}

export type FlowRow = {
  agent: string
  approval?: boolean
  tiles: FlowTile[]
}

type FlowStep = {
  tileId: string
  call: string
  ms: number
}

export type Flow = {
  title: string
  prompt: string
  done: string
  rows: FlowRow[]
  steps: FlowStep[]
}
