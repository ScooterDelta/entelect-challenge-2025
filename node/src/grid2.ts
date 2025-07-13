import { Resource } from "./types/resources";

const checkSameResource = (
  grid: number[][],
  top: number,
  left: number,
  resource: Resource,
): boolean => {
  if (top >= 0 || top < grid.length || left >= 0 || left < grid[0].length)
    return grid[top][left] === resource.resource_id;
  return false;
};

const adjacentSameResource = (
  grid: number[][],
  top: number,
  left: number,
  resource: Resource,
) => {
  if (
    checkSameResource(grid, top - 1, left, resource) &&
    checkSameResource(grid, top + 1, left, resource) &&
    checkSameResource(grid, top, left - 1, resource) &&
    checkSameResource(grid, top, left + 1, resource)
  ) {
    return true;
  }
  return false;
};

export function canPlace(
  grid: number[][],
  shape: [number, number][],
  top: number,
  left: number,
  resource: Resource,
): number {
  for (const [dy, dx] of shape) {
    const y = top + dy;
    const x = left + dx;
    if (
      y < 0 ||
      y >= grid.length ||
      x < 0 ||
      x >= grid[0].length ||
      grid[y][x] !== 1 ||
      !adjacentSameResource(grid, y, x, resource)
    ) {
      return -1;
    }
  }
  return 1;
}
export function canPlaceCompat(
  grid: number[][],
  shape: [number, number][],
  top: number,
  left: number,
  resource: Resource,
): number {
  const incompatibleWith = resource.incompatible_with;

  for (const [dy, dx] of shape) {
    const y = top + dy;
    const x = left + dx;
    if (
      y < 0 ||
      y >= grid.length ||
      x < 0 ||
      x >= grid[0].length ||
      grid[y][x] !== 1 ||
      !adjacentSameResource(grid, y, x, resource)
    ) {
      return -1;
    }

    for (let dy2 = -5; dy2 <= 5; dy2++) {
      for (let dx2 = -5; dx2 <= 5; dx2++) {
        const ny = y + dy2;
        const nx = x + dx2;
        if (ny >= 0 && ny < grid.length && nx >= 0 && nx < grid[0].length) {
          const nearby = grid[ny][nx];
          if (incompatibleWith.includes(nearby)) {
            return -1;
          }
        }
      }
    }
  }

  return 1;
}

export function canPlaceCompatUnUsedValue(
  grid: number[][],
  shape: [number, number][],
  top: number,
  left: number,
  resource: Resource,
): number {
  const incompatibleWith = resource.incompatible_with;

  for (const [dy, dx] of shape) {
    const y = top + dy;
    const x = left + dx;
    if (
      y < 0 ||
      y >= grid.length ||
      x < 0 ||
      x >= grid[0].length ||
      grid[y][x] !== 1
    ) {
      return -1;
    }

    for (let dy2 = -5; dy2 <= 5; dy2++) {
      for (let dx2 = -5; dx2 <= 5; dx2++) {
        const ny = y + dy2;
        const nx = x + dx2;
        if (ny >= 0 && ny < grid.length && nx >= 0 && nx < grid[0].length) {
          const nearby = grid[ny][nx];
          if (incompatibleWith.includes(nearby)) {
            return -1;
          }
        }
      }
    }
  }
  let unUsed = 0;
  for (let dy2 = 0; dy2 <= resource.bounding_box; dy2++) {
    for (let dx2 = 0; dx2 <= resource.bounding_box; dx2++) {
      const ny = top + dy2;
      const nx = left + dx2;
      if (
        ny >= 0 &&
        ny < grid.length &&
        nx >= 0 &&
        nx < grid[0].length &&
        grid[ny][nx] === 1
      ) {
        unUsed++;
      }
    }
  }

  return unUsed;
}

export function placeShape(
  grid: number[][],
  shape: [number, number][],
  top: number,
  left: number,
  resource_id: number,
): number[][] {
  for (const [dy, dx] of shape) {
    grid[top + dy][left + dx] = resource_id;
  }
  return grid;
}
export const resourceValueBase = (resource: Resource): number => 1;
export const resourceValueInterest = (resource: Resource): number =>
  resource.interest_factor;
export const resourceValueBasic = (resource: Resource): number =>
  resource.interest_factor / resource.orientations[0].cells.length;

export const minCostResourceValue = (resource: Resource): number =>
  resource.cost !== 0 ? resource.interest_factor / resource.cost : 0;
