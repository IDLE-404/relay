import { useEffect, useRef, useState } from 'react'
import { useInViewport } from '@/shared/hooks'
import { useI18n } from '@/shared/i18n/I18nContext'
import StepsDiagram from '../StepsDiagram'
import styles from './Steps.module.css'

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const stepCount = 4

// How far the section has scrolled through its sticky part: 0 at the start, 1 at the end.
const getProgress = (section: HTMLElement) => {
  const rect = section.getBoundingClientRect()
  const scrollable = rect.height - window.innerHeight
  if (scrollable <= 0) return 0
  return Math.min(Math.max(-rect.top / scrollable, 0), 1)
}

const Steps = () => {
  const { t } = useI18n()
  const how = t.landing.howItWorks
  const section = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)
  const { inView, seen } = useInViewport(section)
  const drawn = reduced || seen
  const [first, accent, last] = how.title

  // Active step follows scroll progress (rAF-throttled), only while the section is on screen.
  useEffect(() => {
    const element = section.current
    if (!element || !inView) return

    let frame = 0
    const update = () => {
      frame = 0
      setActive(Math.min(Math.floor(getProgress(element) * stepCount), stepCount - 1))
    }
    const handleScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
      cancelAnimationFrame(frame)
    }
  }, [inView])

  // Scroll to the middle of the step's part of the section.
  const goTo = (index: number) => {
    const element = section.current
    if (!element) return

    const scrollable = element.offsetHeight - window.innerHeight
    const top = element.getBoundingClientRect().top + window.scrollY
    window.scrollTo({ top: top + ((index + 0.5) / stepCount) * scrollable, behavior: 'smooth' })
  }

  return (
    <section id="how-it-works" ref={section} className={styles.steps}>
      <div className={styles.sticky}>
        <div className={styles.head}>
          <span className={styles.tag}>{how.tag}</span>
          <h2 className={styles.title}>
            {first} <em>{accent}</em> {last}
          </h2>
        </div>

        <div className={styles.grid}>
          <ol className={styles.list}>
            {how.steps.map((step, index) => (
              <li key={step.title} data-reveal>
                <button
                  className={`${styles.step} ${index === active ? styles.active : ''}`}
                  aria-current={index === active ? 'step' : undefined}
                  onClick={() => goTo(index)}
                >
                  <span className={styles.number}>0{index + 1}</span>
                  <span className={styles.stepTitle}>{step.title}</span>
                  <span className={styles.text}>{step.text}</span>
                </button>
              </li>
            ))}
          </ol>

          <div className={styles.diagram} data-paused={!inView}>
            <StepsDiagram
              active={active}
              drawn={drawn}
              showResult={reduced || active === stepCount - 1}
              orchestrator={how.orchestrator}
              result={how.result}
            />
          </div>

          <p className={styles.mobileResult}>{how.result}</p>
        </div>
      </div>
    </section>
  )
}

export default Steps
