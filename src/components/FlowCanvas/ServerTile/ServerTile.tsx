import type { FlowTile } from '@/shared/types'
import styles from './ServerTile.module.css'

type ServerTileProps = {
  tile: FlowTile
  x: number
  enter: boolean
  call: string | null
  open: boolean
  onClick: () => void
}

const ServerTile = ({ tile, x, enter, call, open, onClick }: ServerTileProps) => {
  const Icon = tile.icon

  return (
    <div className={`${styles.tile} ${enter ? styles.enter : ''} ${call ? styles.active : ''} ${open ? styles.open : ''}`} style={{ left: x }}>
      <button className={styles.button} onClick={onClick} aria-label={tile.server}>
        <Icon style={{ color: tile.color }} />
      </button>
      <span className={styles.name}>{tile.server}</span>

      {call && <span className={styles.tooltip}>{call}</span>}

      {open && (
        <ul className={styles.popover}>
          {tile.tools.map((tool) => (
            <li key={tool}>{tool}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default ServerTile
