export type Coordinates = {
  x: number;
  y: number;
};

export type Circle = {
  center: Coordinates;
  radius: number;
  referencePoints: Coordinates[];
};

export type Difficulty = 'easy' | 'medium' | 'hard';

export type GameState = 'ready' | 'result';

export type WorldBounds = {
    min_x: number;
    max_x: number;
    min_y: number;
    max_y: number;
}
