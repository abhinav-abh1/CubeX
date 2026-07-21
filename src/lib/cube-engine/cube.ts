import * as THREE from "three";
import { CUBE_COLORS } from "./colors";
import type {
  Axis,
  CubeState,
  CubieState,
  FaceColors,
  FaceLetter,
  Move,
  Vec3,
} from "./types";

// Which axis each face's layer rotates around, and which layer value (-1 or 1)
// that face corresponds to on that axis.
const FACE_AXIS_LAYER: Record<FaceLetter, { axis: Axis; layer: 1 | -1 }> = {
  U: { axis: "y", layer: 1 },
  D: { axis: "y", layer: -1 },
  R: { axis: "x", layer: 1 },
  L: { axis: "x", layer: -1 },
  F: { axis: "z", layer: 1 },
  B: { axis: "z", layer: -1 },
};

const AXIS_INDEX: Record<Axis, 0 | 1 | 2> = { x: 0, y: 1, z: 2 };

const AXIS_VECTOR: Record<Axis, THREE.Vector3> = {
  x: new THREE.Vector3(1, 0, 0),
  y: new THREE.Vector3(0, 1, 0),
  z: new THREE.Vector3(0, 0, 1),
};

/** Builds a fresh, solved 3x3 cube: 26 cubies (no center piece needed), each
 * painted with its solved-state sticker colors. */
export function createSolvedCube(): CubeState {
  const cubies: CubieState[] = [];
  let idCounter = 0;

  for (let x = -1 as Vec3[0]; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        if (x === 0 && y === 0 && z === 0) continue; // hidden center, skip

        const colors: FaceColors = [
          x === 1 ? CUBE_COLORS.R : null,
          x === -1 ? CUBE_COLORS.L : null,
          y === 1 ? CUBE_COLORS.U : null,
          y === -1 ? CUBE_COLORS.D : null,
          z === 1 ? CUBE_COLORS.F : null,
          z === -1 ? CUBE_COLORS.B : null,
        ];

        cubies.push({
          id: `cubie-${idCounter++}`,
          colors,
          position: [x, y, z],
          quaternion: [0, 0, 0, 1],
        });
      }
    }
  }

  return { cubies };
}

/** The rotation angle (radians) for one move, using the convention:
 * turning a positive-layer face (U/R/F) clockwise as viewed from outside
 * that face is a NEGATIVE rotation about the face's axis; negative-layer
 * faces (D/L/B) are the mirror image, so clockwise there is POSITIVE. */
export function moveAngle(move: Move): number {
  const { layer } = FACE_AXIS_LAYER[move.face];
  return -(Math.PI / 2) * layer * move.turns;
}

export function moveAxis(move: Move): Axis {
  return FACE_AXIS_LAYER[move.face].axis;
}

export function moveLayer(move: Move): 1 | -1 {
  return FACE_AXIS_LAYER[move.face].layer;
}

/** Pure function: returns a NEW CubeState with the move applied.
 * Does not mutate the input state. */
export function applyMove(state: CubeState, move: Move): CubeState {
  const { axis, layer } = FACE_AXIS_LAYER[move.face];
  const axisIndex = AXIS_INDEX[axis];
  const angle = moveAngle(move);
  const delta = new THREE.Quaternion().setFromAxisAngle(AXIS_VECTOR[axis], angle);

  const cubies = state.cubies.map((cubie): CubieState => {
    if (Math.round(cubie.position[axisIndex]) !== layer) {
      return cubie; // not part of this layer — untouched
    }

    const pos = new THREE.Vector3(...cubie.position).applyQuaternion(delta);
    const newPosition: Vec3 = [
      Math.round(pos.x),
      Math.round(pos.y),
      Math.round(pos.z),
    ];

    // Compose world-space delta rotation on top of the cubie's existing
    // orientation: newQuat = delta * existing (delta applied last).
    const existing = new THREE.Quaternion(...cubie.quaternion);
    const newQuat = delta.clone().multiply(existing);

    return {
      ...cubie,
      position: newPosition,
      quaternion: [newQuat.x, newQuat.y, newQuat.z, newQuat.w],
    };
  });

  return { cubies };
}

export function applyMoves(state: CubeState, moves: Move[]): CubeState {
  return moves.reduce((acc, move) => applyMove(acc, move), state);
}

export function applyAlgorithm(state: CubeState, algorithm: string): CubeState {
  return applyMoves(state, parseAlgorithm(algorithm));
}

