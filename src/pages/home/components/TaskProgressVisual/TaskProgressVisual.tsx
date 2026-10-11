import styles from './TaskProgressVisual.module.css'

type TaskProgressVisualProps = {
  working: string
  completed: string
}

// A loop: the bar fills while the task is "working", then the status switches to "completed".
const TaskProgressVisual = ({ working, completed }: TaskProgressVisualProps) => {
  return (
    <div className={styles.visual} aria-hidden>
      <p className={styles.call}>tasks/get · task_7f3a</p>
      <div className={styles.track}>
        <span className={styles.bar} />
      </div>
      <div className={styles.chips}>
        <span className={`${styles.chip} ${styles.working}`}>status: {working}</span>
        <span className={`${styles.chip} ${styles.completed}`}>status: {completed}</span>
      </div>
    </div>
  )
}

export default TaskProgressVisual
