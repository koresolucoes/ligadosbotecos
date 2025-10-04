import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../../context/AppContext';
import Button from '../../shared/Button';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { toast } from 'react-hot-toast';

const PLAYER = 'X';
const AI = 'O';

// Helper function to calculate the winner
const calculateWinner = (squares: (string | null)[]) => {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6]             // diagonals
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: lines[i] };
    }
  }
  if (squares.every(square => square)) {
    return { winner: 'T', line: null }; // T for Tie
  }
  return null;
};

const TicTacToeGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { state, awardPoints } = useAppContext();
  const { currentUser, selectedBar } = state;

  const [board, setBoard] = useState(Array(9).fill(null));
  const [playerIsNext, setPlayerIsNext] = useState(true);
  const [winnerInfo, setWinnerInfo] = useState<{ winner: string; line: number[] | null } | null>(null);
  const [scores, setScores] = useState({ player: 0, ai: 0 });
  const [gameEnded, setGameEnded] = useState(false);

  const resetBoard = () => {
    setBoard(Array(9).fill(null));
    setPlayerIsNext(true);
    setWinnerInfo(null);
    setGameEnded(false);
  };

  const handlePlay = (index: number) => {
    if (winnerInfo || board[index] || !playerIsNext) {
      return;
    }
    const newBoard = board.slice();
    newBoard[index] = PLAYER;
    setBoard(newBoard);
    setPlayerIsNext(false);
  };
  
  // AI Logic
  useEffect(() => {
    const winner = calculateWinner(board);
    if (winner) {
      if (!gameEnded) { // Prevent multiple score updates
        setWinnerInfo(winner);
        if (winner.winner === PLAYER) {
          setScores(s => ({ ...s, player: s.player + 1 }));
          if (currentUser && selectedBar) {
            awardPoints(currentUser.id, 15, selectedBar.id, 'Vitória no Jogo da Velha');
            toast.success('+15 pontos pela vitória!');
          }
        } else if (winner.winner === AI) {
          setScores(s => ({ ...s, ai: s.ai + 1 }));
        }
        setGameEnded(true);
      }
      return;
    }

    if (!playerIsNext && !winner) {
      const timeout = setTimeout(() => {
        const bestMove = findBestMove(board);
        if (bestMove !== -1) {
          const newBoard = board.slice();
          newBoard[bestMove] = AI;
          setBoard(newBoard);
          setPlayerIsNext(true);
        }
      }, 500); // AI "thinks" for a moment
      return () => clearTimeout(timeout);
    }
  }, [board, playerIsNext, gameEnded]);

  const findBestMove = (currentBoard: (string|null)[]) => {
    // 1. Check if AI can win
    for (let i = 0; i < 9; i++) {
        if (!currentBoard[i]) {
            const tempBoard = currentBoard.slice();
            tempBoard[i] = AI;
            if (calculateWinner(tempBoard)?.winner === AI) return i;
        }
    }
    // 2. Check if player can win and block
    for (let i = 0; i < 9; i++) {
        if (!currentBoard[i]) {
            const tempBoard = currentBoard.slice();
            tempBoard[i] = PLAYER;
            if (calculateWinner(tempBoard)?.winner === PLAYER) return i;
        }
    }
    // 3. Take center if available
    if (!currentBoard[4]) return 4;
    // 4. Take a random corner
    const corners = [0, 2, 6, 8].filter(i => !currentBoard[i]);
    if (corners.length > 0) return corners[Math.floor(Math.random() * corners.length)];
    // 5. Take any available spot
    const emptySpots = currentBoard.map((val, idx) => val === null ? idx : null).filter(val => val !== null);
    return emptySpots[Math.floor(Math.random() * emptySpots.length)];
  }

  const getStatusMessage = () => {
    if (winnerInfo) {
      if (winnerInfo.winner === 'T') return 'Empate!';
      return winnerInfo.winner === PLAYER ? 'Você Venceu!' : 'A IA Venceu!';
    }
    return playerIsNext ? 'Sua vez de jogar' : 'IA está pensando...';
  };

  return (
    <div className="flex flex-col items-center w-full p-4">
      <button onClick={onBack} className="absolute top-4 left-4 text-dark-text-secondary hover:text-white">
        <ArrowLeftIcon className="w-6 h-6" />
      </button>
      <h2 className="text-3xl font-bold text-brand-accent mb-2">Jogo da Velha</h2>
      
      <div className="flex justify-around w-full max-w-xs my-4 text-lg">
        <div className="text-center">
            <div className="font-bold text-emerald-300">Você (X)</div>
            <div className="text-2xl font-black">{scores.player}</div>
        </div>
        <div className="text-center">
            <div className="font-bold text-red-300">IA (O)</div>
            <div className="text-2xl font-black">{scores.ai}</div>
        </div>
      </div>
      
      <div className="w-full max-w-xs aspect-square tic-tac-toe-board">
        {board.map((value, index) => (
          <button
            key={index}
            onClick={() => handlePlay(index)}
            disabled={!!value || !!winnerInfo}
            className={`tic-tac-toe-cell 
              ${value === 'X' ? 'x' : ''} 
              ${value === 'O' ? 'o' : ''}
              ${winnerInfo?.line?.includes(index) ? 'winner' : ''}
            `}
            aria-label={`Posição ${index + 1}`}
          />
        ))}
      </div>

      <div className="mt-6 text-center h-16 flex flex-col justify-center">
        <p className="text-xl font-semibold min-h-[28px]">{getStatusMessage()}</p>
        {winnerInfo && (
            <Button onClick={resetBoard} variant="accent" className="mt-4 px-6 py-2">
                Jogar Novamente
            </Button>
        )}
      </div>
    </div>
  );
};

export default TicTacToeGame;
