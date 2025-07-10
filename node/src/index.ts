import { getAllowedResources } from "./get-resources";
import { canPlace, canPlaceCompat, fillGridDump, resourceValueBasic } from "./grid";
import { readInputFile } from "./input-reader";
import { readResourceFile } from "./resource-reader";
import { calculateScore } from "./score";
import { ResourcesData } from "./types/resources";
import { writeOutput } from "./write-output";

const resources: ResourcesData = readResourceFile();

const targets = {
  1: { resourceCalc: resourceValueBasic, placementCalc: canPlace },
  2: { resourceCalc: resourceValueBasic, placementCalc: canPlaceCompat },
  3: { resourceCalc: resourceValueBasic, placementCalc: canPlaceCompat },
  4: { resourceCalc: resourceValueBasic, placementCalc: canPlaceCompat }
}

for (const [target, funcs] of Object.entries(targets)) {
  const input = await readInputFile(parseInt(target));

  const allowedResource = getAllowedResources(resources, input.available_resources);

  const resultGrid = fillGridDump(input.grid, allowedResource, funcs.placementCalc, funcs.resourceCalc);

  console.log(`Score ${target}: ${calculateScore(resultGrid)}`);
  await writeOutput(parseInt(target), resultGrid);
};
