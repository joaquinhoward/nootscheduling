import { describe, it, expect } from 'vitest'
import { validateProcesses, validateQuantum } from './validation.js'

describe('validateProcesses', () => {
  it('parses valid rows, trimming spaces', () => {
    expect(
      validateProcesses([
        { arrival: ' 0 ', burst: '3' },
        { arrival: '2', burst: '1' },
      ]),
    ).toEqual({
      processes: [
        { pid: 1, arrival: 0, burst: 3 },
        { pid: 2, arrival: 2, burst: 1 },
      ],
      errors: [],
    })
  })

  it('rejects fewer than 1 or more than 10 rows', () => {
    expect(validateProcesses([]).errors).toEqual(['Enter between 1 and 10 processes.'])
    const eleven = Array.from({ length: 11 }, () => ({ arrival: '0', burst: '1' }))
    expect(validateProcesses(eleven).errors).toEqual(['Enter between 1 and 10 processes.'])
  })

  it('reports every bad field with its process number', () => {
    const { processes, errors } = validateProcesses([
      { arrival: '', burst: '0' },
      { arrival: '-1', burst: 'abc' },
      { arrival: '2.5', burst: '1e2' },
      { arrival: '+3', burst: '-4' },
    ])
    expect(processes).toBeNull()
    expect(errors).toEqual([
      'P1: Arrival Time is required.',
      'P1: Burst Time must be at least 1.',
      'P2: Arrival Time cannot be negative.',
      'P2: Burst Time must be a whole number.',
      'P3: Arrival Time must be a whole number.',
      'P3: Burst Time must be a whole number.',
      'P4: Arrival Time must be a whole number.',
      'P4: Burst Time must be at least 1.',
    ])
  })
})

describe('validateQuantum', () => {
  it('accepts a whole number of at least 1', () => {
    expect(validateQuantum(' 2 ')).toEqual({ quantum: 2, error: null })
  })

  it('rejects empty, non-whole and values below 1', () => {
    expect(validateQuantum('')).toEqual({ quantum: null, error: 'Time Quantum is required.' })
    expect(validateQuantum('1.5')).toEqual({ quantum: null, error: 'Time Quantum must be a whole number.' })
    expect(validateQuantum('0')).toEqual({ quantum: null, error: 'Time Quantum must be at least 1.' })
    expect(validateQuantum('-2')).toEqual({ quantum: null, error: 'Time Quantum must be at least 1.' })
  })
})
