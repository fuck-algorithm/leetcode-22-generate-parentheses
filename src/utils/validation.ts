import { ValidationResult } from '../types';

const MIN_N = 1;
const MAX_N = 8;

/**
 * Validates the input value n for parentheses generation.
 * Accepts integers between 1 and 8 inclusive.
 * 
 * @param n - The number of parentheses pairs to generate
 * @returns ValidationResult with isValid flag and optional error message
 */
export function validateN(n: number): ValidationResult {
  if (!Number.isInteger(n)) {
    return {
      isValid: false,
      error: `输入必须是整数，当前值: ${n}`
    };
  }

  if (n < MIN_N || n > MAX_N) {
    return {
      isValid: false,
      error: `n 必须在 ${MIN_N} 到 ${MAX_N} 之间，当前值: ${n}`
    };
  }

  return { isValid: true };
}

/**
 * Clamps a speed value to the valid range [100, 2000] milliseconds.
 * Handles special values like NaN, Infinity, and negative Infinity.
 * 
 * @param speed - The speed value in milliseconds
 * @returns The clamped speed value
 */
export function clampSpeed(speed: number): number {
  // Handle NaN and non-finite values
  if (!Number.isFinite(speed)) {
    return 500; // Default to middle value
  }
  return Math.max(100, Math.min(2000, speed));
}
