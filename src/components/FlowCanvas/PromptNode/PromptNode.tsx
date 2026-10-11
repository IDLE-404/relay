import { LuSparkles } from 'react-icons/lu'
import { prompt } from '../geometry'
import styles from './PromptNode.module.css'

type PromptNodeProps = {
  text: string
  animate: boolean
}

const PromptNode = ({ text, animate }: PromptNodeProps) => {
  return (
    <div className={styles.node} style={{ left: prompt.x, top: prompt.y, width: prompt.width }}>
      <span className={styles.icon}>
        <LuSparkles />
      </span>
      <span className={animate ? styles.typing : ''}>{text}</span>
    </div>
  )
}

export default PromptNode
