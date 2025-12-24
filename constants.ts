import { Direction } from './types';

export const GAME_DURATION_SECONDS = 30;
export const COUNTDOWN_SECONDS = 3;
export const SYMBOL_COUNT = 200; // Enough for 30 seconds of fast play

// Visual rotation for the "E" optotype based on direction
// E (Right) is 0deg (base).
// W (Up) is -90deg.
// M (Down) is 90deg.
// 3 (Left) is 180deg.
export const ROTATION_MAP: Record<Direction, number> = {
  [Direction.RIGHT]: 0,
  [Direction.UP]: -90,
  [Direction.DOWN]: 90,
  [Direction.LEFT]: 180,
};

export const KEY_MAP: Record<string, Direction> = {
  ArrowUp: Direction.UP,
  ArrowDown: Direction.DOWN,
  ArrowLeft: Direction.LEFT,
  ArrowRight: Direction.RIGHT,
  w: Direction.UP,
  s: Direction.DOWN,
  a: Direction.LEFT,
  d: Direction.RIGHT,
};