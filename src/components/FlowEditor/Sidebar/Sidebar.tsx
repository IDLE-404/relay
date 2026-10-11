import { useState } from 'react'
import { LuChevronDown, LuChevronsLeft, LuChevronsRight } from 'react-icons/lu'
import {
  agentColor,
  agentIcon,
  agentIds,
  serverDragType,
  serverInfo,
  servers,
  templateIds,
  type AgentId,
  type TemplateId,
} from '../catalog'
import { useEditor } from '../EditorContext'
import { agentNodeId, serversOf } from '../editorState'
import styles from './Sidebar.module.css'

export type Filter = 'all' | 'agents' | 'servers'

type SidebarProps = {
  open: boolean
  filter: Filter
  onToggle: () => void
  onFilter: (filter: Filter) => void
  onTemplate: (id: TemplateId) => void
  onFocusNode: (id: string) => void
}

const Sidebar = ({ open, filter, onToggle, onFilter, onTemplate, onFocusNode }: SidebarProps) => {
  const { state, dispatch, text } = useEditor()
  const [collapsed, setCollapsed] = useState<AgentId[]>([])

  const toggleAgent = (agent: AgentId) =>
    setCollapsed(collapsed.includes(agent) ? collapsed.filter((item) => item !== agent) : [...collapsed, agent])

  // Not connected to any agent: either placed on the canvas alone, or not on the canvas at all.
  const available = servers
    .filter((server) => !state.servers.some((node) => node.server === server.id && node.agent))
    .map((server) => ({ server, node: state.servers.find((item) => item.server === server.id) }))

  if (!open) {
    return (
      <aside className={styles.closed}>
        <button type="button" className={styles.toggle} aria-label={text.expand} title={text.expand} onClick={onToggle}>
          <LuChevronsRight aria-hidden />
        </button>
      </aside>
    )
  }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.top}>
        <select
          className={styles.template}
          aria-label={text.template}
          value={state.template}
          onChange={(event) => onTemplate(event.target.value as TemplateId)}
        >
          {templateIds.map((id) => (
            <option key={id} value={id}>
              {text.templates[id].name}
            </option>
          ))}
        </select>
        <button type="button" className={styles.toggle} aria-label={text.collapse} title={text.collapse} onClick={onToggle}>
          <LuChevronsLeft aria-hidden />
        </button>
      </div>

      <div className={styles.filters}>
        {(['all', 'agents', 'servers'] as const).map((item) => (
          <button key={item} type="button" aria-pressed={filter === item} onClick={() => onFilter(item)}>
            {text.filters[item]}
          </button>
        ))}
      </div>

      <p className={styles.hint}>{text.hint}</p>

      <div className={styles.tree}>
        {filter !== 'servers' && (
          <section>
            <p className={styles.heading}>{text.agentsTitle}</p>
            <ul>
              {agentIds.map((agent) => {
                const Icon = agentIcon[agent]
                const expanded = !collapsed.includes(agent)
                const id = agentNodeId(agent)
                return (
                  <li key={agent}>
                    <div className={styles.row}>
                      <button
                        type="button"
                        className={styles.expand}
                        aria-expanded={expanded}
                        aria-label={text.agents[agent]}
                        onClick={() => toggleAgent(agent)}
                      >
                        <LuChevronDown aria-hidden />
                      </button>
                      <button
                        type="button"
                        className={`${styles.item} ${state.selected === id ? styles.selected : ''}`}
                        onClick={() => onFocusNode(id)}
                      >
                        <Icon style={{ color: agentColor[agent] }} aria-hidden />
                        {text.agents[agent]}
                      </button>
                    </div>

                    {expanded && (
                      <ul className={styles.children}>
                        {serversOf(state, agent).map((node) => {
                          const info = serverInfo(node.server)
                          return (
                            <li key={node.id}>
                              <button
                                type="button"
                                className={`${styles.item} ${state.selected === node.id ? styles.selected : ''}`}
                                onClick={() => onFocusNode(node.id)}
                              >
                                <info.icon style={{ color: info.color }} aria-hidden />
                                {info.name}
                              </button>
                            </li>
                          )
                        })}
                      </ul>
                    )}
                  </li>
                )
              })}
            </ul>
          </section>
        )}

        {filter !== 'agents' && (
          <section>
            <p className={styles.heading}>{text.availableTitle}</p>
            {available.length === 0 && <p className={styles.hint}>{text.noAvailable}</p>}
            <ul>
              {available.map(({ server, node }) => (
                <li key={server.id}>
                  {/* Drag onto the canvas or an agent. A click selects it, or places it if it isn't on the canvas yet. */}
                  <button
                    type="button"
                    draggable
                    className={`${styles.item} ${styles.draggable} ${node && state.selected === node.id ? styles.selected : ''}`}
                    onDragStart={(event) => {
                      event.dataTransfer.setData(serverDragType, server.id)
                      event.dataTransfer.effectAllowed = 'copy'
                    }}
                    onClick={() =>
                      node ? onFocusNode(node.id) : dispatch({ type: 'addServer', server: server.id, agent: null })
                    }
                  >
                    <server.icon style={{ color: server.color }} aria-hidden />
                    {server.name}
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </aside>
  )
}

export default Sidebar
