'use client';

import { useReducer, useCallback, useEffect, useState } from 'react';
import ReactConfetti from 'react-confetti';
import useSound from 'use-sound';
import { generateRandomCircle, calculateScore } from '@/lib/game-logic';
import { DIFFICULTY_SETTINGS } from '@/lib/constants';
import type { Circle, Difficulty, GameState, Coordinates, WorldBounds } from '@/lib/types';
import Scoreboard from './Scoreboard';
import Controls from './Controls';
import CartesianPlane from './CartesianPlane';
import { useToast } from '@/hooks/use-toast';
import { useWindowSize } from '@/hooks/use-window-size';
import { Card } from '@/components/ui/card';


type GameStateShape = {
  difficulty: Difficulty;
  gameState: GameState;
  circle: Circle | null;
  guess: { center: Coordinates; radius: number } | null;
  guessInput: { h: string, k: string, r: string };
  score: number;
  totalScore: number;
  round: number;
  worldBounds: WorldBounds;
};

type Action =
  | { type: 'SET_DIFFICULTY'; payload: Difficulty }
  | { type: 'SET_GUESS_H'; payload: string }
  | { type: 'SET_GUESS_K'; payload: string }
  | { type: 'SET_GUESS_R'; payload: string }
  | { type: 'CHECK_GUESS' }
  | { type: 'NEXT_ROUND' }
  | { type: 'SET_CIRCLE', payload: Circle };

const initialDifficulty: Difficulty = 'easy';
const initialWorldBounds = DIFFICULTY_SETTINGS[initialDifficulty].worldBounds;

const initialState: GameStateShape = {
  difficulty: initialDifficulty,
  gameState: 'ready',
  circle: null,
  guess: null,
  guessInput: { h: '', k: '', r: '' },
  score: 0,
  totalScore: 0,
  round: 1,
  worldBounds: initialWorldBounds,
};

function gameReducer(state: GameStateShape, action: Action): GameStateShape {
  switch (action.type) {
    case 'SET_CIRCLE': {
      const circle = action.payload;
      return { 
        ...state, 
        circle: circle,
        guessInput: {
          h: '',
          k: '',
          r: ''
        },
      };
    }
    case 'SET_DIFFICULTY': {
      const newDifficulty = action.payload;
      const newWorldBounds = DIFFICULTY_SETTINGS[newDifficulty].worldBounds;
      const newCircle = generateRandomCircle(newDifficulty);
      return {
        ...initialState,
        difficulty: newDifficulty,
        worldBounds: newWorldBounds,
        circle: newCircle,
        guessInput: {
          h: '',
          k: '',
          r: ''
        }
      };
    }
    case 'SET_GUESS_H':
      return { ...state, guessInput: { ...state.guessInput, h: action.payload } };
    case 'SET_GUESS_K':
      return { ...state, guessInput: { ...state.guessInput, k: action.payload } };
    case 'SET_GUESS_R':
      return { ...state, guessInput: { ...state.guessInput, r: action.payload } };
    case 'CHECK_GUESS': {
        if (!state.circle) return state;
        const h = parseInt(state.guessInput.h, 10);
        const k = parseInt(state.guessInput.k, 10);
        const r = parseInt(state.guessInput.r, 10);
        const guess = { center: { x: h, y: k }, radius: r };
        const score = calculateScore(state.circle, guess);

        return { 
            ...state, 
            gameState: 'result', 
            guess,
            score,
            totalScore: state.totalScore + score
        };
    }
    case 'NEXT_ROUND': {
      const newCircle = generateRandomCircle(state.difficulty);
      return {
        ...state,
        gameState: 'ready',
        circle: newCircle,
        guess: null,
        score: 0,
        round: state.round + 1,
        guessInput: {
          h: '',
          k: '',
          r: ''
        }
      };
    }
    default:
      return state;
  }
}

