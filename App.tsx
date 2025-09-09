
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameState, Obstacle } from './types';
import * as C from './constants';

const Player: React.FC<{ y: number }> = ({ y }) => (
  <div
    className="absolute bg-pink-400 rounded-full"
    style={{
      width: C.PLAYER_SIZE,
      height: C.PLAYER_SIZE,
      left: C.PLAYER_X_POSITION,
      top: y,
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    }}
  />
);

const ObstacleComponent: React.FC<{ obstacle: Obstacle }> = ({ obstacle }) => {
    const style: React.CSSProperties = {
      width: C.OBSTACLE_SIZE,
      height: C.OBSTACLE_SIZE,
      left: obstacle.x,
      top: obstacle.y,
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    };
    let bgColor = 'bg-teal-400';

    if (obstacle.type === 'gold') {
        bgColor = 'bg-yellow-400';
    } else if (obstacle.type === 'blue') {
        bgColor = 'bg-blue-500';
        style.boxShadow = '0 0 10px 2px rgba(59, 130, 246, 0.7)'; // Glow effect
    } else if (obstacle.type === 'red') {
        bgColor = 'bg-red-500';
        style.boxShadow = '0 0 10px 2px rgba(239, 68, 68, 0.7)'; // Red glow effect
    }


    return (
      <div
        className={`absolute rounded-lg ${bgColor}`}
        style={style}
      />
    );
};

const GameScreen: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex justify-center items-center min-h-screen bg-blue-50 font-sans">
    <div
      className="relative bg-blue-200 overflow-hidden rounded-2xl shadow-2xl"
      style={{ width: C.GAME_WIDTH, height: C.GAME_HEIGHT }}
    >
      {children}
    </div>
  </div>
);

const Overlay: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-center z-10 p-4">
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg w-full max-w-sm">
            {children}
        </div>
    </div>
);

