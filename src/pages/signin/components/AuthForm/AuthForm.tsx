import { useRef, useState, type FormEvent } from 'react'
import { useAuth, validate, type FieldErrors } from '@/shared/auth'
import { useI18n } from '@/shared/i18n/I18nContext'
import FormField from '../FormField'
import styles from './AuthForm.module.css'

type AuthFormProps = {
  mode: 'signin' | 'signup'
}

type Field = 'name' | 'email' | 'password'

// Errors show after submit and clear as soon as that field is edited.
const AuthForm = ({ mode }: AuthFormProps) => {
  const { t } = useI18n()
  const text = t.auth
  const { signIn, signUp } = useAuth()
  const [values, setValues] = useState({ name: '', email: '', password: '' })
  const [errors, setErrors] = useState<FieldErrors>({})
  const [formError, setFormError] = useState<keyof typeof text.errors | null>(null)
  const [loading, setLoading] = useState(false)
  const nameInput = useRef<HTMLInputElement>(null)
  const emailInput = useRef<HTMLInputElement>(null)
  const passwordInput = useRef<HTMLInputElement>(null)

  const change = (field: Field, value: string) => {
    setValues({ ...values, [field]: value })
    setErrors({ ...errors, [field]: undefined })
    setFormError(null)
  }

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    const found = validate(values, mode)
    const firstInvalid = (['name', 'email', 'password'] as const).find((field) => found[field])
    if (firstInvalid) {
      setErrors(found)
      const inputs = { name: nameInput, email: emailInput, password: passwordInput }
      inputs[firstInvalid].current?.focus()
      return
    }

    setLoading(true)
    const result = mode === 'signin' ? await signIn(values.email, values.password) : await signUp(values.name, values.email, values.password)
    // On success the page redirects, so only failures need handling here.
    if (!result.ok) {
      setLoading(false)
      setFormError(result.error)
      emailInput.current?.focus()
    }
  }

  const fieldError = (field: Field) => (errors[field] ? text.errors[errors[field]] : undefined)

  return (
    <form className={styles.form} onSubmit={submit} noValidate>
      {mode === 'signup' && (
        <FormField
          ref={nameInput}
          label={text.name}
          name="name"
          autoComplete="name"
          value={values.name}
          error={fieldError('name')}
          onChange={(event) => change('name', event.target.value)}
        />
      )}
      <FormField
        ref={emailInput}
        label={text.email}
        name="email"
        type="email"
        autoComplete="email"
        inputMode="email"
        value={values.email}
        error={fieldError('email')}
        onChange={(event) => change('email', event.target.value)}
      />
      <FormField
        ref={passwordInput}
        label={text.password}
        name="password"
        type="password"
        autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
        value={values.password}
        error={fieldError('password')}
        toggleLabels={{ show: text.showPassword, hide: text.hidePassword }}
        onChange={(event) => change('password', event.target.value)}
      />

      {formError && (
        <p className={styles.formError} role="alert">
          {text.errors[formError]}
        </p>
      )}

      <button type="submit" className={styles.submit} disabled={loading} aria-busy={loading}>
        {loading ? text.loading[mode] : text.submit[mode]}
      </button>
    </form>
  )
}

export default AuthForm
