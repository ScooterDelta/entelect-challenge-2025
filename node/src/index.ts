import { readInputFile } from "./input-reader";
import { readResourceFile } from "./resource-reader";
import { ResourcesData } from "./types/resources";

const resources: ResourcesData = readResourceFile();
const input1 = await readInputFile(1);

console.log("Resources Data Loaded Successfully");
