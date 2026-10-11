import { useEffect, useState, type DragEvent } from 'react'
import {
  Background,
  BackgroundVariant,
  MarkerType,
  Panel,
  ReactFlow,
  useReactFlow,
  type Connection,
  type Edge,
  type Node,
  type NodeChange,
} from '@xyflow/react'
import '@xyflow/react/dist/base.css'
import { LuMaximize, LuMinus, LuPlus, LuTag, LuZap } from 'react-icons/lu'
import AgentNode from '../AgentNode'
import { agentIds, nodeSize, serverDragType, serverInfo, type ServerId } from '../catalog'
import { useEditor } from '../EditorContext'
import { agentFromNodeId, agentNodeId, isFull, isServerNode, promptId } from '../editorState'
import FlowEdge, { type FlowEdgeData } from '../FlowEdge'
import { addServerMenu, nodeMenu } from '../menus'
import PromptNode from '../PromptNode'
import ResultCard from '../ResultCard'
import ServerNode from '../ServerNode'
import styles from './EditorCanvas.module.css'

const nodeTypes = { prompt: PromptNode, agent: AgentNode, server: ServerNode }
const edgeTypes = { flow: FlowEdge }
const marker = { type: MarkerType.ArrowClosed, color: 'var(--border-strong)', width: 16, height: 16 }

type EditorCanvasProps = {
  running: boolean
  onRun: () => void
  onToggleLabels: () => void
}

