import { getAllowedResources } from "./get-resources";
import { canPlace, canPlaceCompat, canPlaceCompatUnUsedValue, fillGridDump, fillGridGreedy, minCostResourceValue, resourceValueBase, resourceValueBasic, resourceValueInterest } from "./grid2";
import { readInputFile } from "./input-reader";
import { readResourceFile } from "./resource-reader";
import { calculateScore } from "./score";
import { ResourcesData } from "./types/resources";
import { writeOutput } from "./write-output";

const resources: ResourcesData = readResourceFile();

const targets = {
  1: { resourceCalc: resourceValueBase, placementCalc: canPlace, spacing: 1, budget: 999999999999999 },
  2: { resourceCalc: resourceValueBase, placementCalc: canPlaceCompat, spacing: 1, budget: 999999999999999  },
  //3: { resourceCalc: resourceValueBasic, placementCalc: canPlaceCompatUnUsedValue, spacing: 1, budget: 9999999999999999  },
  4: { resourceCalc: minCostResourceValue, placementCalc: canPlaceCompat, spacing: 1, budget: 12000000000  }
}

for (const [target, funcs] of Object.entries(targets)) {
  const input = await readInputFile(parseInt(target));

  const allowedResource = getAllowedResources(resources, input.available_resources);

  let resultGrid = fillGridDump(input.grid, allowedResource, funcs.placementCalc, funcs.resourceCalc, funcs.spacing, funcs.budget, "forward");
  resultGrid = fillGridDump(resultGrid, allowedResource, funcs.placementCalc, funcs.resourceCalc, funcs.spacing, funcs.budget, "reverse" );

  console.log(`Score ${target}: ${calculateScore(resultGrid)}`);
  await writeOutput(parseInt(target), resultGrid);
};
