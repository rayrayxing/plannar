# Wireframe: Resource Management

## 1. Overall Layout
(Inherits the application shell: Header, Sidebar from `dashboard.md`)

*   **Main Content Area Title:** "Resource Management"

## 2. Core Components / Views

### 2.1. Resource List View

*   **Purpose:** Display all resources, allow searching, filtering, and quick actions.
*   **Layout:**
    *   **Top Bar:**
        *   Search bar: "Search by name, skill, ID..."
        *   Filter button: Opens a dropdown/modal with filter options (e.g., by Status (Active, Onboarding, Offboarding), Work Arrangement, Key Skills, Department (if applicable)).
        *   "Add New Resource" button (for authorized users, e.g., Resource Managers).
    *   **Table/List Display:**
        *   Columns:
            *   Checkbox (for bulk actions - TBD)
            *   Resource Name (clickable, links to Detailed Profile View)
            *   Employee ID
            *   Primary Role/Title (if applicable)
            *   Key Skills (e.g., top 3, or a summary like "Frontend, Backend")
            *   Current Availability Status (e.g., Available, Fully Allocated, On Leave)
            *   Work Arrangement (Full-time, Part-time)
            *   Actions (e.g., Edit (links to profile edit), View Schedule)
        *   Pagination for large lists.
        *   Sortable columns (Name, ID, Status).
*   **Interactions:**
    *   Clicking a resource name navigates to their Detailed Profile View.
    *   "Add New Resource" button opens a form/modal for creating a new resource profile (see 2.2.1).
    *   Applying filters updates the list.

### 2.2. Detailed Resource Profile View

*   **Purpose:** View and edit all information for a single resource.
*   **Layout:** Tabbed interface or long scroll page with sections.
    *   **Header Section:**
        *   Resource Name (Large font)
        *   Employee ID, Role/Title
        *   Profile Picture (if available)
        *   Status (Active, Onboarding, etc.)
        *   "Edit Profile" button (for authorized users).
    *   **Tabs/Sections:**
        *   **A. Personal Information (PRD Lines 213-217):**
            *   Fields: Full Name, Email, Phone, Employee ID.
            *   (View only for most, editable by Admin/RM).
        *   **B. Skills & Proficiencies (PRD Lines 218-222):**
            *   **Skill Management Interface:**
                *   List of skills: Skill Name, Proficiency (1-10 rating, e.g., stars or slider), Years of Experience.
                *   "Add Skill" button: Modal to search/select skill from taxonomy, set proficiency, years.
                *   Edit/Remove existing skills.
            *   Certifications: List of certifications, "Add Certification" button.
        *   **C. Availability & Schedule (PRD Lines 223-234):**
            *   **Work Arrangement:** Dropdown (Full-time, Part-time, Custom).
            *   **Standard Hours:** Display (e.g., Mon-Fri, 9 AM - 5 PM). Editable if "Custom".
            *   **Custom Schedule:** If selected, interface to define hours for each day.
            *   **Time Off:**
                *   List of approved time off (Start Date, End Date, Reason (optional)).
                *   "Request Time Off" / "Log Time Off" button (opens modal).
            *   **Availability Calendar (Visual):**
                *   Embedded calendar (e.g., weekly/monthly view).
                *   Shows scheduled work, assignments, time off.
                *   Read-only summary here, more detail in main Scheduling Interface.
        *   **D. Rates & Cost (PRD Lines 235-238):**
            *   Fields: Standard Hourly Rate, Overtime Rate, Weekend Rate.
            *   (Visible/Editable based on user role, e.g., RM, Finance).
        *   **E. Assignment Configuration (PRD Lines 239-240):**
            *   Max Simultaneous Assignments (e.g., default 2, editable by RM).
            *   Max Hours Per Day (e.g., default 14, editable by RM).
        *   **F. Assignment History (Connects to PRD Line 345):**
            *   Table/List of past and current project assignments.
            *   Columns: Project Name, Task Name, Role on Project, Start Date, End Date, Allocated Hours.
            *   Links to the respective projects/tasks.
        *   **G. Performance Metrics (PRD Line 62 - Future consideration):**
            *   Placeholder for historical performance data (e.g., project feedback summaries, utilization trends).
        *   **H. Audit History (PRD Line 69):**
            *   Log of changes made to the resource profile (Field changed, Old Value, New Value, Changed By, Timestamp).

*   **Interactions:**
    *   "Edit Profile" button enables editing mode for relevant sections.
    *   Saving changes updates the Firestore `resources/{resourceId}` document.

### 2.2.1. Create/Edit Resource Form (Modal or Separate Page)

*   **Purpose:** Input all necessary information for a new resource or edit an existing one.
*   **Layout:** Follows the structure of the Detailed Resource Profile View sections (A-E primarily for creation).
*   **Fields:** All editable fields from the profile.
    *   Validation: Required fields (Name, Email, ID, Work Arrangement, Rates). Skill proficiency within 1-10.
*   **Actions:** "Save Resource", "Cancel".

## 3. Data Sources
*   Primarily the `resources/{resourceId}` collection in Firestore.
*   Skills taxonomy might be a separate collection or configuration.
*   Assignments linked from `projects` or `schedules` collections.

## 4. Key User Scenarios
*   Resource Manager creates a new employee profile.
*   Resource Manager updates an employee's skills after training.
*   Resource Manager adjusts an employee's work arrangement.
*   Project Manager views a resource's availability and skills to consider for a project.
*   Team Member views their own profile and assignment history (read-only for most parts).
