import type { IconType } from 'react-icons'
import { LuActivity, LuBlocks, LuGlobe, LuPlug, LuShieldCheck } from 'react-icons/lu'

type Node = {
  key: string
  icon: IconType
  angle: number
  snippet?: string
  source: string
}

const spec = 'https://modelcontextprotocol.io/specification/latest'

// Texts for each node are in i18n (landing.why.items), in the same order.
// angle: 0 = top of the ring, clockwise.
export const nodes: Node[] = [
  {
    key: 'S',
    icon: LuPlug,
    angle: -120,
    source: 'https://www.anthropic.com/news/model-context-protocol',
  },
  {
    key: 'T',
    icon: LuBlocks,
    angle: -60,
    snippet:
      '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"postgres.query","arguments":{"sql":"select ..."}}}',
    source: spec,
  },
  {
    key: 'O',
    icon: LuGlobe,
    angle: 0,
    source:
      'https://www.anthropic.com/news/donating-the-model-context-protocol-and-establishing-of-the-agentic-ai-foundation',
  },
  {
    key: 'C',
    icon: LuShieldCheck,
    angle: 60,
    source: spec,
  },
  {
    key: 'R',
    icon: LuActivity,
    angle: 120,
    snippet: '"_meta": {"traceparent": "00-0af7...-01"}',
    source: spec,
  },
]

// Ring geometry in SVG units; the toolkit is a square scaled to its width.
export const size = 560
export const radius = 200

export const pointOnRing = (angle: number) => {
  const rad = (angle * Math.PI) / 180
  return {
    x: size / 2 + radius * Math.sin(rad),
    y: size / 2 - radius * Math.cos(rad),
  }
}
