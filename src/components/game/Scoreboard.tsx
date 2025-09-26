'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Sigma } from 'lucide-react';
import { useEffect, useState } from 'react';

type ScoreboardProps = {
  score: number;
  totalScore: number;
  round: number;
};

export default function Scoreboard({ score, totalScore, round }: ScoreboardProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Animate the progress bar
    const animationTimeout = setTimeout(() => setProgress(score), 100);
    return () => clearTimeout(animationTimeout);
  }, [score]);


  return (
    <Card className="w-full shadow-lg bg-card/75 backdrop-blur-sm border-2 border-primary/10">
      <CardHeader>
        <CardTitle>Marcador</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
        <div className="flex flex-col items-center justify-center gap-2 p-4 bg-muted/50 rounded-2xl">
          <p className="text-sm font-medium text-muted-foreground">Puntuación de Ronda</p>
          <div className="relative w-28 h-28">
            <svg className="w-full h-full" viewBox="0 0 36 36">
              <path
                className="text-border/50"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                className="text-primary drop-shadow-[0_0_5px_hsl(var(--primary))]"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeDasharray={`${progress}, 100`}
                strokeLinecap="round"
                style={{transition: 'stroke-dasharray 0.5s ease-in-out'}}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
               <p className="text-4xl font-bold text-foreground drop-shadow-md">{score}</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center gap-2 p-4 bg-muted/50 rounded-2xl">
          <Sigma className="w-10 h-10 text-primary drop-shadow-lg" />
          <p className="text-sm font-medium text-muted-foreground">Puntuación Total</p>
          <p className="text-4xl font-bold">{totalScore}</p>
        </div>
         <div className="flex flex-col items-center justify-center gap-2 p-4 bg-muted/50 rounded-2xl">
          <Trophy className="w-10 h-10 text-amber-400 drop-shadow-lg" />
          <p className="text-sm font-medium text-muted-foreground">Ronda</p>
          <p className="text-4xl font-bold">{round}</p>
        </div>
      </CardContent>
    </Card>
  );
}
