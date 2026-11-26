import { splitList } from '../algorithms/validation.js'
import { EXAMPLES } from '../data/examples.js'

const ALGORITHM_OPTIONS = [
  { id: 'fcfs', label: 'FCFS' },
  { id: 'rr', label: 'Round Robin' },
]

function FieldErrors({ id, messages }) {
  if (messages.length === 0) return null
  return (
    <ul className="field-errors" id={id}>
      {messages.map((message) => (
        <li key={message}>{message}</li>
      ))}
    </ul>
  )
}

function ListField({ id, label, value, onChange, placeholder, errors }) {
  const count = splitList(value).length
  const invalid = errors.length > 0
  return (
    <div className="field">
      <div className="field-label">
        <label htmlFor={id}>{label}</label>
        <span className="chip">{count === 1 ? '1 value' : `${count} values`}</span>
      </div>
      <input
        id={id}
        className="text-input"
        value={value}
        placeholder={placeholder}
        autoComplete="off"
        spellCheck="false"
        aria-invalid={invalid}
        aria-describedby={invalid ? `${id}-errors` : `${id}-hint`}
        onChange={(e) => onChange(e.target.value)}
      />
      {invalid ? (
        <FieldErrors id={`${id}-errors`} messages={errors} />
      ) : (
        <p className="hint" id={`${id}-hint`}>
          Separate values with spaces or commas.
        </p>
      )}
    </div>
  )
}

export default function ControlsCard({
  algorithm,
  quantum,
  arrival,
  burst,
  errors,
  onAlgorithm,
  onQuantum,
  onArrival,
  onBurst,
  onRun,
  onRandom,
  onExample,
  onReset,
}) {
  return (
    <form
      className="card controls"
      onSubmit={(event) => {
        event.preventDefault()
        onRun()
      }}
    >
      <h2 className="card-title">Controls</h2>

      <div className="segmented" role="group" aria-label="Algorithm">
        {ALGORITHM_OPTIONS.map((option) => (
          <button
            key={option.id}
            type="button"
            className={option.id === algorithm ? 'active' : ''}
            aria-pressed={option.id === algorithm}
            onClick={() => onAlgorithm(option.id)}
          >
            {option.label}
          </button>
        ))}
      </div>

      <ListField
        id="arrival"
        label="Arrival times"
        value={arrival}
        onChange={onArrival}
        placeholder="e.g. 0 2 4 6"
        errors={errors.arrival}
      />
      <ListField
        id="burst"
        label="Burst times"
        value={burst}
        onChange={onBurst}
        placeholder="e.g. 5 3 1 2"
        errors={errors.burst}
      />

      {algorithm === 'rr' && (
        <div className="field">
          <div className="field-label">
            <label htmlFor="quantum">Time quantum</label>
          </div>
          <input
            id="quantum"
            className="text-input quantum-input"
            inputMode="numeric"
            value={quantum}
            autoComplete="off"
            aria-invalid={Boolean(errors.quantum)}
            aria-describedby={errors.quantum ? 'quantum-errors' : undefined}
            onChange={(e) => onQuantum(e.target.value)}
          />
          {errors.quantum && <FieldErrors id="quantum-errors" messages={[errors.quantum]} />}
        </div>
      )}

      {errors.general.length > 0 && (
        <div className="form-error" role="alert">
          {errors.general.map((message) => (
            <p key={message}>{message}</p>
          ))}
        </div>
      )}

      <button type="submit" className="btn btn-primary btn-block">
        Run simulation
      </button>

      <div className="button-row">
        <button type="button" className="btn btn-secondary" onClick={onRandom}>
          Random
        </button>
        <button type="button" className="btn btn-secondary" onClick={onReset}>
          Reset
        </button>
      </div>

      <label className="examples">
        <span className="sr-only">Load an example</span>
        <select
          className="select"
          value=""
          onChange={(e) => {
            const example = EXAMPLES.find((ex) => ex.id === e.target.value)
            if (example) onExample(example)
          }}
        >
          <option value="" disabled>
            Load an example…
          </option>
          {EXAMPLES.map((example) => (
            <option key={example.id} value={example.id}>
              {example.label}
            </option>
          ))}
        </select>
      </label>

      <p className="hint">Tip: press Enter in any field to run.</p>
    </form>
  )
}
