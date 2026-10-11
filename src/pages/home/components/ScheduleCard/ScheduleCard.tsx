import { useState } from 'react'
import { LuPlus } from 'react-icons/lu'
import { useI18n } from '@/shared/i18n/I18nContext'
import { agentColor, agentSoft, schedule } from '../ConsolePreview/data'
import styles from './ScheduleCard.module.css'

type ScheduleCardProps = {
  seconds: number
}

const percent = (minutes: number) => (minutes / schedule.span) * 100

const ScheduleCard = ({ seconds }: ScheduleCardProps) => {
  const { t } = useI18n()
  const text = t.landing.preview
  const [open, setOpen] = useState<string | null>(null)

  // The "now" line moves one timeline minute every 10 seconds and wraps at the end.
  const now = (schedule.now + seconds / 10) % schedule.span

  return (
    <div className={styles.schedule}>
      <div className={styles.head}>
        <p className={styles.title}>{text.schedule.title}</p>
        <span className={styles.today}>
          {text.schedule.today}
          <LuPlus aria-label={text.schedule.add} />
        </span>
      </div>

      <div className={styles.timeline}>
        {schedule.ticks.map((tick, index) => (
          <span key={tick} className={styles.tick} style={{ left: `${(index / (schedule.ticks.length - 1)) * 100}%` }}>
            <span className={styles.tickLabel}>{tick}</span>
          </span>
        ))}

        {/* A full-width layer moved by its own width percent, so only transform changes. */}
        <span className={styles.nowLayer} style={{ transform: `translateX(${percent(now)}%)` }} aria-hidden>
          <span className={styles.now} />
        </span>

        {schedule.runs.map((item, index) => (
          // Late runs are anchored by their right edge so the pill stays inside the card.
          <div
            key={item.id}
            className={styles.slot}
            style={{
              top: `${28 + index * 26}%`,
              ...(percent(item.at) > 60 ? { right: `${100 - percent(item.at)}%` } : { left: `${percent(item.at)}%` }),
            }}
          >
            <button
              type="button"
              className={styles.pill}
              style={{ backgroundImage: `linear-gradient(${agentSoft[item.agent]}, ${agentSoft[item.agent]})`, color: agentColor[item.agent] }}
              aria-expanded={open === item.id}
              onClick={() => setOpen(open === item.id ? null : item.id)}
            >
              {item.time} {text.schedule.runs[item.id]}
            </button>

            {open === item.id && (
              <div className={styles.popover}>
                <p className={styles.popAgent}>
                  <i style={{ background: agentColor[item.agent] }} />
                  {text.agents[item.agent]}
                </p>
                <p className={styles.popLabel}>{text.schedule.servers}</p>
                <p className={styles.popServers}>{item.servers.join(', ')}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default ScheduleCard
