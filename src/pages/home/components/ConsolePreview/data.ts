// Demo data for the console preview. Labels are in i18n (landing.preview); tool names are not translated.

export type AgentId = 'docs' | 'data' | 'telegram'

export const agentIds: AgentId[] = ['docs', 'data', 'telegram']

// CSS variables from variables.css
export const agentColor: Record<AgentId, string> = {
  docs: 'var(--agent-docs)',
  data: 'var(--agent-data)',
  telegram: 'var(--agent-telegram)',
}

export const agentSoft: Record<AgentId, string> = {
  docs: 'var(--agent-docs-soft)',
  data: 'var(--agent-data-soft)',
  telegram: 'var(--agent-telegram-soft)',
}

// 1. Current run: one segment per tool call, width by duration.
export const run = {
  agent: 'data' as AgentId,
  startSeconds: 12,
  calls: [
    { tool: 'postgres.query', ms: 84, agent: 'data' as AgentId, retries: 0 },
    { tool: 'sheets.read_range', ms: 126, agent: 'data' as AgentId, retries: 1 },
    { tool: 'drive.create_doc', ms: 212, agent: 'docs' as AgentId, retries: 0 },
  ],
}

// 2. Approval
export const approval = {
  tool: 'telegram.send_message',
  agent: 'telegram' as AgentId,
  server: 'telegram',
  scope: 'write',
  args: '{ "chat": "@sales-team",\n  "text": "Weekly report: 128 orders…" }',
  pending: 2,
}

// 3. Usage this month
export const usage = {
  used: 5300,
  quota: 16000,
  byAgent: { docs: 1600, data: 2400, telegram: 1300 } as Record<AgentId, number>,
  columns: 16,
  rows: 8,
}

// 4. Schedule: minutes from 14:30, the left edge of the timeline (120 minutes wide).
export const schedule = {
  start: '14:30',
  span: 120,
  ticks: ['14:30', '15:00', '15:30', '16:00', '16:30'],
  now: 40, // 15:10
  runs: [
    { id: 'weekly', time: '15:00', at: 30, agent: 'data' as AgentId, servers: ['postgres', 'sheets', 'telegram'] },
    { id: 'support', time: '15:20', at: 50, agent: 'telegram' as AgentId, servers: ['telegram', 'notion'] },
    { id: 'docs', time: '16:00', at: 90, agent: 'docs' as AgentId, servers: ['github', 'notion', 'drive'] },
  ] as const,
}

// 5. Activity: 10 weeks x 7 days heatmap with levels 0..4 (deterministic).
export const activity = {
  runs: 154,
  bestDay: 51,
  heatmap: Array.from({ length: 70 }, (_, index) => (index * 7 + Math.floor(index / 3) * 5) % 5),
  // Radar values 0..1 per agent: Calls, Success, Speed, Approvals.
  radar: {
    docs: [0.55, 0.9, 0.6, 0.8],
    data: [0.95, 0.8, 0.75, 0.35],
    telegram: [0.6, 0.85, 0.95, 0.7],
  } as Record<AgentId, number[]>,
}
