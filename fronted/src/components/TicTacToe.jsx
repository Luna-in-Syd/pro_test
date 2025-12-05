import { useState, useEffect } from 'react';
import './TicTacToe.css';

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [gameStartTime, setGameStartTime] = useState(Date.now());

  useEffect(() => {
    const result = calculateWinner(board);
    if (result) {
      setGameOver(true);
      setWinner(result);
      
      // 保存统计数据
      const stats = JSON.parse(localStorage.getItem('tictactoeStats') || '{}');
      if (!stats.player1Wins) stats.player1Wins = 0;
      if (!stats.player2Wins) stats.player2Wins = 0;
      if (!stats.totalGames) stats.totalGames = 0;
      
      stats.totalGames++;
      if (result === 'X') {
        stats.player1Wins++;
      } else if (result === 'O') {
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
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setGameOver(false);
    setWinner(null);
    setGameStartTime(Date.now());
  };

  const renderSquare = (index) => {
    return (
      <button 
        className="square" 
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
      const playerName = winner === 'X' ? 'Player 1' : 'Player 2';
      return `Winner: ${playerName} (${winner})`;
    } else {
      const currentPlayer = isXNext ? 'Player 1 (X)' : 'Player 2 (O)';
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
