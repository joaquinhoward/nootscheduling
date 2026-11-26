# Modern test page with fast input and playback — Design

## Intent

The first test page worked but was tedious: every Arrival and Burst value had to be typed into its own cell. Joaquin
wants it easy to use and modern in feel, inspired by https://algos.dcism.org/ (soft background, rounded translucent
cards, pill buttons, two-column visualizer layout), **without copying its font or exact styling**.

## Goals

- Enter a whole process set in two fields, or in one click (Random, Examples).
- Modern two-column layout: visualization and results on the left, Controls and Algorithm details on the right.
- Step-by-step playback of the Gantt chart (template bonus: "Step-by-Step Gantt Animation", +3 pts).
- Errors shown next to the field they belong to.

## Non-goals

- Copying algos.dcism.org's font, colors or components exactly. Dark mode. Other members' algorithms.
- Changing FCFS, Round Robin, `computeMetrics`, or the 1–10 process and ≤ 1000 limits.

## Approaches considered

1. **List fields (chosen):** "Arrival times" and "Burst times" as space- or comma-separated lists, like common CPU
   scheduling calculators. Fastest to type and paste.
2. **Editable table with keyboard navigation:** familiar, but still one cell per value.
3. **One line per process (`0 5`):** compact, but harder to read and easier to mistype.

Playback was approved by Joaquin. Showing everything at once was the alternative.

## Design

**Input (Controls card)**
- FCFS / Round Robin segmented toggle. Time Quantum field shown only for RR.
- Arrival times and Burst times text fields; tokens split on spaces and commas. Pair *i* becomes process P*i*.
- Buttons: **Run** (primary; Enter in any field also runs), **Random** (3–6 processes, Arrival 0–10, Burst 1–10,
  fills the fields and runs), **Examples** menu (fills and runs), **Reset** (empty fields, FCFS, quantum 2).
- Errors under the field: e.g. "Burst time #3 must be at least 1.", "You entered 4 arrival times but 3 burst times."
  Editing any input clears errors and output.

**Examples:** Lecture FCFS example (`2 5 1 0 4` / `6 3 8 3 4`), Lecture RR example q = 2 (`0 0` / `5 3`),
Idle CPU gap (`0 6 7` / `3 2 4`, FCFS), Arrivals during a quantum q = 2 (`0 1 2` / `5 3 1`, RR).

**Output (left column)**
- Empty state before the first run, pointing at Random and Examples.
- Stat cards: Avg Turnaround, Avg Waiting, Avg Response (shown once playback reaches the end).
- Gantt chart: each process has its own color; Idle is grey and striped; time labels under block edges.
- Playback: after Run, the full chart is shown (step = last). **Play** restarts from step 0 if at the end and
  advances one block every 700 ms; **Prev** / **Next** move one block; a status line reads
  "Step 3 of 6: P1 runs from 4 to 6." (Idle: "CPU is idle from 1 to 4."; when the block finishes a process, add
  "P1 finishes."). Step 0 reads "Press Play or Next to step through the schedule." Blocks not reached yet show as
  dashed outlines.
- Results table: same columns; rows for processes not finished at the current time show "—".
- Algorithm details card: short description, preemptive or not, tie rule, and the RR queue rule.

**Look:** system font stack, off-white background with a faint grid, translucent white cards (radius 16px, thin
border, soft shadow), pill buttons with one blue primary, 10-color process palette. Stacks to one column below 900px
with Controls first.

## Left to the builder

Component split, CSS details, palette values.
