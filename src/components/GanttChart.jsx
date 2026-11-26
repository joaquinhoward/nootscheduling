/**
 * Renders a Gantt timeline: [{ pid, start, end }], where pid is a process
 * number or "Idle". Block widths are proportional to their duration.
 */
export default function GanttChart({ gantt }) {
  return (
    <div className="gantt" role="list" aria-label="Gantt chart">
      {gantt.map((block, index) => {
        const isIdle = block.pid === 'Idle'
        const isLast = index === gantt.length - 1
        return (
          <div
            key={`${block.pid}-${block.start}`}
            role="listitem"
            className={`gantt-block${isIdle ? ' gantt-idle' : ''}`}
            style={{ flexGrow: block.end - block.start }}
            title={`${isIdle ? 'Idle' : `P${block.pid}`}: ${block.start} to ${block.end}`}
          >
            <span className="gantt-label">{isIdle ? 'Idle' : `P${block.pid}`}</span>
            <span className="gantt-time gantt-time-start">{block.start}</span>
            {isLast && <span className="gantt-time gantt-time-end">{block.end}</span>}
          </div>
        )
      })}
    </div>
  )
}
