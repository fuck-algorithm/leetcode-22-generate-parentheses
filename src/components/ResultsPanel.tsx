interface ResultsPanelProps {
  results: string[];
  isComplete?: boolean;
}

export function ResultsPanel({ results, isComplete: _isComplete = false }: ResultsPanelProps) {
  void _isComplete; // Reserved for future use
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <span style={styles.title}>✓ 结果</span>
        <span style={styles.count}>{results.length}</span>
      </div>
      <div style={styles.list}>
        {results.length === 0 ? (
          <span style={styles.empty}>-</span>
        ) : (
          results.map((result, index) => (
            <span key={index} style={styles.item}>{result}</span>
          ))
        )}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: '8px 12px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '6px',
  },
  title: {
    fontSize: '12px',
    color: '#2e7d32',
  },
  count: {
    fontSize: '11px',
    color: '#888',
  },
  list: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
  },
  item: {
    padding: '2px 6px',
    fontSize: '11px',
    fontFamily: 'monospace',
    backgroundColor: '#e8f5e9',
    color: '#2e7d32',
    borderRadius: '3px',
  },
  empty: {
    color: '#ccc',
    fontSize: '12px',
  }
};
