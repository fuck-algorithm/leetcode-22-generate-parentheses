import { GenerationStep } from '../types';

interface CallStackProps {
  steps: GenerationStep[];
  currentStepIndex: number;
}

interface StackFrame {
  depth: number;
  current: string;
  open: number;
  close: number;
  max: number;
}

// 根据当前步骤构建调用栈
function buildCallStack(steps: GenerationStep[], currentStepIndex: number): StackFrame[] {
  if (currentStepIndex < 0 || steps.length === 0) {
    return [];
  }

  const currentStep = steps[currentStepIndex];
  if (!currentStep) return [];

  const stack: StackFrame[] = [];
  const max = currentStep.variables.max;

  // 从当前字符串反推调用栈
  // 每一层对应字符串的一个前缀状态
  const current = currentStep.currentString;
  
  // 初始调用 backtrack("", 0, 0, n)
  stack.push({
    depth: 0,
    current: '',
    open: 0,
    close: 0,
    max
  });

  // 逐步构建每一层
  let openCount = 0;
  let closeCount = 0;
  for (let i = 0; i < current.length; i++) {
    if (current[i] === '(') {
      openCount++;
    } else {
      closeCount++;
    }
    stack.push({
      depth: i + 1,
      current: current.substring(0, i + 1),
      open: openCount,
      close: closeCount,
      max
    });
  }

  return stack;
}

export function CallStack({ steps, currentStepIndex }: CallStackProps) {
  const stack = buildCallStack(steps, currentStepIndex);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <span style={styles.headerIcon}>📚</span>
        <span style={styles.headerTitle}>调用栈</span>
        <span style={styles.headerBadge}>{stack.length} 层</span>
      </div>
      
      <div style={styles.stackList}>
        {stack.length === 0 ? (
          <div style={styles.empty}>等待执行...</div>
        ) : (
          // 从栈顶（最新）到栈底（最早）显示
          [...stack].reverse().map((frame, index) => {
            const isTop = index === 0;
            return (
              <div
                key={frame.depth}
                style={{
                  ...styles.stackFrame,
                  ...(isTop ? styles.stackFrameActive : {})
                }}
              >
                <div style={styles.frameHeader}>
                  <span style={styles.frameIcon}>{isTop ? '▶' : '│'}</span>
                  <span style={styles.frameName}>backtrack</span>
                  <span style={styles.frameDepth}>#{frame.depth}</span>
                </div>
                <div style={styles.frameParams}>
                  <span style={styles.param}>
                    <span style={styles.paramName}>current</span>
                    <span style={styles.paramValue}>"{frame.current}"</span>
                  </span>
                  <span style={styles.param}>
                    <span style={styles.paramName}>open</span>
                    <span style={styles.paramValueNum}>{frame.open}</span>
                  </span>
                  <span style={styles.param}>
                    <span style={styles.paramName}>close</span>
                    <span style={styles.paramValueNum}>{frame.close}</span>
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    backgroundColor: '#1e1e1e',
    borderRadius: '6px',
    overflow: 'hidden',
    fontSize: '11px',
  },
  header: {
    padding: '6px 12px',
    backgroundColor: '#252526',
    color: '#ccc',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    borderBottom: '1px solid #333',
  },
  headerIcon: {
    fontSize: '12px',
  },
  headerTitle: {
    fontWeight: 600,
    color: '#e0e0e0',
    fontSize: '11px',
  },
  headerBadge: {
    marginLeft: 'auto',
    backgroundColor: '#4a4a4a',
    color: '#b5cea8',
    padding: '1px 6px',
    borderRadius: '3px',
    fontSize: '9px',
  },
  stackList: {
    maxHeight: '200px',
    overflow: 'auto',
    padding: '4px',
  },
  empty: {
    color: '#666',
    textAlign: 'center',
    padding: '12px',
    fontStyle: 'italic',
  },
  stackFrame: {
    backgroundColor: '#2d2d2d',
    borderRadius: '4px',
    padding: '6px 8px',
    marginBottom: '4px',
    borderLeft: '3px solid transparent',
  },
  stackFrameActive: {
    backgroundColor: '#3c3c00',
    borderLeftColor: '#ffcc00',
  },
  frameHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginBottom: '4px',
  },
  frameIcon: {
    color: '#ffcc00',
    fontSize: '10px',
    width: '12px',
  },
  frameName: {
    color: '#dcdcaa',
    fontFamily: 'Consolas, monospace',
    fontWeight: 600,
  },
  frameDepth: {
    marginLeft: 'auto',
    color: '#858585',
    fontSize: '9px',
  },
  frameParams: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    paddingLeft: '18px',
  },
  param: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  paramName: {
    color: '#9cdcfe',
    fontFamily: 'Consolas, monospace',
    fontSize: '10px',
  },
  paramValue: {
    color: '#ce9178',
    fontFamily: 'Consolas, monospace',
    fontSize: '10px',
  },
  paramValueNum: {
    color: '#b5cea8',
    fontFamily: 'Consolas, monospace',
    fontSize: '10px',
  },
};
