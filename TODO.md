# Plannar Project TODO List

## I. Project Setup & Foundational Work

- [ ] **Environment Setup**
    - [x] Initialize Git repository with appropriate `.gitignore`.
    - [ ] Setup Firebase project (Authentication, Firestore, Cloud Functions, Storage, Hosting). (PRD Lines 187, 191-192, 196-201) - **ACTION REQUIRED: User to set this up in Firebase console.**
    - [ ] Setup Google Cloud Platform project if additional services beyond Firebase are anticipated. (PRD Line 186) - **ACTION REQUIRED: User to set this up in GCP console if needed.**
    - [x] Setup frontend development environment (React.js with TypeScript, Material UI, Tailwind CSS, Echarts). (PRD Lines 188-189, sample_wireframe.md)
    - [ ] Setup backend development environment (Node.js/TypeScript for Cloud Functions). (Structure created, Firebase init pending project setup)
    - [x] Establish coding standards and linting rules for frontend and backend. (TailwindCSS linting TBD)
    - [x] Configure basic CI/CD pipeline for automated builds and tests. (GitHub Actions workflow created)

- [ ] **Initial UI/UX Design**
    - [x] Create detailed wireframes for all core screens identified in PRD (Lines 331-373) and `sample_wireframe.md`. (PRD Line 376 implies this is needed) (Textual wireframes created in /wireframes directory for Dashboard, Resource Mgt, Project Mgt, Scheduling, Reports, AI Center)
    - [x] Define User Personas and Key User Journeys. (Created user_personas.md, key_user_journeys.md in /ux_design)
    - [x] Develop an initial style guide and reusable UI component library based on Material UI and `sample_wireframe.md`. (Created initial_style_guide.md, reusable_components_list.md in /ux_design)
    - [x] Consider advanced React state management library (if needed beyond Context/useState). (Zustand recommended for simplicity and scalability; Redux Toolkit as a powerful alternative if more structure is needed later.)

## II. Phase 1: Core Resource Management (3-4 months)

### A. Feature: Resource Profile Management (PRD User Story 1.1, Lines 49-70)

#### 1. Backend (Firebase Cloud Functions & Firestore)
    - [/] Design and implement Firestore schema for `Resources` collection (PRD Lines 210-242). (TypeScript interfaces defined in functions/src/types/resource.types.ts)
    - [x] Implement API: `POST /api/resources` - Create new resource (PRD Line 302). (Implemented in functions/src/resources.ts, exported via index.ts)
        - [x] Include personal info, skills (taxonomy 1-10, experience), availability (work arrangements, custom schedules, time off), rates (standard, overtime, weekend), certifications, max assignments, max hours, status. (PRD Lines 57-61, 213-241) (Structure and defaults in place; comprehensive validation is a TODO)
        - [x] Include basic data entry/storage for historical performance metrics (PRD Line 62). (Field available in model)
    - [x] Implement API: `GET /api/resources` - List all resources (PRD Line 300). (Implemented in functions/src/resources.ts, exported via index.ts. TODO: Pagination, filtering, sorting)
    - [x] Implement API: `GET /api/resources/{id}` - Get resource details (PRD Line 301). (Implemented in functions/src/resources.ts, exported via index.ts. Assumes ID in path via Firebase Hosting rewrite)
    - [x] Implement API: `PUT /api/resources/{id}` - Update resource (PRD Line 303). (Implemented in functions/src/resources.ts, exported via index.ts. Assumes ID in path. Includes audit log update.)
    - [x] Implement API: `GET /api/resources/{id}/skills` - Get resource skills (PRD Line 305). (Implemented in functions/src/resources.ts, exported via index.ts. Assumes ID in path via Firebase Hosting rewrite.)
    - [x] Implement logic for tracking changes to profiles with audit history (PRD Line 69). (Creation and update logs implemented.)
    - [/] Implement secure storage and access control for rate information (PRD Line 68). (Noted for Firestore rules; data structure in place)

#### 2. Frontend (React, Material UI, Tailwind CSS)
    - [ ] Develop UI for creating resource profiles (intuitive interface - PRD Line 65).
        - [ ] Form for personal information.
        - [ ] Interface for adding/rating skills (1-10 scale, experience years) and certifications (PRD Line 66).
        - [ ] Interface for defining work arrangements (full-time, part-time, custom schedules) and time off (PRD Line 67).
        - [ ] Interface for inputting rate information (with appropriate access controls).
    - [ ] Develop UI for viewing and listing resource profiles (with filtering options - PRD Line 341).
    - [ ] Develop UI for updating resource profiles.
    - [ ] Develop UI for viewing resource skills.
    - [ ] Develop UI for viewing audit history of profile changes.

#### 3. Testing
    - [ ] Unit tests for backend resource management logic (Cloud Functions).
    - [ ] Unit tests for frontend resource management components.
    - [ ] Integration tests for Resource Management APIs.
    - [ ] E2E tests for creating, viewing, and updating resource profiles.

### B. Feature: Project Definition and Management (Basic) (PRD User Story 2.1, Lines 71-93)

