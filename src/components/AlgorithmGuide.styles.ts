import React from 'react';

export const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: '12px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    marginBottom: '12px'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
    userSelect: 'none'
  },
  title: {
    margin: 0,
    fontSize: '14px',
    fontWeight: 600,
    color: '#333',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  toggleIcon: {
    fontSize: '12px',
    color: '#666',
    transition: 'transform 0.2s'
  },
  content: {
    marginTop: '12px',
    fontSize: '13px',
    lineHeight: 1.6,
    color: '#444'
  },
  section: {
    marginBottom: '12px'
  },
  sectionTitle: {
    fontWeight: 600,
    color: '#1976d2',
    marginBottom: '6px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  paragraph: {
    margin: '0 0 8px 0',
    paddingLeft: '4px'
  },
  highlight: {
    backgroundColor: '#e3f2fd',
    padding: '2px 6px',
    borderRadius: '3px',
    fontFamily: 'Consolas, Monaco, monospace',
    fontSize: '12px'
  },
  keyPoint: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '8px',
    padding: '8px',
    backgroundColor: '#f5f5f5',
    borderRadius: '6px',
    marginBottom: '8px'
  },
  keyPointIcon: {
    fontSize: '14px',
    flexShrink: 0
  },
  keyPointText: {
    flex: 1
  },
  formula: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    backgroundColor: '#fff3e0',
    borderRadius: '6px',
    fontFamily: 'Consolas, Monaco, monospace',
    fontSize: '12px',
    marginTop: '8px'
  },
  stepsContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '6px'
  },
  step: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '8px',
    padding: '6px 8px',
    backgroundColor: '#f9f9f9',
    borderRadius: '4px',
    borderLeft: '3px solid #1976d2'
  },
  stepNumber: {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    backgroundColor: '#1976d2',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '11px',
    fontWeight: 600,
    flexShrink: 0
  },
  stepText: {
    flex: 1,
    fontSize: '12px'
  },
  legendContainer: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '8px',
    marginTop: '8px'
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '11px',
    padding: '4px 8px',
    backgroundColor: '#f5f5f5',
    borderRadius: '4px'
  },
  legendDot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%'
  }
};
