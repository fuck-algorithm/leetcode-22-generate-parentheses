import { useState, useCallback } from 'react';
import { GenerationStep, TreeNode } from '../types';
import { generateParentheses } from '../utils/algorithm';
import { buildTreeFromSteps } from '../utils/treeBuilder';
import { validateN } from '../utils/validation';

export interface AlgorithmState {
  n: number;
  steps: GenerationStep[];
  results: string[];
  treeData: TreeNode | null;
  isInitialized: boolean;
  error: string | null;
}

const initialState: AlgorithmState = {
  n: 3,
  steps: [],
  results: [],
  treeData: null,
  isInitialized: false,
  error: null
};

export function useAlgorithm() {
  const [state, setState] = useState<AlgorithmState>(initialState);

  const initialize = useCallback((n: number) => {
    const validation = validateN(n);
    
    if (!validation.isValid) {
      setState(prev => ({
        ...prev,
        error: validation.error || '无效输入'
      }));
      return false;
    }

    const { steps, results } = generateParentheses(n);
    const treeData = buildTreeFromSteps(steps, n);

    setState({
      n,
      steps,
      results,
      treeData,
      isInitialized: true,
      error: null
    });

    return true;
  }, []);

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  const getStepAt = useCallback((index: number): GenerationStep | null => {
    if (index < 0 || index >= state.steps.length) {
      return null;
    }
    return state.steps[index];
  }, [state.steps]);

  const getResultsUpToStep = useCallback((stepIndex: number): string[] => {
    const results: string[] = [];
    for (let i = 0; i <= stepIndex && i < state.steps.length; i++) {
      const step = state.steps[i];
      if (step.action === 'complete') {
        results.push(step.currentString);
      }
    }
    return results;
  }, [state.steps]);

  return {
    ...state,
    initialize,
    reset,
    getStepAt,
    getResultsUpToStep,
    totalSteps: state.steps.length
  };
}

/**
 * Creates an initial algorithm state for testing purposes.
 */
export function createInitialState(n: number): AlgorithmState {
  const validation = validateN(n);
  
  if (!validation.isValid) {
    return {
      ...initialState,
      error: validation.error || '无效输入'
    };
  }

  const { steps, results } = generateParentheses(n);
  const treeData = buildTreeFromSteps(steps, n);

  return {
    n,
    steps,
    results,
    treeData,
    isInitialized: true,
    error: null
  };
}

/**
 * Resets algorithm state to initial values.
 */
export function resetAlgorithmState(): AlgorithmState {
  return { ...initialState };
}
