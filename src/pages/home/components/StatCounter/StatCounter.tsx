import { useEffect, useState } from 'react'
import { useI18n } from '@/shared/i18n/I18nContext'
import styles from './StatCounter.module.css'

type StatCounterProps = {
  value: number
  suffix: string
  label: string
  start: boolean
}

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const duration = 1400

const StatCounter = ({ value, suffix, label, start }: StatCounterProps) => {
  const { lang } = useI18n()
  const [current, setCurrent] = useState(reduced ? value : 0)

  useEffect(() => {
    if (!start || reduced) return

    const begin = performance.now()
    let frame = 0

    const tick = (now: number) => {
      const progress = Math.min((now - begin) / duration, 1)
      setCurrent(Math.round(value * (1 - (1 - progress) ** 3)))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [start, value])

  return (
    <div className={styles.stat}>
      <span className={styles.value}>
        {current.toLocaleString(lang)}
        {suffix}
      </span>
      <span className={styles.label}>{label}</span>
    </div>
  )
}

export default StatCounter
