import { LuHash, LuMousePointer2 } from 'react-icons/lu'
import styles from './FigmaChrome.module.css'

type FigmaChromeProps = {
  title: string
  cursor: { x: number; y: number; label: string }
}

const FigmaChrome = ({ title, cursor }: FigmaChromeProps) => {
  return (
    <>
      <span className={styles.label}>
        <LuHash /> {title}
      </span>

      <div className={styles.selection}>
        <i />
        <i />
        <i />
        <i />
      </div>

      <div className={styles.cursor} style={{ transform: `translate(${cursor.x}px, ${cursor.y}px)` }}>
        <LuMousePointer2 className={styles.pointer} />
        <span className={styles.name}>{cursor.label}</span>
      </div>
    </>
  )
}

export default FigmaChrome
