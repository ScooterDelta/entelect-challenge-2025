import { Resource } from "./types/resources";

const calculateSimpsonsIndex = (grid: number[][]): number => {
  const flatGrid = grid.flat();
  // Filter out paths (value 1) to only consider creature types
  const creatures = flatGrid.filter(cell => cell !== 1);

  if (creatures.length === 0) {
    return 1; // No diversity if no creatures
  }

  // Count occurrences of each creature type
  const typeCounts = new Map<number, number>();
  creatures.forEach(type => {
    typeCounts.set(type, (typeCounts.get(type) || 0) + 1);
  });

  const totalCreatures = creatures.length;

  // Calculate Simpson's Index: D = Σ(n(n-1)) / (N(N-1))
  let sumNiNiMinus1 = 0;
  typeCounts.forEach(count => {
    sumNiNiMinus1 += count * (count - 1);
  });

  if (totalCreatures <= 1) {
    return 1; // Maximum dominance when only one creature or less
  }

  return sumNiNiMinus1 / (totalCreatures * (totalCreatures - 1));
};
const calculateUniqueResources = (addedResources: number[]): number => [...new Set(addedResources)].length;
const calculateTotalCellsInGrid = (grid: number[][]): number => grid.flat().length;
const calculateTotalPathArea = (grid: number[][]): number => grid.flat().filter(s => s === 1).length;

const calculateTotalUsableScore = (grid: number[][]): number => calculateTotalCellsInGrid(grid) - calculateTotalPathArea(grid);
const calculateBalanceMultiplier = (grid: number[][],addedResources: number[]): number => (calculateUniqueResources(addedResources) + (1 / calculateSimpsonsIndex(grid))) / 2;


export const calculateScore = (grid: number[][],
  resources: Resource[],
  addedResources: number[],
  cost: number = 0): number => {
  return calculateTotalUsableScore(grid) * calculateBalanceMultiplier(grid,addedResources);
}

export const calculateScoreInterest = (
  grid: number[][],
  resources: Resource[],
  addedResources: number[],
  cost: number = 0,
): number => {
  const flat = grid.flat();
  const totalPath = flat.filter(cell => cell === 1).length;
  const totalCells = flat.length;
  const totalUsable = totalCells - totalPath;

  // Create map of resource_id to interest_factor
  const interestMap = new Map<number, number>();
  for (const res of resources) {
    interestMap.set(res.resource_id, res.interest_factor);
  }

  // Sum interest of placed resources
  let totalInterest = 0;
  for (const cell of flat) {
    if (cell !== 1 && interestMap.has(cell)) {
      totalInterest += interestMap.get(cell)!;
    }
  }

  // Diversity-related balance
  const uniqueCount = new Set(addedResources).size;
  const simpsonsIndex = calculateSimpsonsIndex(grid);
  const balanceMultiplier = (uniqueCount + (1 / simpsonsIndex)) / 2;

  // Final score
  return totalInterest * balanceMultiplier / (1+cost);
};

