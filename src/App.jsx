import { useEffect, useState } from 'react'
import { fcfs } from './algorithms/fcfs.js'
import { roundRobin } from './algorithms/roundRobin.js'
import { validateLists, validateQuantum } from './algorithms/validation.js'
import { randomProcesses } from './data/randomProcesses.js'
import { EXAMPLES } from './data/examples.js'
import { describeStep, timeAtStep } from './playback.js'
import ControlsCard from './components/ControlsCard.jsx'
import AlgorithmDetails from './components/AlgorithmDetails.jsx'
import StatCards from './components/StatCards.jsx'
import PlaybackBar from './components/PlaybackBar.jsx'
import GanttChart from './components/GanttChart.jsx'
import ResultsTable from './components/ResultsTable.jsx'
import ThemeToggle from './components/ThemeToggle.jsx'
import './App.css'

// Test page for FCFS and Round Robin. The shared UI may replace it.

const DEFAULT_QUANTUM = '2'
const STEP_MS = 700
const NO_ERRORS = { arrival: [], burst: [], general: [], quantum: null }
const ALGORITHM_NAMES = { fcfs: 'First-Come, First-Served', rr: 'Round Robin' }

export default function App() {
  const [algorithm, setAlgorithm] = useState('fcfs')
  const [quantum, setQuantum] = useState(DEFAULT_QUANTUM)
  const [arrival, setArrival] = useState('')
  const [burst, setBurst] = useState('')
  const [errors, setErrors] = useState(NO_ERRORS)
  const [output, setOutput] = useState(null)
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(false)

  const total = output ? output.gantt.length : 0
  const isPlaying = playing && step < total

  // Advance one block every STEP_MS while playing; stops by itself at the last step.
  useEffect(() => {
    if (!isPlaying) return undefined
    const id = setInterval(() => setStep((s) => Math.min(s + 1, total)), STEP_MS)
    return () => clearInterval(id)
  }, [isPlaying, total])

  // Runs the simulation from explicit values, so Random and Examples can run in
  // the same click that fills the fields.
  const simulate = (values) => {
    const { processes, errors: listErrors } = validateLists(values.arrival, values.burst)
    const checked = values.algorithm === 'rr' ? validateQuantum(values.quantum) : { quantum: null, error: null }
    setPlaying(false)

    if (!processes || checked.error) {
      setErrors({ ...listErrors, quantum: checked.error })
      setOutput(null)
      return
    }

    const result = values.algorithm === 'rr' ? roundRobin(processes, checked.quantum) : fcfs(processes)
    setErrors(NO_ERRORS)
    setOutput({ algorithm: values.algorithm, quantum: checked.quantum, ...result })
    setStep(result.gantt.length)
  }

  // Any edit hides results and errors that no longer match the inputs.
  const edit = (setter) => (value) => {
    setter(value)
    setOutput(null)
    setErrors(NO_ERRORS)
    setPlaying(false)
  }

  const fill = (values) => {
    setAlgorithm(values.algorithm)
    setQuantum(values.quantum)
    setArrival(values.arrival)
    setBurst(values.burst)
    simulate(values)
  }

  const runRandom = () => fill({ algorithm, quantum, ...randomProcesses() })

  const reset = () => {
    setAlgorithm('fcfs')
    setQuantum(DEFAULT_QUANTUM)
    setArrival('')
    setBurst('')
    setErrors(NO_ERRORS)
    setOutput(null)
    setPlaying(false)
  }

  const play = () => {
    if (step >= total) setStep(0)
    setPlaying(true)
  }

  const goTo = (next) => {
    setPlaying(false)
    setStep(Math.max(0, Math.min(next, total)))
  }

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">CS 3104N · Operating Systems</p>
          <h1>CPU Scheduling Simulator</h1>
          <p className="lead">
            Enter your processes, pick an algorithm, and watch the schedule play out step by step.
          </p>
        </div>
        <ThemeToggle />
      </header>

      <div className="layout">
        <aside className="side">
          <ControlsCard
            algorithm={algorithm}
            quantum={quantum}
            arrival={arrival}
            burst={burst}
            errors={errors}
            onAlgorithm={(id) => {
              // Clicking the algorithm that is already selected keeps the results.
              if (id !== algorithm) edit(setAlgorithm)(id)
            }}
            onQuantum={edit(setQuantum)}
            onArrival={edit(setArrival)}
            onBurst={edit(setBurst)}
            onRun={() => simulate({ algorithm, quantum, arrival, burst })}
            onRandom={runRandom}
            onExample={fill}
            onReset={reset}
          />
          <AlgorithmDetails algorithm={algorithm} />
        </aside>

        <main className="main">
          {output ? (
            <>
              <StatCards averages={output.averages} visible={step === total} />

              <section className="card" aria-labelledby="gantt-title">
                <div className="card-head">
                  <h2 className="card-title" id="gantt-title">
                    Gantt chart
                  </h2>
                  <span className="chip">
                    {ALGORITHM_NAMES[output.algorithm]}
                    {output.algorithm === 'rr' && ` · q = ${output.quantum}`}
                  </span>
                </div>
                <p className="status" aria-live="polite">
                  {describeStep(output.gantt, output.results, step)}
                </p>
                <GanttChart gantt={output.gantt} step={step} />
                <PlaybackBar
                  step={step}
                  total={total}
                  playing={isPlaying}
                  onPlay={play}
                  onPause={() => setPlaying(false)}
                  onPrev={() => goTo(step - 1)}
                  onNext={() => goTo(step + 1)}
                  onSeek={goTo}
                />
              </section>

              <section className="card" aria-labelledby="results-title">
                <h2 className="card-title" id="results-title">
                  Results
                </h2>
                <ResultsTable
                  results={output.results}
                  averages={output.averages}
                  time={timeAtStep(output.gantt, step)}
                  complete={step === total}
                />
              </section>
            </>
          ) : (
            <section className="card empty">
              <div className="empty-art" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
              <h2>No schedule yet</h2>
              <p className="muted">
                Type arrival and burst times in Controls and press Enter, or start from a ready-made set.
              </p>
              <div className="button-row center">
                <button type="button" className="btn btn-primary" onClick={runRandom}>
                  Try random processes
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => fill(EXAMPLES[0])}>
                  Load lecture example
                </button>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  )
}
