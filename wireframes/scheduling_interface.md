# Wireframe: Scheduling Interface

## 1. Overall Layout
(Inherits the application shell: Header, Sidebar from `dashboard.md`)

*   **Main Content Area Title:** "Scheduler" or "Resource Schedule"

## 2. Core Components / Views

### 2.1. Main Scheduling View

*   **Purpose:** Visualize resource schedules, make assignments, identify and resolve conflicts.
*   **Layout:** A highly interactive, multi-pane view.
    *   **Top Control Bar:**
        *   **View Toggle:** Buttons for Day, Week, Month, Timeline views.
        *   **Date Navigation:** Arrows for previous/next period, Date Picker to jump to a specific date.
        *   **Filter Panel Toggle:** Button to show/hide a filter sidebar/panel.
            *   **Filters:** By Resource (select multiple, search), by Project (select multiple), by Skill, by Team/Department (if applicable).
        *   **Zoom Control (for Timeline view):** Zoom in/out on the timeline granularity.
        *   **"Find Available Slot" / "Suggest Resource" Button:** (AI-assisted feature placeholder).
    *   **Main Display Area (changes based on View Toggle):**
        *   **A. Calendar View (Day/Week/Month - PRD Line 355):**
            *   Layout: Similar to Google Calendar or Outlook Calendar.
            *   Rows/Columns: Days of the week/month. Time slots (e.g., 30-minute increments as per PRD Line 102).
            *   Content: Scheduled items (tasks, meetings, time off) displayed as blocks within time slots for selected resources.
                *   Block details: Project Name, Task Name. Color-coded by project or type.
                *   Resource names might be shown if viewing multiple resources in a combined calendar.
            *   Interaction:
                *   Click on an empty slot: Option to "Create New Assignment" / "Block Time".
                *   Click on an existing block: Show details in a popover/sidebar (Project, Task, Duration, Assigned Resource), options to Edit/Delete/Reschedule.
                *   **Drag-and-drop assignment capability (PRD Line 357):** Drag existing assignments to reschedule, or drag tasks from a pending list (see 2.2) onto the calendar.
        *   **B. Resource Allocation Timeline View (PRD Line 356):**
            *   Layout: Horizontal timeline.
            *   Rows: Individual Resources (filtered list).
            *   Columns: Time (Days, Weeks, Months - zoomable).
            *   Content: Bars representing assigned tasks/projects for each resource along the timeline.
                *   Bar details: Project Name, Task Name. Color-coded.
                *   Show resource capacity/utilization (e.g., background shading if overallocated).
            *   Interaction:
                *   Hover over a bar: Tooltip with full details.
                *   Click a bar: Edit assignment details.
                *   Drag-and-drop to adjust start/end dates or reassign (with conflict checks).
                *   Ability to draw new assignment bars directly on the timeline for a resource.
    *   **Conflict Highlighting (PRD Line 358):**
        *   Visual cues (e.g., red borders, warning icons, shaded areas) for:
            *   Double-bookings (PRD Line 106 - with exceptions).
            *   Exceeding max assignments per person (PRD Line 105).
            *   Exceeding max hours per day for a resource.
            *   Assignments outside a resource's standard availability (unless overtime is permitted).
            *   Task dependency violations (if a task is scheduled before its prerequisite).
        *   A dedicated "Conflicts Panel" might list all current conflicts in the view with links to resolve.

### 2.2. Unassigned Tasks / Assignment Pool Panel (Optional Sidebar/Pane)

*   **Purpose:** List tasks that need to be assigned, to facilitate drag-and-drop scheduling.
*   **Layout:** A collapsible panel or a section of the screen.
*   **Content:**
    *   List of tasks from selected projects that are unassigned or pending assignment.
    *   Task details: Task Name, Project, Required Skills, Estimated Hours.
    *   Filter/Sort options for this list.
*   **Interaction:**
    *   Drag a task from this pool onto a resource's slot in the Calendar/Timeline view to create an assignment.
    *   System can suggest best-matched resources when a task is selected (AI feature).

### 2.3. Assignment Modal/Form

*   **Purpose:** Create or edit a specific assignment in detail.
*   **Triggered by:** Clicking an empty slot, dragging a task, or editing an existing assignment.
*   **Fields:**
    *   Project (dropdown, pre-filled if context available)
    *   Task (dropdown, filtered by project, pre-filled if context available)
    *   Resource (dropdown, searchable, shows availability indicators, pre-filled if context available)
    *   Start Date & Time
    *   End Date & Time (or Duration, auto-calculated)
    *   Allocated Hours (if different from task duration for this assignment)
    *   Type (Regular, Overtime - PRD Line 292)
    *   Notes
*   **Information Displayed:**
    *   Resource's current availability for the selected period.
    *   Skill match percentage (if task and resource selected).
    *   Cost implication of the assignment (PRD Line 107).
    *   Conflict warnings if the proposed assignment creates issues.
*   **Actions:** "Save Assignment", "Cancel", "Delete Assignment" (if editing).

## 3. Data Sources
*   `schedules/{scheduleId}` collection for individual time blocks and assignments.
*   `projects/{projectId}` for task details, required skills, project timelines.
*   `resources/{resourceId}` for availability, skills, rates, assignment constraints.

## 4. Key User Scenarios
*   Project Manager needs to assign a new task to an available, skilled resource.
*   Project Manager views the team's schedule for next week to plan workload.
*   Resource Manager checks a specific resource's schedule for potential over-allocation.
*   Project Manager needs to reschedule a task due to a delay and sees the impact on resource availability.
*   User drags a task from an "unassigned" pool to a resource on the timeline.
*   System highlights a conflict when an assignment would double-book a resource.
