# Plannar Project TODO List

## I. Project Setup & Foundational Work

- [ ] **Environment Setup**
    - [x] Initialize Git repository with appropriate `.gitignore`.
    - [ ] Setup Firebase project (Authentication, Firestore, Cloud Functions, Storage, Hosting). (PRD Lines 187, 191-192, 196-201) - **ACTION REQUIRED: User to set this up in Firebase console.** (Blocker for backend deployment and full backend dev environment setup)
    - [ ] Setup Google Cloud Platform project if additional services beyond Firebase are anticipated. (PRD Line 186) - **ACTION REQUIRED: User to set this up in GCP console if needed.**
    - [x] Setup frontend development environment (React.js with TypeScript, Material UI, Tailwind CSS, Echarts). (PRD Lines 188-189, sample_wireframe.md)
    - [/] Setup backend development environment (Node.js/TypeScript for Cloud Functions). (Basic structure created; full setup including `firebase init functions` and local emulator depends on Firebase project initialization by user)
    - [/] Establish coding standards and linting rules for frontend and backend. (TailwindCSS v4 compatible linter plugin for `eslint-plugin-tailwindcss` is pending)
    - [x] Configure basic CI/CD pipeline for automated builds and tests. (GitHub Actions workflow created)

- [x] **Initial UI/UX Design** (All sub-tasks marked as complete based on previous state)
    - [x] Create detailed wireframes for all core screens identified in PRD (Lines 331-373) and `sample_wireframe.md`. (Textual wireframes created in /wireframes directory)
    - [x] Define User Personas and Key User Journeys. (Created user_personas.md, key_user_journeys.md in /ux_design)
    - [x] Develop an initial style guide and reusable UI component library based on Material UI and `sample_wireframe.md`. (Created initial_style_guide.md, reusable_components_list.md in /ux_design)
    - [x] Consider advanced React state management library. (Zustand recommended; Redux Toolkit as alternative)

## II. Phase 1: Core Resource Management (3-4 months)

### A. Feature: Resource Profile Management (PRD User Story 1.1, Lines 49-70)

#### 1. Backend (Firebase Cloud Functions & Firestore)
    - [/] Design and implement Firestore schema for `Resources` collection (PRD Lines 210-242). (TypeScript interfaces defined; Firestore setup & rules pending Firebase project initialization)
    - [/] Implement API: `POST /api/resources` - Create new resource (PRD Line 302). (Core logic implemented; comprehensive input validation and uniqueness checks pending)
        - [x] Include personal info, skills, availability, rates, certifications, max assignments, max hours, status. (Structure and defaults in place)
        - [x] Include basic data entry/storage for historical performance metrics. (Field available)
    - [/] Implement API: `GET /api/resources` - List all resources (PRD Line 300). (Core logic implemented; pagination, filtering, sorting pending)
    - [x] Implement API: `GET /api/resources/{id}` - Get resource details (PRD Line 301).
    - [x] Implement API: `PUT /api/resources/{id}` - Update resource (PRD Line 303). (Includes audit log update)
    - [x] Implement API: `GET /api/resources/{id}/skills` - Get resource skills (PRD Line 305).
    - [x] Implement logic for tracking changes to profiles with audit history (PRD Line 69). (Creation and update logs implemented)
    - [/] Implement secure storage and access control for rate information (PRD Line 68). (Data structure in place; Firestore rules pending Firebase project initialization)
    - [x] Refactor `listResources`, `getResourceById`, `updateResource`, `getResourceSkills` for testability (similar to `createResourceLogic`).
    - [ ] New tests needed for validation & uniqueness in `createResourceLogic`.
    - [ ] New tests needed for pagination, filtering, sorting in `listResourcesLogic`.
    - [ ] New tests needed for `updateResourceLogic` (validation, audit log).
    - [ ] New tests needed for `getResourceByIdLogic`, `getResourceSkillsLogic`.

