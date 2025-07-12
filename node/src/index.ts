import { getAllowedResources } from "./get-resources";
import {
  canPlace,
  canPlaceCompat,
  canPlaceCompatUnUsedValue,
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
    cost?: number
  ) => number;
};

const targets = {
  //1: {resourceCalc: resourceValueBase,placementCalc: canPlace,spacing: 1,budget: 999999999999999, scoreCalc: calculateScore},
  //2: { resourceCalc: resourceValueBase, placementCalc: canPlaceCompat,spacing: 1, budget: 999999999999999, scoreCalc: calculateScore},
  3: { resourceCalc: resourceValueBasic, placementCalc: canPlaceCompatUnUsedValue, spacing: 1, budget: 9999999999999999, scoreCalc: calculateScoreInterest   },
  4: { resourceCalc: minCostResourceValue,placementCalc: canPlaceCompatUnUsedValue, spacing: 1, budget: 1200000000, scoreCalc: calculateScoreInterest },        
};

for (const [targetStr, funcs] of Object.entries(targets)) {
  const target = parseInt(targetStr);
  const input = await readInputFile(target);
  const allowedResource = getAllowedResources(resources, input.available_resources);

  const attempts = Array.from({ length: 1000 }, (_, i) => i).map(async (i) => {
    const firstPass = fillGridDump(
      structuredClone(input.grid),
      allowedResource,
      funcs.placementCalc,
      funcs.resourceCalc,
      funcs.spacing,
      funcs.budget,
      "forward"
    );

    const secondPass = fillGridDump(
      structuredClone(firstPass.grid),
      allowedResource,
      funcs.placementCalc,
      funcs.resourceCalc,
      funcs.spacing,
      funcs.budget,
      "left"
    );

    const score = funcs.scoreCalc(
      secondPass.grid,
      allowedResource,
      target === 4 ? secondPass.cost : undefined
    );

    console.log(`Run ${i + 1}: Score = ${score}`);
    return { score, grid: secondPass.grid };
  });

  const results = await Promise.all(attempts);
  const best = results.reduce((a, b) => (b.score > a.score ? b : a));

  console.log(`Final Best Score for Target ${target}: ${best.score}`);
  await writeOutput(target, best.grid);
}  