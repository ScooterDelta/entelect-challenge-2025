import { getAllowedResources } from "./get-resources";
import {
  canPlace,
  canPlaceCompat,
  canPlaceCompatUnUsedValue,
  fillGridDump,
  minCostResourceValue,
  resourceValueBase,
  resourceValueBasic,
} from "./grid2";
import { readInputFile } from "./input-reader";
import { readResourceFile } from "./resource-reader";
import { calculateScore, calculateScoreInterest } from "./score";
import { ResourcesData } from "./types/resources";
import { writeOutput } from "./write-output";

import { Worker } from "worker_threads";

const resources: ResourcesData = readResourceFile();

type TargetConfig = {
  resourceCalc: (r: any) => number;
  placementCalc: (
    grid: number[][],
    shape: [number, number][],
    top: number,
    left: number,
    resource: any
  ) => number;
  spacing: number;
  budget: number;
  scoreCalc: (
    grid: number[][],
    resources: any,
    cost?: number
  ) => number;
};

const targets: Record<number, TargetConfig> = {
  1: {
    resourceCalc: resourceValueBase,
    placementCalc: canPlace,
    spacing: 1,
    budget: 999999999999999,
    scoreCalc: calculateScore,
  },
  2: {
    resourceCalc: resourceValueBase,
    placementCalc: canPlaceCompat,
    spacing: 1,
    budget: 999999999999999,
    scoreCalc: calculateScore,
  },
  3: {
    resourceCalc: resourceValueBasic,
    placementCalc: canPlaceCompatUnUsedValue,
    spacing: 1,
    budget: 9999999999999999,
    scoreCalc: calculateScoreInterest,
  },
  4: {
    resourceCalc: minCostResourceValue,
    placementCalc: canPlaceCompatUnUsedValue,
    spacing: 1,
    budget: 1200000000,
    scoreCalc: calculateScoreInterest,
  },
};


function runWorker(data: any): Promise<any> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(
  new URL('./worker.ts', import.meta.url),  // Correct path for ESM
  {
    workerData: data,
    execArgv: ['--loader', 'ts-node/esm'], // Needed for TypeScript
  }
);

    worker.on("message", resolve);
    worker.on("error", reject);
    worker.on("exit", (code) => {
      if (code !== 0) reject(new Error(`Worker stopped with exit code ${code}`));
    });
  });
}

for (const [targetStr, funcs] of Object.entries(targets)) {
  const target = parseInt(targetStr);
  const input = await readInputFile(target);
  const allowedResource = getAllowedResources(resources, input.available_resources);
  const  placementCalc = funcs.placementCalc;
  const  resourceCalc = funcs.resourceCalc
  const  scoreCalc = funcs.scoreCalc
  const tasks = Array.from({ length: 1 }, () =>
    runWorker({
      grid: input.grid,
      allowedResource,
      placementCalc,
      resourceCalc,
      scoreCalc,
      budget: funcs.budget,
      spacing: funcs.spacing,
    })
  );

  const results = await Promise.all(tasks);
  const best = results.reduce((a, b) => (b.score > a.score ? b : a));

  console.log(`Final Best Score for Target ${target}: ${best.score}`);
  await writeOutput(target, best.grid);
}
