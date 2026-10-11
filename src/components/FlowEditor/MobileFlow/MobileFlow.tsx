import { LuPlus, LuZap } from 'react-icons/lu'
import { agentColor, agentIcon, agentIds, orchestratorIcon, serverInfo, templateIds, toolFor, type TemplateId } from '../catalog'
import { useEditor } from '../EditorContext'
import { agentNodeId, agentStatus, serverStatus, serversOf } from '../editorState'
import { addServerMenu, nodeMenu } from '../menus'
import NodeCard, { type Tag } from '../NodeCard'
import ResultCard from '../ResultCard'
import type { Filter } from '../Sidebar'
import styles from './MobileFlow.module.css'

type MobileFlowProps = {
  filter: Filter
  running: boolean
  onFilter: (filter: Filter) => void
  onTemplate: (id: TemplateId) => void
  onRun: () => void
}

const PromptIcon = orchestratorIcon

// Phones get a plain list instead of the canvas: same data, same Run / Approve / inspect.
const MobileFlow = ({ filter, running, onFilter, onTemplate, onRun }: MobileFlowProps) => {
  const editor = useEditor()
  const { state, dispatch, text } = editor
  const tagsOf = (permission: Record<Tag, boolean>) => (['read', 'write', 'approval'] as Tag[]).filter((key) => permission[key])

  return (
    <div className={styles.mobile}>
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

      <div className={styles.filters}>
        {(['all', 'agents', 'servers'] as const).map((item) => (
          <button key={item} type="button" aria-pressed={filter === item} onClick={() => onFilter(item)}>
            {text.filters[item]}
          </button>
        ))}
      </div>

      <label className={styles.prompt}>
        <span className={styles.label}>
          <PromptIcon aria-hidden />
          {text.prompt}
        </span>
        <textarea rows={2} value={state.prompt} onChange={(event) => dispatch({ type: 'prompt', value: event.target.value })} />
      </label>

      <ul className={styles.list}>
        {agentIds.map((agent) => {
          const { permission } = state.agents[agent]
          const status = agentStatus(state, agent)
          const id = agentNodeId(agent)

          return (
            <li key={agent}>
              {filter !== 'servers' && (
                <NodeCard
                  icon={agentIcon[agent]}
                  iconColor={agentColor[agent]}
                  title={text.agents[agent]}
                  description={text.agentInfo[agent]}
                  tags={tagsOf(permission)}
                  status={status}
                  statusLabel={status ? text.status[status] : undefined}
                  approval={permission.approval}
                  menuLabel={text.options}
                  onMenu={(anchor) => editor.openMenu(anchor, nodeMenu(id, editor))}
                >
                  {status === 'waiting' && (
                    <div className={styles.decision}>
                      <button type="button" className={styles.approve} onClick={() => dispatch({ type: 'runApprove' })}>
                        {text.approve}
                      </button>
                      <button type="button" className={styles.deny} onClick={() => dispatch({ type: 'runDeny' })}>
                        {text.deny}
                      </button>
                    </div>
                  )}
                  <button
                    type="button"
                    className={styles.add}
                    onClick={(event) => editor.openMenu(event.currentTarget, addServerMenu(agent, editor))}
                  >
                    <LuPlus aria-hidden />
                    {text.addServer}
                  </button>
                </NodeCard>
              )}

              {filter !== 'agents' && (
                <ul className={styles.servers}>
                  {serversOf(state, agent).map((node) => {
                    const info = serverInfo(node.server)
                    const serverState = serverStatus(state, node.id)
                    return (
                      <li key={node.id}>
                        <NodeCard
                          icon={info.icon}
                          iconColor={info.color}
                          title={info.name}
                          description={toolFor(node.server, permission) ?? text.noAccess}
                          tags={tagsOf(permission)}
                          status={serverState}
                          statusLabel={serverState ? text.status[serverState] : undefined}
                          approval={permission.approval}
                          menuLabel={text.options}
                          onMenu={(anchor) => editor.openMenu(anchor, nodeMenu(node.id, editor))}
                        />
                      </li>
                    )
                  })}
                </ul>
              )}
            </li>
          )
        })}
      </ul>

      <button type="button" className={styles.run} disabled={running} onClick={onRun}>
        <LuZap aria-hidden />
        {running ? text.running : text.run}
      </button>
      <ResultCard />
    </div>
  )
}

export default MobileFlow
