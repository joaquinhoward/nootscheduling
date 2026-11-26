const DETAILS = {
  fcfs: {
    title: 'First-Come, First-Served',
    summary:
      'Processes run in the order they arrive. Each one runs to completion before the next one starts.',
    facts: [
      ['Type', 'Non-preemptive'],
      ['Ties', 'Same arrival time: lower process number first'],
      ['Idle', 'The CPU waits when no process has arrived yet'],
    ],
  },
  rr: {
    title: 'Round Robin',
    summary:
      'Each process runs for at most one time quantum, then goes to the back of the ready queue if it still has work left.',
    facts: [
      ['Type', 'Preemptive'],
      [
        'Queue rule',
        'Processes that arrive by the end of a quantum join the queue before the process that was just preempted',
      ],
      ['Ties', 'Same arrival time: lower process number first'],
    ],
  },
}

export default function AlgorithmDetails({ algorithm }) {
  const details = DETAILS[algorithm]
  return (
    <section className="card details" aria-labelledby="details-title">
      <h2 className="card-title" id="details-title">
        Algorithm details
      </h2>
      <p className="details-name">{details.title}</p>
      <p className="muted">{details.summary}</p>
      <dl className="facts">
        {details.facts.map(([term, description]) => (
          <div key={term}>
            <dt>{term}</dt>
            <dd>{description}</dd>
          </div>
        ))}
      </dl>
      <div className="formulas">
        <code>TAT = CT − AT</code>
        <code>WT = TAT − BT</code>
        <code>RT = First start − AT</code>
      </div>
    </section>
  )
}
