import { notFound } from "next/navigation";
import Link from "next/link";
import CubeCanvas from "@/components/cube/CubeCanvas";
import LessonCaseCard from "@/components/lesson/LessonCaseCard";
import { getAdjacentLessons, getAllLessons, getLessonBySlug } from "@/data/lessons";

export function generateStaticParams() {
  return getAllLessons().map((lesson) => ({ slug: lesson.slug }));
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const lesson = getLessonBySlug(slug);

  if (!lesson) {
    notFound();
  }

  const total = getAllLessons().length;
  const { previous, next } = getAdjacentLessons(lesson.slug);

  return (
    <div className="flex min-h-screen flex-col items-center gap-10 bg-graphite-950 px-6 py-10 text-ink">
      <div className="w-full max-w-3xl">
        <Link
          href="/"
          className="font-mono text-xs uppercase tracking-wider text-ink-muted hover:text-ink"
        >
          ← Back to CubeX
        </Link>

        <p className="mt-4 font-mono text-xs uppercase tracking-wider text-ink-muted">
          Step {lesson.order} of {total}
        </p>
        <h1 className="mt-1 font-mono text-4xl font-bold tracking-tight sm:text-5xl">
          {lesson.title}
        </h1>

        <div className="mt-6 rounded-lg border border-graphite-700 bg-graphite-900 p-5">
          <p className="font-mono text-xs uppercase tracking-wider text-ink-muted">Goal</p>
          <p className="mt-1 text-ink">{lesson.goal}</p>
        </div>

        <p className="mt-6 leading-relaxed text-ink-muted">{lesson.explanation}</p>
      </div>

      <div className="w-full max-w-2xl">
        <CubeCanvas />
      </div>

      <div className="flex w-full max-w-3xl flex-col gap-4">
        {lesson.cases.map((c) => (
          <LessonCaseCard key={c.id} lessonCase={c} />
        ))}

        {lesson.tips.length > 0 && (
          <div className="rounded-lg border border-graphite-700 bg-graphite-900 p-5">
            <p className="font-mono text-xs uppercase tracking-wider text-ink-muted">Tips</p>
            <ul className="mt-2 flex flex-col gap-2 text-sm text-ink-muted">
              {lesson.tips.map((tip, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-ink">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {lesson.notationUsed.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs uppercase tracking-wider text-ink-muted">
            <span>Uses:</span>
            {lesson.notationUsed.map((letter) => (
              <Link
                key={letter}
                href="/notation"
                className="rounded border border-graphite-700 px-2 py-0.5 text-ink hover:border-ink"
              >
                {letter}
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="flex w-full max-w-3xl justify-between gap-4 font-mono text-sm">
        {previous ? (
          <Link
            href={`/learn/${previous.slug}`}
            className="rounded-md border border-graphite-700 px-4 py-2 text-ink-muted transition-colors hover:text-ink"
          >
            ← {previous.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/learn/${next.slug}`}
            className="rounded-md border border-graphite-700 px-4 py-2 text-ink-muted transition-colors hover:text-ink"
          >
            {next.title} →
          </Link>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}