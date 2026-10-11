import { useEffect, useRef, useState } from 'react'
import { LuLock } from 'react-icons/lu'
import { useInViewport } from '@/shared/hooks'
import type { Flow } from '@/shared/types'
import FigmaChrome from './FigmaChrome'
import FlowLog from './FlowLog'
import FlowPaths from './FlowPaths'
import PromptNode from './PromptNode'
import ServerTile from './ServerTile'
import { canvas, getColumns, getRowY, prompt, rowLeft, rowPath, timing } from './geometry'
import styles from './FlowCanvas.module.css'

type FlowCanvasProps = {
  flow: Flow
  // autoLoop: plays forever (hero). Otherwise plays once each time `playing` is true.
  autoLoop?: boolean
  playing?: boolean
  onRunEnd?: () => void
  // Must be a stable function (e.g. a useState setter).
  onLog?: (lines: string[]) => void
}

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

const FlowCanvas = ({ flow, autoLoop = false, playing = false, onRunEnd, onLog }: FlowCanvasProps) => {
  // step 0 — prompt is typing, 1..N — server calls, N+1 — done
  const doneStep = flow.steps.length + 1
  const getFirstStep = () => {
    if (!reduced) return 0
    if (autoLoop) return flow.steps.length
    return playing ? doneStep : 0
  }

  const frame = useRef<HTMLDivElement>(null)
  const [step, setStep] = useState(getFirstStep)
  const [loop, setLoop] = useState(0)
  const [hoveredRow, setHoveredRow] = useState<number | null>(null)
  const [openTile, setOpenTile] = useState<string | null>(null)

  // The loop stops while a tile's tool list is open, and while the canvas is off screen or the tab is hidden.
  const { inView } = useInViewport(frame)
  const paused = openTile !== null || !inView
  const running = autoLoop || playing
  const finished = !autoLoop && step === doneStep

  // Scale the 1280x800 canvas to the parent width.
  useEffect(() => {
    const element = frame.current
    if (!element) return

    const observer = new ResizeObserver(() => {
      element.style.setProperty('--scale', String(element.clientWidth / canvas.width))
    })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (reduced || paused || !running || finished) return

    const delay = step === 0 ? timing.prompt : step === doneStep ? timing.hold : timing.step
    const timer = setTimeout(() => {
      if (step === doneStep) {
        setStep(0)
        setLoop(loop + 1)
      } else {
        setStep(step + 1)
      }
    }, delay)

    return () => clearTimeout(timer)
  }, [step, loop, paused, running, finished, doneStep])

  useEffect(() => {
    if (finished && playing) onRunEnd?.()
  }, [finished, playing, onRunEnd])

  const columns = getColumns(flow.rows)
  const rowYs = flow.rows.map((_, index) => getRowY(index, flow.rows.length))

  const findTile = (id: string) => {
    for (const [rowIndex, row] of flow.rows.entries()) {
      const column = row.tiles.findIndex((tile) => tile.id === id)
      if (column !== -1) return { rowIndex, y: rowYs[rowIndex], x: columns[column] }
    }
    return null
  }

  const current = flow.steps[step - 1]
  const target = current ? findTile(current.tileId) : null
  const activeRow = hoveredRow ?? target?.rowIndex ?? null
  const cursor = target
    ? { x: target.x + 30, y: target.y + 30, label: flow.rows[target.rowIndex].agent }
    : { x: prompt.x + prompt.width - 40, y: prompt.y + 30, label: 'Orchestrator' }

  const log = step === 0 ? [] : [`▸ prompt "${flow.prompt}"`]
  flow.steps.slice(0, step).forEach((item) => log.push(`→ ${item.call} · ${item.ms}ms`))
  if (step === doneStep) log.push(flow.done)

  // Report log changes by value, so a new array on every render does not loop.
  const logText = log.join('\n')
  useEffect(() => {
    onLog?.(logText ? logText.split('\n') : [])
  }, [logText, onLog])

  return (
    <div ref={frame} className={styles.frame} onMouseLeave={() => setOpenTile(null)}>
      <div className={`${styles.canvas} ${paused ? styles.paused : ''}`}>
        <div className={styles.placeholders}>
          {Array.from({ length: 25 }, (_, index) => (
            <span key={index} />
          ))}
        </div>

        <FlowPaths
          rowYs={rowYs}
          activeRow={activeRow}
          packet={target && !reduced ? rowPath(target.y, target.x) : null}
          packetKey={`${loop}-${step}`}
        />

        <PromptNode key={loop} text={flow.prompt} animate={!reduced && running} />

        {flow.rows.map((row, rowIndex) => (
          <div
            key={row.agent}
            className={`${styles.row} ${row.tiles.length === 0 ? styles.empty : ''}`}
            style={{ top: rowYs[rowIndex] - 60 }}
            onMouseEnter={() => setHoveredRow(rowIndex)}
            onMouseLeave={() => setHoveredRow(null)}
          >
            <span className={`${styles.agent} ${rowIndex === activeRow ? styles.agentActive : ''}`}>
              {row.agent}
              {row.approval && <LuLock className={styles.lock} aria-label="approval required" />}
            </span>
            {row.tiles.map((tile, column) => (
              <ServerTile
                key={tile.id}
                tile={tile}
                x={columns[column] - rowLeft}
                enter={!autoLoop}
                call={current?.tileId === tile.id ? `${current.call} · ${current.ms}ms` : null}
                open={openTile === tile.id}
                onClick={() => setOpenTile(openTile === tile.id ? null : tile.id)}
              />
            ))}
          </div>
        ))}

        <FigmaChrome title={flow.title} cursor={cursor} />
        <FlowLog lines={log} />
      </div>
    </div>
  )
}

export default FlowCanvas
