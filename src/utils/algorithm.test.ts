import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { generateParentheses, catalanNumber } from './algorithm';

/**
 * Helper function to check if a string is a valid parentheses combination.
 */
function isValidParentheses(s: string): boolean {
  let balance = 0;
  for (const char of s) {
    if (char === '(') balance++;
    else if (char === ')') balance--;
    if (balance < 0) return false;
  }
  return balance === 0;
}

describe('generateParentheses', () => {
  /**
   * **Feature: parentheses-generator-visualization, Property 9: Results Collection Completeness**
   * *For any* completed algorithm run with input n, the results list SHALL contain exactly
   * the Catalan number C(n) valid combinations, where C(n) = (2n)! / ((n+1)! * n!).
   * **Validates: Requirements 4.3, 4.4**
   */
  it('Property 9: should generate exactly Catalan(n) valid combinations', () => {
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 8 }), (n) => {
        const { results } = generateParentheses(n);
        const expectedCount = catalanNumber(n);
        
        // Check count matches Catalan number
        expect(results.length).toBe(expectedCount);
        
        // Check all results are valid
        for (const result of results) {
          expect(result.length).toBe(2 * n);
          expect(isValidParentheses(result)).toBe(true);
        }
        
        // Check no duplicates
        const uniqueResults = new Set(results);
        expect(uniqueResults.size).toBe(results.length);
      }),
      { numRuns: 100 }
    );
  });

  it('should generate correct results for n=1', () => {
    const { results } = generateParentheses(1);
    expect(results).toEqual(['()']);
  });

  it('should generate correct results for n=2', () => {
    const { results } = generateParentheses(2);
    expect(results.sort()).toEqual(['(())', '()()'].sort());
  });

  it('should generate correct results for n=3', () => {
    const { results } = generateParentheses(3);
    expect(results.length).toBe(5);
    expect(results.sort()).toEqual(['((()))', '(()())', '(())()', '()(())', '()()()'].sort());
  });
});

describe('catalanNumber', () => {
  it('should calculate correct Catalan numbers', () => {
    expect(catalanNumber(0)).toBe(1);
    expect(catalanNumber(1)).toBe(1);
    expect(catalanNumber(2)).toBe(2);
    expect(catalanNumber(3)).toBe(5);
    expect(catalanNumber(4)).toBe(14);
    expect(catalanNumber(5)).toBe(42);
    expect(catalanNumber(6)).toBe(132);
    expect(catalanNumber(7)).toBe(429);
    expect(catalanNumber(8)).toBe(1430);
  });
});
