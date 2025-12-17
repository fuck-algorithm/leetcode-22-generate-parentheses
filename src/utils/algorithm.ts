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

  // Create root node step
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
    codeLine: 1,
    callStackDepth: 0
  });

  backtrack('', n, n, steps, results, rootNodeId, 1);

  return { steps, results };
}

function backtrack(
  current: string,
  leftRemaining: number,
  rightRemaining: number,
  steps: GenerationStep[],
  results: string[],
  parentNodeId: string,
  depth: number
): void {
  // Base case: all brackets used
  if (leftRemaining === 0 && rightRemaining === 0) {
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
      codeLine: 3,
      callStackDepth: depth
    });
    return;
  }

  // Try adding left bracket
  if (leftRemaining > 0) {
    const newNodeId = `node-${nodeCounter++}`;
    const newString = current + '(';
    
    steps.push({
      id: `step-${stepCounter++}`,
      action: 'add_left',
      currentString: newString,
      leftRemaining: leftRemaining - 1,
      rightRemaining: rightRemaining,
      nodeId: newNodeId,
      parentNodeId: parentNodeId,
      isValid: true,
      codeLine: 5,
      callStackDepth: depth
    });

    backtrack(newString, leftRemaining - 1, rightRemaining, steps, results, newNodeId, depth + 1);

    // Backtrack step
    steps.push({
      id: `step-${stepCounter++}`,
      action: 'backtrack',
      currentString: current,
      leftRemaining: leftRemaining,
      rightRemaining: rightRemaining,
      nodeId: parentNodeId,
      parentNodeId: null,
      isValid: true,
      codeLine: 7,
      callStackDepth: depth
    });
  }

  // Try adding right bracket (only if more left brackets have been used)
  if (rightRemaining > leftRemaining) {
    const newNodeId = `node-${nodeCounter++}`;
    const newString = current + ')';
    
    steps.push({
      id: `step-${stepCounter++}`,
      action: 'add_right',
      currentString: newString,
      leftRemaining: leftRemaining,
      rightRemaining: rightRemaining - 1,
      nodeId: newNodeId,
      parentNodeId: parentNodeId,
      isValid: true,
      codeLine: 9,
      callStackDepth: depth
    });

    backtrack(newString, leftRemaining, rightRemaining - 1, steps, results, newNodeId, depth + 1);

    // Backtrack step
    steps.push({
      id: `step-${stepCounter++}`,
      action: 'backtrack',
      currentString: current,
      leftRemaining: leftRemaining,
      rightRemaining: rightRemaining,
      nodeId: parentNodeId,
      parentNodeId: null,
      isValid: true,
      codeLine: 11,
      callStackDepth: depth
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
