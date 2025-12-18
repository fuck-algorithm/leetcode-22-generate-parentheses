import { useState, useEffect, useCallback } from 'react';
import { InputPanel } from './components/InputPanel';
import { ControlPanel } from './components/ControlPanel';
import { TreeVisualization } from './components/TreeVisualization';
import { StatePanel } from './components/StatePanel';
import { CodePanel, getCodePanelValues } from './components/CodePanel';
import { ResultsPanel } from './components/ResultsPanel';
import { AlgorithmGuide } from './components/AlgorithmGuide';
import { CallStack } from './components/CallStack';
import { WechatFloat } from './components/WechatFloat';
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
        <a
          href="https://github.com/fuck-algorithm/leetcode-22-generate-parentheses"
          target="_blank"
          rel="noopener noreferrer"
          style={styles.githubLink}
          title="View on GitHub"
        >
          <svg
            height="24"
            width="24"
            viewBox="0 0 16 16"
            fill="currentColor"
          >
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
          </svg>
        </a>
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
          currentStep={animation.currentStepIndex}
          totalSteps={algorithm.totalSteps}
          onStepChange={animation.goToStep}
        />
      </div>

      <div style={styles.main}>
        {/* 左侧算法思路介绍 */}
        <div style={styles.leftPanel}>
          <AlgorithmGuide 
            n={algorithm.n} 
            currentAction={currentStep?.action}
          />
        </div>

        {/* 中间树形可视化 - 主角 */}
        <div id="tree-container" style={styles.treeContainer}>
          <TreeVisualization
            treeData={algorithm.treeData}
            currentNodeId={currentStep?.nodeId || null}
            width={dimensions.width}
            height={dimensions.height}
            currentAction={currentStep?.action}
          />
        </div>

        {/* 右侧代码和变量面板 */}
        <div style={styles.sidePanel}>
          <StatePanel
            currentPath={currentStep?.currentString || ''}
            leftCount={currentStep?.leftRemaining || algorithm.n}
            rightCount={currentStep?.rightRemaining || algorithm.n}
            totalSteps={algorithm.totalSteps}
            currentStep={animation.currentStepIndex}
          />
          <CodePanel
            {...getCodePanelValues(currentStep, algorithm.n)}
          />
          <CallStack
            steps={algorithm.steps}
            currentStepIndex={animation.currentStepIndex}
          />
          <ResultsPanel
            results={currentResults}
            isComplete={animation.isAtEnd}
          />
        </div>
      </div>

      {/* 微信群悬浮球 */}
      <WechatFloat />
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    padding: '4px 12px',
    gap: '4px',
    backgroundColor: '#f5f5f5',
    overflow: 'hidden'
  },
  header: {
    textAlign: 'center',
    padding: '2px 0',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '24px'
  },
  githubLink: {
    position: 'absolute',
    right: '0',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#333',
    transition: 'color 0.2s',
    display: 'flex',
    alignItems: 'center'
  },
  title: {
    margin: 0,
    fontSize: '14px',
    fontWeight: 600,
    lineHeight: 1
  },
  titleLink: {
    color: '#1976d2',
    textDecoration: 'none',
    transition: 'color 0.2s'
  },
  controls: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    alignItems: 'center'
  },
  main: {
    flex: 1,
    display: 'flex',
    gap: '12px',
    minHeight: 0
  },
  leftPanel: {
    width: '180px',
    flexShrink: 0,
    overflow: 'auto'
  },
  treeContainer: {
    flex: 1.5,
    minWidth: 0,
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    overflow: 'hidden'
  },
  sidePanel: {
    width: '640px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    flexShrink: 0,
    overflow: 'auto'
  }
};

export default App;
