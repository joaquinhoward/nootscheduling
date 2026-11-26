# FCFS and Round Robin — Design (Joaquin's part)

## Intent

The group's CPU Scheduling Simulator (CS 3104N final project) splits the algorithms between members. Joaquin owns
**FCFS** (required core) and **Round Robin** (bonus, +4 pts). These must be simulatable in a React app and must pass
the official test cases run live at the Dec 15 oral defense. Those cases are not published, so correctness is
pinned to the rules in the project template and to the worked examples in the course slides.

Progress Check 1 (Nov 26) asks for "1–10 process UI; working FCFS + basic Gantt chart".

## Goals

- `fcfs` and `roundRobin` as pure JavaScript functions that any React UI can call.
- One output shape for both, so the shared UI (built by a teammate) can render them without special cases.
- Automated tests with hand-checked expected values.
- A simple throwaway test page to run both algorithms in the browser (enough for Progress Check 1).
- The minimal Vite + React project so the code and tests can run (the repo is empty today).

## Non-goals

- The shared input form, shared validation, the real Gantt chart and results table — another member's job.
- Other members' algorithms (SJF, SRTF, Priority, Preemptive Priority, HRRN, MLQ). Git history is audited for
  fair workload, so this part stays inside Joaquin's assignment.
- Deployment, export, animation and comparison bonuses.

## Rules (from the project template)

- 1 to 10 processes. Arrival Time is a whole number ≥ 0, Burst Time is a whole number ≥ 1. Priority is not used by
  FCFS or RR.
- Time is simulated from t = 0. When no process has arrived, the Gantt chart gets an **Idle** block.
- Results per process: Arrival, Burst, Completion, Turnaround, Waiting. Averages are rounded to 2 decimal places.
  Response time is added as well (a +1–2 bonus item).
- TAT = CT − AT, WT = TAT − BT, RT = first start − AT.

### FCFS

Non-preemptive. The ready process that arrived earliest runs to completion. If two arrive at the same time, the
**lower process number** goes first (template rule). If nothing has arrived, the CPU idles until the next arrival.

### Round Robin

User-set whole-number quantum ≥ 1. The ready queue is FIFO. A process runs for `min(quantum, remaining)`. If it is
unfinished, it goes to the tail of the queue.

**Queue ordering on quantum expiration** (the template asks us to document this): processes that arrive at or
before the moment a quantum expires join the queue **before** the preempted process. Processes arriving at the same
time join in lower-process-number order. If the queue is empty, the CPU idles until the next arrival.

Consecutive slices of the same process (for example, when it is the only ready process) stay as separate Gantt
blocks, so each quantum boundary is visible.

## Approaches considered

1. **Each algorithm returns only the Gantt timeline; one shared function computes the metrics.** Teammates write
   less, and every algorithm is measured the same way. Needs agreement on the shared function.
2. **Each algorithm returns its timeline and its own metrics.** Self-contained, but every member repeats the same
   math.

**Chosen:** a mix, since only FCFS and RR are in scope. Each algorithm builds its timeline. One exported helper,
`computeMetrics(processes, gantt)`, turns a timeline into the results table and averages. Both of Joaquin's
algorithms use it, and teammates may reuse it but don't have to.

## Interface

Input process: `{ pid: number, arrival: number, burst: number }` (pid is the process number: 1 → "P1").

```js
fcfs(processes)                 // → SimulationResult
roundRobin(processes, quantum)  // → SimulationResult

SimulationResult = {
  gantt:   [{ pid: number | "Idle", start: number, end: number }],
  results: [{ pid, arrival, burst, completion, turnaround, waiting, response }], // sorted by pid
  averages: { turnaround, waiting, response }  // numbers rounded to 2 decimals
}
```

The functions assume valid input. Input validation (`validateProcesses`, `validateQuantum`) is a separate small
module that the test page uses and that the shared UI can reuse.

## Test page

A single React page (`App.jsx`) with: a process count (1–10), a row per process (Arrival, Burst), an algorithm
dropdown (FCFS / Round Robin), a quantum field shown for RR, Run and Reset buttons, error messages, a plain CSS
Gantt chart with Idle blocks, and a results table with averages. It is meant to be replaced by the shared UI.

## Test cases (hand-computed)

- FCFS slide: P1(2,6) P2(5,3) P3(1,8) P4(0,3) P5(4,4) → P4 0–3, P3 3–11, P1 11–17, P5 17–21, P2 21–24; avg WT 8.00.
- FCFS reviewer Q44: P1(0,24) P2(0,3) P3(0,3) → avg WT 17.00.
- FCFS tie on arrival: lower process number first.
- FCFS idle gap: P1(0,2) P2(5,3) → P1 0–2, Idle 2–5, P2 5–8.
- RR slide, q = 2: P1(0,5) P2(0,3) → P1 0–2, P2 2–4, P1 4–6, P2 6–7, P1 7–8.
- RR arrival exactly at quantum expiry: the new arrival goes ahead of the preempted process.
- RR idle gap, and RR with a quantum larger than every burst (must equal FCFS).
- Validation: empty, negative, non-numeric, zero burst, more than 10 processes, zero quantum.

## Left to the builder

File layout, styling of the test page, test file names.
