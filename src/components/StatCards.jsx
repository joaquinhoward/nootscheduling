const STATS = [
  ['turnaround', 'Avg turnaround'],
  ['waiting', 'Avg waiting'],
  ['response', 'Avg response'],
]

/** The three averages; shown as "—" until playback reaches the end. */
export default function StatCards({ averages, visible }) {
  return (
    <div className="stats">
      {STATS.map(([key, label]) => (
        <div className="card stat" key={key}>
          <span className="stat-label">{label}</span>
          <span className="stat-value">{visible ? averages[key].toFixed(2) : '—'}</span>
        </div>
      ))}
    </div>
  )
}
