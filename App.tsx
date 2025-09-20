
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { GameState, Obstacle, Cloud, BackgroundTheme } from './types';
import * as C from './constants';

type HighScore = {
  score: number;
  height: number;
};

const Player: React.FC<{ y: number }> = ({ y }) => (
  <div
    className="absolute bg-pink-400 rounded-full"
    style={{
      width: C.PLAYER_SIZE,
      height: C.PLAYER_SIZE,
      left: C.PLAYER_X_POSITION,
      top: y,
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      zIndex: 10,
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
      zIndex: 5,
    };
    let bgColor = 'bg-teal-400';

    if (obstacle.type === 'gold') {
        bgColor = 'bg-yellow-400';
    } else if (obstacle.type === 'gold-glowing') {
        bgColor = 'bg-yellow-400';
        style.boxShadow = '0 0 10px 2px rgba(250, 204, 21, 0.7)'; // Yellow glow effect
    } else if (obstacle.type === 'blue') {
        bgColor = 'bg-blue-500';
        style.boxShadow = '0 0 10px 2px rgba(59, 130, 246, 0.7)'; // Glow effect
    } else if (obstacle.type === 'red') {
        bgColor = 'bg-red-500';
        style.boxShadow = '0 0 10px 2px rgba(239, 68, 68, 0.7)'; // Red glow effect
    } else if (obstacle.type === 'green') {
        bgColor = 'bg-green-500';
        style.boxShadow = '0 0 10px 2px rgba(34, 197, 94, 0.7)'; // Green glow effect
    }


    return (
      <div
        className={`absolute rounded-full ${bgColor}`}
        style={style}
      />
    );
};

const CloudComponent: React.FC<{ cloud: Cloud }> = ({ cloud }) => (
  <div
    className="absolute bg-white rounded-full"
    style={{
      left: cloud.x,
      top: cloud.y,
      width: cloud.size,
      height: cloud.size / 2, // Make clouds oval
      opacity: cloud.opacity,
      zIndex: 1, // Behind everything else
    }}
  />
);

const DarkCloudComponent: React.FC<{ cloud: Cloud }> = ({ cloud }) => (
  <div
    className="absolute bg-gray-600 rounded-full"
    style={{
      left: cloud.x,
      top: cloud.y,
      width: cloud.size,
      height: cloud.size / 2,
      opacity: cloud.opacity * 0.8, // Make them a bit more subtle
      zIndex: 1,
    }}
  />
);

const MountainsComponent: React.FC = () => {
    const MOUNTAINS_MAX_HEIGHT = C.GAME_HEIGHT * 0.35;
    const roundedPeakPath = 'polygon(0% 100%, 48% 2%, 50% 0%, 52% 2%, 100% 100%)';

    return (
        <div
            className="absolute bottom-0 left-0 w-full"
            style={{
                height: MOUNTAINS_MAX_HEIGHT,
                zIndex: 2,
            }}
        >
            {/* Mountain 1 - middle, tallest */}
            <div
                className="absolute bg-slate-500"
                style={{
                    width: 350,
                    height: 280,
                    bottom: 0,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    clipPath: roundedPeakPath,
                }}
            >
                {/* Snow cap 1 */}
                <div
                    className="absolute bg-white"
                    style={{
                        width: '48%',
                        height: '32%',
                        top: 0,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        clipPath: roundedPeakPath,
                    }}
                />
            </div>

            {/* Mountain 2 - left, smaller */}
             <div
                className="absolute bg-slate-400"
                style={{
                    width: 280,
                    height: 210,
                    bottom: 0,
                    left: -48,
                    clipPath: roundedPeakPath,
                }}
            >
                {/* Snow cap 2 */}
                <div
                    className="absolute bg-white"
                    style={{
                        width: '45%',
                        height: '12%',
                        top: 0,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        clipPath: roundedPeakPath,
                    }}
                />
            </div>

            {/* Mountain 3 - right, smaller */}
            <div
                className="absolute"
                style={{
                    width: 308,
                    height: 238,
                    bottom: 0,
                    right: -72,
                    backgroundColor: '#9ca9bd',
                    clipPath: roundedPeakPath,
                }}
            >
                 {/* Snow cap 3 */}
                <div
                    className="absolute bg-white"
                    style={{
                        width: '45.5%',
                        height: '20%',
                        top: 0,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        clipPath: roundedPeakPath,
                    }}
                />
            </div>
        </div>
    );
};


const BushComponent: React.FC<{ offset: number }> = ({ offset }) => {
  const BUSH_HEIGHT = C.GAME_HEIGHT * 0.15;
  const BUSH_WIDTH = BUSH_HEIGHT * 1.5;
  const LEAF_SIZE = BUSH_HEIGHT * 0.7;

  return (
    <div
      className="absolute left-5"
      style={{
        width: BUSH_WIDTH,
        height: BUSH_HEIGHT,
        zIndex: 2,
        bottom: `calc(0px - ${offset}px)`,
        transition: 'bottom 0.4s ease-out',
      }}
    >
      <div
        className="absolute bg-green-400 rounded-full"
        style={{
          width: LEAF_SIZE,
          height: LEAF_SIZE,
          bottom: 0,
          left: 0,
          opacity: 1,
        }}
      />
      <div
        className="absolute bg-green-400 rounded-full"
        style={{
          width: LEAF_SIZE * 1.1,
          height: LEAF_SIZE * 1.1,
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          opacity: 1,
        }}
      />
       <div
        className="absolute bg-green-400 rounded-full"
        style={{
          width: LEAF_SIZE,
          height: LEAF_SIZE,
          bottom: 0,
          right: 0,
          opacity: 1,
        }}
      />
    </div>
  );
};


const TreeComponent: React.FC<{ offset: number }> = ({ offset }) => {
    const TREE_HEIGHT = C.GAME_HEIGHT * 0.30;
    const TRUNK_HEIGHT = TREE_HEIGHT * 0.6;
    const TRUNK_WIDTH = TREE_HEIGHT * 0.15;
    const LEAVES_HEIGHT = TREE_HEIGHT * 0.5;
    const LEAVES_WIDTH = TREE_HEIGHT * 0.6;

    return (
        <div
            className="absolute right-8"
            style={{
                width: LEAVES_WIDTH,
                height: TREE_HEIGHT,
                zIndex: 2,
                bottom: `calc(0px - ${offset}px)`,
                transition: 'bottom 0.4s ease-out',
            }}
        >
            <div
                className="absolute bg-yellow-800 bottom-0"
                style={{
                    width: TRUNK_WIDTH,
                    height: TRUNK_HEIGHT,
                    left: `calc(50% - ${TRUNK_WIDTH / 2}px)`,
                }}
            />
             <div
                className="absolute bg-green-500 rounded-full top-0"
                style={{
                    width: LEAVES_WIDTH,
                    height: LEAVES_HEIGHT,
                }}
            />
        </div>
    )
};

const OutdoorBackground: React.FC<{ sceneryOffset: number; clouds: Cloud[] }> = ({ sceneryOffset, clouds }) => (
    <>
        {clouds.map(cloud => <CloudComponent key={cloud.id} cloud={cloud} />)}
        <MountainsComponent />
        <BushComponent offset={sceneryOffset} />
        <TreeComponent offset={sceneryOffset} />
    </>
);

const MoonComponent: React.FC = () => (
    <div
        className="absolute bg-yellow-100 rounded-full"
        style={{
            width: 60,
            height: 60,
            top: '10%',
            right: '15%',
            boxShadow: '0 0 20px 10px rgba(254, 249, 195, 0.5)',
            zIndex: 1,
        }}
    />
);

const CityscapeComponent: React.FC = () => (
    <div className="absolute bottom-0 left-0 w-full h-1/2 z-1">
        {/* Far buildings */}
        <div className="absolute bg-gray-700 bottom-0 left-10 w-16 h-3/4" />
        <div className="absolute bg-gray-700 bottom-0 left-32 w-20 h-1/2" />
        <div className="absolute bg-gray-700 bottom-0 right-20 w-24 h-2/3" />
        {/* Near buildings */}
        <div className="absolute bg-gray-800 bottom-0 left-0 w-20 h-1/2" />
        <div className="absolute bg-gray-800 bottom-0 left-20 w-28 h-1/3" style={{height: '60%'}}/>
        <div className="absolute bg-gray-800 bottom-0 right-0 w-32 h-1/2" />
        <div className="absolute bg-gray-800 bottom-0 right-40 w-16 h-full" />
    </div>
);

const StreetlightComponent: React.FC<{ offset: number }> = ({ offset }) => (
    <div
        className="absolute right-12"
        style={{ width: 10, height: 200, zIndex: 2, bottom: `calc(0px - ${offset}px)`, transition: 'bottom 0.4s ease-out' }}
    >
        <div className="absolute bg-gray-600 bottom-0 w-full h-full" />
        <div className="absolute bg-yellow-300 top-0 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full" style={{boxShadow: '0 0 15px 5px rgba(253, 224, 71, 0.7)'}}/>
    </div>
);

const ParkBenchComponent: React.FC<{ offset: number }> = ({ offset }) => (
    <div
        className="absolute left-10"
        style={{ width: 80, height: 40, zIndex: 5, bottom: `calc(${C.GROUND_PLATFORM_HEIGHT}px - ${offset}px)`, transition: 'bottom 0.4s ease-out' }}
    >
        <div className="absolute bg-yellow-800 bottom-0 w-full h-2"/>
        <div className="absolute bg-yellow-800 bottom-0 left-1 w-2 h-4"/>
        <div className="absolute bg-yellow-800 bottom-0 right-1 w-2 h-4"/>
        <div className="absolute bg-yellow-900 bottom-4 w-full h-4"/>
    </div>
);

const CityBackground: React.FC<{ sceneryOffset: number; clouds: Cloud[] }> = ({ sceneryOffset, clouds }) => (
    <>
        <MoonComponent />
        {clouds.map(cloud => <DarkCloudComponent key={cloud.id} cloud={cloud} />)}
        <CityscapeComponent />
        <StreetlightComponent offset={sceneryOffset} />
        <ParkBenchComponent offset={sceneryOffset} />
    </>
);

const CaveWindowComponent: React.FC = () => {
    const clipPath = 'polygon(0% 20%, 25% 0%, 50% 15%, 75% 0%, 100% 25%, 90% 75%, 50% 100%, 10% 80%)';
    return (
        <div
            className="absolute bg-stone-600" // A bit lighter than the darkest stalactites
            style={{
                top: '5%',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '60%',
                height: '25%',
                clipPath,
                zIndex: 1,
                padding: '4px', // Creates the border
            }}
        >
            <div
                className="w-full h-full sky-background"
                style={{
                    clipPath, // Re-apply clip-path to the inner content
                }}
            />
        </div>
    );
};

const CaveFormationsComponent: React.FC = () => (
    <>
        {/* Stalactites */}
        <div className="absolute bg-stone-700 top-0 left-10 w-20 h-40" style={{clipPath: 'polygon(0 0, 100% 0, 50% 100%)', zIndex: 2}} />
        <div className="absolute bg-stone-800 top-0 right-20 w-24 h-56" style={{clipPath: 'polygon(0 0, 100% 0, 50% 100%)', zIndex: 2}} />
        <div className="absolute bg-stone-700 top-0 left-1/2 w-16 h-32" style={{clipPath: 'polygon(0 0, 100% 0, 50% 100%)', zIndex: 2}} />
        {/* Stalagmites */}
        <div className="absolute bg-stone-600 bottom-0 left-20 w-24 h-16" style={{zIndex: 2, clipPath: 'polygon(50% 0, 0 100%, 100% 100%)'}}/>
        <div className="absolute bg-stone-700 bottom-0 right-10 w-32 h-24" style={{zIndex: 2, clipPath: 'polygon(50% 0, 0 100%, 100% 100%)'}}/>
    </>
);

const GlowingCrystalComponent: React.FC<{ offset: number, position: 'left' | 'right' }> = ({ offset, position }) => (
    <div
        className="absolute"
        style={{
            width: 50, height: 80, zIndex: 2, bottom: `calc(0px - ${offset}px)`, transition: 'bottom 0.4s ease-out',
            left: position === 'left' ? '40px' : undefined,
            right: position === 'right' ? '40px' : undefined,
        }}
    >
        <div
            className="absolute bg-cyan-300 w-full h-full"
            style={{
                clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                boxShadow: '0 0 20px 8px rgba(34, 211, 238, 0.6)',
                opacity: 0.8
            }}
        />
    </div>
);

const BlinkingGemComponent: React.FC<{ type: 'diamond' | 'sapphire' | 'gold'; style: React.CSSProperties; isBlinking: boolean }> = ({ type, style, isBlinking }) => {
    let gemStyle: React.CSSProperties = {};

    switch (type) {
        case 'diamond':
            gemStyle = {
                backgroundColor: '#e0f2fe', // light blue/white
                clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)',
                boxShadow: '0 0 8px 3px rgba(173, 232, 244, 0.7)',
            };
            break;
        case 'sapphire':
            gemStyle = {
                backgroundColor: '#60a5fa', // blue-400
                clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
                boxShadow: '0 0 10px 4px rgba(96, 165, 250, 0.6)',
            };
            break;
        case 'gold':
            gemStyle = {
                backgroundColor: '#facc15', // yellow-400
                borderRadius: '40% 60% 50% 50% / 60% 40% 50% 50%',
                boxShadow: '0 0 6px 2px rgba(250, 204, 21, 0.5)',
            };
            break;
    }

    const combinedStyle: React.CSSProperties = {
        ...style,
        ...gemStyle,
        position: 'absolute',
        zIndex: 2,
        opacity: 0.4, // Base style for non-blinking state
    };

    return <div style={combinedStyle} className={isBlinking ? 'blinking-gem' : ''} />;
};


