import { TreeNode, GenerationStep } from '../types';

/**
 * Builds a tree structure from generation steps.
 * 
 * @param steps - Array of generation steps from the algorithm
 * @param n - Number of parentheses pairs
 * @returns Root TreeNode of the constructed tree
 */
export function buildTreeFromSteps(steps: GenerationStep[], n: number): TreeNode {
  const nodeMap = new Map<string, TreeNode>();
  
  // Create root node
  const root: TreeNode = {
    id: 'root',
    value: '',
    path: '',
    children: [],
    status: 'exploring',
    leftRemaining: n,
    rightRemaining: n
  };
  nodeMap.set('root', root);

  for (const step of steps) {
    if (step.action === 'add_left' || step.action === 'add_right') {
      // Skip root initialization step
      if (step.parentNodeId === null && step.currentString === '') {
        nodeMap.set(step.nodeId, root);
        continue;
      }

      const parentNode = step.parentNodeId ? nodeMap.get(step.parentNodeId) : root;
      if (!parentNode) continue;

      const newNode: TreeNode = {
        id: step.nodeId,
        value: step.action === 'add_left' ? '(' : ')',
        path: step.currentString,
        children: [],
        status: 'pending',
        leftRemaining: step.leftRemaining,
        rightRemaining: step.rightRemaining
      };

      // Determine node status
      newNode.status = determineNodeStatus(newNode, n);

      parentNode.children.push(newNode);
      nodeMap.set(step.nodeId, newNode);
    } else if (step.action === 'complete') {
      const node = nodeMap.get(step.nodeId);
      if (node) {
        node.status = 'valid';
      }
    }
  }

  return root;
}

/**
 * Determines the status of a tree node based on its path.
 */
export function determineNodeStatus(node: TreeNode, n: number): TreeNode['status'] {
  const path = node.path;
  
  // Check if path is complete and valid
  if (path.length === 2 * n) {
    return isValidPath(path) ? 'valid' : 'pruned';
  }
  
  // Check if path is invalid (more right than left at any point)
  if (!isValidPrefix(path)) {
    return 'pruned';
  }
  
  return 'pending';
}

/**
 * Checks if a path is a valid complete parentheses combination.
 */
export function isValidPath(path: string): boolean {
  let balance = 0;
  for (const char of path) {
    if (char === '(') balance++;
    else if (char === ')') balance--;
    if (balance < 0) return false;
  }
  return balance === 0;
}

/**
 * Checks if a path prefix is valid (no point has more right than left brackets).
 */
export function isValidPrefix(path: string): boolean {
  let balance = 0;
  for (const char of path) {
    if (char === '(') balance++;
    else if (char === ')') balance--;
    if (balance < 0) return false;
  }
  return true;
}

/**
 * Finds a node by ID in the tree.
 * 
 * @param root - Root node of the tree
 * @param id - ID of the node to find
 * @returns The found TreeNode or null
 */
export function getNodeById(root: TreeNode, id: string): TreeNode | null {
  if (root.id === id) return root;
  
  for (const child of root.children) {
    const found = getNodeById(child, id);
    if (found) return found;
  }
  
  return null;
}

/**
 * Updates tree node statuses up to a given step index.
 * 
 * @param root - Root node of the tree
 * @param steps - All generation steps
 * @param currentStepIndex - Current step index
 */
export function updateTreeStatus(root: TreeNode, steps: GenerationStep[], currentStepIndex: number): void {
  // Reset all nodes to pending
  resetNodeStatus(root);
  
  // Process steps up to current index
  for (let i = 0; i <= currentStepIndex && i < steps.length; i++) {
    const step = steps[i];
    const node = getNodeById(root, step.nodeId);
    
    if (node) {
      if (step.action === 'complete') {
        node.status = 'valid';
      } else if (i === currentStepIndex) {
        node.status = 'exploring';
      }
    }
  }
}

function resetNodeStatus(node: TreeNode): void {
  node.status = 'pending';
  for (const child of node.children) {
    resetNodeStatus(child);
  }
}
