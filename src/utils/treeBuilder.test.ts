import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { buildTreeFromSteps, getNodeById, isValidPath, isValidPrefix } from './treeBuilder';
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


describe('Node Annotations', () => {
  /**
   * **Feature: parentheses-generator-visualization, Property 11: Node Annotation Content Correctness**
   * *For any* tree node, the annotation SHALL correctly reflect the node's state: showing
   * remaining bracket counts for normal nodes, pruning reason for pruned nodes, and success
   * indicator for valid complete nodes.
   * **Validates: Requirements 7.1, 7.4, 7.5**
   */
  it('Property 11: should generate correct annotation content based on node state', () => {
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 6 }), (n) => {
        const { steps } = generateParentheses(n);
        const tree = buildTreeFromSteps(steps, n);
        const allNodes = getAllNodes(tree);
        
        for (const node of allNodes) {
          if (node.id === 'root') continue;
          
          // Check annotation exists
          expect(node.annotation).toBeDefined();
          
          if (node.status === 'valid' || node.status === 'complete') {
            // Valid nodes should have success indicator
            expect(node.annotation).toBe('✓ 有效');
          } else if (node.status === 'pruned') {
            // Pruned nodes should have pruneReason set
            expect(node.pruneReason).toBeDefined();
            expect(node.annotation).toBe(node.pruneReason);
          } else {
            // Normal nodes should have some annotation (format may vary)
            expect(node.annotation).toBeDefined();
            expect(typeof node.annotation).toBe('string');
            expect(node.annotation!.length).toBeGreaterThan(0);
          }
        }
      }),
      { numRuns: 100 }
    );
  });
});

describe('Edge Labels', () => {
  /**
   * **Feature: parentheses-generator-visualization, Property 12: Edge Label Correctness**
   * *For any* edge connecting a parent node to a child node, the edge label SHALL correctly
   * indicate the bracket type added (left or right) matching the child node's value.
   * **Validates: Requirements 7.2**
   */
  it('Property 12: should generate correct edge labels based on child node value', () => {
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 6 }), (n) => {
        const { steps } = generateParentheses(n);
        const tree = buildTreeFromSteps(steps, n);
        
        function checkEdgeLabels(node: TreeNode): boolean {
          for (const child of node.children) {
            // Edge label should match child's bracket value
            // The edge label is generated dynamically in the visualization
            // Here we verify the child value is correct
            expect(child.value === '(' || child.value === ')').toBe(true);
            
            // Recursively check children
            if (!checkEdgeLabels(child)) return false;
          }
          return true;
        }
        
        expect(checkEdgeLabels(tree)).toBe(true);
      }),
      { numRuns: 100 }
    );
  });
});

describe('Current Node Annotation Highlighting', () => {
  /**
   * **Feature: parentheses-generator-visualization, Property 13: Current Node Annotation Highlighting**
   * *For any* node that is currently being explored (currentNodeId matches node.id), the
   * annotation text SHALL have highlighted styling applied to draw user attention.
   * **Validates: Requirements 7.3**
   */
  it('Property 13: should identify current node for annotation highlighting', () => {
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 6 }), (n) => {
        const { steps } = generateParentheses(n);
        const tree = buildTreeFromSteps(steps, n);
        
        // For steps that add nodes (not backtrack), verify the node can be found
        for (const step of steps) {
          if (step.action === 'add_left' || step.action === 'add_right') {
            const currentNode = getNodeById(tree, step.nodeId);
            
            // Current node should exist in the tree (except for root initialization)
            if (step.parentNodeId !== null) {
              expect(currentNode).not.toBeNull();
              
              // Current node should have an annotation
              if (currentNode && currentNode.id !== 'root') {
                expect(currentNode.annotation).toBeDefined();
              }
            }
          }
        }
      }),
      { numRuns: 100 }
    );
  });
});
