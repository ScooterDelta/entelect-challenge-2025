import fs from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const currentDirectory = dirname(fileURLToPath(import.meta.url));

export const writeOutput = async (challengeId: number, attempt:number, grid: number[][]): Promise<void> => {
  const outputPath = join(currentDirectory, '..', 'output', `${challengeId}.${attempt}.txt`);

  const output = { zoo: grid };

  await fs.writeFile(outputPath, JSON.stringify(output, null, 2), 'utf-8');
}
