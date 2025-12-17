import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { advanceStep, resetAnimationState } from './useAnimation';
import { clampSpeed } from '../utils/validation';

describe('useAnimation', () => {
  /**
   * **Feature: parentheses-generator-visualization, Property 5: Step Advancement Consistency**
   * *For any* animation state, clicking step forward SHALL increase currentStepIndex by exactly 1
   * (unless already at the final step).
   * **Validates: Requirements 3.3**
   */
  it('Property 5: should advance step by exactly 1 unless at final step', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 1000 }),
        fc.integer({ min: 1, max: 1000 }),
        (currentIndex, totalSteps) => {
          const newIndex = advanceStep(currentIndex, totalSteps);
          
          if (currentIndex >= totalSteps - 1) {
            // At or past final step, should not advance
            expect(newIndex).toBe(currentIndex);
          } else {
            // Should advance by exactly 1
            expect(newIndex).toBe(currentIndex + 1);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: parentheses-generator-visualization, Property 6: Reset State Equivalence**
   * *For any* animation state after reset, the state SHALL be equivalent to the initial state
   * after first loading with the same n value.
   * **Validates: Requirements 3.4**
   */
  it('Property 6: should reset to initial state', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 1000 }),
        fc.integer({ min: 100, max: 2000 }),
        (totalSteps, speed) => {
          const resetState = resetAnimationState(totalSteps, speed);
          
          expect(resetState.isPlaying).toBe(false);
          expect(resetState.isPaused).toBe(false);
          expect(resetState.currentStepIndex).toBe(0);
          expect(resetState.totalSteps).toBe(totalSteps);
          expect(resetState.speed).toBe(speed);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: parentheses-generator-visualization, Property 7: Speed Bounds Enforcement**
   * *For any* speed value set by the user, the actual animation interval SHALL be clamped
   * to the range [100, 2000] milliseconds.
   * **Validates: Requirements 3.5**
   */
  it('Property 7: should clamp speed to valid range', () => {
    fc.assert(
      fc.property(fc.double({ min: -10000, max: 10000 }), (speed) => {
        const clampedSpeed = clampSpeed(speed);
        
        expect(clampedSpeed).toBeGreaterThanOrEqual(100);
        expect(clampedSpeed).toBeLessThanOrEqual(2000);
        
        if (speed >= 100 && speed <= 2000) {
          expect(clampedSpeed).toBe(speed);
        }
      }),
      { numRuns: 100 }
    );
  });
});
