interface StatePanelProps {
  currentPath: string;
  leftCount: number;
  rightCount: number;
  totalSteps: number;
  currentStep: number;
}

export function StatePanel({
  currentPath,
  leftCount,
  rightCount,
  totalSteps,
  currentStep
}: StatePanelProps) {
  return (
    <div style={styles.container}>
      <h3 style={styles.title}>当前状态</h3>
      <div style={styles.content}>
        <div style={styles.row}>
          <span style={styles.label}>当前字符串:</span>
          <span style={styles.value}>{currentPath || '(空)'}</span>
        </div>
        <div style={styles.row}>
          <span style={styles.label}>剩余左括号:</span>
          <span style={styles.value}>{leftCount}</span>
        </div>
        <div style={styles.row}>
          <span style={styles.label}>剩余右括号:</span>
          <span style={styles.value}>{rightCount}</span>
        </div>
        <div style={styles.row}>
          <span style={styles.label}>步骤:</span>
          <span style={styles.value}>{currentStep + 1} / {totalSteps}</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Extracts display values from a generation step for testing.
 */
export function getStatePanelValues(step: { currentString: string; leftRemaining: number; rightRemaining: number } | null) {
  if (!step) {
    return {
      currentPath: '',
      leftCount: 0,
      rightCount: 0
    };
  }
  return {
    currentPath: step.currentString,
    leftCount: step.leftRemaining,
    rightCount: step.rightRemaining
  };
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: '12px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  title: {
    margin: '0 0 12px 0',
    fontSize: '14px',
    fontWeight: 600,
    color: '#333'
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '13px'
  },
  label: {
    color: '#666'
  },
  value: {
    fontWeight: 500,
    fontFamily: 'monospace'
  }
};
