// One accent color per process, used in both the Gantt chart and the results
// table. Gantt blocks tint their background from it in CSS (color-mix), so the
// same palette works in light and dark mode.
const PALETTE = [
  '#3b78e7', // blue
  '#d9493f', // red
  '#d39b00', // amber
  '#1b9354', // green
  '#8650d4', // purple
  '#e0731a', // orange
  '#148a99', // teal
  '#cc3a80', // pink
  '#76851b', // olive
  '#6b7a99', // slate
]

/** @param {number} pid 1-based process number */
export function processColor(pid) {
  return PALETTE[(pid - 1) % PALETTE.length]
}
