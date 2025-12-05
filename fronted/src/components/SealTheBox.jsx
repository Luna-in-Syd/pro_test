import { useState, useEffect, useRef } from 'react';
import './SealTheBox.css';
import sealedBoxImg from '/assets/sealed.png';
import unsealedBoxImg from '/assets/unsealed.png';

const SealTheBox = () => {
  const [gameState, setGameState] = useState('initial'); // initial, playing, ended
  const [currentBelt, setCurrentBelt] = useState(1); // 0, 1, 2 for three belts
  const [boxes, setBoxes] = useState([]);
  const [sealedCount, setSealedCount] = useState(0);
  const [missedCount, setMissedCount] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [avatarPosition] = useState(100); // Fixed X position for avatar
  const gameStartTimeRef = useRef(null);
  const animationFrameRef = useRef(null);
  const lastUpdateTimeRef = useRef(Date.now());
  const nextBoxTimeRef = useRef([0, 0, 0]); // Time when next box should spawn for each belt

  const BELT_SPEED = 20; // pixels per second
  const BOX_SIZE = 100;
  const AVATAR_SIZE = 50;
  const MIN_BOX_SPACING = 100;
  const BELT_POSITIONS = [150, 350, 550]; // Y positions for three belts

  useEffect(() => {
    const stored = localStorage.getItem('sealStats');
    if (stored) {
      const stats = JSON.parse(stored);
      setBestScore(stats.bestScore || 0);
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameState === 'initial' && !['ArrowUp', 'ArrowDown'].includes(e.key)) {
        // Start game on any key press except arrow keys
        startGame();
        return;
      }

      if (gameState === 'playing') {
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          setCurrentBelt(prev => Math.max(0, prev - 1));
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          setCurrentBelt(prev => Math.min(2, prev + 1));
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

  const startGame = () => {
    setGameState('playing');
    setCurrentBelt(1);
    setSealedCount(0);
    setMissedCount(0);
    gameStartTimeRef.current = Date.now();
    lastUpdateTimeRef.current = Date.now();
    
    // Initialize with some boxes on each belt
    const initialBoxes = [];
    for (let belt = 0; belt < 3; belt++) {
      const numBoxes = Math.floor(Math.random() * 3) + 2; // 2-4 boxes per belt
      for (let i = 0; i < numBoxes; i++) {
        initialBoxes.push({
          id: `initial-${belt}-${i}`,
          belt,
          x: window.innerWidth + i * (BOX_SIZE + MIN_BOX_SPACING + Math.random() * 200),
          sealed: false,
        });
      }
    }
    setBoxes(initialBoxes);
    nextBoxTimeRef.current = [0, 0, 0];
  };

  const updateGameStats = (timeSpent) => {
    const allStats = JSON.parse(localStorage.getItem('allGameStats') || '{}');
    if (!allStats.sealthebox) {
      allStats.sealthebox = { timesPlayed: 0, totalTime: 0 };
    }
    allStats.sealthebox.timesPlayed++;
    allStats.sealthebox.totalTime += timeSpent;
    localStorage.setItem('allGameStats', JSON.stringify(allStats));
  };

  const endGame = () => {
    setGameState('ended');
    
    // Update best score
    const newBestScore = Math.max(bestScore, sealedCount);
    setBestScore(newBestScore);
    
    const stats = { bestScore: newBestScore };
    localStorage.setItem('sealStats', JSON.stringify(stats));
    
    // Update game stats
    if (gameStartTimeRef.current) {
      updateGameStats(Date.now() - gameStartTimeRef.current);
    }

    // Cancel animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };

  useEffect(() => {
    if (gameState !== 'playing') return;

    const gameLoop = () => {
      const now = Date.now();
      const deltaTime = (now - lastUpdateTimeRef.current) / 1000; // in seconds
      lastUpdateTimeRef.current = now;

      setBoxes(prevBoxes => {
        let newBoxes = [...prevBoxes];
        let newMissedCount = missedCount;

        // Update box positions
        newBoxes = newBoxes.map(box => ({
          ...box,
          x: box.x - BELT_SPEED * deltaTime,
        }));

        // Check for missed boxes (moved off screen and not sealed)
        const onScreenBoxes = newBoxes.filter(box => {
          if (box.x + BOX_SIZE < 0) {
            if (!box.sealed) {
              newMissedCount++;
            }
            return false;
          }
          return true;
        });

        // Check for sealing boxes
        onScreenBoxes.forEach(box => {
          if (!box.sealed && box.belt === currentBelt) {
            // Check collision: avatar's left edge to right edge overlaps with box
            const avatarLeft = avatarPosition;
            const avatarRight = avatarPosition + AVATAR_SIZE;
            const boxLeft = box.x;
            const boxRight = box.x + BOX_SIZE;

            // Box is considered "touched" if its right edge hasn't fully passed avatar's left edge
            if (boxRight >= avatarLeft && boxLeft <= avatarRight) {
              box.sealed = true;
              setSealedCount(prev => prev + 1);
            }
          }
        });

        // Spawn new boxes randomly
        const currentTime = now / 1000;
        for (let belt = 0; belt < 3; belt++) {
          if (currentTime >= nextBoxTimeRef.current[belt]) {
            // Check if there's enough space for a new box
            const beltBoxes = onScreenBoxes.filter(b => b.belt === belt);
            const canSpawn = beltBoxes.length === 0 || 
              beltBoxes.every(b => b.x < window.innerWidth - MIN_BOX_SPACING);

            if (canSpawn) {
              onScreenBoxes.push({
                id: `box-${now}-${belt}`,
                belt,
                x: window.innerWidth,
                sealed: false,
              });
              // Schedule next box spawn (random interval between 2-5 seconds)
              nextBoxTimeRef.current[belt] = currentTime + 2 + Math.random() * 3;
            }
          }
        }

        // Check game over condition
        if (newMissedCount >= 3) {
          endGame();
        } else if (newMissedCount !== missedCount) {
          setMissedCount(newMissedCount);
        }

        return onScreenBoxes;
      });

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameState, currentBelt, missedCount, sealedCount]);

  if (gameState === 'initial') {
    return (
      <div className="sealthebox-game">
        <div className="game-instructions">
          <h2>Seal The Box</h2>
          <p>Press any key to start!</p>
          <div className="instructions-list">
            <p>• Use Arrow Up/Down to switch belts</p>
            <p>• Touch boxes to seal them</p>
            <p>• Don't let 3 unsealed boxes escape!</p>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'ended') {
    return (
      <div className="sealthebox-game">
        <div className="game-over">
          <h2>Game Over!</h2>
          <div className="stats">
            <p className="score">Boxes Sealed: {sealedCount}</p>
            <p className="best">Best Score: {bestScore}</p>
          </div>
          <button className="play-again-btn" onClick={startGame}>
            Play Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="sealthebox-game playing">
      <div className="game-stats">
        <div>Sealed: {sealedCount}</div>
        <div>Missed: {missedCount}/3</div>
        <div>Best: {bestScore}</div>
      </div>
      
      <div className="belts-container">
        {[0, 1, 2].map(beltIndex => (
          <div key={beltIndex} className="belt-wrapper" style={{ top: `${BELT_POSITIONS[beltIndex]}px` }}>
            <div className="belt">
              <div className="belt-pattern"></div>
            </div>
            
            {/* Avatar on current belt */}
            {currentBelt === beltIndex && (
              <div 
                className="avatar" 
                style={{ 
                  left: `${avatarPosition}px`,
                }}
              >
                👤
              </div>
            )}
            
            {/* Boxes on this belt */}
            {boxes
              .filter(box => box.belt === beltIndex)
              .map(box => (
                <div
                  key={box.id}
                  className="box"
                  style={{
                    left: `${box.x}px`,
                  }}
                >
                  <img 
                    src={box.sealed ? sealedBoxImg : unsealedBoxImg} 
                    alt={box.sealed ? 'Sealed box' : 'Unsealed box'}
                  />
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SealTheBox;
