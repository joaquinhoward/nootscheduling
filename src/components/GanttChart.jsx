import { processColor } from '../colors.js'

/**
 * Renders a Gantt timeline: [{ pid, start, end }], where pid is a process
 * number or "Idle". Block widths are proportional to their duration. Blocks at
 * or after `step` are not reached yet and show as dashed outlines.
 */
export default function GanttChart({ gantt, step }) {
  return (
    <div className="gantt-scroll">
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
