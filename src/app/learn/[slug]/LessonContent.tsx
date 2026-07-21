"use client";

import { useEffect } from "react";
import type { Lesson, LessonCase } from "@/data/lessons";
import CubeCanvas from "@/components/cube/CubeCanvas";
import PlaybackControls from "@/components/cube/PlaybackControls";
import { useCubeStore } from "@/lib/cube-engine/store";

export default function LessonContent({ lesson }: { lesson: Lesson }) {
  const enqueueAlgorithm = useCubeStore((s) => s.enqueueAlgorithm);
  const reset = useCubeStore((s) => s.reset);
  const setPaused = useCubeStore((s) => s.setPaused);

  // Reset cube when switching lessons
  useEffect(() => {
    reset();
  }, [lesson.slug, reset]);

  const handleDemo = (lessonCase: LessonCase) => {
    reset();
    setPaused(true); // Start paused so the user can step through or play at their own pace

    // Small delay to ensure reset completes before queuing the algorithm
    setTimeout(() => {
      enqueueAlgorithm(lessonCase.algorithm);
    }, 100);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
      {/* Main Content (Left) */}
      <div className="lg:col-span-7 flex flex-col gap-8">

        {/* Goal Card */}
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-6 backdrop-blur-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-emerald-400 mb-3">
            The Goal
          </h2>
          <p className="text-zinc-200 leading-relaxed">
            {lesson.goal}
          </p>
        </div>

        {/* Explanation */}
        <div className="prose prose-invert prose-zinc max-w-none">
          <p className="text-zinc-300 leading-relaxed text-lg">
            {lesson.explanation}
          </p>
        </div>

        {/* Tips */}
        {lesson.tips.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-zinc-100 mb-4">Pro Tips</h3>
            <ul className="flex flex-col gap-3">
              {lesson.tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-3 text-zinc-400 bg-zinc-900/50 p-4 rounded-xl border border-zinc-800/50">
                  <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold mt-0.5">
                    i
                  </span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Cases */}
        {lesson.cases.length > 0 && (
          <div className="mt-8">
            <h3 className="text-2xl font-bold text-zinc-100 mb-6">Algorithms to Know</h3>
            <div className="flex flex-col gap-6">
              {lesson.cases.map((c) => (
                <div key={c.id} className="rounded-2xl border border-zinc-800 bg-zinc-900/40 overflow-hidden">
                  <div className="p-6">
                    <div className="flex justify-between items-start gap-4 mb-4">
                      <div>
                        <h4 className="text-lg font-semibold text-zinc-100">{c.label}</h4>
                        <p className="text-sm text-zinc-400 mt-1">{c.whenToUse}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-6 bg-zinc-950/50 p-4 rounded-xl border border-zinc-800/50">
                      <div className="flex items-center gap-2 flex-wrap">
                        {c.algorithm.split(" ").map((move, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-200 font-mono font-medium border border-zinc-700 shadow-sm"
                          >
                            {move}
                          </span>
                        ))}
                      </div>
                      <button
                        onClick={() => handleDemo(c)}
                        className="ml-4 shrink-0 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/20"
                      >
                        Load Demo &rarr;
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Interactive Cube (Right Sticky) */}
      <div className="lg:col-span-5 sticky top-24 flex flex-col gap-6">
        <CubeCanvas />
        <PlaybackControls />

        {lesson.notationUsed.length > 0 && (
          <div className="mt-4 p-5 rounded-2xl border border-zinc-800/50 bg-zinc-900/30">
            <h4 className="text-sm font-semibold text-zinc-400 mb-3">Notation used in this lesson:</h4>
            <div className="flex flex-wrap gap-2">
              {lesson.notationUsed.map((n) => (
                <span key={n} className="px-2 py-1 bg-zinc-800 rounded md text-zinc-300 font-mono text-sm">
                  {n}
                </span>
              ))}
            </div>
            <p className="text-xs text-zinc-500 mt-3">
              Need a refresher? Check out the <a href="/notation" className="text-blue-400 hover:underline">Notation Guide</a>.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}