/**
 * Lesson content for the 3x3 "Layer-by-Layer" (beginner) method.
 *
 * This file is pure data — no React, no rendering. UI components (built in
 * later steps) read from `lessons` to render the /learn pages and drive
 * demo playback on the 3D cube via the existing move engine.
 */

export interface LessonCase {
  /** Short, stable identifier for this case within the lesson, e.g. "insert-right". */
  id: string;
  /** Human-readable name shown in the UI, e.g. "Insert to the right". */
  label: string;
  /** When a learner should reach for this specific case. */
  whenToUse: string;
  /** Move-notation string compatible with the cube engine's parseAlgorithm(). */
  algorithm: string;
}

export interface Lesson {
  /** URL-friendly slug, used for routing: /learn/[slug]. */
  slug: string;
  /** 1-based position in the overall method, for ordering and prev/next nav. */
  order: number;
  title: string;
  /** One-line summary shown on the lesson index page. */
  shortDescription: string;
  /** What "done" looks like for this stage — helps a learner self-check. */
  goal: string;
  /** The main teaching paragraph(s): the idea behind this stage. */
  explanation: string;
  /**
   * True for stages solved by spatial reasoning rather than a fixed
   * algorithm (currently just the White Cross). When true, `cases` is empty
   * and the UI should show `tips` instead of an algorithm + demo button.
   */
  intuitive: boolean;
  tips: string[];
  /** One or more algorithm cases. Empty for intuitive stages. */
  cases: LessonCase[];
  /** Which face letters this lesson relies on — used to cross-link to /notation. */
  notationUsed: string[];
}

