export type Grid = number[][];

export type Challenge = {
  grid: Grid;
  available_resources: number[];
  zoo_size: number[];
  challenge_id: number;
};
