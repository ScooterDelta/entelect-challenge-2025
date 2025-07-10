import { Resource } from "./types/resources";

export function canPlace(grid: number[][], shape: [number, number][], top: number, left: number, resource: Resource): boolean {
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
export function canPlaceLevel4(
  grid: number[][],
  shape: [number, number][],
  top: number,
  left: number,
  resource: Resource,
): boolean {
  const incompatibleWith = resource.incompatible_with;

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

    for (let dy2 = -5; dy2 <= 5; dy2++) {
      for (let dx2 = -5; dx2 <= 5; dx2++) {
        const ny = y + dy2;
        const nx = x + dx2;
        if (
          ny >= 0 && ny < grid.length &&
          nx >= 0 && nx < grid[0].length
        ) {
          const nearby = grid[ny][nx];
          if (incompatibleWith.includes(nearby)) {
            return false;
          }
        }
      }
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

const resourceValue = (resource: Resource): number => resource.interest_factor / resource.orientations[0].cells.length;

const prioritizeResources = (grid: number[][], resources: Resource[]): Resource[] => {
  const usedResourceIds = [...new Set<number>(grid.flat())];
  const usedResources = resources.filter(r => !usedResourceIds.includes(r.resource_id));
  const unusedResources = resources.filter(r => !usedResourceIds.includes(r.resource_id));
  unusedResources.sort((a, b) => {
    const aValue = resourceValue(a);
    const bValue = resourceValue(b);
    return bValue - aValue; // Sort descending by value
  });

  return [...unusedResources, ...usedResources];
}


export function fillGridDump(
  grid: number[][],
  resources: Resource[],
  canPlaceFn: (
    grid: number[][],
    shape: [number, number][],
    top: number,
    left: number,
    resource: Resource
  ) => boolean,
  calculateScoreFn: (grid: number[][]) => number
): number[][] {
  // let improved = true;

  // while (improved) {
  //   improved = false;
  //   let bestGrid = grid;
  //   let bestScore = calculateScore(grid);

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      var orderedResources = prioritizeResources(grid, resources);
      for (const resourceDef of orderedResources) {
        for (const orientation of resourceDef.orientations) {
          if (canPlaceFn(grid, orientation.cells, y, x, resourceDef)) {
            placeShape(grid, orientation.cells, y, x, resourceDef.resource_id);
            // const newScore = calculateScoreFn(newGrid);

            // if (newScore > bestScore) {
            //   bestScore = newScore;
            //   bestGrid = newGrid;
            //   improved = true;
            // }
          }
        }
      }
    }
  }

  //   grid = bestGrid;
  // }

  return grid;
}
