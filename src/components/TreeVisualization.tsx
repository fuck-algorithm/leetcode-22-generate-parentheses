import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { TreeNode } from '../types';

interface TreeVisualizationProps {
  treeData: TreeNode | null;
  currentNodeId: string | null;
  width: number;
  height: number;
}

const NODE_RADIUS = 20;
const COLORS = {
  pending: '#e0e0e0',
  exploring: '#2196F3',
  valid: '#4CAF50',
  pruned: '#f44336',
  complete: '#4CAF50'
};

export function TreeVisualization({ treeData, currentNodeId, width, height }: TreeVisualizationProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const gRef = useRef<SVGGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current || !treeData) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Create main group for zoom/pan
    const g = svg.append('g');
    gRef.current = g.node();

    // Set up zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    // Create tree layout
    const root = d3.hierarchy(treeData);
    const treeLayout = d3.tree<TreeNode>()
      .size([width - 100, height - 100])
      .separation((a, b) => (a.parent === b.parent ? 1 : 1.5));

    const treeData2 = treeLayout(root);
    const nodes = treeData2.descendants();
    const links = treeData2.links();

    // Center the tree
    g.attr('transform', `translate(50, 50)`);

    // Draw links
    g.selectAll('.link')
      .data(links)
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('fill', 'none')
      .attr('stroke', '#ccc')
      .attr('stroke-width', 2)
      .attr('d', d3.linkVertical<d3.HierarchyPointLink<TreeNode>, d3.HierarchyPointNode<TreeNode>>()
        .x(d => d.x)
        .y(d => d.y)
      );

    // Draw nodes
    const nodeGroups = g.selectAll('.node')
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${d.x}, ${d.y})`);

    // Node circles
    nodeGroups.append('circle')
      .attr('r', NODE_RADIUS)
      .attr('fill', d => {
        if (d.data.id === currentNodeId) return COLORS.exploring;
        return COLORS[d.data.status] || COLORS.pending;
      })
      .attr('stroke', d => d.data.id === currentNodeId ? '#1565C0' : '#999')
      .attr('stroke-width', d => d.data.id === currentNodeId ? 3 : 1);

    // Node labels (bracket character)
    nodeGroups.append('text')
      .attr('dy', 5)
      .attr('text-anchor', 'middle')
      .attr('font-size', '16px')
      .attr('font-weight', 'bold')
      .attr('fill', d => {
        const status = d.data.id === currentNodeId ? 'exploring' : d.data.status;
        return status === 'pending' ? '#666' : '#fff';
      })
      .text(d => d.data.value || 'ε');

    // Path labels on edges
    g.selectAll('.path-label')
      .data(nodes.filter(d => d.depth > 0))
      .enter()
      .append('text')
      .attr('class', 'path-label')
      .attr('x', d => d.x)
      .attr('y', d => d.y - NODE_RADIUS - 5)
      .attr('text-anchor', 'middle')
      .attr('font-size', '10px')
      .attr('fill', '#666')
      .text(d => d.data.path);

    // Auto-fit view
    const bounds = g.node()?.getBBox();
    if (bounds) {
      const fullWidth = bounds.width + 100;
      const fullHeight = bounds.height + 100;
      const scale = Math.min(width / fullWidth, height / fullHeight, 1);
      const translateX = (width - fullWidth * scale) / 2 - bounds.x * scale;
      const translateY = (height - fullHeight * scale) / 2 - bounds.y * scale;
      
      svg.call(zoom.transform, d3.zoomIdentity.translate(translateX, translateY).scale(scale));
    }
  }, [treeData, currentNodeId, width, height]);

  if (!treeData) {
    return (
      <div style={styles.placeholder}>
        请输入 n 值并点击"生成"开始可视化
      </div>
    );
  }

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      style={styles.svg}
    />
  );
}

const styles: Record<string, React.CSSProperties> = {
  svg: {
    backgroundColor: '#fafafa',
    borderRadius: '8px'
  },
  placeholder: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    color: '#999',
    fontSize: '14px',
    backgroundColor: '#fafafa',
    borderRadius: '8px'
  }
};