const HallOfPay: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [payData, setPayData] = useState<{ value: number; user: string }[]>([]);

  useEffect(() => {
    const generatePayData = () => {
      const values = [0.01, 0.02, 0.03, 0.05, 0.08];
      for (let i = 5; i < 50; i++) {
        const nextValue = values[i - 1] + values[i - 2];
        values.push(nextValue);
      }
      return values.map(value => ({ value, user: 'Username' }));
    };
    setPayData(generatePayData());
  }, []);

  const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });
  
  const getColorForRow = (index: number, totalRows: number): string => {
    // First 5 rows: transition from black to a light gray
    if (index < 5) {
      const grayValue = Math.floor((150 / 5) * index);
      return `rgb(${grayValue}, ${grayValue}, ${grayValue})`;
    }

    // Remaining rows: transition through the rainbow
    const hue = 300 - (300 * (index - 5)) / (totalRows - 5);
    return `hsl(${hue}, 80%, 50%)`;
  };

  const scrollbarStyles = `
    .custom-scrollbar::-webkit-scrollbar {
      width: 10px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.5);
      border-radius: 10px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: linear-gradient(to bottom, black, #999, hsl(300, 80%, 50%), hsl(240, 80%, 50%), hsl(120, 80%, 50%), hsl(60, 80%, 50%), hsl(0, 80%, 50%));
      border-radius: 10px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: linear-gradient(to bottom, #333, #bbb, hsl(300, 90%, 60%), hsl(240, 90%, 60%), hsl(120, 90%, 60%), hsl(60, 90%, 60%), hsl(0, 90%, 60%));
    }
  `;

  return (
    <Overlay>
        <style>{scrollbarStyles}</style>
        <div className="relative w-full">
            <h2 className="text-3xl font-bold text-teal-600 mb-2">Hall of Pay</h2>
            <p className="text-gray-500 text-sm mb-4 italic">First to donate on each level will be remembered forever. It can be you.</p>
            <div className="bg-white/50 p-4 rounded-lg max-h-[400px] overflow-y-auto custom-scrollbar">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b-2 border-gray-300">
                            <th className="p-2 font-bold text-gray-700"></th>
                            <th className="p-2 font-bold text-gray-700">Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payData.map((row, index) => (
                            <tr key={index} className="border-b border-gray-200 last:border-b-0">
                                <td className="p-2 font-mono" style={{ color: getColorForRow(index, payData.length) }}>{`${index + 1}. ${currencyFormatter.format(row.value)}`}</td>
                                <td className="p-2 text-gray-500 opacity-75">{row.user}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
             <button
                onClick={onClose}
                className="mt-6 px-8 py-3 bg-pink-400 text-white font-bold rounded-lg shadow-md hover:bg-pink-500 transition-colors"
            >
                Close
            </button>
        </div>
    </Overlay>
  );
};

const Settings: React.FC<{
  onClose: () => void;
  difficulty: number;
  onDifficultyChange: (newDifficulty: number) => void;
}> = ({ onClose, difficulty, onDifficultyChange }) => {
  return (
    <Overlay>
      <div className="relative w-full">
        <h2 className="text-3xl font-bold text-teal-600 mb-6">Settings</h2>
        <div className="bg-white/50 p-6 rounded-lg">
          <label htmlFor="difficulty" className="block text-gray-700 font-bold mb-2">
            Difficulty: <span className="font-mono bg-gray-200 px-2 py-1 rounded">{difficulty}</span>
          </label>
          <input
            id="difficulty"
            type="range"
            min="1"
            max="10"
            value={difficulty}
            onChange={(e) => onDifficultyChange(parseInt(e.target.value, 10))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        <button
          onClick={onClose}
          className="mt-8 px-8 py-3 bg-pink-400 text-white font-bold rounded-lg shadow-md hover:bg-pink-500 transition-colors"
        >
          Close
        </button>
      </div>
    </Overlay>
  );
};


const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.PreGame);
  const [score, setScore] = useState(0);
  const [playerPositionY, setPlayerPositionY] = useState(C.PLAYER_GROUND_Y);
  const [playerVelocityY, setPlayerVelocityY] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [canRestart, setCanRestart] = useState(false);
  const [gameOverReason, setGameOverReason] = useState<'score' | 'idle' | 'blue' | 'top'>('score');
  const [showHallOfPay, setShowHallOfPay] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [difficulty, setDifficulty] = useState(3);


  const jumpSoundRef = useRef<HTMLAudioElement | null>(null);
  const gameLoopRef = useRef<number | null>(null);
  const obstacleSpawnersRef = useRef<number[]>([]);
  const lastFrameTimeRef = useRef(0);
  const scoreRef = useRef(score);

  useEffect(() => {
    scoreRef.current = score;
  }, [score]);
  
  useEffect(() => {
    jumpSoundRef.current = new Audio(C.JUMP_SOUND_BASE64);
  }, []);

  const resetGame = useCallback(() => {
    setScore(0);
    setPlayerPositionY(C.PLAYER_GROUND_Y);
    setPlayerVelocityY(0);
    setGameStarted(false);
    setObstacles([]);
    setCanRestart(false);
    setGameOverReason('score');
    setShowHallOfPay(false);
    setShowSettings(false);
    setGameState(GameState.Playing);
  }, []);

  const goToStartScreen = useCallback(() => {
    setScore(0);
    setPlayerPositionY(C.PLAYER_GROUND_Y);
    setPlayerVelocityY(0);
    setGameStarted(false);
    setObstacles([]);
    setCanRestart(false);
    setGameOverReason('score');
    setShowHallOfPay(false);
    setShowSettings(false);
    setGameState(GameState.PreGame);
  }, []);

  const handleJump = useCallback(() => {
    if (gameState === GameState.Playing) {
      if (!gameStarted) {
        setGameStarted(true);
      }
      if(jumpSoundRef.current) {
        jumpSoundRef.current.currentTime = 0;
        jumpSoundRef.current.play();
      }
      
      const heightFromGround = C.PLAYER_GROUND_Y - playerPositionY;
      const totalClimbableHeight = C.PLAYER_GROUND_Y;
      const heightRatio = Math.max(0, heightFromGround / totalClimbableHeight);

      const heightSegments = Math.floor(heightRatio * 10);
      
      const decayedJumpImpulse = C.JUMP_IMPULSE * Math.pow(C.JUMP_IMPULSE_DECAY_FACTOR, heightSegments);

      setPlayerVelocityY(decayedJumpImpulse);
    }
  }, [gameState, gameStarted, playerPositionY]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (gameState === GameState.PreGame || (gameState === GameState.GameOver && canRestart)) {
          resetGame();
        } else if (gameState === GameState.Playing) {
          handleJump();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, handleJump, resetGame, canRestart]);


  const spawnObstacle = useCallback(() => {
    const direction = Math.random() < 0.5 ? 'left' : 'right';
    const currentScore = scoreRef.current;
    
    let type: Obstacle['type'];

    if (currentScore >= C.RED_OBSTACLE_MIN_SCORE_TO_APPEAR && Math.random() < C.RED_OBSTACLE_SPAWN_CHANCE) {
      type = 'red';
    } else if (currentScore >= C.BLUE_OBSTACLE_MIN_SCORE_TO_APPEAR && Math.random() < C.BLUE_OBSTACLE_SPAWN_CHANCE) {
      type = 'blue';
    } else if (Math.random() < C.GOLD_OBSTACLE_SPAWN_CHANCE) {
      type = 'gold';
    } else {
      type = 'normal';
    }
    
    let y;
    let speed;

    if (type === 'gold') {
        const spawnRangeY = C.GAME_HEIGHT * (C.OBSTACLE_GOLD_SPAWN_Y_MAX_PERCENT - C.OBSTACLE_GOLD_SPAWN_Y_MIN_PERCENT);
        const startY = C.GAME_HEIGHT * C.OBSTACLE_GOLD_SPAWN_Y_MIN_PERCENT;
        y = startY + Math.random() * spawnRangeY;
        speed = C.OBSTACLE_GOLD_SPEED_MIN + Math.random() * (C.OBSTACLE_GOLD_SPEED_MAX - C.OBSTACLE_GOLD_SPEED_MIN);
    } else if (type === 'blue') {
        const spawnRangeY = C.GAME_HEIGHT * (C.OBSTACLE_BLUE_SPAWN_Y_MAX_PERCENT - C.OBSTACLE_BLUE_SPAWN_Y_MIN_PERCENT);
        const startY = C.GAME_HEIGHT * C.OBSTACLE_BLUE_SPAWN_Y_MIN_PERCENT;
        y = startY + Math.random() * spawnRangeY;
        speed = C.OBSTACLE_BLUE_SPEED_MIN + Math.random() * (C.OBSTACLE_BLUE_SPEED_MAX - C.OBSTACLE_BLUE_SPEED_MIN);
    } else if (type === 'red') {
        const spawnRangeY = C.GAME_HEIGHT * (C.OBSTACLE_RED_SPAWN_Y_MAX_PERCENT - C.OBSTACLE_RED_SPAWN_Y_MIN_PERCENT);
        const startY = C.GAME_HEIGHT * C.OBSTACLE_RED_SPAWN_Y_MIN_PERCENT;
        y = startY + Math.random() * spawnRangeY;
        speed = C.OBSTACLE_RED_SPEED_MIN + Math.random() * (C.OBSTACLE_RED_SPEED_MAX - C.OBSTACLE_RED_SPEED_MIN);
    } else { // normal
        const spawnRangeY = C.GAME_HEIGHT * (C.OBSTACLE_NORMAL_SPAWN_Y_MAX_PERCENT - C.OBSTACLE_NORMAL_SPAWN_Y_MIN_PERCENT);
        const startY = C.GAME_HEIGHT * C.OBSTACLE_NORMAL_SPAWN_Y_MIN_PERCENT;
        y = startY + Math.random() * spawnRangeY;
        speed = C.OBSTACLE_NORMAL_SPEED_MIN + Math.random() * (C.OBSTACLE_NORMAL_SPEED_MAX - C.OBSTACLE_NORMAL_SPEED_MIN);
    }

    // Ensure obstacle doesn't spawn off-screen
    y = Math.min(y, C.GAME_HEIGHT - C.OBSTACLE_SIZE);
    
    setObstacles(prev => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        x: direction === 'right' ? -C.OBSTACLE_SIZE : C.GAME_WIDTH,
        y,
        direction,
        speed,
        type,
      },
    ]);
  }, []);
  
  const gameLoop = useCallback((currentTime: number) => {
    if(gameState !== GameState.Playing) return;

    const deltaTime = (currentTime - lastFrameTimeRef.current) / 1000; // in seconds
    lastFrameTimeRef.current = currentTime;

    if (deltaTime > 0 && gameStarted) {
      const newVelocity = playerVelocityY + C.GRAVITY * deltaTime;
      const newPosition = playerPositionY + newVelocity * deltaTime;
      
      setPlayerVelocityY(newVelocity);
      setPlayerPositionY(newPosition);

      if (newPosition >= C.BOTTOM_BOUNDARY - C.PLAYER_SIZE) {
        setGameState(GameState.GameOver);
        return;
      }
      if (newPosition <= C.TOP_BOUNDARY) {
        setGameOverReason('top');
        setGameState(GameState.GameOver);
        return;
      }
    }

    let scoredThisFrame = 0;
    const obstaclesAfterPassing = obstacles.filter(o => {
      const hasPassed = o.direction === 'right' ? o.x > C.GAME_WIDTH : o.x < -C.OBSTACLE_SIZE;
      if (hasPassed) {
        if (o.type === 'normal') {
          scoredThisFrame++;
        }
        return false;
      }
      return true;
    });
    
    const movedObstacles = obstaclesAfterPassing.map(obstacle => {
        const moveDistance = obstacle.speed * deltaTime;
        const newX = obstacle.direction === 'right' ? obstacle.x + moveDistance : obstacle.x - moveDistance;
        return { ...obstacle, x: newX };
    });
    
    if(scoredThisFrame > 0) {
      setScore(s => s + scoredThisFrame);
    }
    
    let scoreChange = 0;
    const collidedObstacleIds = new Set<number>();
    let shouldEndGame = false;
    let endReason: typeof gameOverReason = 'score';

    for (const obstacle of movedObstacles) {
        const playerLeft = C.PLAYER_X_POSITION;
        const playerRight = C.PLAYER_X_POSITION + C.PLAYER_SIZE;
        const playerTop = playerPositionY;
        const playerBottom = playerPositionY + C.PLAYER_SIZE;
        
        const obstacleLeft = obstacle.x;
        const obstacleRight = obstacle.x + C.OBSTACLE_SIZE;
        const obstacleTop = obstacle.y;
        const obstacleBottom = obstacle.y + C.OBSTACLE_SIZE;

        if (playerRight > obstacleLeft && playerLeft < obstacleRight && playerBottom > obstacleTop && playerTop < obstacleBottom) {
             if (obstacle.type === 'normal' || obstacle.type === 'blue') {
                shouldEndGame = true;
             }

             if(obstacle.type === 'normal' && !gameStarted) {
                endReason = 'idle';
             }

             if (obstacle.type === 'blue') {
                endReason = 'blue';
             }

             if (!collidedObstacleIds.has(obstacle.id)) {
                if (obstacle.type === 'gold') {
                    scoreChange += C.OBSTACLE_GOLD_POINTS;
                } else if (obstacle.type === 'red') {
                    scoreChange += C.OBSTACLE_RED_POINTS;
                } else if (obstacle.type === 'blue') {
                    scoreChange += C.OBSTACLE_BLUE_POINTS;
                }
                collidedObstacleIds.add(obstacle.id);
             }
        }
    }
    
    if (shouldEndGame) {
        setScore(s => Math.max(0, s + scoreChange));
        setGameOverReason(endReason);
        setGameState(GameState.GameOver);
        return;
    }

    if (scoreChange !== 0) {
        setScore(s => Math.max(0, s + scoreChange));
    }

    const remainingObstacles = movedObstacles.filter(o => !collidedObstacleIds.has(o.id));
    setObstacles(remainingObstacles);
    

    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [gameState, obstacles, playerPositionY, playerVelocityY, gameStarted]);

  useEffect(() => {
    if (gameState === GameState.Playing) {
      lastFrameTimeRef.current = performance.now();
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState, gameLoop]);
  
  // Effect for handling the restart delay
  useEffect(() => {
      if (gameState === GameState.GameOver) {
          setCanRestart(false);
          const timer = setTimeout(() => {
              setCanRestart(true);
          }, 1000);
          return () => clearTimeout(timer);
      }
  }, [gameState]);

  useEffect(() => {
    if (gameState === GameState.Playing) {
      // A function that creates a new spawn loop, capturing its line index.
      const createSpawnLoop = (index: number) => {
        const loop = () => {
          spawnObstacle();
          // Calculate the time until the next spawn for this specific line.
          const nextInterval = C.OBSTACLE_SPAWN_INTERVAL_PER_LINE_MIN + Math.random() * (C.OBSTACLE_SPAWN_INTERVAL_PER_LINE_MAX - C.OBSTACLE_SPAWN_INTERVAL_PER_LINE_MIN);
          // Set the next timeout and store its ID for cleanup.
          const timerId = window.setTimeout(loop, nextInterval);
          if (obstacleSpawnersRef.current) {
            obstacleSpawnersRef.current[index] = timerId;
          }
        };
        return loop;
      };

      // Start a spawn loop for each configured line.
      for (let i = 0; i < difficulty; i++) {
        const spawnLoop = createSpawnLoop(i);
        // Stagger the initial start time for each line to avoid a burst of obstacles at once.
        const initialInterval = Math.random() * (C.OBSTACLE_SPAWN_INTERVAL_PER_LINE_MAX - C.OBSTACLE_SPAWN_INTERVAL_PER_LINE_MIN);
        const initialTimerId = window.setTimeout(spawnLoop, initialInterval);
        obstacleSpawnersRef.current[i] = initialTimerId;
      }
    }

    // Cleanup function to run when the component unmounts or gameState changes.
    return () => {
      if (obstacleSpawnersRef.current) {
        obstacleSpawnersRef.current.forEach(clearTimeout);
        obstacleSpawnersRef.current = []; // Clear the array of timer IDs.
      }
    };
  }, [gameState, spawnObstacle, difficulty]);

  const getGameOverMessage = (score: number, reason: 'score' | 'idle' | 'blue' | 'top'): string => {
      if (reason === 'top') {
          return "You're a fast clicker, aren't you?";
      }
      if (reason === 'blue') {
          return "Didn't expected that, right?";
      }
      if (reason === 'idle') {
          return "Jump, don't be lazy";
      }
      const specialScores = [69, 420, 2137];
      if (specialScores.includes(score)) {
          return 'Nice!';
      }
      if (score < 129) {
          return 'Get Gud';
      }
      if (score <= 1024) {
          return 'Not terrible';
      }
      return 'Congratulations';
  };


  return (
    <GameScreen>
      <div className="absolute top-4 right-4 bg-white/50 px-4 py-2 rounded-lg text-gray-700 font-bold text-2xl z-20">
        Score: {score}
      </div>

      {gameState === GameState.PreGame && !showHallOfPay && !showSettings && (
        <Overlay>
            <h1 className="text-4xl font-bold text-teal-600 mb-2">Pastel Jump</h1>
            <p className="text-gray-600 mb-6">Collect gold, figure out others</p>
            <div className="flex flex-col space-y-4 w-full">
                <button
                    onClick={resetGame}
                    className="px-8 py-3 bg-pink-400 text-white font-bold rounded-lg shadow-md hover:bg-pink-500 transition-colors"
                >
                    Press Space to Start
                </button>
                <button
                    onClick={() => setShowHallOfPay(true)}
                    className="px-8 py-3 bg-teal-500 text-white font-bold rounded-lg shadow-md hover:bg-teal-600 transition-colors"
                >
                    Hall of Pay
                </button>
                 <button
                    onClick={() => setShowSettings(true)}
                    className="px-8 py-3 bg-blue-500 text-white font-bold rounded-lg shadow-md hover:bg-blue-600 transition-colors"
                >
                    Settings
                </button>
            </div>
        </Overlay>
      )}

      {showHallOfPay && <HallOfPay onClose={() => setShowHallOfPay(false)} />}
      {showSettings && <Settings onClose={() => setShowSettings(false)} difficulty={difficulty} onDifficultyChange={setDifficulty} />}


      {gameState === GameState.GameOver && (
        <Overlay>
            <h2 className="text-3xl font-bold text-red-500 mb-2">{getGameOverMessage(score, gameOverReason)}</h2>
            <p className="text-2xl text-gray-700 mb-6">Final Score: {score}</p>
            <div className="flex flex-col space-y-4 w-full">
              <button
                  onClick={resetGame}
                  disabled={!canRestart}
                  className={`px-8 py-3 bg-teal-500 text-white font-bold rounded-lg shadow-md hover:bg-teal-600 transition-colors ${!canRestart && 'opacity-50 cursor-not-allowed'}`}
              >
                  Press space to play again
              </button>
              <button
                  onClick={goToStartScreen}
                  className="px-8 py-3 bg-pink-400 text-white font-bold rounded-lg shadow-md hover:bg-pink-500 transition-colors"
              >
                  Close
              </button>
            </div>
        </Overlay>
      )}

      {(gameState === GameState.Playing || gameState === GameState.GameOver) && (
        <>
          <Player y={playerPositionY} />
          {obstacles.map(o => (
            <ObstacleComponent key={o.id} obstacle={o} />
          ))}
        </>
      )}
       { !gameStarted && <div className="absolute bottom-0 left-0 w-full h-5 bg-green-300"></div>}
    </GameScreen>
  );
};

export default App;