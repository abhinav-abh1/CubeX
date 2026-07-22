import { createSolvedCube } from "./cube";
import type { CubeState, CubieState, FaceColors, Vec3 } from "./types";

function pieceTypeOf(position: Vec3): "corner" | "edge" | "center" {
    const nonZeroCount = position.filter((v) => v !== 0).length;
    if (nonZeroCount === 3) return "corner";
    if (nonZeroCount === 2) return "edge";
    return "center";
}

function isWhiteCrossEdge(position: Vec3): boolean {
    const [, y] = position;
    return y === 1 && pieceTypeOf(position) === "edge";
}


function cycleStickers(colors: FaceColors): FaceColors {
    const paintedSlots = colors
        .map((c, i) => (c !== null ? i : -1))
        .filter((i) => i !== -1);

    const result = [...colors] as FaceColors;
    paintedSlots.forEach((slot, i) => {
        const sourceSlot = paintedSlots[(i + paintedSlots.length - 1) % paintedSlots.length];
        result[slot] = colors[sourceSlot];
    });
    return result;
}


export function createWhiteCrossExampleCube(): CubeState {
    const solved = createSolvedCube();

    const cubies: CubieState[] = solved.cubies.map((cubie) => {
        if (isWhiteCrossEdge(cubie.position)) {
            return cubie;
        }

        const type = pieceTypeOf(cubie.position);
        if (type === "corner" || type === "edge") {
            return { ...cubie, colors: cycleStickers(cubie.colors) };
        }
        return cubie;
    });

    return { cubies };
}