#### 2. Frontend (React, Material UI, Tailwind CSS)
    - [x] Develop UI for creating resource profiles (PRD Line 65). (ResourceForm.tsx and CreateResourcePage.tsx created)
        - [x] Form for personal information.
        - [x] Interface for adding/rating skills and certifications.
        - [x] Interface for defining work arrangements and time off.
        - [x] Interface for inputting rate information. (Access control pending app-level role logic)
    - [/] Develop UI for viewing and listing resource profiles (with filtering options - PRD Line 341). (Initial components ResourceCard.tsx, ResourceListPage.tsx, ResourceDetailPage.tsx created with mock data. API integration, full detail view, and advanced filtering pending)
    - [/] Develop UI for updating resource profiles. (Initial UpdateResourcePage.tsx reusing ResourceForm.tsx. API integration pending)
    - [x] Develop UI for viewing resource skills. (Covered by ResourceDetailPage.tsx)
    - [x] Develop UI for viewing audit history of profile changes. (AuditLogDisplay.tsx created, integrated with mock data)
    - [ ] Implement API service calls from frontend to backend for all Resource Profile Management features.

#### 3. Testing
    - [~] Unit tests for backend resource management logic (Cloud Functions). (Jest setup complete. `createResourceLogic` validation error tests PASSING. `createResourceLogic` success test FAILING due to `firebase-admin` initializeApp mock issue. Other function tests PENDING)
    - [ ] Unit tests for frontend resource management components. (PENDING)
    - [ ] Integration tests for Resource Management APIs. (PENDING - Blocked by Firebase project setup)
    - [ ] E2E tests for creating, viewing, and updating resource profiles. (PENDING)

### B. Feature: Project Definition and Management (Basic) (PRD User Story 2.1, Lines 71-93)

#### 1. Backend
    - [x] Design and implement Firestore schema for `Projects` and `Tasks` collections (basic fields for Phase 1). (TypeScript interfaces defined in `project.types.ts`)
    - [x] Refactor `AuditLogEntry` to a shared types file (imported from `resource.types.ts` into `project.types.ts`).
    - [x] Implement API: `POST /api/projects` - Create new project. (Refactored to `createProjectLogic`)
    - [x] Implement API: `GET /api/projects` - List all projects. (Refactored to `listProjectsLogic`)
    - [x] Implement API: `GET /api/projects/{id}` - Get project details. (Refactored to `getProjectByIdLogic`)
    - [x] Implement API: `PUT /api/projects/{id}` - Update project. (Refactored to `updateProjectLogic`)
    - [x] Implement API: `POST /api/projects/{id}/tasks` - Create new task. (Refactored to `createTaskLogic`)
    - [x] Implement API: `GET /api/projects/{id}/tasks` - Get project tasks. (Refactored to `listTasksLogic`)
    - [x] Implement API: `PUT /api/projects/{id}/tasks/{taskId}` - Update task. (Refactored to `updateTaskLogic`)

#### 2. Frontend
    - [X] Develop UI for creating new projects (`CreateProjectPage.tsx`, `ProjectForm.tsx` - basic structure, mock submission).
    - [X] Develop UI for listing projects (`ProjectListPage.tsx` - basic structure, mock data).
    - [X] Develop UI for viewing project details (`ProjectDetailPage.tsx` - basic structure, mock data).
    - [X] Develop UI for updating projects (`UpdateProjectPage.tsx` using `ProjectForm.tsx` - basic structure, mock data & submission).
    - [X] Develop UI for defining tasks within a project (Placeholder `TaskForm.tsx` created).
    - [X] Develop UI for viewing and updating tasks (Placeholder `TaskList.tsx` created).

#### 3. Testing
    - [/] Unit tests for backend project/task management logic (Cloud Functions - `projects.ts`):
        - [X] `createProjectLogic` (validation tests PASSING; success case PASSING after fixing mock assertion from `mockFirestoreSet` to `mockFirestoreAdd`)
        - [x] `listProjectsLogic` (basic tests PASSING; pagination, filtering, sorting PENDING implementation in SUT)
        - [x] `getProjectByIdLogic` (tests PASSING)
        - [x] `updateProjectLogic` (validation, audit log tests PASSING)
        - [x] `createTaskLogic` (validation, audit log, project existence tests PASSING)
        - [x] `listTasksLogic` (basic tests PASSING; pagination, filtering, sorting PENDING implementation in SUT, project existence test PASSING)
        - [x] `updateTaskLogic` (validation, audit log, project/task existence tests PASSING)
    - [ ] Unit tests for frontend project/task components. (PENDING)
    - [ ] Integration tests for Project Management APIs. (PENDING - Blocked by Firebase project setup)
    - [ ] E2E tests for creating and managing basic projects and tasks. (PENDING)

