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

### Requirement 7

**User Story:** As a user, I want to see explanatory text labels on nodes and edges, so that I can better understand the algorithm decision process at each step.

#### Acceptance Criteria

1. WHEN a node is displayed THEN the Parentheses_Generator SHALL show a brief annotation above the node indicating the current state (remaining left/right bracket counts)
2. WHEN an edge connects two nodes THEN the Parentheses_Generator SHALL display a label on the edge indicating the action taken (add left bracket or add right bracket)
3. WHEN the current node is being explored THEN the Parentheses_Generator SHALL highlight the annotation text to draw user attention
4. WHEN a node represents a pruned path THEN the Parentheses_Generator SHALL display a brief explanation of why the path was pruned
5. WHEN a node represents a valid complete combination THEN the Parentheses_Generator SHALL display a success indicator annotation

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

**User Story:** As a user, I want to see the Java algorithm code in a large right-side panel with debugging effects, so that I can understand the code execution like using a real debugger.

#### Acceptance Criteria

1. WHEN the visualization is displayed THEN the Parentheses_Generator SHALL show a prominently sized code panel on the right side occupying at least 30% of the screen width
2. WHEN the visualization is displayed THEN the Parentheses_Generator SHALL display the complete Java solution code for the parentheses generation problem with syntax highlighting
3. WHEN a Generation_Step executes THEN the Parentheses_Generator SHALL highlight the currently executing line with a distinct background color simulating debugger breakpoint style
4. WHEN the algorithm state changes THEN the Parentheses_Generator SHALL display a variables panel showing current memory values including the current string, left count, right count, and result list
5. WHEN the highlighted line changes THEN the Parentheses_Generator SHALL update the variables panel to reflect the exact state at that execution point
6. WHEN the algorithm makes a recursive call THEN the Parentheses_Generator SHALL visually indicate the call stack depth in the variables panel
7. WHEN the user steps through the algorithm THEN the Parentheses_Generator SHALL synchronize the code line highlight with the corresponding tree node highlight



### Requirement 8

**User Story:** As a user, I want to see a dedicated variables watch panel that displays memory values in real-time, so that I can understand how data changes during algorithm execution.

#### Acceptance Criteria

1. WHEN the code panel is displayed THEN the Parentheses_Generator SHALL include a variables watch section below or beside the code
2. WHEN displaying variables THEN the Parentheses_Generator SHALL show the current StringBuilder or String value being constructed
3. WHEN displaying variables THEN the Parentheses_Generator SHALL show the remaining left bracket count (open) as a numeric value
4. WHEN displaying variables THEN the Parentheses_Generator SHALL show the remaining right bracket count (close) as a numeric value
5. WHEN displaying variables THEN the Parentheses_Generator SHALL show the result ArrayList with all completed valid combinations found so far
6. WHEN a variable value changes THEN the Parentheses_Generator SHALL briefly highlight the changed variable to draw user attention
7. WHEN the recursion depth changes THEN the Parentheses_Generator SHALL display the current call stack depth as a visual indicator
