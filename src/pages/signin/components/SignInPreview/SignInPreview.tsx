import RunCard from '@/pages/home/components/RunCard'
import UsageCard from '@/pages/home/components/UsageCard'
import styles from './SignInPreview.module.css'

// A still picture of two console widgets (seconds fixed at 0, so nothing ticks).
const SignInPreview = () => {
  return (
    <div className={styles.panel} aria-hidden>
      <span className={styles.blobYellow} />
      <span className={styles.blobPink} />
      <div className={styles.cards}>
        <div className={styles.card}>
          <RunCard seconds={0} />
        </div>
        <div className={`${styles.card} ${styles.offset}`}>
          <UsageCard seconds={0} />
        </div>
      </div>
    </div>
  )
}

export default SignInPreview
