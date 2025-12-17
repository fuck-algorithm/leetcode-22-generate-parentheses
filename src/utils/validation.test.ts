import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { validateN, clampSpeed } from './validation';

describe('validateN', () => {
  /**
   * **Feature: parentheses-generator-visualization, Property 1: Input Validation Range**
   * *For any* integer value n, the input validator SHALL accept n if and only if 1 ≤ n ≤ 8,
   * rejecting all other values with an error state.
   * **Validates: Requirements 1.1, 1.2**
   */
  it('Property 1: should accept integers in range [1, 8] and reject all others', () => {
    fc.assert(
      fc.property(fc.integer(), (n) => {
        const result = validateN(n);
        const shouldBeValid = n >= 1 && n <= 8;
        
        expect(result.isValid).toBe(shouldBeValid);
        
        if (!shouldBeValid) {
          expect(result.error).toBeDefined();
        }
      }),
      { numRuns: 100 }
    );
  });

  it('Property 1: should reject non-integer values', () => {
    fc.assert(
      fc.property(fc.double().filter(n => !Number.isInteger(n)), (n) => {
        const result = validateN(n);
        expect(result.isValid).toBe(false);
        expect(result.error).toBeDefined();
      }),
      { numRuns: 100 }
    );
  });
});

describe('clampSpeed', () => {
  /**
   * **Feature: parentheses-generator-visualization, Property 7: Speed Bounds Enforcement**
   * *For any* speed value set by the user, the actual animation interval SHALL be clamped
   * to the range [100, 2000] milliseconds.
   * **Validates: Requirements 3.5**
   */
  it('Property 7: should clamp speed to [100, 2000] range', () => {
    fc.assert(
      fc.property(fc.double({ min: -10000, max: 10000 }), (speed) => {
        const result = clampSpeed(speed);
        expect(result).toBeGreaterThanOrEqual(100);
        expect(result).toBeLessThanOrEqual(2000);
        
        // If speed is within range, it should remain unchanged
        if (speed >= 100 && speed <= 2000) {
          expect(result).toBe(speed);
        }
      }),
      { numRuns: 100 }
    );
  });
});
