import { applyAlgorithm, createSolvedCube, isSolved } from "../src/lib/cube-engine/cube";

const candidates: { name: string; alg: string }[] = [
  { name: "White corners insert (sexy move)", alg: "R U R' U'" },
  { name: "Second layer edge — insert right", alg: "U R U' R' U' F' U F" },
  { name: "Second layer edge — insert left", alg: "U' L' U L U F U' F'" },
  { name: "OLL edge orientation", alg: "F R U R' U' F'" },
  { name: "OLL corner orientation (Sune)", alg: "R U R' U R U2 R'" },
  { name: "PLL corner permutation", alg: "R' F R' B2 R F' R' B2 R2" },
  { name: "PLL edge permutation", alg: "R U' R U R U R U' R' U' R2" },
];

const MAX_REPS = 60;

console.log("Checking algorithm order (reps from solved -> back to solved)\n");

for (const { name, alg } of candidates) {
  let state = createSolvedCube();
  let order: number | null = null;
  for (let i = 1; i <= MAX_REPS; i++) {
    state = applyAlgorithm(state, alg);
    if (isSolved(state)) {
      order = i;
      break;
    }
  }
  const status = order ? `order ${order}` : `NOT solved within ${MAX_REPS} reps (!)`;
  console.log(`${name.padEnd(35)} "${alg}"  ->  ${status}`);
}
