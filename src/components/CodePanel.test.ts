import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { getCodePanelValues, getVariablesFromStep } from './CodePanel';
import { generateParentheses } from '../utils/algorithm';

describe('CodePanel', () => {
  /**
   * **Feature: parentheses-generator-visualization, Property 10: Code Panel State Synchronization**
   * *For any* generation step, the highlighted code line and displayed call stack depth
   * SHALL exactly match the step's codeLine and callStackDepth values.
   * **Validates: Requirements 6.3, 6.6**
   */
  it('Property 10: should display values that exactly match step data', () => {
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 6 }), (n) => {
        const { steps } = generateParentheses(n);
        
        for (const step of steps) {
          const displayValues = getCodePanelValues(step, n);
          
          // Verify exact match for code line and call stack depth
          expect(displayValues.highlightedLine).toBe(step.codeLine);
          expect(displayValues.callStackDepth).toBe(step.callStackDepth);
          
          // Verify variables state matches step data
          expect(displayValues.variables.currentString).toBe(step.variables.current);
          expect(displayValues.variables.resultList).toEqual(step.variables.resultSnapshot);
          expect(displayValues.variables.changedVariable).toBe(step.changedVariable);
        }
      }),
      { numRuns: 100 }
    );
  });

  it('should handle null step with default values', () => {
    const n = 3;
    const displayValues = getCodePanelValues(null, n);
    expect(displayValues.highlightedLine).toBe(8);  // Default to backtrack function line
    expect(displayValues.callStackDepth).toBe(0);
    expect(displayValues.variables.currentString).toBe('');
    expect(displayValues.variables.leftCount).toBe(n);
    expect(displayValues.variables.rightCount).toBe(n);
    expect(displayValues.variables.resultList).toEqual([]);
    expect(displayValues.showVariablesPanel).toBe(true);
  });

  it('should extract all variable values from step', () => {
    const { steps } = generateParentheses(3);
    const step = steps[1]; // Get a real step with proper structure
    
    const displayValues = getCodePanelValues(step, 3);
    
    expect(displayValues.highlightedLine).toBe(step.codeLine);
    expect(displayValues.callStackDepth).toBe(step.callStackDepth);
    expect(displayValues.variables.currentString).toBe(step.variables.current);
    expect(displayValues.variables.n).toBe(step.variables.max);
    expect(displayValues.variables.resultList).toEqual(step.variables.resultSnapshot);
    expect(displayValues.showVariablesPanel).toBe(true);
  });

  /**
   * **Feature: parentheses-generator-visualization, Property 14: Variables Panel State Accuracy**
   * *For any* generation step, the variables panel SHALL display values that exactly match
   * the step's variables object (current string, open count, close count, result list).
   * **Validates: Requirements 6.4, 6.5, 8.2, 8.3, 8.4, 8.5**
   */
  it('Property 14: should display variables that exactly match step variables', () => {
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 6 }), (n) => {
        const { steps } = generateParentheses(n);
        
        for (const step of steps) {
          const variables = getVariablesFromStep(step, n);
          
          // Verify current string matches
          expect(variables.currentString).toBe(step.variables.current);
          
          // Verify result list matches
          expect(variables.resultList).toEqual(step.variables.resultSnapshot);
          
          // Verify n value matches
          expect(variables.n).toBe(step.variables.max);
          
          // Verify call stack depth matches
          expect(variables.callStackDepth).toBe(step.callStackDepth);
          
          // Verify changed variable matches
          expect(variables.changedVariable).toBe(step.changedVariable);
        }
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: parentheses-generator-visualization, Property 17: Call Stack Depth Display**
   * *For any* generation step, the displayed call stack depth indicator SHALL equal
   * the step's callStackDepth value.
   * **Validates: Requirements 8.7**
   */
  it('Property 17: should display call stack depth that matches step data', () => {
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 6 }), (n) => {
        const { steps } = generateParentheses(n);
        
        for (const step of steps) {
          const displayValues = getCodePanelValues(step, n);
          
          // Verify call stack depth exactly matches
          expect(displayValues.callStackDepth).toBe(step.callStackDepth);
          expect(displayValues.variables.callStackDepth).toBe(step.callStackDepth);
        }
      }),
      { numRuns: 100 }
    );
  });
});


describe('Code-Tree Synchronization', () => {
  /**
   * **Feature: parentheses-generator-visualization, Property 15: Code-Tree Synchronization**
   * *For any* generation step, the highlighted code line SHALL correspond to the action
   * being performed on the currently highlighted tree node.
   * **Validates: Requirements 6.7**
   */
  it('Property 15: should synchronize code line with tree node action', () => {
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 6 }), (n) => {
        const { steps } = generateParentheses(n);
        
        // Skip the first step (initialization) which has special handling
        for (let i = 1; i < steps.length; i++) {
          const step = steps[i];
          const displayValues = getCodePanelValues(step, n);
          
          // Verify code line corresponds to the action type
          switch (step.action) {
            case 'add_left':
              // Adding left bracket should highlight line 15 (current.append('('))
              expect(displayValues.highlightedLine).toBe(15);
              break;
            case 'add_right':
              // Adding right bracket should highlight line 21 (current.append(')'))
              expect(displayValues.highlightedLine).toBe(21);
              break;
            case 'complete':
              // Complete should highlight line 10 (result.add(...))
              expect(displayValues.highlightedLine).toBe(10);
              break;
            case 'backtrack':
              // Backtrack should highlight line 17 or 23 (deleteCharAt)
              expect([17, 23]).toContain(displayValues.highlightedLine);
              break;
          }
          
          // Verify the node ID is present in the step
          expect(step.nodeId).toBeDefined();
          expect(step.nodeId.startsWith('node-')).toBe(true);
        }
      }),
      { numRuns: 100 }
    );
  });
});

describe('Variable Change Highlighting', () => {
  /**
   * **Feature: parentheses-generator-visualization, Property 16: Variable Change Highlighting**
   * *For any* generation step where changedVariable is not null, the corresponding variable
   * in the variables panel SHALL have highlight styling applied.
   * **Validates: Requirements 8.6**
   */
  it('Property 16: should track changed variable for highlighting', () => {
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 6 }), (n) => {
        const { steps } = generateParentheses(n);
        
        // Skip the first step (initialization) which has changedVariable = null
        for (let i = 1; i < steps.length; i++) {
          const step = steps[i];
          const variables = getVariablesFromStep(step, n);
          
          // Verify changedVariable is properly set based on action
          if (step.action === 'add_left' || step.action === 'add_right' || step.action === 'backtrack') {
            // These actions change the current string
            expect(variables.changedVariable).toBe('current');
          } else if (step.action === 'complete') {
            // Complete action adds to result list
            expect(variables.changedVariable).toBe('result');
          }
          
          // Verify changedVariable matches step data
          expect(variables.changedVariable).toBe(step.changedVariable);
        }
      }),
      { numRuns: 100 }
    );
  });
});
