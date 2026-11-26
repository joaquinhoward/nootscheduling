import { describe, it, expect } from 'vitest'
import { roundRobin } from './roundRobin.js'
import { fcfs } from './fcfs.js'

describe('roundRobin', () => {
  it('matches the lecture slide example (q = 2)', () => {
    const { gantt, averages } = roundRobin(
      [
        { pid: 1, arrival: 0, burst: 5 },
        { pid: 2, arrival: 0, burst: 3 },
      ],
      2,
    )
    expect(gantt).toEqual([
      { pid: 1, start: 0, end: 2 },
      { pid: 2, start: 2, end: 4 },
      { pid: 1, start: 4, end: 6 },
      { pid: 2, start: 6, end: 7 },
      { pid: 1, start: 7, end: 8 },
    ])
    expect(averages).toEqual({ turnaround: 7.5, waiting: 3.5, response: 1 })
  })

  it('queues a process arriving exactly at slice end before the preempted one', () => {
    const { gantt } = roundRobin(
      [
        { pid: 1, arrival: 0, burst: 4 },
        { pid: 2, arrival: 2, burst: 2 },
      ],
      2,
    )
    expect(gantt).toEqual([
      { pid: 1, start: 0, end: 2 },
      { pid: 2, start: 2, end: 4 },
      { pid: 1, start: 4, end: 6 },
    ])
  })

  it('handles staggered arrivals during a slice', () => {
    const { gantt, results, averages } = roundRobin(
      [
        { pid: 3, arrival: 2, burst: 1 },
        { pid: 1, arrival: 0, burst: 5 },
        { pid: 2, arrival: 1, burst: 3 },
      ],
      2,
    )
    expect(gantt).toEqual([
      { pid: 1, start: 0, end: 2 },
      { pid: 2, start: 2, end: 4 },
      { pid: 3, start: 4, end: 5 },
      { pid: 1, start: 5, end: 7 },
      { pid: 2, start: 7, end: 8 },
      { pid: 1, start: 8, end: 9 },
    ])
    expect(results.map((r) => [r.pid, r.completion, r.waiting, r.response])).toEqual([
      [1, 9, 4, 0],
      [2, 8, 4, 1],
      [3, 5, 2, 2],
    ])
    expect(averages).toEqual({ turnaround: 6.33, waiting: 3.33, response: 1 })
  })

  it('idles between arrivals and keeps each slice as its own block', () => {
    expect(
      roundRobin(
        [
          { pid: 1, arrival: 0, burst: 1 },
          { pid: 2, arrival: 4, burst: 3 },
        ],
        2,
      ).gantt,
    ).toEqual([
      { pid: 1, start: 0, end: 1 },
      { pid: 'Idle', start: 1, end: 4 },
      { pid: 2, start: 4, end: 6 },
      { pid: 2, start: 6, end: 7 },
    ])
  })

  it('starts with Idle when the first arrival is after 0', () => {
    expect(roundRobin([{ pid: 1, arrival: 2, burst: 1 }], 3).gantt).toEqual([
      { pid: 'Idle', start: 0, end: 2 },
      { pid: 1, start: 2, end: 3 },
    ])
  })

  it('equals FCFS when the quantum is larger than every burst', () => {
    const slide = [
      { pid: 1, arrival: 2, burst: 6 },
      { pid: 2, arrival: 5, burst: 3 },
      { pid: 3, arrival: 1, burst: 8 },
      { pid: 4, arrival: 0, burst: 3 },
      { pid: 5, arrival: 4, burst: 4 },
    ]
    expect(roundRobin(slide, 100)).toEqual(fcfs(slide))
  })

  it('does not mutate its input', () => {
    const input = [
      { pid: 2, arrival: 0, burst: 3 },
      { pid: 1, arrival: 0, burst: 5 },
    ]
    const copy = input.map((p) => ({ ...p }))
    roundRobin(input, 2)
    expect(input).toEqual(copy)
  })
})
