import { useState } from 'react';
import { validateN } from '../utils/validation';

interface InputPanelProps {
  onSubmit: (n: number) => void;
  disabled: boolean;
}

export function InputPanel({ onSubmit, disabled }: InputPanelProps) {
  const [value, setValue] = useState('3');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    const n = parseInt(value, 10);
    const validation = validateN(n);
    
    if (!validation.isValid) {
      setError(validation.error || '无效输入');
      return;
    }
    
    setError(null);
    onSubmit(n);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div style={styles.container}>
      <label style={styles.label}>
        括号对数 (n):
        <input
          type="number"
          min="1"
          max="8"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          style={styles.input}
        />
      </label>
      <button
        onClick={handleSubmit}
        disabled={disabled}
        style={{
          ...styles.button,
          opacity: disabled ? 0.5 : 1,
          cursor: disabled ? 'not-allowed' : 'pointer'
        }}
      >
        生成
      </button>
      {error && <div style={styles.error}>{error}</div>}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  label: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    fontWeight: 500
  },
  input: {
    width: '60px',
    padding: '6px 10px',
    fontSize: '14px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    textAlign: 'center' as const
  },
  button: {
    padding: '8px 16px',
    fontSize: '14px',
    fontWeight: 500,
    color: '#fff',
    backgroundColor: '#4CAF50',
    border: 'none',
    borderRadius: '4px',
    transition: 'background-color 0.2s'
  },
  error: {
    color: '#f44336',
    fontSize: '12px'
  }
};
