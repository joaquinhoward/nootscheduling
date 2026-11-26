/**
 * Turns raw form strings into processes, with clear error messages.
 *
 * Rules (project template): 1 to 10 processes, Arrival Time a whole number >= 0,
 * Burst Time a whole number >= 1, Time Quantum a whole number >= 1.
 *
 * Every value is also capped at MAX_VALUE so huge inputs get an error message
 * instead of freezing the page (e.g. Round Robin with quantum 1 and a giant burst).
 */

export const MIN_PROCESSES = 1
export const MAX_PROCESSES = 10
export const MAX_VALUE = 1000

const WHOLE_NUMBER = /^-?\d+$/

/**
 * Parses a trimmed whole number. Returns { value } or { problem } where
 * problem is 'required' or 'whole'. Range checks are left to the caller.
 */
function parseWhole(raw) {
  const text = String(raw ?? '').trim()
  if (text === '') return { problem: 'required' }
  if (!WHOLE_NUMBER.test(text)) return { problem: 'whole' }
  return { value: Number(text) }
}

function checkField(raw, label, min, belowMinMessage) {
  const { value, problem } = parseWhole(raw)
  if (problem === 'required') return { error: `${label} is required.` }
  if (problem === 'whole') return { error: `${label} must be a whole number.` }
  if (value < min) return { error: belowMinMessage }
  if (value > MAX_VALUE) return { error: `${label} must be at most ${MAX_VALUE}.` }
  return { value }
}

/**
 * @param {{ arrival: string, burst: string }[]} rows
 * @returns {{ processes: { pid: number, arrival: number, burst: number }[] | null, errors: string[] }}
 */
export function validateProcesses(rows) {
  if (rows.length < MIN_PROCESSES || rows.length > MAX_PROCESSES) {
    return { processes: null, errors: ['Enter between 1 and 10 processes.'] }
  }

  const errors = []
  const processes = rows.map((row, index) => {
    const pid = index + 1
    const arrival = checkField(row.arrival, 'Arrival Time', 0, 'Arrival Time cannot be negative.')
    const burst = checkField(row.burst, 'Burst Time', 1, 'Burst Time must be at least 1.')
    if (arrival.error) errors.push(`P${pid}: ${arrival.error}`)
    if (burst.error) errors.push(`P${pid}: ${burst.error}`)
    return { pid, arrival: arrival.value, burst: burst.value }
  })

  return errors.length > 0 ? { processes: null, errors } : { processes, errors }
}

/**
 * @param {string} raw
 * @returns {{ quantum: number | null, error: string | null }}
 */
export function validateQuantum(raw) {
  const { value, error } = checkField(raw, 'Time Quantum', 1, 'Time Quantum must be at least 1.')
  return error ? { quantum: null, error } : { quantum: value, error: null }
}
