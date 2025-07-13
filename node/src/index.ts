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

const targets = {
  1: {
    resourceCalc: resourceValueBase,
    placementCalc: canPlace,
    spacing: 1,
    budget: 999999999999999,
    scoreCalc: calculateScore,
  },
  2: {
    resourceCalc: resourceValueBase,
    placementCalc: canPlaceCompat,
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

for (const [target, funcs] of Object.entries(targets)) {
  const input = await readInputFile(parseInt(target));

  const allowedResource = getAllowedResources(
    resources,
    input.available_resources,
  );
  let bestGrid = input.grid;
  let bestScore = -Infinity;

  for (let i = 0; i < 4; i++) {
    let resultGrid = fillGridDump(
      structuredClone(input.grid),
      allowedResource,
      funcs.placementCalc,
      funcs.resourceCalc,
      funcs.spacing,
      funcs.budget,
      "forward",
    );
    resultGrid = fillGridDump(
      structuredClone(resultGrid.grid),
      allowedResource,
      funcs.placementCalc,
      funcs.resourceCalc,
      funcs.spacing,
      funcs.budget,
      "left",
    );
    const score = funcs.scoreCalc(
      resultGrid.grid,
      allowedResource,
      target == "4" ? resultGrid.cost : 0,
    );
    if (score > bestScore) {
      bestScore = score;
      bestGrid = resultGrid.grid;
    }

    console.log(`Run ${i + 1}: Score = ${score}`);
  }
  console.log(`Score ${target}: ${funcs.scoreCalc(bestGrid, allowedResource)}`);
  await writeOutput(parseInt(target), bestGrid);
}
