import styles from './Toast.module.css'

type ToastProps = {
  text: string | null
}

// The live region is always rendered, so screen readers announce new text.
const Toast = ({ text }: ToastProps) => {
  return (
    <div className={styles.region} role="status" aria-live="polite">
      {text && (
        <span key={text} className={styles.toast}>
          {text}
        </span>
      )}
    </div>
  )
}

export default Toast
