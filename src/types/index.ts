// Tree Node representing a state in the backtracking tree
export interface TreeNode {
  id: string;
  value: string;           // Current bracket character '(' or ')'
  path: string;            // Full path from root to current node
  children: TreeNode[];
  status: 'pending' | 'exploring' | 'valid' | 'pruned' | 'complete';
  leftRemaining: number;
  rightRemaining: number;
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
