import React from 'react';

export const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: '12px',
    backgroundColor: '#1e1e1e',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    fontFamily: 'Consolas, Monaco, "Courier New", monospace',
    fontSize: '12px',
    color: '#d4d4d4'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
    paddingBottom: '8px',
    borderBottom: '1px solid #333'
  },
  title: {
    margin: 0,
    fontSize: '13px',
    fontWeight: 600,
    color: '#569cd6',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  debugBadge: {
    fontSize: '10px',
    fontWeight: 500,
    color: '#fff',
    backgroundColor: '#d73a49',
    padding: '2px 6px',
    borderRadius: '3px',
    animation: 'pulse 1.5s infinite'
  },
  depth: {
    fontSize: '11px',
    fontWeight: 400,
    color: '#9cdcfe',
    backgroundColor: '#2d2d2d',
    padding: '2px 8px',
    borderRadius: '4px'
  },
  codeSection: {
    marginBottom: '12px'
  },
  code: {
    margin: 0,
    padding: 0,
    lineHeight: 1.5,
    overflow: 'auto',
    maxHeight: '200px'
  },
  line: {
    display: 'flex',
    alignItems: 'flex-start',
    padding: '1px 4px',
    borderRadius: '2px',
    transition: 'background-color 0.15s ease'
  },
  lineHighlighted: {
    backgroundColor: '#3c3c00',
    borderLeft: '3px solid #ffcc00'
  },
  lineNormal: {
    backgroundColor: 'transparent',
    borderLeft: '3px solid transparent'
  },
  lineNumber: {
    display: 'inline-block',
    width: '20px',
    color: '#858585',
    textAlign: 'right' as const,
    marginRight: '12px',
    userSelect: 'none' as const,
    flexShrink: 0
  },
  lineContent: {
    flex: 1,
    whiteSpace: 'pre'
  },
  breakpoint: {
    display: 'inline-block',
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#d73a49',
    marginRight: '4px',
    flexShrink: 0,
    marginTop: '4px'
  },
  breakpointEmpty: {
    display: 'inline-block',
    width: '8px',
    marginRight: '4px',
    flexShrink: 0
  },
  variablesSection: {
    borderTop: '1px solid #333',
    paddingTop: '8px'
  },
  variablesTitle: {
    fontSize: '11px',
    fontWeight: 600,
    color: '#4ec9b0',
    marginBottom: '6px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  variablesIcon: {
    fontSize: '12px'
  },
  variablesList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '4px'
  },
  variableRow: {
    display: 'flex',
    alignItems: 'center',
    padding: '3px 6px',
    backgroundColor: '#2d2d2d',
    borderRadius: '3px',
    fontSize: '11px'
  },
  variableName: {
    color: '#9cdcfe',
    marginRight: '4px',
    fontWeight: 500
  },
  variableEquals: {
    color: '#d4d4d4',
    marginRight: '4px'
  },
  variableValue: {
    color: '#ce9178'
  },
  variableValueNumber: {
    color: '#b5cea8'
  },
  variableValueString: {
    color: '#ce9178'
  },
  callStackSection: {
    borderTop: '1px solid #333',
    paddingTop: '8px',
    marginTop: '8px'
  },
  callStackTitle: {
    fontSize: '11px',
    fontWeight: 600,
    color: '#dcdcaa',
    marginBottom: '6px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  callStackList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '2px',
    maxHeight: '80px',
    overflow: 'auto'
  },
  callStackItem: {
    fontSize: '10px',
    padding: '2px 6px',
    backgroundColor: '#2d2d2d',
    borderRadius: '2px',
    color: '#d4d4d4',
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
  },
  callStackItemActive: {
    backgroundColor: '#3c3c00',
    borderLeft: '2px solid #ffcc00'
  },
  callStackArrow: {
    color: '#569cd6',
    fontSize: '8px'
  }
};
