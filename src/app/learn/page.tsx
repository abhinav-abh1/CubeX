import Link from "next/link";
import { getAllLessons } from "@/data/lessons";
import { CUBE_COLORS } from "@/lib/cube-engine/colors";
import type { FaceLetter } from "@/lib/cube-engine/types";

export default function LearnIndexPage() {
  const lessons = getAllLessons();

  return (
    <div className="flex min-h-screen flex-col items-center gap-8 bg-graphite-950 px-6 py-10 text-ink">
      <div className="w-full max-w-2xl">
        <Link
          href="/"
          className="font-mono text-xs uppercase tracking-wider text-ink-muted hover:text-ink"
        >
          ← Back to CubeX
        </Link>
        <h1 className="mt-4 font-mono text-4xl font-bold tracking-tight sm:text-5xl">
          The Method
        </h1>
        <p className="mt-3 text-ink-muted">
          Seven steps, in order, take you from a scrambled cube to fully solved. Each one
          builds on the last — work through them top to bottom.
        </p>
      </div>

      <ol className="flex w-full max-w-2xl flex-col gap-3">
        {lessons.map((lesson) => (
          <li key={lesson.slug}>
            <Link
              href={`/learn/${lesson.slug}`}
              className="flex items-center gap-4 rounded-lg border border-graphite-700 bg-graphite-900 p-4 transition-colors hover:border-ink-muted"
            >
              <span className="font-mono text-2xl font-bold text-ink-muted">
                {String(lesson.order).padStart(2, "0")}
              </span>
              <div className="flex-1">
                <h2 className="font-mono text-base font-semibold text-ink">{lesson.title}</h2>
                <p className="mt-0.5 text-sm text-ink-muted">{lesson.shortDescription}</p>
              </div>
              <div className="flex gap-1">
                {lesson.notationUsed.map((letter) => (
                  <span
                    key={letter}
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: CUBE_COLORS[letter as FaceLetter] }}
                    title={letter}
                  />
                ))}
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}