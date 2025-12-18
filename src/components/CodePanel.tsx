import { useState, useEffect } from 'react';
import { VariablesState, ChangedVariable, GenerationStep } from '../types';

export interface CodePanelProps {
  highlightedLine: number;
  callStackDepth: number;
  variables: VariablesState;
  showVariablesPanel: boolean;
}

// Complete Java Solution code matching the design document
const JAVA_CODE = [
  'class Solution {',                                                    // 1
  '    public List<String> generateParenthesis(int n) {',               // 2
  '        List<String> result = new ArrayList<>();',                   // 3
  '        backtrack(result, new StringBuilder(), 0, 0, n);',           // 4
  '        return result;',                                              // 5
  '    }',                                                               // 6
  '',                                                                    // 7
  '    private void backtrack(List<String> result, StringBuilder current,', // 8
  '                          int open, int close, int max) {',          // 9
  '        if (current.length() == max * 2) {',                         // 10
  '            result.add(current.toString());',                        // 11
  '            return;',                                                 // 12
  '        }',                                                           // 13
  '',                                                                    // 14
  '        if (open < max) {',                                          // 15
  '            current.append(\'(\');',                                 // 16
  '            backtrack(result, current, open + 1, close, max);',      // 17
  '            current.deleteCharAt(current.length() - 1);',            // 18
  '        }',                                                           // 19
  '',                                                                    // 20
  '        if (close < open) {',                                        // 21
  '            current.append(\')\');',                                 // 22
  '            backtrack(result, current, open, close + 1, max);',      // 23
  '            current.deleteCharAt(current.length() - 1);',            // 24
  '        }',                                                           // 25
  '    }',                                                               // 26
  '}',                                                                   // 27
];

// 定义哪些行需要显示哪些变量
const LINE_VARIABLES: Record<number, string[]> = {
  9: ['open', 'close', 'max'],
  10: ['current.length()', 'max * 2'],
  11: ['current', 'result.size()'],
  15: ['open', 'max'],
  16: ['current'],
  17: ['open + 1', 'close'],
  18: ['current'],
  21: ['close', 'open'],
  22: ['current'],
  23: ['open', 'close + 1'],
  24: ['current'],
};

