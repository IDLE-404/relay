import { useCallback, useEffect, useReducer, useState } from 'react'
import { ReactFlowProvider, useReactFlow } from '@xyflow/react'
import Toast from '@/components/Toast'
import { useMediaQuery } from '@/shared/hooks'
import { useI18n } from '@/shared/i18n/I18nContext'
import { fill } from '@/shared/utils'
import { nodeSize, serverInfo, type TemplateId } from './catalog'
import ContextMenu, { type MenuItem } from './ContextMenu'
import EditorCanvas from './EditorCanvas'
import { EditorContext } from './EditorContext'
import { agentFromNodeId, buildCalls, buildConfig, loadState, promptId, reducer, saveState, type State } from './editorState'
import Inspector from './Inspector'
import JsonView from './JsonView'
import MobileFlow from './MobileFlow'
import Sidebar, { type Filter } from './Sidebar'
import TopBar, { type View } from './TopBar'
import styles from './FlowEditor.module.css'

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const stepDelay = 900

type Menu = { x: number; y: number; items: MenuItem[] }

const logLines = (state: State, text: ReturnType<typeof useI18n>['t']['flowEditor']) => {
  const { run } = state
  if (run.status === 'idle') return []

  const finished = run.status === 'done' ? run.calls.length : run.index
  const lines = [`▸ prompt "${state.prompt}"`]
  run.calls.slice(0, finished).forEach((call) => lines.push(`→ tools/call ${call.tool} · ${call.ms}ms`))

  const current = run.calls[run.index]
  if (run.status === 'waiting') lines.push(fill(text.logs.waiting, { agent: text.agents[current.agent] }))
  if (run.status === 'cancelled') lines.push(text.logs.cancelled)
  if (run.status === 'done') {
    const time = `${(run.calls.reduce((sum, call) => sum + call.ms, 0) / 1000).toFixed(1)}s`
    lines.push(fill(text.logs.done, { n: run.calls.length, time }))
  }
  return lines
}

const Editor = () => {
  const { t } = useI18n()
  const text = t.flowEditor
  const flow = useReactFlow()
  const isMobile = useMediaQuery('(max-width: 899px)')
  const [state, dispatch] = useReducer(reducer, text.templates.sales.prompt, loadState)
  const [view, setView] = useState<View>('canvas')
  const [filter, setFilter] = useState<Filter>('all')
  const [search, setSearch] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [showLabels, setShowLabels] = useState(false)
  const [inspecting, setInspecting] = useState<string | null>(null)
  const [menu, setMenu] = useState<Menu | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  const running = state.run.status === 'running' || state.run.status === 'waiting'

  useEffect(() => saveState(state), [state])

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 2400)
    return () => clearTimeout(timer)
  }, [toast])

  // The simulation moves one call forward every stepDelay while running (not while waiting).
  useEffect(() => {
    if (state.run.status !== 'running') return
    const timer = setTimeout(() => dispatch({ type: 'runTick' }), stepDelay)
    return () => clearTimeout(timer)
  }, [state.run.status, state.run.index])

  const openMenu = (anchor: HTMLElement | { x: number; y: number }, items: MenuItem[]) => {
    if (anchor instanceof HTMLElement) {
      const rect = anchor.getBoundingClientRect()
      setMenu({ x: rect.left, y: rect.bottom + 4, items })
    } else {
      setMenu({ ...anchor, items })
    }
  }
  const closeMenu = useCallback(() => setMenu(null), [])
  const closeInspector = useCallback(() => setInspecting(null), [])

  const run = () => {
    if (!state.prompt.trim()) return setToast(text.errors.prompt)
    if (!state.servers.some((node) => node.agent)) return setToast(text.errors.servers)
    dispatch({ type: 'runStart', calls: buildCalls(state) })
    setView('canvas')
  }

  const selectTemplate = (id: TemplateId) => {
    dispatch({ type: 'template', id, prompt: text.templates[id].prompt })
    setInspecting(null)
    // Let React Flow render the new graph first, then frame it.
    requestAnimationFrame(() => flow.fitView({ padding: 0.08, duration: 300 }))
  }

  // Select a node from the tree and bring it to the middle of the canvas.
  const focusNode = (id: string) => {
    dispatch({ type: 'select', id })
    const agent = agentFromNodeId(id)
    const server = state.servers.find((node) => node.id === id)
    const position = id === promptId ? state.promptPosition : agent ? state.agents[agent].position : server?.position
    const size = id === promptId ? nodeSize.prompt : agent ? nodeSize.agent : nodeSize.server
    if (position) flow.setCenter(position.x + size.width / 2, position.y + size.height / 2, { zoom: 1, duration: 400 })
  }

  const copyConfig = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(buildConfig(state), null, 2))
      setToast(text.copied)
    } catch {
      setToast(text.copyFailed)
    }
  }

  const inspectorTitle = (() => {
    if (!inspecting) return ''
    if (inspecting === promptId) return text.prompt
    const agent = agentFromNodeId(inspecting)
    if (agent) return text.agents[agent]
    const node = state.servers.find((item) => item.id === inspecting)
    return node ? serverInfo(node.server).name : ''
  })()

  const context = {
    state,
    dispatch,
    text,
    search,
    showLabels,
    reducedMotion,
    openMenu,
    inspect: setInspecting,
    toast: setToast,
  }
  const lines = logLines(state, text)

  return (
    <EditorContext.Provider value={context}>
      <div className={styles.frame}>
        {!isMobile && (
          <Sidebar
            open={sidebarOpen}
            filter={filter}
            onToggle={() => setSidebarOpen(!sidebarOpen)}
            onFilter={setFilter}
            onTemplate={selectTemplate}
            onFocusNode={focusNode}
          />
        )}

        <div className={styles.main}>
          <TopBar view={view} onView={setView} onSearch={setSearch} onReset={() => selectTemplate(state.template)} />

          {view === 'canvas' &&
            (isMobile ? (
              <MobileFlow filter={filter} running={running} onFilter={setFilter} onTemplate={selectTemplate} onRun={run} />
            ) : (
              <EditorCanvas running={running} onRun={run} onToggleLabels={() => setShowLabels(!showLabels)} />
            ))}

          {view === 'config' && (
            <div className={styles.panel}>
              <div className={styles.panelHead}>
                <span>{text.configLabel}</span>
                <button type="button" className={styles.copy} onClick={copyConfig}>
                  {text.copy}
                </button>
              </div>
              <JsonView value={buildConfig(state)} />
            </div>
          )}

          {view === 'logs' && (
            <div className={styles.panel} role="log">
              {lines.length === 0 ? (
                <p className={styles.empty}>{text.logs.empty}</p>
              ) : (
                <div className={styles.log}>
                  {lines.map((line, index) => (
                    <p key={index}>{line}</p>
                  ))}
                </div>
              )}
            </div>
          )}

          <Inspector id={inspecting} title={inspectorTitle} onClose={closeInspector} />
        </div>

        <Toast text={toast} />
      </div>

      {menu && <ContextMenu x={menu.x} y={menu.y} items={menu.items} onClose={closeMenu} />}
    </EditorContext.Provider>
  )
}

// React Flow hooks (fit, center) need the provider above the whole editor, sidebar included.
const FlowEditor = () => (
  <ReactFlowProvider>
    <Editor />
  </ReactFlowProvider>
)

export default FlowEditor
