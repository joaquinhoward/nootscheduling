import { describe, it, expect } from 'vitest'
import { randomProcesses } from './randomProcesses.js'
import { validateLists } from '../algorithms/validation.js'

describe('randomProcesses', () => {
  it('uses the low end of every range', () => {
    expect(randomProcesses(() => 0)).toEqual({ arrival: '0 0 0', burst: '1 1 1' })
  })

  it('uses the high end of every range', () => {
    expect(randomProcesses(() => 0.999)).toEqual({
      arrival: '10 10 10 10 10 10',
      burst: '10 10 10 10 10 10',
    })
  })

  it('always produces valid input', () => {
    for (let i = 0; i < 200; i += 1) {
      const { arrival, burst } = randomProcesses()
      expect(validateLists(arrival, burst).processes).not.toBeNull()
    }
  })
})
