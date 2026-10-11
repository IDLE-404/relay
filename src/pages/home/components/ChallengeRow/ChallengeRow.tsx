import { Link } from 'react-router-dom'
import styles from './ChallengeRow.module.css'

type ChallengeRowProps = {
  number: number
  title: string
  problem: string
  solution: string
  problemLabel: string
  solutionLabel: string
  link: string
  to: string
}

const ChallengeRow = ({ number, title, problem, solution, problemLabel, solutionLabel, link, to }: ChallengeRowProps) => {
  return (
    <article className={styles.row} data-reveal>
      {/* Outlined numeral with a filled copy on top that fades in on hover. */}
      <span className={styles.numeral} aria-hidden>
        <span className={styles.outline}>{number}</span>
        <span className={styles.fill}>{number}</span>
      </span>

      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.columns}>
          <div>
            <p className={styles.label}>{problemLabel}</p>
            <p className={styles.text}>{problem}</p>
          </div>
          <div>
            <p className={styles.label}>{solutionLabel}</p>
            <p className={styles.text}>{solution}</p>
          </div>
        </div>
        <Link to={to} className={styles.link}>
          {link} →
        </Link>
      </div>
    </article>
  )
}

export default ChallengeRow
