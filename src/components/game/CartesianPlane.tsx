'use client';

import { useMemo } from 'react';
import { PLANE_SVG_SIZE } from '@/lib/constants';
import type { Circle, Coordinates, GameState, WorldBounds } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Card } from '../ui/card';
import { Star } from 'lucide-react';

type CartesianPlaneProps = {
  circle: Circle;
  guess: { center: Coordinates; radius: number } | null;
  gameState: GameState;
  worldBounds: WorldBounds;
};


export default function CartesianPlane({
  circle,
  guess,
  gameState,
  worldBounds
}: CartesianPlaneProps) {
  
  const { min_x, max_x, min_y, max_y } = worldBounds;
  const world_width = max_x - min_x;
  const world_height = max_y - min_y;

  const toSVG = (coord: Coordinates) => {
      const x = ((coord.x - min_x) / world_width) * PLANE_SVG_SIZE.width;
      const y = PLANE_SVG_SIZE.height - ((coord.y - min_y) / world_height) * PLANE_SVG_SIZE.height;
      return { x, y };
  };

  const radiusToSVG = (radius: number) => {
      return (radius / world_width) * PLANE_SVG_SIZE.width;
  }

  const origin = toSVG({x:0, y:0});

  const gridLines = useMemo(() => {
    const lines = [];
    const step = 1;
    const majorStep = 5;

    // Minor grid lines
    for (let i = Math.floor(min_x); i <= max_x; i++) {
        if (i % majorStep !== 0) {
            const { x } = toSVG({ x: i, y: 0 });
            lines.push(<line key={`v-minor-${i}`} x1={x} y1="0" x2={x} y2={PLANE_SVG_SIZE.height} className="stroke-gray-700" strokeWidth="0.25" />);
        }
    }
    for (let i = Math.floor(min_y); i <= max_y; i++) {
        if (i % majorStep !== 0) {
            const { y } = toSVG({ x: 0, y: i });
            lines.push(<line key={`h-minor-${i}`} x1="0" y1={y} x2={PLANE_SVG_SIZE.width} y2={y} className="stroke-gray-700" strokeWidth="0.25" />);
        }
    }

    // Major grid lines & labels
    for (let i = Math.ceil(min_x / majorStep) * majorStep; i <= max_x; i += majorStep) {
      if (i === 0) continue;
      const { x } = toSVG({ x: i, y: 0 });
      lines.push(<line key={`v-${i}`} x1={x} y1="0" x2={x} y2={PLANE_SVG_SIZE.height} className="stroke-gray-600" strokeWidth="0.5" />);
      lines.push(<text key={`vt-${i}`} x={x} y={origin.y + 12} textAnchor="middle" dominantBaseline="hanging" className="text-[10px] fill-gray-400">{i}</text>);
    }
    for (let i = Math.ceil(min_y / majorStep) * majorStep; i <= max_y; i += majorStep) {
      if (i === 0) continue;
      const { y } = toSVG({ x: 0, y: i });
      lines.push(<line key={`h-${i}`} x1="0" y1={y} x2={PLANE_SVG_SIZE.width} y2={y} className="stroke-gray-600" strokeWidth="0.5" />);
      lines.push(<text key={`ht-${i}`} x={origin.x - 12} y={y} textAnchor="end" dominantBaseline="middle" className="text-[10px] fill-gray-400">{i}</text>);
    }
    return lines;
  }, [min_x, max_x, min_y, max_y, origin.y, origin.x]);

  const circleCenterSvg = toSVG(circle.center);
  const circleRadiusSvg = radiusToSVG(circle.radius);

  const guessCenterSvg = guess ? toSVG(guess.center) : null;
  const guessRadiusSvg = guess ? radiusToSVG(guess.radius) : null;

  return (
    <Card className="relative overflow-hidden shadow-lg bg-card border-2 border-primary/10">
      <svg viewBox={`0 0 ${PLANE_SVG_SIZE.width} ${PLANE_SVG_SIZE.height}`} className="w-full h-auto">
        <defs>
          <filter id="text-shadow" x="-0.1" y="-0.1" width="1.2" height="1.2">
            <feFlood floodColor="hsl(var(--card))" floodOpacity="0.7" result="bg" />
            <feMerge>
              <feMergeNode in="bg" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {gridLines}
        
        {/* Axes */}
        <line x1={origin.x} y1="0" x2={origin.x} y2={PLANE_SVG_SIZE.height} className="stroke-gray-400" strokeWidth="1" />
        <line x1="0" y1={origin.y} x2={PLANE_SVG_SIZE.width} y2={origin.y} className="stroke-gray-400" strokeWidth="1" />

        {/* Axis Labels */}
        <text x={PLANE_SVG_SIZE.width - 15} y={origin.y - 10} textAnchor="middle" className="text-sm font-bold fill-gray-400">x</text>
        <text x={origin.x + 15} y={15} textAnchor="middle" className="text-sm font-bold fill-gray-400">y</text>

        {/* Target Circle */}
        <circle 
            cx={circleCenterSvg.x} 
            cy={circleCenterSvg.y} 
            r={circleRadiusSvg} 
            className="stroke-primary"
            strokeWidth="3" 
            fill="hsl(var(--primary) / 0.1)"
        />

        {/* Guessed Circle */}
        {gameState === 'result' && guessCenterSvg && guessRadiusSvg && (
            <circle
                cx={guessCenterSvg.x}
                cy={guessCenterSvg.y}
                r={guessRadiusSvg}
                className="stroke-destructive animate-shot-in"
                strokeWidth="3"
                fill="none"
            />
        )}

        {/* Target Center point and label */}
        <g>
            <foreignObject x={circleCenterSvg.x - 10} y={circleCenterSvg.y - 10} width="20" height="20">
                <Star className="w-5 h-5 text-primary fill-primary" />
            </foreignObject>
             <text
              x={circleCenterSvg.x + 15}
              y={circleCenterSvg.y + 5}
              fontSize="12"
              fontWeight="bold"
              className={cn(
                "fill-destructive transition-opacity duration-300", 
                gameState === 'result' ? 'opacity-100' : 'opacity-0'
              )}
              style={{ filter: 'url(#text-shadow)' }}
            >
              (h: {circle.center.x}, k: {circle.center.y}, r: {Math.round(circle.radius)})
            </text>
        </g>
      </svg>
    </Card>
  );
}
