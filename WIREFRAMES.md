# Plannar - UI Wireframes (Textual Descriptions)

This document provides textual descriptions of key UI screens and components for Plannar. It serves as a guide for frontend development when detailed visual mockups are not yet available.

## 1. Scheduling Page (Project Manager View)

This is the primary interface for project managers to view resource schedules and make new assignments.

**Overall Layout:**
- Two-column responsive layout.
  - **Left Column (approx. 70% width):** Main Calendar View & Controls.
  - **Right Column (approx. 30% width):** Assignment Tools (Assignment Form, Ranked Resource List).

**1.1. Left Column: Calendar View & Controls**

   - **Component: Main Calendar (FullCalendar)**
     - **Display:** Shows assignments as events on a standard calendar.
     - **Views:** Supports Month, Week (timeGridWeek), Day (timeGridDay), List (listWeek) views.
     - **Events:** 
       - Display title: "[Project Name] - [Task Name] ([Resource Name])" or similar.
       - Colored by project or assignment status (e.g., tentative, confirmed).
       - Show start/end times accurately.
       - Clicking an event could show a popover/modal with more details (e.g., task description, allocated hours, cost, option to edit/cancel assignment).

   - **Component: Calendar Controls Bar** (Positioned above or alongside the calendar)
     - **Date Navigation:** 
       - "Previous" / "Next" buttons.
       - "Today" button.
       - Display of current month/year or date range.
     - **View Switcher:** Buttons or dropdown to select (Month, Week, Day, List).
     - **Date Range Picker:** (Optional, if more specific ranges than month/week/day are needed) Two date input fields for start and end date.
     - **Resource Filter:**
       - Multi-select dropdown or a checklist of available resources.
       - Allows PM to select which resources' schedules are displayed on the calendar.
       - An "All Resources" / "My Team" option.
     - **Project Filter:** (Optional)
       - Multi-select dropdown or checklist of active projects.
       - Filters calendar events to show only assignments related to selected projects.
     - **Conflict Indicator:** (Optional, could be part of calendar display itself) A small icon or notification if the current view contains unresolved conflicts.

**1.2. Right Column: Assignment Tools**

   - **Component: Assignment Form** (Already partially implemented - `AssignmentForm.tsx`)
     - **Purpose:** Allows PMs to create new resource assignments.
     - **Fields:**
       - Project (Select dropdown, populated from API).
       - Task (Select dropdown, populated based on selected project from API).
       - Resource (Select dropdown, populated from API).
       - Start Date (Date picker).
       - End Date (Date picker).
       - Allocated Hours (Number input).
       - Notes (Text area, optional).
     - **Actions:** "Assign Resource" button.
     - **Feedback:** 
       - Loading indicators for dropdowns.
       - Success message upon successful assignment.
       - Error messages for validation errors or API failures (e.g., scheduling conflicts, resource unavailable).
       - Visual feedback for conflicts directly in the form if possible (e.g., if selected resource + dates result in a known conflict based on data already loaded in the calendar).

   - **Component: Ranked Resource List** (Placeholder `RankedResourceList.tsx` exists)
     - **Purpose:** Helps PMs choose the best resource for a task based on various criteria.
     - **Trigger:** 
       - Automatically populated/updated when a Project and Task are selected in the Assignment Form.
       - OR, could be triggered by selecting an unassigned task in a separate "Project Tasks" view (not yet designed).
     - **Display:** A table or list view.
     - **Columns/Information per Resource:**
       - Resource Name (clickable, could link to full resource profile/calendar).
       - Skill Match (%): Overall match based on task's required skills.
       - Key Skills: List of relevant skills and proficiency levels.
       - Availability: 
         - Indication of availability within the selected/task's timeframe (e.g., "Fully Available", "X hours available", "Conflicts exist").
         - Clicking could show a mini-calendar or list of conflicting assignments for that resource.
       - Estimated Cost: Calculated cost for assigning this resource to the selected task for the specified hours/duration.
       - Current Workload: (Optional) Indication of how busy the resource is currently (e.g., X active assignments, Y% allocated this week).
     - **Actions:**
       - "Select for Assignment" or "Pre-fill Form" button next to each resource, which populates the Resource field (and potentially dates/hours if derivable) in the Assignment Form.
     - **Sorting/Filtering:** Options to sort by match, availability, cost.

**User Flow Example (Assignment):**
1. PM selects a Project and Task in the Assignment Form.
2. Ranked Resource List updates with suitable resources.
3. PM reviews ranked resources, checks their availability details.
4. PM clicks "Select for Assignment" for a chosen resource.
5. Assignment Form's Resource field is populated.
6. PM fills in Start Date, End Date, Allocated Hours.
7. PM clicks "Assign Resource".
8. System validates, checks for conflicts. On success, calendar updates. On failure, error message shown.
