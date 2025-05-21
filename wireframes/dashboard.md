# Wireframe: Dashboard

## 1. Overall Layout (Shell)

(Based on `sample_wireframe.md` and common application design)

*   **Header:**
    *   **Logo:** "Plannar" text and icon (e.g., calendar icon). Links to Dashboard home.
    *   **Global Search Bar:** Placeholder "Search resources, projects, skills...". Autocomplete suggestions. Results page TBD.
    *   **Notifications Icon:** Bell icon with a badge for unread notifications. Clicking opens a dropdown list of recent notifications (e.g., conflicts, deadlines, new assignments). Link to a full "All Notifications" page.
    *   **User Profile Icon & Name:** User avatar/initials and name. Clicking opens a dropdown with links to "Profile", "Settings", "Help Center", "Sign Out".

*   **Sidebar (Vertical Navigation):**
    *   Collapsible.
    *   Navigation Links (Icon and Text):
        *   Dashboard (Home/Overview)
        *   Resource Management
        *   Project Management
        *   Scheduling
        *   Reports & Analytics
        *   AI Recommendation Center
        *   Settings (Admin only, TBD)

*   **Main Content Area:**
    *   Page title (e.g., "Dashboard").
    *   Grid-based layout for widgets. Responsive design for different screen sizes. Widgets can be rearranged by user (optional future feature).

## 2. Dashboard Widgets

### 2.1. Resource Utilization Overview

*   **Title:** Resource Utilization
*   **Type:** Donut Chart (similar to `sample_wireframe.md`)
*   **Data Displayed:**
    *   Percentage and count of resources:
        *   Allocated
        *   Available
        *   On Leave
        *   Training/Onboarding
*   **Source of Data:** Aggregated from `Resources` collection (availability status, assignments).
*   **Interactions:**
    *   Hover over a segment: Show tooltip with exact count and percentage.
    *   Click on a segment: Navigate to the Resource Management screen, pre-filtered by the selected status (e.g., clicking "Allocated" shows a list of all currently allocated resources).
*   **Appearance:** Clear labels, distinct colors for each segment. Legend below the chart.

### 2.2. Project Status Summary

*   **Title:** Project Status
*   **Type:** Section with a list of compact project cards (e.g., 3-5 projects).
*   **Data Displayed per Project Card:**
    *   Project Name (clickable link)
    *   Status Indicator (e.g., color-coded dot or tag: On Track, At Risk, Delayed, Completed)
    *   Key Metric: e.g., % tasks completed or progress towards deadline.
    *   (Optional) Assigned Project Manager.
*   **Source of Data:** `Projects` collection (info, phases, tasks status).
*   **Interactions:**
    *   Click Project Name: Navigate to the detailed Project Management view for that project.
    *   "View All Projects" link: Navigates to the main Project Management list view.
*   **Sorting/Filtering:** Default to highest priority active projects or most recently updated.

### 2.3. Upcoming Deadlines

*   **Title:** Upcoming Deadlines
*   **Type:** List view.
*   **Data Displayed per Item:**
    *   Task Name / Milestone Name
    *   Associated Project Name
    *   Due Date (e.g., "In 3 days", "June 15, 2025")
    *   (Optional) Assignee if a specific task.
*   **Source of Data:** `Projects` collection (task end dates, milestone dates).
*   **Interactions:**
    *   Click on an item: Navigate to the specific task or milestone details within its project view.
    *   "View Full Calendar/Schedule" link: Navigates to a more comprehensive calendar or scheduling view.
*   **Sorting:** Chronological by due date (soonest first). Show next 5-7 deadlines.

### 2.4. Potential Conflicts Requiring Attention

*   **Title:** Alerts & Conflicts
*   **Type:** List of alert items, prominently displayed if critical.
*   **Data Displayed per Item:**
    *   Icon indicating severity/type (e.g., warning triangle for conflict).
    *   Brief Description: e.g., "Resource John Doe over-allocated on May 28th." or "Project Alpha: Task 'Design Mockups' blocked by 'User Research'."
    *   Timestamp or "New" indicator.
*   **Source of Data:** System-generated alerts from scheduling logic, dependency checks.
*   **Interactions:**
    *   Click on an alert: Navigate to the relevant screen to resolve/view details (e.g., Scheduling Interface focused on John Doe's schedule for May 28th, or Project Alpha's task board).
    *   "Dismiss" option for some alerts (if applicable).
    *   "View All Alerts" link.
*   **Appearance:** Use distinct colors for severity (e.g., red for critical, orange for warning).

### 2.5. Budget Status Indicators

*   **Title:** Project Budget Overview
*   **Type:** Grouped Bar Chart (similar to `sample_wireframe.md`) or individual progress bars per project.
*   **Data Displayed (per project or overall):**
    *   Project Name
    *   Budgeted Amount vs. Actual Spent (as values and/or percentage).
    *   Visual indicator of budget health (e.g., green/yellow/red).
*   **Source of Data:** `Projects` collection (budget fields).
*   **Interactions:**
    *   Hover over bar/segment: Show tooltip with exact figures (Budgeted, Spent, Remaining).
    *   Click on a project's budget: Navigate to the detailed budget view for that project (in Project Management or Reports).
    *   "View Full Budget Report" link: Navigates to the main budget reporting section.

### 2.6. (Optional/Consideration) Skill Coverage Chart

*   **Title:** Team Skill Coverage (or similar)
*   **Type:** Heatmap (as in `sample_wireframe.md`)
*   **Data Displayed:** Teams/Departments vs. Key Skills, with cell values indicating proficiency level or resource count.
*   **Purpose:** Provides a quick overview of skill strengths and potential gaps.
*   **Placement:** Could be on Dashboard for managers, or more detailed in Resource Management or Reports.

### 2.7. (Optional/Consideration) Project Timeline Overview

*   **Title:** Active Project Timelines
*   **Type:** Simplified Gantt-style bar chart (as in `sample_wireframe.md`)
*   **Data Displayed:** Key active projects and their current phase or overall timeline against a calendar axis.
*   **Purpose:** Quick visual of project progress and overlaps.
*   **Placement:** Could be on Dashboard for PMs, or more detailed in Project Management.
