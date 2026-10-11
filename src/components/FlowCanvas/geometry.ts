import type { FlowRow } from '@/shared/types'

// Everything is drawn on a fixed 1280x800 canvas and scaled to fit the parent.
export const canvas = { width: 1280, height: 800 }

export const prompt = { x: 80, y: 355, width: 340 }

const splitX = 460
export const pathEndX = 1190
export const rowLeft = 470
const rowGap = 155

// Up to 3 tiles use the wide columns; a 4th tile squeezes them closer.
const wideColumns = [700, 860, 1020]
const tightColumns = [660, 790, 920, 1050]

export const getColumns = (rows: FlowRow[]) =>
  rows.some((row) => row.tiles.length > wideColumns.length) ? tightColumns : wideColumns

// Rows are centered around the prompt: 3 rows → 200, 355, 510.
export const getRowY = (index: number, count: number) => prompt.y + (index - (count - 1) / 2) * rowGap

// Milliseconds. One loop: prompt + 3 steps + hold ≈ 10s.
// The packet travel time (1.1s) lives in FlowPaths.module.css.
export const timing = { prompt: 2000, step: 2200, hold: 1600 }

// Line from the prompt that turns into the row with rounded corners.
export const rowPath = (y: number, endX: number) => {
  const startX = prompt.x + prompt.width
  if (y === prompt.y) return `M ${startX} ${y} H ${endX}`

  const radius = 16
  const direction = y > prompt.y ? 1 : -1

  return [
    `M ${startX} ${prompt.y}`,
    `H ${splitX - radius}`,
    `Q ${splitX} ${prompt.y} ${splitX} ${prompt.y + direction * radius}`,
    `V ${y - direction * radius}`,
    `Q ${splitX} ${y} ${splitX + radius} ${y}`,
    `H ${endX}`,
  ].join(' ')
}
