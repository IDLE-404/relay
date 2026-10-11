import { useRef } from 'react'
import { useInViewport } from '@/shared/hooks'
import { useI18n } from '@/shared/i18n/I18nContext'
import { asset } from '@/shared/utils'
import ChallengeRow from '../ChallengeRow'
import styles from './Challenges.module.css'

// Console panels for each row, in the same order as i18n items.
const anchors = ['/console#servers', '/console#keys', '/console#logs']

const Challenges = () => {
  const { t } = useI18n()
  const challenges = t.landing.challenges
  const [before, accent, after] = challenges.title
  const cover = useRef<HTMLDivElement>(null)
  const { inView } = useInViewport(cover)

  return (
    <section className={styles.challenges}>
      <div ref={cover} className={styles.cover} data-paused={!inView}>
        {/* The dot flower is used as a mask, so its colour comes from a token (--text-muted). */}
        <span className={styles.image} style={{ maskImage: `url(${asset('media/challenges.webp')})` }} aria-hidden />
        <h2 className={styles.title}>
          {before} <em>{accent}</em> {after}
        </h2>
        <span className={styles.blob} aria-hidden />
      </div>

      <div className={styles.rows} data-stagger>
        {challenges.items.map((item, index) => (
          <ChallengeRow
            key={item.title}
            number={index + 1}
            title={item.title}
            problem={item.problem}
            solution={item.solution}
            problemLabel={challenges.problem}
            solutionLabel={challenges.solution}
            link={challenges.link}
            to={anchors[index]}
          />
        ))}
      </div>
    </section>
  )
}

export default Challenges
