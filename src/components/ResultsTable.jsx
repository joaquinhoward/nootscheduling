import { processColor } from '../colors.js'

/**
 * Per-process results. Processes that have not finished by `time` show "—",
 * so the table fills in as playback moves. Averages show once `complete`.
 */
export default function ResultsTable({ results, averages, time, complete }) {
  const dash = <span className="muted">—</span>
  return (
    <div className="table-scroll">
      <table className="results">
        <thead>
          <tr>
            <th scope="col">Process</th>
            <th scope="col">Arrival</th>
            <th scope="col">Burst</th>
            <th scope="col">Completion</th>
            <th scope="col">Turnaround</th>
            <th scope="col">Waiting</th>
            <th scope="col">Response</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r) => {
            const done = r.completion <= time
            return (
              <tr key={r.pid} className={done ? '' : 'row-pending'}>
                <th scope="row">
                  <span className="swatch" style={{ background: processColor(r.pid).border }} />P{r.pid}
                </th>
                <td>{r.arrival}</td>
                <td>{r.burst}</td>
                <td>{done ? r.completion : dash}</td>
                <td>{done ? r.turnaround : dash}</td>
                <td>{done ? r.waiting : dash}</td>
                <td>{done ? r.response : dash}</td>
              </tr>
            )
          })}
        </tbody>
        <tfoot>
          <tr>
            <th scope="row" colSpan={4}>
              Average
            </th>
            <td>{complete ? averages.turnaround.toFixed(2) : dash}</td>
            <td>{complete ? averages.waiting.toFixed(2) : dash}</td>
            <td>{complete ? averages.response.toFixed(2) : dash}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}
