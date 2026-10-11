import styles from './FlowLog.module.css'

type FlowLogProps = {
  lines: string[]
}

const FlowLog = ({ lines }: FlowLogProps) => {
  return (
    <div className={styles.log}>
      {lines.map((line, index) => (
        <p key={index} className={styles.line}>
          {line}
        </p>
      ))}
    </div>
  )
}

export default FlowLog
