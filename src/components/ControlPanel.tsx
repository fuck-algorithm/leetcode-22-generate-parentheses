interface ControlPanelProps {
  isRunning: boolean;
  onPlay: () => void;
  onPause: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onReset: () => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  disabled: boolean;
  isAtEnd: boolean;
  isAtStart: boolean;
}

export function ControlPanel({
  isRunning,
  onPlay,
  onPause,
  onStepForward,
  onStepBackward,
  onReset,
  speed,
  onSpeedChange,
  disabled,
  isAtEnd,
  isAtStart
}: ControlPanelProps) {
  return (
    <div style={styles.container}>
      <div style={styles.buttons}>
        {isRunning ? (
          <button onClick={onPause} disabled={disabled} style={styles.button}>
            ⏸ 暂停
          </button>
        ) : (
          <button onClick={onPlay} disabled={disabled || isAtEnd} style={styles.button}>
            ▶ 播放
          </button>
        )}
        <button onClick={onStepBackward} disabled={disabled || isAtStart} style={styles.button}>
          ⏮ 上一步
        </button>
        <button onClick={onStepForward} disabled={disabled || isAtEnd} style={styles.button}>
          ⏭ 下一步
        </button>
        <button onClick={onReset} disabled={disabled} style={styles.button}>
          ↺ 重置
        </button>
      </div>
      <div style={styles.speedControl}>
        <label style={styles.speedLabel}>
          速度: {speed}ms
          <input
            type="range"
            min="100"
            max="2000"
            step="100"
            value={speed}
            onChange={(e) => onSpeedChange(parseInt(e.target.value, 10))}
            disabled={disabled}
            style={styles.slider}
          />
        </label>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '12px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  buttons: {
    display: 'flex',
    gap: '8px'
  },
  button: {
    padding: '8px 12px',
    fontSize: '13px',
    fontWeight: 500,
    color: '#333',
    backgroundColor: '#f5f5f5',
    border: '1px solid #ddd',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  },
  speedControl: {
    display: 'flex',
    alignItems: 'center'
  },
  speedLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px'
  },
  slider: {
    width: '100px'
  }
};
