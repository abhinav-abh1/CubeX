import { CUBE_COLORS } from "@/lib/cube-engine/colors";
import type { FaceLetter } from "@/lib/cube-engine/types";

function colorForToken(token: string): string {
    const letter = token[0] as FaceLetter;
    return CUBE_COLORS[letter] ?? "#f3f1ea";
}

export default function AlgorithmDisplay({ algorithm }: { algorithm: string }) {
    const tokens = algorithm.trim().split(/\s+/);

    return (
        <p className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-xl sm:text-2xl">
            {tokens.map((token, i) => (
                <span key={i} style={{ color: colorForToken(token) }}>
                    {token}
                </span>
            ))}
        </p>
    );
}