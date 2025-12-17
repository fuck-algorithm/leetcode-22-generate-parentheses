import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { TreeNode } from '../types';
import { styles, NODE_COLORS, LINK_COLORS } from './TreeVisualization.styles';

interface TreeVisualizationProps {
  treeData: TreeNode | null;
  currentNodeId: string | null;
  width: number;
  height: number;
  currentAction?: string;
}

const NODE_RADIUS = 22;

export function TreeVisualization({ 
  treeData, 
  currentNodeId, 
  width, 
  height,
  currentAction 
}: TreeVisualizationProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const gRef = useRef<SVGGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current || !treeData) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // 添加渐变和滤镜定义
    const defs = svg.append('defs');
    
    // 发光效果滤镜
    const glowFilter = defs.append('filter')
      .attr('id', 'glow')
      .attr('x', '-50%')
      .attr('y', '-50%')
      .attr('width', '200%')
      .attr('height', '200%');
    
    glowFilter.append('feGaussianBlur')
      .attr('stdDeviation', '3')
      .attr('result', 'coloredBlur');
    
    const feMerge = glowFilter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // 箭头标记
    defs.append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '-0 -5 10 10')
      .attr('refX', 8)
      .attr('refY', 0)
      .attr('orient', 'auto')
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .append('path')
      .attr('d', 'M 0,-5 L 10,0 L 0,5')
      .attr('fill', '#2196F3');

    // 创建主组用于缩放/平移
    const g = svg.append('g');
    gRef.current = g.node();

    // 设置缩放行为
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    // 创建树布局
    const root = d3.hierarchy(treeData);
    const treeLayout = d3.tree<TreeNode>()
      .size([width - 100, height - 100])
      .separation((a, b) => (a.parent === b.parent ? 1.2 : 1.8));

    const treeData2 = treeLayout(root);
    const nodes = treeData2.descendants();
    const links = treeData2.links();

    // 居中树
    g.attr('transform', `translate(50, 50)`);

    // 绘制连线
    const linkGroup = g.append('g').attr('class', 'links');
    
    linkGroup.selectAll('.link')
      .data(links)
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('fill', 'none')
      .attr('stroke', d => getLinkColor(d, currentNodeId, currentAction))
      .attr('stroke-width', d => isLinkActive(d, currentNodeId) ? 3 : 2)
      .attr('stroke-dasharray', d => {
        if (currentAction === 'backtrack' && isLinkActive(d, currentNodeId)) {
          return '5,5';
        }
        return 'none';
      })
      .attr('d', d3.linkVertical<d3.HierarchyPointLink<TreeNode>, d3.HierarchyPointNode<TreeNode>>()
        .x(d => d.x)
        .y(d => d.y)
      )
      .style('transition', 'stroke 0.3s, stroke-width 0.3s');

    // 绘制节点
    const nodeGroup = g.append('g').attr('class', 'nodes');
    
    const nodeGroups = nodeGroup.selectAll('.node')
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${d.x}, ${d.y})`);

    // 节点外圈（用于动画效果）
    nodeGroups.append('circle')
      .attr('class', 'node-ring')
      .attr('r', NODE_RADIUS + 4)
      .attr('fill', 'none')
      .attr('stroke', d => {
        if (d.data.id === currentNodeId) {
          return currentAction === 'backtrack' ? '#FF9800' : '#2196F3';
        }
        return 'transparent';
      })
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', d => d.data.id === currentNodeId ? '4,4' : 'none')
      .style('animation', d => d.data.id === currentNodeId ? 'pulse 1s infinite' : 'none');

    // 节点主圆
    nodeGroups.append('circle')
      .attr('class', 'node-circle')
      .attr('r', NODE_RADIUS)
      .attr('fill', d => getNodeColor(d.data, currentNodeId, currentAction).fill)
      .attr('stroke', d => getNodeColor(d.data, currentNodeId, currentAction).stroke)
      .attr('stroke-width', d => d.data.id === currentNodeId ? 3 : 2)
      .attr('filter', d => d.data.id === currentNodeId ? 'url(#glow)' : 'none')
      .style('transition', 'fill 0.3s, stroke 0.3s');

    // 节点标签（括号字符）
    nodeGroups.append('text')
      .attr('class', 'node-label')
      .attr('dy', 5)
      .attr('text-anchor', 'middle')
      .attr('font-size', '18px')
      .attr('font-weight', 'bold')
      .attr('fill', d => getNodeColor(d.data, currentNodeId, currentAction).text)
      .text(d => d.data.value || 'ε');

    // 路径标签
    nodeGroups.filter(d => d.depth > 0)
      .append('text')
      .attr('class', 'path-label')
      .attr('y', -NODE_RADIUS - 8)
      .attr('text-anchor', 'middle')
      .attr('font-size', '10px')
      .attr('fill', d => {
        if (d.data.id === currentNodeId) return '#1976d2';
        if (d.data.status === 'complete' || d.data.status === 'valid') return '#2E7D32';
        return '#666';
      })
      .attr('font-weight', d => d.data.id === currentNodeId ? 'bold' : 'normal')
      .text(d => d.data.path);

    // 状态指示器（小图标）
    nodeGroups.filter(d => d.data.status === 'complete' || d.data.status === 'valid')
      .append('text')
      .attr('class', 'status-icon')
      .attr('x', NODE_RADIUS - 5)
      .attr('y', -NODE_RADIUS + 5)
      .attr('font-size', '12px')
      .text('✓');

    // 自动适应视图
    const bounds = g.node()?.getBBox();
    if (bounds) {
      const fullWidth = bounds.width + 100;
      const fullHeight = bounds.height + 100;
      const scale = Math.min(width / fullWidth, height / fullHeight, 1);
      const translateX = (width - fullWidth * scale) / 2 - bounds.x * scale;
      const translateY = (height - fullHeight * scale) / 2 - bounds.y * scale;
      
      svg.call(zoom.transform, d3.zoomIdentity.translate(translateX, translateY).scale(scale));
    }
  }, [treeData, currentNodeId, width, height, currentAction]);

  if (!treeData) {
    return (
      <div style={styles.placeholder}>
        请输入 n 值并点击"生成"开始可视化
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <svg
        ref={svgRef}
        width={width}
        height={height}
        style={styles.svg}
      />
      
      {/* 图例 */}
      <div style={styles.legend}>
        <div style={styles.legendTitle}>节点状态</div>
        <LegendItem color={NODE_COLORS.exploring.fill} label="当前节点" />
        <LegendItem color={NODE_COLORS.valid.fill} label="有效路径" />
        <LegendItem color={NODE_COLORS.backtracking.fill} label="正在回溯" />
        <LegendItem color={NODE_COLORS.backtracked.fill} label="已回溯" />
        <LegendItem color={NODE_COLORS.pending.fill} label="待探索" />
      </div>

      {/* 当前动作指示器 */}
      {currentAction && (
        <div style={{
          ...styles.actionIndicator,
          backgroundColor: getActionColor(currentAction)
        }}>
          <span>{getActionIcon(currentAction)}</span>
          <span>{getActionLabel(currentAction)}</span>
        </div>
      )}

      {/* CSS动画 */}
      <style>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
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

function getNodeColor(node: TreeNode, currentNodeId: string | null, currentAction?: string) {
  if (node.id === currentNodeId) {
    if (currentAction === 'backtrack') {
      return NODE_COLORS.backtracking;
    }
    if (currentAction === 'complete') {
      return NODE_COLORS.valid;
    }
    return NODE_COLORS.exploring;
  }
  
  if (node.status === 'complete' || node.status === 'valid') {
    return NODE_COLORS.valid;
  }
  
  if (node.status === 'pruned') {
    return NODE_COLORS.pruned;
  }
  
  // 已经被访问过但不是当前节点
  if (node.status === 'exploring') {
    return NODE_COLORS.backtracked;
  }
  
  return NODE_COLORS.pending;
}

function getLinkColor(
  link: d3.HierarchyPointLink<TreeNode>, 
  currentNodeId: string | null,
  currentAction?: string
): string {
  const targetNode = link.target.data;
  
  if (targetNode.id === currentNodeId) {
    if (currentAction === 'backtrack') {
      return LINK_COLORS.backtracking;
    }
    return LINK_COLORS.active;
  }
  
  if (targetNode.status === 'complete' || targetNode.status === 'valid') {
    return LINK_COLORS.valid;
  }
  
  return LINK_COLORS.default;
}

function isLinkActive(link: d3.HierarchyPointLink<TreeNode>, currentNodeId: string | null): boolean {
  return link.target.data.id === currentNodeId;
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

function getActionLabel(action: string): string {
  switch (action) {
    case 'add_left': return '添加左括号 (';
    case 'add_right': return '添加右括号 )';
    case 'complete': return '找到有效组合！';
    case 'backtrack': return '回溯中...';
    default: return '执行中';
  }
}

function getActionColor(action: string): string {
  switch (action) {
    case 'add_left': return 'rgba(33, 150, 243, 0.95)';
    case 'add_right': return 'rgba(33, 150, 243, 0.95)';
    case 'complete': return 'rgba(76, 175, 80, 0.95)';
    case 'backtrack': return 'rgba(255, 152, 0, 0.95)';
    default: return 'rgba(33, 150, 243, 0.95)';
  }
}
