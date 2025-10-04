

import React, { useState, useEffect, useMemo } from 'react';
import { useGameContext } from '../../../context/GameContext';
import { useAppContext } from '../../../context/AppContext';
import Card from '../../shared/Card';
import Button from '../../shared/Button';
import Modal from '../../shared/Modal';
import Coin from './Coin';
import { CoinflipGameWithBetsAndUsers, User } from '../../../src/types';
import { toast } from 'react-hot-toast';
import { ArrowLeftIcon, TrashIcon, UserPlusIcon } from '@heroicons/react/24/solid';

type Player = {
    id: string;
    name: string;
    avatar_url: string | null;
    choice: 'heads' | 'tails' | null;
    points_bet: number;
}

// --- LOBBY COMPONENT ---
const CoinFlipLobby: React.FC<{
    games: CoinflipGameWithBetsAndUsers[];
    onJoin: (game: CoinflipGameWithBetsAndUsers) => void;
    onCreate: () => void;
}> = ({ games, onJoin, onCreate }) => {
    return (
        <div>
            <h2 className="text-2xl font-bold mb-4 text-center">Salas de Cara ou Coroa</h2>
            <Button onClick={onCreate} variant="accent" className="w-full mb-6">
                <UserPlusIcon className="w-5 h-5 mr-2" /> Criar Nova Sala
            </Button>
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                {games.length > 0 ? games.map(game => {
                    const creator = game.users;
                    const bet = game.coinflip_bets[0];
                    return (
                        <div key={game.id} className="flex items-center p-3 rounded-lg bg-dark-bg">
                            <img src={creator?.avatar_url || ''} alt={creator?.name} className="w-10 h-10 rounded-full mr-4" />
                            <div className="flex-grow">
                                <p className="font-semibold text-white">{creator?.name}'s Game</p>
                                <p className="text-sm font-bold text-brand-accent">{bet?.points_bet} pontos</p>
                            </div>
                            <Button onClick={() => onJoin(game)} variant="secondary" className="px-4 py-2 text-sm">Entrar</Button>
                        </div>
                    );
                }) : <p className="text-center text-dark-text-secondary py-8">Nenhuma sala aberta. Crie a primeira!</p>}
            </div>
        </div>
    );
};