### C. Feature: Simple Scheduling Interface & Conflict Detection (PRD User Story 3.1, Lines 94-117 - partial; User Story 4.1, Lines 118-137 - partial)
(All tasks under this section are PENDING)
#### 1. Backend
    - [X] Design and implement Firestore schema for `Schedules` collection (created `schedule.types.ts`, updated `project.types.ts`).
    - [/] Implement API: `POST /api/schedules/assign` - Assign resource to task (initial version in `schedules.ts`, includes batching; advanced conflict detection & hour distribution PENDING).
    - [X] Implement API: `GET /api/resources/{id}/schedule` - Get resource schedule (implemented in `schedules.ts`).
    - [X] Implement API: `POST /api/schedules/calendar` - Get calendar view for multiple resources (implemented in `schedules.ts` as POST; 30 resource ID limit noted).
    - [/] Logic to update availability calendars automatically upon assignment (partially addressed by creating `ScheduleEntry` records; comprehensive solution PENDING).

#### 2. Frontend
    - [X] Develop basic scheduling interface (Calendar view: day/week) (`SchedulingPage.tsx`, `CalendarView.tsx` with FullCalendar).
    - [X] UI to select project, task, and resource for assignment (`AssignmentForm.tsx` created and added to `SchedulingPage.tsx`).
    - [/] UI to display ranked list of suitable resources (Placeholder `RankedResourceList.tsx` created; integration PENDING).
    - [ ] UI to highlight basic scheduling conflicts (Will be addressed via calendar event styling and form feedback; PENDING backend enhancements).
    - [ ] UI for team members to view their schedules (Leverage `CalendarView` with filtered data; PENDING specific page/view).
    - [ ] UI for project managers to view resource allocation timeline (Leverage `CalendarView` with filtered data; PENDING specific page/view).

#### 3. Testing
    - [ ] Unit tests for scheduling and conflict detection logic.
    - [ ] Unit tests for frontend scheduling components.
    - [ ] Integration tests for Scheduling APIs.
    - [ ] E2E tests for assigning resources and viewing schedules.

### D. Feature: Calendar Integration for Availability Tracking (Covered by Resource Profile & Scheduling)
(All tasks under this section are PENDING)
    - [ ] Ensure resource availability is reflected in scheduling UI.
    - [ ] Ensure assignments update resource availability.

### E. Feature: Basic Reporting Functionality (PRD User Story 6.1, Lines 158-178 - partial)
(All tasks under this section are PENDING)
#### 1. Backend
    - [ ] Develop Cloud Functions for basic resource utilization reports.
    - [ ] Develop Cloud Functions for basic project cost reports.

#### 2. Frontend
    - [ ] Develop UI for Dashboard (as per `sample_wireframe.md` and PRD).
    - [ ] Develop UI for basic resource utilization report.
    - [ ] Develop UI for basic project cost report.
    - [ ] Implement export for basic reports (CSV initially).

#### 3. Testing
    - [ ] Unit tests for reporting aggregation logic.
    - [ ] Unit tests for frontend reporting components and dashboard.
    - [ ] Integration tests for data aggregation.
    - [ ] E2E tests for viewing dashboard and basic reports.

### F. Feature: Notifications (PRD User Story 3.1, Lines 108, 116)
(All tasks under this section are PENDING)
    - [ ] Backend/Frontend: Notifications to team members upon assignment.

### Milestone: Phase 1 Completion
    - [ ] All core resource management, basic project definition, simple scheduling, and basic reporting features implemented and tested.
    - [ ] Internal demo and feedback session.

## III. Phase 2: Advanced Scheduling Features (2-3 months)

### A. Feature: Enhanced Constraint Management (PRD User Story 3.1, Lines 105-106)
    - [ ] Backend: Enforce maximum 2 simultaneous assignments per person (PRD Line 105, DB schema line 239).
    - [ ] Backend: Prevent double-booking except for specifically qualified resources (PRD Line 106, Project Task `allowDoubleBooking` PRD Line 271).
    - [ ] Backend: Enforce max hours per day for resources (PRD DB schema line 240).
    - [ ] Frontend: Clearly indicate constraint violations in UI.

### B. Feature: Multi-project Resource Allocation
    - [ ] Backend: Enhance conflict checking for multi-project scenarios.
    - [ ] Frontend: Improve UI to visualize and manage allocations across multiple projects for a single resource.

