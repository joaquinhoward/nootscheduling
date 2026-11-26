/**
 * Generates a random, always-valid process set: 3 to 6 processes with
 * Arrival 0–10 and Burst 1–10, as space-separated lists for the inputs.
 *
 * @param {() => number} random returns a number in [0, 1); injectable for tests
 * @returns {{ arrival: string, burst: string }}
 */
export function randomProcesses(random = Math.random) {
  const between = (min, max) => min + Math.floor(random() * (max - min + 1))
  const count = between(3, 6)
  const arrivals = []
  const bursts = []
  for (let i = 0; i < count; i += 1) {
    arrivals.push(between(0, 10))
    bursts.push(between(1, 10))
  }
  return { arrival: arrivals.join(' '), burst: bursts.join(' ') }
}
