import { BaseEdge, EdgeLabelRenderer, getBezierPath, type Edge, type EdgeProps } from '@xyflow/react'
import { useEditor } from '../EditorContext'
import styles from './FlowEdge.module.css'

export type FlowEdgeData = { label: string; dashed: boolean; active: boolean }

const FlowEdge = (props: EdgeProps<Edge<FlowEdgeData>>) => {
  const { id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, markerEnd, data } = props
  const { showLabels, reducedMotion } = useEditor()
  const [path, labelX, labelY] = getBezierPath({ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition })

  return (
    <>
      <BaseEdge
        id={id}
        path={path}
        markerEnd={markerEnd}
        className={`${styles.edge} ${data?.active ? styles.active : ''} ${data?.dashed ? styles.dashed : ''}`}
      />

      {/* A dot travels along the edge of the call that is running. */}
      {data?.active && !reducedMotion && (
        <circle r={4} className={styles.dot}>
          <animateMotion dur="0.9s" repeatCount="indefinite" path={path} />
        </circle>
      )}

      <EdgeLabelRenderer>
        <div
          className={`${styles.label} nodrag nopan`}
          style={{ transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)` }}
        >
          {showLabels ? (
            <span className={styles.text}>{data?.label}</span>
          ) : (
            <button type="button" className={styles.more} aria-label={data?.label} data-tip={data?.label}>
              ···
            </button>
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  )
}

export default FlowEdge
