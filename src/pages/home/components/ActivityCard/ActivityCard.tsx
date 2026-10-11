import { useI18n } from '@/shared/i18n/I18nContext'
import ActivityHeatmap from '../ActivityHeatmap'
import AgentRadar from '../AgentRadar'
import { activity } from '../ConsolePreview/data'
import styles from './ActivityCard.module.css'

type ActivityCardProps = {
  seconds: number
}

const ActivityCard = ({ seconds }: ActivityCardProps) => {
  const { t } = useI18n()
  const text = t.landing.preview

  // One more run every 9 seconds on screen.
  const runs = activity.runs + Math.floor(seconds / 9)

  return (
    <div className={styles.activity}>
      <div className={styles.left}>
        <p className={styles.title}>{text.activity.title}</p>
        <div className={styles.stats}>
          <p>
            <span className={styles.number}>{runs}</span>
            <span className={styles.caption}>{text.activity.runs}</span>
          </p>
          <p>
            <span className={styles.number}>{activity.bestDay}</span>
            <span className={styles.caption}>{text.activity.bestDay}</span>
          </p>
        </div>
        <ActivityHeatmap levels={activity.heatmap} />
      </div>

      <div className={styles.right}>
        <AgentRadar
          values={activity.radar}
          axes={text.activity.axes}
          agentNames={text.activity.short}
        />
      </div>
    </div>
  )
}

export default ActivityCard
