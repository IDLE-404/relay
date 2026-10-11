import { Handle, Position, type NodeProps } from '@xyflow/react'
import { LuPlus } from 'react-icons/lu'
import { agentColor, agentIcon, nodeSize } from '../catalog'
import { useEditor } from '../EditorContext'
import { agentFromNodeId, agentStatus } from '../editorState'
import { addServerMenu, nodeMenu } from '../menus'
import NodeCard, { type Tag } from '../NodeCard'
import styles from './AgentNode.module.css'

const AgentNode = ({ id, selected }: NodeProps) => {
  const editor = useEditor()
  const { state, dispatch, text, search } = editor
  const agent = agentFromNodeId(id)!
  const { permission } = state.agents[agent]
  const status = agentStatus(state, agent)
  const tags = (['read', 'write', 'approval'] as Tag[]).filter((key) => permission[key])
  const matches = !search || text.agents[agent].toLowerCase().includes(search.toLowerCase())

  return (
    <div className={styles.node} style={{ width: nodeSize.agent.width }}>
      <Handle type="target" position={Position.Left} className={styles.handle} />

      <NodeCard
        icon={agentIcon[agent]}
        iconColor={agentColor[agent]}
        title={text.agents[agent]}
        description={text.agentInfo[agent]}
        tags={tags}
        status={status}
        statusLabel={status ? text.status[status] : undefined}
        selected={selected}
        approval={permission.approval}
        dimmed={!matches}
        menuLabel={text.options}
        onMenu={(anchor) => editor.openMenu(anchor, nodeMenu(id, editor))}
      >
        {/* The run waits here until the user decides. */}
        {status === 'waiting' && (
          <div className={styles.decision}>
            <button type="button" className={`${styles.approve} nodrag`} onClick={() => dispatch({ type: 'runApprove' })}>
              {text.approve}
            </button>
            <button type="button" className={`${styles.deny} nodrag`} onClick={() => dispatch({ type: 'runDeny' })}>
              {text.deny}
            </button>
          </div>
        )}
      </NodeCard>

      {/* Drag from this handle onto a server to connect it. */}
      <Handle type="source" position={Position.Right} className={styles.handle} style={{ background: agentColor[agent] }} />
      <button
        type="button"
        className={`${styles.add} nodrag`}
        aria-label={`${text.addServer} — ${text.agents[agent]}`}
        onClick={(event) => editor.openMenu(event.currentTarget, addServerMenu(agent, editor))}
      >
        <LuPlus aria-hidden />
      </button>
    </div>
  )
}

export default AgentNode
