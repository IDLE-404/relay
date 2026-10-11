import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FiArrowUpRight } from 'react-icons/fi'
import LangSwitch from '@/components/LangSwitch'
import UserMenu from '@/components/UserMenu'
import { useAuth } from '@/shared/auth'
import { useActiveSection } from '@/shared/hooks'
import { useI18n } from '@/shared/i18n/I18nContext'
import styles from './Header.module.css'

const Header = () => {
  const { t } = useI18n()
  const { pathname } = useLocation()
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const lastScroll = useRef(0)

  const sections = [
    { id: 'about', label: t.header.whyMcp },
    { id: 'how-it-works', label: t.header.howItWorks },
    { id: 'for-who', label: t.header.forWho },
    { id: 'use-cases', label: t.header.buildRun },
  ]
  const active = useActiveSection(
    sections.map((section) => section.id),
    pathname === '/',
  )

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY
      setHidden(current > lastScroll.current && current > 120)
      setScrolled(current > 40)
      lastScroll.current = current
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const close = () => setOpen(false)

  return (
    <header
      className={`${styles.header} ${open ? styles.open : ''} ${hidden && !open ? styles.hidden : ''} ${scrolled ? styles.scrolled : ''}`}
    >
      <div className={styles.bar}>
        <Link to="/" className={styles.logo} onClick={close}>
          Relay
        </Link>

        <div className={styles.menu}>
          <div className={styles.menuInner}>
            <nav className={styles.nav}>
              {/* Router links, so the anchors also work from /console and under the base path. */}
              {sections.map(({ id, label }) => (
                <Link
                  key={id}
                  to={{ pathname: '/', hash: id }}
                  className={`${styles.link} ${active === id ? styles.active : ''}`}
                  aria-current={active === id ? 'location' : undefined}
                  onClick={close}
                >
                  {label}
                </Link>
              ))}
            </nav>

            <div className={styles.actions}>
              <LangSwitch className={styles.lang} />
              {user ? (
                <UserMenu onNavigate={close} />
              ) : (
                <>
                  <Link to="/signin" className={styles.secondary} onClick={close}>
                    {t.header.signIn}
                  </Link>
                  {/* Goes through RequireAuth: signed-out visitors land on /signin first. */}
                  <Link to="/console" className={styles.primary} onClick={close}>
                    {t.header.openConsole}
                    <span className={styles.arrow}>
                      <FiArrowUpRight aria-hidden />
                    </span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        <button className={styles.burger} onClick={() => setOpen(!open)} aria-label={t.header.menu} aria-expanded={open}>
          <span />
          <span />
        </button>
      </div>
    </header>
  )
}

export default Header
