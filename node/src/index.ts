import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { readInputFile } from "./input-reader";
import { ResourcesData } from "./types/resources";

const currentDirectory = dirname(fileURLToPath(import.meta.url));

const resources: ResourcesData = JSON.parse(readFileSync(join(currentDirectory, "..", "input", "resources.json"), "utf-8"));
const input1 = await readInputFile(1);

console.log("Resources Data Loaded Successfully");
