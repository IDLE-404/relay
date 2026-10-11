import {
  agentIds,
  agentPosition,
  maxServers,
  promptPosition,
  serverSlot,
  templateIds,
  templates,
  toolFor,
  type AgentId,
  type Permission,
  type Point,
  type ServerId,
  type TemplateId,
} from './catalog'

// A server placed on the canvas. The same server can be placed more than once.
export type ServerNode = { id: string; server: ServerId; agent: AgentId | null; position: Point }

type Call = { node: string; agent: AgentId; server: ServerId; tool: string; ms: number }

type RunStatus = 'idle' | 'running' | 'waiting' | 'done' | 'cancelled'
export type Run = { status: RunStatus; calls: Call[]; index: number; approved: AgentId[] }

export type State = {
  template: TemplateId
  prompt: string
  promptPosition: Point
  agents: Record<AgentId, { position: Point; permission: Permission }>
  servers: ServerNode[]
  selected: string | null
  run: Run
}

export type Action =
  | { type: 'template'; id: TemplateId; prompt: string }
  | { type: 'prompt'; value: string }
  | { type: 'move'; id: string; position: Point }
  | { type: 'select'; id: string | null }
  | { type: 'addServer'; server: ServerId; agent: AgentId | null; position?: Point }
  | { type: 'assign'; node: string; agent: AgentId }
  | { type: 'unassign'; node: string }
  | { type: 'duplicate'; node: string }
  | { type: 'remove'; node: string }
  | { type: 'permission'; agent: AgentId; key: keyof Permission }
  | { type: 'runStart'; calls: Call[] }
  | { type: 'runTick' }
  | { type: 'runApprove' }
  | { type: 'runDeny' }

// Node ids used by React Flow.
export const promptId = 'prompt'
export const agentNodeId = (agent: AgentId) => `agent-${agent}`
export const agentFromNodeId = (id: string) => (id.startsWith('agent-') ? (id.slice(6) as AgentId) : null)
export const isServerNode = (id: string) => id.startsWith('srv-')

const idleRun: Run = { status: 'idle', calls: [], index: 0, approved: [] }

let counter = 0
const newServerId = (server: ServerId) => `srv-${server}-${Date.now().toString(36)}-${(counter += 1)}`

export const serversOf = (state: State, agent: AgentId) => state.servers.filter((node) => node.agent === agent)
export const isFull = (state: State, agent: AgentId) => serversOf(state, agent).length >= maxServers

const fromTemplate = (id: TemplateId, prompt: string): State => {
  const preset = templates[id]
  const counts: Partial<Record<AgentId, number>> = {}

  return {
    template: id,
    prompt,
    promptPosition,
    agents: Object.fromEntries(
      agentIds.map((agent) => [agent, { position: agentPosition[agent], permission: preset.permissions[agent] }]),
    ) as State['agents'],
    servers: preset.servers.map(([server, agent]) => {
      const index = counts[agent] ?? 0
      counts[agent] = index + 1
      return { id: `srv-${server}-${agent}`, server, agent, position: serverSlot(agent, index) }
    }),
    selected: null,
    run: idleRun,
  }
}

