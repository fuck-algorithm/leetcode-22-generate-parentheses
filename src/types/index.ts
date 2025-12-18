// Tree Node representing a state in the backtracking tree
export interface TreeNode {
  id: string;
  value: string;           // Current bracket character '(' or ')'
  path: string;            // Full path from root to current node
  children: TreeNode[];
  status: 'pending' | 'exploring' | 'valid' | 'pruned' | 'complete';
  leftRemaining: number;
  rightRemaining: number;
  annotation?: string;     // Node annotation text (e.g., "L:2 R:3")
  pruneReason?: string;    // Reason for pruning (only when status is 'pruned')
}

// Edge label for tree visualization
export interface EdgeLabel {
  sourceId: string;        // Parent node ID
  targetId: string;        // Child node ID
  label: string;           // Edge label (e.g., "添加 (" or "添加 )")
}

// Variables state for debugger panel (used in GenerationStep)
export interface StepVariables {
  current: string;           // StringBuilder current value
  open: number;              // Used left brackets count
  close: number;             // Used right brackets count
  max: number;               // n value
  resultSnapshot: string[];  // Current result list snapshot
}

// Type for tracking which variable changed
export type ChangedVariable = 'current' | 'open' | 'close' | 'result' | null;

// Variables state for CodePanel display
export interface VariablesState {
  currentString: string;      // Current StringBuilder value
  leftCount: number;          // Remaining left brackets (open)
  rightCount: number;         // Remaining right brackets (close)
  resultList: string[];       // Result ArrayList
  n: number;                  // Input n value
  callStackDepth: number;     // Current recursion depth
  changedVariable: ChangedVariable;  // Recently changed variable for highlighting
}

// A single step in the generation process
export interface GenerationStep {
  id: string;
  action: 'add_left' | 'add_right' | 'backtrack' | 'complete';
  currentString: string;
  leftRemaining: number;
  rightRemaining: number;
  nodeId: string;
  parentNodeId: string | null;
  isValid: boolean;
  codeLine: number;
  callStackDepth: number;
  // Enhanced variables for debugger panel
  variables: StepVariables;
  changedVariable: ChangedVariable;
}

// Animation state
export interface AnimationState {
  isPlaying: boolean;
  isPaused: boolean;
  currentStepIndex: number;
  totalSteps: number;
  speed: number;           // milliseconds between steps
}

// Generation history
export interface GenerationHistory {
  n: number;
  steps: GenerationStep[];
  results: string[];
  startTime: number;
  endTime: number | null;
}

// Validation result
export interface ValidationResult {
  isValid: boolean;
  error?: string;
}
