import {
  minCostResourceValue,
  resourceValueBase,
  resourceValueBasic,
} from "./grid2";
import { readResourceFile } from "./resource-reader";
import { calculateScore, calculateScoreInterest } from "./score";
import { ResourcesData } from "./types/resources";

const resources: ResourcesData = readResourceFile();

//TODO - Ensure the scoring algorithm is correct!
//TODO - Super cheap (+ Random!) placement algorithm!
const targets = {
  1: {
    resourceCalc: resourceValueBase,
    scoreCalc: calculateScore,
  },
  2: {
    resourceCalc: resourceValueBase,
    scoreCalc: calculateScore,
  },
  3: {
    resourceCalc: resourceValueBasic,
    scoreCalc: calculateScoreInterest,
  },
  4: {
    resourceCalc: minCostResourceValue,
    scoreCalc: calculateScoreInterest,
  },
};
