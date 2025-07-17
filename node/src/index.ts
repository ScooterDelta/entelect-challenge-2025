import { getAllowedResources } from "./get-resources";
import {
  canPlace,
  canPlaceCompatUnUsedValue,
  fillGridBeamSearch,
  fillGridDump,
  minCostResourceValue,
  resourceValueBase,
  resourceValueBasic,
} from "./grid2";
import { readInputFile } from "./input-reader";
import { readResourceFile } from "./resource-reader";
import { calculateScore, calculateScoreInterest } from "./score";
import { ResourcesData } from "./types/resources";
import { writeOutput } from "./write-output";

const resources: ResourcesData = readResourceFile();

type TargetConfig = {
  resourceCalc: (r: any) => number;
  placementCalc: (
    grid: number[][],
    shape: [number, number][],
    top: number,
    left: number,
    resource: any
  ) => number;
  spacing: number;
  budget: number;
  scoreCalc: (
    grid: number[][],
    resources: any,
    addedResources: number[],
    cost?: number,
  ) => number;
};

const targets: Record<number, TargetConfig> = {
  2: {
    resourceCalc: resourceValueBase,
    placementCalc: canPlaceCompatUnUsedValue,
    spacing: 1,
    budget: 999999999999999,
    scoreCalc: calculateScore,
  },
  3: {
    resourceCalc: resourceValueBasic,
    placementCalc: canPlaceCompatUnUsedValue,
    spacing: 1,
    budget: 9999999999999999,
    scoreCalc: calculateScoreInterest,
  },
  4: {
    resourceCalc: minCostResourceValue,
    placementCalc: canPlaceCompatUnUsedValue,
    spacing: 1,
    budget: 1200000000,
    scoreCalc: calculateScoreInterest,
  },
};

for (const [targetStr, funcs] of Object.entries(targets)) {
  const target = parseInt(targetStr);
  const input = await readInputFile(target);
  const allowedResource = getAllowedResources(
    resources,
    input.available_resources
  );

  let bestScore = -Infinity;
  let bestGrid = input.grid;

  const runCount = 1;
  const saveInterval = 1;

  for (let i = 0; i < runCount; i++) {
    console.log(`Attempt ${i + 1}/${runCount}`);

    /*const firstPass = fillGridDump(
      structuredClone(input.grid),
      allowedResource,
      funcs.placementCalc,
      funcs.resourceCalc,
      funcs.scoreCalc,
      funcs.spacing,
      funcs.budget,
      "forward"
    );
*/
const firstPass = fillGridBeamSearch(
      structuredClone(input.grid),
      allowedResource,
      funcs.placementCalc,
      funcs.resourceCalc,
      funcs.scoreCalc,
      funcs.spacing,
      funcs.budget,
      2,
    );
    
    const score = funcs.scoreCalc(
      firstPass.grid,
      allowedResource,
      firstPass.addedResources,
      target === 4 ? firstPass.cost : undefined,
    );

    console.log(`Run ${i + 1}: Score = ${score} `);

    if (score > bestScore) {
      bestScore = score;
      bestGrid = firstPass.grid;
    }
     if ((i + 1) % saveInterval === 0) {
        console.log(`⬆️ New best at attempt ${i + 1}: Score = ${bestScore}`);
        await writeOutput(target,i, bestGrid);
      }
  }

  console.log(`🏁 Final Best Score for Target ${target}: ${bestScore}`);
  await writeOutput(target, 0, bestGrid);
}
