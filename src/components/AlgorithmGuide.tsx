import { useState } from 'react';
import { styles } from './AlgorithmGuide.styles';

interface AlgorithmGuideProps {
  n: number;
  currentAction?: string;
}

export function AlgorithmGuide({ n, currentAction }: AlgorithmGuideProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <div style={styles.container}>
      <div style={styles.mainHeader}>
        <span style={styles.mainIcon}>📖</span>
        <span style={styles.mainTitle}>算法思路</span>
      </div>

      {/* 简洁概要 */}
      <div style={styles.summaryBox}>
        <div style={styles.summaryItem}>
          <span style={styles.summaryLabel}>算法</span>
          <span style={styles.summaryValue}>回溯法</span>
        </div>
        <div style={styles.summaryItem}>
          <span style={styles.summaryLabel}>n 值</span>
          <span style={styles.summaryValue}>{n}</span>
        </div>
        <div style={styles.summaryItem}>
          <span style={styles.summaryLabel}>有效组合</span>
          <span style={styles.summaryValue}>{catalanNumber(n)}</span>
        </div>
      </div>

      {/* 核心规则简述 */}
      <div style={styles.rulesPreview}>
        <div style={styles.rulePreviewItem}>
          <span style={styles.ruleIcon}>1️⃣</span>
          <span>左括号: open &lt; {n}</span>
        </div>
        <div style={styles.rulePreviewItem}>
          <span style={styles.ruleIcon}>2️⃣</span>
          <span>右括号: close &lt; open</span>
        </div>
        <div style={styles.rulePreviewItem}>
          <span style={styles.ruleIcon}>3️⃣</span>
          <span>完成: length = {n * 2}</span>
        </div>
      </div>

      {/* 查看详情按钮 */}
      <button style={styles.detailButton} onClick={() => setShowModal(true)}>
        💡 查看详细解题思路
      </button>

      {/* 当前状态指示 */}
      {currentAction && (
        <div style={{
          ...styles.currentAction,
          backgroundColor: getActionColor(currentAction)
        }}>
          <span style={styles.actionIcon}>{getActionIcon(currentAction)}</span>
          <span style={styles.actionText}>{getActionText(currentAction)}</span>
        </div>
      )}

      {/* 弹窗 */}
      {showModal && (
        <DetailModal n={n} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}

function DetailModal({ n, onClose }: { n: number; onClose: () => void }) {
  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <span style={styles.modalTitle}>📖 详细解题思路</span>
          <button style={styles.closeButton} onClick={onClose}>✕</button>
        </div>
        
        <div style={styles.modalBody}>
          {/* 核心思想 */}
          <div style={styles.modalSection}>
            <h3 style={styles.modalSectionTitle}>💡 核心思想</h3>
            <div style={styles.ideaBox}>
              <p style={styles.ideaText}>
                <strong>回溯算法</strong> = 递归 + 剪枝
              </p>
              <p style={styles.ideaSubtext}>
                通过递归尝试所有可能的括号组合，在发现无效路径时立即回溯，避免无效搜索。
              </p>
            </div>
            
            <div style={styles.analogyBox}>
              <div style={styles.analogyTitle}>🌳 类比理解</div>
              <p style={styles.analogyText}>
                想象你在走迷宫：每个岔路口你可以选择"添加左括号"或"添加右括号"。
                如果走到死胡同（右括号比左括号多），就退回上一个岔路口，尝试另一条路。
              </p>
            </div>
          </div>

          {/* 关键规则 */}
          <div style={styles.modalSection}>
            <h3 style={styles.modalSectionTitle}>📋 关键规则</h3>
            <RuleItem
              number={1}
              title="左括号优先"
              description="只要还有剩余的左括号，就可以添加"
              condition="open < max"
              color="#2196F3"
            />
            <RuleItem
              number={2}
              title="右括号限制"
              description="只有当已用的左括号多于右括号时，才能添加右括号"
              condition="close < open"
              color="#4CAF50"
            />
            <RuleItem
              number={3}
              title="终止条件"
              description="字符串长度达到 2n 时，找到一个有效组合"
              condition="current.length == max * 2"
              color="#FF9800"
            />
          </div>

          {/* 执行流程 */}
          <div style={styles.modalSection}>
            <h3 style={styles.modalSectionTitle}>🔄 执行流程</h3>
            <div style={styles.flowChart}>
              <FlowStep step="1" text="检查是否完成" detail="length == 2n?" />
              <div style={styles.flowArrow}>↓</div>
              <FlowStep step="2" text="尝试添加 (" detail="if open < max" />
              <div style={styles.flowArrow}>↓</div>
              <FlowStep step="3" text="递归探索" detail="backtrack(...)" />
              <div style={styles.flowArrow}>↓</div>
              <FlowStep step="4" text="回溯删除" detail="deleteCharAt" />
              <div style={styles.flowArrow}>↓</div>
              <FlowStep step="5" text="尝试添加 )" detail="if close < open" />
            </div>
          </div>

          {/* 树形理解 */}
          <div style={styles.modalSection}>
            <h3 style={styles.modalSectionTitle}>🌲 树形理解</h3>
            <div style={styles.treeExplain}>
              <p style={styles.treeText}>
                <strong>树的每一层</strong>代表一次决策：添加 ( 或 )
              </p>
              <p style={styles.treeText}>
                <strong>从根到叶子的路径</strong>就是一个括号组合
              </p>
              <p style={styles.treeText}>
                <strong>绿色叶子节点</strong>表示有效的括号组合
              </p>
            </div>
            
            <div style={styles.statsBox}>
              <div style={styles.statItem}>
                <span style={styles.statLabel}>n 值</span>
                <span style={styles.statValue}>{n}</span>
              </div>
              <div style={styles.statItem}>
                <span style={styles.statLabel}>有效组合数</span>
                <span style={styles.statValue}>{catalanNumber(n)}</span>
              </div>
              <div style={styles.statItem}>
                <span style={styles.statLabel}>字符串长度</span>
                <span style={styles.statValue}>{n * 2}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RuleItem({ 
  number, 
  title, 
  description, 
  condition, 
  color 
}: { 
  number: number; 
  title: string; 
  description: string; 
  condition: string;
  color: string;
}) {
  return (
    <div style={{
      ...styles.ruleItem,
      borderLeftColor: color,
    }}>
      <div style={styles.ruleHeader}>
        <span style={{
          ...styles.ruleNumber,
          backgroundColor: color
        }}>{number}</span>
        <span style={styles.ruleTitle}>{title}</span>
      </div>
      <p style={styles.ruleDesc}>{description}</p>
      <code style={styles.ruleCode}>{condition}</code>
    </div>
  );
}

function FlowStep({ 
  step, 
  text, 
  detail 
}: { 
  step: string; 
  text: string; 
  detail: string; 
}) {
  return (
    <div style={styles.flowStep}>
      <span style={styles.flowStepNum}>{step}</span>
      <div style={styles.flowStepContent}>
        <span style={styles.flowStepText}>{text}</span>
        <span style={styles.flowStepDetail}>{detail}</span>
      </div>
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

function getActionIcon(action: string): string {
  switch (action) {
    case 'add_left': return '➕';
    case 'add_right': return '➕';
    case 'complete': return '✅';
    case 'backtrack': return '↩️';
    default: return '▶️';
  }
}

function getActionText(action: string): string {
  switch (action) {
    case 'add_left': return '正在添加左括号 (';
    case 'add_right': return '正在添加右括号 )';
    case 'complete': return '找到有效组合！';
    case 'backtrack': return '回溯中...';
    default: return '执行中';
  }
}

function getActionColor(action: string): string {
  switch (action) {
    case 'add_left': return '#e3f2fd';
    case 'add_right': return '#e8f5e9';
    case 'complete': return '#fff3e0';
    case 'backtrack': return '#fff8e1';
    default: return '#f5f5f5';
  }
}
