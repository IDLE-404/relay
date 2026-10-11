import type { ReactNode } from 'react'
import { LuFrame, LuMessageCircle, LuMousePointer2 } from 'react-icons/lu'
import { useI18n } from '@/shared/i18n/I18nContext'
import styles from './AppWindow.module.css'

type AppWindowProps = {
  children?: ReactNode
  title?: string
  // Optional strip under the title bar (e.g. tabs).
  header?: ReactNode
}

const tools = [LuMousePointer2, LuFrame, LuMessageCircle]
const avatars = ['D', 'A', 'T']

const AppWindow = ({ children, title, header }: AppWindowProps) => {
  const { t } = useI18n()

  return (
    <div className={styles.window}>
      <div className={styles.titlebar}>
        <span className={styles.dots} aria-hidden>
          <i />
          <i />
          <i />
        </span>
        <span className={styles.title}>{title ?? t.landing.window.title}</span>
        <span className={styles.actions}>
          <span className={styles.avatars} aria-hidden>
            {avatars.map((letter) => (
              <span key={letter}>{letter}</span>
            ))}
          </span>
          <span className={styles.share}>{t.landing.window.share}</span>
        </span>
      </div>

      {header}

      <div className={styles.body}>
        <div className={styles.toolbar} aria-hidden>
          {tools.map((Icon, index) => (
            <span key={index} className={index === 0 ? styles.toolActive : styles.tool}>
              <Icon />
            </span>
          ))}
        </div>
        <div className={styles.screen}>{children}</div>
      </div>
    </div>
  )
}

export default AppWindow
