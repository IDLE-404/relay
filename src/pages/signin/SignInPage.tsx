import { Link, Navigate, useSearchParams } from 'react-router-dom'
import { LuInfo } from 'react-icons/lu'
import LangSwitch from '@/components/LangSwitch'
import { safeNext, useAuth } from '@/shared/auth'
import { useI18n } from '@/shared/i18n/I18nContext'
import AuthForm from './components/AuthForm'
import SignInPreview from './components/SignInPreview'
import styles from './SignInPage.module.css'

const modes = ['signin', 'signup'] as const

const SignInPage = () => {
  const { t } = useI18n()
  const text = t.auth
  const { user, continueAsGuest } = useAuth()
  const [params, setParams] = useSearchParams()
  const mode = params.get('mode') === 'signup' ? 'signup' : 'signin'
  const next = safeNext(params.get('next'))

  // Already signed in (or just signed in): go where they were heading.
  if (user) return <Navigate to={next} replace />

  const selectMode = (value: (typeof modes)[number]) => {
    const updated = new URLSearchParams(params)
    if (value === 'signup') updated.set('mode', 'signup')
    else updated.delete('mode')
    setParams(updated, { replace: true })
  }

  const [first, accent] = text.title

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.top}>
          <Link to="/" className={styles.logo}>
            Relay
          </Link>
          <LangSwitch />
        </div>

        <div className={styles.content}>
          <h1 className={styles.title}>
            {first} <em>{accent}</em>
          </h1>
          <p className={styles.text}>{text.text}</p>

          <button type="button" className={styles.guest} onClick={continueAsGuest}>
            {text.guest}
          </button>

          <p className={styles.divider}>
            <span>{text.divider}</span>
          </p>

          <div className={styles.tabs} role="tablist">
            {modes.map((item) => (
              <button
                key={item}
                type="button"
                role="tab"
                aria-selected={mode === item}
                className={styles.tab}
                onClick={() => selectMode(item)}
              >
                {text.tabs[item]}
              </button>
            ))}
          </div>

          {/* key: switching tabs starts with a clean form. */}
          <AuthForm key={mode} mode={mode} />

          <p className={styles.note}>
            <LuInfo aria-hidden />
            {text.note}
          </p>
        </div>

        <Link to="/" className={styles.back}>
          {text.back}
        </Link>
      </main>

      <aside className={styles.preview}>
        <SignInPreview />
      </aside>
    </div>
  )
}

export default SignInPage
