import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { getStatePanelValues } from './StatePanel';
import { generateParentheses } from '../utils/algorithm';

describe('StatePanel', () => {
  /**
   * **Feature: parentheses-generator-visualization, Property 8: Step State Display Synchronization**
   * *For any* generation step, the displayed current string, left bracket count, and right bracket count
   * SHALL exactly match the corresponding values in the step data.
   * **Validates: Requirements 4.1, 4.2**
   */
  it('Property 8: should display values that exactly match step data', () => {
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 6 }), (n) => {
        const { steps } = generateParentheses(n);
        
        for (const step of steps) {
          const displayValues = getStatePanelValues(step);
          
          // Verify exact match
          expect(displayValues.currentPath).toBe(step.currentString);
          expect(displayValues.leftCount).toBe(step.leftRemaining);
          expect(displayValues.rightCount).toBe(step.rightRemaining);
        }
      }),
      { numRuns: 100 }
    );
  });

  it('should handle null step', () => {
    const displayValues = getStatePanelValues(null);
    expect(displayValues.currentPath).toBe('');
    expect(displayValues.leftCount).toBe(0);
    expect(displayValues.rightCount).toBe(0);
  });
});
