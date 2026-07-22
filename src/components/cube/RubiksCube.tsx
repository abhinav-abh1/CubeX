"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import Cubie from "./Cubie";
import { MOVE_DURATION_MS, useCubeStore } from "@/lib/cube-engine/store";
import { moveAngle, moveAxis, moveLayer } from "@/lib/cube-engine/cube";
import type { Axis } from "@/lib/cube-engine/types";

const AXIS_INDEX: Record<Axis, 0 | 1 | 2> = { x: 0, y: 1, z: 2 };
const AXIS_VECTOR: Record<Axis, THREE.Vector3> = {
  x: new THREE.Vector3(1, 0, 0),
  y: new THREE.Vector3(0, 1, 0),
  z: new THREE.Vector3(0, 0, 1),
};

export default function RubiksCube() {
  const cube = useCubeStore((s) => s.cube);
  const animating = useCubeStore((s) => s.animating);
  const queue = useCubeStore((s) => s.queue);
  const paused = useCubeStore((s) => s.paused);
  const speed = useCubeStore((s) => s.speed);
  const startNextMove = useCubeStore((s) => s.startNextMove);
  const completeCurrentMove = useCubeStore((s) => s.completeCurrentMove);

  const pivotRef = useRef<THREE.Group>(null);
  const elapsedRef = useRef(0);

  useEffect(() => {
    elapsedRef.current = 0;
  }, [animating]);

  useFrame((_, delta) => {

    if (paused) return;

    if (!animating) {
      if (queue.length > 0) startNextMove();
      return;
    }

    elapsedRef.current += delta * 1000 * speed;
    const progress = Math.min(elapsedRef.current / MOVE_DURATION_MS, 1);
    const targetAngle = moveAngle(animating.move);
    const axis = moveAxis(animating.move);

    if (pivotRef.current) {
      pivotRef.current.quaternion.setFromAxisAngle(AXIS_VECTOR[axis], targetAngle * progress);
    }

    if (progress >= 1) {
      completeCurrentMove();
    }
  });

  const { movingCubies, staticCubies } = useMemo(() => {
    if (!animating) {
      return { movingCubies: [], staticCubies: cube.cubies };
    }
    const axisIndex = AXIS_INDEX[moveAxis(animating.move)];
    const layer = moveLayer(animating.move);
    const moving = cube.cubies.filter((c) => Math.round(c.position[axisIndex]) === layer);
    const stationary = cube.cubies.filter((c) => Math.round(c.position[axisIndex]) !== layer);
    return { movingCubies: moving, staticCubies: stationary };
  }, [cube, animating]);

  return (
    <group>
      {staticCubies.map((cubie) => (
        <Cubie
          key={cubie.id}
          position={cubie.position}
          quaternion={cubie.quaternion}
          colors={cubie.colors}
        />
      ))}
      {animating && (
        <group ref={pivotRef}>
          {movingCubies.map((cubie) => (
            <Cubie
              key={cubie.id}
              position={cubie.position}
              quaternion={cubie.quaternion}
              colors={cubie.colors}
            />
          ))}
        </group>
      )}
    </group>
  );
}