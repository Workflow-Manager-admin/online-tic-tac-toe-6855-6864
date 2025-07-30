import React, { useState, useEffect } from 'react';
import './App.css';

/**
 * PUBLIC_INTERFACE
 * Main component for the web-based Tic Tac Toe game.
 *
 * Features:
 * - Interactive 3x3 tic tac toe board
 * - Player vs player gameplay
 * - Player turn indication
 * - Game reset functionality
 * - Win/draw detection and display
 * - Simple score keeping
 * Layout:
 * - Centered board, title header, player turn above, controls & score below
 * - Modern, minimalistic, light-themed UI with provided colors
 */

// Theme colors as per spec
const COLORS = {
  primary: "#1976d2",
  secondary: "#424242",
  accent: "#f50057"
};

const emptyBoard = () => Array(9).fill(null);

const winningCombos = [
  [0,1,2],[3,4,5],[6,7,8], // rows
  [0,3,6],[1,4,7],[2,5,8], // columns
  [0,4,8],[2,4,6] // diagonals
];

function getWinner(squares) {
  for (let combo of winningCombos) {
    const [a,b,c] = combo;
    if (squares[a] && squares[a] === squares[b] && squares[b] === squares[c]) {
      return { winner: squares[a], line: combo };
    }
  }
  return null;
}

function isBoardFull(squares) {
  return squares.every(Boolean);
}

const PLAYER_X = "X";
const PLAYER_O = "O";

// Square (cell) component
function Square({ value, onClick, highlight }) {
  return (
    <button
      type="button"
      className={`ttt-square${highlight ? " highlight" : ""}`}
      onClick={onClick}
      tabIndex={0}
      aria-label={value ? `Square ${value}` : "Empty square"}>
      {value}
    </button>
  );
}

// PUBLIC_INTERFACE
function App() {
  const [board, setBoard] = useState(emptyBoard());
  const [xIsNext, setXIsNext] = useState(true);
  const [status, setStatus] = useState("playing"); // playing | draw | win
  const [winnerInfo, setWinnerInfo] = useState(null);
  const [score, setScore] = useState({ X: 0, O: 0 });

  useEffect(() => {
    const result = getWinner(board);
    if (result) {
      setStatus("win");
      setWinnerInfo(result);
      setScore(prev => ({
        ...prev,
        [result.winner]: prev[result.winner]+1
      }));
    } else if (isBoardFull(board)) {
      setStatus("draw");
    } else {
      setStatus("playing");
      setWinnerInfo(null);
    }
  // eslint-disable-next-line
  }, [board]);

  // PUBLIC_INTERFACE
  function handleSquareClick(idx) {
    if (board[idx] || status === "win" || status === "draw") return;
    const squares = [...board];
    squares[idx] = xIsNext ? PLAYER_X : PLAYER_O;
    setBoard(squares);
    setXIsNext(!xIsNext);
  }

  // PUBLIC_INTERFACE
  function resetGame() {
    setBoard(emptyBoard());
    setXIsNext((prev) => prev === true && status==="playing" ? false : true); // alternate starter if last game started X and was played
    setStatus("playing");
    setWinnerInfo(null);
  }

  // PUBLIC_INTERFACE
  function resetScores() {
    setScore({ X: 0, O: 0 });
    resetGame();
  }

  function gameStatusText() {
    if (status === "win" && winnerInfo) {
      return (
        <span style={{color: COLORS.accent}}>
          Player <b>{winnerInfo.winner}</b> wins!
        </span>
      );
    }
    if (status === "draw") {
      return <span style={{color: COLORS.secondary}}>Draw!</span>;
    }
    return (
      <span>
        Turn: <b style={{color: xIsNext ? COLORS.primary : COLORS.accent}}>
          {xIsNext ? "X" : "O"}
        </b>
      </span>
    );
  }

  // CSS inline vars for color overrides
  const colorVars = {
    '--primary': COLORS.primary,
    '--secondary': COLORS.secondary,
    '--accent': COLORS.accent
  };

  return (
    <div className="App" style={colorVars}>
      <div className="ttt-outer">
        <h1 className="ttt-title">Tic Tac Toe</h1>
        <div className="ttt-player-indicator" aria-live="polite">
          {gameStatusText()}
        </div>
        <div className="ttt-board" role="grid" aria-label="tic tac toe board">
          {board.map((val, idx) => (
            <Square
              key={idx}
              value={val}
              onClick={() => handleSquareClick(idx)}
              highlight={winnerInfo?.line?.includes(idx)}
            />
          ))}
        </div>
        <div className="ttt-controls">
          <button
            className="ttt-btn"
            style={{background: COLORS.primary}}
            onClick={resetGame}
            aria-label="Reset game">
            Reset Game
          </button>
          <button
            className="ttt-btn"
            style={{background: COLORS.secondary, color: "#fff"}}
            onClick={resetScores}
            aria-label="Reset score">
            Reset Score
          </button>
        </div>
        <div className="ttt-score-board">
          <div className="ttt-score ttt-score-x">
            X: <span>{score.X}</span>
          </div>
          <div className="ttt-score ttt-score-o">
            O: <span>{score.O}</span>
          </div>
        </div>
        <footer className="ttt-footer">Enjoy your game!</footer>
      </div>
    </div>
  );
}

export default App;
