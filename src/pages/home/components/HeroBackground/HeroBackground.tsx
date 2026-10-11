import styles from './HeroBackground.module.css'

// Pastel blobs only (CSS). No media files, so no extra requests.
const HeroBackground = () => {
  return <div className={styles.background} aria-hidden />
}

export default HeroBackground
