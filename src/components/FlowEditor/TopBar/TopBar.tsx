import { useState } from 'react'
import { LuCode, LuLayoutGrid, LuLogs, LuSearch } from 'react-icons/lu'
import { agentColor, agentIcon, agentIds } from '../catalog'
import { useEditor } from '../EditorContext'
import styles from './TopBar.module.css'

export type View = 'canvas' | 'config' | 'logs'

const viewIcons = { canvas: LuLayoutGrid, config: LuCode, logs: LuLogs }

type TopBarProps = {
  view: View
  onView: (view: View) => void
  onSearch: (value: string) => void
  onReset: () => void
}

const TopBar = ({ view, onView, onSearch, onReset }: TopBarProps) => {
  const { state, text, search } = useEditor()
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <div className={styles.bar}>
      <span className={styles.template}>{text.templates[state.template].name}</span>

      <div className={styles.views} role="group">
        {(['canvas', 'config', 'logs'] as const).map((item) => {
          const Icon = viewIcons[item]
          return (
            <button key={item} type="button" aria-pressed={view === item} aria-label={text.views[item]} onClick={() => onView(item)}>
              <Icon aria-hidden />
              <span>{text.views[item]}</span>
            </button>
          )
        })}
      </div>

      <div className={styles.right}>
        {searchOpen ? (
          <input
            className={styles.search}
            type="search"
            aria-label={text.search}
            placeholder={text.search}
            value={search}
            autoFocus
            onChange={(event) => onSearch(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Escape') {
                onSearch('')
                setSearchOpen(false)
              }
            }}
          />
        ) : (
          <button type="button" className={styles.icon} aria-label={text.search} onClick={() => setSearchOpen(true)}>
            <LuSearch aria-hidden />
          </button>
        )}

        <span className={styles.stack} aria-hidden>
          {agentIds.map((agent) => {
            const Icon = agentIcon[agent]
            return (
              <span key={agent} style={{ background: agentColor[agent] }}>
                <Icon />
              </span>
            )
          })}
        </span>

        <button type="button" className={styles.reset} onClick={onReset}>
          {text.reset}
        </button>
      </div>
    </div>
  )
}

export default TopBar
