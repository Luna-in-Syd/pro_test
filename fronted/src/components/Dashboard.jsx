import { useState, useEffect } from 'react';
import './Dashboard.css';

const Dashboard = () => {
  const [score, setScore] = useState(null);
  const [initialScore, setInitialScore] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 从localStorage获取分数或从API获取
    const storedScore = localStorage.getItem('gamesScore');
    const storedInitial = localStorage.getItem('initialScore');
    
    if (storedScore !== null && storedInitial !== null) {
      setScore(parseInt(storedScore));
      setInitialScore(parseInt(storedInitial));
      setLoading(false);
    } else {
      // 从API获取初始分数
      fetch('https://cgi.cse.unsw.edu.au/~cs6080/raw/data/score.json')
        .then(response => response.json())
        .then(data => {
          const initialValue = data.score;
          setScore(initialValue);
          setInitialScore(initialValue);
          localStorage.setItem('gamesScore', initialValue.toString());
          localStorage.setItem('initialScore', initialValue.toString());
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching score:', error);
          // 如果API失败,使用默认值
          setScore(5);
          setInitialScore(5);
          localStorage.setItem('gamesScore', '5');
          localStorage.setItem('initialScore', '5');
          setLoading(false);
        });
    }
  }, []);

  // 监听分数变化
  useEffect(() => {
    if (score !== null) {
      if (score === 0) {
        alert('Congratulations!');
        const newScore = initialScore;
        setScore(newScore);
        localStorage.setItem('gamesScore', newScore.toString());
      } else {
        localStorage.setItem('gamesScore', score.toString());
      }
    }
  }, [score, initialScore]);

  const handleReset = () => {
    setScore(initialScore);
    localStorage.setItem('gamesScore', initialScore.toString());
  };

  if (loading) {
    return <div className="dashboard">Loading...</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-content">
        <div className="dashboard-text">Choose your option from the navbar.</div>
        <div className="dashboard-text">Games you need to win: {score}</div>
        <button className="reset-button" onClick={handleReset}>Reset</button>
      </div>
    </div>
  );
};

export default Dashboard;
