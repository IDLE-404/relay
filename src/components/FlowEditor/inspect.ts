import { serverInfo, toolFor, type ServerId } from './catalog'
import { agentFromNodeId, buildCalls, promptId, serversOf, type State } from './editorState'

// Example MCP JSON-RPC payloads for the inspector. Simplified on purpose.

const exampleArgs: Record<ServerId, object> = {
  drive: { title: 'Weekly sales report', folder: 'Reports' },
  notion: { database: 'FAQ', query: 'refund' },
  postgres: { sql: 'select count(*) from orders where created_at > now() - interval 7 day' },
  sheets: { range: 'Sales!A1:D50' },
  github: { repo: 'relay/app', label: 'release' },
  slack: { channel: '#ops', text: 'Deploy failed on main' },
  telegram: { chat: '@sales-team', text: 'Weekly report: 128 orders' },
  gmail: { to: 'team@example.com', subject: 'Deploy failed' },
}

const exampleResult: Record<ServerId, string> = {
  drive: 'Created doc "Weekly sales report"',
  notion: '3 matching pages',
  postgres: '128 rows',
  sheets: '50 rows read',
  github: '4 issues',
  slack: 'Message posted',
  telegram: 'Message delivered',
  gmail: 'Email sent',
}

const trace = { traceparent: '00-0af7651916cd43dd8448eb211c80319c-b7ad6b7169203331-01' }

type Payload = { request: object; response: object; meta: object }

export const inspectPayload = (state: State, id: string): Payload => {
  if (id === promptId) {
    const calls = buildCalls(state)
    return {
      request: { prompt: state.prompt },
      response: { plan: calls.map((call) => ({ agent: `${call.agent}-agent`, call: call.tool })) },
      meta: { template: state.template, calls: calls.length },
    }
  }

  const agent = agentFromNodeId(id)
  if (agent) {
    const nodes = serversOf(state, agent)
    const { permission } = state.agents[agent]
    return {
      request: { jsonrpc: '2.0', id: 1, method: 'tools/list' },
      response: {
        jsonrpc: '2.0',
        id: 1,
        result: { tools: nodes.flatMap((node) => [serverInfo(node.server).read, serverInfo(node.server).write]).map((name) => ({ name })) },
      },
      meta: { agent: `${agent}-agent`, servers: nodes.map((node) => node.server), permission },
    }
  }

  const node = state.servers.find((item) => item.id === id)!
  const permission = node.agent ? state.agents[node.agent].permission : null
  const tool = permission ? toolFor(node.server, permission) : null
  const call = state.run.calls.find((item) => item.node === id)

  return {
    request: {
      jsonrpc: '2.0',
      id: 7,
      method: 'tools/call',
      params: { name: tool ?? serverInfo(node.server).read, arguments: exampleArgs[node.server], _meta: trace },
    },
    response: { jsonrpc: '2.0', id: 7, result: { content: [{ type: 'text', text: exampleResult[node.server] }], isError: false } },
    meta: {
      server: node.server,
      agent: node.agent ? `${node.agent}-agent` : null,
      scope: permission?.write ? 'write' : permission?.read ? 'read' : 'none',
      requireApproval: permission?.approval ?? false,
      latencyMs: call?.ms ?? null,
    },
  }
}
