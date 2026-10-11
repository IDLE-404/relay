import { Link } from 'react-router-dom'
import { FiArrowUpRight } from 'react-icons/fi'
import LangSwitch from '@/components/LangSwitch'
import { AUTHOR_NAME, REPO_URL } from '@/shared/config'
import { useI18n } from '@/shared/i18n/I18nContext'
import { fill } from '@/shared/utils'
import styles from './Footer.module.css'

type FooterProps = {
  // compact: no CTA band and no background blobs (pages other than the landing).
  compact?: boolean
}

const links = {
  spec: 'https://modelcontextprotocol.io/specification/latest',
  a2a: 'https://a2a-protocol.org/latest/',
}

const backToTop = () => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })
}

const Footer = ({ compact = false }: FooterProps) => {
  const { t } = useI18n()
  const text = t.footer
  const [first, accent, last] = text.title

  const sections = [
    { id: 'about', label: t.header.whyMcp },
    { id: 'how-it-works', label: t.header.howItWorks },
    { id: 'for-who', label: t.header.forWho },
    { id: 'use-cases', label: t.header.buildRun },
  ]

  return (
    <footer className={`${styles.footer} ${compact ? styles.compact : ''}`}>
      {!compact && (
        <>
          <span className={styles.blobYellow} aria-hidden />
          <span className={styles.blobPink} aria-hidden />

          <div className={styles.cta}>
            <h2 className={styles.title}>
              {first} <em>{accent}</em>
              {last}
            </h2>
            <p className={styles.text}>{text.text}</p>
            <div className={styles.buttons}>
              <Link to="/console" className={styles.primary}>
                {text.openConsole}
              </Link>
              <a href={links.spec} target="_blank" rel="noopener noreferrer" className={styles.outline}>
                {text.readSpec}
              </a>
            </div>
          </div>
        </>
      )}

      <div className={styles.columns}>
        <div>
          <p className={styles.heading}>{text.columns.product}</p>
          <ul>
            {sections.map(({ id, label }) => (
              <li key={id}>
                <Link to={{ pathname: '/', hash: id }}>{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className={styles.heading}>{text.columns.resources}</p>
          <ul>
            {[
              { href: links.spec, label: text.resources.spec },
              { href: links.a2a, label: text.resources.a2a },
              { href: REPO_URL, label: text.resources.source },
            ].map(({ href, label }) => (
              <li key={href}>
                <a href={href} target="_blank" rel="noopener noreferrer">
                  {label}
                  <FiArrowUpRight aria-hidden />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className={styles.heading}>{text.columns.project}</p>
          <ul className={styles.notes}>
            <li>{fill(text.project.portfolio, { author: AUTHOR_NAME })}</li>
            <li>{text.project.demo}</li>
            <li>{text.project.stack}</li>
          </ul>
        </div>
      </div>

      <div className={styles.bottom}>
        <span>
          © {new Date().getFullYear()} {AUTHOR_NAME}
        </span>
        <LangSwitch />
        <button type="button" className={styles.top} onClick={backToTop}>
          {text.backToTop}
        </button>
      </div>

      {/* Outlined wordmark, cut by the footer edge. A filled copy fades in on hover. */}
      <div className={styles.wordmark} aria-hidden>
        <span className={styles.outlineText}>RELAY</span>
        <span className={styles.fillText}>RELAY</span>
      </div>
    </footer>
  )
}

export default Footer