export default function GameUI() {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const { toast } = useToast();
  const { width, height } = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(false);

  const [playSuccess] = useSound('/sounds/success.mp3', { volume: 0.5 });
  const [playError] = useSound('/sounds/error.mp3', { volume: 0.4 });
  const [playClick] = useSound('/sounds/click.mp3', { volume: 0.5 });

  useEffect(() => {
    // Generate initial circle on client side to avoid hydration errors
    if (!state.circle) {
      dispatch({ type: 'SET_CIRCLE', payload: generateRandomCircle(state.difficulty) });
    }
  }, [state.circle, state.difficulty]);


  const handleCheck = useCallback(() => {
    const {h, k, r} = state.guessInput;
    if (h === '' || k === '' || r === '') {
        toast({
            title: "Entrada incompleta",
            description: "Por favor, introduce un valor para h, k y r.",
            variant: "destructive"
        });
        playError();
        return;
    }
     if (parseInt(r, 10) <= 0) {
        toast({
            title: "Radio inválido",
            description: "El radio debe ser un número positivo.",
            variant: "destructive"
        });
        playError();
        return;
    }

    // Temporarily calculate state to get the score for the toast.
    // We dispatch the real state change after the toast timeout.
    const tempState = gameReducer(state, { type: 'CHECK_GUESS' });
    const score = tempState.score;

    if (score === 100) {
      playSuccess();
      setShowConfetti(true);
      toast({
          title: `¡Perfecto! Ronda ${state.round} completada`,
          description: `¡Has conseguido ${score} puntos!`,
      });
    } else {
      playError();
      toast({
          title: `Ronda ${state.round} completada`,
          description: `Has conseguido ${score} puntos. ¡Sigue intentándolo!`,
          variant: "destructive"
      });
    }
    
    // Dispatch the state change to update the UI to the result view
    dispatch({ type: 'CHECK_GUESS' });

  }, [state, toast, playSuccess, playError]);

  const handleNext = () => {
    playClick();
    setShowConfetti(false);
    dispatch({ type: 'NEXT_ROUND' });
  };
  
  const handleDifficultyChange = (d: Difficulty) => {
    playClick();
    setShowConfetti(false);
    dispatch({ type: 'SET_DIFFICULTY', payload: d });
  };
  
  if (!state.circle) {
    return (
      <div className="w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2">
            <Card className="relative overflow-hidden shadow-lg aspect-[6/5] bg-card/50 backdrop-blur-sm w-full"></Card>
        </div>
        <div className="flex flex-col gap-6 lg:gap-8">
            <Card className="w-full shadow-lg bg-card/50 backdrop-blur-sm h-full flex-grow"></Card>
            <Card className="w-full shadow-lg bg-card/50 backdrop-blur-sm h-full flex-grow"></Card>
        </div>
      </div>
    );
  }

  return (
    <>
      {showConfetti && <ReactConfetti width={width} height={height} recycle={false} numberOfPieces={500} tweenDuration={5000} />}
      <div className="w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2">
            <CartesianPlane
                circle={state.circle}
                guess={state.guess}
                gameState={state.gameState}
                worldBounds={state.worldBounds}
            />
        </div>
        <div className="flex flex-col gap-6 lg:gap-8">
            <Controls
              difficulty={state.difficulty}
              guessH={state.guessInput.h}
              guessK={state.guessInput.k}
              guessR={state.guessInput.r}
              gameState={state.gameState}
              onDifficultyChange={handleDifficultyChange}
              onGuessHChange={(v) => dispatch({ type: 'SET_GUESS_H', payload: v })}
              onGuessKChange={(v) => dispatch({ type: 'SET_GUESS_K', payload: v })}
              onGuessRChange={(v) => dispatch({ type: 'SET_GUESS_R', payload: v })}
              onCheck={handleCheck}
              onNext={handleNext}
            />
            <Scoreboard score={state.score} totalScore={state.totalScore} round={state.round} />
        </div>
    </div>
    </>
  );
}
