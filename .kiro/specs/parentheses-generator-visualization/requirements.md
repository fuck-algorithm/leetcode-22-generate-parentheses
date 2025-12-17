# Requirements Document

## Introduction

本项目是一个基于 TypeScript + React + D3.js 的单页面应用，用于可视化展示"括号生成"算法（LeetCode 第22题）的解题过程。该应用通过动画演示回溯算法如何逐步生成所有有效的括号组合，帮助用户理解算法的执行流程和决策过程。

## Glossary

- **Parentheses_Generator**: 括号生成器系统，负责生成和可视化有效括号组合的核心应用
- **Valid_Parentheses**: 有效括号组合，指左右括号数量相等且任意前缀中左括号数量不少于右括号数量的字符串
- **Backtracking_Tree**: 回溯树，表示算法探索所有可能路径的树形结构
- **Animation_Controller**: 动画控制器，负责管理动画播放、暂停、步进等操作的组件
- **Tree_Node**: 树节点，回溯树中的单个节点，包含当前括号字符串状态
- **Generation_Step**: 生成步骤，算法执行过程中的单个操作（添加左括号或右括号）

## Requirements

### Requirement 1

**User Story:** As a user, I want to input a number n to specify how many pairs of parentheses to generate, so that I can explore different problem sizes.

#### Acceptance Criteria

1. WHEN the user enters a value for n THEN the Parentheses_Generator SHALL accept integer values between 1 and 8 inclusive
2. WHEN the user enters a value outside the valid range THEN the Parentheses_Generator SHALL display an error message and prevent generation
3. WHEN the user submits a valid n value THEN the Parentheses_Generator SHALL reset any previous visualization and prepare for new generation

### Requirement 2

**User Story:** As a user, I want to see the backtracking tree structure visualized, so that I can understand how the algorithm explores different paths.

#### Acceptance Criteria

1. WHEN the algorithm starts THEN the Parentheses_Generator SHALL display a root node representing the empty string state
2. WHEN a new bracket is added during generation THEN the Parentheses_Generator SHALL create a child node connected to its parent with an edge
3. WHEN displaying the tree THEN the Parentheses_Generator SHALL use D3.js to render nodes and edges with clear visual hierarchy
4. WHEN a path leads to a valid complete combination THEN the Parentheses_Generator SHALL highlight that leaf node with a distinct success color
5. WHEN a path is pruned (invalid) THEN the Parentheses_Generator SHALL indicate the pruned state with a distinct visual style

### Requirement 3

**User Story:** As a user, I want to control the animation playback, so that I can learn at my own pace.

#### Acceptance Criteria

1. WHEN the user clicks the play button THEN the Animation_Controller SHALL start automatic step-by-step animation
2. WHEN the user clicks the pause button THEN the Animation_Controller SHALL pause the animation at the current step
3. WHEN the user clicks the step forward button THEN the Animation_Controller SHALL advance exactly one Generation_Step
4. WHEN the user clicks the reset button THEN the Animation_Controller SHALL return the visualization to the initial state
5. WHEN the user adjusts the speed slider THEN the Animation_Controller SHALL modify the animation interval between 100ms and 2000ms

### Requirement 4

**User Story:** As a user, I want to see the current state of the algorithm, so that I can understand what decision is being made at each step.

#### Acceptance Criteria

1. WHEN a Generation_Step occurs THEN the Parentheses_Generator SHALL display the current partial string being built
2. WHEN a Generation_Step occurs THEN the Parentheses_Generator SHALL show the count of remaining left and right brackets
3. WHEN a valid combination is completed THEN the Parentheses_Generator SHALL add it to a visible results list
4. WHEN the algorithm completes THEN the Parentheses_Generator SHALL display the total count of valid combinations found

### Requirement 5

**User Story:** As a user, I want the application to fit on a single screen without scrolling, so that I can see all information at once.

#### Acceptance Criteria

1. WHEN the application loads THEN the Parentheses_Generator SHALL render all components within the viewport height
2. WHEN the browser window is resized THEN the Parentheses_Generator SHALL adjust the tree visualization to fit within available space
3. WHEN the tree grows large THEN the Parentheses_Generator SHALL apply zoom and pan capabilities to navigate the visualization

### Requirement 6

**User Story:** As a user, I want to see the algorithm code alongside the visualization, so that I can correlate the animation with the actual implementation.

#### Acceptance Criteria

1. WHEN the visualization is displayed THEN the Parentheses_Generator SHALL show the backtracking algorithm pseudocode in a code panel
2. WHEN a Generation_Step executes THEN the Parentheses_Generator SHALL highlight the corresponding line in the code panel
3. WHEN the algorithm makes a recursive call THEN the Parentheses_Generator SHALL visually indicate the call stack depth

