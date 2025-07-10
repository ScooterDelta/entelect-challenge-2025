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
const calculateUniqueResources = (grid: number[][]): number => [...new Set(grid.flat().filter(s => s != 1))].length;
const calculateTotalCellsInGrid = (grid: number[][]): number => grid.flat().length;
const calculateTotalPathArea = (grid: number[][]): number => grid.flat().filter(s => s === 1).length;

const calculateTotalUsableScore = (grid: number[][]): number => calculateTotalCellsInGrid(grid) - calculateTotalPathArea(grid);
const calculateBalanceMultiplier = (grid: number[][]): number => (calculateUniqueResources(grid) + (1 / calculateSimpsonsIndex(grid))) / 2;


export const calculateScore = (grid: number[][]): number => {
  return calculateTotalUsableScore(grid) * calculateBalanceMultiplier(grid);
}
