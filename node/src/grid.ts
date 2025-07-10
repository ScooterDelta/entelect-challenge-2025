import { calculateScore } from "./score";
import { Resource } from "./types/resources";

export function canPlace(grid: number[][], shape: [number, number][], top: number, left: number): boolean {
    for (const [dy, dx] of shape) {
      const y = top + dy;
      const x = left + dx;
      if (
        y < 0 || y >= grid.length ||
        x < 0 || x >= grid[0].length ||
        grid[y][x] !== 1
      ) {
        return false;
      }
    }
    return true;
}

export function placeShape(grid: number[][], shape: [number, number][], top: number, left: number, resource_id: number): number[][] {
    for (const [dy, dx] of shape) {
        grid[top + dy][left + dx] = resource_id;
    }
    return grid;
  }


export function scorePlacement(grid: number[][]): number {
    let score = 0;
    for (const row of grid) {
      if (row.every(cell => cell != 1)) score += 100;
    }
    return score;
 }
  

 export function fillGridDump(
    grid: number[][],
    resources: Resource[]
  ): number[][] {
    let improved = true;
  
    while (improved) {
      improved = false;
      let bestGrid = grid;
      let bestScore = calculateScore(grid);
  
      for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[0].length; x++) {
          for (const resourceDef of resources) {
            for (const orientation of resourceDef.orientations) {
              if (canPlace(grid, orientation.cells, y, x)) {
                const newGrid = placeShape(grid, orientation.cells, y, x, resourceDef.resource_id);
                const newScore = calculateScore(newGrid);
  
                if (newScore > bestScore) {
                  bestScore = newScore;
                  bestGrid = newGrid;
                  improved = true;
                }
              }
            }
          }
        }
      }
  
      grid = bestGrid;
    }
  
    return grid;
  }
  