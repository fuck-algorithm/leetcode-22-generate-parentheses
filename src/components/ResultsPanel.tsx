interface ResultsPanelProps {
  results: string[];
  isComplete?: boolean;
}

export function ResultsPanel({ results, isComplete = false }: ResultsPanelProps) {
  return (
    <div style={styles.container}>
      <h3 style={styles.title}>
        有效组合 {isComplete && `(共 ${results.length} 个)`}
      </h3>
      <div style={styles.list}>
        {results.length === 0 ? (
          <div style={styles.empty}>暂无结果</div>
        ) : (
          results.map((result, index) => (
            <div key={index} style={styles.item}>
              {result}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: '12px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    maxHeight: '200px',
    overflow: 'auto'
  },
  title: {
    margin: '0 0 12px 0',
    fontSize: '14px',
    fontWeight: 600,
    color: '#333'
  },
  list: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px'
  },
  item: {
    padding: '4px 8px',
    fontSize: '13px',
    fontFamily: 'monospace',
    backgroundColor: '#e8f5e9',
    color: '#2e7d32',
    borderRadius: '4px'
  },
  empty: {
    color: '#999',
    fontSize: '13px'
  }
};
