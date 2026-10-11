import { useEffect, useState } from 'react'
import { LuX } from 'react-icons/lu'
import { useEditor } from '../EditorContext'
import { inspectPayload } from '../inspect'
import JsonView from '../JsonView'
import styles from './Inspector.module.css'

type InspectorProps = {
  id: string | null
  title: string
  onClose: () => void
}

const tabs = ['request', 'response', 'meta'] as const
type Tab = (typeof tabs)[number]

// Right drawer with example MCP JSON-RPC payloads for one node. Esc closes it.
const Inspector = ({ id, title, onClose }: InspectorProps) => {
  const { state, text } = useEditor()
  const [tab, setTab] = useState<Tab>('request')

  useEffect(() => {
    if (!id) return
    const handleKey = (event: KeyboardEvent) => event.key === 'Escape' && onClose()
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [id, onClose])

  const payload = id ? inspectPayload(state, id) : null

  return (
    <aside className={`${styles.drawer} ${id ? styles.open : ''}`} aria-label={title} inert={!id}>
      <div className={styles.head}>
        <p className={styles.title}>{title}</p>
        <button type="button" className={styles.close} aria-label={text.inspector.close} onClick={onClose}>
          <LuX aria-hidden />
        </button>
      </div>

      <div className={styles.tabs} role="tablist">
        {tabs.map((item) => (
          <button
            key={item}
            type="button"
            role="tab"
            aria-selected={tab === item}
            className={styles.tab}
            onClick={() => setTab(item)}
          >
            {text.inspector[item]}
          </button>
        ))}
      </div>

      <div className={styles.body} role="tabpanel">
        {payload && <JsonView value={payload[tab]} />}
      </div>
      <p className={styles.note}>{text.inspector.note}</p>
    </aside>
  )
}

export default Inspector
