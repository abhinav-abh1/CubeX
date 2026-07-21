// Grid coordinate: always one of -1, 0, 1 on each axis.
export type Coord = -1 | 0 | 1;
export type Vec3 = [number, number, number];

// A single sticker color, or null for an interior (unpainted / black plastic) face.
export type StickerColor = string | null;

// Face order matches Three.js BoxGeometry material array order:
// [+x (right), -x (left), +y (top), -y (bottom), +z (front), -z (back)]
export type FaceColors = [
  StickerColor,
  StickerColor,
  StickerColor,
  StickerColor,
  StickerColor,
  StickerColor
];

export interface CubieState {
  id: string;
  // Fixed local sticker colors, painted once at creation. These never change —
  // only the cubie's position/orientation in space changes as moves are applied.
  colors: FaceColors;
  // Current logical grid position, always integer coords in {-1,0,1}.
  position: Vec3;
  // Current orientation as a quaternion [x, y, z, w].
  quaternion: [number, number, number, number];
}

export type Axis = "x" | "y" | "z";

// The six face moves, using standard Singmaster notation.
export type FaceLetter = "U" | "D" | "L" | "R" | "F" | "B";

// A parsed move: which face, and how many quarter turns clockwise (1, 2, or 3 == counter-clockwise).
export interface Move {
  face: FaceLetter;
  turns: 1 | 2 | 3; // 1 = clockwise, 2 = double, 3 = counter-clockwise (i.e. 270° CW)
  raw: string; // original notation token, e.g. "R'", "U2"
}

export interface CubeState {
  cubies: CubieState[];
}
