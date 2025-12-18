import { useEffect, useCallback } from 'react';

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
  currentStep: number;
  totalSteps: number;
  onStepChange: (step: number) => void;
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
  isAtStart,
  currentStep,
  totalSteps,
  onStepChange
}: ControlPanelProps) {
  // 键盘快捷键处理
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // 忽略输入框中的按键
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      return;
    }
    
    if (disabled) return;

    switch (e.code) {
      case 'Space':
        e.preventDefault();
        if (isRunning) {
          onPause();
        } else if (!isAtEnd) {
          onPlay();
        }
        break;
      case 'ArrowLeft':
        e.preventDefault();
        if (!isAtStart) {
          onStepBackward();
        }
        break;
      case 'ArrowRight':
        e.preventDefault();
        if (!isAtEnd) {
          onStepForward();
        }
        break;
    }
  }, [disabled, isRunning, isAtEnd, isAtStart, onPlay, onPause, onStepForward, onStepBackward]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div style={styles.container}>
      <div style={styles.buttons}>
        {isRunning ? (
          <button onClick={onPause} disabled={disabled} style={styles.button}>
            ⏸ 暂停 <span style={styles.shortcut}>Space</span>
          </button>
        ) : (
          <button onClick={onPlay} disabled={disabled || isAtEnd} style={styles.button}>
            ▶ 播放 <span style={styles.shortcut}>Space</span>
          </button>
        )}
        <button onClick={onStepBackward} disabled={disabled || isAtStart} style={styles.button}>
          ⏮ 上一步 <span style={styles.shortcut}>←</span>
        </button>
        <button onClick={onStepForward} disabled={disabled || isAtEnd} style={styles.button}>
          ⏭ 下一步 <span style={styles.shortcut}>→</span>
        </button>
        <button onClick={onReset} disabled={disabled} style={styles.button}>
          ↺ 重置
        </button>
      </div>
      <div style={styles.progressControl}>
        <span style={styles.progressLabel}>
          进度: {currentStep + 1} / {totalSteps}
        </span>
        <input
          type="range"
          min="0"
          max={Math.max(0, totalSteps - 1)}
          value={currentStep}
          onChange={(e) => onStepChange(parseInt(e.target.value, 10))}
          disabled={disabled || totalSteps === 0}
          style={styles.progressSlider}
        />
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
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    flexWrap: 'wrap'
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
    transition: 'background-color 0.2s',
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  shortcut: {
    fontSize: '10px',
    color: '#888',
    backgroundColor: '#e8e8e8',
    padding: '2px 5px',
    borderRadius: '3px',
    fontFamily: 'monospace',
    border: '1px solid #ccc'
  },
  progressControl: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flex: 1,
    minWidth: '200px'
  },
  progressLabel: {
    fontSize: '13px',
    whiteSpace: 'nowrap',
    color: '#666'
  },
  progressSlider: {
    flex: 1,
    minWidth: '120px',
    cursor: 'pointer'
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