const EditorCanvas = ({ running, onRun, onToggleLabels }: EditorCanvasProps) => {
  const editor = useEditor()
  const { state, dispatch, text, toast, inspect, showLabels } = editor
  const flow = useReactFlow()
  // React Flow only keeps sizes it gets back through `measured`, so they are stored here.
  const [measured, setMeasured] = useState<Record<string, { width: number; height: number }>>({})

  const node = (id: string, type: string, position: { x: number; y: number }): Node => ({
    id,
    type,
    position,
    data: {},
    selected: state.selected === id,
    measured: measured[id],
  })

  const nodes: Node[] = [
    node(promptId, 'prompt', state.promptPosition),
    ...agentIds.map((agent) => node(agentNodeId(agent), 'agent', state.agents[agent].position)),
    ...state.servers.map((server) => node(server.id, 'server', server.position)),
  ]

  const current = state.run.status === 'running' ? state.run.calls[state.run.index] : undefined
  const edges: Edge<FlowEdgeData>[] = [
    ...agentIds.map((agent) => ({
      id: `edge-prompt-${agent}`,
      source: promptId,
      target: agentNodeId(agent),
      type: 'flow',
      markerEnd: marker,
      data: { label: `${text.prompt} → ${text.agents[agent]}`, dashed: false, active: false },
    })),
    ...state.servers
      .filter((server) => server.agent)
      .map((server) => ({
        id: `edge-${server.id}`,
        source: agentNodeId(server.agent!),
        target: server.id,
        type: 'flow',
        markerEnd: marker,
        data: {
          label: `${text.agents[server.agent!]} → ${serverInfo(server.server).name} · tools/call`,
          dashed: true,
          active: current?.node === server.id,
        },
      })),
  ]

  const handleNodesChange = (changes: NodeChange[]) => {
    const sizes: typeof measured = {}

    for (const change of changes) {
      if (change.type === 'dimensions' && change.dimensions) sizes[change.id] = change.dimensions
      if (change.type === 'position' && change.position) dispatch({ type: 'move', id: change.id, position: change.position })
      if (change.type === 'select' && change.selected) dispatch({ type: 'select', id: change.id })
      if (change.type === 'select' && !change.selected && change.id === state.selected) dispatch({ type: 'select', id: null })
    }

    if (Object.keys(sizes).length > 0) setMeasured((previous) => ({ ...previous, ...sizes }))
  }

  // Agent handle → server node creates the assignment.
  const isValidConnection = (connection: Connection | Edge) =>
    Boolean(agentFromNodeId(connection.source)) && isServerNode(connection.target)

  const handleConnect = (connection: Connection) => {
    const agent = agentFromNodeId(connection.source)
    if (!agent || !isServerNode(connection.target)) return
    if (isFull(state, agent)) toast(text.errors.full)
    else dispatch({ type: 'assign', node: connection.target, agent })
  }

  // Dropped from the sidebar: onto an agent connects it, anywhere else just places it.
  const handleDrop = (event: DragEvent) => {
    const server = event.dataTransfer.getData(serverDragType) as ServerId
    if (!server) return
    event.preventDefault()

    const point = flow.screenToFlowPosition({ x: event.clientX, y: event.clientY })
    const agent = agentIds.find((id) => {
      const { x, y } = state.agents[id].position
      return point.x >= x && point.x <= x + nodeSize.agent.width && point.y >= y && point.y <= y + nodeSize.agent.height
    })

    if (agent && isFull(state, agent)) {
      toast(text.errors.full)
      return
    }
    const position = { x: point.x - nodeSize.server.width / 2, y: point.y - nodeSize.server.height / 2 }
    dispatch({ type: 'addServer', server, agent: agent ?? null, position: agent ? undefined : position })
  }

  // Delete / Backspace removes the selected server node (not while typing).
  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement
      if (target.closest('input, textarea, select, [contenteditable]')) return
      if ((event.key === 'Delete' || event.key === 'Backspace') && state.selected && isServerNode(state.selected)) {
        dispatch({ type: 'remove', node: state.selected })
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [state.selected, dispatch])

  return (
    <div
      className={styles.canvas}
      onDragOver={(event) => {
        if (event.dataTransfer.types.includes(serverDragType)) event.preventDefault()
      }}
      onDrop={handleDrop}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={handleNodesChange}
        onConnect={handleConnect}
        isValidConnection={isValidConnection}
        onNodeDoubleClick={(_, item) => item.id !== promptId && inspect(item.id)}
        onNodeContextMenu={(event, item) => {
          event.preventDefault()
          editor.openMenu({ x: event.clientX, y: event.clientY }, nodeMenu(item.id, editor))
        }}
        onPaneClick={() => dispatch({ type: 'select', id: null })}
        deleteKeyCode={null}
        zoomOnDoubleClick={false}
        fitView
        fitViewOptions={{ padding: 0.08 }}
        minZoom={0.3}
        maxZoom={1.75}
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1.4} color="var(--border-strong)" />

        <Panel position="center-right" className={styles.controls}>
          <button type="button" aria-label={text.zoomIn} title={text.zoomIn} onClick={() => flow.zoomIn()}>
            <LuPlus aria-hidden />
          </button>
          <button type="button" aria-label={text.zoomOut} title={text.zoomOut} onClick={() => flow.zoomOut()}>
            <LuMinus aria-hidden />
          </button>
          <button type="button" aria-label={text.fit} title={text.fit} onClick={() => flow.fitView({ padding: 0.08, duration: 300 })}>
            <LuMaximize aria-hidden />
          </button>
          <button type="button" aria-label={text.labels} title={text.labels} aria-pressed={showLabels} onClick={onToggleLabels}>
            <LuTag aria-hidden />
          </button>
        </Panel>

        <Panel position="bottom-left">
          <button type="button" className={styles.run} disabled={running} onClick={onRun}>
            <LuZap aria-hidden />
            {running ? text.running : text.run}
          </button>
        </Panel>

        <Panel position="bottom-center">
          <ResultCard />
        </Panel>

        <Panel position="bottom-right">
          <button
            type="button"
            className={styles.add}
            aria-label={text.addServer}
            title={text.addServer}
            onClick={(event) => editor.openMenu(event.currentTarget, addServerMenu(null, editor))}
          >
            <LuPlus aria-hidden />
          </button>
        </Panel>
      </ReactFlow>
    </div>
  )
}

export default EditorCanvas
