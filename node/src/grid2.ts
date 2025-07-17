import { Resource } from "./types/resources";

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
      grid[y][x] !== 1
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
  for (let dy2 = -3; dy2 <= resource.bounding_box+6; dy2++) {
    for (let dx2 = -3; dx2 <= resource.bounding_box+6; dx2++) {
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

  return 1/(unUsed+1);
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
export const resourceValueBase = (resource: Resource): number =>
  Math.random() / resource.orientations[0].cells.length;

export const resourceValueBasic = (resource: Resource): number => {
  return (
    (resource.interest_factor * (Math.random() * 0.2)) /
    resource.orientations[0].cells.length
  );
};

export const minCostResourceValue = (resource: Resource): number => {
  return resource.cost !== 0
    ? (resource.interest_factor * (Math.random() * 0.2)) /
        (resource.cost / 10000)
    : 0;
};
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
    const aValue = resourceCalc(a);
    const bValue = resourceCalc(b);
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
  calculateScore: (grid: number[][],
  resources: Resource[],
  addedResources: number[],
  cost: number) => number,
  spacing: number,
  budget: number,
  direction: "forward" | "reverse" | "left" | "right" = "forward", // updated param
): { grid: number[][]; cost: number, addedResources: number[] } {
  let cost = 0;
  let insertedResources: number[] = [];

  let addedResources: number[] = [];
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

            if (!insertedResources.includes(resourceDef.resource_id)) {
              insertedResources.push(resourceDef.resource_id);
              addedResources.push(resourceDef.resource_id);
              if (insertedResources.length === resources.length) {
               // insertedResources = [];
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

            if (!insertedResources.includes(resourceDef.resource_id)) {
              insertedResources.push(resourceDef.resource_id);
              addedResources.push(resourceDef.resource_id);
              if (insertedResources.length === resources.length) {
               // insertedResources = [];
              }
            }
          }
        }
      }
    }
  }

  console.log(`Total cost: ${cost}`);
  return { grid, cost , addedResources};
}

export function fillGridBeamSearch(
  initialGrid: number[][],
  resources: Resource[],
  canPlaceFn: (
    grid: number[][],
    shape: [number, number][],
    top: number,
    left: number,
    resource: Resource
  ) => number,
  resourceCalc: (resource: Resource) => number,
  calculateScore: (
    grid: number[][],
    resources: Resource[],
    addedResources: number[],
    cost: number
  ) => number,
  spacing: number,
  budget: number,
  beamWidth: number = 5
): { grid: number[][]; cost: number; addedResources: number[] } {
  type State = {
    grid: number[][];
    cost: number;
    addedResources: number[];
    insertedResources: number[];
  };

  let beam: State[] = [{
    grid: structuredClone(initialGrid),
    cost: 0,
    addedResources: [],
    insertedResources: []
  }];

  for (let y = 0; y < initialGrid.length; y += spacing) {
    for (let x = 0; x < initialGrid[0].length; x += spacing) {
      const candidates: State[] = [];

      for (const state of beam) {
        const orderedResources = prioritizeResources(
          resources,
          state.insertedResources,
          resourceCalc
        );

        for (const resource of orderedResources) {
          for (const orientation of resource.orientations) {
            const score = canPlaceFn(state.grid, orientation.cells, y, x, resource);
            if (score === -1) continue;

            if (state.cost + resource.cost > budget) continue;

            const newGrid = structuredClone(state.grid);
            placeShape(newGrid, orientation.cells, y, x, resource.resource_id);

            const newInserted = [...state.insertedResources];
            if (!newInserted.includes(resource.resource_id)) {
              newInserted.push(resource.resource_id);
            }

            const newAdded = [...state.addedResources, resource.resource_id];

            const newCost = state.cost + resource.cost;

            candidates.push({
              grid: newGrid,
              cost: newCost,
              addedResources: newAdded,
              insertedResources: newInserted
            });
          }
        }

        // Option to keep state with no placement too
        candidates.push(state);
      }

      // Sort candidates by score and trim beam
      beam = candidates
        .map(c => ({
          ...c,
          score: calculateScore(c.grid, resources, c.addedResources, c.cost)
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, beamWidth);
    }
  }

  const best = beam[0];
  return {
    grid: best.grid,
    cost: best.cost,
    addedResources: best.addedResources
  };
}
