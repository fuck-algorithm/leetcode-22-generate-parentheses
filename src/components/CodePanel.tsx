import { styles } from './CodePanel.styles';

interface CodePanelProps {
  highlightedLine: number;
  callStackDepth: number;
  currentString: string;
  leftRemaining: number;
  rightRemaining: number;
  action: string;
}

// Java代码实现 - 与算法步骤精确对应
const JAVA_CODE = [
  'class Solution {',                                           // 1
  '    List<String> result = new ArrayList<>();',               // 2
  '',                                                           // 3
  '    public List<String> generateParenthesis(int n) {',       // 4
  '        backtrack("", n, n);',                               // 5
  '        return result;',                                     // 6
  '    }',                                                      // 7
  '',                                                           // 8
  '    void backtrack(String cur, int left, int right) {',      // 9
  '        if (left == 0 && right == 0) {',                     // 10
  '            result.add(cur);  // ✓ 找到有效组合',             // 11
  '            return;',                                        // 12
  '        }',                                                  // 13
  '',                                                           // 14
  '        if (left > 0) {',                                    // 15
  '            backtrack(cur + "(", left - 1, right);',         // 16
  '        }',                                                  // 17
  '        // ← 回溯点：尝试添加 "(" 后返回',                    // 18
  '',                                                           // 19
  '        if (right > left) {',                                // 20
  '            backtrack(cur + ")", left, right - 1);',         // 21
  '        }',                                                  // 22
  '        // ← 回溯点：尝试添加 ")" 后返回',                    // 23
  '    }',                                                      // 24
  '}',                                                          // 25
];

// 代码行与算法动作的映射
function getHighlightLine(action: string, codeLine: number): number {
  switch (action) {
    case 'add_left':
      return 16;  // backtrack(cur + "(", left - 1, right);
    case 'add_right':
      return 21;  // backtrack(cur + ")", left, right - 1);
    case 'complete':
      return 11;  // result.add(cur);
    case 'backtrack':
      // 根据原始codeLine判断是从哪个分支回溯
      return codeLine === 7 ? 18 : 23;
    default:
      return 9;   // 函数入口
  }
}

// 获取断点行（关键执行点）
function getBreakpointLines(): Set<number> {
  return new Set([10, 11, 15, 16, 18, 20, 21, 23]);
}

export function CodePanel({ 
  highlightedLine, 
  callStackDepth,
  currentString,
  leftRemaining,
  rightRemaining,
  action
}: CodePanelProps) {
  const actualHighlightLine = getHighlightLine(action, highlightedLine);
  const breakpoints = getBreakpointLines();
  
  // 构建调用栈显示
  const callStack = buildCallStack(callStackDepth, currentString, leftRemaining, rightRemaining);

  return (
    <div style={styles.container}>
      {/* 头部 */}
      <div style={styles.header}>
        <h3 style={styles.title}>
          <span>☕ Java 代码</span>
          <span style={styles.debugBadge}>● DEBUG</span>
        </h3>
        <span style={styles.depth}>深度: {callStackDepth}</span>
      </div>

      {/* 代码区域 */}
      <div style={styles.codeSection}>
        <pre style={styles.code}>
          {JAVA_CODE.map((line, index) => {
            const lineNum = index + 1;
            const isHighlighted = lineNum === actualHighlightLine;
            const hasBreakpoint = breakpoints.has(lineNum);
            
            return (
              <div
                key={index}
                style={{
                  ...styles.line,
                  ...(isHighlighted ? styles.lineHighlighted : styles.lineNormal)
                }}
              >
                {hasBreakpoint && isHighlighted ? (
                  <span style={styles.breakpoint} />
                ) : (
                  <span style={styles.breakpointEmpty} />
                )}
                <span style={styles.lineNumber}>{lineNum}</span>
                <span style={styles.lineContent}>
                  {highlightSyntax(line)}
                </span>
              </div>
            );
          })}
        </pre>
      </div>

      {/* 变量监视区域 */}
      <div style={styles.variablesSection}>
        <div style={styles.variablesTitle}>
          <span style={styles.variablesIcon}>👁</span>
          <span>变量监视</span>
        </div>
        <div style={styles.variablesList}>
          <VariableRow name="cur" value={`"${currentString}"`} type="string" />
          <VariableRow name="left" value={leftRemaining} type="number" />
          <VariableRow name="right" value={rightRemaining} type="number" />
          <VariableRow name="action" value={getActionLabel(action)} type="string" />
        </div>
      </div>

      {/* 调用栈区域 */}
      <div style={styles.callStackSection}>
        <div style={styles.callStackTitle}>
          <span style={styles.variablesIcon}>📚</span>
          <span>调用栈</span>
        </div>
        <div style={styles.callStackList}>
          {callStack.map((frame, index) => (
            <div 
              key={index} 
              style={{
                ...styles.callStackItem,
                ...(index === 0 ? styles.callStackItemActive : {})
              }}
            >
              <span style={styles.callStackArrow}>▶</span>
              <span>{frame}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 变量行组件
function VariableRow({ name, value, type }: { name: string; value: string | number; type: 'string' | 'number' }) {
  const valueStyle = type === 'number' ? styles.variableValueNumber : styles.variableValueString;
  return (
    <div style={styles.variableRow}>
      <span style={styles.variableName}>{name}</span>
      <span style={styles.variableEquals}>=</span>
      <span style={valueStyle}>{value}</span>
    </div>
  );
}

// 构建调用栈
function buildCallStack(depth: number, cur: string, left: number, right: number): string[] {
  const stack: string[] = [];
  
  // 当前帧
  stack.push(`backtrack("${cur}", ${left}, ${right})`);
  
  // 模拟父帧（简化显示）
  if (depth > 1) {
    const parentCur = cur.slice(0, -1);
    stack.push(`backtrack("${parentCur}", ...)`);
  }
  
  if (depth > 2) {
    stack.push(`... (${depth - 2} more frames)`);
  }
  
  // 入口
  stack.push('generateParenthesis(n)');
  
  return stack;
}

// 获取动作标签
function getActionLabel(action: string): string {
  switch (action) {
    case 'add_left': return '"添加左括号"';
    case 'add_right': return '"添加右括号"';
    case 'complete': return '"完成组合"';
    case 'backtrack': return '"回溯"';
    default: return '"初始化"';
  }
}

// 语法高亮 - 返回原始文本，保持代码简洁
function highlightSyntax(line: string): string {
  return line;
}

/**
 * Extracts code panel display values from a generation step for testing.
 */
export function getCodePanelValues(step: { 
  codeLine: number; 
  callStackDepth: number;
  currentString?: string;
  leftRemaining?: number;
  rightRemaining?: number;
  action?: string;
} | null) {
  if (!step) {
    return {
      highlightedLine: 1,
      callStackDepth: 0,
      currentString: '',
      leftRemaining: 0,
      rightRemaining: 0,
      action: ''
    };
  }
  return {
    highlightedLine: step.codeLine,
    callStackDepth: step.callStackDepth,
    currentString: step.currentString || '',
    leftRemaining: step.leftRemaining || 0,
    rightRemaining: step.rightRemaining || 0,
    action: step.action || ''
  };
}
