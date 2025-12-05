import { useState, useEffect, useRef } from 'react';
import './GuessTheNumber.css';

const GuessTheNumber = () => {
  const [gameState, setGameState] = useState('select'); // select, playing, won, lost
  const [difficulty, setDifficulty] = useState(null);
  const [targetNumber, setTargetNumber] = useState(null);
  const [guess, setGuess] = useState('');
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [gameStartTime, setGameStartTime] = useState(null);
  const timerRef = useRef(null);

  const difficulties = {
    easy: { min: 1, max: 10, time: 20 },
    medium: { min: 1, max: 50, time: 30 },
    hard: { min: 1, max: 100, time: 60 }
  };

  const selectDifficulty = (level) => {
    const config = difficulties[level];
    const target = Math.floor(Math.random() * (config.max - config.min + 1)) + config.min;
    
    setDifficulty(level);
    setTargetNumber(target);
    setTimeRemaining(config.time);
    setGameState('playing');
    setMessage('');
    setErrorMessage('');
    setGuess('');
    setGameStartTime(Date.now());
  };

  useEffect(() => {
    if (gameState === 'playing' && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setGameState('lost');
            
            // 保存游戏统计
            const stats = JSON.parse(localStorage.getItem('guessStats') || '{}');
            stats[difficulty] = stats[difficulty] || { played: 0, won: 0, bestTime: 0 };
            stats[difficulty].played++;
            localStorage.setItem('guessStats', JSON.stringify(stats));
            
            // 保存游戏次数和时间
            updateGameStats('guessthenumber', Date.now() - gameStartTime);
            
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [gameState, difficulty, gameStartTime]);

  const updateGameStats = (gameName, timeSpent) => {
    const allStats = JSON.parse(localStorage.getItem('allGameStats') || '{}');
    if (!allStats[gameName]) {
      allStats[gameName] = { timesPlayed: 0, totalTime: 0 };
    }
    allStats[gameName].timesPlayed++;
    allStats[gameName].totalTime += timeSpent;
    localStorage.setItem('allGameStats', JSON.stringify(allStats));
  };

  const handleSubmitGuess = () => {
    const numGuess = parseInt(guess);
    const config = difficulties[difficulty];

    // 验证输入
    if (isNaN(numGuess) || numGuess < config.min || numGuess > config.max) {
      setErrorMessage(`Please enter a valid number between ${config.min} and ${config.max}`);
      return;
    }

    setErrorMessage('');

    if (numGuess === targetNumber) {
      // 赢了!
      clearInterval(timerRef.current);
      setGameState('won');
      
      // 保存统计数据
      const stats = JSON.parse(localStorage.getItem('guessStats') || '{}');
      stats[difficulty] = stats[difficulty] || { played: 0, won: 0, bestTime: 0 };
      stats[difficulty].played++;
      stats[difficulty].won++;
      if (timeRemaining > stats[difficulty].bestTime) {
        stats[difficulty].bestTime = timeRemaining;
      }
      localStorage.setItem('guessStats', JSON.stringify(stats));
      
      // 减少需要赢的游戏数
      const currentScore = parseInt(localStorage.getItem('gamesScore') || '0');
      localStorage.setItem('gamesScore', Math.max(0, currentScore - 1).toString());
      
      // 保存游戏次数和时间
      updateGameStats('guessthenumber', Date.now() - gameStartTime);
      
    } else if (numGuess < targetNumber) {
      setMessage('Too low! Try again.');
    } else {
      setMessage('Too high! Try again.');
    }

    setGuess('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && gameState === 'playing') {
      handleSubmitGuess();
    }
  };

  const resetGame = () => {
    setGameState('select');
    setDifficulty(null);
    setTargetNumber(null);
    setGuess('');
    setMessage('');
    setErrorMessage('');
    setTimeRemaining(0);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  if (gameState === 'select') {
    return (
      <div className="guess-game">
        <div className="difficulty-select">
          <h2>Select Difficulty</h2>
          <button onClick={() => selectDifficulty('easy')} className="difficulty-btn">
            Easy
          </button>
          <button onClick={() => selectDifficulty('medium')} className="difficulty-btn">
            Medium
          </button>
          <button onClick={() => selectDifficulty('hard')} className="difficulty-btn">
            Hard
          </button>
        </div>
      </div>
    );
  }

  if (gameState === 'playing') {
    const config = difficulties[difficulty];
    return (
      <div className="guess-game">
        <div className="game-content">
          <p className="game-message">
            I have selected a number between {config.min} and {config.max}. Can you guess it?
          </p>
          <input 
            type="number" 
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            onKeyPress={handleKeyPress}
            className="guess-input"
            placeholder="Enter your guess"
          />
          <button onClick={handleSubmitGuess} className="submit-btn">
            Submit Guess
          </button>
          <p className="timer">Time remaining: {timeRemaining} seconds</p>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          {message && <p className="hint-message">{message}</p>}
        </div>
      </div>
    );
  }

  if (gameState === 'won') {
    return (
      <div className="guess-game">
        <div className="game-result">
          <h2 className="win-message">Congratulations! You guessed it!</h2>
          <p>The number was {targetNumber}</p>
          <p>Time remaining: {timeRemaining} seconds</p>
          <button onClick={resetGame} className="play-again-btn">
            Play Again
          </button>
        </div>
      </div>
    );
  }

  if (gameState === 'lost') {
    return (
      <div className="guess-game">
        <div className="game-result">
          <h2 className="lose-message">Time's up!</h2>
          <p>The number was {targetNumber}</p>
          <button onClick={resetGame} className="play-again-btn">
            Play Again
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default GuessTheNumber;