### C. Feature: Schedule Management and Conflict Resolution (PRD User Story 4.1, Lines 120-137)
    - [ ] Backend: Logic to detect conflicts when project timelines are adjusted (PRD Line 126).
    - [ ] Backend: Logic to handle resource departures (identify affected projects) (PRD Line 129).
    - [ ] Backend: Logic to manage resource onboarding (gradual capacity) (PRD Line 130, Resource status line 241).
    - [ ] Frontend: UI to adjust project timelines and visualize impact on resource availability (PRD Lines 127, 133).
    - [ ] Frontend: UI to display suggestions for resolving conflicts (manual options initially) (PRD Line 128).
    - [ ] Frontend: Notifications for resource departures and suggestions for replacements (manual) (PRD Line 135).

### D. Feature: Cost Tracking and Budget Management (PRD User Story 2.1, 3.1)
    - [ ] Backend: Calculate and store cost implications of assignment choices (regular, overtime, weekend rates) (PRD Line 107, 279).
    - [ ] Backend: Track project budget (total, spent, remaining) accurately (PRD Lines 85, 253-256).
    - [ ] Frontend: Display cost implications in real-time during assignment (PRD Line 115).
    - [ ] Frontend: Budget tracking visualization for projects (PRD Line 352).

### E. Feature: Expanded Reporting and Analytics (PRD User Story 6.1, Lines 166-178)
    - [ ] Backend: Develop functions for:
        - [ ] Detailed resource utilization reports (across projects, time periods) (PRD Line 166).
        - [ ] Cost analysis reports (planned vs. actual) (PRD Line 167).
        - [ ] Skill utilization metrics (PRD Line 168).
    - [ ] Frontend:
        - [ ] UI for advanced filtering on reports (PRD Line 174).
        - [ ] Enhanced visualizations for reports (PRD Line 175).
        - [ ] UI for skill utilization reports.
        - [ ] UI for capacity planning forecasts (basic visualization) (PRD Line 169).
        - [ ] Implement PDF and Excel export for reports (PRD Line 170).
        - [ ] Drill-down capabilities in reports (PRD Line 177).


### F. General Enhancements
    - [ ] Frontend: Drag-and-drop assignment capability in scheduling interface (PRD Line 357).
    - [ ] Frontend: Month view for calendar (PRD Line 355).
    - [ ] Frontend: Filter by project/resource/skill in scheduling interface (PRD Line 359).


### Milestone: Phase 2 Completion
    - [ ] All advanced scheduling, cost tracking, and expanded reporting features implemented and tested.
    - [ ] Internal demo and feedback session.

## IV. Phase 3: AI and Optimization (3-4 months)

### A. Feature: MCP Integration for AI-powered Suggestions (PRD User Story 5.1, Lines 138-157)
    - [ ] Setup MCP servers (PRD Line 204).
    - [ ] Integrate MCP with Firebase using MCP Toolbox for Databases (PRD Line 205).
    - [ ] Develop specialized MCP servers for resource matching, budget analysis, schedule optimization (PRD Line 206).

### B. Feature: AI - Resource Matching Algorithms
    - [ ] Backend: Implement API `POST /mcp/resource-matching` (PRD Line 323).
    - [ ] AI Model: Develop/configure Gemini model for resource matching based on skills, proficiency, availability, (potentially historical performance - PRD Line 62).
    - [ ] Frontend: UI in AI Recommendation Center to display resource matching suggestions (PRD Line 369).
    - [ ] Frontend: Allow users to accept/reject suggestions (PRD Line 155).

### C. Feature: AI - Budget Optimization Recommendations
    - [ ] Backend: Implement API `POST /mcp/budget-optimization` (PRD Line 324).
    - [ ] AI Model: Develop/configure Gemini model to analyze allocations for cost optimization (PRD Line 146).
        - [ ] Suggest resource substitutions (maintain quality, reduce cost) (PRD Line 147).
        - [ ] Suggest schedule adjustments (minimize overtime/premium rates) (PRD Line 148).
    - [ ] Frontend: UI in AI Recommendation Center for cost optimization recommendations (PRD Line 370).
        - [ ] Display estimated savings and quality impact (PRD Line 154).

### D. Feature: AI - Schedule Conflict Resolution
    - [ ] Backend: Implement API `POST /mcp/schedule-conflicts` (PRD Line 325).
    - [ ] AI Model: Develop/configure Gemini model to detect and suggest resolutions for scheduling conflicts (reallocation, rescheduling) (PRD Line 128).
    - [ ] Frontend: UI in AI Recommendation Center for conflict resolution options (PRD Line 372).

