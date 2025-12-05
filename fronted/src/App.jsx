import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import GuessTheNumber from './components/GuessTheNumber';
import TicTacToe from './components/TicTacToe';
import SealTheBox from './components/SealTheBox';
import StatsPanel from './components/StatsPanel';
import './App.css';

function Navigation() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getNavText = () => {
    if (windowWidth < 1400) {
      return {
        dashboard: 'Dash',
        guess: 'Guess',
        tic: 'Tic',
        seal: 'Seal'
      };
    }
    return {
      dashboard: 'Dashboard',
      guess: 'Guess The Number',
      tic: 'Tic Tac Toe',
      seal: 'Seal The Box'
    };
  };

  const getNavHeight = () => {
    if (windowWidth < 800) return '60px';
    if (windowWidth < 1400) return '80px';
    return '100px';
  };

  const navText = getNavText();
  const navHeight = getNavHeight();

  return (
    <nav className="navbar" style={{ height: navHeight }}>
      <div className="nav-item">
        <img 
          src="https://cdn-icons-png.flaticon.com/512/3468/3468377.png" 
          alt="Logo" 
          className="nav-logo"
        />
      </div>
      <Link to="/dashboard" className="nav-item">
        {navText.dashboard}
      </Link>
      <Link to="/game/guessthenumber" className="nav-item">
        {navText.guess}
      </Link>
      <Link to="/game/tictactoe" className="nav-item">
        {navText.tic}
      </Link>
      <Link to="/game/sealthebox" className="nav-item">
        {navText.seal}
      </Link>
    </nav>
  );
}

function StatsButton() {
  return (
    <Link to="/statspanel" className="stats-button">
      Stats
    </Link>
  );
}

function App() {
  return (
    <Router>
      <div className="app">
        <StatsButton />
        <div className="main-body">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/game/guessthenumber" element={<GuessTheNumber />} />
            <Route path="/game/tictactoe" element={<TicTacToe />} />
            <Route path="/game/sealthebox" element={<SealTheBox />} />
            <Route path="/statspanel" element={<StatsPanel />} />
          </Routes>
        </div>
        <Navigation />
      </div>
    </Router>
  );
}

export default App;