const CaveBackground: React.FC<{ sceneryOffset: number }> = ({ sceneryOffset }) => {
    const gems = useMemo(() => [
        // Side gems
        { type: 'sapphire', style: { top: '35%', left: '15px', width: 15, height: 20 } },
        { type: 'diamond', style: { top: '45%', right: '25px', width: 12, height: 16 } },
        { type: 'gold', style: { bottom: '30%', left: '30px', width: 18, height: 14 } },
        { type: 'sapphire', style: { bottom: '40%', right: '10px', width: 16, height: 22 } },
        { type: 'gold', style: { top: '28%', right: '40px', width: 20, height: 16 } },
        // Middle gems
        { type: 'diamond', style: { top: '55%', left: '40%', width: 14, height: 18 } },
        { type: 'gold', style: { bottom: '20%', left: '55%', width: 16, height: 12 } },
        { type: 'sapphire', style: { top: '65%', right: '45%', width: 15, height: 20 } },
    ], []);

    const [blinkingGemIndex, setBlinkingGemIndex] = useState<number | null>(null);

    useEffect(() => {
        let blinkTimeoutId: number;
        let intervalTimeoutId: number;

        const triggerNextBlink = () => {
            const nextBlinkingIndex = Math.floor(Math.random() * gems.length);
            setBlinkingGemIndex(nextBlinkingIndex);

            // Turn off the blink after animation duration (500ms)
            blinkTimeoutId = window.setTimeout(() => {
                setBlinkingGemIndex(null);
            }, 500); 

            // Schedule the next blink after a random interval
            const randomInterval = 500 + Math.random() * 4500; // 0.5s to 5s
            intervalTimeoutId = window.setTimeout(triggerNextBlink, randomInterval);
        };

        // Start the first blink after an initial random delay
        intervalTimeoutId = window.setTimeout(triggerNextBlink, 500 + Math.random() * 4500);

        return () => {
            clearTimeout(blinkTimeoutId);
            clearTimeout(intervalTimeoutId);
        };
    }, [gems]);

    return (
        <>
            <CaveWindowComponent />
            {gems.map((gem, index) => (
                <BlinkingGemComponent key={index} type={gem.type as any} style={gem.style} isBlinking={blinkingGemIndex === index} />
            ))}
            <CaveFormationsComponent />
            <GlowingCrystalComponent offset={sceneryOffset} position="left"/>
            <GlowingCrystalComponent offset={sceneryOffset} position="right"/>
        </>
    );
};


