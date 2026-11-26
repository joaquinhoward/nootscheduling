import { useState } from 'react'
import { fcfs } from './algorithms/fcfs.js'
import { roundRobin } from './algorithms/roundRobin.js'
import {
  MAX_PROCESSES,
  MIN_PROCESSES,
  validateProcesses,
  validateQuantum,
} from './algorithms/validation.js'
import GanttChart from './components/GanttChart.jsx'
import ResultsTable from './components/ResultsTable.jsx'
import './App.css'

// Throwaway test page for FCFS and Round Robin. The shared UI replaces it.

const DEFAULT_COUNT = 3
const DEFAULT_QUANTUM = '2'
const emptyRow = () => ({ arrival: '', burst: '' })
const emptyRows = (count) => Array.from({ length: count }, emptyRow)
const COUNT_OPTIONS = Array.from(
  { length: MAX_PROCESSES - MIN_PROCESSES + 1 },
  (_, i) => MIN_PROCESSES + i,
)

const ALGORITHMS = {
  fcfs: { label: 'First-Come, First-Served (FCFS)' },
  rr: { label: 'Round Robin (RR)' },
}

export default function App() {
  const [rows, setRows] = useState(() => emptyRows(DEFAULT_COUNT))
  const [algorithm, setAlgorithm] = useState('fcfs')
  const [quantum, setQuantum] = useState(DEFAULT_QUANTUM)
  const [errors, setErrors] = useState([])
  const [output, setOutput] = useState(null)

  // Any input change hides results that no longer match the inputs.
  const edit = (apply) => {
    apply()
    setOutput(null)
  }

  const changeCount = (count) =>
    edit(() =>
      setRows((current) =>
        count <= current.length
          ? current.slice(0, count)
          : [...current, ...emptyRows(count - current.length)],
      ),
    )

  const changeCell = (index, field, value) =>
    edit(() =>
      setRows((current) => current.map((row, i) => (i === index ? { ...row, [field]: value } : row))),
    )

  const run = () => {
    const { processes, errors: rowErrors } = validateProcesses(rows)
    const allErrors = [...rowErrors]
    let q = null
    if (algorithm === 'rr') {
      const checked = validateQuantum(quantum)
      if (checked.error) allErrors.push(checked.error)
      q = checked.quantum
    }

    if (allErrors.length > 0) {
      setErrors(allErrors)
      setOutput(null)
      return
    }

    setErrors([])
    setOutput({
      algorithm,
      quantum: q,
      ...(algorithm === 'rr' ? roundRobin(processes, q) : fcfs(processes)),
    })
  }

  const reset = () => {
    setRows(emptyRows(DEFAULT_COUNT))
    setAlgorithm('fcfs')
    setQuantum(DEFAULT_QUANTUM)
    setErrors([])
    setOutput(null)
  }

  return (
    <main className="app">
      <h1>CPU Scheduling Simulator</h1>
      <p className="subtitle">Test page for FCFS and Round Robin</p>

      <form
        className="controls"
        onSubmit={(event) => {
          event.preventDefault()
          run()
        }}
      >
        <div className="field-row">
          <label>
            Number of processes
            <select value={rows.length} onChange={(e) => changeCount(Number(e.target.value))}>
              {COUNT_OPTIONS.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>

          <label>
            Algorithm
            <select value={algorithm} onChange={(e) => edit(() => setAlgorithm(e.target.value))}>
              {Object.entries(ALGORITHMS).map(([key, { label }]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </label>

          {algorithm === 'rr' && (
            <label>
              Time Quantum
              <input
                className="number"
                inputMode="numeric"
                value={quantum}
                onChange={(e) => edit(() => setQuantum(e.target.value))}
              />
            </label>
          )}
        </div>

        <table className="process-inputs">
          <thead>
            <tr>
              <th scope="col">Process</th>
              <th scope="col">Arrival Time</th>
              <th scope="col">Burst Time</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index}>
                <th scope="row">P{index + 1}</th>
                <td>
                  <input
                    className="number"
                    inputMode="numeric"
                    aria-label={`P${index + 1} Arrival Time`}
                    value={row.arrival}
                    onChange={(e) => changeCell(index, 'arrival', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    className="number"
                    inputMode="numeric"
                    aria-label={`P${index + 1} Burst Time`}
                    value={row.burst}
                    onChange={(e) => changeCell(index, 'burst', e.target.value)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="buttons">
          <button type="submit">Run</button>
          <button type="button" className="secondary" onClick={reset}>
            Reset
          </button>
        </div>
      </form>

      {errors.length > 0 && (
        <div className="errors" role="alert">
          <ul>
            {errors.map((message) => (
              <li key={message}>{message}</li>
            ))}
          </ul>
        </div>
      )}

      {output && (
        <section className="output">
          <h2>
            {ALGORITHMS[output.algorithm].label}
            {output.algorithm === 'rr' && ` — quantum ${output.quantum}`}
          </h2>
          <h3>Gantt Chart</h3>
          <GanttChart gantt={output.gantt} />
          <h3>Results</h3>
          <ResultsTable results={output.results} averages={output.averages} />
        </section>
      )}
    </main>
  )
}
