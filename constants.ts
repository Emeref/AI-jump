
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

// Vertical spawn range for RED obstacles (0.0 = top, 1.0 = bottom)
export const OBSTACLE_RED_SPAWN_Y_MIN_PERCENT = 0.0; // 0% from the top
export const OBSTACLE_RED_SPAWN_Y_MAX_PERCENT = 1.0; // 100% from the top


// Speeds are in seconds to cross the full game width
const OBSTACLE_NORMAL_SPEED_SECONDS_MIN = 1.5;
const OBSTACLE_NORMAL_SPEED_SECONDS_MAX = 3;
const OBSTACLE_GOLD_SPEED_SECONDS_MIN = 5;
const OBSTACLE_GOLD_SPEED_SECONDS_MAX = 7;
const OBSTACLE_BLUE_SPEED_SECONDS_MIN = 6;
const OBSTACLE_BLUE_SPEED_SECONDS_MAX = 8;
const OBSTACLE_RED_SPEED_SECONDS_MIN = 6;
const OBSTACLE_RED_SPEED_SECONDS_MAX = 8;

// Converted speeds to pixels per second
export const OBSTACLE_NORMAL_SPEED_MIN = GAME_WIDTH / OBSTACLE_NORMAL_SPEED_SECONDS_MAX;
export const OBSTACLE_NORMAL_SPEED_MAX = GAME_WIDTH / OBSTACLE_NORMAL_SPEED_SECONDS_MIN;
export const OBSTACLE_GOLD_SPEED_MIN = GAME_WIDTH / OBSTACLE_GOLD_SPEED_SECONDS_MAX;
export const OBSTACLE_GOLD_SPEED_MAX = GAME_WIDTH / OBSTACLE_GOLD_SPEED_SECONDS_MIN;
export const OBSTACLE_BLUE_SPEED_MIN = GAME_WIDTH / OBSTACLE_BLUE_SPEED_SECONDS_MAX;
export const OBSTACLE_BLUE_SPEED_MAX = GAME_WIDTH / OBSTACLE_BLUE_SPEED_SECONDS_MIN;
export const OBSTACLE_RED_SPEED_MIN = GAME_WIDTH / OBSTACLE_RED_SPEED_SECONDS_MAX;
export const OBSTACLE_RED_SPEED_MAX = GAME_WIDTH / OBSTACLE_RED_SPEED_SECONDS_MIN;


// Gameplay Mechanics
export const OBSTACLE_SPAWN_INTERVAL_PER_LINE_MIN = 0; // in ms
export const OBSTACLE_SPAWN_INTERVAL_PER_LINE_MAX = 1500; // in ms

// Points
export const OBSTACLE_GOLD_POINTS = 64;
export const OBSTACLE_BLUE_POINTS = -1000; // Touch = game over
export const OBSTACLE_RED_POINTS = -50; 

// Chance of an obstacle being gold (0.0 = 0%, 1.0 = 100%)
export const GOLD_OBSTACLE_SPAWN_CHANCE = 0.05; // 5% chance

// Chance of an obstacle being blue (0.0 = 0%, 1.0 = 100%) - only after min score is reached
export const BLUE_OBSTACLE_SPAWN_CHANCE = 0.01; // 1% chance
export const BLUE_OBSTACLE_MIN_SCORE_TO_APPEAR = 512; // Appears after 512 points

// Chance of an obstacle being red (0.0 = 0%, 1.0 = 100%) - only after min score is reached
export const RED_OBSTACLE_SPAWN_CHANCE = 0.05; // 5% chance
export const RED_OBSTACLE_MIN_SCORE_TO_APPEAR = 1024; // Appears after 1024 points

// Audio
// A simple, short 'boop' sound for jumping
export const JUMP_SOUND_BASE64 = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQggAAAAg/9/f3+A';

// Links
export const DONATE_LINK = 'https://buymeacoffee.com/example';

// Cloud Properties
export const CLOUD_COUNT = 6;
export const CLOUD_MIN_SIZE = 60;
export const CLOUD_MAX_SIZE = 120;
export const CLOUD_Y_MIN = 20;
export const CLOUD_Y_MAX = 300;
// Speeds in pixels per second
export const CLOUD_SPEED_MIN = 10;
export const CLOUD_SPEED_MAX = 25;
export const CLOUD_OPACITY_MIN = 0.4;
export const CLOUD_OPACITY_MAX = 0.8;