# Plannar Project TODO List

## I. Project Setup & Foundational Work

- [ ] **Environment Setup & Core APIs**
    - [x] Initialize Git repository with appropriate `.gitignore`.
    - [ ] Setup Firebase project (Authentication, Firestore, Cloud Functions, Storage, Hosting). (PRD Lines 187, 191-192, 196-201; TRD Sec 2.2.2) - **ACTION REQUIRED: User to set this up in Firebase console.** (Blocker for backend deployment and full backend dev environment setup)
        - [/] Configure Firestore security rules as per TRD Sec 3.4 (including helper functions like `hasRole`, `isProjectManager`, `validResourceData`, etc.). (Drafted in firestore.rules; deployment & full testing pending Firebase project setup)
    - [ ] Setup Google Cloud Platform project if additional services beyond Firebase are anticipated. (PRD Line 186) - **ACTION REQUIRED: User to set this up in GCP console if needed.**
    - [x] Setup frontend development environment (React.js with TypeScript, Material UI, Tailwind CSS, Echarts). (PRD Lines 188-189, sample_wireframe.md)
    - [/] Setup backend development environment (Node.js/TypeScript for Cloud Functions). (Basic structure created; full setup including `firebase init functions` and local emulator depends on Firebase project initialization by user)
        - [/] Establish coding standards and linting rules for frontend and backend. (Official `eslint-plugin-tailwindcss` for TailwindCSS v4 is pending; community fork `hyoban/eslint-plugin-tailwindcss` exists as a potential interim solution to monitor - Issue #384, PR #385 in main repo)
    - [x] Configure basic CI/CD pipeline for automated builds and tests. (GitHub Actions workflow created)
    - [x] Implement Authentication API endpoints (TRD Sec 4.1.1).
        - [x] Backend: Firebase Auth `onUserCreate` trigger to set custom claims (e.g., default role).
        - [x] Backend: Firebase Callable Function `getUserData` to retrieve user details with claims.
        - [x] Frontend: Integrate Firebase SDK for login, logout, token refresh, and calling `getUserData`.

- [ ] **Initial UI/UX Design & Modal System Foundation**
    - [x] Create detailed wireframes for all core screens identified in PRD (Lines 331-373) and `sample_wireframe.md`. (Textual wireframes created in /wireframes directory)
    - [x] Define User Personas and Key User Journeys. (Created user_personas.md, key_user_journeys.md in /ux_design)
    - [x] Develop an initial style guide and reusable UI component library based on Material UI and `sample_wireframe.md`. (Created initial_style_guide.md, reusable_components_list.md in /ux_design)
    - [x] Consider advanced React state management library. (Zustand recommended; Redux Toolkit as alternative)
    - [x] Design modal interaction patterns and standard modal components (TRD Sec 2.2.5, 6.1.1). (Initial design complete)
    - [x] Frontend: Implement Modal Context Provider (`ModalContext.tsx`) (TRD Sec 2.2.5).
    - [x] Frontend: Implement Modal Registry (`ModalRegistry.ts`) (TRD Sec 2.2.5).
    - [ ] Frontend: Implement Modal Stack Manager (if complex stacking is anticipated early) (TRD Sec 2.2.5). (Deferred, current system supports one modal at a time)
    - [x] Frontend: Develop basic reusable modal wrapper/renderer component (`ModalWrapper.tsx` as `ModalRenderer` using Material UI Dialogs - TRD Sec 1.4, 2.2.5).
    - [x] Frontend: Integrate `ModalProvider` and `ModalRenderer` into `App.tsx`.
    - [x] Frontend: Develop generic `ConfirmationModal` component. (TRD Sec 2.2.5, 6.1.1)
    - [ ] (Placeholder) Define initial requirements for mobile application UI/UX, focusing on adaptive modals (TRD Sec 2.2.1).

- [x] **Core Data Collections & APIs (Foundational - TRD Sec 3.2, 4.1)**
    - [x] **Skills Collection (TRD Sec 3.2.4, API per TRD Sec 4.1.6)**
        - [x] Backend: Design and implement Firestore schema for global `Skills` collection (`skill.types.ts`).
        - [x] Backend: Implement APIs for managing global skills (CRUD operations in `skills.ts`, exported via `index.ts`).
        - [x] Frontend: Develop UI for managing global skills (`AdminSkillsPage.tsx` with `SkillFormModal.tsx` using global modal system).
    - [x] **Modal Interactions Collection (TRD Sec 3.2.6, API per TRD Sec 4.1.7)**
        - [x] Backend: Design and implement Firestore schema for `Modal Interactions` collection (`modalInteraction.types.ts`).
        - [x] Backend: Implement API: `POST /api/modal-interactions` - Log modal interaction event (`logModalInteraction` in `modalInteractions.ts`, exported via `index.ts`).
        - [x] Frontend: Implement client-side logic to capture and send modal interaction data (OPEN, CLOSE with duration, SUBMIT_SUCCESS, SUBMIT_FAIL with outcomes/errors) via `ModalContext.tsx` and `SkillFormModal.tsx`.
    - [x] **Analytics Collection (TRD Sec 3.2.5, API per TRD Sec 4.1.8)**
        - [x] Backend: Design and implement Firestore schema for `Analytics` collection (`analytics.types.ts` for raw events).
        - [x] Backend: Implement basic API for storing raw analytics events (`logAnalyticsEvent` in `analytics.ts`, exported via `index.ts`).
        - [ ] Backend: Implement APIs for retrieving/aggregating analytics (placeholder for Phase 1, more in Phase 2).
        - [x] Frontend: Implement client-side logic to capture and send analytics event data (page views in `App.tsx`, skill CRUD events in `AdminSkillsPage.tsx` and `SkillFormModal.tsx`) using `trackEvent` helper.
    - [ ] (Placeholder) Implement Modal Configuration API (TRD Sec 4.1.7 - if needed for dynamic modal behavior). (Deferred)

## II. Phase 1: Core Resource Management (3-4 months)

### A. Feature: Resource Profile Management (PRD User Story 1.1, Lines 49-70; TRD Sec 3.2.1, 4.1.2)

#### 1. Backend (Firebase Cloud Functions & Firestore)
    - [/] Design and implement Firestore schema for `Resources` collection (as per TRD Sec 3.2.1, including `info`, `skills.certifications` details, `availability.exceptions`, `rates.history`, `performance`, `preferences`, and `modalState`). (TypeScript interfaces defined; Firestore setup & rules pending Firebase project initialization)
    - [ ] Implement backend logic for managing `resource.modalState` (TRD Sec 3.2.1).
    - [/] Implement API: `POST /api/resources` - Create new resource (TRD Sec 4.1.2). (Core logic implemented; comprehensive input validation as per TRD schema and uniqueness checks pending)
        - [x] Include all fields as per TRD Sec 3.2.1. (Structure and defaults in place for many; verify all TRD fields covered)
    - [/] Implement API: `GET /api/resources` - List all resources (TRD Sec 4.1.2). (Core logic implemented; pagination, filtering (by status, skills, etc.), sorting pending)
    - [x] Implement API: `GET /api/resources/{id}` - Get resource details (TRD Sec 4.1.2).
    - [x] Implement API: `PUT /api/resources/{id}` - Update resource (TRD Sec 4.1.2). (Includes audit log update; ensure all TRD fields are updatable).
    - [x] Implement API: `GET /api/resources/{id}/skills` - Get resource skills (TRD Sec 4.1.2).
    - [ ] Implement API: `GET /api/resources/{id}/schedule` (TRD Sec 4.1.2 - currently in `schedules.ts`, confirm final location).
    - [x] Implement logic for tracking changes to profiles with audit history (PRD Line 69). (Creation and update logs implemented)
    - [/] Implement secure storage and access control for rate information (PRD Line 68; TRD Sec 3.2.1 `rates`). (Data structure in place; Firestore rules pending Firebase project initialization)
    - [x] Refactor `listResources`, `getResourceById`, `updateResource`, `getResourceSkills` for testability (similar to `createResourceLogic`).
    - [ ] New tests needed for validation & uniqueness in `createResourceLogic` against TRD schema.
    - [ ] New tests needed for pagination, filtering, sorting in `listResourcesLogic`.
    - [ ] New tests needed for `updateResourceLogic` (validation against TRD schema, audit log).
    - [ ] New tests needed for `getResourceByIdLogic`, `getResourceSkillsLogic`.

    - [ ] Define system for managing performance review cycles (e.g., defining start/end dates for cycles, how they reset/archive). (User requirement)
#### 2. Frontend (React, Material UI, Tailwind CSS)
    - [x] Develop UI for creating resource profiles (PRD Line 65). (ResourceForm.tsx and CreateResourcePage.tsx created - adapt to use modals for sub-sections if appropriate, e.g., adding skills, certifications, availability exceptions - TRD Sec 2.2.5)
        - [x] Form for personal information (as per TRD `info` fields).
        - [x] Interface for adding/rating skills and certifications (as per TRD `skills` and `certifications` structure, potentially modal-driven).
        - [x] Interface for defining work arrangements, time off, and availability exceptions (as per TRD `availability`, potentially modal-driven).
        - [x] Interface for inputting rate information (as per TRD `rates`, including history; access control pending app-level role logic).
        - [x] Interface for managing resource preferences and performance notes (as per TRD `preferences`, `performance`).
        - [x] Define `ResourcePreferences` type and add to `Resource` type in `resource.types.ts`.
        - [x] Create `PreferencesFormSection.tsx` for resource preferences UI.
        - [x] Integrate `PreferencesFormSection.tsx` into `ResourceForm.tsx` and update state.
        - [x] Create `PerformanceFormSection.tsx` for historical performance metrics UI.
        - [x] Design and implement `PerformanceMetricModal.tsx` for adding/editing performance entries.
            - [/] **Debug and Rebuild `PerformanceMetricModal.tsx` (May 2024)**
                - [x] Resolved `<body><div /></body>` rendering issue by:
                    - Correcting prop names in tests (`isOpen` vs `open`).
                    - Ensuring `initialData` prop handling was consistent.
                    - Fixing `ModalContext.Provider` value in test helper (`renderWithModalContext`).
                - [x] `renderWithModalContext` in `PerformanceMetricModal.test.tsx` now provides a correctly typed context value.
                - [x] `defaultProps` in `PerformanceMetricModal.test.tsx` corrected (`isOpen: true`, `initialData: undefined`).
                - [x] `PerformanceMetricModal.tsx` incrementally rebuilt to:
                    - Accept `isOpen`, `onClose`, `onSubmit`, `initialData` props.
                    - Use `useContext(ModalContext)` (variable currently unused).
                    - Display conditional title ("Add Performance Metric" / "Edit Performance Metric").
                    - Include a "Cancel" button calling `onClose`.
                - [x] First 3 tests passing: basic render, edit title, cancel button.
                - [ ] **Next Steps for `PerformanceMetricModal.tsx`:**
                    - [x] Add `DialogContent`.
                    - [x] Add state for form fields (metric name, description, rating, review date, notes).
                    - [x] Add MUI `TextField` (metric name, description), `Rating`, `LocalizationProvider`/`DatePicker`, `TextField` (notes).
                    - [x] Add "Save Metric" button.
                    - [x] Implement `handleSubmit` (validation, call `onSubmit`, call `onClose`).
                    - [x] Implement `useEffect` to populate form from `initialData`.
                    - [x] Implement `useEffect` to call `modalContext.logModalAction`.
                    - [x] Fix remaining 2 failing tests (validation errors).
                    - [x] Add comprehensive tests for all features (editing, edge cases, etc.).
        - [x] Integrate `PerformanceFormSection.tsx` (with modal) into `ResourceForm.tsx` and update state.

    - [x] **Align frontend data models and components with TRD specifications for Resource Management.**
        - [x] Refactor `Resource` type in `resource.types.ts` to align with TRD schema (Sec 3.2.1), including:
            - [x] Update `info` field structure.
            - [x] Restructure `skills` and `certifications` in `resource.types.ts`: `skills` to use `SkillEndorsement[]` (with `skillId`), `certifications` to use `Certification[]` (TRD aligned).
            - [x] Update `availability` field structure.
            - [x] Update `rates` field structure (review for alignment).
            - [x] Align `performance` data representation in `resource.types.ts`: Use `PerformanceMetric[]` for an array of historical entries (TRD aligned).
            - [x] Update `preferences` field structure to be specific as per TRD.
        - [x] Update `PersonalInfoFormSection.tsx` to match TRD `info` structure. (Changes made directly in `ResourceForm.tsx`)
        - [x] Refactor `SkillsCertsFormSection.tsx`, `ResourceSkillModal.tsx`, and `ResourceCertificationModal.tsx` (TRD Alignment):
            - [x] `SkillsCertsFormSection.tsx` (Completed):
                - [x] Update types, props, and rendering for `SkillEndorsement[]` and `Certification[]`.
                - [x] Align modal interactions (`ResourceSkillModal`, `ResourceCertificationModal`).
            - [x] `ResourceSkillModal.tsx` (Completed):
                - [x] Replace `ResourceSkillData` with `SkillEndorsement`.
                - [x] Update props to use `SkillEndorsement`.
                - [x] Address problematic global `Skill` import with local `GlobalSkill` interface.
                - [x] Update state variables (proficiency, yearsExperience, add lastUsedDate, interestLevel, notes).
                - [x] Update `useEffect` for `initialData`.
                - [x] Update `handleSubmit` logic.
                - [x] Update UI elements for new fields (proficiency, lastUsedDate, interestLevel, notes).
            - [x] `ResourceCertificationModal.tsx` (Completed):
                - [x] Update import from `CertificationDetail` to `Certification`.
                - [x] Update props interface (`onSubmit`, `initialData`).
                - [x] Update state variables (`issuingBody`, `detailsLink`, remove `skillsCoveredInput`).
                - [x] Update `useEffect` for `initialData`.
                - [x] Update `handleSubmit` logic (generate ID for new, use new fields, remove `skillsCovered`).
                - [x] Update UI elements (labels, state linkage, remove `skillsCovered` field).
        - [x] Update `AvailabilityFormSection.tsx` and `ResourceAvailabilityExceptionModal.tsx` to match TRD `availability` structure.
            - [x] `resource.types.ts`: Updated Availability, WorkHours, ExceptionEntry etc.
            - [x] `ResourceForm.tsx`: Updated availability state initialization.
            - [x] `AvailabilityFormSection.tsx`:
                - [x] Update imports, state destructuring, daysOfWeek type.
                - [x] Update Work Arrangement Type Select and add Time Zone field.
                - [x] Refactor handleWorkArrangementTypeChange.
                - [x] Refactor handleDayHoursChange (use start/end, remove hours field).
                - [x] Refactor Standard Hours UI (use workHours, start/end, remove hours field, adjust conditional rendering).
                - [x] Refactor Exceptions/Time Off section (use exceptions, align with ExceptionEntry).
            - [x] `ResourceAvailabilityExceptionModal.tsx`: Refactor to use ExceptionEntry (removed hoursUnavailable, updated type handling).
        - [x] Update `PreferencesFormSection.tsx` to match TRD `preferences` structure.
        - [x] Review and update `PerformanceFormSection.tsx` and `PerformanceMetricModal.tsx` based on clarified `performance` data representation.
          - [x] `PerformanceFormSection.tsx`: Updated to use `PerformanceMetric[]`, aligned list rendering.
          - [x] `PerformanceMetricModal.tsx`: Updated to use `PerformanceMetric`, added `uuid` for ID generation, updated state, form fields, and submission logic.
        - [x] Re-evaluate and update other related components (e.g., `ResourceForm.tsx`, `ResourceDetailPage.tsx`) for TRD alignment. (ResourceForm.tsx availability prop verified as OK; ResourceDetailPage.tsx mock data and rendering logic updated).
            - [x] `ResourceDetailPage.tsx`: Update MOCK_SINGLE_RESOURCE.availability to match new Availability structure (workHours, timeZone, exceptions).
            - [x] `ResourceDetailPage.tsx`: Update MOCK_SINGLE_RESOURCE.rates to include currency.
            - [x] `ResourceDetailPage.tsx`: Add `preferences` field to MOCK_SINGLE_RESOURCE with sample data.
            - [x] `ResourceDetailPage.tsx`: Update rendering logic for `personalInfo` to use new fields.
            - [x] `ResourceDetailPage.tsx`: Update rendering logic for `availability` (workArrangement, workHours, timeZone, exceptions).
            - [x] `ResourceDetailPage.tsx`: Update rendering logic for `rates` to include `currency`.
            - [x] `ResourceDetailPage.tsx`: Add new section to display `ResourcePreferences`.
    - [ ] **Develop UI for viewing and listing resource profiles (PRD Line 341)**
        - [ ] **Resource Detail Page (`ResourceDetailPage.tsx`) - Full TRD Compliance & API Integration**
            - [ ] **Core Display Logic & Structure:**
                - [x] Fetch resource data by ID using API call (replace mock data).
                - [/] Ensure basic layout displays all sections (Personal Info, Skills, Availability, Rates (partially blocked), Performance, Preferences, Audit Log).
            - [ ] **Display Personal Information (TRD `info` fields):**
                - [x] Verify all fields from `Resource.info` are displayed.
            - [ ] **Display Skills & Certifications (TRD `skills`, `certifications`):**
                - [x] Display list of `SkillEndorsement` with all details (skill name, proficiency, experience, last used, interest, notes). (Assumes skillName is populated by API; key fixed)
                - [x] Display list of `Certification` with all details (name, issuing body, valid until, link, credentialId).
            - [x] **Display Availability Information (TRD `availability`):**
                - [x] Verify work arrangement type, time zone are displayed. (Comment removed)
                - [x] Verify standard weekly work hours (start/end for each day) are displayed.
                - [x] Verify list of availability exceptions/time off is displayed. (Key fixed)
            - [ ] **Display Rate Information (TRD `rates`):**
                - [x] Verify current rate and currency are displayed.
                - [ ] Verify rate history (with effective dates) is displayed. (Blocked: Not in current `Rates` type; requires type update & API support)
                - [ ] Implement access control for rate information based on user role (PRD Line 68) - (Frontend check + Backend enforcement). (Blocked: Requires user role context & backend support)
            - [x] **Display Performance History (TRD `performance`):**
                - [x] Verify list of `PerformanceMetric` entries is displayed. (Updated to match current `PerformanceMetric` type)
            - [x] **Display Preferences (TRD `preferences`):**
                - [x] Verify all fields from `Resource.preferences` are displayed. (Updated to match current `ResourcePreferences` type)
            - [x] **Display Audit History (PRD Line 69):**
                - [x] Fetch and display audit log entries related to the resource. (UI exists via `AuditLogDisplay`; assumes API populates `resource.auditLog`)
            - [x] **General UI/UX:**
                - [/] Ensure responsive design. (MUI Grid `xs`/`md` used; visual check pending)
                - [x] Add "Edit" button linking to the resource edit page/form. (Already present)
                - [x] Add "Back to List" button. (Already present)
        - [x] **Resource List Page (`ResourceListPage.tsx`) - API Integration & Advanced Filtering**
            - [x] Fetch list of resources using API call (replace mock data).
            - [x] Implement advanced filtering:
                - [x] Basic filtering (name, email, status, skill name). (Client-side filtering for name, email, status, skill name implemented and fixed)
                - [x] Add filter for Availability (Work Arrangement Type).
                - [x] Add filter for Rate Range (Standard Rate, e.g., min/max input).
                - [x] Design and Add UI elements for new filters. (Covered by specific filter UI additions)
                - [x] Implement filtering logic for new filters within `ResourceListPage.tsx`. (Covered by specific filter logic additions)
            - [x] Implement sorting:
                - [x] Add UI elements for selecting sort key (e.g., Name, Status) and direction (ASC/DESC).
                - [x] Add state variables for current sort key and direction.
                - [x] Implement sorting logic within `ResourceListPage.tsx` (e.g., in `useMemo` after filtering).
            - [x] Implement pagination.
            - [x] Ensure `ResourceCard.tsx` displays summary information correctly from API data.
    - [/] Develop UI for updating resource profiles. (Initial UpdateResourcePage.tsx reusing ResourceForm.tsx. API integration pending; adapt to use modals as appropriate).
    - [x] Develop UI for viewing resource skills. (Covered by ResourceDetailPage.tsx - ensure all TRD skill fields shown).
    - [x] Develop UI for viewing audit history of profile changes. (AuditLogDisplay.tsx created, integrated with mock data)
    - [ ] Implement API service calls from frontend to backend for all Resource Profile Management features, ensuring all TRD fields are handled.
    - [x] Develop standard modals for resource sub-tasks (e.g., add/edit skill, add/edit certification, manage availability exceptions) (TRD Sec 2.2.5). (Implemented `ResourceSkillModal`, `ResourceCertificationModal`, `ResourceAvailabilityExceptionModal`)
        - [x] Update `ResourceCertificationModal.tsx` to use MUI X DatePicker.
        - [x] Update `ResourceAvailabilityExceptionModal.tsx` to use MUI X DatePicker.

#### 3. Testing
    - [~] Unit tests for backend resource management logic (Cloud Functions). (Jest setup complete. `createResourceLogic` validation error tests PASSING. `createResourceLogic` success test FAILING due to `firebase-admin` initializeApp mock issue. Other function tests PENDING - expand to cover all TRD fields and logic).
    - [ ] Unit tests for frontend resource management components (including modal interactions).
        - [ ] **`PerformanceFormSection.tsx` Tests:** (Test rendering, adding, editing, and deleting performance metrics)
            - [x] Setup test file `PerformanceFormSection.test.tsx` with necessary mocks (props, modal context).
            - [ ] Test initial rendering (title, empty state, list of metrics with correct data, "Add New Metric" button).
            - [ ] Test "Add New Metric" functionality:
                - [ ] Verify modal opens.
                - [ ] Verify `onMetricsChange` is called with the new metric on modal submission.
            - [ ] Test "Edit Metric" functionality:
                - [ ] Verify modal opens with correct `initialData`.
                - [ ] Verify `onMetricsChange` is called with the updated metric on modal submission.
            - [ ] Test "Delete Metric" functionality:
                - [ ] Verify `onMetricsChange` is called with the metric removed (consider confirmation if any).
        - [x] `PerformanceMetricModal.tsx`: Debugging non-rendering issue and writing comprehensive tests. (Covered by items 98-106)
    - [ ] Integration tests for Resource Management APIs (as per TRD Sec 4.1.2). (PENDING - Blocked by Firebase project setup)
    - [ ] E2E tests for creating, viewing, and updating resource profiles, including modal-driven workflows.
            - [x] Confirmed basic MUI components (`Button`, `Dialog`) render correctly in tests.
            - [x] Verified mocks for date pickers and `uuid`.
            - [x] Attempted `try...catch` in component, no errors caught.
            - [x] Attempted commenting out `useEffect` body, no change in rendering.
            - [x] Systematically strip down `PerformanceMetricModal.tsx` to a minimal version and test rendering.
            - [~] Incrementally add back features to the minimal `PerformanceMetricModal.tsx` to identify the breaking point. (Current focus)
            - [ ] Resolve the root cause of non-rendering.
            - [ ] Write comprehensive tests (successful submission, editing, field population, specific validations, fix incorrect button text in existing test).
### B. Feature: Project Definition and Management (Basic) (PRD User Story 2.1, Lines 71-93; TRD Sec 3.2.2, 4.1.3)

#### 1. Backend
    - [x] Design and implement Firestore schema for `Projects` and `Tasks` collections (basic fields for Phase 1, ensure alignment with TRD Sec 3.2.2, including `info`, `budget` details, `phases`, `tasks` structure, `risks`, `documents`, and `modalViewHistory`). (TypeScript interfaces defined in `project.types.ts` - update to match TRD).
    - [ ] Implement backend logic for managing `project.modalViewHistory` (TRD Sec 3.2.2).
    - [x] Refactor `AuditLogEntry` to a shared types file (imported from `resource.types.ts` into `project.types.ts`).
    - [x] Implement API: `POST /api/projects` - Create new project (TRD Sec 4.1.3). (Refactored to `createProjectLogic` - update to handle TRD schema).
    - [x] Implement API: `GET /api/projects` - List all projects (TRD Sec 4.1.3). (Refactored to `listProjectsLogic` - update for TRD schema, pagination, filtering).
    - [x] Implement API: `GET /api/projects/{id}` - Get project details (TRD Sec 4.1.3). (Refactored to `getProjectByIdLogic` - update for TRD schema).
    - [x] Implement API: `PUT /api/projects/{id}` - Update project (TRD Sec 4.1.3). (Refactored to `updateProjectLogic` - update for TRD schema).
    - [x] Implement API: `POST /api/projects/{id}/tasks` - Create new task (TRD Sec 4.1.3). (Refactored to `createTaskLogic` - update for TRD schema).
    - [x] Implement API: `GET /api/projects/{id}/tasks` - Get project tasks (TRD Sec 4.1.3). (Refactored to `listTasksLogic` - update for TRD schema).
    - [x] Implement API: `PUT /api/projects/{id}/tasks/{taskId}` - Update task (TRD Sec 4.1.3). (Refactored to `updateTaskLogic` - update for TRD schema).

#### 2. Frontend
    - [X] Develop UI for creating new projects (`CreateProjectPage.tsx`, `ProjectForm.tsx` - basic structure, mock submission - adapt for TRD schema and potential modal usage for sub-sections, TRD Sec 2.2.5).
    - [X] Develop UI for listing projects (`ProjectListPage.tsx` - basic structure, mock data - adapt for TRD schema).
    - [X] Develop UI for viewing project details (`ProjectDetailPage.tsx` - basic structure, mock data - adapt for TRD schema, including phases, tasks, risks, documents).
    - [X] Develop UI for updating projects (`UpdateProjectPage.tsx` using `ProjectForm.tsx` - basic structure, mock data & submission - adapt for TRD schema and modals).
    - [X] Develop UI for defining tasks within a project (Placeholder `TaskForm.tsx` created - adapt for TRD schema and modal usage).
    - [X] Develop UI for viewing and updating tasks (Placeholder `TaskList.tsx` created - adapt for TRD schema and modal usage).
    - [ ] Develop standard modals for project/task sub-sections (e.g., adding phases, tasks, risks, documents) (TRD Sec 2.2.5).

#### 3. Testing
    - [/] Unit tests for backend project/task management logic (Cloud Functions - `projects.ts` - update tests for TRD schema and new logic):
        - [X] `createProjectLogic` (validation tests PASSING; success case PASSING after fixing mock assertion from `mockFirestoreSet` to `mockFirestoreAdd`)
        - [x] `listProjectsLogic` (basic tests PASSING; pagination, filtering, sorting PENDING implementation in SUT)
        - [x] `getProjectByIdLogic` (tests PASSING)
        - [x] `updateProjectLogic` (validation, audit log tests PASSING)
        - [x] `createTaskLogic` (validation, audit log, project existence tests PASSING)
        - [x] `listTasksLogic` (basic tests PASSING; pagination, filtering, sorting PENDING implementation in SUT, project existence test PASSING)
        - [x] `updateTaskLogic` (validation, audit log, project/task existence tests PASSING)
    - [ ] Unit tests for frontend project/task components (including modal interactions).
    - [ ] Integration tests for Project Management APIs (as per TRD Sec 4.1.3). (PENDING - Blocked by Firebase project setup)
    - [ ] E2E tests for creating and managing basic projects and tasks, including modal-driven workflows.

### C. Feature: Simple Scheduling Interface & Conflict Detection (PRD User Story 3.1, Lines 94-117 - partial; User Story 4.1, Lines 118-137 - partial; TRD Sec 3.2.3, 4.1.4)
(Many tasks previously PENDING, re-evaluate based on TRD and modal system)
#### 1. Backend
    - [X] Design and implement Firestore schema for `Schedules` collection (created `schedule.types.ts`, updated `project.types.ts` - align with TRD Sec 3.2.3, including `modalOrigin`).
    - [ ] Ensure schedule creation logic captures `modalOrigin` if applicable (TRD Sec 3.2.3).
    - [/] Implement API: `POST /api/schedules/assign` - Assign resource to task (TRD Sec 4.1.4). (Initial version in `schedules.ts`, includes batching; advanced conflict detection & hour distribution PENDING; ensure TRD schema for schedule entry is used).
    - [X] Implement API: `GET /api/resources/{id}/schedule` - Get resource schedule (implemented in `schedules.ts` - TRD Sec 4.1.2, also listed under Resource APIs).
    - [X] Implement API: `POST /api/schedules/calendar` - Get calendar view for multiple resources (TRD Sec 4.1.4) (implemented in `schedules.ts` as POST; 30 resource ID limit noted).
    - [/] Logic to update availability calendars automatically upon assignment (partially addressed by creating `ScheduleEntry` records; comprehensive solution PENDING, ensure consistency with TRD `resource.availability`).
    - [ ] Implement API: `GET /api/schedules/conflicts` (TRD Sec 4.1.4) - Check for scheduling conflicts (basic version for Phase 1).

#### 2. Frontend
    - [X] Develop basic scheduling interface (Calendar view: day/week) (`SchedulingPage.tsx`, `CalendarView.tsx` with FullCalendar - TRD Sec 6.1.4, WIREFRAMES.md).
    - [X] UI to select project, task, and resource for assignment (`AssignmentForm.tsx` created and added to `SchedulingPage.tsx` - adapt to be modal-driven as per TRD Sec 2.2.5, WIREFRAMES.md).
    - [/] UI to display ranked list of suitable resources (Placeholder `RankedResourceList.tsx` created; integration PENDING - may be part of assignment modal).
    - [ ] UI to highlight basic scheduling conflicts (Will be addressed via calendar event styling and form feedback; PENDING backend enhancements for conflict detection API).
    - [ ] UI for team members to view their schedules (Leverage `CalendarView` with filtered data; PENDING specific page/view, potentially modal for quick view).
    - [ ] UI for project managers to view resource allocation timeline (Leverage `CalendarView` with filtered data; PENDING specific page/view).

#### 3. Testing
    - [ ] Unit tests for scheduling and conflict detection logic (backend - cover TRD schema and `modalOrigin`).
    - [ ] Unit tests for frontend scheduling components (including modal interactions for assignment).
    - [ ] Integration tests for Scheduling APIs (as per TRD Sec 4.1.4).
    - [ ] E2E tests for assigning resources and viewing schedules, including modal-driven assignment.

### D. Feature: Calendar Integration for Availability Tracking (Covered by Resource Profile & Scheduling; TRD Sec 2.2.4 Google Calendar API, Sec 3.2.1 resource.availability)
(All tasks under this section are PENDING)
    - [ ] Ensure resource availability (as per TRD Sec 3.2.1 `availability` including `vacations`, `exceptions`) is accurately reflected in scheduling UI.
    - [ ] Ensure assignments update resource availability (both in Plannar's `Schedules` and potentially sync to Google Calendar - TRD Sec 2.2.4).
    - [ ] Backend: Develop logic for Google Calendar API integration (sync assignments) (TRD Sec 2.2.4) - (Consider for later in Phase 1 or Phase 2 due to complexity).

### E. Feature: Basic Reporting Functionality (PRD User Story 6.1, Lines 158-178 - partial; TRD Sec 3.2.5 Analytics Collection, 4.1.8 Analytics API)
(All tasks under this section are PENDING)
#### 1. Backend
    - [ ] Develop Cloud Functions for basic resource utilization reports (leveraging `Analytics` collection or direct queries - TRD Sec 3.2.5).
    - [ ] Develop Cloud Functions for basic project cost reports (leveraging `Analytics` collection or direct queries).
    - [ ] Backend: Implement data aggregation logic to populate `Analytics` collection for these basic reports.

#### 2. Frontend
    - [ ] Develop UI for Dashboard (as per `sample_wireframe.md`, PRD, and TRD Sec 6.1.2 - ensure data from `Analytics` collection can be displayed).
    - [ ] Develop UI for basic resource utilization report (displaying data from `Analytics` collection or direct queries).
    - [ ] Develop UI for basic project cost report (displaying data from `Analytics` collection or direct queries).
    - [ ] Implement export for basic reports (CSV initially).

#### 3. Testing
    - [ ] Unit tests for reporting aggregation logic.
    - [ ] Unit tests for frontend reporting components and dashboard.
    - [ ] Integration tests for data aggregation and Analytics API (TRD Sec 4.1.8).
    - [ ] E2E tests for viewing dashboard and basic reports.

### F. Feature: Notifications (PRD User Story 3.1, Lines 108, 116; TRD Sec 2.2.4 Email Notifications, Sec 3.2.1 resource.preferences.notificationPreferences)
(All tasks under this section are PENDING)
    - [ ] Backend: Implement logic for sending email notifications (e.g., via Firebase services or third-party like SendGrid) upon assignment, respecting user preferences (TRD Sec 3.2.1).
    - [ ] Frontend: Implement in-app notification system (e.g., toast messages, notification panel as in `sample_wireframe.md`) for assignments and other key events, respecting user preferences.
    - [ ] Consider Firebase Cloud Messaging (FCM) for push notifications (TRD Sec 2.3 item 9) if mobile app or advanced web notifications are prioritized.

### Milestone: Phase 1 Completion
    - [ ] All core resource management (TRD compliant), basic project definition (TRD compliant), simple scheduling (modal-driven, TRD compliant), foundational modal system, core data collections (`Skills`, `ModalInteractions`, basic `Analytics`), and basic reporting features implemented and tested.
    - [ ] Internal demo and feedback session.

## III. Phase 2: Advanced Scheduling Features (2-3 months)

### A. Feature: Enhanced Constraint Management (PRD User Story 3.1, Lines 105-106; TRD Sec 3.2.1 resource.maxAssignments, maxHoursPerDay; TRD Sec 3.2.2 tasks.allowDoubleBooking)
    - [ ] Backend: Enforce maximum 2 simultaneous assignments per person (PRD Line 105, DB schema line 239 - TRD Sec 3.2.1 `resources.maxAssignments`).
    - [ ] Backend: Prevent double-booking except for specifically qualified resources (PRD Line 106, Project Task `allowDoubleBooking` PRD Line 271 - TRD Sec 3.2.2 `tasks.allowDoubleBooking`).
    - [ ] Backend: Enforce max hours per day for resources (PRD DB schema line 240 - TRD Sec 3.2.1 `resources.maxHoursPerDay`).
    - [ ] Frontend: Clearly indicate constraint violations in UI (e.g., in scheduling modals, calendar views).

### B. Feature: Multi-project Resource Allocation
    - [ ] Backend: Enhance conflict checking for multi-project scenarios.
    - [ ] Frontend: Improve UI to visualize and manage allocations across multiple projects for a single resource (potentially new modal views or enhanced calendar displays).

### C. Feature: Schedule Management and Conflict Resolution (PRD User Story 4.1, Lines 120-137; TRD Sec 2.2.3 AI Conflict Detection, Sec 3.2.1 resource.status)
    - [ ] Backend: Logic to detect conflicts when project timelines are adjusted (PRD Line 126).
    - [ ] Backend: Logic to handle resource departures (identify affected projects, suggest replacements - potentially AI assisted) (PRD Line 129; TRD Sec 3.2.1 `resource.status` = 'Departing').
    - [ ] Backend: Logic to manage resource onboarding (gradual capacity based on `resource.status` = 'Onboarding') (PRD Line 130, Resource status line 241 - TRD Sec 3.2.1).
    - [ ] Frontend: UI to adjust project timelines and visualize impact on resource availability (PRD Lines 127, 133 - potentially using modals for editing timelines).
    - [ ] Frontend: UI to display suggestions for resolving conflicts (manual options initially, later AI-driven from MCP - TRD Sec 2.2.3) (PRD Line 128 - likely in a conflict resolution modal).
    - [ ] Frontend: Notifications for resource departures and suggestions for replacements (manual/AI) (PRD Line 135).

### D. Feature: Cost Tracking and Budget Management (PRD User Story 2.1, 3.1; TRD Sec 3.2.1 rates, Sec 3.2.2 budget, Sec 3.2.3 schedules.hoursLogged)
    - [ ] Backend: Calculate and store cost implications of assignment choices (regular, overtime, weekend rates from TRD Sec 3.2.1 `resources.rates`) (PRD Line 107, 279).
    - [ ] Backend: Track project budget (allocated, consumed, remaining, breakdown, history as per TRD Sec 3.2.2 `projects.budget`) accurately (PRD Lines 85, 253-256).
    - [ ] Frontend: Display cost implications in real-time during assignment (e.g., in assignment modal) (PRD Line 115).
    - [ ] Frontend: Budget tracking visualization for projects (as per TRD Sec 3.2.2 `projects.budget` and PRD Line 352).

### E. Feature: Expanded Reporting and Analytics (PRD User Story 6.1, Lines 166-178; TRD Sec 3.2.5 Analytics Collection, 4.1.8 Analytics API, 2.2.5 Modal Analytics)
    - [ ] Backend: Develop functions for (populating `Analytics` collection or via direct queries):
        - [ ] Detailed resource utilization reports (across projects, time periods) (PRD Line 166).
        - [ ] Cost analysis reports (planned vs. actual using TRD `projects.budget` and calculated assignment costs) (PRD Line 167).
        - [ ] Skill utilization metrics (leveraging TRD `resources.skills` and `projects.tasks.requiredSkills`) (PRD Line 168).
        - [ ] Modal usage and effectiveness reports (leveraging `Modal Interactions` collection - TRD Sec 3.2.6, 2.2.5).
    - [ ] Frontend:
        - [ ] UI for advanced filtering on reports (PRD Line 174).
        - [ ] Enhanced visualizations for reports (PRD Line 175).
        - [ ] UI for skill utilization reports.
        - [ ] UI for capacity planning forecasts (basic visualization) (PRD Line 169).
        - [ ] UI for modal analytics reports.
        - [ ] Implement PDF and Excel export for reports (PRD Line 170).
        - [ ] Drill-down capabilities in reports (PRD Line 177).

### F. General Enhancements
    - [ ] Frontend: Drag-and-drop assignment capability in scheduling interface (PRD Line 357 - ensure works with modal-based assignment if adopted).
    - [ ] Frontend: Month view for calendar (PRD Line 355 - already in FullCalendar, ensure fully integrated).
    - [ ] Frontend: Filter by project/resource/skill in scheduling interface (PRD Line 359).
    - [ ] Mobile Application: Begin development of core features for React Native app (TRD Sec 2.2.1), focusing on viewing schedules and resource profiles, with adaptive modals.

### Milestone: Phase 2 Completion
    - [ ] All advanced scheduling, constraint management, cost tracking, expanded reporting (including modal analytics), and initial mobile app features implemented and tested.
    - [ ] Internal demo and feedback session.

## IV. Phase 3: AI and Optimization (3-4 months)

### A. Feature: MCP Integration for AI-powered Suggestions (PRD User Story 5.1, Lines 138-157; TRD Sec 2.2.3 MCP-Based AI Services, Sec 4.1.5 MCP AI Services API)
    - [ ] Setup MCP servers (PRD Line 204; TRD Sec 2.2.3).
    - [ ] Integrate MCP with Firebase using MCP Toolbox for Databases (PRD Line 205).
    - [ ] Develop specialized MCP servers for resource matching, budget analysis, schedule optimization, conflict detection, schedule generation (PRD Line 206; TRD Sec 2.2.3).
    - [ ] Implement APIs for MCP AI Services (TRD Sec 4.1.5).

### B. Feature: AI - Resource Matching Algorithms (PRD Lines 146-147, 153-155; TRD Sec 2.2.3)
    - [ ] Backend (MCP): Develop and train AI models for resource matching based on skills, proficiency, availability, cost, preferences (TRD Sec 3.2.1 `resources.skills`, `resources.preferences`, etc.). (Existing API: `POST /mcp/resource-matching` PRD Line 323)
    - [ ] AI Model: Develop/configure Gemini model for resource matching.
    - [ ] Frontend: Integrate AI resource matching suggestions into the assignment modal/UI (ranked list, match scores) (PRD Line 369).
    - [ ] Frontend: Allow users to accept/reject suggestions (PRD Line 155).

### C. Feature: AI - Budget Optimization Recommendations (PRD Lines 147-148, 153-155; TRD Sec 2.2.3)
    - [ ] Backend (MCP): Develop AI models for budget optimization (resource substitutions, schedule adjustments to minimize overtime/premium rates). (Existing API: `POST /mcp/budget-optimization` PRD Line 324)
    - [ ] AI Model: Develop/configure Gemini model to analyze allocations for cost optimization (PRD Line 146).
        - [ ] Suggest resource substitutions (maintain quality, reduce cost) (PRD Line 147).
        - [ ] Suggest schedule adjustments (minimize overtime/premium rates) (PRD Line 148).
    - [ ] Frontend: Display AI budget optimization recommendations (with estimated savings, quality impact) in AI Recommendation Center or relevant modals (PRD Line 370).
        - [ ] Display estimated savings and quality impact (PRD Line 154).

### D. Feature: AI - Schedule Conflict Resolution & Generation (PRD Lines 128, 148; TRD Sec 2.2.3)
    - [ ] Backend (MCP): Enhance AI for detecting complex schedule conflicts and suggesting resolutions. (Existing API: `POST /mcp/schedule-conflicts` PRD Line 325)
    - [ ] AI Model: Develop/configure Gemini model to detect and suggest resolutions for scheduling conflicts (reallocation, rescheduling) (PRD Line 128).
    - [ ] Backend (MCP): Develop AI for generating optimized schedules based on project needs and resource constraints (TRD Sec 2.2.3 `Schedule Generation`).
    - [ ] Frontend: Integrate AI conflict resolution suggestions into UI (e.g., conflict modals) (PRD Line 372).
    - [ ] Frontend: (Advanced) UI for AI-assisted schedule generation.

### E. Feature: AI - Task Consolidation & Skill Development (PRD Lines 149-150, 156; TRD Sec 2.2.3)
    - [ ] AI Model: Identify opportunities for task consolidation (PRD Line 149).
    - [ ] AI Model: Recommend skill development paths to address capability gaps (PRD Line 150; TRD `Skills` collection, `resources.skills`).
    - [ ] Frontend: UI in AI Recommendation Center for skill development proposals (PRD Line 371).
    - [ ] Frontend: UI for task consolidation suggestions.

### F. Feature: Predictive Analytics for Capacity (PRD Line 169)
    - [ ] AI Model: Develop/configure model for capacity planning forecasts (PRD Line 169).
    - [ ] Frontend: UI for visualizing capacity forecasting charts in Reports & Analytics (PRD Line 365).

### Milestone: Phase 3 Completion
    - [ ] Full MCP integration and AI-powered features for resource matching, budget optimization, conflict resolution, and basic predictive analytics implemented and tested.
    - [ ] AI Recommendation Center UI (PRD Lines 368-373) is functional.
    - [ ] User feedback collected on AI features.
    - [ ] Full system demo and UAT readiness.

## V. Post-Launch & Future Enhancements (Derived from TRD Sec 2.2.1, 2.2.4 and general best practices)

- [ ] **Mobile Application Enhancement (TRD Sec 2.2.1)**
    - [ ] Expand mobile app features (e.g., creating/editing tasks, managing time off, push notifications via FCM).
    - [ ] Conduct usability testing specific to mobile.
- [ ] **External Integrations (TRD Sec 2.2.4)**
    - [ ] Deepen Google Calendar API integration (bi-directional sync if not already fully implemented).
    - [ ] Integrate with Financial Systems for cost tracking.
    - [ ] Explore other third-party integrations as identified (e.g., HR systems).
- [ ] **Advanced Analytics and Reporting**
    - [ ] More sophisticated dashboards and custom report building capabilities.
    - [ ] Deeper performance analytics based on `Modal Interactions` and `Analytics` collections.
- [ ] **Security Enhancements**
    - [ ] Regular security audits and penetration testing.
    - [ ] Advanced threat monitoring and response.
- [ ] **Performance Optimization and Scalability**
    - [ ] Continuous monitoring and optimization for large datasets and user loads based on NFRs.
    - [ ] Database optimization and query tuning.
- [ ] **Accessibility (WCAG 2.1 Compliance - TRD Sec 1.4)**
    - [ ] Conduct full accessibility audit post-launch and address any remaining issues.
    - [ ] Establish ongoing accessibility checks.
- [ ] **Internationalization (i18n) and Localization (l10n)**
    - [ ] Prepare application for multiple languages and regions if business needs arise.

## VI. Cross-Cutting Concerns & General Tasks

### A. UI/UX Design System & Refinement
    - [ ] Finalize comprehensive style guide and component library (TRD Sec 6.1.1).
    - [ ] Conduct usability testing sessions at the end of each phase.
    - [ ] Iterate on UI/UX based on feedback.
    - [ ] Incorporate Accessibility (A11y) considerations and testing throughout design and development (TRD Sec 1.4, 6.5).
    - [ ] Ensure all UI screens from PRD (Lines 331-373) and `sample_wireframe.md` are implemented with high fidelity.
        - [ ] Dashboard (PRD Lines 333-339, `sample_wireframe.md`, TRD Sec 6.1.2)
        - [ ] Resource Management (PRD Lines 340-346, TRD Sec 6.1.3)
        - [ ] Project Management (PRD Lines 347-353, TRD Sec 6.1.3)
        - [ ] Scheduling Interface (PRD Lines 354-360, TRD Sec 6.1.4)
        - [ ] Reports and Analytics (PRD Lines 361-367, TRD Sec 6.1.5)
        - [ ] AI Recommendation Center (PRD Lines 368-373, TRD Sec 6.1.6)

### B. Testing Strategy & Implementation
    - [ ] Define and implement comprehensive testing strategy (unit, integration, E2E, performance, security - TRD Sec 7).
    - [ ] Define key Non-Functional Requirements (NFRs) for performance (e.g., page load times, API response times under X concurrent users - TRD Sec 5.1, 5.2).
    - [ ] Setup and maintain testing environments.
    - [ ] Continuously add tests for all new features and bug fixes.
    - [ ] Plan for User Acceptance Testing (UAT).

### C. Documentation
    - [ ] Develop end-user documentation/guides (TRD Sec 8.1).
    - [ ] Develop technical documentation (API docs, architecture diagrams, setup guides - TRD Sec 8.2).
    - [ ] Keep documentation updated throughout the development lifecycle.

### D. Deployment & Infrastructure
    - [ ] Finalize Firebase project configuration for production (TRD Sec 9.1).
    - [ ] Finalize MCP server setup and configuration for production (TRD Sec 9.1).
    - [ ] Implement robust CI/CD pipeline for automated deployment to staging and production environments (TRD Sec 9.2).
    - [ ] Define backup and disaster recovery plan for Firestore data (TRD Sec 9.3).

### E. Security
    - [ ] Implement robust authentication and authorization using Firebase Authentication (TRD Sec 6.2).
    - [ ] Ensure role-based access control for different user types (Project Manager, Resource Manager, etc. - TRD Sec 3.4, 6.2.2).
        - [ ] Define key roles (e.g., Admin, Project Manager, Resource Manager, Team Member) and outline basic permission matrix.
    - [ ] Secure API endpoints (TRD Sec 6.2.3).
    - [ ] Protect sensitive data in Firestore and Cloud Storage (encryption, access rules - PRD Line 68, TRD Sec 6.2.4).
    - [ ] Conduct security audits and penetration testing before launch (TRD Sec 6.2.5).
    - [ ] Address any identified vulnerabilities.

### F. Launch Preparation
    - [ ] Conduct comprehensive User Acceptance Testing (UAT).
    - [ ] Develop launch plan and checklist.
    - [ ] Prepare marketing and communication materials (if applicable).
    - [ ] Train support staff and key users.
    - [ ] Final data migration or setup (if any).

## VII. Post-Launch Operations
    - [ ] Monitor system performance, logs, and errors.
    - [ ] Establish a process for bug fixing and maintenance.
    - [ ] Gather user feedback for future enhancements and iterations.
    - [ ] Plan for ongoing operational support.

## General/Ongoing Tasks
    - [ ] Continuously update `PRD.md` and `TRD.md` as the project evolves.
    - [ ] Monitor and address any new linting/styling issues.
    - [ ] Regularly review and update dependencies.
    - [~] Resolve `firebase-admin` mocking issue in `resources.test.ts`. (Issue identified, multiple attempts made, currently blocked)
