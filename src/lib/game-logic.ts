import { DIFFICULTY_SETTINGS } from './constants';
import type { Circle, Coordinates, Difficulty } from './types';

const getRandomInt = (min: number, max: number): number => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getRandomArbitrary = (min: number, max: number): number => {
    return Math.random() * (max - min) + min;
}

export const generateRandomCircle = (difficulty: Difficulty): Circle => {
  const settings = DIFFICULTY_SETTINGS[difficulty].range;
  const h = getRandomInt(settings.h_min, settings.h_max);
  const k = getRandomInt(settings.k_min, settings.k_max);
  const r = getRandomInt(settings.r_min, settings.r_max);

  // No longer needed as the center is visible.
  const referencePoints: Coordinates[] = [];

  return { center: { x: h, y: k }, radius: r, referencePoints };
};

export const calculateScore = (
  target: Circle,
  guess: { center: Coordinates; radius: number }
): number => {
  const centerDistance = Math.sqrt(
    Math.pow(target.center.x - guess.center.x, 2) +
      Math.pow(target.center.y - guess.center.y, 2)
  );

  const radiusDifference = Math.abs(target.radius - guess.radius);

  // Perfect score is 100.
  // Lose points for distance from center and incorrect radius.
  // The scoring is weighted to prioritize getting the center correct.
  const centerScore = Math.max(0, 70 - centerDistance * 10);
  const radiusScore = Math.max(0, 30 - radiusDifference * 5);

  const totalScore = Math.round(centerScore + radiusScore);

  // Ensure a perfect guess gets exactly 100
  if (centerDistance < 0.1 && radiusDifference < 0.1) {
    return 100;
  }
  
  return totalScore;
};