#### 1. Backend
    - [ ] Design and implement Firestore schema for `Projects` collection (basic fields for Phase 1 - PRD Lines 244-280, focus on info, basic tasks).
    - [ ] Implement API: `POST /api/projects` - Create new project (PRD Line 310).
        - [ ] Include scope, timeline, budget (basic), milestones (PRD Line 79).
    - [ ] Implement API: `GET /api/projects` - List all projects (PRD Line 308).
    - [ ] Implement API: `GET /api/projects/{id}` - Get project details (PRD Line 309).
    - [ ] Implement API: `PUT /api/projects/{id}` - Update project (PRD Line 311).
    - [ ] Implement API: `POST /api/projects/{id}/tasks` - Create new task (basic fields for Phase 1) (PRD Line 313).
        - [ ] Include name, description, estimated hours, required skills (name, min proficiency) (PRD Lines 80-82).
    - [ ] Implement API: `GET /api/projects/{id}/tasks` - Get project tasks (PRD Line 312).
    - [ ] Implement API: `PUT /api/projects/{id}/tasks/{taskId}` - Update task (PRD Line 314).

#### 2. Frontend
    - [ ] Develop UI for creating new projects (structured interface - PRD Line 88).
        - [ ] Form for project scope, timeline, budget, milestones.
    - [ ] Develop UI for listing projects (with status indicators - PRD Line 348).
    - [ ] Develop UI for viewing project details.
    - [ ] Develop UI for updating projects.
    - [ ] Develop UI for defining tasks within a project (including skill requirements & proficiency - PRD Line 89).
    - [ ] Develop UI for viewing and updating tasks.

#### 3. Testing
    - [ ] Unit tests for backend project/task management logic.
    - [ ] Unit tests for frontend project/task components.
    - [ ] Integration tests for Project Management APIs.
    - [ ] E2E tests for creating and managing basic projects and tasks.

### C. Feature: Simple Scheduling Interface & Conflict Detection (PRD User Story 3.1, Lines 94-117 - partial; User Story 4.1, Lines 118-137 - partial)

#### 1. Backend
    - [ ] Design and implement Firestore schema for `Schedules` collection (PRD Lines 282-295).
    - [ ] Implement API: `POST /api/schedules/assign` - Assign resource to task (PRD Line 317).
        - [ ] Schedule in 30-minute increments (PRD Line 102).
        - [ ] Basic conflict checking (e.g., double-booking for the same resource at the same time) (PRD Line 104).
    - [ ] Implement API: `GET /api/resources/{id}/schedule` - Get resource schedule (PRD Line 304).
    - [ ] Implement API: `GET /api/schedules/calendar` - Get calendar view for multiple resources (basic for Phase 1) (PRD Line 320).
    - [ ] Logic to update availability calendars automatically upon assignment (PRD Line 109).

#### 2. Frontend
    - [ ] Develop basic scheduling interface (Calendar view: day/week - PRD Line 355).
    - [ ] UI to select project, task, and resource for assignment.
    - [ ] UI to display ranked list of suitable resources (basic skill match, availability - PRD Line 103).
    - [ ] UI to highlight basic scheduling conflicts (PRD Line 358).
    - [ ] UI for team members to view their schedules and assignments (PRD Line 38).
    - [ ] UI for project managers to view resource allocation timeline (basic - PRD Line 356).

#### 3. Testing
    - [ ] Unit tests for scheduling and conflict detection logic.
    - [ ] Unit tests for frontend scheduling components.
    - [ ] Integration tests for Scheduling APIs.
    - [ ] E2E tests for assigning resources and viewing schedules.

### D. Feature: Calendar Integration for Availability Tracking (Covered by Resource Profile & Scheduling)
    - [ ] Ensure resource availability (work arrangements, time off from profiles) is reflected in scheduling UI.
    - [ ] Ensure assignments update resource availability.

### E. Feature: Basic Reporting Functionality (PRD User Story 6.1, Lines 158-178 - partial)

#### 1. Backend
    - [ ] Develop Cloud Functions to aggregate data for basic resource utilization reports.
    - [ ] Develop Cloud Functions to aggregate data for basic project cost reports (planned vs. actual - very basic for Phase 1).

#### 2. Frontend
    - [ ] Develop UI for Dashboard (as per `sample_wireframe.md` and PRD Lines 333-339).
        - [ ] Resource utilization overview (Pie Chart - `sample_wireframe.md`).
        - [ ] Project status summary (List/Cards - `sample_wireframe.md`).
        - [ ] Upcoming deadlines (List - `sample_wireframe.md`).
        - [ ] Potential conflicts requiring attention (List - `sample_wireframe.md`).
        - [ ] Budget status indicators (Bar Chart - `sample_wireframe.md`).
        - [ ] Key Metrics display (`sample_wireframe.md`).
        - [ ] Recent Activity feed (`sample_wireframe.md`).
        - [ ] Implement Skill Coverage Heatmap chart on Dashboard (`sample_wireframe.md`).
        - [ ] Implement Project Timeline Gantt-like chart on Dashboard (`sample_wireframe.md`).
    - [ ] Develop UI for basic resource utilization report (table/chart).
    - [ ] Develop UI for basic project cost report (table/chart).
    - [ ] Implement export for basic reports (CSV initially - PRD Line 170).

#### 3. Testing
    - [ ] Unit tests for reporting aggregation logic.
    - [ ] Unit tests for frontend reporting components and dashboard.
    - [ ] Integration tests for data aggregation.
    - [ ] E2E tests for viewing dashboard and basic reports.

### F. Feature: Notifications (PRD User Story 3.1, Lines 108, 116)
    - [ ] Backend/Frontend: Notifications to team members upon assignment (PRD Line 108, 116).
        - [ ] Basic in-app notifications.
        - [ ] Consider email notifications if feasible with Firebase Auth.

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

---
This TODO list is a living document and should be updated as the project progresses.
Priorities and specific task assignments will be managed separately (e.g., in a project management tool).
