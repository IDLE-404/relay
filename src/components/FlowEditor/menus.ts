import { servers, type AgentId } from './catalog'
import type { MenuItem } from './ContextMenu'
import type { EditorContextValue } from './EditorContext'
import { agentFromNodeId, isFull, promptId } from './editorState'

// Items for the ⋮ / right-click menu of a node. Permissions belong to the agent,
// so on a server node they change the permissions of the agent it is connected to.
export const nodeMenu = (id: string, editor: EditorContextValue): MenuItem[] => {
  const { state, dispatch, text, inspect } = editor
  const inspectItem = { label: text.menu.inspect, onSelect: () => inspect(id) }
  if (id === promptId) return [inspectItem]

  const node = state.servers.find((item) => item.id === id)
  const agent = agentFromNodeId(id) ?? node?.agent ?? null
  const permission = agent ? state.agents[agent].permission : null

  const permissionItems: MenuItem[] = (['approval', 'read', 'write'] as const).map((key) => ({
    label: text.menu[key],
    checked: permission?.[key] ?? false,
    disabled: !agent,
    onSelect: () => agent && dispatch({ type: 'permission', agent, key }),
  }))

  if (!node) return [inspectItem, ...permissionItems]

  return [
    inspectItem,
    ...permissionItems,
    { label: text.menu.duplicate, onSelect: () => dispatch({ type: 'duplicate', node: id }) },
    { label: text.menu.removeFromFlow, disabled: !node.agent, onSelect: () => dispatch({ type: 'unassign', node: id }) },
    { label: text.menu.delete, danger: true, onSelect: () => dispatch({ type: 'remove', node: id }) },
  ]
}

// "Add server" list: connect to `agent`, or place on the canvas unconnected.
export const addServerMenu = (agent: AgentId | null, editor: EditorContextValue): MenuItem[] => {
  const { state, dispatch, text, toast } = editor

  return servers.map((server) => ({
    label: server.name,
    onSelect: () => {
      if (agent && isFull(state, agent)) toast(text.errors.full)
      else dispatch({ type: 'addServer', server: server.id, agent })
    },
  }))
}
