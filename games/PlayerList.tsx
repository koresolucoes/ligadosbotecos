
import React, { useState } from 'react';
import { User } from '../../../src/types';
import { useAppContext } from '../../../context/AppContext';
import { useGameContext } from '../../../context/GameContext';
import Modal from '../../shared/Modal';
import Button from '../../shared/Button';
import { toast } from 'react-hot-toast';

interface PlayerListProps {
  players: User[];
}

const PlayerList: React.FC<PlayerListProps> = ({ players }) => {
  const { state: appState } = useAppContext();
  const { sendGameInvite } = useGameContext();
  const { currentUser } = appState;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<User | null>(null);
  const [gameType, setGameType] = useState<'coin_flip' | 'checkers'>('coin_flip');
  const [wager, setWager] = useState('10');
  const [isSending, setIsSending] = useState(false);

  const handleChallengeClick = (player: User) => {
    setSelectedPlayer(player);
    setWager('10');
    setGameType('coin_flip');
    setIsModalOpen(true);
  };

  const handleSendInvite = async () => {
    if (selectedPlayer && currentUser) {
      const wagerAmount = parseInt(wager, 10);
      if (isNaN(wagerAmount) || wagerAmount < 0) {
        toast.error('Aposta inválida.');
        return;
      }
      if (currentUser.points < wagerAmount) {
        toast.error('Você não tem pontos suficientes para essa aposta.');
        return;
      }
      setIsSending(true);
      const { success, message } = await sendGameInvite(selectedPlayer.id, gameType, wagerAmount);
      if (success) {
        toast.success(`Convite enviado para ${selectedPlayer.name}!`);
        setIsModalOpen(false);
        setSelectedPlayer(null);
      } else {
        toast.error(`Falha ao enviar convite: ${message}`);
      }
      setIsSending(false);
    }
  };
  
  const ONLINE_THRESHOLD_MINUTES = 5;
  const isOnline = (user: User): boolean => {
    if (!user.last_seen) return false;
    const lastSeenDate = new Date(user.last_seen);
    const now = new Date();
    const minutesAgo = (now.getTime() - lastSeenDate.getTime()) / (1000 * 60);
    return minutesAgo < ONLINE_THRESHOLD_MINUTES;
  };

  return (
    <>
      <ul className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
        {players.map(player => {
            const playerIsOnline = isOnline(player);
            return (
                <li key={player.id} className="flex items-center p-3 rounded-lg bg-dark-bg">
                    <div className="relative mr-4 flex-shrink-0">
                        <img src={player.avatar_url || `https://picsum.photos/seed/${player.id}/100`} alt={player.name} className="w-10 h-10 rounded-full" />
                        <span 
                            className={`absolute bottom-0 right-0 block h-3 w-3 rounded-full ring-2 ring-dark-bg ${playerIsOnline ? 'bg-green-400' : 'bg-gray-500'}`} 
                            title={playerIsOnline ? 'Online' : 'Offline'}>
                        </span>
                    </div>
                    <div className="flex-grow">
                      <p className="font-semibold text-white">{player.name}</p>
                      <p className="text-sm text-dark-text-secondary">{player.points} pts</p>
                    </div>
                    <Button 
                        onClick={() => handleChallengeClick(player)} 
                        variant="secondary" 
                        className="px-4 py-2 text-sm"
                        title={`Desafiar ${player.name}`}
                    >
                      Desafiar
                    </Button>
                </li>
            );
        })}
      </ul>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Desafiar ${selectedPlayer?.name}`}>
        {selectedPlayer && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark-text-secondary">Jogo</label>
              <select
                value={gameType}
                onChange={(e) => setGameType(e.target.value as 'coin_flip' | 'checkers')}
                className="w-full mt-1 p-2 bg-gray-700 border border-gray-600 rounded-md"
              >
                <option value="coin_flip">Cara ou Coroa</option>
                <option value="checkers" disabled>Damas (em breve)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-text-secondary">Aposta (pontos)</label>
              <input
                type="number"
                value={wager}
                onChange={(e) => setWager(e.target.value)}
                className="w-full mt-1 p-2 bg-gray-700 border border-gray-600 rounded-md"
                min="0"
                step="5"
              />
            </div>
            <Button onClick={handleSendInvite} variant="accent" className="w-full" disabled={isSending}>
              {isSending ? 'Enviando...' : 'Enviar Convite'}
            </Button>
          </div>
        )}
      </Modal>
    </>
  );
};

export default PlayerList;
