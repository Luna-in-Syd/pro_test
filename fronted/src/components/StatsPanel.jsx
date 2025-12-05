import { useState, useEffect } from 'react';
import './StatsPanel.css';

const StatsPanel = () => {
  const [guessStats, setGuessStats] = useState({});
  const [tictactoeStats, setTictactoeStats] = useState({});
  const [sealStats, setSealStats] = useState({});
  const [allGameStats, setAllGameStats] = useState({});

  useEffect(() => {
    // 加载所有统计数据
    const guess = JSON.parse(localStorage.getItem('guessStats') || '{}');
    const tictactoe = JSON.parse(localStorage.getItem('tictactoeStats') || '{}');
    const seal = JSON.parse(localStorage.getItem('sealStats') || '{}');
    const all = JSON.parse(localStorage.getItem('allGameStats') || '{}');

    setGuessStats(guess);
    setTictactoeStats(tictactoe);
    setSealStats(seal);
    setAllGameStats(all);
  }, []);

  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="stats-panel">
      <div className="stats-container">
        <h1>Game Statistics</h1>

        <div className="stats-section">
          <h2>Guess The Number</h2>
          <div className="stat-item">
            <h3>Best Scores (Time Remaining):</h3>
            <p>Easy: {guessStats.easy?.bestTime || 0} seconds</p>
            <p>Medium: {guessStats.medium?.bestTime || 0} seconds</p>
            <p>Hard: {guessStats.hard?.bestTime || 0} seconds</p>
          </div>
          <div className="stat-item">
            <h3>Win Ratios:</h3>
            <p>Easy: {guessStats.easy?.won || 0}/{guessStats.easy?.played || 0}</p>
            <p>Medium: {guessStats.medium?.won || 0}/{guessStats.medium?.played || 0}</p>
            <p>Hard: {guessStats.hard?.won || 0}/{guessStats.hard?.played || 0}</p>
          </div>
        </div>

        <div className="stats-section">
          <h2>Tic Tac Toe</h2>
          <div className="stat-item">
            <h3>Total Wins:</h3>
            <p>Player 1 has won: {tictactoeStats.player1Wins || 0}</p>
            <p>Player 2 has won: {tictactoeStats.player2Wins || 0}</p>
          </div>
          <div className="stat-item">
            <h3>Win Ratios:</h3>
            <p>Player 1 win ratio: {tictactoeStats.player1Wins || 0}/{tictactoeStats.totalGames || 0}</p>
            <p>Player 2 win ratio: {tictactoeStats.player2Wins || 0}/{tictactoeStats.totalGames || 0}</p>
          </div>
        </div>

        <div className="stats-section">
          <h2>Seal The Box</h2>
          <div className="stat-item">
            <p>Best Score: {sealStats.bestScore || 0} boxes sealed</p>
          </div>
        </div>

        <div className="stats-section">
          <h2>General Statistics</h2>
          <div className="stat-item">
            <h3>Games Played:</h3>
            <p>Guess The Number: {allGameStats.guessthenumber?.timesPlayed || 0}</p>
            <p>Tic Tac Toe: {allGameStats.tictactoe?.timesPlayed || 0}</p>
            <p>Seal The Box: {allGameStats.sealthebox?.timesPlayed || 0}</p>
          </div>
          <div className="stat-item">
            <h3>Average Time Spent:</h3>
            <p>Guess The Number: {allGameStats.guessthenumber?.timesPlayed 
              ? formatTime(allGameStats.guessthenumber.totalTime / allGameStats.guessthenumber.timesPlayed)
              : '0m 0s'}</p>
            <p>Tic Tac Toe: {allGameStats.tictactoe?.timesPlayed
              ? formatTime(allGameStats.tictactoe.totalTime / allGameStats.tictactoe.timesPlayed)
              : '0m 0s'}</p>
            <p>Seal The Box: {allGameStats.sealthebox?.timesPlayed
              ? formatTime(allGameStats.sealthebox.totalTime / allGameStats.sealthebox.timesPlayed)
              : '0m 0s'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsPanel;
