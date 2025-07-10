import fs from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const currentDirectory = dirname(fileURLToPath(import.meta.url));

export const writeOutput = async (challengeId: number, grid: number[][]): Promise<void> => {
  const outputPath = join(currentDirectory, '..', 'output', `${challengeId}.txt`);

  const output = { grid };

  await fs.writeFile(outputPath, JSON.stringify(grid, null, 2), 'utf-8');
}
