import type { HTMLAttributes } from 'react'
import styles from './Title.module.css'

const Title = ({ className = '', ...props }: HTMLAttributes<HTMLHeadingElement>) => {
  return <h2 className={`${styles.title} ${className}`} {...props} />
}

export default Title
