/**
 * Ready-made process sets for the Examples menu. Each one fills the inputs
 * and runs in a single click.
 */
export const EXAMPLES = [
  {
    id: 'lecture-fcfs',
    label: 'Lecture FCFS example',
    algorithm: 'fcfs',
    quantum: '2',
    arrival: '2 5 1 0 4',
    burst: '6 3 8 3 4',
  },
  {
    id: 'lecture-rr',
    label: 'Lecture Round Robin example (q = 2)',
    algorithm: 'rr',
    quantum: '2',
    arrival: '0 0',
    burst: '5 3',
  },
  {
    id: 'idle-gap',
    label: 'Idle CPU gap',
    algorithm: 'fcfs',
    quantum: '2',
    arrival: '0 6 7',
    burst: '3 2 4',
  },
  {
    id: 'rr-arrivals',
    label: 'Arrivals during a quantum (q = 2)',
    algorithm: 'rr',
    quantum: '2',
    arrival: '0 1 2',
    burst: '5 3 1',
  },
]
