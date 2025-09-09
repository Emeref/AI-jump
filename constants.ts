
// Game Dimensions
export const GAME_WIDTH = 400;
export const GAME_HEIGHT = 800;

// Player Properties
export const PLAYER_SIZE = 30;
export const PLAYER_X_POSITION = (GAME_WIDTH / 2) - (PLAYER_SIZE / 2);
export const PLAYER_GROUND_Y = GAME_HEIGHT - PLAYER_SIZE - 20;
export const GRAVITY = 850; // pixels per second^2 - constant gravity
export const JUMP_IMPULSE = -400; // upward velocity impulse at ground level
export const JUMP_IMPULSE_DECAY_FACTOR = 0.8; // Impulse multiplier for every 10% of screen height
export const TOP_BOUNDARY = 0;
export const BOTTOM_BOUNDARY = GAME_HEIGHT;


// Obstacle Properties
export const OBSTACLE_SIZE = 10;
// Vertical spawn range for NORMAL obstacles (0.0 = top, 1.0 = bottom)
export const OBSTACLE_NORMAL_SPAWN_Y_MIN_PERCENT = 0.0; // 0% from the top
export const OBSTACLE_NORMAL_SPAWN_Y_MAX_PERCENT = 1.0; // 100% from the top

// Vertical spawn range for GOLD obstacles (0.0 = top, 1.0 = bottom)
export const OBSTACLE_GOLD_SPAWN_Y_MIN_PERCENT = 0.15; // 25% from the top
export const OBSTACLE_GOLD_SPAWN_Y_MAX_PERCENT = 0.35; // 75% from the top

// Vertical spawn range for BLUE obstacles (0.0 = top, 1.0 = bottom)
export const OBSTACLE_BLUE_SPAWN_Y_MIN_PERCENT = 0.1; // 0% from the top
export const OBSTACLE_BLUE_SPAWN_Y_MAX_PERCENT = 0.2; // 100% from the top


// Speeds are in seconds to cross the full game width
const OBSTACLE_NORMAL_SPEED_SECONDS_MIN = 1;
const OBSTACLE_NORMAL_SPEED_SECONDS_MAX = 3;
const OBSTACLE_GOLD_SPEED_SECONDS_MIN = 5;
const OBSTACLE_GOLD_SPEED_SECONDS_MAX = 7;
const OBSTACLE_BLUE_SPEED_SECONDS_MIN = 6;
const OBSTACLE_BLUE_SPEED_SECONDS_MAX = 8;

// Converted speeds to pixels per second
export const OBSTACLE_NORMAL_SPEED_MIN = GAME_WIDTH / OBSTACLE_NORMAL_SPEED_SECONDS_MAX;
export const OBSTACLE_NORMAL_SPEED_MAX = GAME_WIDTH / OBSTACLE_NORMAL_SPEED_SECONDS_MIN;
export const OBSTACLE_GOLD_SPEED_MIN = GAME_WIDTH / OBSTACLE_GOLD_SPEED_SECONDS_MAX;
export const OBSTACLE_GOLD_SPEED_MAX = GAME_WIDTH / OBSTACLE_GOLD_SPEED_SECONDS_MIN;
export const OBSTACLE_BLUE_SPEED_MIN = GAME_WIDTH / OBSTACLE_BLUE_SPEED_SECONDS_MAX;
export const OBSTACLE_BLUE_SPEED_MAX = GAME_WIDTH / OBSTACLE_BLUE_SPEED_SECONDS_MIN;


// Gameplay Mechanics
export const NUMBER_OF_OBSTACLE_SPAWN_LINES = 3;
export const OBSTACLE_SPAWN_INTERVAL_PER_LINE_MIN = 0; // in ms
export const OBSTACLE_SPAWN_INTERVAL_PER_LINE_MAX = 1500; // in ms

// Chance of an obstacle being gold (0.0 = 0%, 1.0 = 100%)
export const GOLD_OBSTACLE_SPAWN_CHANCE = 0.05; // 40% chance

// Chance of an obstacle being blue (0.0 = 0%, 1.0 = 100%) - only after min score is reached
export const BLUE_OBSTACLE_SPAWN_CHANCE = 0.01; // 15% chance
export const BLUE_OBSTACLE_MIN_SCORE_TO_APPEAR = 512; // Appears after 50 points

// Audio
// A simple, short 'boop' sound for jumping
export const JUMP_SOUND_BASE64 = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=';
