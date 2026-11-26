import { describe, it, expect } from 'vitest'
import { splitList, validateLists, validateProcesses, validateQuantum } from './validation.js'

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

describe('validateProcesses upper limit', () => {
  it('accepts values up to 1000', () => {
    expect(validateProcesses([{ arrival: '1000', burst: '1000' }]).errors).toEqual([])
  })

  it('rejects values above 1000, including numbers too big to represent', () => {
    expect(
      validateProcesses([
        { arrival: '1001', burst: '1001' },
        { arrival: '9'.repeat(400), burst: '99999999999999999999' },
      ]).errors,
    ).toEqual([
      'P1: Arrival Time must be at most 1000.',
      'P1: Burst Time must be at most 1000.',
      'P2: Arrival Time must be at most 1000.',
      'P2: Burst Time must be at most 1000.',
    ])
  })
})

describe('validateQuantum', () => {
  it('rejects a quantum above 1000', () => {
    expect(validateQuantum('1001')).toEqual({ quantum: null, error: 'Time Quantum must be at most 1000.' })
  })

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

describe('splitList', () => {
  it('splits on spaces and commas, ignoring extras', () => {
    expect(splitList(' 0, 2  4,6, ')).toEqual(['0', '2', '4', '6'])
    expect(splitList('   ')).toEqual([])
  })
})

describe('validateLists', () => {
  it('pairs the lists into processes', () => {
    expect(validateLists('0 2', '5, 3')).toEqual({
      processes: [
        { pid: 1, arrival: 0, burst: 5 },
        { pid: 2, arrival: 2, burst: 3 },
      ],
      errors: { arrival: [], burst: [], general: [] },
    })
  })

  it('asks for both lists when empty', () => {
    expect(validateLists('', ' ').errors).toEqual({
      arrival: ['Enter at least one arrival time.'],
      burst: ['Enter at least one burst time.'],
      general: [],
    })
  })

  it('reports mismatched counts once', () => {
    const { processes, errors } = validateLists('0 1 2 3', '5 3 1')
    expect(processes).toBeNull()
    expect(errors.general).toEqual(['You entered 4 arrival times but 3 burst times.'])
    expect(validateLists('0', '1 2').errors.general).toEqual(['You entered 1 arrival time but 2 burst times.'])
  })

  it('reports each bad value with its position', () => {
    expect(validateLists('0 -1 x', '0 2.5 1001').errors).toEqual({
      arrival: ['Arrival time #2 cannot be negative.', 'Arrival time #3 must be a whole number.'],
      burst: [
        'Burst time #1 must be at least 1.',
        'Burst time #2 must be a whole number.',
        'Burst time #3 must be at most 1000.',
      ],
      general: [],
    })
  })

  it('rejects more than 10 processes', () => {
    const eleven = Array(11).fill('1').join(' ')
    expect(validateLists(eleven, eleven).errors.general).toEqual(['Enter between 1 and 10 processes.'])
  })
})
