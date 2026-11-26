import { describe, it, expect } from 'vitest'
import { computeMetrics, round2 } from './metrics.js'

describe('round2', () => {
  it('rounds to 2 decimals', () => {
    expect(round2(19 / 3)).toBe(6.33)
    expect(round2(8)).toBe(8)
    expect(round2(3.5)).toBe(3.5)
  })
})

describe('computeMetrics', () => {
  it('uses the last block for completion and the first block for response, ignoring Idle', () => {
    const processes = [
      { pid: 2, arrival: 0, burst: 3 },
      { pid: 1, arrival: 0, burst: 5 },
    ]
    const gantt = [
      { pid: 1, start: 0, end: 2 },
      { pid: 2, start: 2, end: 4 },
      { pid: 1, start: 4, end: 6 },
      { pid: 2, start: 6, end: 7 },
      { pid: 1, start: 7, end: 8 },
      { pid: 'Idle', start: 8, end: 9 },
    ]
    const { results, averages } = computeMetrics(processes, gantt)
    expect(results).toEqual([
      { pid: 1, arrival: 0, burst: 5, completion: 8, turnaround: 8, waiting: 3, response: 0 },
      { pid: 2, arrival: 0, burst: 3, completion: 7, turnaround: 7, waiting: 4, response: 2 },
    ])
    expect(averages).toEqual({ turnaround: 7.5, waiting: 3.5, response: 1 })
  })

  it('handles a very long timeline without overflowing the call stack', () => {
    const slices = 200000
    const gantt = Array.from({ length: slices }, (_, i) => ({ pid: 1, start: i, end: i + 1 }))
    const { results } = computeMetrics([{ pid: 1, arrival: 0, burst: slices }], gantt)
    expect(results[0].completion).toBe(slices)
    expect(results[0].response).toBe(0)
  })
})
