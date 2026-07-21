import { CUBE_COLORS } from "@/lib/cube-engine/colors";

export interface FaceInfo {
    letter: "U" | "D" | "L" | "R" | "F" | "B";
    name: string;
    description: string;
    /** The face's real sticker color — reused from the cube engine so the
     * color-coding here always matches what's rendered on the 3D cube. */
    color: string;
}

export const FACES: FaceInfo[] = [
    {
        letter: "U",
        name: "Up",
        description: "The top face — turn it as viewed looking straight down from above.",
        color: CUBE_COLORS.U,
    },
    {
        letter: "L",
        name: "Left",
        description: "The left-hand face — turn it as viewed from the cube's left side.",
        color: CUBE_COLORS.L,
    },
    {
        letter: "F",
        name: "Front",
        description: "The face pointing toward you — turn it as viewed straight on.",
        color: CUBE_COLORS.F,
    },
    {
        letter: "R",
        name: "Right",
        description: "The right-hand face — turn it as viewed from the cube's right side.",
        color: CUBE_COLORS.R,
    },
    {
        letter: "B",
        name: "Back",
        description: "The face pointing away from you — turn it as viewed from behind the cube.",
        color: CUBE_COLORS.B,
    },
    {
        letter: "D",
        name: "Down",
        description: "The bottom face — turn it as viewed looking straight up from below.",
        color: CUBE_COLORS.D,
    },
];