import { Handle, Position, type NodeProps } from '@xyflow/react'
import { nodeSize, serverInfo, toolFor } from '../catalog'
import { useEditor } from '../EditorContext'
import { serverStatus } from '../editorState'
import { nodeMenu } from '../menus'
import NodeCard, { type Tag } from '../NodeCard'
import styles from './ServerNode.module.css'

const ServerNode = ({ id, selected }: NodeProps) => {
  const editor = useEditor()
  const { state, text, search } = editor
  const node = state.servers.find((item) => item.id === id)
  if (!node) return null

  const info = serverInfo(node.server)
  const permission = node.agent ? state.agents[node.agent].permission : null
  const tool = permission ? toolFor(node.server, permission) : null
  const description = !node.agent ? text.notConnected : (tool ?? text.noAccess)
  const tags = permission ? (['read', 'write', 'approval'] as Tag[]).filter((key) => permission[key]) : []
  const status = serverStatus(state, id)
  const matches = !search || info.name.toLowerCase().includes(search.toLowerCase())

  return (
    <div style={{ width: nodeSize.server.width }}>
      <Handle type="target" position={Position.Left} className={styles.handle} />
      <NodeCard
        icon={info.icon}
        iconColor={info.color}
        title={info.name}
        description={description}
        tags={tags}
        status={status}
        statusLabel={status ? text.status[status] : undefined}
        selected={selected}
        approval={permission?.approval}
        dimmed={!matches}
        menuLabel={text.options}
        onMenu={(anchor) => editor.openMenu(anchor, nodeMenu(id, editor))}
      />
    </div>
  )
}

export default ServerNode
