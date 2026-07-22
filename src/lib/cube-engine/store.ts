import { create } from "zustand";
import { applyMove, createSolvedCube, generateScramble, parseAlgorithm } from "./cube";
import type { CubeState, Move } from "./types";

export const MOVE_DURATION_MS = 260;

interface AnimatingMove {
  move: Move;
}

interface CubeStore {
  cube: CubeState;
  queue: Move[];
  animating: AnimatingMove | null;
  paused: boolean;
  speed: number;

  enqueueMove: (move: Move) => void;
  enqueueAlgorithm: (algorithm: string) => void;
  reset: () => void;
  setCube: (cube: CubeState) => void;
  scramble: (length?: number) => void;
  clearQueue: () => void;
  togglePaused: () => void;
  setPaused: (paused: boolean) => void;
  setSpeed: (speed: number) => void;

  startNextMove: () => void;
  completeCurrentMove: () => void;
}

export const useCubeStore = create<CubeStore>((set, get) => ({
  cube: createSolvedCube(),
  queue: [],
  animating: null,
  paused: false,
  speed: 1,

  enqueueMove: (move) => set((state) => ({ queue: [...state.queue, move] })),

  enqueueAlgorithm: (algorithm) => {
    const moves = parseAlgorithm(algorithm);
    set((state) => ({ queue: [...state.queue, ...moves] }));
  },

  reset: () => set({ cube: createSolvedCube(), queue: [], animating: null }),

  setCube: (cube) => set({ cube, queue: [], animating: null }),

  scramble: (length = 20) => {
    const alg = generateScramble(length);
    get().enqueueAlgorithm(alg);
  },

  clearQueue: () => set({ queue: [] }),

  togglePaused: () => set((state) => ({ paused: !state.paused })),
  setPaused: (paused) => set({ paused }),
  setSpeed: (speed) => set({ speed }),

  startNextMove: () => {
    const { queue, animating } = get();
    if (animating || queue.length === 0) return;
    const [next, ...rest] = queue;
    set({ animating: { move: next }, queue: rest });
  },

  completeCurrentMove: () => {
    const { animating, cube } = get();
    if (!animating) return;
    set({ cube: applyMove(cube, animating.move), animating: null });
  },
}));