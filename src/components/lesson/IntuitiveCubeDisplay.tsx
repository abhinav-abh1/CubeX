"use client";

import { useEffect } from "react";
import { useCubeStore } from "@/lib/cube-engine/store";
import { createWhiteCrossExampleCube } from "@/lib/cube-engine/examples";
import CubeCanvas from "@/components/cube/CubeCanvas";


export default function IntuitiveCubeDisplay() {
    const setCube = useCubeStore((s) => s.setCube);

    useEffect(() => {
        setCube(createWhiteCrossExampleCube());

    }, []);

    return <CubeCanvas controls={false} />;
}