import type { IconType } from 'react-icons'
import {
  FiCheckSquare,
  FiClock,
  FiCode,
  FiFileText,
  FiMessageCircle,
  FiRefreshCw,
  FiShare2,
  FiTerminal,
  FiUserCheck,
  FiUsers,
} from 'react-icons/fi'

export type Audience = 'developers' | 'business'

export const audiences: Audience[] = ['developers', 'business']

// Texts are in i18n (landing.audiences), in the same order.
export const icons: Record<Audience, IconType[]> = {
  developers: [FiCode, FiShare2, FiTerminal, FiCheckSquare, FiClock],
  business: [FiFileText, FiMessageCircle, FiRefreshCw, FiUserCheck, FiUsers],
}

// One tint per position, used by the fan path, the tile and the card highlight.
export const tints = [
  { color: 'var(--agent-docs)', soft: 'var(--agent-docs-soft)' },
  { color: 'var(--agent-data)', soft: 'var(--agent-data-soft)' },
  { color: 'var(--agent-telegram)', soft: 'var(--agent-telegram-soft)' },
  { color: 'var(--success)', soft: 'var(--success-soft)' },
  { color: 'var(--warning)', soft: 'var(--warning-soft)' },
]

// Business card images: public/media/business/1..5.webp, about 1.5x their size on screen
// (narrow cards in row 1, wide cards in row 2).
const businessWidths = [480, 480, 480, 760, 760]

export const businessImage = (index: number) => ({
  src: `media/business/${index + 1}.webp`,
  width: businessWidths[index],
  height: Math.round((businessWidths[index] * 768) / 1376),
})

export const links = {
  spec: 'https://modelcontextprotocol.io/specification/latest',
  a2a: 'https://a2a-protocol.org/latest/',
}

// Code shown in the developer cards (not translated).
export const toolDefinition = {
  name: 'query',
  description: 'Run a read-only SQL query',
  inputSchema: { type: 'object', properties: { sql: { type: 'string' } }, required: ['sql'] },
}

const storageKey = 'relay-audience'

export const loadAudience = (): Audience => {
  try {
    return localStorage.getItem(storageKey) === 'business' ? 'business' : 'developers'
  } catch {
    return 'developers'
  }
}

export const saveAudience = (audience: Audience) => {
  try {
    localStorage.setItem(storageKey, audience)
  } catch {
    // ignore unavailable storage
  }
}
