import { computeMetrics } from './metrics.js'

/**
 * Round Robin (preemptive) with a user-set time quantum.
 *
 * The ready queue is FIFO. Each process runs for min(quantum, remaining time).
 *
 * Queue ordering on quantum expiration: processes that arrive at or before the
 * moment a slice ends join the queue BEFORE the preempted process, which then
 * goes to the tail. Processes arriving at the same time join in lower process
 * number order. When the queue is empty, the CPU is Idle until the next arrival.
 *
 * Each slice is its own Gantt block, even when the same process runs again.
 *
 * @param {{ pid: number, arrival: number, burst: number }[]} processes
 * @param {number} quantum whole number >= 1
 */
export function roundRobin(processes, quantum) {
  const sorted = [...processes].sort((a, b) => a.arrival - b.arrival || a.pid - b.pid)
  const remaining = new Map(sorted.map((p) => [p.pid, p.burst]))
  const queue = []
  const gantt = []
  let time = 0
  let next = 0 // index of the next process in `sorted` that has not arrived yet

  const admitArrivalsUpTo = (t) => {
    while (next < sorted.length && sorted[next].arrival <= t) {
      queue.push(sorted[next])
      next += 1
    }
  }

  admitArrivalsUpTo(time)

  while (queue.length > 0 || next < sorted.length) {
    if (queue.length === 0) {
      const nextArrival = sorted[next].arrival
      gantt.push({ pid: 'Idle', start: time, end: nextArrival })
      time = nextArrival
      admitArrivalsUpTo(time)
      continue
    }

    const p = queue.shift()
    const run = Math.min(quantum, remaining.get(p.pid))
    gantt.push({ pid: p.pid, start: time, end: time + run })
    time += run
    remaining.set(p.pid, remaining.get(p.pid) - run)

    admitArrivalsUpTo(time) // new arrivals first...
    if (remaining.get(p.pid) > 0) queue.push(p) // ...then the preempted process
  }

  return { gantt, ...computeMetrics(processes, gantt) }
}
