import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { getCodePanelValues } from './CodePanel';
import { generateParentheses } from '../utils/algorithm';

describe('CodePanel', () => {
  /**
   * **Feature: parentheses-generator-visualization, Property 10: Code Panel State Synchronization**
   * *For any* generation step, the highlighted code line and displayed call stack depth
   * SHALL exactly match the step's codeLine and callStackDepth values.
   * **Validates: Requirements 6.2, 6.3**
   */
  it('Property 10: should display values that exactly match step data', () => {
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 6 }), (n) => {
        const { steps } = generateParentheses(n);
        
        for (const step of steps) {
          const displayValues = getCodePanelValues(step);
          
          // Verify exact match
          expect(displayValues.highlightedLine).toBe(step.codeLine);
          expect(displayValues.callStackDepth).toBe(step.callStackDepth);
          // Verify new fields
          expect(displayValues.currentString).toBe(step.currentString);
          expect(displayValues.leftRemaining).toBe(step.leftRemaining);
          expect(displayValues.rightRemaining).toBe(step.rightRemaining);
          expect(displayValues.action).toBe(step.action);
        }
      }),
      { numRuns: 100 }
    );
  });

  it('should handle null step with default values', () => {
    const displayValues = getCodePanelValues(null);
    expect(displayValues.highlightedLine).toBe(1);
    expect(displayValues.callStackDepth).toBe(0);
    expect(displayValues.currentString).toBe('');
    expect(displayValues.leftRemaining).toBe(0);
    expect(displayValues.rightRemaining).toBe(0);
    expect(displayValues.action).toBe('');
  });

  it('should extract all variable values from step', () => {
    const mockStep = {
      codeLine: 5,
      callStackDepth: 2,
      currentString: '((',
      leftRemaining: 1,
      rightRemaining: 3,
      action: 'add_left'
    };
    
    const displayValues = getCodePanelValues(mockStep);
    
    expect(displayValues.highlightedLine).toBe(5);
    expect(displayValues.callStackDepth).toBe(2);
    expect(displayValues.currentString).toBe('((');
    expect(displayValues.leftRemaining).toBe(1);
    expect(displayValues.rightRemaining).toBe(3);
    expect(displayValues.action).toBe('add_left');
  });
});
