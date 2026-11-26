import { computeMetrics } from './metrics.js'

/**
 * First-Come, First-Served (non-preemptive).
 *
 * Processes run to completion in arrival order. Ties on arrival time go to
 * the lower process number. When no process has arrived yet, the CPU is Idle
 * until the next arrival.
 *
 * @param {{ pid: number, arrival: number, burst: number }[]} processes
 */
export function fcfs(processes) {
  const order = [...processes].sort((a, b) => a.arrival - b.arrival || a.pid - b.pid)
  const gantt = []
  let time = 0

  for (const p of order) {
    if (time < p.arrival) {
      gantt.push({ pid: 'Idle', start: time, end: p.arrival })
      time = p.arrival
    }
    gantt.push({ pid: p.pid, start: time, end: time + p.burst })
    time += p.burst
  }

  return { gantt, ...computeMetrics(processes, gantt) }
}
