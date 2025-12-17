import { useState } from 'react';
import { styles } from './AlgorithmGuide.styles';

interface AlgorithmGuideProps {
  n: number;
  currentAction?: string;
}

export function AlgorithmGuide({ n, currentAction }: AlgorithmGuideProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div style={styles.container}>
      <div style={styles.header} onClick={() => setIsExpanded(!isExpanded)}>
        <h3 style={styles.title}>
          <span>📖</span>
          <span>算法原理</span>
        </h3>
        <span style={{
          ...styles.toggleIcon,
          transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
        }}>
          ▼
        </span>
      </div>

      {isExpanded && (
        <div style={styles.content}>
          {/* 核心思想 */}
          <div style={styles.section}>
            <div style={styles.sectionTitle}>
              <span>💡</span>
              <span>核心思想</span>
            </div>
            <p style={styles.paragraph}>
              使用<span style={styles.highlight}>回溯算法</span>生成所有有效的括号组合。
              通过递归尝试添加左括号或右括号，并在不满足条件时回溯。
            </p>
          </div>

          {/* 关键规则 */}
          <div style={styles.section}>
            <div style={styles.sectionTitle}>
              <span>📋</span>
              <span>关键规则</span>
            </div>
            <div style={styles.keyPoint}>
              <span style={styles.keyPointIcon}>1️⃣</span>
              <span style={styles.keyPointText}>
                <strong>左括号优先：</strong>只要还有剩余的左括号（left {'>'} 0），就可以添加左括号
              </span>
            </div>
            <div style={styles.keyPoint}>
              <span style={styles.keyPointIcon}>2️⃣</span>
              <span style={styles.keyPointText}>
                <strong>右括号限制：</strong>只有当已使用的左括号多于右括号时（right {'>'} left），才能添加右括号
              </span>
            </div>
            <div style={styles.keyPoint}>
              <span style={styles.keyPointIcon}>3️⃣</span>
              <span style={styles.keyPointText}>
                <strong>终止条件：</strong>当 left = 0 且 right = 0 时，找到一个有效组合
              </span>
            </div>
          </div>

          {/* 执行步骤 */}
          <div style={styles.section}>
            <div style={styles.sectionTitle}>
              <span>🔄</span>
              <span>执行步骤</span>
            </div>
            <div style={styles.stepsContainer}>
              <StepItem 
                number={1} 
                text="检查是否完成：left=0 且 right=0 → 保存结果"
                isActive={currentAction === 'complete'}
              />
              <StepItem 
                number={2} 
                text="尝试添加左括号：如果 left > 0，递归调用 backtrack(cur+'(', left-1, right)"
                isActive={currentAction === 'add_left'}
              />
              <StepItem 
                number={3} 
                text="回溯：从添加左括号的分支返回"
                isActive={currentAction === 'backtrack'}
              />
              <StepItem 
                number={4} 
                text="尝试添加右括号：如果 right > left，递归调用 backtrack(cur+')', left, right-1)"
                isActive={currentAction === 'add_right'}
              />
              <StepItem 
                number={5} 
                text="回溯：从添加右括号的分支返回"
                isActive={currentAction === 'backtrack'}
              />
            </div>
          </div>

          {/* 结果数量 */}
          <div style={styles.section}>
            <div style={styles.sectionTitle}>
              <span>📊</span>
              <span>结果数量</span>
            </div>
            <p style={styles.paragraph}>
              n 对括号的有效组合数量由<strong>卡特兰数</strong>决定：
            </p>
            <div style={styles.formula}>
              <span>C(n) = (2n)! / ((n+1)! × n!)</span>
              <span style={{ color: '#666' }}>|</span>
              <span>n={n} → C({n}) = {catalanNumber(n)} 种组合</span>
            </div>
          </div>

          {/* 树形图例 */}
          <div style={styles.section}>
            <div style={styles.sectionTitle}>
              <span>🎨</span>
              <span>树形图例</span>
            </div>
            <div style={styles.legendContainer}>
              <LegendItem color="#e0e0e0" label="待探索" />
              <LegendItem color="#2196F3" label="当前节点" />
              <LegendItem color="#4CAF50" label="有效路径" />
              <LegendItem color="#FF9800" label="正在回溯" />
              <LegendItem color="#9E9E9E" label="已回溯" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StepItem({ number, text, isActive }: { number: number; text: string; isActive?: boolean }) {
  return (
    <div style={{
      ...styles.step,
      backgroundColor: isActive ? '#e3f2fd' : '#f9f9f9',
      borderLeftColor: isActive ? '#1976d2' : '#ddd'
    }}>
      <span style={{
        ...styles.stepNumber,
        backgroundColor: isActive ? '#1976d2' : '#9e9e9e'
      }}>{number}</span>
      <span style={styles.stepText}>{text}</span>
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div style={styles.legendItem}>
      <span style={{ ...styles.legendDot, backgroundColor: color }} />
      <span>{label}</span>
    </div>
  );
}

function catalanNumber(n: number): number {
  if (n <= 0) return 1;
  let result = 1;
  for (let i = 0; i < n; i++) {
    result = result * 2 * (2 * i + 1) / (i + 2);
  }
  return Math.round(result);
}
