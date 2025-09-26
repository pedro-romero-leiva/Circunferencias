import type { Difficulty } from './types';

export const PLANE_SVG_SIZE = { width: 600, height: 500 };

export const DIFFICULTY_SETTINGS: Record<
  Difficulty,
  {
    range: {
      h_min: number;
      h_max: number;
      k_min: number;
      k_max: number;
      r_min: number;
      r_max: number;
    };
    worldBounds: {
      min_x: number;
      max_x: number;
      min_y: number;
      max_y: number;
    },
    description: string;
  }
> = {
  easy: {
    range: { h_min: -5, h_max: 5, k_min: -5, k_max: 5, r_min: 2, r_max: 5 },
    worldBounds: { min_x: -10, max_x: 10, min_y: -10, max_y: 10 },
    description: 'Centro cercano, radio pequeño',
  },
  medium: {
    range: { h_min: -10, h_max: 10, k_min: -10, k_max: 10, r_min: 3, r_max: 8 },
    worldBounds: { min_x: -15, max_x: 15, min_y: -15, max_y: 15 },
    description: 'Rango moderado',
  },
  hard: {
    range: { h_min: -15, h_max: 15, k_min: -15, k_max: 15, r_min: 5, r_max: 10 },
    worldBounds: { min_x: -25, max_x: 25, min_y: -25, max_y: 25 },
    description: 'Centro lejano, radio grande',
  },
};
