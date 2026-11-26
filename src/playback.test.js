import { describe, it, expect } from 'vitest'
import { describeStep, timeAtStep } from './playback.js'

const gantt = [
  { pid: 1, start: 0, end: 2 },
  { pid: 'Idle', start: 2, end: 4 },
  { pid: 2, start: 4, end: 6 },
  { pid: 1, start: 6, end: 7 },
]
const results = [
  { pid: 1, completion: 7 },
  { pid: 2, completion: 6 },
]

describe('timeAtStep', () => {
  it('is 0 before the first block and the block end after it', () => {
    expect(timeAtStep(gantt, 0)).toBe(0)
    expect(timeAtStep(gantt, 2)).toBe(4)
    expect(timeAtStep(gantt, 4)).toBe(7)
  })
})

describe('describeStep', () => {
  it('describes each kind of step', () => {
    expect(describeStep(gantt, results, 0)).toBe('Press Play or Next to step through the schedule.')
    expect(describeStep(gantt, results, 1)).toBe('Step 1 of 4: P1 runs from 0 to 2.')
    expect(describeStep(gantt, results, 2)).toBe('Step 2 of 4: CPU is idle from 2 to 4.')
    expect(describeStep(gantt, results, 3)).toBe('Step 3 of 4: P2 runs from 4 to 6. P2 finishes.')
    expect(describeStep(gantt, results, 4)).toBe('Step 4 of 4: P1 runs from 6 to 7. P1 finishes.')
  })
})
