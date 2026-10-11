import styles from './UseCasesSkeleton.module.css'

// Placeholder with the same size as the playground while its chunk loads, so nothing jumps.
const UseCasesSkeleton = () => {
  return (
    <div id="use-cases" className={styles.section} aria-hidden>
      <span className={styles.tag} />
      <span className={styles.title} />
      <span className={styles.text} />
      <div className={styles.frame} />
    </div>
  )
}

export default UseCasesSkeleton
