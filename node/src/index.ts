import { getAllowedResources } from "./get-resources";
import { canPlaceCompat, fillGridDump } from "./grid";
import { readInputFile } from "./input-reader";
import { readResourceFile } from "./resource-reader";
import { calculateScore } from "./score";
import { ResourcesData } from "./types/resources";
import { writeOutput } from "./write-output";

const resources: ResourcesData = readResourceFile();

const targets = [2, 3, 4];

for (const target of targets) {
  const input = await readInputFile(target);

  const allowedResource = getAllowedResources(resources, input.available_resources);

  const resultGrid = fillGridDump(input.grid, allowedResource, canPlaceCompat, calculateScore);

  console.log(`Score ${target}: ${calculateScore(resultGrid)}`);
  await writeOutput(target, resultGrid);
};
