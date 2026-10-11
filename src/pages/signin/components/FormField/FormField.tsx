import { useId, useState, type InputHTMLAttributes, type Ref } from 'react'
import { LuEye, LuEyeOff } from 'react-icons/lu'
import styles from './FormField.module.css'

type FormFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  error?: string
  ref?: Ref<HTMLInputElement>
  // Password fields get a show/hide toggle.
  toggleLabels?: { show: string; hide: string }
}

const FormField = ({ label, error, ref, toggleLabels, type, ...input }: FormFieldProps) => {
  const id = useId()
  const [visible, setVisible] = useState(false)
  const errorId = `${id}-error`

  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <div className={`${styles.control} ${error ? styles.invalid : ''}`}>
        <input
          ref={ref}
          id={id}
          className={styles.input}
          type={toggleLabels && visible ? 'text' : type}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          {...input}
        />
        {toggleLabels && (
          <button
            type="button"
            className={styles.toggle}
            aria-label={visible ? toggleLabels.hide : toggleLabels.show}
            aria-pressed={visible}
            onClick={() => setVisible(!visible)}
          >
            {visible ? <LuEyeOff aria-hidden /> : <LuEye aria-hidden />}
          </button>
        )}
      </div>
      {error && (
        <p id={errorId} className={styles.error}>
          {error}
        </p>
      )}
    </div>
  )
}

export default FormField
