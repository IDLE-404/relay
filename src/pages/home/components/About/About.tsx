import { useEffect, useRef, useState } from 'react'
import Title from '@/components/Title'
import { useInViewport } from '@/shared/hooks'
import { useI18n } from '@/shared/i18n/I18nContext'
import DetailCard from '../DetailCard'
import RadialToolkit from '../RadialToolkit'
import StatCounter from '../StatCounter'
import { nodes } from './data'
import styles from './About.module.css'

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const interval = 5000

const About = () => {
  const { t } = useI18n()
  const why = t.landing.why
  const section = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const { inView, seen } = useInViewport(section)

  const next = () => setActive((active + 1) % nodes.length)
  const prev = () => setActive((active - 1 + nodes.length) % nodes.length)

  // Auto-advance; restarts after every change, stops on hover/focus.
  useEffect(() => {
    if (reduced || hovered || focused || !inView) return

    const timer = setTimeout(() => setActive((active + 1) % nodes.length), interval)
    return () => clearTimeout(timer)
  }, [active, hovered, focused, inView])

  // S/T/O/C/R and arrows, only while the section is on screen.
  useEffect(() => {
    if (!inView) return

    const handleKey = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey || event.altKey) return
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return

      const index = nodes.findIndex((node) => node.key === event.key.toUpperCase())
      if (index !== -1) setActive(index)
      if (event.key === 'ArrowRight') next()
      if (event.key === 'ArrowLeft') prev()
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  })

  return (
    <section id="about" ref={section} className={styles.about}>
      <div className={styles.head} data-reveal>
        <Title>
          {why.title[0]} <em>{why.title[1]}</em>
        </Title>
        <div className={styles.stats}>
          {why.stats.map((stat) => (
            <StatCounter key={stat.label} {...stat} start={seen} />
          ))}
        </div>
        <p className={styles.caption}>{why.statsCaption}</p>
      </div>

      <div
        className={styles.explainer}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setFocused(true)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false)
        }}
        data-reveal
      >
        <RadialToolkit
          labels={why.items.map((item) => item.label)}
          agent={why.agent}
          more={why.more}
          active={active}
          onSelect={setActive}
        />
        <DetailCard items={why.items} active={active} sourceLabel={why.source} />
      </div>
    </section>
  )
}

export default About
