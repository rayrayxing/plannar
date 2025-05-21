# Wireframe: AI Recommendation Center

## 1. Overall Layout
(Inherits the application shell: Header, Sidebar from `dashboard.md`)

*   **Main Content Area Title:** "AI Recommendation Center" or "Insights & Optimizations"

## 2. Core Components / Views

### 2.1. Recommendation Dashboard / Landing Page

*   **Purpose:** Provide a central place to view and act on AI-generated suggestions.
*   **Layout:**
    *   **Summary Section:** Key stats like "X Active Recommendations", "Y Potential Cost Savings Identified", "Z Conflicts Needing Action".
    *   **Categorized Recommendation Lists/Sections:**
        *   Resource Matching Suggestions (PRD Line 369)
        *   Cost Optimization Recommendations (PRD Line 370)
        *   Skill Development Proposals (PRD Line 371)
        *   Scheduling Conflict Resolution Options (PRD Line 372)
    *   Each category shows a count of active recommendations and a link to a detailed view for that category.
    *   **(Optional) "Run New Analysis" button for specific AI tasks (e.g., "Optimize Project X Schedule").**

### 2.2. Detailed Recommendation List View (Generic Template for each category)

*   **Purpose:** Display a list of specific recommendations within a category.
*   **Layout:**
    *   **Category Title** (e.g., "Cost Optimization Recommendations").
    *   **Filter/Sort Options:** By priority, date generated, project, status (New, Viewed, Actioned, Dismissed).
    *   **List of Recommendation Cards/Items:**
        *   Each item represents one actionable suggestion.
        *   **Content per Recommendation:**
            *   **Title/Summary:** e.g., "Substitute Resource for Task Y on Project X" or "Reschedule Task Z to avoid overtime".
            *   **Details/Rationale:** Brief explanation of why the recommendation is made (e.g., "Potential saving: $500", "Improves skill match by 15%", "Resolves over-allocation for John Doe").
            *   **Impact Assessment (PRD Line 154):** Estimated savings, quality impact (if applicable), effort to implement.
            *   **Context:** Link to relevant Project, Task, Resource.
            *   **Timestamp:** When the recommendation was generated.
            *   **Action Buttons (PRD Line 155):**
                *   "Accept" / "Apply Suggestion" (may trigger further actions or navigate to relevant screen with pre-filled data).
                *   "View Details" / "Explore Options" (opens a modal or navigates for more info).
                *   "Dismiss" (with option to provide feedback - "Not relevant", "Already addressed").

### 2.2.1. Resource Matching Suggestions View

*   **Context:** Typically shown when a PM is trying to staff a project task, or as a proactive suggestion.
*   **Specifics:**
    *   For a given task (Project X, Task Y, Required Skills: A, B, C):
        *   Recommendation: "Consider assigning Jane Doe (Skill Match: 95%, Availability: 100%, Cost: $X)"
        *   Alternative: "Or, assign Mark Lee (Skill Match: 88%, Availability: 80%, Cost: $Y)"
    *   "Accept" might pre-fill the assignment modal in the Scheduling Interface.

### 2.2.2. Cost Optimization Recommendations View

*   **Context:** Proactive suggestions based on current allocations and resource rates.
*   **Specifics:**
    *   Recommendation: "Replace Resource A with Resource B on Project X, Task Y. Potential saving: $Z/week. Skill match maintained."
    *   Recommendation: "Shift Task Q on Project P by 2 days to utilize standard rates for Resource C instead of overtime. Potential saving: $W."
    *   Recommendation: "Consolidate Tasks R and S on Project M for Resource D, reducing context switching and potentially total hours."
    *   "Accept" might require confirmation and then trigger schedule/assignment updates.

### 2.2.3. Skill Development Proposals View

*   **Context:** Based on organizational skill gaps, upcoming project needs, or individual resource career paths.
*   **Specifics:**
    *   Recommendation: "Resource E (current skills: X, Y) could benefit from training in Skill Z to meet upcoming demand from Project Alpha. Suggested courses: [Link1, Link2]."
    *   Recommendation: "Team Gamma has a shortage of Skill Q. Consider cross-training 2 members or hiring 1 specialist."
    *   "Accept" might log this as a development goal or notify a manager.

### 2.2.4. Conflict Resolution Options View

*   **Context:** When scheduling conflicts are detected by the system.
*   **Specifics:**
    *   Conflict: "John Doe is double-booked on May 25th for Project A (Task 1) and Project B (Task 2)."
    *   Recommendation 1: "Move Project A (Task 1) for John Doe to May 26th (John is available). Impact: Project A timeline shifts by 1 day."
    *   Recommendation 2: "Reassign Project B (Task 2) from John Doe to Sarah Miller (Available, 85% skill match). Impact: None to timeline, slight skill match reduction."
    *   Recommendation 3: "Allow double-booking if Task 1 is low intensity (requires manual override and justification)."
    *   "Accept" would apply the chosen resolution in the scheduling system.

### 2.3. Recommendation Details Modal/Page

*   **Purpose:** Provide more in-depth information about a specific recommendation if "View Details" is clicked.
*   **Layout:**
    *   Full recommendation text.
    *   Detailed breakdown of rationale, data used for the suggestion.
    *   Comparison of current state vs. proposed state (e.g., side-by-side schedule snippets, cost comparison tables).
    *   Simulation of impact if the suggestion is applied.
    *   Action buttons ("Accept", "Dismiss", "Back to List").

## 3. Data Sources
*   Output from MCP servers (resource matching, budget optimization, conflict resolution).
*   Data from `resources`, `projects`, `schedules` collections used as input for AI models.
*   A dedicated `recommendations` collection in Firestore to store, track status, and manage AI suggestions.

## 4. Key User Scenarios
*   Project Manager receives a suggestion to swap a resource on a task for significant cost savings with minimal quality impact.
*   Resource Manager gets a proposal for upskilling a team member to fill an anticipated skill gap.
*   Project Manager is presented with three viable options to resolve a scheduling conflict for a critical resource.
*   User reviews the list of AI suggestions, accepts some, and dismisses others with feedback.
