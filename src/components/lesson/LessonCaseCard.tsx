"use client";

import { useCubeStore } from "@/lib/cube-engine/store";
import type { LessonCase } from "@/data/lessons";
import AlgorithmDisplay from "./AlgorithmDisplay";

export default function LessonCaseCard({ lessonCase }: { lessonCase: LessonCase }) {
    const reset = useCubeStore((s) => s.reset);
    const enqueueAlgorithm = useCubeStore((s) => s.enqueueAlgorithm);
    const setPaused = useCubeStore((s) => s.setPaused);

    const moveCount = lessonCase.algorithm.trim().split(/\s+/).length;

    function playDemo() {
        setPaused(false);
        reset();
        enqueueAlgorithm(lessonCase.algorithm);
    }

    return (
        <div className="rounded-lg border border-graphite-700 bg-graphite-900 p-5">
            <div className="flex items-center justify-between gap-4">
                <h3 className="font-mono text-sm uppercase tracking-wider text-ink-muted">
                    {lessonCase.label}
                </h3>
                <span className="font-mono text-xs text-ink-muted">{moveCount} moves</span>
            </div>

            <p className="mt-2 text-sm text-ink-muted">{lessonCase.whenToUse}</p>

            <div className="mt-4">
                <AlgorithmDisplay algorithm={lessonCase.algorithm} />
            </div>

            <div className="mt-4 flex gap-2">
                <button
                    onClick={playDemo}
                    className="rounded-md bg-cube-r px-4 py-2 font-mono text-sm text-white transition-opacity hover:opacity-90"
                >
                    ▶ Play demo
                </button>

                <button
                    onClick={() => reset()}
                    className="rounded-md border border-graphite-700 px-4 py-2 font-mono text-sm text-ink-muted transition-colors hover:border-graphite-500 hover:text-ink"
                >
                    ↺ Reset
                </button>
            </div>

            <p className="mt-3 text-xs italic text-ink-muted">
                This demo starts from a solved cube so you can watch the moves clearly. In an actual
                solve you&apos;d apply it to a cube already in this case — there it corrects the layer
                instead of rearranging it.
            </p>
        </div>
    );
}