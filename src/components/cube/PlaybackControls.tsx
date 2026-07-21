"use client";

import { useCubeStore } from "@/lib/cube-engine/store";

const SPEEDS = [0.5, 0.75, 1, 1.5, 2];

export default function PlaybackControls() {
  const paused = useCubeStore((s) => s.paused);
  const togglePaused = useCubeStore((s) => s.togglePaused);
  const speed = useCubeStore((s) => s.speed);
  const setSpeed = useCubeStore((s) => s.setSpeed);

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 font-mono text-xs">
      <button
        onClick={togglePaused}
        className="rounded-md border border-graphite-700 bg-graphite-900 px-3 py-1.5 text-ink transition-colors hover:border-ink-muted"
      >
        {paused ? "▶ Play" : "⏸ Pause"}
      </button>

      <div className="flex items-center gap-1 rounded-md border border-graphite-700 bg-graphite-900 p-1">
        {SPEEDS.map((s) => (
          <button
            key={s}
            onClick={() => setSpeed(s)}
            className={
              speed === s
                ? "rounded bg-cube-r px-2 py-1 text-white"
                : "rounded px-2 py-1 text-ink-muted transition-colors hover:text-ink"
            }
          >
            {s}x
          </button>
        ))}
      </div>
    </div>
  );
}