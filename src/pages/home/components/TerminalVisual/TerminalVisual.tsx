import styles from './TerminalVisual.module.css'

// A coding agent calling a GitHub MCP server from the editor.
const TerminalVisual = () => {
  return (
    <div className={styles.terminal} aria-hidden>
      <div className={styles.bar}>
        <i />
        <i />
        <i />
      </div>
      <p className={styles.out}>
        <span className={styles.arrow}>→</span> tools/call github.create_pull_request
      </p>
      <p className={styles.in}>
        <span className={styles.arrow}>←</span> PR #42 opened
        <span className={styles.caret} />
      </p>
    </div>
  )
}

export default TerminalVisual
