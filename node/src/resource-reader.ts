import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { ResourcesData } from "./types/resources";

const currentDirectory = dirname(fileURLToPath(import.meta.url));

export const readResourceFile = (): ResourcesData => {
  return JSON.parse(readFileSync(join(currentDirectory, "..", "input", "resources.json"), "utf-8"))
}
