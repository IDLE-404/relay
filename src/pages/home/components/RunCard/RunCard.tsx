import { LuCheck } from 'react-icons/lu'
import { useI18n } from '@/shared/i18n/I18nContext'
import { fill } from '@/shared/utils'
import { agentColor, agentSoft, run } from '../ConsolePreview/data'
import styles from './RunCard.module.css'

type RunCardProps = {
  seconds: number
}

const formatTime = (total: number) => {
  const minutes = String(Math.floor(total / 60)).padStart(2, '0')
  const rest = String(total % 60).padStart(2, '0')
  return `${minutes}:${rest}`
}

const RunCard = ({ seconds }: RunCardProps) => {
  const { t } = useI18n()
  const preview = t.landing.preview

  return (
    <div className={styles.run}>
      <div className={styles.head}>
        <span className={styles.agent} style={{ background: agentSoft[run.agent], color: agentColor[run.agent] }}>
          <i style={{ background: agentColor[run.agent] }} />
          {preview.agents[run.agent]}
        </span>
        <span className={styles.calls}>{fill(preview.run.calls, { n: run.calls.length })}</span>
      </div>

      <div>
        <p className={styles.title}>{preview.run.title}</p>
        <p className={styles.timer}>{formatTime(run.startSeconds + seconds)}</p>
      </div>

      {/* One segment per call; the width follows its duration. */}
      <div className={styles.bar}>
        {run.calls.map((call) => (
          <button
            key={call.tool}
            type="button"
            className={styles.segment}
            style={{ flexGrow: call.ms, background: agentColor[call.agent] }}
            data-tip={`${call.tool} · ${call.ms}ms`}
            aria-label={`${call.tool} · ${call.ms}ms`}
          />
        ))}
      </div>

      <ul className={styles.list}>
        {run.calls.map((call) => (
          <li key={call.tool}>
            <i style={{ background: agentColor[call.agent] }} />
            <span className={styles.tool}>{call.tool}</span>
            <span className={styles.ms}>{call.ms}ms</span>
            <LuCheck className={styles.ok} aria-hidden />
          </li>
        ))}
      </ul>
    </div>
  )
}

export default RunCard
