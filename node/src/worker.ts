// worker.ts
import { parentPort, workerData } from "worker_threads";
import {
  fillGridDump,
} from "./grid2";

const { grid, allowedResource, placementCalc, resourceCalc,scoreCalc,budget, spacing, target } = workerData;

console.log(workerData);

const firstPass = fillGridDump(
  structuredClone(grid),
  allowedResource,
  placementCalc,
  resourceCalc,
  spacing,
  budget,
  "forward"
);

const secondPass = fillGridDump(
  structuredClone(firstPass.grid),
  allowedResource,
  placementCalc,
  resourceCalc,
  spacing,
  budget,
  "left"
);

const score = scoreCalc(
  secondPass.grid,
  allowedResource,
  target === 4 ? secondPass.cost : undefined
);

parentPort?.postMessage({ score, grid: secondPass.grid });