const Overlay: React.FC<{ children: React.ReactNode; zIndex?: number; maxWidthClass?: string }> = ({ children, zIndex = 30, maxWidthClass = 'max-w-sm' }) => (
    <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-center p-4" style={{ zIndex }}>
        <div
            className={`bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg w-full ${maxWidthClass}`}
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
        >
            {children}
        </div>
    </div>
);

const HallOfPay: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  type PayData = { value: string; user: string };
  const [payData, setPayData] = useState<PayData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHallOfPay = async () => {
      const sheetUrl = 'https://docs.google.com/spreadsheets/d/1Dkrzo9oExWrekcA7YVM_2h-evd4Lb4eMlXSZFapkFHc/export?format=csv';

      try {
          const response = await fetch(sheetUrl);
          if (!response.ok) {
              throw new Error(`Network response was not ok: ${response.statusText}`);
          }
          const csvText = await response.text();
          
          const lines = csvText.trim().split(/\r?\n/);

          if (lines.length === 0) {
              throw new Error('CSV file is empty.');
          }

          const data: PayData[] = lines.map(line => {
              const commaIndex = line.indexOf(',');
              if (commaIndex !== -1) {
                  // Handles rows with a comma, e.g., "$0.01,Konrad" or "$0.89,"
                  const value = line.substring(0, commaIndex).trim().replace(/^"|"$/g, '');
                  const user = line.substring(commaIndex + 1).trim().replace(/^"|"$/g, '');
                  if (value) {
                      return { value, user };
                  }
              } else if (line.trim()) {
                  // Handles rows without a comma, e.g., "$0.89"
                  const value = line.trim().replace(/^"|"$/g, '');
                  if (value) {
                      return { value, user: '' };
                  }
              }
              return null;
          }).filter((item): item is PayData => item !== null);


          if (data.length === 0) {
              throw new Error('No valid data rows found in the Google Sheet.');
          }

          setPayData(data);
      } catch (err) {
          console.error('Error fetching or parsing Hall of Pay from Google Sheet:', err);
          setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      } finally {
          setIsLoading(false);
      }
    };

    fetchHallOfPay();
  }, []);
  
  const getColorForRow = (index: number, totalRows: number): string => {
    if (index < 5) {
      const grayValue = Math.floor((150 / 5) * index);
      return `rgb(${grayValue}, ${grayValue}, ${grayValue})`;
    }
    const hue = 300 - (300 * (index - 5)) / (totalRows - 5);
    return `hsl(${hue}, 80%, 50%)`;
  };

  const scrollbarStyles = `
    .custom-scrollbar::-webkit-scrollbar {
      width: 10px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: rgba(0, 0, 0, 0.05);
      border-radius: 10px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: #ffffff;
      border-radius: 10px;
      border: 1px solid #e0e0e0;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: #f0f0f0;
    }
  `;

  return (
    <Overlay maxWidthClass="max-w-md">
        <style>{scrollbarStyles}</style>
        <div className="relative w-full">
            <h2 className="text-3xl font-bold text-teal-600 mb-2">Hall of Pay</h2>
            <p className="text-gray-500 text-sm mb-4 italic">The first person to donate at each level will be remembered forever. It could be you! And, of course, I reserve the right to have the final say if you choose a 'funny' name for yourself."</p>
            <div className="bg-white/50 p-4 rounded-lg">
                {isLoading ? (
                    <div className="min-h-[100px] flex justify-center items-center">
                        <p className="text-gray-600 font-bold">Loading Hall of Pay...</p>
                    </div>
                ) : error ? (
                    <div className="min-h-[100px] flex justify-center items-center text-center text-red-600">
                        <div>
                            <p className="font-bold">Could not load data</p>
                            <p className="text-sm">{error}</p>
                        </div>
                    </div>
                ) : (
                    <>
                        <table className="w-full text-left table-fixed">
                            <thead>
                                <tr className="border-b-2 border-gray-300">
                                    <th className="p-2 font-bold text-gray-700 w-1/2">Level</th>
                                    <th className="p-2 font-bold text-gray-700 w-1/2">Name</th>
                                </tr>
                            </thead>
                        </table>
                        <div className="max-h-[340px] overflow-y-auto custom-scrollbar">
                             <table className="w-full text-left table-fixed">
                                <tbody>
                                    {payData.map((row, index) => (
                                        <tr key={index} className="border-b border-gray-200 last:border-b-0">
                                            <td className="p-2 font-mono w-1/2" style={{ color: getColorForRow(index, payData.length) }}>{row.value}</td>
                                            <td className="p-2 text-gray-500 opacity-75 w-1/2 break-words">{row.user}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
            <div className="flex justify-center items-center space-x-4 mt-6">
                <a
                    href={C.DONATE_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-3 bg-green-500 text-white font-bold rounded-lg shadow-md hover:bg-green-600 transition-colors"
                >
                    Donate
                </a>
                <button
                    onClick={onClose}
                    className="px-8 py-3 bg-pink-400 text-white font-bold rounded-lg shadow-md hover:bg-pink-500 transition-colors"
                >
                    Close
                </button>
            </div>
        </div>
    </Overlay>
  );
};

const Other: React.FC<{
  onClose: () => void;
  difficulty: number;
  onDifficultyChange: (newDifficulty: number) => void;
  highScores: HighScore[];
  onShowRules: () => void;
  onShowBackgrounds: () => void;
}> = ({ onClose, difficulty, onDifficultyChange, highScores, onShowRules, onShowBackgrounds }) => {
  const scrollbarStyles = `
    .custom-scrollbar::-webkit-scrollbar {
      width: 10px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: rgba(0, 0, 0, 0.05);
      border-radius: 10px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: #ffffff;
      border-radius: 10px;
      border: 1px solid #e0e0e0;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: #f0f0f0;
    }
  `;
  return (
    <Overlay>
      <style>{scrollbarStyles}</style>
      <div className="relative w-full">
        <h2 className="text-3xl font-bold text-teal-600 mb-6">Other</h2>
        <div className="bg-white/50 p-6 rounded-lg space-y-6">
          <div>
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
          <div>
            <h3 className="text-gray-700 font-bold mb-2 text-center">Personal Bests</h3>
             <div className="bg-white/50 rounded-lg">
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="border-b-2 border-gray-300">
                      <th className="w-1/3 p-2 font-bold text-gray-700 text-center">Difficulty</th>
                      <th className="w-1/3 p-2 font-bold text-gray-700 text-center">High Score</th>
                      <th className="w-1/3 p-2 font-bold text-gray-700 text-center">Max Height</th>
                    </tr>
                  </thead>
                </table>
                <div className="max-h-[150px] overflow-y-auto custom-scrollbar">
                  <table className="w-full text-sm text-left">
                    <tbody>
                      {highScores.map((scoreData, index) => (
                        <tr key={index} className="border-b border-gray-200 last:border-b-0">
                          <td className="w-1/3 p-2 font-mono text-center text-black">{index + 1}</td>
                          <td className="w-1/3 p-2 font-mono text-center text-black">{scoreData.score}</td>
                          <td className="w-1/3 p-2 font-mono text-center text-black">{Math.round(scoreData.height)}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
          </div>
          <div className="space-y-4">
            <a
              href={C.DONATE_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full block px-8 py-3 bg-green-500 text-white font-bold rounded-lg shadow-md hover:bg-green-600 transition-colors"
            >
              Donate
            </a>
            <p className="text-gray-500 text-xs italic text-center">
              If you donation will be bigger than lowest not taken spot then you will get that spot in the 'Hall of Pay'. 
            </p>
            <button
              onClick={onShowBackgrounds}
              className="w-full block px-8 py-3 bg-purple-500 text-white font-bold rounded-lg shadow-md hover:bg-purple-600 transition-colors"
            >
              Background
            </button>
             <button
              onClick={onShowRules}
              className="w-full block px-8 py-3 bg-gray-400 text-white font-bold rounded-lg shadow-md hover:bg-gray-500 transition-colors"
            >
              Rules
            </button>
          </div>
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

const RulesComponent: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const obstacleTypes = [
    { color: 'bg-teal-400', name: 'Normal', effect: 'Pass to score 1 point. Touching ends the game.', appears: 'From start' },
    { color: 'bg-yellow-400', name: 'Gold', effect: 'Collect for +64 points. Safe to touch.', appears: 'From start' },
    { color: 'bg-yellow-400 glow', name: 'Glowing Gold', effect: 'Collect for +256 points. Spawns low, moves fast.', appears: 'Score > 768', style: { boxShadow: '0 0 10px 2px rgba(250, 204, 21, 0.7)'}},
    { color: 'bg-green-500 glow', name: 'Green', effect: 'Teleports you 25% down. Safe to touch.', appears: 'Score > 128', style: { boxShadow: '0 0 10px 2px rgba(34, 197, 94, 0.7)'}},
    { color: 'bg-blue-500 glow', name: 'Blue', effect: 'Touching ends the game instantly.', appears: 'Score > 512', style: { boxShadow: '0 0 10px 2px rgba(59, 130, 246, 0.7)'}},
    { color: 'bg-red-500 glow', name: 'Red', effect: 'Touching subtracts 50 points.', appears: 'Score > 1024', style: { boxShadow: '0 0 10px 2px rgba(239, 68, 68, 0.7)'}},
  ];
  return (
    <Overlay zIndex={40}>
       <h2 className="text-3xl font-bold text-teal-600 mb-4">Game Rules</h2>
       <div className="bg-white/50 p-4 rounded-lg space-y-4 text-left">
          <div>
            <h3 className="font-bold text-gray-800">How to Play</h3>
            <ul className="list-disc list-inside text-gray-700 text-sm space-y-1 mt-1">
                <li>Press <span className="font-mono bg-gray-200 px-1.5 py-0.5 rounded">SPACE</span> to jump.</li>
                <li>Your jump is weaker the higher you are.</li>
                <li>Avoid teal obstacles to score points.</li>
                <li>Survive as long as you can!</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-gray-800">Obstacles</h3>
            <div className="space-y-3 mt-2">
              {obstacleTypes.map(o => (
                <div key={o.name} className="flex items-center space-x-3 text-sm">
                  <div className={`w-5 h-5 rounded-full flex-shrink-0 ${o.color}`} style={o.style || {}}></div>
                  <div className="flex-grow">
                    <p className="font-bold text-gray-700">{o.name}</p>
                    <p className="text-gray-600">{o.effect}</p>
                  </div>
                   <div className="text-xs font-mono bg-gray-200 px-1.5 py-0.5 rounded text-gray-600">{o.appears}</div>
                </div>
              ))}
            </div>
          </div>
       </div>
       <button
          onClick={onClose}
          className="mt-6 px-8 py-3 bg-pink-400 text-white font-bold rounded-lg shadow-md hover:bg-pink-500 transition-colors"
        >
          Close
        </button>
    </Overlay>
  )
};

const BackgroundSelectionComponent: React.FC<{
  onClose: () => void;
  currentTheme: BackgroundTheme;
  onSelectTheme: (theme: BackgroundTheme) => void;
}> = ({ onClose, currentTheme, onSelectTheme }) => {
  const themes: { id: BackgroundTheme; name: string; preview: React.ReactNode }[] = [
    { id: 'outdoor', name: 'Outdoor', preview: <div className="w-full h-full bg-sky-300 flex items-end"><div className="w-full h-1/3 bg-green-400"/></div> },
    { id: 'city', name: 'City', preview: <div className="w-full h-full bg-slate-700 flex items-end"><div className="w-4 h-1/2 bg-gray-500 ml-4"/><div className="w-6 h-2/3 bg-gray-500 ml-2"/></div> },
    { id: 'cave', name: 'Cave', preview: <div className="w-full h-full bg-stone-800 flex items-end"><div className="w-4 h-1/3 bg-stone-600 ml-6" style={{clipPath: 'polygon(50% 0, 0 100%, 100% 100%)'}}/></div> },
  ];

  return (
    <Overlay zIndex={40}>
      <h2 className="text-3xl font-bold text-teal-600 mb-6">Choose Background</h2>
      <div className="space-y-4 w-full">
        {themes.map(theme => (
          <button
            key={theme.id}
            onClick={() => onSelectTheme(theme.id)}
            className={`w-full h-24 rounded-lg overflow-hidden relative border-4 transition-all ${currentTheme === theme.id ? 'border-pink-400' : 'border-transparent hover:border-pink-200'}`}
          >
            {theme.preview}
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <span className="text-white text-2xl font-bold tracking-wider">{theme.name}</span>
            </div>
          </button>
        ))}
      </div>
      <button
        onClick={onClose}
        className="mt-8 px-8 py-3 bg-pink-400 text-white font-bold rounded-lg shadow-md hover:bg-pink-500 transition-colors"
      >
        Back
      </button>
    </Overlay>
  );
};


const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.PreGame);
  const [score, setScore] = useState(0);
  const [maxHeightReached, setMaxHeightReached] = useState(0);
  const [playerPositionY, setPlayerPositionY] = useState(C.PLAYER_GROUND_Y);
  const [playerVelocityY, setPlayerVelocityY] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [clouds, setClouds] = useState<Cloud[]>([]);
  const [canRestart, setCanRestart] = useState(false);
  const [gameOverReason, setGameOverReason] = useState<'score' | 'idle' | 'blue' | 'top'>('score');
  const [showHallOfPay, setShowHallOfPay] = useState(false);
  const [showOther, setShowOther] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [showBackgrounds, setShowBackgrounds] = useState(false);
  const [difficulty, setDifficulty] = useState(3);
  const [scale, setScale] = useState(1);
  const [sceneryOffset, setSceneryOffset] = useState(0);
  const [backgroundTheme, setBackgroundTheme] = useState<BackgroundTheme>(() => {
    const savedTheme = localStorage.getItem('pastelJumpBackground');
    return (savedTheme === 'city' || savedTheme === 'cave') ? savedTheme : 'outdoor';
  });
  const [highScores, setHighScores] = useState<HighScore[]>(() => {
    try {
        const savedScores = localStorage.getItem('pastelJumpHighScores');
        if (savedScores) {
            const parsed = JSON.parse(savedScores);
            // Check for new format: {score, height}
            if (Array.isArray(parsed) && parsed.length === 10 && parsed.every(item => typeof item === 'object' && 'score' in item && 'height' in item)) {
                return parsed;
            }
             // Check for old format (number[]) and migrate
            if (Array.isArray(parsed) && parsed.length === 10 && parsed.every(item => typeof item === 'number')) {
                return parsed.map(score => ({ score, height: 0 }));
            }
        }
    } catch (error) {
        console.error("Failed to load high scores:", error);
    }
    return Array(10).fill({ score: 0, height: 0 });
  });


  const gameLoopRef = useRef<number | null>(null);
  const obstacleSpawnersRef = useRef<number[]>([]);
  const lastFrameTimeRef = useRef(0);
  const scoreRef = useRef(score);

  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  const handleSelectTheme = (theme: BackgroundTheme) => {
    setBackgroundTheme(theme);
    try {
      localStorage.setItem('pastelJumpBackground', theme);
    } catch (error) {
      console.error("Failed to save background theme:", error);
    }
  };
  
  const createRandomCloud = (): Cloud => {
    const size = C.CLOUD_MIN_SIZE + Math.random() * (C.CLOUD_MAX_SIZE - C.CLOUD_MIN_SIZE);
    // Split clouds into two layers for parallax
    const isFast = Math.random() > 0.5;
    return {
      id: Math.random(),
      x: Math.random() * C.GAME_WIDTH,
      y: C.CLOUD_Y_MIN + Math.random() * (C.CLOUD_Y_MAX - C.CLOUD_Y_MIN),
      size: size,
      speed: (isFast ? 1 : 0.5) * (C.CLOUD_SPEED_MIN + Math.random() * (C.CLOUD_SPEED_MAX - C.CLOUD_SPEED_MIN)),
      opacity: (isFast ? 1 : 0.7) * (C.CLOUD_OPACITY_MIN + Math.random() * (C.CLOUD_OPACITY_MAX - C.CLOUD_OPACITY_MIN)),
    };
  };

  useEffect(() => {
    setClouds(Array.from({ length: C.CLOUD_COUNT }, createRandomCloud));
  }, []);
  
  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      const scale = Math.min(screenWidth / C.GAME_WIDTH, screenHeight / C.GAME_HEIGHT);
      setScale(scale);
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial calculation

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const resetGame = useCallback(() => {
    setScore(0);
    setMaxHeightReached(0);
    setPlayerPositionY(C.PLAYER_GROUND_Y);
    setPlayerVelocityY(0);
    setGameStarted(false);
    setObstacles([]);
    setCanRestart(false);
    setGameOverReason('score');
    setShowHallOfPay(false);
    setShowOther(false);
    setShowRules(false);
    setShowBackgrounds(false);
    setSceneryOffset(0);
    setGameState(GameState.Playing);
  }, []);

  const goToStartScreen = useCallback(() => {
    setScore(0);
    setMaxHeightReached(0);
    setPlayerPositionY(C.PLAYER_GROUND_Y);
    setPlayerVelocityY(0);
    setGameStarted(false);
    setObstacles([]);
    setCanRestart(false);
    setGameOverReason('score');
    setShowHallOfPay(false);
    setShowOther(false);
    setShowRules(false);
    setShowBackgrounds(false);
    setSceneryOffset(0);
    setGameState(GameState.PreGame);
  }, []);

  const handleJump = useCallback(() => {
    if (gameState === GameState.Playing) {
      if (!gameStarted) {
        setGameStarted(true);
        setSceneryOffset(C.GAME_HEIGHT * 0.05);
      }
      
      const heightFromGround = C.PLAYER_GROUND_Y - playerPositionY;
      const totalClimbableHeight = C.PLAYER_GROUND_Y;
      const heightRatio = Math.max(0, heightFromGround / totalClimbableHeight);

      const heightSegments = Math.floor(heightRatio * 10);
      
      const decayedJumpImpulse = C.JUMP_IMPULSE * Math.pow(C.JUMP_IMPULSE_DECAY_FACTOR, heightSegments);

      setPlayerVelocityY(decayedJumpImpulse);
    }
  }, [gameState, gameStarted, playerPositionY]);

  const handleUserAction = useCallback(() => {
    if (gameState === GameState.PreGame || (gameState === GameState.GameOver && canRestart)) {
      resetGame();
    } else if (gameState === GameState.Playing) {
      handleJump();
    }
  }, [gameState, canRestart, resetGame, handleJump]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        handleUserAction();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUserAction]);


  const spawnObstacle = useCallback(() => {
    const direction = Math.random() < 0.5 ? 'left' : 'right';
    const currentScore = scoreRef.current;
    
    let type: Obstacle['type'];

    if (currentScore >= C.RED_OBSTACLE_MIN_SCORE_TO_APPEAR && Math.random() < C.RED_OBSTACLE_SPAWN_CHANCE) {
      type = 'red';
    } else if (currentScore >= C.BLUE_OBSTACLE_MIN_SCORE_TO_APPEAR && Math.random() < C.BLUE_OBSTACLE_SPAWN_CHANCE) {
      type = 'blue';
    } else if (currentScore >= C.GREEN_OBSTACLE_MIN_SCORE_to_APPEAR && Math.random() < C.GREEN_OBSTACLE_SPAWN_CHANCE) {
      type = 'green';
    } else if (currentScore >= C.GLOWING_GOLD_OBSTACLE_MIN_SCORE_TO_APPEAR && Math.random() < C.GLOWING_GOLD_OBSTACLE_SPAWN_CHANCE) {
      type = 'gold-glowing';
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
    } else if (type === 'gold-glowing') {
        const spawnRangeY = C.GAME_HEIGHT * (C.OBSTACLE_GLOWING_GOLD_SPAWN_Y_MAX_PERCENT - C.OBSTACLE_GLOWING_GOLD_SPAWN_Y_MIN_PERCENT);
        const startY = C.GAME_HEIGHT * C.OBSTACLE_GLOWING_GOLD_SPAWN_Y_MIN_PERCENT;
        y = startY + Math.random() * spawnRangeY;
        speed = C.OBSTACLE_GLOWING_GOLD_SPEED_MIN + Math.random() * (C.OBSTACLE_GLOWING_GOLD_SPEED_MAX - C.OBSTACLE_GLOWING_GOLD_SPEED_MIN);
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
    } else if (type === 'green') {
        const spawnRangeY = C.GAME_HEIGHT * (C.OBSTACLE_GREEN_SPAWN_Y_MAX_PERCENT - C.OBSTACLE_GREEN_SPAWN_Y_MIN_PERCENT);
        const startY = C.GAME_HEIGHT * C.OBSTACLE_GREEN_SPAWN_Y_MIN_PERCENT;
        y = startY + Math.random() * spawnRangeY;
        speed = C.OBSTACLE_GREEN_SPEED_MIN + Math.random() * (C.OBSTACLE_GREEN_SPEED_MAX - C.OBSTACLE_GREEN_SPEED_MIN);
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
    const deltaTime = (currentTime - lastFrameTimeRef.current) / 1000;
    lastFrameTimeRef.current = currentTime;

    // Move clouds for outdoor and city themes
    if (deltaTime > 0 && (backgroundTheme === 'outdoor' || backgroundTheme === 'city')) {
      setClouds(prevClouds => prevClouds.map(cloud => {
        let newX = cloud.x - cloud.speed * deltaTime;
        if (newX < -cloud.size) {
          // Reset cloud when it goes off-screen
          newX = C.GAME_WIDTH;
          return {
            ...cloud,
            x: newX,
            y: C.CLOUD_Y_MIN + Math.random() * (C.CLOUD_Y_MAX - C.CLOUD_Y_MIN),
            size: C.CLOUD_MIN_SIZE + Math.random() * (C.CLOUD_MAX_SIZE - C.CLOUD_MIN_SIZE),
          };
        }
        return { ...cloud, x: newX };
      }));
    }

    if (gameState !== GameState.Playing) {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
      return;
    }

    if (deltaTime > 0 && gameStarted) {
      const newVelocity = playerVelocityY + C.GRAVITY * deltaTime;
      const newPosition = playerPositionY + newVelocity * deltaTime;
      
      setPlayerVelocityY(newVelocity);
      setPlayerPositionY(newPosition);

      // Track max height
      const currentHeightPercent = Math.max(0, ((C.PLAYER_GROUND_Y - newPosition) / C.PLAYER_GROUND_Y) * 100);
      setMaxHeightReached(prevMax => Math.max(prevMax, currentHeightPercent));

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
    let greenCollisions = 0;

    for (const obstacle of movedObstacles) {
        const playerRadius = C.PLAYER_SIZE / 2;
        const obstacleRadius = C.OBSTACLE_SIZE / 2;
        
        const playerCenterX = C.PLAYER_X_POSITION + playerRadius;
        const playerCenterY = playerPositionY + playerRadius;

        const obstacleCenterX = obstacle.x + obstacleRadius;
        const obstacleCenterY = obstacle.y + obstacleRadius;
        
        const dx = playerCenterX - obstacleCenterX;
        const dy = playerCenterY - obstacleCenterY;
        const distanceSquared = dx * dx + dy * dy;
        
        const radiiSum = playerRadius + obstacleRadius;
        const radiiSumSquared = radiiSum * radiiSum;

        if (distanceSquared < radiiSumSquared) {
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
                } else if (obstacle.type === 'gold-glowing') {
                    scoreChange += C.OBSTACLE_GLOWING_GOLD_POINTS;
                } else if (obstacle.type === 'red') {
                    scoreChange += C.OBSTACLE_RED_POINTS;
                } else if (obstacle.type === 'blue') {
                    scoreChange += C.OBSTACLE_BLUE_POINTS;
                } else if (obstacle.type === 'green') {
                    greenCollisions++;
                }
                collidedObstacleIds.add(obstacle.id);
             }
        }
    }

    if (greenCollisions > 0) {
        const pushDown = C.GAME_HEIGHT * 0.25 * greenCollisions;
        setPlayerPositionY(prevY => Math.min(prevY + pushDown, C.BOTTOM_BOUNDARY - C.PLAYER_SIZE));
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
  }, [gameState, obstacles, playerPositionY, playerVelocityY, gameStarted, backgroundTheme]);

  useEffect(() => {
    // This effect starts/stops the animation frame loop
    lastFrameTimeRef.current = performance.now();
    gameLoopRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameLoop]);
  
  // Effect for handling the restart delay and saving scores
  useEffect(() => {
    if (gameState === GameState.GameOver) {
        setSceneryOffset(0);
        const timer = setTimeout(() => {
            setCanRestart(true);
        }, 1000);

        const difficultyIndex = difficulty - 1;
        const currentBest = highScores[difficultyIndex];
        
        const isNewHighScore = score > currentBest.score;
        const isNewMaxHeight = maxHeightReached > currentBest.height;

        if (isNewHighScore || isNewMaxHeight) {
            const newHighScores = [...highScores];
            newHighScores[difficultyIndex] = {
                score: isNewHighScore ? score : currentBest.score,
                height: isNewMaxHeight ? maxHeightReached : currentBest.height,
            };
            setHighScores(newHighScores);
            try {
                localStorage.setItem('pastelJumpHighScores', JSON.stringify(newHighScores));
            } catch (error) {
                console.error("Failed to save high scores:", error);
            }
        }
        
        return () => clearTimeout(timer);
    }
  }, [gameState, score, difficulty, highScores, maxHeightReached]);

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

  const getBackgroundClass = (theme: BackgroundTheme) => {
    switch (theme) {
      case 'city': return 'city-background';
      case 'cave': return 'cave-background';
      default: return 'sky-background';
    }
  };

  return (
    <div className="flex justify-center items-center w-screen h-screen bg-black font-sans">
      <style>{`
        @keyframes single-blink-glow {
            0%, 100% {
                opacity: 0.4;
                transform: scale(1);
                filter: brightness(1);
            }
            50% {
                opacity: 1;
                transform: scale(1.1);
                filter: brightness(1.5);
            }
        }
        .blinking-gem {
            animation-name: single-blink-glow;
            animation-duration: 0.5s;
            animation-timing-function: ease-in-out;
        }
      `}</style>
      <div
        className={`relative overflow-hidden rounded-2xl shadow-2xl ${getBackgroundClass(backgroundTheme)}`}
        style={{
          width: C.GAME_WIDTH,
          height: C.GAME_HEIGHT,
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
          cursor: 'pointer',
        }}
        onMouseDown={(e) => {
          e.preventDefault();
          handleUserAction();
        }}
        onTouchStart={(e) => {
          e.preventDefault();
          handleUserAction();
        }}
        onContextMenu={(e) => e.preventDefault()}
      >
        {backgroundTheme === 'outdoor' && <OutdoorBackground sceneryOffset={sceneryOffset} clouds={clouds} />}
        {backgroundTheme === 'city' && <CityBackground sceneryOffset={sceneryOffset} clouds={clouds} />}
        {backgroundTheme === 'cave' && <CaveBackground sceneryOffset={sceneryOffset} />}
       
        <div className="absolute top-4 right-4 bg-white/50 px-4 py-2 rounded-lg text-gray-700 font-bold text-2xl z-20">
          Score: {score}
        </div>

        {gameState === GameState.PreGame && !showHallOfPay && !showOther && !showBackgrounds && (
          <Overlay>
              <h1 className="text-4xl font-bold text-teal-600 mb-2">Pastel Jump</h1>
              <p className="text-gray-600 mb-6">Collect gold, figure out others</p>
              <div className="flex flex-col space-y-4 w-full">
                  <button
                      onClick={resetGame}
                      className="px-8 py-3 bg-pink-400 text-white font-bold rounded-lg shadow-md hover:bg-pink-500 transition-colors"
                  >
                      Press to Start
                  </button>
                  <button
                      onClick={() => setShowHallOfPay(true)}
                      className="px-8 py-3 bg-teal-500 text-white font-bold rounded-lg shadow-md hover:bg-teal-600 transition-colors"
                  >
                      Hall of Pay
                  </button>
                   <button
                      onClick={() => setShowOther(true)}
                      className="px-8 py-3 bg-blue-500 text-white font-bold rounded-lg shadow-md hover:bg-blue-600 transition-colors"
                  >
                      Other
                  </button>
              </div>
          </Overlay>
        )}

        {showHallOfPay && <HallOfPay onClose={() => setShowHallOfPay(false)} />}
        {showOther && <Other onClose={() => setShowOther(false)} difficulty={difficulty} onDifficultyChange={setDifficulty} highScores={highScores} onShowRules={() => setShowRules(true)} onShowBackgrounds={() => { setShowOther(false); setShowBackgrounds(true); }}/>}
        {showRules && <RulesComponent onClose={() => setShowRules(false)} />}
        {showBackgrounds && <BackgroundSelectionComponent onClose={() => { setShowBackgrounds(false); setShowOther(true); }} currentTheme={backgroundTheme} onSelectTheme={handleSelectTheme} />}


        {gameState === GameState.GameOver && (
          <Overlay>
              <h2 className="text-3xl font-bold text-red-500 mb-2">{getGameOverMessage(score, gameOverReason)}</h2>
              <p className="text-2xl text-gray-700 mb-2">Final Score: {score}</p>
              <p className="text-xl text-gray-600 mb-6">Height reached: {Math.round(maxHeightReached)}%</p>
              <div className="flex flex-col space-y-4 w-full">
                <button
                    onClick={resetGame}
                    disabled={!canRestart}
                    className={`px-8 py-3 bg-teal-500 text-white font-bold rounded-lg shadow-md hover:bg-teal-600 transition-colors ${!canRestart && 'opacity-50 cursor-not-allowed'}`}
                >
                    Press to play again
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
            <Player y={gameState === GameState.GameOver ? C.PLAYER_GROUND_Y : playerPositionY} />
            {obstacles.map(o => (
              <ObstacleComponent key={o.id} obstacle={o} />
            ))}
          </>
        )}
         {(gameState === GameState.PreGame || gameState === GameState.GameOver || (gameState === GameState.Playing && !gameStarted)) && (
            <div className="absolute bottom-0 left-0 w-full bg-green-300" style={{height: C.GROUND_PLATFORM_HEIGHT, zIndex: 4}}></div>
         )}
      </div>
    </div>
  );
};

export default App;
