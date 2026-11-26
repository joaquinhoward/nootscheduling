/** Play / Pause, Prev, Next and a scrubber for stepping through the Gantt chart. */
export default function PlaybackBar({ step, total, playing, onPlay, onPause, onPrev, onNext, onSeek }) {
  return (
    <div className="playback">
      <div className="playback-buttons">
        <button type="button" className="btn btn-secondary" onClick={onPrev} disabled={step === 0}>
          ‹ Prev
        </button>
        {playing ? (
          <button type="button" className="btn btn-primary" onClick={onPause}>
            Pause
          </button>
        ) : (
          <button type="button" className="btn btn-primary" onClick={onPlay}>
            ▶ Play
          </button>
        )}
        <button type="button" className="btn btn-secondary" onClick={onNext} disabled={step === total}>
          Next ›
        </button>
      </div>
      <input
        type="range"
        className="scrubber"
        min={0}
        max={total}
        value={step}
        aria-label="Playback step"
        onChange={(e) => onSeek(Number(e.target.value))}
      />
      <span className="chip">
        Step {step} / {total}
      </span>
    </div>
  )
}
