export enum Direction {
  UP = 'UP',
  DOWN = 'DOWN',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
}

export enum GameState {
  MENU = 'MENU',
  TUTORIAL = 'TUTORIAL',
  COUNTDOWN = 'COUNTDOWN',
  PLAYING = 'PLAYING',
  FINISHED = 'FINISHED',
}

export interface GameStats {
  score: number;
  errors: number;
  totalAttempts: number;
}

export interface SymbolItem {
  id: string;
  direction: Direction;
  status: 'pending' | 'correct' | 'wrong' | 'current';
}