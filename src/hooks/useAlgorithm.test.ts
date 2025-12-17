import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { createInitialState, resetAlgorithmState } from './useAlgorithm';

describe('useAlgorithm', () => {
  /**
   * **Feature: parentheses-generator-visualization, Property 2: State Reset on New Input**
   * *For any* valid n value submission, the application state SHALL reset to initial values
   * (empty tree, empty results, step 0) before starting new generation.
   * **Validates: Requirements 1.3**
   */
  it('Property 2: should reset state to initial values on new input', () => {
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 8 }), (n) => {
        // First initialize with some value
        const initializedState = createInitialState(n);
        
        // Verify state is properly initialized
        expect(initializedState.isInitialized).toBe(true);
        expect(initializedState.n).toBe(n);
        expect(initializedState.steps.length).toBeGreaterThan(0);
        expect(initializedState.treeData).not.toBeNull();
        
        // Reset state
        const resetState = resetAlgorithmState();
        
        // Verify reset state has initial values
        expect(resetState.isInitialized).toBe(false);
        expect(resetState.steps).toEqual([]);
        expect(resetState.results).toEqual([]);
        expect(resetState.treeData).toBeNull();
        expect(resetState.error).toBeNull();
      }),
      { numRuns: 100 }
    );
  });

  it('should initialize with valid n values', () => {
    for (let n = 1; n <= 8; n++) {
      const state = createInitialState(n);
      expect(state.isInitialized).toBe(true);
      expect(state.error).toBeNull();
      expect(state.n).toBe(n);
    }
  });

  it('should reject invalid n values', () => {
    const invalidValues = [0, -1, 9, 10, 100];
    for (const n of invalidValues) {
      const state = createInitialState(n);
      expect(state.isInitialized).toBe(false);
      expect(state.error).toBeDefined();
    }
  });
});
