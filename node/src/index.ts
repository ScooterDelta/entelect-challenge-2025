import { getAllowedResources } from "./get-resources";
import { fillGridDump } from "./grid";
import { readInputFile } from "./input-reader";
import { readResourceFile } from "./resource-reader";
import { calculateScore } from "./score";
import { ResourcesData } from "./types/resources";

const resources: ResourcesData = readResourceFile();
const input1 = await readInputFile(1);

console.log("Resources Data Loaded Successfully");

const allowedReaources = getAllowedResources(resources,input1.available_resources);


const resultGrid = fillGridDump(input1.grid, allowedReaources);

console.log(resultGrid);
console.log(calculateScore(resultGrid));