### E. Feature: AI - Other Optimizations
    - [ ] AI Model: Identify opportunities for task consolidation (PRD Line 149).
    - [ ] AI Model: Recommend skill development paths to address capability gaps (PRD Line 150).
    - [ ] Frontend: UI in AI Recommendation Center for skill development proposals (PRD Line 371).
    - [ ] Frontend: UI for task consolidation suggestions.

### F. Feature: Predictive Analytics for Capacity
    - [ ] AI Model: Develop/configure model for capacity planning forecasts (PRD Line 169).
    - [ ] Frontend: UI for visualizing capacity forecasting charts in Reports & Analytics (PRD Line 365).

### Milestone: Phase 3 Completion
    - [ ] All AI-powered optimization and predictive analytics features implemented and tested.
    - [ ] Full system demo and UAT readiness.

## V. Cross-Cutting Concerns & General Tasks

### A. UI/UX Design System & Refinement
    - [ ] Finalize comprehensive style guide and component library.
    - [ ] Conduct usability testing sessions at the end of each phase.
    - [ ] Iterate on UI/UX based on feedback.
    - [ ] Incorporate Accessibility (A11y) considerations and testing throughout design and development.
    - [ ] Ensure all UI screens from PRD (Lines 331-373) and `sample_wireframe.md` are implemented with high fidelity.
        - [ ] Dashboard (PRD Lines 333-339, `sample_wireframe.md`)
        - [ ] Resource Management (PRD Lines 340-346)
        - [ ] Project Management (PRD Lines 347-353)
        - [ ] Scheduling Interface (PRD Lines 354-360)
        - [ ] Reports and Analytics (PRD Lines 361-367)
        - [ ] AI Recommendation Center (PRD Lines 368-373)

### B. Testing Strategy & Implementation
    - [ ] Define and implement comprehensive testing strategy (unit, integration, E2E, performance, security).
    - [ ] Define key Non-Functional Requirements (NFRs) for performance (e.g., page load times, API response times under X concurrent users).
    - [ ] Setup and maintain testing environments.
    - [ ] Continuously add tests for all new features and bug fixes.
    - [ ] Plan for User Acceptance Testing (UAT).

### C. Documentation
    - [ ] Develop end-user documentation/guides.
    - [ ] Develop technical documentation (API docs, architecture diagrams, setup guides).
    - [ ] Keep documentation updated throughout the development lifecycle.

### D. Deployment & Infrastructure
    - [ ] Finalize Firebase project configuration for production.
    - [ ] Finalize MCP server setup and configuration for production.
    - [ ] Implement robust CI/CD pipeline for automated deployment to staging and production environments.
    - [ ] Define backup and disaster recovery plan for Firestore data.

### E. Security
    - [ ] Implement robust authentication and authorization using Firebase Authentication.
    - [ ] Ensure role-based access control for different user types (Project Manager, Resource Manager, etc.).
        - [ ] Define key roles (e.g., Admin, Project Manager, Resource Manager, Team Member) and outline basic permission matrix.
    - [ ] Secure API endpoints.
    - [ ] Protect sensitive data in Firestore and Cloud Storage (encryption, access rules - PRD Line 68).
    - [ ] Conduct security audits and penetration testing before launch.
    - [ ] Address any identified vulnerabilities.

### F. Launch Preparation
    - [ ] Conduct comprehensive User Acceptance Testing (UAT).
    - [ ] Develop launch plan and checklist.
    - [ ] Prepare marketing and communication materials (if applicable).
    - [ ] Train support staff and key users.
    - [ ] Final data migration or setup (if any).

## VI. Post-Launch
    - [ ] Monitor system performance, logs, and errors.
    - [ ] Establish a process for bug fixing and maintenance.
    - [ ] Gather user feedback for future enhancements and iterations.
    - [ ] Plan for ongoing operational support.


## General/Ongoing Tasks
    - [ ] Continuously update `PRD.md` and `TRD.md` as the project evolves.
    - [ ] Monitor and address any new linting/styling issues.
    - [ ] Regularly review and update dependencies.
    - [~] Resolve `firebase-admin` mocking issue in `resources.test.ts`. (Issue identified, multiple attempts made, currently blocked)
