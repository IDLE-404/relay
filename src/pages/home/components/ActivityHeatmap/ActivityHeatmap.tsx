import styles from './ActivityHeatmap.module.css'

type ActivityHeatmapProps = {
  levels: number[] // 0..4, 10 columns x 7 rows
}

const ActivityHeatmap = ({ levels }: ActivityHeatmapProps) => {
  return (
    <div className={styles.heatmap} aria-hidden>
      {levels.map((level, index) => (
        <i key={index} className={styles[`level${level}`]} />
      ))}
    </div>
  )
}

export default ActivityHeatmap
