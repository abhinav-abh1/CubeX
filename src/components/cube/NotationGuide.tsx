"use client";

import type { CSSProperties } from "react";
import { useCubeStore } from "@/lib/cube-engine/store";
import { FACES, type FaceInfo } from "@/data/notation";

const SUFFIXES: { token: string; label: string }[] = [
  { token: "", label: "CW" },
  { token: "'", label: "CCW" },
  { token: "2", label: "180°" },
];

function FaceCard({ face }: { face: FaceInfo }) {
  const enqueueAlgorithm = useCubeStore((s) => s.enqueueAlgorithm);

  const style = { "--accent": face.color } as CSSProperties;

  return (
    <div
      style={{ ...style, gridArea: face.letter.toLowerCase() }}
      className="flex flex-col rounded-lg border border-graphite-700 bg-graphite-900 p-4"
    >
      <div className="-mx-4 -mt-4 mb-3 h-1 rounded-t-lg" style={{ backgroundColor: face.color }} />

      <div className="flex items-baseline gap-2">
        <span className="font-mono text-3xl font-bold" style={{ color: face.color }}>
          {face.letter}
        </span>
        <span className="font-mono text-xs uppercase tracking-wider text-ink-muted">
          {face.name}
        </span>
      </div>

      <p className="mt-2 text-sm leading-snug text-ink-muted">{face.description}</p>

      <div className="mt-4 flex gap-1.5">
        {SUFFIXES.map(({ token, label }) => (
          <button
            key={token}
            onClick={() => enqueueAlgorithm(`${face.letter}${token}`)}
            title={label}
            className="flex-1 rounded-md border border-graphite-700 bg-graphite-950 py-1.5 font-mono text-sm text-ink transition-colors hover:border-[var(--accent)] hover:bg-[var(--accent)]/10 hover:text-[var(--accent)]"
          >
            {face.letter}
            {token}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function NotationGuide() {
  const reset = useCubeStore((s) => s.reset);

  return (
    <div className="flex w-full max-w-3xl flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="font-mono text-sm uppercase tracking-wider text-ink-muted">
          The Six Faces
        </h2>
        <button
          onClick={() => reset()}
          className="rounded-md border border-graphite-700 px-3 py-1.5 font-mono text-xs uppercase tracking-wide text-ink-muted transition-colors hover:border-graphite-700 hover:text-ink"
        >
          Reset Cube
        </button>
      </div>

      {/* Desktop / tablet: unfolded cube net —
          .  U  .  .
          L  F  R  B
          .  D  .  . */}
      <div
        className="hidden gap-3 sm:grid"
        style={{
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gridTemplateAreas: `". u . ." "l f r b" ". d . ."`,
        }}
      >
        {FACES.map((face) => (
          <FaceCard key={face.letter} face={face} />
        ))}
      </div>

      {/* Mobile: simple stacked list */}
      <div className="grid grid-cols-1 gap-3 sm:hidden">
        {FACES.map((face) => (
          <FaceCard key={face.letter} face={face} />
        ))}
      </div>

      <div className="rounded-lg border border-graphite-700 bg-graphite-900 p-4 font-mono text-xs uppercase tracking-wider text-ink-muted">
        <div className="flex flex-wrap gap-x-8 gap-y-2">
          <span>
            <span className="text-ink">R</span> — clockwise
          </span>
          <span>
            <span className="text-ink">R&apos;</span> — counter-clockwise
          </span>
          <span>
            <span className="text-ink">R2</span> — half turn (180°)
          </span>
        </div>
      </div>
    </div>
  );
}