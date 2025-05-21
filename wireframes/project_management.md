# Wireframe: Project Management

## 1. Overall Layout
(Inherits the application shell: Header, Sidebar from `dashboard.md`)

*   **Main Content Area Title:** "Project Management"

## 2. Core Components / Views

### 2.1. Project List View

*   **Purpose:** Display all projects, allow searching, filtering, and quick actions.
*   **Layout:**
    *   **Top Bar:**
        *   Search bar: "Search by project name, ID, manager..."
        *   Filter button: Opens a dropdown/modal with filter options (e.g., by Status (Planning, Active, On Hold, Completed), Priority, Project Manager, Date Range).
        *   "Create New Project" button (for authorized users, e.g., Project Managers).
    *   **Table/List Display:**
        *   Columns:
            *   Project Name (clickable, links to Detailed Project View)
            *   Project ID
            *   Project Manager
            *   Status (e.g., Planning, Active, On Hold, Completed, At Risk)
            *   Priority (e.g., 1-5)
            *   Start Date
            *   End Date (or Expected End Date)
            *   Overall Progress (e.g., progress bar based on task completion)
            *   Budget Health (e.g., icon: Green/Yellow/Red based on spent vs. budget)
            *   Actions (e.g., Edit (links to project edit), View Details, Quick Assign Resources)
        *   Pagination for large lists.
        *   Sortable columns.
*   **Interactions:**
    *   Clicking a project name navigates to its Detailed Project View.
    *   "Create New Project" button opens a form/modal for defining a new project (see 2.2.1).

### 2.2. Detailed Project View

*   **Purpose:** View and manage all aspects of a single project.
*   **Layout:** Tabbed interface or a dashboard-like layout for the project.
    *   **Header Section:**
        *   Project Name (Large font)
        *   Project ID, Status, Priority
        *   Key Dates (Start, End, Key Milestones upcoming)
        *   Project Manager
        *   "Edit Project Info" button.
        *   Quick summary widgets: Overall Progress (%), Budget Spent (%), Total Assigned Resources.
    *   **Tabs/Sections:**
        *   **A. Overview/Dashboard:** (Default Tab)
            *   Project Description/Scope.
            *   High-level timeline visualization (mini-Gantt or milestone tracker).
            *   Key Metrics: % Complete, Budget vs. Actual, Resource Burn Rate.
            *   Recent Activity / Notifications specific to this project.
        *   **B. Tasks & Timeline (PRD Lines 80-81, 83, 261-272):**
            *   **Task Breakdown Interface:**
                *   Hierarchical list/tree view of Phases, Deliverables, Tasks.
                *   Columns for tasks: Task Name, Assignee(s), Start Date, End Date, Duration, Status (To Do, In Progress, Blocked, Done), Estimated Hours, Actual Hours.
                *   "Add Phase", "Add Task" buttons.
                *   Drag-and-drop to reorder tasks or change dependencies (optional advanced feature).
                *   Task Dependencies: Visual lines or indicators showing predecessor/successor tasks.
            *   **Resource Requirement Definition (per task):**
                *   When creating/editing a task, a section to define:
                    *   Required Skills (Skill Name, Min Proficiency Level).
                    *   Quantity of resources needed for each skill.
                    *   Option: "Allow Double Booking" for this task (PRD Line 271).
            *   **Timeline View:**
                *   Full Gantt chart visualization of the project schedule (phases, tasks, dependencies, progress).
                *   Ability to adjust task durations/dates (with conflict warnings).
        *   **C. Resources (PRD Lines 273-279):**
            *   **Assigned Resources List:**
                *   Table: Resource Name, Task Assigned To, Role, Allocation (e.g., 20h/week or 50%), Start/End of assignment for this project.
                *   Link to resource's full profile.
                *   "Assign Resource" button (links to Scheduling Interface, pre-filtered for this project/tasks).
            *   **Resource Needs Overview:** Summary of total required skills/roles vs. filled.
        *   **D. Budget (PRD Lines 85-86, 253-256, 352):**
            *   **Budget Tracking Visualization:**
                *   Total Budget, Amount Spent, Amount Remaining.
                *   Charts: Burn-down/up chart for budget, cost breakdown by phase/task type.
                *   List of major expenses or cost entries (if applicable).
            *   "Edit Budget" / "Log Expense" functionality (role-dependent).
        *   **E. Documents & Links:**
            *   Area to attach/link to project briefs, design files, requirement docs (integrates with Cloud Storage).
        *   **F. Settings/Configuration:**
            *   Project Info (Name, Desc, Dates, PM, Priority).
            *   Notification preferences for this project.
            *   Access control (who can view/edit - future).

### 2.2.1. Create/Edit Project Form (Modal or Separate Page)

*   **Purpose:** Input all necessary information for a new project or edit an existing one.
*   **Layout:** Multi-step form or single page with clear sections.
    *   **Step 1: Basic Info (PRD Line 79):** Project Name, Description, Project Manager, Priority, Start/End Dates.
    *   **Step 2: Budget (PRD Line 85):** Initial budget allocation.
    *   **Step 3 (Optional at creation, can be done later): Initial Phases/Tasks (PRD Line 80).**
*   **Fields:** All editable fields from the project definition.
*   **Actions:** "Save Project", "Cancel".

## 3. Data Sources
*   Primarily the `projects/{projectId}` collection in Firestore.
*   Resource information linked from `resources` collection.
*   Scheduling data linked from `schedules` collection.

## 4. Key User Scenarios
*   Project Manager creates a new project, defining its scope, initial budget, and timeline.
*   Project Manager breaks down a project into phases and tasks, specifying skill requirements for each task.
*   Project Manager views the project dashboard to get a quick status update.
*   Project Manager updates task statuses and adjusts timelines as the project progresses.
*   Team Member views tasks assigned to them within a project.
*   Finance Team member reviews budget utilization for a project.
