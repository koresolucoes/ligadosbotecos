
import React from 'react';
import Card from '../../shared/Card';
import Button from '../../shared/Button';
import { useGameContext } from '../../../context/GameContext';
import { PuzzlePieceIcon } from '@heroicons/react/24/solid';

const CheckersGame: React.FC = () => {
    const { leaveGame } = useGameContext();
    
    return (
        <div className="fixed inset-0 bg-dark-bg z-50 flex items-center justify-center p-4">
            <Card className="text-center max-w-md w-full">
                 <PuzzlePieceIcon className="w-16 h-16 text-brand-accent mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Damas</h2>
                <p className="text-dark-text-secondary mb-6">
                    O jogo de Damas está em desenvolvimento e chegará em breve para você desafiar seus amigos!
                </p>
                <Button onClick={leaveGame} variant="primary">
                    Voltar para o Bar
                </Button>
            </Card>
        </div>
    );
};

export default CheckersGame;
