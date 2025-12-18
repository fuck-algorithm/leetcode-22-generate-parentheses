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
      <div style={styles.pathRow}>
        <span style={styles.pathLabel}>当前:</span>
        <span style={styles.pathValue}>{currentPath || 'ε'}</span>
      </div>
      <div style={styles.statsRow}>
        <span style={styles.stat}>
          <span style={styles.statLabel}>左(</span>
          <span style={styles.statValue}>{leftCount}</span>
        </span>
        <span style={styles.stat}>
          <span style={styles.statLabel}>右)</span>
          <span style={styles.statValue}>{rightCount}</span>
        </span>
        <span style={styles.step}>{currentStep + 1}/{totalSteps}</span>
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
    padding: '10px 12px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  pathRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '6px',
  },
  pathLabel: {
    color: '#666',
    fontSize: '12px',
  },
  pathValue: {
    fontFamily: 'monospace',
    fontSize: '16px',
    fontWeight: 600,
    color: '#1976d2',
    letterSpacing: '2px',
  },
  statsRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '12px',
  },
  stat: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  statLabel: {
    color: '#888',
  },
  statValue: {
    fontWeight: 600,
    color: '#333',
  },
  step: {
    marginLeft: 'auto',
    color: '#888',
    fontSize: '11px',
  },
};
