
import React from 'react';
import Modal from '../../shared/Modal';
import Button from '../../shared/Button';
import { GameInvite } from '../../../src/types';
import { PuzzlePieceIcon } from '@heroicons/react/24/solid';

interface GameInvitationModalProps {
  invite: GameInvite;
  onAccept: () => void;
  onDecline: () => void;
}

const GameInvitationModal: React.FC<GameInvitationModalProps> = ({ invite, onAccept, onDecline }) => {
  const gameName = invite.game_type === 'coin_flip' ? 'Cara ou Coroa' : 'Damas';

  return (
    <Modal isOpen={true} onClose={onDecline} title="Você foi desafiado!">
      <div className="text-center">
        <div className="flex justify-center items-center mb-4">
            <img src={invite.inviter_details?.avatar_url || ''} alt={invite.inviter_details?.name} className="w-16 h-16 rounded-full"/>
        </div>
        
        <p className="text-lg text-dark-text-secondary mb-1">
            <span className="font-bold text-white">{invite.inviter_details?.name || 'Um jogador'}</span> te desafiou para uma partida de:
        </p>

        <h2 className="text-3xl font-extrabold text-brand-accent mb-4">
          {gameName}
        </h2>
        
        {invite.wager > 0 && (
             <p className="text-md text-dark-text-secondary mb-8">
                Aposta: <span className="font-bold text-yellow-400">{invite.wager} pontos</span>
            </p>
        )}
        
        <div className="flex gap-4 justify-center">
            <Button onClick={onAccept} variant="accent" className="w-full">
                Aceitar
            </Button>
            <Button onClick={onDecline} variant="secondary" className="w-full">
                Recusar
            </Button>
        </div>
      </div>
    </Modal>
  );
};

export default GameInvitationModal;
