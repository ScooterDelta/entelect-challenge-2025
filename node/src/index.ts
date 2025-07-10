import { getAllowedResources } from "./get-resources";
import { canPlace, fillGridDump } from "./grid";
import { readInputFile } from "./input-reader";
import { readResourceFile } from "./resource-reader";
import { calculateScore } from "./score";
import { ResourcesData } from "./types/resources";
import { writeOutput } from "./write-output";

const resources: ResourcesData = readResourceFile();

const targets = [1];

for (const target of targets) {
  const input = await readInputFile(target);

  const allowedResource = getAllowedResources(resources, input.available_resources);

  const resultGrid = fillGridDump(input.grid, allowedResource, canPlace, calculateScore);

  console.log(`Score ${target}: ${calculateScore(resultGrid)}`);
  await writeOutput(target, resultGrid);
};
