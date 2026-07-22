"use client";

import { forwardRef, useMemo } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three-stdlib";
import { CUBE_COLORS } from "@/lib/cube-engine/colors";
import type { FaceColors, Vec3 } from "@/lib/cube-engine/types";

const CUBIE_SIZE = 0.94;
const SPACING = 1.02;
// Corner rounding — this is what gives the "pillowed" stickerless look.
// Higher segments = smoother curve, but 4 is already plenty for this size.
const CUBIE_RADIUS = 0.09;
const CUBIE_SEGMENTS = 4;

// Still ONE shared geometry instance for all 26 cubies — rounding adds
// more vertices than a plain box, but it's a single shared buffer, so
// the cost is paid once, not per-cubie.
const cubieGeometry = new RoundedBoxGeometry(
  CUBIE_SIZE,
  CUBIE_SIZE,
  CUBIE_SIZE,
  CUBIE_SEGMENTS,
  CUBIE_RADIUS
);

const materialCache = new Map<string, THREE.MeshPhysicalMaterial>();
function getMaterial(color: string): THREE.MeshPhysicalMaterial {
  let material = materialCache.get(color);
  if (!material) {
    material = new THREE.MeshPhysicalMaterial({
      color,
      roughness: 0.4,          // was 0.25 — softer, less mirror-like base surface
      metalness: 0,
      clearcoat: 0.6,          // was 1 — a hint of gloss instead of full lacquer
      clearcoatRoughness: 0.4, // was 0.15 — spreads the highlight instead of a sharp hotspot
      envMapIntensity: 0.5,    // new — halves how strongly the environment reflects in
    });
    materialCache.set(color, material);
  }
  return material;
}

interface CubieProps {
  position: Vec3;
  quaternion: [number, number, number, number];
  colors: FaceColors;
}

const Cubie = forwardRef<THREE.Group, CubieProps>(function Cubie(
  { position, quaternion, colors },
  ref
) {
  const colorKey = colors.join("|");
  const materials = useMemo(
    () => colors.map((color) => getMaterial(color ?? CUBE_COLORS.INTERIOR)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [colorKey]
  );

  return (
    <group
      ref={ref}
      position={[position[0] * SPACING, position[1] * SPACING, position[2] * SPACING]}
      quaternion={quaternion}
    >
      <mesh geometry={cubieGeometry} material={materials} />
    </group>
  );
});

export default Cubie;