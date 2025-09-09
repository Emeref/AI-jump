
export enum GameState {
  PreGame = 'pre-game',
  Playing = 'playing',
  GameOver = 'game-over',
}

export type Obstacle = {
  id: number;
  x: number;
  y: number;
  direction: 'left' | 'right';
  speed: number;
  type: 'normal' | 'gold' | 'blue';
};
