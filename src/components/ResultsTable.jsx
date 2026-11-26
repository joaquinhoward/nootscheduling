/**
 * Renders the per-process results and the averages (2 decimal places).
 */
export default function ResultsTable({ results, averages }) {
  return (
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
        {results.map((r) => (
          <tr key={r.pid}>
            <th scope="row">P{r.pid}</th>
            <td>{r.arrival}</td>
            <td>{r.burst}</td>
            <td>{r.completion}</td>
            <td>{r.turnaround}</td>
            <td>{r.waiting}</td>
            <td>{r.response}</td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr>
          <th scope="row" colSpan={4}>
            Average
          </th>
          <td>{averages.turnaround.toFixed(2)}</td>
          <td>{averages.waiting.toFixed(2)}</td>
          <td>{averages.response.toFixed(2)}</td>
        </tr>
      </tfoot>
    </table>
  )
}
