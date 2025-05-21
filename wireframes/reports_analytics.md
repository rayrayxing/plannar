# Wireframe: Reports & Analytics

## 1. Overall Layout
(Inherits the application shell: Header, Sidebar from `dashboard.md`)

*   **Main Content Area Title:** "Reports & Analytics"

## 2. Core Components / Views

### 2.1. Reports Dashboard / Landing Page

*   **Purpose:** Provide access to standard reports and the custom report builder.
*   **Layout:**
    *   **Top Section:** "Create Custom Report" button/link prominently displayed.
    *   **Categorized Links/Cards to Standard Reports:**
        *   **Resource-Focused Reports:**
            *   Resource Utilization Report
            *   Skill Distribution & Gap Analysis
            *   Capacity Forecasting
            *   Individual Resource Performance (placeholder for future)
        *   **Project-Focused Reports:**
            *   Project Cost Analysis (Planned vs. Actual)
            *   Project Status & Progress Summary
            *   Project Timeline Adherence
        *   **Financial Reports:**
            *   Overall Cost Dashboards
            *   Billing/Rate Analysis (if applicable)
    *   **(Optional) Recently Viewed Reports list.**
    *   **(Optional) Favorite Reports list.**

### 2.2. Standard Report View (Generic Template)

*   **Purpose:** Display a specific pre-defined report.
*   **Layout:**
    *   **Report Title.**
    *   **Filter Bar:**
        *   Common filters: Date Range, Project(s), Resource(s), Department/Team.
        *   Specific filters relevant to the report type.
        *   "Apply Filters" button.
    *   **Export Options:** Buttons for "Export to PDF", "Export to CSV", "Export to Excel" (PRD Line 170).
    *   **Print Option.**
    *   **Main Content Area:** Displays the report data using:
        *   Charts (bar, line, pie, scatter - using Echarts).
        *   Tables (sortable, searchable within the table, paginated).
        *   Key Performance Indicators (KPIs) displayed as large numbers/stats.
        *   Data drill-down capabilities (e.g., click a chart segment to see underlying data table, click a table row for more details).

### 2.2.1. Resource Utilization Report (PRD Line 166, 362)

*   **Filters:** Date Range, Resource(s), Project(s), Team.
*   **Content:**
    *   Overall utilization percentage (Allocated Hours / Available Hours).
    *   Chart: Utilization over time (line chart).
    *   Chart: Breakdown of time (Allocated, Available, Billable, Non-Billable, On Leave, Training) - Pie or Bar chart.
    *   Table: Resource Name, Total Available Hours, Total Scheduled Hours, Billable Hours, Non-Billable Hours, Utilization %.
    *   Drill-down to see projects/tasks a resource spent time on.

### 2.2.2. Cost Analysis Dashboards/Reports (PRD Line 167, 363)

*   **Filters:** Date Range, Project(s), Resource(s), Cost Center.
*   **Content:**
    *   Overall: Total Planned Cost vs. Total Actual Cost.
    *   Chart: Cost trends over time (line chart).
    *   Chart: Cost breakdown by Project, by Resource Type, by Phase - Bar or Pie charts.
    *   Table: Project Name, Planned Budget, Actual Cost, Variance (Amount and %).
    *   Drill-down to see cost details for specific tasks or resources within a project.

### 2.2.3. Skill Distribution & Gap Analysis Visualizations (PRD Line 168, 364)

*   **Filters:** Team/Department, Project (to see required skills vs. available).
*   **Content:**
    *   Chart: Skill inventory (Bar chart showing number of resources proficient in each key skill).
    *   Chart: Skill proficiency distribution (e.g., for a selected skill, how many resources are at level 1-3, 4-6, 7-8, 9-10).
    *   Heatmap: Skills vs. Resources/Teams showing proficiency levels.
    *   **Gap Analysis:**
        *   For upcoming projects: List required skills vs. available skilled resources.
        *   Highlight critical skill gaps.
        *   Suggest training needs or hiring priorities.

### 2.2.4. Capacity Forecasting Charts (PRD Line 169, 365)

*   **Filters:** Date Range (e.g., next 3, 6, 12 months), Skill, Role, Team.
*   **Content:**
    *   Chart: Required Capacity (from planned projects) vs. Available Capacity (from resources) over time (Line or Stacked Bar chart).
    *   Highlight periods of under/over capacity.
    *   Table: Future period (e.g., Month), Required Hours (by skill/role), Available Hours (by skill/role), Surplus/Deficit.

### 2.3. Custom Report Builder (PRD Line 366)

*   **Purpose:** Allow users (likely advanced users/admins) to create their own reports.
*   **Layout (Multi-step or Interactive Canvas):**
    *   **Step 1: Select Data Source(s):**
        *   Choose primary data entities (e.g., Resources, Projects, Tasks, Assignments, Schedules, Costs).
        *   Define relationships if joining data (simplified interface).
    *   **Step 2: Select Fields/Columns:**
        *   Checkbox list of available fields from the selected data source(s).
    *   **Step 3: Define Filters:**
        *   Add filter conditions (Field, Operator, Value).
    *   **Step 4: Define Grouping & Summarization:**
        *   Group by selected fields (e.g., Group projects by Project Manager).
        *   Summarize numerical data (Sum, Average, Count, Min, Max).
    *   **Step 5: Choose Visualization:**
        *   Table
        *   Chart Type (Bar, Line, Pie, etc.) - configure axes, series.
    *   **Step 6: Preview & Save:**
        *   Show a preview of the report.
        *   Name the report, add description, save for later access.
        *   (Optional) Set sharing permissions.
*   **Interactions:** Drag-and-drop interface for selecting fields, building filters. Real-time preview updates as report is built.

## 3. Data Sources
*   Aggregated and denormalized data from `resources`, `projects`, `schedules` collections.
*   Potentially a separate reporting database or data warehouse for performance with complex queries (future consideration).

## 4. Key User Scenarios
*   Manager needs to see the overall resource utilization for the last quarter.
*   Project Manager wants to compare planned vs. actual costs for their active projects.
*   Resource Manager needs to identify skill gaps in their team based on upcoming project demands.
*   Executive wants to see a forecast of resource capacity for the next 6 months.
*   Analyst needs to build a custom report combining project data with resource skills.
