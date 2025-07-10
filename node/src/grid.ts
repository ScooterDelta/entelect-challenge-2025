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

export function placeShape(grid: number[][], shape: [number, number][], resource_id: number, top: number, left: number): number[][] {
    const newGrid = grid.map(row => [...row]);
    for (const [dy, dx] of shape) {
      newGrid[top + dy][left + dx] = resource_id;
    }
    return newGrid;
  }


export function scorePlacement(grid: number[][]): number {
    let score = 0;
    for (const row of grid) {
      if (row.every(cell => cell != 1)) score += 100;
    }
    return score;
 }
  
