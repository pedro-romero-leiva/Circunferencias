'use client';

import { CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { DIFFICULTY_SETTINGS } from '@/lib/constants';
import type { Difficulty, GameState } from '@/lib/types';

type ControlsProps = {
  difficulty: Difficulty;
  guessH: string;
  guessK: string;
  guessR: string;
  gameState: GameState;
  onDifficultyChange: (difficulty: Difficulty) => void;
  onGuessHChange: (value: string) => void;
  onGuessKChange: (value: string) => void;
  onGuessRChange: (value: string) => void;
  onCheck: () => void;
  onNext: () => void;
};

export default function Controls({
  difficulty,
  guessH,
  guessK,
  guessR,
  gameState,
  onDifficultyChange,
  onGuessHChange,
  onGuessKChange,
  onGuessRChange,
  onCheck,
  onNext,
}: ControlsProps) {
  const isActionable = gameState === 'ready';

  const handleCheckClick = (e: React.FormEvent) => {
    e.preventDefault();
    if (isActionable) {
      onCheck();
    }
  }

  return (
    <Card className="w-full shadow-lg bg-card/75 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Centro de Control</CardTitle>
        <CardDescription>Observa el centro (h, k) e introduce el radio (r) del círculo.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="space-y-4">
          <Label className="font-semibold text-foreground">Dificultad</Label>
          <RadioGroup
            value={difficulty}
            onValueChange={(value) => onDifficultyChange(value as Difficulty)}
            className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-3"
            disabled={!isActionable}
          >
            {(Object.keys(DIFFICULTY_SETTINGS) as Difficulty[]).map((d) => (
              <div key={d}>
                <RadioGroupItem value={d} id={d} className="peer sr-only" />
                <Label
                  htmlFor={d}
                  className="flex h-16 items-center justify-center rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent/50 hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:shadow-md [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
                >
                  <span className="capitalize font-bold text-sm">{d}</span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <form onSubmit={handleCheckClick} className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="h-coord" className="font-medium">h</Label>
              <Input 
                id="h-coord"
                type="number"
                value={guessH}
                onChange={(e) => onGuessHChange(e.target.value)}
                placeholder="x"
                required
                className="text-center"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="k-coord" className="font-medium">k</Label>
              <Input
                id="k-coord"
                type="number"
                value={guessK}
                onChange={(e) => onGuessKChange(e.target.value)}
                placeholder="y"
                required
                className="text-center"
              />
            </div>
             <div className="space-y-2">
              <Label htmlFor="r-coord" className="font-medium">r</Label>
              <Input
                id="r-coord"
                type="number"
                min="1"
                value={guessR}
                onChange={(e) => onGuessRChange(e.target.value)}
                placeholder="radio"
                disabled={!isActionable}
                required
                className="text-center"
              />
            </div>
          </div>
        
          {gameState === 'ready' && (
              <Button type="submit" className="w-full font-bold" disabled={!isActionable} size="lg">
                  <CheckCircle />
                  Comprobar
              </Button>
          )}
        </form>
        
        {gameState === 'result' && (
            <Button onClick={onNext} className="w-full font-bold" size="lg">
                Siguiente Círculo
                <ArrowRight />
            </Button>
        )}

      </CardContent>
    </Card>
  );
}
