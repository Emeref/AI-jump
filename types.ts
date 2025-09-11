
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
  type: 'normal' | 'gold' | 'gold-glowing' | 'blue' | 'red' | 'green';
};

export type Cloud = {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
};

export type BackgroundTheme = 'outdoor' | 'city' | 'cave';
