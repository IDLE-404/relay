import { useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { LuArrowUpRight } from 'react-icons/lu'
import JsonView from '@/components/FlowEditor/JsonView'
import { useInViewport } from '@/shared/hooks'
import { useI18n } from '@/shared/i18n/I18nContext'
import { asset } from '@/shared/utils'
import AudienceCard from '../AudienceCard'
import AudienceFan from '../AudienceFan'
import OrchestratorVisual from '../OrchestratorVisual'
import TaskProgressVisual from '../TaskProgressVisual'
import TerminalVisual from '../TerminalVisual'
import TypedArgsVisual from '../TypedArgsVisual'
import {
  audiences,
  businessImage,
  icons,
  links,
  loadAudience,
  saveAudience,
  tints,
  toolDefinition,
  type Audience,
} from './data'
import styles from './Audiences.module.css'

const Audiences = () => {
  const { t } = useI18n()
  const text = t.landing.audiences
  const [audience, setAudience] = useState<Audience>(loadAudience)
  // Shared between the fan tiles and the bento cards.
  const [hovered, setHovered] = useState<number | null>(null)
  // The section, not the bento: the bento remounts on every switch (key), the section stays.
  const section = useRef<HTMLElement>(null)
  const { inView } = useInViewport(section)

  const select = (next: Audience) => {
    setAudience(next)
    saveAudience(next)
  }

  // Left / right arrows move between the two options.
  const handleKey = (event: KeyboardEvent) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault()
      select(audience === 'developers' ? 'business' : 'developers')
    }
  }

  const items = text[audience]

  const developerVisuals: ReactNode[] = [
    <JsonView key="tool" value={toolDefinition} />,
    <OrchestratorVisual key="orchestrator" />,
    <TerminalVisual key="terminal" />,
    <TypedArgsVisual key="typed" invalidNote={text.visual.invalid} />,
    <TaskProgressVisual key="tasks" working={text.visual.working} completed={text.visual.completed} />,
  ]

  const visual = (index: number) =>
    audience === 'developers' ? (
      developerVisuals[index]
    ) : (
      // The inset background is the placeholder if an image is missing.
      <div className={styles.image}>
        <img
          src={asset(businessImage(index).src)}
          width={businessImage(index).width}
          height={businessImage(index).height}
          loading="lazy"
          alt=""
        />
      </div>
    )

  const [first, accent, last] = text.title

  return (
    <section id="for-who" ref={section} className={styles.section}>
      <div className={styles.head} data-reveal>
        <span className={styles.tag}>{text.tag}</span>
        <h2 className={styles.title}>
          {first} <em>{accent}</em> {last}
        </h2>
        <div className={styles.toggle} role="group" onKeyDown={handleKey}>
          {audiences.map((item) => (
            <button key={item} type="button" aria-pressed={audience === item} onClick={() => select(item)}>
              {text.toggle[item]}
            </button>
          ))}
        </div>
      </div>

      {/* key: switching audience remounts the paths, so they draw in again. */}
      <div className={styles.fan} data-reveal>
        <AudienceFan
          key={audience}
          center={text.center}
          items={items.map((item, index) => ({ icon: icons[audience][index], title: item.tile, caption: item.caption }))}
          hovered={hovered}
          onHover={setHovered}
        />
      </div>

      <div key={audience} className={styles.bento} data-paused={!inView}>
        {items.map((item, index) => (
          <AudienceCard
            key={item.title}
            title={item.title}
            text={item.text}
            tint={tints[index].color}
            wide={index >= 3}
            active={hovered === index}
            onHover={(active) => setHovered(active ? index : null)}
          >
            {visual(index)}
          </AudienceCard>
        ))}
      </div>

      {audience === 'developers' && (
        <p className={styles.links}>
          <a href={links.spec} target="_blank" rel="noopener noreferrer">
            {text.links.spec}
            <LuArrowUpRight aria-hidden />
          </a>
          <span aria-hidden>·</span>
          <a href={links.a2a} target="_blank" rel="noopener noreferrer">
            {text.links.a2a}
            <LuArrowUpRight aria-hidden />
          </a>
        </p>
      )}
    </section>
  )
}

export default Audiences
