import type { ReactNode } from 'react'
import styles from './JsonView.module.css'

type JsonViewProps = {
  value: unknown
}

// Strings (keys get the trailing colon), booleans/null, numbers.
const token = /("(?:[^"\\]|\\.)*")(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d+)?/g

const highlight = (json: string) => {
  const parts: ReactNode[] = []
  let last = 0

  for (const match of json.matchAll(token)) {
    const index = match.index
    parts.push(json.slice(last, index))

    const className = match[2] ? styles.key : match[1] ? styles.string : match[3] ? styles.literal : styles.number
    parts.push(
      <span key={index} className={className}>
        {match[1] ?? match[0]}
      </span>,
    )
    if (match[2]) parts.push(match[2])
    last = index + match[0].length
  }

  parts.push(json.slice(last))
  return parts
}

// Read-only JSON with simple syntax colours.
const JsonView = ({ value }: JsonViewProps) => {
  return (
    <pre className={styles.code} tabIndex={0}>
      {highlight(JSON.stringify(value, null, 2))}
    </pre>
  )
}

export default JsonView
