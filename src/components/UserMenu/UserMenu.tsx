import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/shared/auth'
import { useI18n } from '@/shared/i18n/I18nContext'
import styles from './UserMenu.module.css'

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('')

type UserMenuProps = {
  onNavigate?: () => void
}

// Avatar button with a dropdown. Arrow keys move, Esc or a click outside closes.
const UserMenu = ({ onNavigate }: UserMenuProps) => {
  const { t } = useI18n()
  const { user, signOut } = useAuth()
  const [open, setOpen] = useState(false)
  const wrapper = useRef<HTMLDivElement>(null)
  const button = useRef<HTMLButtonElement>(null)
  const menuId = useId()

  useEffect(() => {
    if (!open) return
    wrapper.current?.querySelector<HTMLElement>('[role="menuitem"]')?.focus()

    const close = (event: MouseEvent) => {
      if (!wrapper.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [open])

  if (!user) return null

  const closeMenu = () => {
    setOpen(false)
    button.current?.focus()
  }

  const handleKey = (event: KeyboardEvent) => {
    const items = [...(wrapper.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? [])]
    const index = items.indexOf(document.activeElement as HTMLElement)
    if (event.key === 'Escape') closeMenu()
    if (event.key === 'ArrowDown') items[(index + 1) % items.length]?.focus()
    if (event.key === 'ArrowUp') items[(index - 1 + items.length) % items.length]?.focus()
    if (event.key === 'Escape' || event.key.startsWith('Arrow')) event.preventDefault()
  }

  return (
    <div ref={wrapper} className={styles.wrapper} onKeyDown={open ? handleKey : undefined}>
      <button
        ref={button}
        type="button"
        className={styles.avatar}
        aria-label={`${t.header.account.menu}: ${user.name}`}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen(!open)}
      >
        {initials(user.name)}
      </button>

      {open && (
        <div id={menuId} className={styles.menu} role="menu">
          <div className={styles.info}>
            <p className={styles.name}>{user.name}</p>
            <p className={styles.email}>{user.email ?? t.header.account.guestSession}</p>
          </div>
          <Link
            to="/console"
            role="menuitem"
            className={styles.item}
            onClick={() => {
              setOpen(false)
              onNavigate?.()
            }}
          >
            {t.header.openConsole}
          </Link>
          <button
            type="button"
            role="menuitem"
            className={styles.item}
            onClick={() => {
              setOpen(false)
              signOut()
              onNavigate?.()
            }}
          >
            {t.header.account.signOut}
          </button>
        </div>
      )}
    </div>
  )
}

export default UserMenu
