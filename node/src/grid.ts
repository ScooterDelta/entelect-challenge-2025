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

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}


export function fillGridLookahead(
  grid: number[][],
  resources: Resource[]
): number[][] {
  let improved = true;

  while (improved) {
    improved = false;

    let bestOverallGrid = grid;
    let bestOverallScore = calculateScore(grid);

    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[0].length; x++) {
        for (const resourceDef of resources) {
          for (const orientation of resourceDef.orientations) {
            if (!canPlace(grid, orientation.cells, y, x)) continue;

            const firstPlacedGrid = placeShape(grid, orientation.cells, y, x, resourceDef.resource_id);
            const firstScore = calculateScore(firstPlacedGrid);

            let bestNextScore = firstScore;
            let bestNextGrid = firstPlacedGrid;

            for (let y2 = 0; y2 < grid.length; y2++) {
              for (let x2 = 0; x2 < grid[0].length; x2++) {
                for (const res2 of resources) {
                  for (const orient2 of res2.orientations) {
                    if (!canPlace(firstPlacedGrid, orient2.cells, y2, x2)) continue;

                    const secondPlacedGrid = placeShape(firstPlacedGrid, orient2.cells, y2, x2, res2.resource_id);
                    const secondScore = calculateScore(secondPlacedGrid);

                    if (secondScore > bestNextScore) {
                      bestNextScore = secondScore;
                      bestNextGrid = secondPlacedGrid;
                    }
                  }
                }
              }
            }

            if (bestNextScore > bestOverallScore) {
              bestOverallScore = bestNextScore;
              bestOverallGrid = bestNextGrid;
              improved = true;
            }
          }
        }
      }
    }

    grid = bestOverallGrid;
  }

  return grid;
}

export function fillGridDumpLookaheadDepth2(
  grid: number[][],
  resources: Resource[]
): number[][] {
  let improved = true;

  while (improved) {
    improved = false;
    let bestOverallGrid = grid;
    let bestOverallScore = calculateScore(grid);

    // Shuffle resource list for this round
    const shuffledResources = shuffle(resources);

    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[0].length; x++) {
        for (const resourceDef of shuffledResources) {
          for (const orientation of resourceDef.orientations) {
            if (!canPlace(grid, orientation.cells, y, x)) continue;

            const firstGrid = placeShape(grid, orientation.cells, y, x, resourceDef.resource_id);
            const firstScore = calculateScore(firstGrid);

            for (let y2 = 0; y2 < grid.length; y2++) {
              for (let x2 = 0; x2 < grid[0].length; x2++) {
                for (const res2 of shuffle(resources)) {
                  for (const orient2 of res2.orientations) {
                    if (!canPlace(firstGrid, orient2.cells, y2, x2)) continue;

                    const secondGrid = placeShape(firstGrid, orient2.cells, y2, x2, res2.resource_id);
                    const secondScore = calculateScore(secondGrid);

                    for (let y3 = 0; y3 < grid.length; y3++) {
                      for (let x3 = 0; x3 < grid[0].length; x3++) {
                        for (const res3 of shuffle(resources)) {
                          for (const orient3 of res3.orientations) {
                            if (!canPlace(secondGrid, orient3.cells, y3, x3)) continue;

                            const thirdGrid = placeShape(secondGrid, orient3.cells, y3, x3, res3.resource_id);
                            const thirdScore = calculateScore(thirdGrid);

                            if (thirdScore > bestOverallScore) {
                              bestOverallScore = thirdScore;
                              bestOverallGrid = thirdGrid;
                              improved = true;
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    grid = bestOverallGrid;
  }

  return grid;
}
