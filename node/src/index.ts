import { getAllowedResources } from "./get-resources";
import { canPlace, canPlaceCompat, fillGridDump, minCostResourceValue, resourceValueBasic } from "./grid";
import { readInputFile } from "./input-reader";
import { readResourceFile } from "./resource-reader";
import { calculateScore } from "./score";
import { ResourcesData } from "./types/resources";
import { writeOutput } from "./write-output";

const resources: ResourcesData = readResourceFile();

const targets = {
  1: { resourceCalc: resourceValueBasic, placementCalc: canPlace, limit: 9999999999999999, spacing: 1 },
  2: { resourceCalc: resourceValueBasic, placementCalc: canPlaceCompat, limit: 9999999999999999, spacing: 1 },
  3: { resourceCalc: resourceValueBasic, placementCalc: canPlaceCompat, limit: 9999999999999999, spacing: 1 },
  4: { resourceCalc: minCostResourceValue, placementCalc: canPlaceCompat, limit: 100000000, spacing: 1 }
}

for (const [target, funcs] of Object.entries(targets)) {
  const input = await readInputFile(parseInt(target));

  const allowedResource = getAllowedResources(resources, input.available_resources);

  const resultGrid = fillGridDump(input.grid, allowedResource, funcs.placementCalc, funcs.resourceCalc, funcs.spacing);

  console.log(`Score ${target}: ${calculateScore(resultGrid)}`);
  await writeOutput(parseInt(target), resultGrid);
};
