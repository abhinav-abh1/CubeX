"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { CUBE_COLORS } from "@/lib/cube-engine/colors";
import type { FaceColors, Vec3 } from "@/lib/cube-engine/types";

// Slightly less than 1 so a visible gap appears between adjacent cubies,
// and slightly more than 1 spacing to match.
const CUBIE_SIZE = 0.94;
const SPACING = 1.02;

interface CubieProps {
  position: Vec3;
  quaternion: [number, number, number, number];
  colors: FaceColors;
}

export default function Cubie({ position, quaternion, colors }: CubieProps) {
  // BoxGeometry's default face groups are ordered [+x, -x, +y, -y, +z, -z],
  // which matches our FaceColors tuple exactly — so this array can be
  // passed straight to <mesh material={...}> for per-face materials.
  const materials = useMemo(
    () =>
      colors.map(
        (color) =>
          new THREE.MeshStandardMaterial({
            color: color ?? CUBE_COLORS.INTERIOR,
            roughness: 0.45,
            metalness: 0.05,
          })
      ),
    [colors]
  );

  return (
    <group
      position={[position[0] * SPACING, position[1] * SPACING, position[2] * SPACING]}
      quaternion={quaternion}
    >
      <mesh material={materials}>
        <boxGeometry args={[CUBIE_SIZE, CUBIE_SIZE, CUBIE_SIZE]} />
      </mesh>
    </group>
  );
}
