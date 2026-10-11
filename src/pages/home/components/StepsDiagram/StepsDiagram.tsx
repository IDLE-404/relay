import styles from './StepsDiagram.module.css'

type StepsDiagramProps = {
  active: number
  drawn: boolean
  showResult: boolean
  orchestrator: string
  result: string
}

// viewBox units. The container keeps the same 8:5 ratio, so HTML labels can use percentages.
const width = 800
const height = 500
const point = { x: 480, y: 250 } // convergence, 60% of the width
const lineEnd = 600
const linesPerStep = 4
const lineCount = 16

const curve = (index: number) => {
  const y = 30 + (index * (height - 60)) / (lineCount - 1)
  return `M 0 ${y} C 240 ${y}, 300 ${point.y}, ${point.x} ${point.y}`
}

const lines = Array.from({ length: lineCount }, (_, index) => ({
  d: curve(index),
  step: Math.floor(index / linesPerStep),
}))

const StepsDiagram = ({ active, drawn, showResult, orchestrator, result }: StepsDiagramProps) => {
  const lastStep = active === 3
  const isLit = (step: number) => lastStep || step === active

  return (
    <div className={`${styles.diagram} ${drawn ? styles.drawn : ''}`}>
      <svg className={styles.svg} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet" aria-hidden>
        {lines.map((line, index) => (
          <path
            key={index}
            d={line.d}
            pathLength={1}
            className={`${styles.line} ${isLit(line.step) ? styles.lit : ''}`}
          />
        ))}

        {/* Dashes flowing toward the orchestrator, only on lit lines. */}
        {lines.map((line, index) =>
          isLit(line.step) ? <path key={`flow-${index}`} d={line.d} pathLength={1} className={styles.flow} /> : null,
        )}

        <path d={`M ${point.x} ${point.y} H ${lineEnd}`} className={`${styles.output} ${lastStep ? styles.lit : ''}`} />
        {lastStep && <circle key={active} cx={point.x} cy={point.y} r={5} className={styles.packet} />}
      </svg>

      <span className={styles.dot} aria-hidden />
      <span className={styles.label}>{orchestrator}</span>

      {showResult && <div className={styles.result}>{result}</div>}
    </div>
  )
}

export default StepsDiagram
