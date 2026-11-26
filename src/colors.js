// One color per process, used in both the Gantt chart and the results table.
const PALETTE = [
  { fill: '#dce8fd', border: '#3b78e7' }, // blue
  { fill: '#fde1de', border: '#d9493f' }, // red
  { fill: '#fdf0c4', border: '#d39b00' }, // amber
  { fill: '#d6f1e1', border: '#1b9354' }, // green
  { fill: '#eadffa', border: '#8650d4' }, // purple
  { fill: '#fde3cc', border: '#e0731a' }, // orange
  { fill: '#d3eff3', border: '#148a99' }, // teal
  { fill: '#fbdbe9', border: '#cc3a80' }, // pink
  { fill: '#e6eacb', border: '#76851b' }, // olive
  { fill: '#e0e4eb', border: '#56627a' }, // slate
]

/** @param {number} pid 1-based process number */
export function processColor(pid) {
  return PALETTE[(pid - 1) % PALETTE.length]
}
