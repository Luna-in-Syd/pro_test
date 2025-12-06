import { useState, useEffect } from 'react';
import './TicTacToe.css';

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [gameStartTime, setGameStartTime] = useState(Date.now());
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const result = calculateWinner(board);
    if (result) {
      setGameOver(true);
      setWinner(result);
      
      // 启动闪烁动画
      setIsAnimating(true);
      
      // 3秒后停止动画
      setTimeout(() => {
        setIsAnimating(false);
      }, 3000);
      
      // 保存统计数据
      const stats = JSON.parse(localStorage.getItem('tictactoeStats') || '{}');
      if (!stats.player1Wins) stats.player1Wins = 0;
      if (!stats.player2Wins) stats.player2Wins = 0;
      if (!stats.totalGames) stats.totalGames = 0;
      
      stats.totalGames++;
      if (result === 'O') {
        stats.player1Wins++;
      } else if (result === 'X') {
        stats.player2Wins++;
      }
      
      localStorage.setItem('tictactoeStats', JSON.stringify(stats));
      
      // 如果有获胜者,减少需要赢的游戏数
      if (result !== 'Draw') {
        const currentScore = parseInt(localStorage.getItem('gamesScore') || '0');
        localStorage.setItem('gamesScore', Math.max(0, currentScore - 1).toString());
      }
      
      // 保存游戏次数和时间
      updateGameStats('tictactoe', Date.now() - gameStartTime);
    } else if (board.every(cell => cell !== null)) {
      // 平局
      setGameOver(true);
      setWinner('Draw');
      
      // 启动闪烁动画
      setIsAnimating(true);
      
      // 3秒后停止动画
      setTimeout(() => {
        setIsAnimating(false);
      }, 3000);
      
      const stats = JSON.parse(localStorage.getItem('tictactoeStats') || '{}');
      if (!stats.totalGames) stats.totalGames = 0;
      stats.totalGames++;
      localStorage.setItem('tictactoeStats', JSON.stringify(stats));
      
      updateGameStats('tictactoe', Date.now() - gameStartTime);
    }
  }, [board, gameStartTime]);

  const updateGameStats = (gameName, timeSpent) => {
    const allStats = JSON.parse(localStorage.getItem('allGameStats') || '{}');
    if (!allStats[gameName]) {
      allStats[gameName] = { timesPlayed: 0, totalTime: 0 };
    }
    allStats[gameName].timesPlayed++;
    allStats[gameName].totalTime += timeSpent;
    localStorage.setItem('allGameStats', JSON.stringify(allStats));
  };

  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const handleClick = (index) => {
    if (board[index] || gameOver) return;

    const newBoard = [...board];
    newBoard[index] = isXNext ? 'O' : 'X'; // Player 1 = O, Player 2 = X
    setBoard(newBoard);
    setIsXNext(!isXNext);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setGameOver(false);
    setWinner(null);
    setIsAnimating(false);
    setGameStartTime(Date.now());
  };

  const renderSquare = (index) => {
    const isFilled = board[index] !== null;
    let bgColor = '#444'; // 默认背景色
    
    // 如果是未填充的方格，根据当前玩家设置背景色
    if (!isFilled && !gameOver) {
      bgColor = isXNext ? 'rgb(255,220,220)' : 'rgb(220,220,255)'; // Player 1: 浅粉, Player 2: 浅蓝
    }
    
    return (
      <button 
        className={`square ${isAnimating ? 'animating' : ''} ${isFilled ? 'filled' : ''}`}
        style={!isAnimating && !isFilled ? { backgroundColor: bgColor } : {}}
        onClick={() => handleClick(index)}
      >
        {board[index]}
      </button>
    );
  };

  const getStatusMessage = () => {
    if (winner === 'Draw') {
      return "It's a draw!";
    } else if (winner) {
      const playerName = winner === 'O' ? 'Player 1' : 'Player 2';
      return `Winner: ${playerName} (${winner})`;
    } else {
      const currentPlayer = isXNext ? 'Player 1 (O)' : 'Player 2 (X)';
      return `Current player: ${currentPlayer}`;
    }
  };

  return (
    <div className="tictactoe-game">
      <div className="game-container">
        <h2 className="game-title">Tic Tac Toe</h2>
        <div className="status">{getStatusMessage()}</div>
        <div className="board">
          <div className="board-row">
            {renderSquare(0)}
            {renderSquare(1)}
            {renderSquare(2)}
          </div>
          <div className="board-row">
            {renderSquare(3)}
            {renderSquare(4)}
            {renderSquare(5)}
          </div>
          <div className="board-row">
            {renderSquare(6)}
            {renderSquare(7)}
            {renderSquare(8)}
          </div>
        </div>
        <button className="reset-btn" onClick={resetGame}>
          New Game
        </button>
      </div>
    </div>
  );
};

export default TicTacToe;