// Move the run to call `index`: wait for approval if the agent needs it, finish after the last call.
const runAt = (state: State, index: number): Run => {
  const { run } = state
  if (index >= run.calls.length) return { ...run, index, status: 'done' }

  const agent = run.calls[index].agent
  const needsApproval = state.agents[agent].permission.approval && !run.approved.includes(agent)
  return { ...run, index, status: needsApproval ? 'waiting' : 'running' }
}

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'template':
      return fromTemplate(action.id, action.prompt)

    case 'prompt':
      return { ...state, prompt: action.value }

    case 'move': {
      const { id, position } = action
      if (id === promptId) return { ...state, promptPosition: position }
      const agent = agentFromNodeId(id)
      if (agent) return { ...state, agents: { ...state.agents, [agent]: { ...state.agents[agent], position } } }
      return { ...state, servers: state.servers.map((node) => (node.id === id ? { ...node, position } : node)) }
    }

    case 'select':
      return { ...state, selected: action.id }

    case 'addServer': {
      const { server, agent } = action
      if (agent && isFull(state, agent)) return state
      const position =
        action.position ?? (agent ? serverSlot(agent, serversOf(state, agent).length) : { x: 1100, y: 40 + state.servers.length * 30 })
      const node = { id: newServerId(server), server, agent, position }
      return { ...state, servers: [...state.servers, node], selected: node.id }
    }

    case 'assign':
      if (isFull(state, action.agent)) return state
      return { ...state, servers: state.servers.map((node) => (node.id === action.node ? { ...node, agent: action.agent } : node)) }

    case 'unassign':
      return { ...state, servers: state.servers.map((node) => (node.id === action.node ? { ...node, agent: null } : node)) }

    case 'duplicate': {
      const source = state.servers.find((node) => node.id === action.node)
      if (!source) return state
      const position = { x: source.position.x + 30, y: source.position.y + 30 }
      return { ...state, servers: [...state.servers, { ...source, id: newServerId(source.server), agent: null, position }] }
    }

    case 'remove':
      return {
        ...state,
        servers: state.servers.filter((node) => node.id !== action.node),
        selected: state.selected === action.node ? null : state.selected,
      }

    case 'permission': {
      const current = state.agents[action.agent]
      const permission = { ...current.permission, [action.key]: !current.permission[action.key] }
      return { ...state, agents: { ...state.agents, [action.agent]: { ...current, permission } } }
    }

    case 'runStart': {
      const started = { ...state, run: { status: 'running' as const, calls: action.calls, index: 0, approved: [] } }
      return { ...started, run: runAt(started, 0) }
    }

    case 'runTick':
      return state.run.status === 'running' ? { ...state, run: runAt(state, state.run.index + 1) } : state

    case 'runApprove': {
      if (state.run.status !== 'waiting') return state
      const agent = state.run.calls[state.run.index].agent
      return { ...state, run: { ...state.run, status: 'running', approved: [...state.run.approved, agent] } }
    }

    case 'runDeny':
      return state.run.status === 'waiting' ? { ...state, run: { ...state.run, status: 'cancelled' } } : state
  }
}

// Calls for a run: agents in order, then each agent's servers in the order they were placed.
export const buildCalls = (state: State): Call[] =>
  agentIds.flatMap((agent) =>
    serversOf(state, agent).flatMap((node) => {
      const tool = toolFor(node.server, state.agents[agent].permission)
      return tool ? [{ node: node.id, agent, server: node.server, tool, ms: 40 + ((tool.length * 37) % 180) }] : []
    }),
  )

export type NodeStatus = 'pending' | 'running' | 'waiting' | 'done' | 'skipped' | null

export const serverStatus = (state: State, id: string): NodeStatus => {
  const { run } = state
  if (run.status === 'idle') return null
  const index = run.calls.findIndex((call) => call.node === id)
  if (index === -1) return 'skipped'
  if (index < run.index) return 'done'
  if (index > run.index) return run.status === 'cancelled' ? 'skipped' : 'pending'
  if (run.status === 'running') return 'running'
  if (run.status === 'waiting') return 'waiting'
  return 'skipped' // cancelled at this call
}

export const agentStatus = (state: State, agent: AgentId): NodeStatus => {
  const { run } = state
  if (run.status === 'idle') return null
  const own = run.calls.map((call, index) => ({ call, index })).filter(({ call }) => call.agent === agent)
  if (own.length === 0) return 'skipped'
  const current = run.calls[run.index]
  if (current?.agent === agent && (run.status === 'running' || run.status === 'waiting')) return run.status
  if (own.every(({ index }) => index < run.index)) return 'done'
  return run.status === 'cancelled' ? 'skipped' : 'pending'
}

export const buildConfig = (state: State) => ({
  template: state.template,
  prompt: state.prompt,
  agents: agentIds
    .filter((agent) => serversOf(state, agent).length > 0)
    .map((agent) => {
      const { read, write, approval } = state.agents[agent].permission
      return {
        name: `${agent}-agent`,
        servers: serversOf(state, agent).map((node) => node.server),
        permissions: [read && 'read', write && 'write'].filter(Boolean),
        requireApproval: approval,
      }
    }),
})

// localStorage can throw (private mode, blocked storage), so both calls are wrapped.
const storageKey = 'relay-flow-editor'

export const loadState = (fallbackPrompt: string): State => {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) ?? 'null')
    if (saved && templateIds.includes(saved.template) && Array.isArray(saved.servers)) {
      return { ...saved, selected: null, run: idleRun }
    }
  } catch {
    // ignore broken or unavailable storage
  }
  return fromTemplate('sales', fallbackPrompt)
}

export const saveState = (state: State) => {
  try {
    const { template, prompt, promptPosition: position, agents, servers } = state
    localStorage.setItem(storageKey, JSON.stringify({ template, prompt, promptPosition: position, agents, servers }))
  } catch {
    // ignore unavailable storage
  }
}

