import Link from "next/link";
import CubeCanvas from "@/components/cube/CubeCanvas";
import MoveControls from "@/components/cube/MoveControls";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center gap-10 bg-graphite-950 px-6 py-10 text-ink">
      <div className="flex w-full max-w-2xl items-center justify-between font-mono text-sm">
        <span className="font-bold tracking-tight">CubeX</span>
        <nav className="flex gap-5 text-ink-muted">
          <Link href="/notation" className="hover:text-ink">
            Notation
          </Link>

        </nav>
      </div>

      <div className="text-center">
        <h1 className="font-mono text-4xl font-bold tracking-tight sm:text-5xl">CubeX</h1>
        <p className="mt-2 max-w-md text-ink-muted">
          Learn how to solve the 3x3 Rubik&apos;s Cube, one layer at a time.
        </p>
        <Link
          href="/learn"
          className="mt-5 inline-block rounded-md bg-cube-r px-5 py-2.5 font-mono text-sm text-white transition-opacity hover:opacity-90"
        >
          Start Learning →
        </Link>
        <div>
          <Link
            href="/notation"
            className="mt-3 inline-block font-mono text-xs uppercase tracking-wider text-ink-muted hover:text-ink"
          >
            New here? Start with cube notation
          </Link>
        </div>
      </div>

      <div className="w-full max-w-2xl">
        <CubeCanvas />
      </div>

      <div className="w-full max-w-md">
        <p className="mb-3 text-center font-mono text-xs uppercase tracking-wider text-ink-muted">
          Free play
        </p>
        <MoveControls />
      </div>
    </div>
  );
}