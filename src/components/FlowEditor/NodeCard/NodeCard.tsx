import type { CSSProperties, ReactNode } from 'react'
import type { IconType } from 'react-icons'
import { LuEllipsisVertical } from 'react-icons/lu'
import type { NodeStatus } from '../editorState'
import styles from './NodeCard.module.css'

export type Tag = 'read' | 'write' | 'approval'

const tagClass: Record<Tag, string> = { read: styles.tagRead, write: styles.tagWrite, approval: styles.tagApproval }

type NodeCardProps = {
  icon: IconType
  iconColor: string
  title: string
  description: string
  tags?: Tag[]
  status?: NodeStatus
  statusLabel?: string
  selected?: boolean
  approval?: boolean // amber border: this node needs approval
  dimmed?: boolean
  menuLabel?: string
  onMenu?: (anchor: HTMLElement) => void
  children?: ReactNode
}

// Card used for every node, on the canvas and in the mobile list.
const NodeCard = ({
  icon: Icon,
  iconColor,
  title,
  description,
  tags = [],
  status,
  statusLabel,
  selected,
  approval,
  dimmed,
  menuLabel,
  onMenu,
  children,
}: NodeCardProps) => {
  const classes = [styles.card, selected && styles.selected, approval && styles.approval, dimmed && styles.dimmed]

  return (
    <div className={classes.filter(Boolean).join(' ')} style={{ '--icon': iconColor } as CSSProperties}>
      <div className={styles.header}>
        <span className={styles.icon}>
          <Icon aria-hidden />
        </span>
        <span className={styles.title}>{title}</span>
        {onMenu && (
          <button
            type="button"
            className={`${styles.menu} nodrag`}
            aria-label={menuLabel}
            aria-haspopup="menu"
            onClick={(event) => {
              event.stopPropagation()
              onMenu(event.currentTarget)
            }}
          >
            <LuEllipsisVertical aria-hidden />
          </button>
        )}
      </div>

      <p className={styles.description}>{description}</p>

      {(tags.length > 0 || status) && (
        <div className={styles.footer}>
          {tags.map((tag) => (
            <span key={tag} className={`${styles.tag} ${tagClass[tag]}`}>
              #{tag}
            </span>
          ))}
          {status && <span className={`${styles.status} ${styles[status]}`}>{statusLabel}</span>}
        </div>
      )}

      {children}
    </div>
  )
}

export default NodeCard
