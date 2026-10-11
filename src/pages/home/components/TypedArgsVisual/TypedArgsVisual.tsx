import { LuCheck, LuX } from 'react-icons/lu'
import JsonView from '@/components/FlowEditor/JsonView'
import { toolDefinition } from '../Audiences/data'
import styles from './TypedArgsVisual.module.css'

type TypedArgsVisualProps = {
  invalidNote: string
}

// The schema, then one argument object it rejects and one it accepts.
const TypedArgsVisual = ({ invalidNote }: TypedArgsVisualProps) => {
  return (
    <div className={styles.visual}>
      <JsonView value={toolDefinition.inputSchema} />
      <p className={`${styles.row} ${styles.bad}`}>
        <LuX aria-hidden />
        <code>
          {'{"sql": '}
          <span className={styles.wrong}>42</span>
          {'}'}
        </code>
        <span className={styles.note}>{invalidNote}</span>
      </p>
      <p className={`${styles.row} ${styles.good}`}>
        <LuCheck aria-hidden />
        <code>{'{"sql": "select 1"}'}</code>
      </p>
    </div>
  )
}

export default TypedArgsVisual
