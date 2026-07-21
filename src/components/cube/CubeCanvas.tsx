"use client";

import { useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { RootState } from "@react-three/fiber";
import RubiksCube from "./RubiksCube";
import PlaybackControls from "./PlaybackControls";

export default function CubeCanvas() {
  const handleCreated = useCallback((state: RootState) => {
    const canvas = state.gl.domElement;

    const handleContextLost = (event: Event) => {
      event.preventDefault();
      console.warn("CubeX: WebGL context lost — attempting to restore automatically.");
    };

    const handleContextRestored = () => {
      console.info("CubeX: WebGL context restored.");
    };

    canvas.addEventListener("webglcontextlost", handleContextLost, false);
    canvas.addEventListener("webglcontextrestored", handleContextRestored, false);
  }, []);

  return (
    <div className="flex flex-col gap-3">
      <div className="h-[500px] w-full rounded-xl border border-graphite-700 bg-graphite-900">
        <Canvas camera={{ position: [4, 4, 5], fov: 40 }} onCreated={handleCreated}>
          <ambientLight intensity={0.7} />
          <directionalLight position={[5, 8, 5]} intensity={1} />
          <directionalLight position={[-5, -5, -5]} intensity={0.25} />
          <RubiksCube />
          <OrbitControls enableZoom enablePan={false} />
        </Canvas>
      </div>
      <PlaybackControls />
    </div>
  );
}