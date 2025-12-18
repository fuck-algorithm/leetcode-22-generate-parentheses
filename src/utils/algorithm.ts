import { GenerationStep } from '../types';

let stepCounter = 0;
let nodeCounter = 0;

/**
 * Generates all valid parentheses combinations and records each step.
 * Uses backtracking algorithm to explore all possibilities.
 * 
 * @param n - Number of parentheses pairs to generate
 * @returns Array of GenerationStep objects representing the algorithm execution
 */
export function generateParentheses(n: number): { steps: GenerationStep[]; results: string[] } {
  const steps: GenerationStep[] = [];
  const results: string[] = [];
  stepCounter = 0;
  nodeCounter = 0;

  // Create root node step (entering backtrack function)
  const rootNodeId = `node-${nodeCounter++}`;
  steps.push({
    id: `step-${stepCounter++}`,
    action: 'add_left',
    currentString: '',
    leftRemaining: n,
    rightRemaining: n,
    nodeId: rootNodeId,
    parentNodeId: null,
    isValid: true,
    codeLine: 8,  // Line: private void backtrack(...)
    callStackDepth: 0,
    variables: {
      current: '',
      open: 0,
      close: 0,
      max: n,
      resultSnapshot: []
    },
    changedVariable: null
  });

  backtrack('', 0, 0, n, steps, results, rootNodeId, 1);

  return { steps, results };
}

function backtrack(
  current: string,
  open: number,      // Used left brackets
  close: number,     // Used right brackets
  max: number,       // n value
  steps: GenerationStep[],
  results: string[],
  parentNodeId: string,
  depth: number
): void {
  const leftRemaining = max - open;
  const rightRemaining = max - close;

  // Base case: string is complete (length == max * 2)
  if (current.length === max * 2) {
    results.push(current);
    steps.push({
      id: `step-${stepCounter++}`,
      action: 'complete',
      currentString: current,
      leftRemaining: 0,
      rightRemaining: 0,
      nodeId: parentNodeId,
      parentNodeId: null,
      isValid: true,
      codeLine: 10,  // Line: result.add(current.toString());
      callStackDepth: depth,
      variables: {
        current,
        open,
        close,
        max,
        resultSnapshot: [...results]
      },
      changedVariable: 'result'
    });
    return;
  }

  // Try adding left bracket (if open < max)
  if (open < max) {
    const newNodeId = `node-${nodeCounter++}`;
    const newString = current + '(';
    const newOpen = open + 1;
    
    // Step for current.append('(')
    steps.push({
      id: `step-${stepCounter++}`,
      action: 'add_left',
      currentString: newString,
      leftRemaining: max - newOpen,
      rightRemaining: rightRemaining,
      nodeId: newNodeId,
      parentNodeId: parentNodeId,
      isValid: true,
      codeLine: 15,  // Line: current.append('(');
      callStackDepth: depth,
      variables: {
        current: newString,
        open: newOpen,
        close,
        max,
        resultSnapshot: [...results]
      },
      changedVariable: 'current'
    });

    backtrack(newString, newOpen, close, max, steps, results, newNodeId, depth + 1);

    // Backtrack step: current.deleteCharAt(...)
    steps.push({
      id: `step-${stepCounter++}`,
      action: 'backtrack',
      currentString: current,
      leftRemaining: leftRemaining,
      rightRemaining: rightRemaining,
      nodeId: parentNodeId,
      parentNodeId: null,
      isValid: true,
      codeLine: 17,  // Line: current.deleteCharAt(current.length() - 1);
      callStackDepth: depth,
      variables: {
        current,
        open,
        close,
        max,
        resultSnapshot: [...results]
      },
      changedVariable: 'current'
    });
  }

  // Try adding right bracket (if close < open)
  if (close < open) {
    const newNodeId = `node-${nodeCounter++}`;
    const newString = current + ')';
    const newClose = close + 1;
    
    // Step for current.append(')')
    steps.push({
      id: `step-${stepCounter++}`,
      action: 'add_right',
      currentString: newString,
      leftRemaining: leftRemaining,
      rightRemaining: max - newClose,
      nodeId: newNodeId,
      parentNodeId: parentNodeId,
      isValid: true,
      codeLine: 21,  // Line: current.append(')');
      callStackDepth: depth,
      variables: {
        current: newString,
        open,
        close: newClose,
        max,
        resultSnapshot: [...results]
      },
      changedVariable: 'current'
    });

    backtrack(newString, open, newClose, max, steps, results, newNodeId, depth + 1);

    // Backtrack step: current.deleteCharAt(...)
    steps.push({
      id: `step-${stepCounter++}`,
      action: 'backtrack',
      currentString: current,
      leftRemaining: leftRemaining,
      rightRemaining: rightRemaining,
      nodeId: parentNodeId,
      parentNodeId: null,
      isValid: true,
      codeLine: 23,  // Line: current.deleteCharAt(current.length() - 1);
      callStackDepth: depth,
      variables: {
        current,
        open,
        close,
        max,
        resultSnapshot: [...results]
      },
      changedVariable: 'current'
    });
  }
}

/**
 * Calculate the Catalan number C(n) = (2n)! / ((n+1)! * n!)
 * This gives the count of valid parentheses combinations for n pairs.
 */
export function catalanNumber(n: number): number {
  if (n <= 0) return 1;
  
  let result = 1;
  for (let i = 0; i < n; i++) {
    result = result * 2 * (2 * i + 1) / (i + 2);
  }
  return Math.round(result);
}