// Syntax highlighting for Java code
function highlightSyntax(line: string): JSX.Element[] {
  const keywords = ['class', 'public', 'private', 'void', 'int', 'if', 'return', 'new'];
  const types = ['List', 'String', 'ArrayList', 'StringBuilder'];
  
  const parts: JSX.Element[] = [];
  let remaining = line;
  let key = 0;
  
  while (remaining.length > 0) {
    let matched = false;
    
    // Check for string literals
    const stringMatch = remaining.match(/^('[^']*'|"[^"]*")/);
    if (stringMatch) {
      parts.push(<span key={key++} style={{ color: '#ce9178' }}>{stringMatch[0]}</span>);
      remaining = remaining.slice(stringMatch[0].length);
      matched = true;
      continue;
    }
    
    // Check for comments
    if (remaining.startsWith('//')) {
      parts.push(<span key={key++} style={{ color: '#6a9955' }}>{remaining}</span>);
      break;
    }
    
    // Check for keywords
    for (const kw of keywords) {
      const regex = new RegExp(`^\\b${kw}\\b`);
      if (regex.test(remaining)) {
        parts.push(<span key={key++} style={{ color: '#569cd6' }}>{kw}</span>);
        remaining = remaining.slice(kw.length);
        matched = true;
        break;
      }
    }
    if (matched) continue;
    
    // Check for types
    for (const type of types) {
      const regex = new RegExp(`^\\b${type}\\b`);
      if (regex.test(remaining)) {
        parts.push(<span key={key++} style={{ color: '#4ec9b0' }}>{type}</span>);
        remaining = remaining.slice(type.length);
        matched = true;
        break;
      }
    }
    if (matched) continue;
    
    // Check for numbers
    const numMatch = remaining.match(/^\d+/);
    if (numMatch) {
      parts.push(<span key={key++} style={{ color: '#b5cea8' }}>{numMatch[0]}</span>);
      remaining = remaining.slice(numMatch[0].length);
      continue;
    }
    
    // Check for method calls
    const methodMatch = remaining.match(/^(\w+)(?=\()/);
    if (methodMatch) {
      parts.push(<span key={key++} style={{ color: '#dcdcaa' }}>{methodMatch[0]}</span>);
      remaining = remaining.slice(methodMatch[0].length);
      continue;
    }
    
    // Default: add single character
    parts.push(<span key={key++}>{remaining[0]}</span>);
    remaining = remaining.slice(1);
  }
  
  return parts;
}

// 获取变量的实际值
function getVariableValue(varName: string, variables: VariablesState): string {
  const open = variables.n - variables.leftCount;
  const close = variables.n - variables.rightCount;
  
  switch (varName) {
    case 'open': return String(open);
    case 'close': return String(close);
    case 'max': return String(variables.n);
    case 'current': return `"${variables.currentString}"`;
    case 'current.length()': return String(variables.currentString.length);
    case 'max * 2': return String(variables.n * 2);
    case 'open + 1': return String(open + 1);
    case 'close + 1': return String(close + 1);
    case 'result.size()': return String(variables.resultList.length);
    default: return '';
  }
}

// 渲染行内变量值
function renderInlineVariables(lineNum: number, variables: VariablesState, isHighlighted: boolean): JSX.Element | null {
  const varNames = LINE_VARIABLES[lineNum];
  if (!varNames || !isHighlighted) return null;
  
  return (
    <span style={styles.inlineVars}>
      {varNames.map((name, i) => (
        <span key={i} style={styles.inlineVar}>
          <span style={styles.inlineVarName}>{name}</span>
          <span style={styles.inlineVarEquals}>=</span>
          <span style={styles.inlineVarValue}>{getVariableValue(name, variables)}</span>
        </span>
      ))}
    </span>
  );
}

export function CodePanel({ 
  highlightedLine, 
  callStackDepth,
  variables,
  showVariablesPanel
}: CodePanelProps) {
  const [changedHighlight, setChangedHighlight] = useState<ChangedVariable>(null);
  
  // Handle variable change highlighting
  useEffect(() => {
    if (variables.changedVariable) {
      setChangedHighlight(variables.changedVariable);
      const timer = setTimeout(() => setChangedHighlight(null), 500);
      return () => clearTimeout(timer);
    }
  }, [variables.changedVariable, variables.currentString, variables.resultList.length]);

  return (
    <div style={styles.container}>
      {/* Code Header */}
      <div style={styles.codeHeader}>
        <span style={styles.headerTitle}>
          <span style={styles.debugIcon}>●</span>
          Java 代码
        </span>
        <span style={styles.headerBadge}>DEBUG</span>
      </div>
      
      {/* Code Section with inline debug values */}
      <div style={styles.codeSection}>
        <pre style={styles.code}>
          {JAVA_CODE.map((line, index) => {
            const lineNum = index + 1;
            const isHighlighted = lineNum === highlightedLine;
            return (
              <div
                key={index}
                style={{
                  ...styles.line,
                  ...(isHighlighted ? styles.lineHighlighted : {})
                }}
              >
                <span style={styles.lineNumber}>{lineNum}</span>
                {isHighlighted && <span style={styles.breakpoint}>●</span>}
                {!isHighlighted && <span style={styles.breakpointEmpty} />}
                <span style={styles.lineContent}>{highlightSyntax(line)}</span>
                {renderInlineVariables(lineNum, variables, isHighlighted)}
              </div>
            );
          })}
        </pre>
      </div>

      {/* Variables Watch Panel */}
      {showVariablesPanel && (
        <div style={styles.variablesPanel}>
          <div style={styles.variablesHeader}>
            <span>📊 变量监视</span>
            <span style={styles.depthBadge}>栈深度: {callStackDepth}</span>
          </div>
          
          <div style={styles.variablesList}>
            <div style={{
              ...styles.variableRow,
              ...(changedHighlight === 'current' ? styles.variableChanged : {})
            }}>
              <span style={styles.varName}>current</span>
              <span style={styles.varStringValue}>"{variables.currentString}"</span>
            </div>
            
            <div style={styles.variableRowGroup}>
              <div style={{
                ...styles.variableRowSmall,
                ...(changedHighlight === 'open' ? styles.variableChanged : {})
              }}>
                <span style={styles.varName}>open</span>
                <span style={styles.varNumValue}>{variables.n - variables.leftCount}</span>
              </div>
              
              <div style={{
                ...styles.variableRowSmall,
                ...(changedHighlight === 'close' ? styles.variableChanged : {})
              }}>
                <span style={styles.varName}>close</span>
                <span style={styles.varNumValue}>{variables.n - variables.rightCount}</span>
              </div>
              
              <div style={styles.variableRowSmall}>
                <span style={styles.varName}>max</span>
                <span style={styles.varNumValue}>{variables.n}</span>
              </div>
            </div>
            
            <div style={{
              ...styles.variableRow,
              ...(changedHighlight === 'result' ? styles.variableChanged : {})
            }}>
              <span style={styles.varName}>result</span>
              <span style={styles.varArrayValue}>
                [{variables.resultList.map((r, i) => (
                  <span key={i}>
                    {i > 0 && ', '}
                    <span style={styles.arrayItem}>"{r}"</span>
                  </span>
                ))}]
                <span style={styles.arraySize}> ({variables.resultList.length})</span>
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


const styles: Record<string, React.CSSProperties> = {
  container: {
    backgroundColor: '#1e1e1e',
    borderRadius: '6px',
    overflow: 'hidden',
    fontSize: '12px',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    minHeight: 0,
  },
  codeHeader: {
    padding: '6px 12px',
    backgroundColor: '#252526',
    color: '#ccc',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #333',
  },
  headerTitle: {
    fontWeight: 600,
    color: '#e0e0e0',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '11px',
  },
  debugIcon: {
    color: '#e51400',
    fontSize: '8px',
    animation: 'pulse 1.5s infinite',
  },
  headerBadge: {
    backgroundColor: '#e51400',
    color: '#fff',
    padding: '1px 6px',
    borderRadius: '3px',
    fontSize: '9px',
    fontWeight: 600,
  },
  codeSection: {
    flex: 1,
    overflow: 'auto',
    minHeight: 0,
  },
  code: {
    margin: 0,
    padding: '4px 0',
    fontFamily: 'Consolas, "Courier New", monospace',
    fontSize: '11px',
    lineHeight: '1.4',
  },
  line: {
    display: 'flex',
    alignItems: 'center',
    padding: '1px 8px',
    color: '#d4d4d4',
    position: 'relative',
    minHeight: '18px',
  },
  lineHighlighted: {
    backgroundColor: '#3c3c00',
    borderLeft: '3px solid #ffcc00',
    boxShadow: 'inset 0 0 20px rgba(255, 204, 0, 0.1)',
  },
  lineNumber: {
    width: '20px',
    color: '#858585',
    textAlign: 'right',
    marginRight: '8px',
    flexShrink: 0,
    fontFamily: 'Consolas, monospace',
    fontSize: '10px',
  },
  lineContent: {
    whiteSpace: 'pre',
  },
  breakpoint: {
    color: '#e51400',
    marginRight: '6px',
    fontSize: '8px',
    flexShrink: 0,
  },
  breakpointEmpty: {
    width: '14px',
    flexShrink: 0,
  },
  inlineVars: {
    marginLeft: 'auto',
    paddingLeft: '12px',
    display: 'flex',
    gap: '8px',
    flexShrink: 0,
  },
  inlineVar: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 204, 0, 0.15)',
    padding: '0 6px',
    borderRadius: '3px',
    fontSize: '10px',
  },
  inlineVarName: {
    color: '#9cdcfe',
  },
  inlineVarEquals: {
    color: '#d4d4d4',
    margin: '0 2px',
  },
  inlineVarValue: {
    color: '#b5cea8',
    fontWeight: 600,
  },
  variablesPanel: {
    borderTop: '1px solid #333',
    backgroundColor: '#252526',
    flexShrink: 0,
  },
  variablesHeader: {
    padding: '4px 12px',
    backgroundColor: '#2d2d2d',
    color: '#e0e0e0',
    fontWeight: 600,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '10px',
  },
  depthBadge: {
    backgroundColor: '#4a4a4a',
    padding: '1px 6px',
    borderRadius: '3px',
    fontSize: '9px',
    color: '#b5cea8',
  },
  variablesList: {
    padding: '6px 12px',
  },
  variableRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '3px 6px',
    borderRadius: '3px',
    marginBottom: '3px',
    transition: 'background-color 0.3s',
    backgroundColor: '#2d2d2d',
  },
  variableRowGroup: {
    display: 'flex',
    gap: '4px',
    marginBottom: '3px',
  },
  variableRowSmall: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '3px 6px',
    borderRadius: '3px',
    backgroundColor: '#2d2d2d',
    transition: 'background-color 0.3s',
  },
  variableChanged: {
    backgroundColor: 'rgba(255, 204, 0, 0.25)',
  },
  varName: {
    color: '#9cdcfe',
    fontFamily: 'Consolas, monospace',
    fontSize: '10px',
  },
  varStringValue: {
    color: '#ce9178',
    fontFamily: 'Consolas, monospace',
    fontSize: '10px',
  },
  varNumValue: {
    color: '#b5cea8',
    fontFamily: 'Consolas, monospace',
    fontSize: '10px',
    fontWeight: 600,
  },
  varArrayValue: {
    color: '#d4d4d4',
    fontFamily: 'Consolas, monospace',
    fontSize: '10px',
  },
  arrayItem: {
    color: '#ce9178',
  },
  arraySize: {
    color: '#858585',
    fontSize: '9px',
  },
};

// Helper function to create VariablesState from GenerationStep
export function getVariablesFromStep(step: GenerationStep | null, n: number): VariablesState {
  if (!step) {
    return {
      currentString: '',
      leftCount: n,
      rightCount: n,
      resultList: [],
      n,
      callStackDepth: 0,
      changedVariable: null,
    };
  }
  return {
    currentString: step.variables.current,
    leftCount: step.leftRemaining,
    rightCount: step.rightRemaining,
    resultList: step.variables.resultSnapshot,
    n: step.variables.max,
    callStackDepth: step.callStackDepth,
    changedVariable: step.changedVariable,
  };
}

export function getCodePanelValues(step: GenerationStep | null, n: number = 3) {
  if (!step) {
    return {
      highlightedLine: 8,
      callStackDepth: 0,
      variables: getVariablesFromStep(null, n),
      showVariablesPanel: true,
    };
  }
  return {
    highlightedLine: step.codeLine,
    callStackDepth: step.callStackDepth,
    variables: getVariablesFromStep(step, n),
    showVariablesPanel: true,
  };
}
