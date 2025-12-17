import { useState, useEffect, useCallback } from 'react';
import { InputPanel } from './components/InputPanel';
import { ControlPanel } from './components/ControlPanel';
import { TreeVisualization } from './components/TreeVisualization';
import { StatePanel } from './components/StatePanel';
import { CodePanel } from './components/CodePanel';
import { ResultsPanel } from './components/ResultsPanel';
import { useAlgorithm } from './hooks/useAlgorithm';
import { useAnimation } from './hooks/useAnimation';
import { updateTreeStatus } from './utils/treeBuilder';

function App() {
  const algorithm = useAlgorithm();
  const [dimensions, setDimensions] = useState({ width: 600, height: 400 });
  
  const animation = useAnimation(algorithm.totalSteps, (step) => {
    if (algorithm.treeData) {
      updateTreeStatus(algorithm.treeData, algorithm.steps, step);
    }
  });

  const currentStep = algorithm.getStepAt(animation.currentStepIndex);
  const currentResults = algorithm.getResultsUpToStep(animation.currentStepIndex);

  const handleGenerate = useCallback((n: number) => {
    const success = algorithm.initialize(n);
    if (success) {
      animation.reset();
    }
  }, [algorithm, animation]);

  const handleReset = useCallback(() => {
    animation.reset();
    if (algorithm.treeData) {
      updateTreeStatus(algorithm.treeData, algorithm.steps, 0);
    }
  }, [animation, algorithm]);

  // Handle window resize
  useEffect(() => {
    const updateDimensions = () => {
      const treeContainer = document.getElementById('tree-container');
      if (treeContainer) {
        setDimensions({
          width: treeContainer.clientWidth,
          height: treeContainer.clientHeight
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Update dimensions when algorithm initializes
  useEffect(() => {
    const timer = setTimeout(() => {
      const treeContainer = document.getElementById('tree-container');
      if (treeContainer) {
        setDimensions({
          width: treeContainer.clientWidth,
          height: treeContainer.clientHeight
        });
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [algorithm.isInitialized]);

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>
          <a 
            href="https://leetcode.cn/problems/generate-parentheses/" 
            target="_blank" 
            rel="noopener noreferrer"
            style={styles.titleLink}
          >
            22. 括号生成
          </a>
        </h1>
      </header>

      <div style={styles.controls}>
        <InputPanel
          onSubmit={handleGenerate}
          disabled={animation.isPlaying}
        />
        <ControlPanel
          isRunning={animation.isPlaying}
          onPlay={animation.play}
          onPause={animation.pause}
          onStepForward={animation.stepForward}
          onStepBackward={animation.stepBackward}
          onReset={handleReset}
          speed={animation.speed}
          onSpeedChange={animation.setSpeed}
          disabled={!algorithm.isInitialized}
          isAtEnd={animation.isAtEnd}
          isAtStart={animation.isAtStart}
        />
      </div>

      <div style={styles.main}>
        <div style={styles.leftPanel}>
          <StatePanel
            currentPath={currentStep?.currentString || ''}
            leftCount={currentStep?.leftRemaining || algorithm.n}
            rightCount={currentStep?.rightRemaining || algorithm.n}
            totalSteps={algorithm.totalSteps}
            currentStep={animation.currentStepIndex}
          />
          <CodePanel
            highlightedLine={currentStep?.codeLine || 1}
            callStackDepth={currentStep?.callStackDepth || 0}
            currentString={currentStep?.currentString || ''}
            leftRemaining={currentStep?.leftRemaining ?? algorithm.n}
            rightRemaining={currentStep?.rightRemaining ?? algorithm.n}
            action={currentStep?.action || ''}
          />
          <ResultsPanel
            results={currentResults}
            isComplete={animation.isAtEnd}
          />
        </div>

        <div id="tree-container" style={styles.treeContainer}>
          <TreeVisualization
            treeData={algorithm.treeData}
            currentNodeId={currentStep?.nodeId || null}
            width={dimensions.width}
            height={dimensions.height}
          />
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    padding: '16px',
    gap: '16px',
    backgroundColor: '#f5f5f5',
    overflow: 'hidden'
  },
  header: {
    textAlign: 'center'
  },
  title: {
    margin: 0,
    fontSize: '24px',
    fontWeight: 600
  },
  titleLink: {
    color: '#1976d2',
    textDecoration: 'none',
    transition: 'color 0.2s'
  },
  controls: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap'
  },
  main: {
    flex: 1,
    display: 'flex',
    gap: '16px',
    minHeight: 0
  },
  leftPanel: {
    width: '280px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    flexShrink: 0
  },
  treeContainer: {
    flex: 1,
    minWidth: 0,
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    overflow: 'hidden'
  }
};

export default App;
