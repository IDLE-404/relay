import { useEffect, useRef, useState } from 'react'
import { useInViewport } from '@/shared/hooks'
import { useI18n } from '@/shared/i18n/I18nContext'
import ActivityCard from '../ActivityCard'
import ApprovalCard from '../ApprovalCard'
import BentoCard from '../BentoCard'
import RunCard from '../RunCard'
import ScheduleCard from '../ScheduleCard'
import UsageCard from '../UsageCard'
import styles from './ConsolePreview.module.css'

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

const ConsolePreview = () => {
  const { t } = useI18n()
  const preview = t.landing.preview
  const section = useRef<HTMLElement>(null)
  const { inView } = useInViewport(section)
  // Seconds the section has been on screen. Cards derive their "live" numbers from it.
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    if (reduced || !inView) return

    const timer = setInterval(() => setSeconds((value) => value + 1), 1000)
    return () => clearInterval(timer)
  }, [inView])

  const label = (title: string) => `${title} — ${preview.openInConsole}`
  const [first, accent] = preview.title

  return (
    <section id="preview" ref={section} className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.head} data-reveal>
          <span className={styles.tag}>
            <i />
            {preview.tag}
          </span>
          <h2 className={styles.title}>
            {first} <em>{accent}</em>
          </h2>
          <p className={styles.text}>{preview.text}</p>
        </div>

        <div className={styles.grid} data-stagger>
          <BentoCard panel="runs" label={label(preview.run.title)}>
            <RunCard seconds={seconds} />
          </BentoCard>
          <BentoCard panel="approvals" label={label(preview.approval.title)}>
            <ApprovalCard />
          </BentoCard>
          <BentoCard panel="usage" label={label(preview.usage.title)}>
            <UsageCard seconds={seconds} />
          </BentoCard>
          <BentoCard panel="schedule" label={label(preview.schedule.title)}>
            <ScheduleCard seconds={seconds} />
          </BentoCard>
          <BentoCard panel="activity" label={label(preview.activity.title)} wide>
            <ActivityCard seconds={seconds} />
          </BentoCard>
        </div>
      </div>
    </section>
  )
}

export default ConsolePreview
