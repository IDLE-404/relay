import { useEffect, useRef, type KeyboardEvent } from 'react'
import { createPortal } from 'react-dom'
import { LuCheck } from 'react-icons/lu'
import styles from './ContextMenu.module.css'

export type MenuItem = {
  label: string
  onSelect: () => void
  checked?: boolean
  danger?: boolean
  disabled?: boolean
}

type ContextMenuProps = {
  x: number
  y: number
  items: MenuItem[]
  onClose: () => void
}

// Rendered in <body> with fixed position. Arrow keys move, Enter picks, Esc or a click outside closes.
const ContextMenu = ({ x, y, items, onClose }: ContextMenuProps) => {
  const menu = useRef<HTMLDivElement>(null)

  useEffect(() => {
    menu.current?.querySelector<HTMLButtonElement>('button:not(:disabled)')?.focus()

    const close = (event: MouseEvent) => {
      if (!menu.current?.contains(event.target as Node)) onClose()
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [onClose])

  const handleKey = (event: KeyboardEvent) => {
    const buttons = [...(menu.current?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)') ?? [])]
    const index = buttons.indexOf(document.activeElement as HTMLButtonElement)

    if (event.key === 'Escape') onClose()
    if (event.key === 'ArrowDown') buttons[(index + 1) % buttons.length]?.focus()
    if (event.key === 'ArrowUp') buttons[(index - 1 + buttons.length) % buttons.length]?.focus()
    if (event.key.startsWith('Arrow') || event.key === 'Escape') event.preventDefault()
  }

  // Keep the menu on screen.
  const left = Math.min(x, window.innerWidth - 230)
  const top = Math.min(y, window.innerHeight - items.length * 36 - 16)

  return createPortal(
    <div ref={menu} className={styles.menu} role="menu" style={{ left, top }} onKeyDown={handleKey}>
      {items.map((item) => (
        <button
          key={item.label}
          type="button"
          role={item.checked === undefined ? 'menuitem' : 'menuitemcheckbox'}
          aria-checked={item.checked}
          className={`${styles.item} ${item.danger ? styles.danger : ''}`}
          disabled={item.disabled}
          onClick={() => {
            item.onSelect()
            onClose()
          }}
        >
          {item.label}
          {item.checked && <LuCheck className={styles.check} aria-hidden />}
        </button>
      ))}
    </div>,
    document.body,
  )
}

export default ContextMenu
