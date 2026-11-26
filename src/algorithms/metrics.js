/**
 * Shared metric calculations for any scheduling algorithm.
 *
 * Every algorithm produces a Gantt timeline: [{ pid, start, end }], where
 * pid is a process number or "Idle". computeMetrics turns that timeline into
 * the per-process results table and the averages.
 */

export function round2(n) {
  return Math.round(n * 100) / 100
}

/**
 * @param {{ pid: number, arrival: number, burst: number }[]} processes
 * @param {{ pid: number | 'Idle', start: number, end: number }[]} gantt
 */
export function computeMetrics(processes, gantt) {
  const results = [...processes]
    .sort((a, b) => a.pid - b.pid)
    .map(({ pid, arrival, burst }) => {
      // A loop instead of Math.min(...spread): long timelines would overflow the call stack.
      let firstStart = Infinity
      let completion = -Infinity
      for (const block of gantt) {
        if (block.pid !== pid) continue
        firstStart = Math.min(firstStart, block.start)
        completion = Math.max(completion, block.end)
      }
      const turnaround = completion - arrival // TAT = CT - AT
      const waiting = turnaround - burst // WT = TAT - BT
      const response = firstStart - arrival // RT = first start - AT
      return { pid, arrival, burst, completion, turnaround, waiting, response }
    })

  const average = (key) => round2(results.reduce((sum, r) => sum + r[key], 0) / results.length)

  return {
    results,
    averages: {
      turnaround: average('turnaround'),
      waiting: average('waiting'),
      response: average('response'),
    },
  }
}
