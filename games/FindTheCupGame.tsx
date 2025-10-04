import React, { useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from '../../../hooks/useLocalStorage';
import { useAppContext } from '../../../context/AppContext';
import Button from '../../shared/Button';
import BeerIcon from '../../icons/BeerIcon';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';

const CUP_COUNT = 3;
const WIN_POINTS = 25;
const MAX_PLAYS_PER_DAY = 3;

type GameState = 'intro' | 'hint' | 'shuffling' | 'playing' | 'result';
type Cup = { id: number; order: number };
type DailyPlays = { date: string; count: number };

const FindTheCupGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { state, awardPoints } = useAppContext();
  const { currentUser, selectedBar } = state;
  const [dailyPlays, setDailyPlays] = useLocalStorage<DailyPlays>(`findTheCupPlays_${currentUser?.id}`, { date: '', count: 0 });
  
  const [playsLeft, setPlaysLeft] = useState(MAX_PLAYS_PER_DAY);
  const [gameState, setGameState] = useState<GameState>('intro');
  const [cups, setCups] = useState<Cup[]>(Array.from({ length: CUP_COUNT }, (_, i) => ({ id: i, order: i })));
  const [winningCup, setWinningCup] = useState(Math.floor(Math.random() * CUP_COUNT));
  const [chosenCup, setChosenCup] = useState<number | null>(null);

  const updatePlays = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    if (dailyPlays.date === today) {
        setPlaysLeft(Math.max(0, MAX_PLAYS_PER_DAY - dailyPlays.count));
    } else {
        setDailyPlays({ date: today, count: 0 });
        setPlaysLeft(MAX_PLAYS_PER_DAY);
    }
  }, [dailyPlays, setDailyPlays]);

  useEffect(() => {
    updatePlays();
  }, [updatePlays]);

  const startGame = () => {
    if (playsLeft <= 0) return;
    setGameState('hint');
    setChosenCup(null);
    setCups(Array.from({ length: CUP_COUNT }, (_, i) => ({ id: i, order: i })));
    setWinningCup(Math.floor(Math.random() * CUP_COUNT));

    setTimeout(() => {
        setGameState('shuffling');
        let shuffleCount = 0;
        const interval = setInterval(() => {
            setCups(prevCups => {
                const newCups = [...prevCups];
                const i = Math.floor(Math.random() * CUP_COUNT);
                let j = Math.floor(Math.random() * CUP_COUNT);
                while(i === j) { j = Math.floor(Math.random() * CUP_COUNT); }
                [newCups[i].order, newCups[j].order] = [newCups[j].order, newCups[i].order];
                return newCups;
            });
            shuffleCount++;
            if (shuffleCount >= 10) {
                clearInterval(interval);
                setGameState('playing');
            }
        }, 250);
    }, 1500);
  };
  
  const handleCupClick = (cupId: number) => {
    if (gameState !== 'playing') return;
    setChosenCup(cupId);
    setGameState('result');
    
    const isWinner = cupId === winningCup;
    if (isWinner) {
        if (currentUser && selectedBar) {
          awardPoints(currentUser.id, WIN_POINTS, selectedBar.id, 'Prêmio Ache o Copo');
        }
    }
    
    const today = new Date().toISOString().split('T')[0];
    const newCount = dailyPlays.date === today ? dailyPlays.count + 1 : 1;
    setDailyPlays({ date: today, count: newCount });
    setPlaysLeft(prev => prev - 1);
  };
  
  const getGameStateMessage = () => {
    switch (gameState) {
      case 'intro':
        return `Você tem ${playsLeft} jogada(s) restante(s).`;
      case 'hint':
        return 'Olhe onde está a bola!';
      case 'shuffling':
        return 'Preste atenção...';
      case 'playing':
        return 'Onde está a bola?';
      case 'result':
        return chosenCup === winningCup ? `Você venceu! +${WIN_POINTS} pontos!` : 'Não foi dessa vez!';
      default: return '';
    }
  };

  if (playsLeft <= 0 && gameState === 'intro') {
    return (
      <div className="text-center p-4">
         <button onClick={onBack} className="absolute top-4 left-4 text-dark-text-secondary hover:text-white z-20">
            <ArrowLeftIcon className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-bold mb-4">Você já jogou todas as suas chances hoje!</h2>
        <p className="text-dark-text-secondary mb-6">Volte amanhã para mais diversão.</p>
        <Button onClick={onBack} variant="secondary">Voltar para os Jogos</Button>
      </div>
    );
  }

  return (
    <div 
        className="flex flex-col items-center w-full p-4 rounded-lg overflow-hidden" 
        style={{ background: 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(https://www.transparenttextures.com/patterns/wood-pattern.png), #4a2c2a' }}
    >
        <button onClick={onBack} className="absolute top-4 left-4 text-dark-text-secondary hover:text-white z-20">
            <ArrowLeftIcon className="w-6 h-6" />
        </button>

        <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-brand-accent">Ache o Copo</h2>
            <p className="text-lg text-dark-text-secondary min-h-[28px] transition-opacity duration-300">{getGameStateMessage()}</p>
        </div>
        
        <div className={`cup-container w-full h-48 flex justify-center items-end relative ${gameState === 'shuffling' ? 'shuffling' : ''}`}>
            {cups.map((cup) => {
                const isWinner = cup.id === winningCup;
                const isChosen = cup.id === chosenCup;

                return (
                    <div
                        key={cup.id}
                        className={`cup-wrapper w-1/3 h-full flex justify-center items-center 
                          ${gameState === 'result' && isWinner ? 'is-winner' : ''}
                          ${gameState === 'result' && !isWinner && isChosen ? 'is-loser' : ''}
                          ${gameState === 'hint' && isWinner ? 'is-hint' : ''}`
                        }
                        style={{
                            left: `${(cup.order * 33.33)}%`,
                            transform: (gameState === 'result' && isChosen) ? 'translateY(-20px)' : 'none',
                            zIndex: (gameState === 'result' && isChosen) ? 10 : 1,
                        }}
                    >
                        <button
                            onClick={() => handleCupClick(cup.id)}
                            disabled={gameState !== 'playing'}
                            className="cup-button w-28 h-36"
                            aria-label={`Copo ${cup.id + 1}`}
                        >
                            <BeerIcon />
                        </button>
                        <div className="loser-marker">❌</div>
                    </div>
                );
            })}
        </div>
        
        <div className="mt-12 h-16">
            {gameState === 'intro' && (
                <Button onClick={startGame} variant="accent" className="animate-pulse-accent px-8 py-4 text-lg">Começar!</Button>
            )}
            {gameState === 'result' && (
                <div className="flex gap-4">
                    {playsLeft > 0 ? (
                        <Button onClick={startGame} variant="accent">Jogar Novamente</Button>
                    ) : (
                        <p className="text-yellow-400 font-bold self-center">Fim das jogadas por hoje!</p>
                    )}
                    <Button onClick={onBack} variant="secondary">Voltar</Button>
                </div>
            )}
        </div>
    </div>
  );
};

export default FindTheCupGame;