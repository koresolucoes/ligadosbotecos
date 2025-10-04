
import React, { useState, useEffect } from 'react';
import { useLocalStorage } from '../../../hooks/useLocalStorage';
import { useAppContext } from '../../../context/AppContext';
import Card from '../../shared/Card';
import Button from '../../shared/Button';
import Modal from '../../shared/Modal';
import GiftIcon from '../../icons/GiftIcon';

interface ShotRouletteGameProps {
  onBack: () => void;
}

const prizes = [
  { id: 'try_again', text: 'Tente de Novo', points: 0, weight: 4, type: 'text' },
  { id: 'points_10', text: '+10 Pontos!', points: 10, weight: 5, type: 'points' },
  { id: 'points_20', text: '+20 Pontos!', points: 20, weight: 3, type: 'points' },
  { id: 'points_50', text: '+50 Pontos!', points: 50, weight: 1.5, type: 'points' },
  { id: 'free_shot', text: 'Shot Grátis!', points: 0, weight: 1, type: 'shot' },
];

const RouletteWheelIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.5" strokeWidth="2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2 L12 6" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18 L12 22" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2 12 L6 12" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 12 L22 12" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.93 4.93 L7.76 7.76" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.24 16.24 L19.07 19.07" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.93 19.07 L7.76 16.24" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.24 7.76 L19.07 4.93" />
      <circle cx="12" cy="12" r="4" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </svg>
  );

const ShotRouletteGame: React.FC<ShotRouletteGameProps> = ({ onBack }) => {
  const { state, awardPoints } = useAppContext();
  const { currentUser, selectedBar } = state;
  const [lastSpin, setLastSpin] = useLocalStorage(`shotRouletteLastSpin_${currentUser?.id}`, 0);

  const [canSpin, setCanSpin] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<{ text: string; type: string; points: number } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const now = new Date();
    const lastSpinDate = new Date(lastSpin);

    // Set hours to 0 to compare dates only
    now.setHours(0, 0, 0, 0);
    lastSpinDate.setHours(0, 0, 0, 0);

    if (now.getTime() > lastSpinDate.getTime()) {
      setCanSpin(true);
    } else {
      setCanSpin(false);
    }
  }, [lastSpin]);

  const selectPrize = () => {
    const totalWeight = prizes.reduce((acc, prize) => acc + prize.weight, 0);
    let random = Math.random() * totalWeight;
    for (const prize of prizes) {
      if (random < prize.weight) {
        return prize;
      }
      random -= prize.weight;
    }
    return prizes[0]; // Fallback
  };

  const handleSpin = () => {
    if (!canSpin || isSpinning) return;

    setIsSpinning(true);
    setResult(null);

    setTimeout(() => {
      const prize = selectPrize();
      setResult(prize);
      setIsSpinning(false);
      setIsModalOpen(true);
      setLastSpin(new Date().getTime());
      setCanSpin(false);

      if (prize.type === 'points' && prize.points > 0 && currentUser && selectedBar) {
        awardPoints(currentUser.id, prize.points, selectedBar.id, 'Prêmio Roleta de Shot');
      }
    }, 3000);
  };

  return (
    <>
      <Card className="text-center">
        <h2 className="text-3xl font-bold mb-2">Roleta de Shot</h2>
        <p className="text-dark-text-secondary mb-8">Gire uma vez por dia e ganhe prêmios!</p>

        <div className="flex items-center justify-center my-12">
            <RouletteWheelIcon className={`w-32 h-32 text-brand-accent ${isSpinning ? 'animate-spin' : ''}`} />
        </div>

        {canSpin ? (
            <Button onClick={handleSpin} disabled={isSpinning} variant="accent" className="w-full md:w-auto text-lg animate-pulse-accent">
                {isSpinning ? 'Girando...' : 'Girar a Roleta!'}
            </Button>
        ) : (
            <p className="text-yellow-400">Você já girou hoje. Volte amanhã para mais uma chance!</p>
        )}

        <Button onClick={onBack} variant="secondary" className="mt-6">
            Voltar
        </Button>
      </Card>
      
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Seu Prêmio!">
        {result && (
          <div className="text-center">
            <GiftIcon className="w-20 h-20 text-brand-accent mx-auto mb-4" />
            <h3 className="text-3xl font-bold mb-4">{result.text}</h3>
            {result.type === 'shot' && (
              <p className="text-dark-text-secondary">Parabéns! Mostre esta tela para o bartender para resgatar seu shot.</p>
            )}
            {result.type === 'points' && (
              <p className="text-dark-text-secondary">Os pontos já foram adicionados à sua conta.</p>
            )}
             {result.type === 'text' && (
              <p className="text-dark-text-secondary">Mais sorte da próxima vez!</p>
            )}
            <Button onClick={() => setIsModalOpen(false)} className="mt-6 w-full">
              Fechar
            </Button>
          </div>
        )}
      </Modal>
    </>
  );
};

export default ShotRouletteGame;