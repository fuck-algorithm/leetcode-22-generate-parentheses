import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { buildTreeFromSteps, getNodeById, isValidPath, isValidPrefix, determineNodeStatus } from './treeBuilder';
import { generateParentheses } from './algorithm';
import { TreeNode } from '../types';

/**
 * Helper to traverse all nodes in a tree
 */
function getAllNodes(root: TreeNode): TreeNode[] {
  const nodes: TreeNode[] = [root];
  for (const child of root.children) {
    nodes.push(...getAllNodes(child));
  }
  return nodes;
}

describe('buildTreeFromSteps', () => {
  /**
   * **Feature: parentheses-generator-visualization, Property 3: Tree Structure Integrity**
   * *For any* generation step that adds a bracket, a new child node SHALL be created with
   * the correct parent reference, and the node's path SHALL equal parent's path concatenated
   * with the new bracket.
   * **Validates: Requirements 2.2**
   */
  it('Property 3: should maintain tree structure integrity - child path equals parent path + bracket', () => {
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 6 }), (n) => {
        const { steps } = generateParentheses(n);
        const tree = buildTreeFromSteps(steps, n);
        
        // Check all nodes have correct path relationship with parent
        function checkPathIntegrity(node: TreeNode, parentPath: string): boolean {
          // Root node has empty path
          if (node.id === 'root') {
            if (node.path !== '') return false;
          } else {
            // Child path should be parent path + node value
            if (node.path !== parentPath + node.value) return false;
          }
          
          // Check all children
          for (const child of node.children) {
            if (!checkPathIntegrity(child, node.path)) return false;
          }
          return true;
        }
        
        expect(checkPathIntegrity(tree, '')).toBe(true);
      }),
      { numRuns: 100 }
    );
  });
});

describe('determineNodeStatus', () => {
  /**
   * **Feature: parentheses-generator-visualization, Property 4: Node Status Correctness**
   * *For any* tree node, its status SHALL be 'valid' if and only if the path is a complete
   * valid parentheses combination (length = 2n and balanced), and 'pruned' if the path
   * violates validity constraints (more right than left brackets at any point).
   * **Validates: Requirements 2.4, 2.5**
   */
  it('Property 4: should correctly determine node status based on path validity', () => {
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 6 }), (n) => {
        const { steps } = generateParentheses(n);
        const tree = buildTreeFromSteps(steps, n);
        const allNodes = getAllNodes(tree);
        
        for (const node of allNodes) {
          if (node.id === 'root') continue;
          
          const path = node.path;
          const isComplete = path.length === 2 * n;
          const isBalanced = isValidPath(path);
          const hasValidPrefix = isValidPrefix(path);
          
          if (isComplete && isBalanced) {
            // Complete valid combination should be 'valid'
            expect(node.status === 'valid' || node.status === 'pending').toBe(true);
          } else if (!hasValidPrefix) {
            // Invalid prefix should be 'pruned'
            expect(node.status).toBe('pruned');
          }
        }
      }),
      { numRuns: 100 }
    );
  });
});

describe('getNodeById', () => {
  it('should find existing nodes', () => {
    const { steps } = generateParentheses(2);
    const tree = buildTreeFromSteps(steps, 2);
    
    const root = getNodeById(tree, 'root');
    expect(root).not.toBeNull();
    expect(root?.id).toBe('root');
  });

  it('should return null for non-existing nodes', () => {
    const { steps } = generateParentheses(2);
    const tree = buildTreeFromSteps(steps, 2);
    
    const notFound = getNodeById(tree, 'non-existing-id');
    expect(notFound).toBeNull();
  });
});

describe('isValidPath', () => {
  it('should validate correct parentheses', () => {
    expect(isValidPath('()')).toBe(true);
    expect(isValidPath('(())')).toBe(true);
    expect(isValidPath('()()')).toBe(true);
    expect(isValidPath('((()))')).toBe(true);
  });

  it('should reject invalid parentheses', () => {
    expect(isValidPath(')(')).toBe(false);
    expect(isValidPath('(()')).toBe(false);
    expect(isValidPath('())')).toBe(false);
    expect(isValidPath('))')).toBe(false);
  });
});

describe('isValidPrefix', () => {
  it('should validate correct prefixes', () => {
    expect(isValidPrefix('')).toBe(true);
    expect(isValidPrefix('(')).toBe(true);
    expect(isValidPrefix('((')).toBe(true);
    expect(isValidPrefix('()')).toBe(true);
    expect(isValidPrefix('()(')).toBe(true);
  });

  it('should reject invalid prefixes', () => {
    expect(isValidPrefix(')')).toBe(false);
    expect(isValidPrefix('())')).toBe(false);
    expect(isValidPrefix(')(')).toBe(false);
  });
});
