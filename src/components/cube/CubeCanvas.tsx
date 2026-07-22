"use client";

import { useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import type { RootState } from "@react-three/fiber";
import RubiksCube from "./RubiksCube";
import PlaybackControls from "./PlaybackControls";

interface CubeCanvasProps {
  controls?: boolean;
}

export default function CubeCanvas({ controls = true }: CubeCanvasProps) {
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
        <Canvas
          camera={{ position: [4, 4, 5], fov: 40 }}
          onCreated={handleCreated}
          dpr={[1, 1.5]}
          gl={{ antialias: true, powerPreference: "high-performance" }}
          performance={{ min: 0.5 }}
        >
          <ambientLight intensity={0.45} />
          <directionalLight position={[5, 8, 5]} intensity={0.75} />
          <directionalLight position={[-5, -5, -5]} intensity={0.2} />
          <Environment preset="studio" resolution={256} background={false} />
          <RubiksCube />
          <OrbitControls enableZoom enablePan={false} makeDefault />
        </Canvas>
      </div>
      {controls && <PlaybackControls />}
    </div>
  );
}