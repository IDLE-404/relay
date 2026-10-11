import { canvas, pathEndX, rowPath } from '../geometry'
import styles from './FlowPaths.module.css'

type FlowPathsProps = {
  rowYs: number[]
  activeRow: number | null
  packet: string | null
  packetKey: string
}

const FlowPaths = ({ rowYs, activeRow, packet, packetKey }: FlowPathsProps) => {
  return (
    <>
      <svg className={styles.paths} width={canvas.width} height={canvas.height} aria-hidden>
        <defs>
          <marker id="flow-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M0 0 L10 5 L0 10 z" className={styles.arrow} />
          </marker>
        </defs>
        {rowYs.map((y, index) => (
          <path
            key={index}
            d={rowPath(y, pathEndX)}
            className={`${styles.path} ${index === activeRow ? styles.active : ''}`}
            markerEnd="url(#flow-arrow)"
          />
        ))}
      </svg>

      {packet && <span key={packetKey} className={styles.packet} style={{ offsetPath: `path('${packet}')` }} />}
    </>
  )
}

export default FlowPaths
