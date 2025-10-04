import React, { useState, useEffect, useCallback } from 'react';
import { TriviaSetWithQuestions, TriviaQuestionDB } from '../../../src/types';
import { useAppContext } from '../../../context/AppContext';
import Card from '../../shared/Card';
import Button from '../../shared/Button';
import SparklesIcon from '../../icons/SparklesIcon';

const QUESTIONS_PER_GAME = 5;

interface BarTriviaGameProps {
  onBack: () => void;
}

const BarTriviaGame: React.FC<BarTriviaGameProps> = ({ onBack }) => {
  const { state, awardPoints } = useAppContext();
  const { currentUser, selectedBar, triviaSets } = state;

  const [activeTrivia, setActiveTrivia] = useState<TriviaSetWithQuestions | null>(null);
  const [questions, setQuestions] = useState<TriviaQuestionDB[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<'loading' | 'playing' | 'finished' | 'no_trivia'>('loading');
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [pointsAwarded, setPointsAwarded] = useState(false);

  const loadTrivia = useCallback(() => {
    setGameState('loading');
    const availableTrivias = triviaSets.filter(t => t.is_active && t.trivia_questions.length >= QUESTIONS_PER_GAME);
    
    if (availableTrivias.length > 0) {
      // Seleciona um conjunto de trivia aleatório
      const randomSetIndex = Math.floor(Math.random() * availableTrivias.length);
      const selectedTrivia = availableTrivias[randomSetIndex];
      setActiveTrivia(selectedTrivia);
      
      // Embaralha as perguntas do conjunto selecionado
      const shuffledQuestions = [...selectedTrivia.trivia_questions].sort(() => Math.random() - 0.5);

      setQuestions(shuffledQuestions.slice(0, QUESTIONS_PER_GAME));
      setCurrentQuestionIndex(0);
      setScore(0);
      setSelectedAnswer(null);
      setIsCorrect(null);
      setPointsAwarded(false);
      setGameState('playing');
    } else {
      setGameState('no_trivia');
    }
  }, [triviaSets]);

  useEffect(() => {
    loadTrivia();
  }, [loadTrivia]);

  const handleAnswerClick = (answer: string) => {
    if (selectedAnswer) return; 

    setSelectedAnswer(answer);
    const correct = answer === questions[currentQuestionIndex].correct_answer;
    setIsCorrect(correct);

    if (correct) {
      setScore(prev => prev + 1);
    }

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
      } else {
        setGameState('finished');
      }
    }, 1500);
  };
  
   useEffect(() => {
    // Check if the game is finished, points haven't been awarded yet, and the score is positive.
    if (gameState === 'finished' && !pointsAwarded && score > 0 && activeTrivia) {
      // Set the flag to true immediately to prevent this block from running again
      // even if dependencies change (e.g., currentUser object reference after refresh).
      setPointsAwarded(true);

      const pointsPerQuestion = Math.floor(activeTrivia.points_reward / QUESTIONS_PER_GAME);
      const totalPointsEarned = score * pointsPerQuestion;
      
      if (totalPointsEarned > 0 && currentUser && selectedBar) {
        awardPoints(currentUser.id, totalPointsEarned, selectedBar.id, `Pontos da Trivia: ${activeTrivia.title}`);
      }
    }
  }, [gameState, score, pointsAwarded, awardPoints, currentUser, selectedBar, activeTrivia]);

  const getButtonClass = (option: string) => {
    if (!selectedAnswer) return 'bg-dark-bg hover:bg-brand-primary/50';
    if (option === questions[currentQuestionIndex].correct_answer) return 'bg-green-500';
    if (option === selectedAnswer) return 'bg-red-500';
    return 'bg-dark-bg opacity-50';
  };
  
  const renderContent = () => {
    if (gameState === 'loading') {
      return <div className="text-center p-10">Carregando trivia...</div>;
    }
    
    if (gameState === 'no_trivia') {
      return (
         <div className="text-center p-10">
            <h2 className="text-xl font-bold mb-4">Nenhuma trivia disponível!</h2>
            <p className="text-dark-text-secondary mb-6">Volte mais tarde para testar seus conhecimentos.</p>
            <Button onClick={onBack} variant="secondary">Voltar</Button>
         </div>
      );
    }

    if (gameState === 'finished') {
        const pointsPerQuestion = Math.floor((activeTrivia?.points_reward || 0) / QUESTIONS_PER_GAME);
        const totalPointsEarned = score * pointsPerQuestion;
      return (
        <div className="text-center p-6">
            <SparklesIcon className="w-16 h-16 text-brand-accent mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Fim de Jogo!</h2>
          <p className="text-dark-text-secondary mb-4">Você acertou {score} de {questions.length} perguntas.</p>
          {totalPointsEarned > 0 ? (
             <p className="text-3xl font-bold text-brand-accent mb-6">Parabéns! Você ganhou +{totalPointsEarned} pontos!</p>
          ) : (
             <p className="text-lg text-dark-text-secondary mb-6">Não foi dessa vez. Tente novamente para ganhar pontos!</p>
          )}
          <div className="flex gap-4 justify-center">
            <Button onClick={loadTrivia} variant="accent">Jogar Novamente</Button>
            <Button onClick={onBack} variant="secondary">Voltar</Button>
          </div>
        </div>
      );
    }

    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) {
        return <div className="text-center p-10">Não foi possível carregar as perguntas. <Button onClick={loadTrivia}>Tentar Novamente</Button></div>;
    }

    return (
      <div className="p-6">
        <p className="text-sm text-dark-text-secondary mb-2">Pergunta {currentQuestionIndex + 1} de {questions.length}</p>
        <h3 className="text-xl font-bold mb-6 min-h-[60px]">{currentQuestion.question}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(currentQuestion.options as string[]).map(option => (
            <button
              key={option}
              onClick={() => handleAnswerClick(option)}
              disabled={!!selectedAnswer}
              className={`p-4 rounded-lg text-left transition duration-300 ${getButtonClass(option)}`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    );
  };
  
  return <Card>{renderContent()}</Card>;
};

export default BarTriviaGame;