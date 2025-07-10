const calculateSimpsonsIndex = (grid: number[][]): number => 1;
const calculateUniqueResources = (grid: number[][]): number => [...new Set(grid.flat().filter(s => s != 1))].length;
const calculateTotalCellsInGrid = (grid: number[][]): number => grid.flat().length;
const calculateTotalPathArea = (grid: number[][]): number => grid.flat().filter(s => s === 1).length;

const calculateTotalUsableScore = (grid: number[][]): number => calculateTotalCellsInGrid(grid) - calculateTotalPathArea(grid);
const calculateBalanceMultiplier = (grid: number[][]): number => (calculateUniqueResources(grid) + (1 / calculateSimpsonsIndex(grid))) / 2;


export const calculateScore = (grid: number[][]): number => {
  return calculateTotalUsableScore(grid) * calculateBalanceMultiplier(grid);
}
