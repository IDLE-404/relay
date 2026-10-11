import type { IconType } from 'react-icons'
import { FaSlack } from 'react-icons/fa'
import { LuBot, LuDatabase, LuFileText, LuSend } from 'react-icons/lu'
import { SiGithub, SiGmail, SiGoogledrive, SiGooglesheets, SiNotion, SiPostgresql, SiTelegram } from 'react-icons/si'

export type AgentId = 'docs' | 'data' | 'telegram'
export type ServerId = 'drive' | 'notion' | 'postgres' | 'sheets' | 'github' | 'slack' | 'telegram' | 'gmail'
export type TemplateId = 'sales' | 'support' | 'docs' | 'devops'
export type Permission = { read: boolean; write: boolean; approval: boolean }
export type Point = { x: number; y: number }

export const agentIds: AgentId[] = ['docs', 'data', 'telegram']
export const templateIds: TemplateId[] = ['sales', 'support', 'docs', 'devops']
export const maxServers = 4

// Data type used when a server is dragged from the sidebar onto the canvas.
export const serverDragType = 'application/relay-server'

export const agentIcon: Record<AgentId, IconType> = { docs: LuFileText, data: LuDatabase, telegram: LuSend }
export const orchestratorIcon = LuBot

// Colours are CSS variables from variables.css.
export const agentColor: Record<AgentId, string> = {
  docs: 'var(--agent-docs)',
  data: 'var(--agent-data)',
  telegram: 'var(--agent-telegram)',
}

type Server = { id: ServerId; name: string; icon: IconType; color: string; read: string; write: string }

export const servers: Server[] = [
  { id: 'drive', name: 'Drive', icon: SiGoogledrive, color: '#1fa463', read: 'drive.search', write: 'drive.create_doc' },
  { id: 'notion', name: 'Notion', icon: SiNotion, color: 'var(--text)', read: 'notion.query_db', write: 'notion.create_page' },
  { id: 'postgres', name: 'Postgres', icon: SiPostgresql, color: '#4169e1', read: 'postgres.query', write: 'postgres.execute' },
  { id: 'sheets', name: 'Sheets', icon: SiGooglesheets, color: '#34a853', read: 'sheets.read_range', write: 'sheets.append_row' },
  { id: 'github', name: 'GitHub', icon: SiGithub, color: 'var(--text)', read: 'github.search_issues', write: 'github.create_issue' },
  { id: 'slack', name: 'Slack', icon: FaSlack, color: 'var(--text)', read: 'slack.read_channel', write: 'slack.post_message' },
  { id: 'telegram', name: 'Telegram', icon: SiTelegram, color: '#26a5e4', read: 'telegram.get_updates', write: 'telegram.send_message' },
  { id: 'gmail', name: 'Gmail', icon: SiGmail, color: '#ea4335', read: 'gmail.search', write: 'gmail.send' },
]

export const serverInfo = (id: ServerId) => servers.find((server) => server.id === id)!

// The tool an agent calls on a server: write if allowed, otherwise read.
export const toolFor = (server: ServerId, permission: Permission) => {
  const info = serverInfo(server)
  return permission.write ? info.write : permission.read ? info.read : null
}

/* Layout, left to right: prompt → agents (one column) → each agent's servers (2 x 2 block). */
export const nodeSize = {
  prompt: { width: 220, height: 110 },
  agent: { width: 220, height: 130 },
  server: { width: 190, height: 100 },
}

export const promptPosition: Point = { x: 0, y: 235 }

export const agentPosition: Record<AgentId, Point> = {
  docs: { x: 270, y: 20 },
  data: { x: 270, y: 235 },
  telegram: { x: 270, y: 450 },
}

// Preset slot for the n-th server of an agent.
export const serverSlot = (agent: AgentId, index: number): Point => ({
  x: 560 + (index % 2) * 205,
  y: agentPosition[agent].y - 45 + Math.floor(index / 2) * 115,
})

const off: Permission = { read: false, write: false, approval: false }

// Prompts and result messages are in i18n (flowEditor.templates).
export const templates: Record<
  TemplateId,
  { servers: [ServerId, AgentId][]; permissions: Record<AgentId, Permission> }
> = {
  sales: {
    servers: [['drive', 'docs'], ['postgres', 'data'], ['sheets', 'data'], ['telegram', 'telegram']],
    permissions: {
      docs: { read: true, write: true, approval: false },
      data: { read: true, write: false, approval: false },
      telegram: { read: false, write: true, approval: true },
    },
  },
  support: {
    servers: [['notion', 'docs'], ['postgres', 'data'], ['telegram', 'telegram']],
    permissions: {
      docs: { read: true, write: false, approval: false },
      data: { read: true, write: false, approval: false },
      telegram: { read: true, write: true, approval: false },
    },
  },
  docs: {
    servers: [['notion', 'docs'], ['drive', 'docs'], ['github', 'data']],
    permissions: {
      docs: { read: true, write: true, approval: true },
      data: { read: true, write: false, approval: false },
      telegram: off,
    },
  },
  devops: {
    servers: [['github', 'data'], ['postgres', 'data'], ['slack', 'telegram'], ['gmail', 'telegram']],
    permissions: {
      docs: off,
      data: { read: true, write: false, approval: false },
      telegram: { read: false, write: true, approval: false },
    },
  },
}
