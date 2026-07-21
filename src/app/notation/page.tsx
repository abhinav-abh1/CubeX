import Link from "next/link";
import CubeCanvas from "@/components/cube/CubeCanvas";
import NotationGuide from "@/components/cube/NotationGuide";

export default function NotationPage() {
  return (
    <div className="flex min-h-screen flex-col items-center gap-10 bg-graphite-950 px-6 py-10 text-ink">
      <div className="w-full max-w-3xl">
        <Link
          href="/"
          className="font-mono text-xs uppercase tracking-wider text-ink-muted hover:text-ink"
        >
          ← Back to CubeX
        </Link>

        <h1 className="mt-4 font-mono text-4xl font-bold tracking-tight sm:text-5xl">
          Cube Notation
        </h1>
        <p className="mt-3 max-w-xl text-ink-muted">
          Every algorithm in CubeX — and everywhere else in cubing — is written with six
          letters, one per face. Learn to read them here, and the rest of the site opens up.
        </p>

        <div className="mt-6 rounded-lg border border-graphite-700 bg-graphite-900 p-5">
          <p className="font-mono text-lg tracking-wide text-ink sm:text-xl">
            R U R&apos; U&apos;
          </p>
          <p className="mt-2 text-sm text-ink-muted">
            Turn Right clockwise, then Top clockwise, then Right back counter-clockwise, then
            Top back counter-clockwise. That&apos;s it — every algorithm you&apos;ll learn is
            just this kind of sequence, spelled out with the letters below.
          </p>
        </div>
      </div>

      <div className="w-full max-w-2xl">
        <CubeCanvas />
      </div>

      <NotationGuide />
    </div>
  );
}