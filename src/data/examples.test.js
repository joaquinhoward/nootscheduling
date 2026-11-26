import { describe, it, expect } from 'vitest'
import { EXAMPLES } from './examples.js'
import { validateLists, validateQuantum } from '../algorithms/validation.js'

describe('EXAMPLES', () => {
  it('has the four spec examples', () => {
    expect(EXAMPLES.map((e) => e.id)).toEqual(['lecture-fcfs', 'lecture-rr', 'idle-gap', 'rr-arrivals'])
  })

  it.each(EXAMPLES)('$id is valid input', (example) => {
    expect(validateLists(example.arrival, example.burst).processes).not.toBeNull()
    expect(validateQuantum(example.quantum).error).toBeNull()
  })
})
