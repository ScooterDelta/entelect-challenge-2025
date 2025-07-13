import fs from "fs/promises";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { Challenge } from "./types/grid";

const currentDirectory = dirname(fileURLToPath(import.meta.url));

const zooSize = /Zoo Size:.(\d+)x(\d+)/g;
const resources = /Available Resources:.+\[(.+)]/g;

const createGrid = (rows: number, cols: number): number[][] => {
  const grid: number[][] = [];
  for (let i = 0; i < rows; i++) {
    const row: number[] = [];
    for (let j = 0; j < cols; j++) {
      row.push(1);
    }
    grid.push(row);
  }
  return grid;
};

export const readInputFile = async (
  challengeId: number,
): Promise<Challenge> => {
  const challengePath = join(
    currentDirectory,
    "..",
    "input",
    `${challengeId}.txt`,
  );
  const file = await fs.readFile(challengePath, "utf-8");

  const gridSize = [...file.matchAll(zooSize)][0];
  const resourcesNumbers = [...file.matchAll(resources)][0];

  if (!resourcesNumbers)
    throw new Error(
      `Available resources not found in challenge file: ${challengePath}`,
    );
  if (!gridSize)
    throw new Error(`Zoo size not found in challenge file: ${challengePath}`);

  const parsedGridSize = [parseInt(gridSize[1]), parseInt(gridSize[2])];
  return {
    grid: createGrid(parsedGridSize[0], parsedGridSize[1]),
    available_resources: resourcesNumbers[1]
      .split(", ")
      .map((r) => parseInt(r)),
    zoo_size: parsedGridSize,
    challenge_id: challengeId,
  };
};