// --- GAME ROOM COMPONENT ---
const CoinFlipRoom: React.FC = () => {
    const { gameState, startCoinflipGame, leaveGame, deleteCoinflipGame } = useGameContext();
    const { state: appState, refreshDataForBar } = useAppContext();
    const { currentUser, selectedBar } = appState;
    const { activeCoinflipGame: game } = gameState;

    const [isFlipping, setIsFlipping] = useState(false);
    const [showResultModal, setShowResultModal] = useState(false);
    const [initialPoints, setInitialPoints] = useState<number | null>(null);

    // Salva os pontos do usuário quando ele entra na sala e não atualiza mais
    useEffect(() => {
        if (currentUser) {
            setInitialPoints(currentUser.points);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Executa apenas uma vez quando o componente é montado

    useEffect(() => {
        if (game?.status === 'finished' && !isFlipping && !showResultModal) {
            setIsFlipping(true);
            setTimeout(() => {
                setIsFlipping(false);
                setShowResultModal(true);
                if(selectedBar) refreshDataForBar(selectedBar.id);
            }, 3000);
        }
    }, [game?.status, isFlipping, showResultModal, selectedBar, refreshDataForBar]);

    const handleStart = () => {
        if(game && game.coinflip_bets.length === 2) {
            startCoinflipGame(game.id);
        } else {
            toast.error("Aguarde o segundo jogador.");
        }
    };
    
    const handleCloseModal = () => {
        setShowResultModal(false);
        leaveGame();
    }
    
    const isCreator = currentUser?.id === game?.created_by;
    const players = useMemo<Player[]>(() => {
        if (!game) return [];
        return game.coinflip_bets.map(bet => ({
            id: bet.users!.id,
            name: bet.users!.name,
            avatar_url: bet.users!.avatar_url,
            choice: bet.choice,
            points_bet: bet.points_bet,
        }))
    }, [game]);
    
    const player1 = players[0];
    const player2 = players.length > 1 ? players[1] : null;
    
    if(!game) return <p>Carregando jogo...</p>;

    const pot = players.reduce((acc, p) => acc + p.points_bet, 0);

    // Lógica de resultado baseada na comparação de pontos
    const getResultText = () => {
        if (game.status !== 'finished' || initialPoints === null || !currentUser) {
            return { title: 'Aguardando...', message: ''};
        }

        const finalPoints = currentUser.points;
        const pointDifference = finalPoints - initialPoints;

        if (pointDifference > 0) {
            return { title: 'Você Venceu!', message: `Parabéns! Você ganhou ${pointDifference} pontos.` };
        } else if (pointDifference < 0) {
            return { title: 'Você Perdeu!', message: `Você perdeu ${Math.abs(pointDifference)} pontos. Mais sorte da próxima vez.` };
        } else {
            return { title: 'Empate!', message: 'Seus pontos não mudaram. A aposta foi devolvida.' };
        }
    };
    const resultText = getResultText();

    return (
        <div className="text-center">
             <div className="flex justify-between items-center mb-4">
                <Button onClick={leaveGame} variant="secondary" className="px-3 py-2 text-sm !rounded-full"><ArrowLeftIcon className="w-5 h-5"/></Button>
                <h2 className="text-xl font-bold">Sala de {player1?.name}</h2>
                {isCreator && game.status === 'waiting' ? (
                     <Button onClick={() => deleteCoinflipGame(game.id)} variant="secondary" className="px-3 py-2 text-sm !rounded-full bg-red-900/50 hover:bg-red-500/50"><TrashIcon className="w-5 h-5"/></Button>
                ) : <div className="w-11"></div>}
            </div>

            <div className="flex flex-col md:flex-row justify-around items-center my-8 gap-8">
                <PlayerCard player={player1} />
                <span className="text-2xl font-bold text-dark-text-secondary">VS</span>
                <PlayerCard player={player2} placeholderText="Aguardando Oponente..." />
            </div>

            <div className="flex flex-col items-center justify-center space-y-4">
                <Coin isFlipping={isFlipping} result={game.coin_result} />
                <p className="text-2xl font-bold text-brand-accent">Pote: {pot} pontos</p>

                {game.status === 'waiting' && (
                    isCreator ? 
                    <Button onClick={handleStart} disabled={players.length < 2 || isFlipping}>
                        {players.length < 2 ? 'Aguardando Oponente' : 'Girar a Moeda!'}
                    </Button>
                    : <p className="text-dark-text-secondary">Aguardando {player1?.name} iniciar...</p>
                )}
            </div>
            
             <Modal isOpen={showResultModal} onClose={handleCloseModal} title={resultText.title}>
                <div className="text-center">
                    <p className="text-lg mb-2">O resultado foi <span className="font-bold text-brand-accent">{game.coin_result === 'heads' ? 'CARA' : 'COROA'}</span>.</p>
                    <p className="text-dark-text-secondary mb-6">{resultText.message}</p>
                    <Button onClick={handleCloseModal} variant="primary" className="w-full">Voltar para o Lobby</Button>
                </div>
            </Modal>
        </div>
    );
}

const PlayerCard: React.FC<{ player: Player | null, placeholderText?: string }> = ({ player, placeholderText }) => {
    if (!player) {
        return (
            <div className="flex flex-col items-center p-4 bg-dark-bg rounded-lg w-48 h-56 border-2 border-dashed border-gray-600">
                <div className="w-full flex flex-col items-center space-y-3">
                    <div className="w-16 h-16 rounded-full skeleton-loader"></div>
                    <div className="h-5 w-3/4 rounded skeleton-loader"></div>
                    <div className="h-4 w-1/2 rounded skeleton-loader"></div>
                </div>
                <p className="text-dark-text-secondary text-sm mt-4">{placeholderText}</p>
            </div>
        );
    }
    return (
        <div className="flex flex-col items-center p-4 bg-dark-bg rounded-lg w-48 h-56">
            <img src={player.avatar_url || ''} alt={player.name} className="w-16 h-16 rounded-full border-2 border-brand-primary mb-2"/>
            <p className="font-bold text-lg truncate w-full">{player.name}</p>
            <p className="text-sm text-brand-accent font-bold mb-3">{player.points_bet} Pontos</p>
            <div className="text-center">
                <p className="text-xs text-dark-text-secondary">Escolha:</p>
                <p className="font-bold text-xl">{player.choice === 'heads' ? 'CARA' : 'COROA'}</p>
            </div>
        </div>
    );
};

// --- MAIN CONTROLLER COMPONENT ---
interface CoinFlipGameProps {
  onBack: () => void;
}

const CoinFlipGame: React.FC<CoinFlipGameProps> = ({ onBack }) => {
  const { gameState, createCoinflipGame, joinCoinflipGame, enterGame, leaveGame } = useGameContext();
  const { state: appState } = useAppContext();
  const { coinflipGamesList, activeCoinflipGame } = gameState;
  const { currentUser } = appState;
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState<CoinflipGameWithBetsAndUsers | null>(null);
  const [bet, setBet] = useState(10);
  const [choice, setChoice] = useState<'heads' | 'tails'>('heads');
  
  const handleCreateGame = async () => {
      if(bet <= 0) { toast.error("A aposta deve ser maior que zero."); return; }
      await createCoinflipGame(bet, choice);
      setShowCreateModal(false);
  }

  const handleJoinGame = async () => {
      if(!showJoinModal) return;
      await joinCoinflipGame(showJoinModal, choice);
      setShowJoinModal(null);
  }
  
  if (activeCoinflipGame) {
      return <CoinFlipRoom />;
  }
  
  return (
    <div>
        <button onClick={onBack} className="absolute top-4 left-4 text-dark-text-secondary hover:text-white">
            <ArrowLeftIcon className="w-6 h-6" />
        </button>
        <CoinFlipLobby
            games={coinflipGamesList.filter(g => g.created_by !== currentUser?.id)}
            onCreate={() => { setBet(10); setChoice('heads'); setShowCreateModal(true); }}
            onJoin={(game) => { setChoice('heads'); setShowJoinModal(game); }}
        />
        
        {/* Create Game Modal */}
        <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Criar Nova Sala">
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-dark-text-secondary mb-2">Sua Aposta</label>
                    <input type="number" value={bet} onChange={e => setBet(Number(e.target.value))} min="1" className="w-full mt-1 p-2 bg-gray-700 border border-gray-600 rounded-md" />
                </div>
                <div>
                     <label className="block text-sm font-medium text-dark-text-secondary mb-2">Sua Escolha</label>
                     <div className="flex gap-4">
                        <Button onClick={() => setChoice('heads')} className={`w-full ${choice === 'heads' ? 'ring-2 ring-brand-accent' : ''}`}>Cara</Button>
                        <Button onClick={() => setChoice('tails')} className={`w-full ${choice === 'tails' ? 'ring-2 ring-brand-accent' : ''}`}>Coroa</Button>
                     </div>
                </div>
                <Button onClick={handleCreateGame} variant="accent" className="w-full">Criar e Entrar</Button>
            </div>
        </Modal>

        {/* Join Game Modal */}
        <Modal isOpen={!!showJoinModal} onClose={() => setShowJoinModal(null)} title="Entrar na Sala">
            <div className="space-y-4 text-center">
                <p>A aposta é de <span className="font-bold text-brand-accent">{showJoinModal?.coinflip_bets[0]?.points_bet}</span> pontos.</p>
                <div>
                     <label className="block text-sm font-medium text-dark-text-secondary mb-2">Sua Escolha</label>
                     <div className="flex gap-4">
                        <Button onClick={() => setChoice('heads')} className={`w-full ${choice === 'heads' ? 'ring-2 ring-brand-accent' : ''}`}>Cara</Button>
                        <Button onClick={() => setChoice('tails')} className={`w-full ${choice === 'tails' ? 'ring-2 ring-brand-accent' : ''}`}>Coroa</Button>
                     </div>
                </div>
                <Button onClick={handleJoinGame} variant="accent" className="w-full">Entrar e Apostar</Button>
            </div>
        </Modal>
    </div>
  );
};

export default CoinFlipGame;