const MOVE_TOKEN = /^([UDLRFB])(2|')?$/;

export function parseMove(token: string): Move {
  const match = MOVE_TOKEN.exec(token);
  if (!match) {
    throw new Error(
      `Invalid move notation: "${token}". Expected one of U D L R F B, optionally followed by ' or 2.`
    );
  }
  const face = match[1] as FaceLetter;
  const suffix = match[2];
  const turns: Move["turns"] = suffix === "2" ? 2 : suffix === "'" ? 3 : 1;
  return { face, turns, raw: token };
}

/** Splits an algorithm string like "R U R' U'" into parsed Move objects. */
export function parseAlgorithm(algorithm: string): Move[] {
  return algorithm
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map(parseMove);
}

export function invertMove(move: Move): Move {
  // move.turns is always 1, 2, or 3, so 4 - turns is always 3, 2, or 1 —
  // never 0 — meaning the result is always a valid Move["turns"].
  const turns = (4 - move.turns) as Move["turns"];
  const raw = turns === 2 ? `${move.face}2` : turns === 3 ? `${move.face}'` : move.face;
  return { face: move.face, turns, raw };
}

/** Inverting a whole algorithm reverses order AND inverts each move —
 * e.g. inverse of "R U R'" is "R U' R'". */
export function invertAlgorithm(moves: Move[]): Move[] {
  return [...moves].reverse().map(invertMove);
}

const ALL_FACES: FaceLetter[] = ["U", "D", "L", "R", "F", "B"];
const OPPOSITE_FACE: Record<FaceLetter, FaceLetter> = {
  U: "D",
  D: "U",
  L: "R",
  R: "L",
  F: "B",
  B: "F",
};

/** Generates a random scramble string, avoiding immediate repeats of the same
 * face and avoiding back-to-back opposite-face moves on the same axis
 * (e.g. "R L" in a row), matching standard scrambling convention. */
export function generateScramble(length = 20): string {
  const result: FaceLetter[] = [];
  let last: FaceLetter | null = null;
  let lastAxisFaces: [FaceLetter, FaceLetter] | null = null;

  while (result.length < length) {
    const candidate = ALL_FACES[Math.floor(Math.random() * ALL_FACES.length)];
    if (candidate === last) continue;
    if (
      lastAxisFaces &&
      (candidate === lastAxisFaces[0] || candidate === lastAxisFaces[1]) &&
      result.length > 0 &&
      OPPOSITE_FACE[result[result.length - 1]] === candidate
    ) {
      continue;
    }
    result.push(candidate);
    last = candidate;
    lastAxisFaces = [candidate, OPPOSITE_FACE[candidate]];
  }

  const suffixes = ["", "", "'", "2"]; // weight plain/prime evenly, 2 less common
  return result
    .map((face) => face + suffixes[Math.floor(Math.random() * suffixes.length)])
    .join(" ");
}

/** A cube is solved when, at every position, the sticker facing each of the
 * six world directions matches the color that direction should show on a
 * solved cube — regardless of which physical cubie ended up there. */
export function isSolved(state: CubeState): boolean {
  for (const cubie of state.cubies) {
    const q = new THREE.Quaternion(...cubie.quaternion);
    const directions: [THREE.Vector3, number][] = [
      [new THREE.Vector3(1, 0, 0), 0],
      [new THREE.Vector3(-1, 0, 0), 1],
      [new THREE.Vector3(0, 1, 0), 2],
      [new THREE.Vector3(0, -1, 0), 3],
      [new THREE.Vector3(0, 0, 1), 4],
      [new THREE.Vector3(0, 0, -1), 5],
    ];
    for (const [worldDir, faceIdx] of directions) {
      // Find which local face is currently pointing in worldDir.
      const local = worldDir.clone().applyQuaternion(q.clone().invert());
      const localFaceIdx = vectorToFaceIndex(local);
      const color = cubie.colors[localFaceIdx];
      if (color === null) continue;
      const expectedColorAtThisPosition = expectedColorForDirection(faceIdx);
      if (color !== expectedColorAtThisPosition) return false;
    }
  }
  return true;
}

function vectorToFaceIndex(v: THREE.Vector3): 0 | 1 | 2 | 3 | 4 | 5 {
  const rounded = [Math.round(v.x), Math.round(v.y), Math.round(v.z)];
  if (rounded[0] === 1) return 0;
  if (rounded[0] === -1) return 1;
  if (rounded[1] === 1) return 2;
  if (rounded[1] === -1) return 3;
  if (rounded[2] === 1) return 4;
  return 5;
}

function expectedColorForDirection(faceIdx: number): string {
  switch (faceIdx) {
    case 0:
      return CUBE_COLORS.R;
    case 1:
      return CUBE_COLORS.L;
    case 2:
      return CUBE_COLORS.U;
    case 3:
      return CUBE_COLORS.D;
    case 4:
      return CUBE_COLORS.F;
    default:
      return CUBE_COLORS.B;
  }
}
