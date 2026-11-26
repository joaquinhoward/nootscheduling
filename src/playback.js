/**
 * Helpers for stepping through a Gantt timeline one block at a time.
 * Step 0 is "nothing has run yet"; step k means the first k blocks are shown.
 */

/** The time reached after `step` blocks. */
export function timeAtStep(gantt, step) {
  return step === 0 ? 0 : gantt[step - 1].end
}

/** The status line shown under the Gantt chart for a step. */
export function describeStep(gantt, results, step) {
  if (step === 0) return 'Press Play or Next to step through the schedule.'

  const block = gantt[step - 1]
  const prefix = `Step ${step} of ${gantt.length}: `
  if (block.pid === 'Idle') return `${prefix}CPU is idle from ${block.start} to ${block.end}.`

  const name = `P${block.pid}`
  const finishes = results.find((r) => r.pid === block.pid)?.completion === block.end
  return `${prefix}${name} runs from ${block.start} to ${block.end}.${finishes ? ` ${name} finishes.` : ''}`
}
