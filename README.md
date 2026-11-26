# nootscheduling

CPU Scheduling Simulator for CS 3104N (Operating Systems), built with React and Vite.

## Running it

Requires Node.js 20 or newer.

```bash
npm install     # once
npm run dev     # start the simulator at http://localhost:5173
npm test        # run the algorithm tests
npm run build   # production build in dist/
```

## Algorithms

| Algorithm | File | Status |
|-----------|------|--------|
| First-Come, First-Served (FCFS) | `src/algorithms/fcfs.js` | Done |
| Round Robin (RR) — bonus | `src/algorithms/roundRobin.js` | Done |

### FCFS

Non-preemptive. Processes run to completion in arrival order. When two processes arrive at the same time, the lower
process number goes first. When no process has arrived yet, the CPU is **Idle** until the next arrival.

### Round Robin

Preemptive, with a user-set time quantum (a whole number of at least 1). The ready queue is first-in, first-out, and
each process runs for the quantum or its remaining time, whichever is shorter.

**Queue ordering on quantum expiration:** processes that arrive at or before the moment a slice ends join the queue
**before** the preempted process, which then goes to the back. Processes arriving at the same time join in lower
process number order. When the queue is empty, the CPU is Idle until the next arrival. Each slice is its own block in
the Gantt chart, even when the same process runs again right away.

## Adding an algorithm

Every algorithm takes processes and returns the same result shape, so the UI can display any of them.

```js
// input
[{ pid: 1, arrival: 0, burst: 5 }, ...]

// output
{
  gantt:    [{ pid: 1, start: 0, end: 2 }, { pid: 'Idle', start: 2, end: 4 }, ...],
  results:  [{ pid, arrival, burst, completion, turnaround, waiting, response }, ...], // sorted by pid
  averages: { turnaround, waiting, response }  // rounded to 2 decimals
}
```

Build the `gantt` timeline, then call `computeMetrics(processes, gantt)` from `src/algorithms/metrics.js` to get
`results` and `averages`:

```js
import { computeMetrics } from './metrics.js'

export function myAlgorithm(processes) {
  const gantt = [] // ...fill in the timeline
  return { gantt, ...computeMetrics(processes, gantt) }
}
```

Input validation (1–10 processes, Arrival Time ≥ 0, Burst Time ≥ 1, Time Quantum ≥ 1, whole numbers, every value at
most 1000 so huge inputs cannot freeze the page) is in `src/algorithms/validation.js`.

Formulas: Turnaround = Completion − Arrival, Waiting = Turnaround − Burst, Response = First start − Arrival.

## Test page

`src/App.jsx` is the test page for FCFS and Round Robin:

- **Arrival times** and **Burst times** are typed as lists, e.g. `0 2 4 6` and `5 3 1 2` (spaces or commas).
  Value *i* of each list becomes process P*i*. Press Enter in any field to run.
- **Random** fills in 3–6 random processes and runs them. **Load an example** runs a ready-made set (lecture
  examples, an idle gap, arrivals during a quantum).
- Errors appear under the field they belong to.
- After a run, **Play**, **Prev**, **Next** and the slider step through the Gantt chart one block at a time. The
  results table fills in as each process finishes, and the averages appear at the last step.
