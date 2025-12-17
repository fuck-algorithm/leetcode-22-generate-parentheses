import React from 'react';

export const styles: Record<string, React.CSSProperties> = {
  container: {
    position: 'relative' as const,
    width: '100%',
    height: '100%'
  },
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
  },
  legend: {
    position: 'absolute' as const,
    top: '10px',
    right: '10px',
    backgroundColor: 'rgba(255,255,255,0.95)',
    padding: '8px 12px',
    borderRadius: '6px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    fontSize: '11px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '4px',
    zIndex: 10
  },
  legendTitle: {
    fontWeight: 600,
    marginBottom: '4px',
    color: '#333'
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  legendDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%'
  },
  actionIndicator: {
    position: 'absolute' as const,
    bottom: '10px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: 'rgba(33, 150, 243, 0.95)',
    color: '#fff',
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: 500,
    boxShadow: '0 2px 8px rgba(33, 150, 243, 0.3)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    zIndex: 10
  }
};

// 节点颜色配置
export const NODE_COLORS = {
  pending: {
    fill: '#e0e0e0',
    stroke: '#bdbdbd',
    text: '#666'
  },
  exploring: {
    fill: '#2196F3',
    stroke: '#1565C0',
    text: '#fff'
  },
  valid: {
    fill: '#4CAF50',
    stroke: '#2E7D32',
    text: '#fff'
  },
  complete: {
    fill: '#4CAF50',
    stroke: '#2E7D32',
    text: '#fff'
  },
  backtracking: {
    fill: '#FF9800',
    stroke: '#EF6C00',
    text: '#fff'
  },
  backtracked: {
    fill: '#9E9E9E',
    stroke: '#757575',
    text: '#fff'
  },
  pruned: {
    fill: '#f44336',
    stroke: '#c62828',
    text: '#fff'
  }
};

// 连线颜色配置
export const LINK_COLORS = {
  default: '#ccc',
  active: '#2196F3',
  valid: '#4CAF50',
  backtracking: '#FF9800'
};
