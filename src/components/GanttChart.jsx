import { useEffect, useRef } from 'react'
import { processColor } from '../colors.js'

const EDGE_GAP = 24

/**
 * Renders a Gantt timeline: [{ pid, start, end }], where pid is a process
 * number or "Idle". Block widths are proportional to their duration. Blocks at
 * or after `step` are not reached yet and show as dashed outlines.
 */
export default function GanttChart({ gantt, step }) {
  const scrollRef = useRef(null)

  // Keep the current block in view when the chart is wider than its card.
  // Only the chart scrolls sideways; the page itself does not move.
  useEffect(() => {
    const container = scrollRef.current
    if (!container) return
    const block = container.querySelector('.gantt-current')
    if (!block) {
      container.scrollLeft = 0 // step 0: back to the start
      return
    }
    const left = block.offsetLeft
    const right = left + block.offsetWidth
    const viewLeft = container.scrollLeft
    const viewRight = viewLeft + container.clientWidth
    if (left < viewLeft + EDGE_GAP) {
      container.scrollLeft = Math.max(0, left - EDGE_GAP)
    } else if (right > viewRight - EDGE_GAP) {
      container.scrollLeft = right - container.clientWidth + EDGE_GAP
    }
  }, [step, gantt])

  return (
    <div className="gantt-scroll" ref={scrollRef}>
      <div className="gantt" role="list" aria-label="Gantt chart">
        {gantt.map((block, index) => {
          const isIdle = block.pid === 'Idle'
          const reached = index < step
          const isCurrent = index === step - 1
          const color = isIdle ? null : processColor(block.pid)
          const name = isIdle ? 'Idle' : `P${block.pid}`
          const classes = [
            'gantt-block',
            isIdle && 'gantt-idle',
            !reached && 'gantt-pending',
            isCurrent && 'gantt-current',
          ]
            .filter(Boolean)
            .join(' ')

          return (
            <div
              key={index}
              role="listitem"
              className={classes}
              style={{
                flexGrow: block.end - block.start,
                ...(color && reached ? { background: color.fill, borderColor: color.border } : {}),
              }}
              title={`${name}: ${block.start} to ${block.end}`}
            >
              <span className="gantt-label">{name}</span>
              <span className="gantt-time gantt-time-start">{block.start}</span>
              {index === gantt.length - 1 && <span className="gantt-time gantt-time-end">{block.end}</span>}
            </div>
          )
        })}
      </div>
    </div>
  )
}
