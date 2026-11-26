import { describe, it, expect } from 'vitest'
import { fcfs } from './fcfs.js'

const slide = [
  { pid: 1, arrival: 2, burst: 6 },
  { pid: 2, arrival: 5, burst: 3 },
  { pid: 3, arrival: 1, burst: 8 },
  { pid: 4, arrival: 0, burst: 3 },
  { pid: 5, arrival: 4, burst: 4 },
]

describe('fcfs', () => {
  it('matches the lecture slide example (avg WT 8.00)', () => {
    const { gantt, results, averages } = fcfs(slide)
    expect(gantt).toEqual([
      { pid: 4, start: 0, end: 3 },
      { pid: 3, start: 3, end: 11 },
      { pid: 1, start: 11, end: 17 },
      { pid: 5, start: 17, end: 21 },
      { pid: 2, start: 21, end: 24 },
    ])
    expect(results.map((r) => [r.pid, r.completion, r.turnaround, r.waiting])).toEqual([
      [1, 17, 15, 9],
      [2, 24, 19, 16],
      [3, 11, 10, 2],
      [4, 3, 3, 0],
      [5, 21, 17, 13],
    ])
    expect(averages).toEqual({ turnaround: 12.8, waiting: 8, response: 8 })
  })

  it('matches reviewer Q44 (avg WT 17.00)', () => {
    const { averages } = fcfs([
      { pid: 1, arrival: 0, burst: 24 },
      { pid: 2, arrival: 0, burst: 3 },
      { pid: 3, arrival: 0, burst: 3 },
    ])
    expect(averages.waiting).toBe(17)
    expect(averages.turnaround).toBe(27)
  })

  it('breaks arrival ties by lower process number', () => {
    const { gantt } = fcfs([
      { pid: 2, arrival: 0, burst: 3 },
      { pid: 1, arrival: 0, burst: 2 },
    ])
    expect(gantt).toEqual([
      { pid: 1, start: 0, end: 2 },
      { pid: 2, start: 2, end: 5 },
    ])
  })

  it('adds an Idle block when no process has arrived', () => {
    const { gantt, results } = fcfs([
      { pid: 1, arrival: 0, burst: 2 },
      { pid: 2, arrival: 5, burst: 3 },
    ])
    expect(gantt).toEqual([
      { pid: 1, start: 0, end: 2 },
      { pid: 'Idle', start: 2, end: 5 },
      { pid: 2, start: 5, end: 8 },
    ])
    expect(results[1].waiting).toBe(0)
  })

  it('starts with Idle when the first arrival is after 0', () => {
    expect(fcfs([{ pid: 1, arrival: 3, burst: 2 }]).gantt).toEqual([
      { pid: 'Idle', start: 0, end: 3 },
      { pid: 1, start: 3, end: 5 },
    ])
  })

  it('does not mutate its input', () => {
    const input = slide.map((p) => ({ ...p }))
    fcfs(input)
    expect(input).toEqual(slide)
  })
})