const prioritizeResources = (
  resources: Resource[],
  insertedResources: number[],
  resourceCalc: (resource: Resource) => number,
): Resource[] => {
  const usedResources = resources.filter(
    (r) => !insertedResources.includes(r.resource_id),
  );
  const unusedResources = resources.filter((r) =>
    insertedResources.includes(r.resource_id),
  );

  // Add randomness with a bias toward higher value
  unusedResources.sort((a, b) => {
    const aValue = resourceCalc(a) + Math.random() * 0.2;
    const bValue = resourceCalc(b) + Math.random() * 0.2;
    return bValue - aValue;
  });

  usedResources.sort((a, b) => {
    const aValue = resourceCalc(a);
    const bValue = resourceCalc(b);
    return bValue - aValue;
  });

  return [...unusedResources, ...usedResources];
};

export function fillGridDump(
  grid: number[][],
  resources: Resource[],
  canPlaceFn: (
    grid: number[][],
    shape: [number, number][],
    top: number,
    left: number,
    resource: Resource,
  ) => number,
  resourceCalc: (resource: Resource) => number,
  spacing: number,
  budget: number,
  direction: "forward" | "reverse" | "left" | "right" = "forward", // updated param
): { grid: number[][]; cost: number } {
  let cost = 0;
  let insertedResources: number[] = [];

  const yRange =
    direction === "forward" || direction === "left"
      ? [...Array(grid.length).keys()]
      : [...Array(grid.length).keys()].reverse();

  const xRange =
    direction === "forward" || direction === "right"
      ? [...Array(grid[0].length).keys()]
      : [...Array(grid[0].length).keys()].reverse();

  const iterateByColumn = direction === "left" || direction === "right";

  if (iterateByColumn) {
    for (let xi = 0; xi < xRange.length; xi += spacing) {
      const x = xRange[xi];
      for (let yi = 0; yi < yRange.length; yi += spacing) {
        const y = yRange[yi];

        const orderedResources = prioritizeResources(
          resources,
          insertedResources,
          resourceCalc,
        );

        for (const resourceDef of orderedResources) {
          const scoredOrientations = resourceDef.orientations
            .map((o) => {
              const score = canPlaceFn(grid, o.cells, y, x, resourceDef);
              return { orientation: o, score };
            })
            .filter((o) => o.score !== -1)
            .sort((a, b) => a.score - b.score);

          if (
            scoredOrientations.length > 0 &&
            budget >= cost + resourceDef.cost
          ) {
            const best = scoredOrientations[0];
            placeShape(
              grid,
              best.orientation.cells,
              y,
              x,
              resourceDef.resource_id,
            );
            cost += resourceDef.cost;
            console.log(
              `Placed resource ${resourceDef.resource_id} at (${y}, ${x}) with cost ${resourceDef.cost}`,
            );

            if (!insertedResources.includes(resourceDef.resource_id)) {
              insertedResources.push(resourceDef.resource_id);
              if (insertedResources.length === resources.length) {
                insertedResources = [];
              }
            }
          }
        }
      }
    }
  } else {
    for (let yi = 0; yi < yRange.length; yi += spacing) {
      const y = yRange[yi];
      for (let xi = 0; xi < xRange.length; xi += spacing) {
        const x = xRange[xi];

        const orderedResources = prioritizeResources(
          resources,
          insertedResources,
          resourceCalc,
        );

        for (const resourceDef of orderedResources) {
          const scoredOrientations = resourceDef.orientations
            .map((o) => {
              const score = canPlaceFn(grid, o.cells, y, x, resourceDef);
              return { orientation: o, score };
            })
            .filter((o) => o.score !== -1)
            .sort((a, b) => a.score - b.score);

          if (scoredOrientations.length > 0) {
            const best = scoredOrientations[0];
            placeShape(
              grid,
              best.orientation.cells,
              y,
              x,
              resourceDef.resource_id,
            );
            cost += resourceDef.cost;
            console.log(
              `Placed resource ${resourceDef.resource_id} at (${y}, ${x}) with cost ${resourceDef.cost}`,
            );

            if (!insertedResources.includes(resourceDef.resource_id)) {
              insertedResources.push(resourceDef.resource_id);
              if (insertedResources.length === resources.length) {
                insertedResources = [];
              }
            }
          }
        }
      }
    }
  }

  console.log(`Total cost: ${cost}`);
  return { grid, cost };
}
