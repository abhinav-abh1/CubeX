import { parseAlgorithm } from "../src/lib/cube-engine/cube";
import { getAllLessons } from "../src/data/lessons";

let ok = 0;
let fail = 0;

console.log("Validating lesson data\n");

for (const lesson of getAllLessons()) {
  console.log(`${lesson.order}. ${lesson.title} (/learn/${lesson.slug})`);

  if (lesson.intuitive) {
    console.log("   intuitive stage, no algorithm — skipping parse check");
    ok++;
    continue;
  }

  if (lesson.cases.length === 0) {
    console.log("   FAIL: non-intuitive lesson has no cases defined");
    fail++;
    continue;
  }

  for (const c of lesson.cases) {
    try {
      const moves = parseAlgorithm(c.algorithm);
      console.log(`   ok  - case "${c.label}": ${moves.length} moves parsed`);
      ok++;
    } catch (err) {
      console.log(`   FAIL - case "${c.label}": ${(err as Error).message}`);
      fail++;
    }
  }
}

console.log(`\n${ok} ok, ${fail} failed`);
if (fail > 0) process.exit(1);