export const lessons: Lesson[] = [
  {
    slug: "white-cross",
    order: 1,
    title: "White Cross",
    shortDescription: "Build a plus-sign of white edges around the white center.",
    goal:
      "A white plus-sign on top, where each arm's side color lines up with the matching center piece next to it — not just any white edge in any position.",
    explanation:
      "This first stage doesn't use a fixed algorithm — it's solved by intuition, and that's deliberate: it teaches you how the pieces actually move before you start relying on memorized sequences. Find the four edge pieces that have white on them. Each one also has a second color, and that second color has to end up matching the center piece it sits next to, not just facing the right general direction. Turn the top and side layers to walk each white edge into place one at a time, without worrying yet about anything except the four white edges.",
    intuitive: true,
    tips: [
      "Solve one edge at a time — it's fine to temporarily disturb an edge you already placed if it helps position the next one; you can always redo it.",
      "A common trick: bring the white edge to the bottom layer first, rotate it underneath the slot it needs, then turn that side face 180° to pop it into place on top.",
      "Check both stickers on every white edge before calling it placed — white facing up isn't enough on its own.",
    ],
    cases: [],
    notationUsed: [],
  },
  {
    slug: "first-layer-corners",
    order: 2,
    title: "White Corners",
    shortDescription: "Slot each white corner into place to complete the first layer.",
    goal:
      "The entire bottom layer solved: the white face complete, and the row of side colors around it matching their centers.",
    explanation:
      "With the cross done, four white corner pieces are left to place. Find one in the top layer and rotate the top layer (without touching anything else yet) until that corner sits directly above the slot it belongs in. Then repeat the algorithm below — it lifts the corner out, turns it, and drops it back in, gradually walking it into the correct slot without ever disturbing the cross you already built. You'll typically need to run it more than once for a single corner, and that's expected.",
    intuitive: false,
    tips: [
      "If a corner is already in the bottom layer but twisted the wrong way, the algorithm can't fix it directly — first pop it out into the top layer, then treat it like any other unplaced corner.",
      "Work on one corner completely before moving to the next.",
    ],
    cases: [
      {
        id: "insert",
        label: "Insert corner",
        whenToUse:
          "The target corner is in the top layer, positioned directly above the empty slot it needs to go into.",
        algorithm: "R U R' U'",
      },
    ],
    notationUsed: ["R", "U"],
  },
  {
    slug: "second-layer",
    order: 3,
    title: "Second Layer Edges",
    shortDescription: "Place the four middle-layer edges to finish two-thirds of the cube.",
    goal: "The bottom two layers fully solved, leaving only the top (yellow) layer scrambled.",
    explanation:
      "Flip the cube so the completed white layer is on the bottom. Now look at the top layer for edge pieces that do NOT have yellow on them — those belong in the middle layer. Rotate the top layer until one of these edges' front-facing color matches the center below it, then check which side its other color needs to go: left or right. Use the matching algorithm below to slide it into place without disturbing the solved layer beneath it.",
    intuitive: false,
    tips: [
      "If every top-layer edge has yellow on it (meaning none can go directly into the second layer), use either algorithm once on any slot — it will pull a buried edge back up to the top layer so you have a fresh one to work with.",
    ],
    cases: [
      {
        id: "insert-right",
        label: "Insert to the right",
        whenToUse: "The edge's second color needs to end up on the right-hand side slot.",
        algorithm: "U R U' R' U' F' U F",
      },
      {
        id: "insert-left",
        label: "Insert to the left",
        whenToUse: "The edge's second color needs to end up on the left-hand side slot.",
        algorithm: "U' L' U L U F U' F'",
      },
    ],
    notationUsed: ["U", "R", "F", "L"],
  },
  {
    slug: "yellow-cross",
    order: 4,
    title: "Yellow Cross",
    shortDescription: "Orient the top-layer edges so a yellow plus-sign appears on top.",
    goal: "A yellow cross on top — the side colors of these edges don't matter yet, only that yellow faces up.",
    explanation:
      "This is the first step of solving the last layer, and it only cares about orientation, not position. Look at the top face: you'll see either a single yellow dot in the center, a short line, an L/r-shape, or you're already done with a full cross. Whichever pattern you have, hold the cube so it matches the case, then run the algorithm below. You may need to repeat it — a dot typically needs it twice (turning the cube between attempts), an L-shape once, and a line once.",
    intuitive: false,
    tips: [
      "The center yellow square is always there — you're only looking at the four edge pieces around it to see the dot/line/cross pattern.",
    ],
    cases: [
      {
        id: "orient-edges",
        label: "Orient edges",
        whenToUse: "Applied from whichever dot/line/L-shape position matches your current case.",
        algorithm: "F R U R' U' F'",
      },
    ],
    notationUsed: ["F", "R", "U"],
  },
  {
    slug: "orient-last-layer-corners",
    order: 5,
    title: "Orient Last Layer Corners",
    shortDescription: "Twist the remaining top corners so the entire top face is yellow.",
    goal: "The whole top face solid yellow. The corners will likely be in the wrong positions — that's the next step, not this one.",
    explanation:
      "With the yellow cross done, the four top corners still need to show yellow on top. This algorithm — often nicknamed \"Sune\" — twists corners in place without moving the cross edges you already oriented. Turn the top layer until at least one corner already shows yellow on top, position that corner at the front-left, and apply the algorithm. Depending on how many corners are already yellow-up, you may need to run it a second time from a new angle.",
    intuitive: false,
    tips: [
      "If no corner shows yellow yet, it doesn't matter which one you start from — apply the algorithm once and a correct pattern will appear.",
    ],
    cases: [
      {
        id: "sune",
        label: "Sune",
        whenToUse: "One or more (but not all) top corners already show yellow on top.",
        algorithm: "R U R' U R U2 R'",
      },
    ],
    notationUsed: ["R", "U"],
  },
  {
    slug: "permute-corners",
    order: 6,
    title: "Permute Last Layer Corners",
    shortDescription: "Cycle the top corners into their correct positions.",
    goal:
      "Every top corner in its correct spot (orientation solved already) — the top edges are still likely out of place, which is the final step.",
    explanation:
      "The top face is fully yellow, but the corners are probably not above the side colors they belong next to. Look for two adjacent corners that already match each other and the face between them — this is called \"headlights.\" Position the headlights on the back face, then run the algorithm. If you can't find any headlights at all, just run the algorithm once from any position; a set of headlights will appear afterward.",
    intuitive: false,
    tips: [],
    cases: [
      {
        id: "cycle-corners",
        label: "Cycle corners",
        whenToUse: "Headlights are positioned on the back face (or no headlights exist yet).",
        algorithm: "R' F R' B2 R F' R' B2 R2",
      },
    ],
    notationUsed: ["R", "F", "B"],
  },
  {
    slug: "permute-edges",
    order: 7,
    title: "Permute Last Layer Edges",
    shortDescription: "Cycle the top edges into place — the final step.",
    goal: "A fully solved cube.",
    explanation:
      "Every corner is in its correct spot; only the four top edges need to be cycled into position. Look for a full solid-colored bar on one side of the cube — put that side at the back and apply the algorithm below. It may take more than one application to finish. Once every side shows a complete, solid color, the cube is solved.",
    intuitive: false,
    tips: [
      "If you don't see any solid bar yet, apply the algorithm once from any position — a bar will appear afterward.",
    ],
    cases: [
      {
        id: "cycle-edges",
        label: "Cycle edges",
        whenToUse: "A solid-colored bar is positioned on the back face (or no bar exists yet).",
        algorithm: "R U' R U R U R U' R' U' R2",
      },
    ],
    notationUsed: ["R", "U"],
  },
];

export function getAllLessons(): Lesson[] {
  return [...lessons].sort((a, b) => a.order - b.order);
}

export function getLessonBySlug(slug: string): Lesson | undefined {
  return lessons.find((lesson) => lesson.slug === slug);
}

export function getAdjacentLessons(slug: string): {
  previous: Lesson | null;
  next: Lesson | null;
} {
  const ordered = getAllLessons();
  const index = ordered.findIndex((lesson) => lesson.slug === slug);
  if (index === -1) return { previous: null, next: null };
  return {
    previous: index > 0 ? ordered[index - 1] : null,
    next: index < ordered.length - 1 ? ordered[index + 1] : null,
  };
}
