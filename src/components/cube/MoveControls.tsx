"use client";

import type { CSSProperties } from "react";
import { useCubeStore } from "@/lib/cube-engine/store";
import { CUBE_COLORS } from "@/lib/cube-engine/colors";
import type { FaceLetter } from "@/lib/cube-engine/types";

const FACES: FaceLetter[] = ["U", "D", "L", "R", "F", "B"];
const SUFFIXES = ["", "'", "2"];

export default function MoveControls() {
  const enqueueAlgorithm = useCubeStore((s) => s.enqueueAlgorithm);
  const reset = useCubeStore((s) => s.reset);
  const scramble = useCubeStore((s) => s.scramble);
  const queueLength = useCubeStore((s) => s.queue.length);
  const isAnimating = useCubeStore((s) => s.animating !== null);

  const pending = queueLength + (isAnimating ? 1 : 0);

  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <div className="grid grid-cols-6 gap-2">
        {FACES.map((face) => (
          <div
            key={face}
            className="flex flex-col gap-1"
            style={{ "--accent": CUBE_COLORS[face] } as CSSProperties}
          >
            {SUFFIXES.map((suffix) => (
              <button
                key={suffix}
                onClick={() => enqueueAlgorithm(`${face}${suffix}`)}
                className="rounded-md border border-graphite-700 bg-graphite-900 py-1.5 font-mono text-sm text-ink transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                {face}
                {suffix}
              </button>
            ))}
          </div>
        ))}
      </div>

      <div className="flex gap-2 pt-1">
        <button
          onClick={() => scramble()}
          className="flex-1 rounded-md bg-cube-r py-2 font-mono text-sm text-white transition-opacity hover:opacity-90"
        >
          Scramble
        </button>
        <button
          onClick={() => reset()}
          className="flex-1 rounded-md border border-graphite-700 py-2 font-mono text-sm text-ink-muted transition-colors hover:text-ink"
        >
          Reset
        </button>
      </div>

      <p className="h-4 text-center font-mono text-xs text-ink-muted">
        {pending > 0 ? `${pending} move${pending > 1 ? "s" : ""} queued` : "\u00A0"}
      </p>
    </div>
  );
}