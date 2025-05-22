# Technical Requirements Document (TRD)

## Plannar: Advanced Resource Scheduling System
Version: 1.1
Date: May 21, 2025
Status: Draft
Classification: Confidential

## 1. Introduction

### 1.1 Purpose
This Technical Requirements Document (TRD) outlines the detailed technical specifications for Plannar, an advanced resource scheduling system designed to manage 1,000+ team members across multiple projects with granular time management, skills matching, and cost optimization capabilities. The document serves as a blueprint for the development team to build the system using Google Cloud technologies, specifically Firebase and the Model Context Protocol (MCP), with enhanced modal window implementation for seamless user experience.

### 1.2 Scope
Plannar will enable organizations to efficiently assign team members to projects based on skills, availability, and cost considerations while optimizing for efficiency and budget constraints. The system will provide granular 30-minute scheduling increments, handle diverse work arrangements, and leverage AI for optimized resource allocation. The implementation of modal windows will enable users to perform key actions without navigating away from their current context, enhancing workflow efficiency.

### 1.3 Intended Audience
- Development Team
- Quality Assurance Team
- Project Stakeholders
- System Architects
- Database Administrators
- DevOps Engineers
- UX/UI Designers

### 1.4 Project References
- Product Requirements Document (PRD) for Plannar v1.1
- Google Firebase Documentation
- Model Context Protocol (MCP) Technical Specification
- Material UI Dialog Components Documentation
- Web Accessibility Guidelines (WCAG) 2.1

## 2. System Architecture

### 2.1 High-Level Architecture Diagram
[Architecture diagram showing client applications, Firebase infrastructure, MCP-based AI services, and external integrations, with new modal management services highlighted]

### 2.2 Component Description

#### 2.2.1 Client Applications
- **Web Application**: React.js-based frontend for desktop users with enhanced modal system
- **Mobile Application**: React Native application for iOS and Android with adaptive modals
- **API Clients**: External systems connecting through REST APIs

#### 2.2.2 Firebase Infrastructure
- **Firebase Hosting**: Serves web application assets with global CDN
- **Firebase Authentication**: Handles user authentication and authorization
- **Cloud Functions**: Hosts serverless backend logic for scheduling algorithms
- **Firestore**: NoSQL document database storing resource and project data
- **Cloud Storage**: Stores documents, assets, and exported reports
- **Firebase Analytics**: Tracks user interactions and system performance, including modal usage metrics

#### 2.2.3 MCP-Based AI Services
- **Resource Matching**: AI service for matching resources to project requirements
- **Budget Optimization**: AI service for optimizing resource allocation costs
- **Conflict Detection**: AI service for identifying and resolving scheduling conflicts
- **Schedule Generation**: AI service for generating optimized schedules

#### 2.2.4 External Integrations
- **Google Calendar API**: Syncs resource assignments with calendars
- **Email Notifications**: Sends alerts and updates to users
- **Financial Systems**: Integrates with accounting for cost tracking

#### 2.2.5 Modal Management System (NEW)
- **Modal Context Provider**: React context for managing modal state
- **Modal Registry**: Central registry of available modal types
- **Modal Stack Manager**: Manages multiple modal layers when needed
- **Modal Analytics**: Tracks modal usage patterns and completion rates

### 2.3 Data Flow
1. User accesses Plannar through web or mobile application
2. Authentication request flows through Firebase Authentication
3. Application queries Firestore for resource and project data
4. User actions trigger contextual modals for key operations
5. Modal actions trigger Cloud Functions for processing
6. Complex decisions invoke MCP-based AI services
7. Results are stored in Firestore and presented to users within modals
8. Upon confirmation, modals close and the UI updates with changes
9. Notifications are sent through Firebase Cloud Messaging
10. Calendar updates are pushed through Google Calendar API
11. Reports and analytics are generated from Firestore data

## 3. Database Design

### 3.1 Database Technology
Plannar will use Google Firestore, a NoSQL document database that provides:
- Scalable, serverless data storage
- Real-time updates and synchronization
- Complex query capabilities
- Automatic multi-region replication
- Strong consistency guarantees

### 3.2 Database Schema

#### 3.2.1 Resources Collection
```javascript
resources/{resourceId}: {
  info: {
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    title: string,
    department: string,
    location: string,
    startDate: timestamp,
    endDate: timestamp (optional),
    status: string // Active, Inactive, Onboarding, Departing
  },
  skills: [{
    name: string,
    category: string,
    proficiency: number (1-10),
    yearsExperience: number,
    certifications: [{
      name: string,
      issuer: string,
      date: timestamp,
      expirationDate: timestamp,
      verificationUrl: string
    }]
  }],
  availability: {
    workArrangement: string, // Full-time, Part-time, Contract
    weeklyHours: number,
    workHours: {
      monday: { start: string, end: string },
      tuesday: { start: string, end: string },
      // etc. for all days
    },
    timeZone: string,
    vacations: [{
      start: timestamp,
      end: timestamp,
      status: string // Planned, Approved, In Progress
    }],
    exceptions: [{
      date: timestamp,
      available: boolean,
      note: string
    }]
  },
  rates: {
    standard: number,
    overtime: number,
    weekend: number,
    currency: string,
    effectiveDate: timestamp,
    history: [{
      standard: number,
      overtime: number,
      weekend: number,
      effectiveDate: timestamp,
      endDate: timestamp
    }]
  },
  performance: {
    averageRating: number,
    completedProjects: number,
    onTimeDelivery: number, // percentage
    lastReviewDate: timestamp,
    notes: string
  },
  preferences: {
    preferredProjects: [string],
    preferredRoles: [string],
    developmentGoals: [string],
    notificationPreferences: {
      email: boolean,
      inApp: boolean,
      sms: boolean
    }
  },
  modalState: { // NEW - persisted state for complex modal interactions
    lastModalType: string,
    savedProgress: object,
    formState: object,
    lastUpdated: timestamp
  }
}
```

#### 3.2.2 Projects Collection
```javascript
projects/{projectId}: {
  info: {
    id: string,
    name: string,
    description: string,
    client: string,
    startDate: timestamp,
    endDate: timestamp,
    status: string, // Planning, Active, On Hold, Completed
    priority: number (1-5),
    manager: string (userId),
    department: string,
    tags: [string]
  },
  budget: {
    allocated: number,
    consumed: number,
    remaining: number,
    currency: string,
    breakdown: [{
      category: string,
      allocated: number,
      consumed: number
    }],
    history: [{
      allocated: number,
      date: timestamp,
      reason: string,
      approvedBy: string (userId)
    }]
  },
  phases: [{
    id: string,
    name: string,
    description: string,
    startDate: timestamp,
    endDate: timestamp,
    status: string,
    deliverables: [string]
  }],
  tasks: [{
    id: string,
    name: string,
    description: string,
    phaseId: string,
    startDate: timestamp,
    endDate: timestamp,
    status: string,
    priority: number (1-5),
    effort: number, // in hours
    requiredSkills: [{
      name: string,
      minProficiency: number (1-10),
      preferred: boolean
    }],
    assignedResources: [{
      resourceId: string,
      hours: number,
      role: string
    }],
    dependencies: [{
      taskId: string,
      type: string // Start-to-Start, Start-to-Finish, etc.
    }]
  }],
  risks: [{
    id: string,
    description: string,
    impact: number (1-5),
    probability: number (1-5),
    status: string,
    mitigationPlan: string,
    owner: string (userId)
  }],
  documents: [{
    id: string,
    name: string,
    type: string,
    url: string,
    uploadDate: timestamp,
    uploadedBy: string (userId)
  }],
  modalViewHistory: { // NEW - tracking modal interactions within project context
    recentModals: [{
      type: string,
      timestamp: timestamp,
      action: string,
      result: string
    }],
    favoriteActions: [{
      modalType: string,
      count: number
    }]
  }
}
```

#### 3.2.3 Schedules Collection
```javascript
schedules/{scheduleId}: {
  resourceId: string,
  projectId: string,
  taskId: string,
  date: timestamp,
  startTime: string,
  endTime: string,
  status: string, // Planned, Confirmed, Completed, Cancelled
  hoursLogged: number,
  notes: string,
  createdBy: string (userId),
  createdAt: timestamp,
  updatedAt: timestamp,
  modalOrigin: string // NEW - tracks which modal created this schedule entry
}
```

#### 3.2.4 Skills Collection
```javascript
skills/{skillId}: {
  name: string,
  category: string,
  description: string,
  relatedSkills: [string],
  certifications: [string],
  demand: number // Organizational demand rating
}
```

#### 3.2.5 Analytics Collection
```javascript
analytics/{entryId}: {
  timestamp: timestamp,
  type: string, // Resource Utilization, Project Progress, etc.
  data: object,
  period: {
    start: timestamp,
    end: timestamp
  }
}
```

#### 3.2.6 Modal Interactions Collection (NEW)
```javascript
modalInteractions/{interactionId}: {
  userId: string,
  modalType: string,
  actionPath: [string], // sequence of actions within modal
  startTime: timestamp,
  endTime: timestamp,
  completionStatus: string, // Completed, Abandoned, Error
  sourceComponent: string, // component that triggered the modal
  sourceContext: object, // contextual information about where modal was triggered
  performanceMetrics: {
    loadTime: number, // milliseconds
    renderTime: number,
    interactionTime: number,
    apiLatency: object // keyed by API call
  },
  result: {
    success: boolean,
    errorMessage: string,
    createdEntities: [string], // IDs of created/modified records
    changes: object // summary of changes made
  }
}
```

### 3.3 Database Indexing Strategy

#### 3.3.1 Single-Field Indexes
- resources/skills.name: For skill-based resource queries
- resources/availability.workArrangement: For filtering by work arrangement
- resources/status: For filtering active/inactive resources
- projects/info.status: For filtering active projects
- schedules/date: For date-based schedule queries
- tasks/status: For task status filtering
- modalInteractions/modalType: For modal usage analytics (NEW)
- modalInteractions/completionStatus: For tracking completion rates (NEW)

#### 3.3.2 Composite Indexes
- resources/skills.name,skills.proficiency: For skill proficiency filtering
- projects/info.startDate,info.endDate: For timeline queries
- schedules/resourceId,date: For resource schedule queries
- tasks/requiredSkills.name,requiredSkills.minProficiency: For skill requirement matching
- modalInteractions/userId,modalType: For user-specific modal analytics (NEW)
- modalInteractions/modalType,completionStatus: For modal success rate analysis (NEW)
- modalInteractions/sourceComponent,modalType: For context-specific analytics (NEW)

### 3.4 Data Validation Rules
Firestore security rules will enforce the following validations:

```javascript
service cloud.firestore {
  match /databases/{database}/documents {
    // Resource access rules
    match /resources/{resourceId} {
      allow read: if isAuthenticated() && (hasRole('admin') || hasRole('resource_manager') || hasRole('project_manager') || resource.data.info.id == request.auth.uid);
      allow write: if isAuthenticated() && (hasRole('admin') || hasRole('resource_manager'));
      
      // Validation rules
      allow create: if validResourceData(request.resource.data);
      allow update: if validResourceData(request.resource.data);
    }
    
    // Project access rules
    match /projects/{projectId} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated() && (hasRole('admin') || hasRole('project_manager') || isProjectManager(projectId));
      
      // Validation rules
      allow create: if validProjectData(request.resource.data);
      allow update: if validProjectData(request.resource.data);
    }
    
    // Schedule access rules
    match /schedules/{scheduleId} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated() && (hasRole('admin') || hasRole('project_manager') || hasRole('resource_manager'));
      
      // Validation rules
      allow create: if validScheduleData(request.resource.data);
      allow update: if validScheduleData(request.resource.data) && canModifySchedule(scheduleId);
    }
    
    // Modal Interactions access rules (NEW)
    match /modalInteractions/{interactionId} {
      allow read: if isAuthenticated() && hasRole('admin');
      allow create: if isAuthenticated();
      allow update: if isAuthenticated() && resource.data.userId == request.auth.uid;
      allow delete: if isAuthenticated() && hasRole('admin');
    }
    
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function hasRole(role) {
      return request.auth.token.roles[role] == true;
    }
    
    function isProjectManager(projectId) {
      return get(/databases/$(database)/documents/projects/$(projectId)).data.info.manager == request.auth.uid;
    }
    
    function validResourceData(data) {
      // Various validation rules for resource data
      return data.info.firstName is string &&
             data.info.lastName is string &&
             data.info.email is string &&
             data.info.email.matches('^[^@]+@[^@]+\\.[^@]+$') &&
             // More validation rules...
             true;
    }
    
    function validProjectData(data) {
      // Various validation rules for project data
      return data.info.name is string &&
             data.info.startDate is timestamp &&
             data.info.endDate is timestamp &&
             data.info.endDate > data.info.startDate &&
             // More validation rules...
             true;
    }
    
    function validScheduleData(data) {
      // Various validation rules for schedule data
      return data.resourceId is string &&
             data.projectId is string &&
             data.taskId is string &&
             data.date is timestamp &&
             data.startTime is string &&
             data.endTime is string &&
             // More validation rules...
             true;
    }
    
    function canModifySchedule(scheduleId) {
      let schedule = get(/databases/$(database)/documents/schedules/$(scheduleId)).data;
      return hasRole('admin') || 
             schedule.createdBy == request.auth.uid ||
             isProjectManager(schedule.projectId);
    }
  }
}
```

## 4. API Specifications

### 4.1 REST API Endpoints

#### 4.1.1 Authentication API
| Endpoint | Method | Description | Request Parameters | Response |
|----------|--------|-------------|-------------------|----------|
| /api/auth/login | POST | Authenticate user | email, password | JWT token |
| /api/auth/logout | POST | End user session | Auth header | Success status |
| /api/auth/refresh | POST | Refresh JWT token | Refresh token | New JWT token |
| /api/auth/user | GET | Get current user info | Auth header | User object |

#### 4.1.2 Resources API
| Endpoint | Method | Description | Request Parameters | Response |
|----------|--------|-------------|-------------------|----------|
| /api/resources | GET | List all resources | Pagination, filters | Array of resources |
| /api/resources | POST | Create new resource | Resource object | Created resource |
| /api/resources/{id} | GET | Get resource details | Resource ID | Resource object |
| /api/resources/{id} | PUT | Update resource | Resource ID, update object | Updated resource |
| /api/resources/{id} | DELETE | Delete resource | Resource ID | Success status |
| /api/resources/{id}/skills | GET | Get resource skills | Resource ID | Skills array |
| /api/resources/{id}/availability | GET | Get resource availability | Resource ID, date range | Availability object |
| /api/resources/{id}/schedule | GET | Get resource schedule | Resource ID, date range | Schedule object |
| /api/resources/{id}/assignments | GET | Get resource assignments | Resource ID, date range | Assignments array |

#### 4.1.3 Projects API
| Endpoint | Method | Description | Request Parameters | Response |
|----------|--------|-------------|-------------------|----------|
| /api/projects | GET | List all projects | Pagination, filters | Array of projects |
| /api/projects | POST | Create new project | Project object | Created project |
| /api/projects/{id} | GET | Get project details | Project ID | Project object |
| /api/projects/{id} | PUT | Update project | Project ID, update object | Updated project |
| /api/projects/{id} | DELETE | Delete project | Project ID | Success status |
| /api/projects/{id}/tasks | GET | Get project tasks | Project ID | Tasks array |
| /api/projects/{id}/tasks | POST | Create project task | Project ID, task object | Created task |
| /api/projects/{id}/tasks/{taskId} | PUT | Update project task | Project ID, task ID, update object | Updated task |
| /api/projects/{id}/tasks/{taskId} | DELETE | Delete project task | Project ID, task ID | Success status |
| /api/projects/{id}/assignments | GET | Get project assignments | Project ID | Assignments array |
| /api/projects/{id}/budget | GET | Get project budget | Project ID | Budget object |

#### 4.1.4 Scheduling API
| Endpoint | Method | Description | Request Parameters | Response |
|----------|--------|-------------|-------------------|----------|
| /api/schedules/assign | POST | Assign resource to task | Assignment object | Created assignment |
| /api/schedules/unassign | POST | Remove resource from task | Assignment ID | Success status |
| /api/schedules/conflicts | GET | Check for scheduling conflicts | Resources, date range, projects | Conflicts array |
| /api/schedules/optimize | POST | Run schedule optimization | Projects, optimization parameters | Optimization results |
| /api/schedules/calendar | GET | Get calendar view | Resources, date range | Calendar data |
| /api/schedules/availability | GET | Check resource availability | Resources, date range | Availability data |

#### 4.1.5 Reports API
| Endpoint | Method | Description | Request Parameters | Response |
|----------|--------|-------------|-------------------|----------|
| /api/reports/utilization | GET | Get resource utilization report | Date range, resources | Utilization data |
| /api/reports/costs | GET | Get project cost report | Projects, date range | Cost report data |
| /api/reports/skills | GET | Get skill distribution report | Categories, proficiency ranges | Skill distribution data |
| /api/reports/export | POST | Export report to file | Report type, parameters | File URL |

#### 4.1.6 Modal Data API (NEW)
| Endpoint | Method | Description | Request Parameters | Response |
|----------|--------|-------------|-------------------|----------|
| /api/modals/resource-assignment | GET | Get data for resource assignment modal | taskId, date range | Resource matches, availability |
| /api/modals/conflict-resolution | GET | Get data for conflict resolution | conflictId | Conflict details, resolution options |
| /api/modals/skill-update | GET | Get data for skill update modal | resourceId | Current skills, available skills |
| /api/modals/budget-adjustment | GET | Get data for budget modal | projectId | Budget allocation, impact analysis |
| /api/modals/recommendations | GET | Get AI recommendations for modal | contextType, entityId | Ranked recommendations |
| /api/modals/report-config | GET | Get report configuration options | reportType | Available parameters, formats |
| /api/modals/analytics/track | POST | Track modal usage analytics | Interaction data | Success status |
| /api/modals/state/save | POST | Save modal state for later use | State data, userId | Success status |
| /api/modals/state/load | GET | Load saved modal state | modalType, userId | Saved state object |

### 4.2 MCP API Specifications

#### 4.2.1 Resource Matching MCP
- **Tool Name**: match_resources_to_project
- **Description**: Match best resources to a project based on skills and availability
- **Parameters**:
  - projectId: string - The ID of the project needing resources
  - taskId: string - The ID of the specific task
  - startDate: string (date) - Task start date
  - endDate: string (date) - Task end date
  - priorityLevel: number - Task priority (1-5)
- **Return Value**:
  ```json
  {
    "matches": [
      {
        "resourceId": "string",
        "name": "string",
        "skillMatch": 0.95,
        "availabilityMatch": 0.8,
        "costEfficiency": 0.75,
        "overallMatch": 0.85,
        "notes": "string"
      }
    ],
    "alternativeOptions": [
      {
        "resourceId": "string",
        "name": "string",
        "skillMatch": 0.8,
        "availabilityMatch": 0.9,
        "costEfficiency": 0.85,
        "overallMatch": 0.82,
        "notes": "string"
      }
    ]
  }
  ```

#### 4.2.2 Budget Optimization MCP
- **Tool Name**: optimize_project_budget
- **Description**: Analyze and optimize resource allocation for budget constraints
- **Parameters**:
  - projectId: string - The ID of the project to optimize
  - targetReduction: number - Target percentage reduction (optional)
  - preserveQuality: boolean - Whether to maintain quality thresholds
  - allowRescheduling: boolean - Whether to consider timeline adjustments
- **Return Value**:
  ```json
  {
    "currentCost": 120000,
    "optimizedCost": 105000,
    "savingsPercentage": 12.5,
    "recommendations": [
      {
        "type": "resourceSubstitution",
        "currentResource": "string",
        "recommendedResource": "string",
        "task": "string",
        "savingsAmount": 5000,
        "qualityImpact": -0.05,
        "implementation": "string"
      }
    ],
    "scheduleAdjustments": [
      {
        "taskId": "string",
        "currentStartDate": "string",
        "recommendedStartDate": "string",
        "savingsAmount": 3000,
        "riskLevel": "low"
      }
    ]
  }
  ```

#### 4.2.3 Conflict Resolution MCP
- **Tool Name**: resolve_scheduling_conflicts
- **Description**: Detect and resolve resource scheduling conflicts
- **Parameters**:
  - resourceId: string - The ID of the conflicted resource
  - conflicts: array - Array of conflicting assignments
  - prioritizationRules: object - Rules for prioritization
- **Return Value**:
  ```json
  {
    "conflictCount": 3,
    "resolutionOptions": [
      {
        "option": "reschedule",
        "details": {
          "taskId": "string",
          "currentDate": "string",
          "recommendedDate": "string",
          "impact": "low",
          "affectedParties": []
        }
      },
      {
        "option": "reassign",
        "details": {
          "taskId": "string",
          "currentResource": "string",
          "recommendedResource": "string",
          "skillMatchPercentage": 92,
          "costImpact": -200
        }
      }
    ],
    "recommendedOption": "reschedule"
  }
  ```

#### 4.2.4 Skill Gap Analysis MCP
- **Tool Name**: analyze_skill_gaps
- **Description**: Identify skill gaps and development opportunities
- **Parameters**:
  - projectId: string - The ID of the project to analyze
  - resourcePool: array - Resources to consider
  - futureProjects: array - Upcoming projects to include in analysis
- **Return Value**:
  ```json
  {
    "currentGaps": [
      {
        "skill": "React Native",
        "requiredLevel": 8,
        "availableLevel": 5,
        "impactedProjects": ["string"],
        "developmentOptions": ["string"]
      }
    ],
    "futureGaps": [
      {
        "skill": "GraphQL",
        "timeframe": "Q3 2025",
        "requiredLevel": 7,
        "currentResources": [],
        "developmentOptions": ["string"]
      }
    ],
    "recommendations": [
      {
        "resourceId": "string",
        "recommendedSkills": ["string"],
        "developmentPath": "string",
        "timeframe": "3 months"
      }
    ]
  }
  ```

#### 4.2.5 Modal Content Optimization MCP (NEW)
- **Tool Name**: optimize_modal_content
- **Description**: Dynamically optimize content and layout of modals based on context
- **Parameters**:
  - modalType: string - Type of modal being displayed
  - userContext: object - User role, history, and preferences
  - deviceContext: object - Screen size, device type
  - applicationContext: object - Current page, active features
- **Return Value**:
  ```json
  {
    "prioritizedFields": ["string"],
    "recommendedLayout": "string",
    "fieldGroups": [
      {
        "groupName": "Essential",
        "fields": ["string"]
      }
    ],
    "prePopulatedValues": {
      "field": "value"
    },
    "dynamicHelp": [
      {
        "field": "string",
        "triggerCondition": "string",
        "helpText": "string"
      }
    ],
    "userBehaviorInsights": {
      "commonPatterns": ["string"],
      "painPoints": ["string"]
    }
  }
  ```

### 4.3 API Authentication and Security

#### 4.3.1 Authentication Mechanisms
- Firebase Authentication with JWT tokens
- API key authentication for service-to-service communication
- OAuth 2.0 for third-party integrations
- Modal-specific session tokens for long-running modal operations (NEW)

#### 4.3.2 Security Measures
- HTTPS for all endpoints
- JWT expiration and refresh policies
- Role-based access control
- Rate limiting for API endpoints
- Input validation and sanitization
- Cross-Site Request Forgery (CSRF) protection for modal form submissions (NEW)
- Modal-specific transaction tokens for critical operations (NEW)

#### 4.3.3 API Access Control
| User Role | Resources API | Projects API | Scheduling API | Reports API | Modal API |
|-----------|--------------|-------------|---------------|------------|-----------|
| Admin | Full access | Full access | Full access | Full access | Full access |
| Project Manager | Read access | Full access | Full access | Read access | Full access to project-related modals |
| Resource Manager | Full access | Read access | Full access | Read access | Full access to resource-related modals |
| Team Member | Read own | Read assigned | Read own | Limited access | Limited to personal modals |

### 4.4 Modal-Specific API Considerations (NEW)

#### 4.4.1 Performance Requirements
- Modal data endpoints must respond in <300ms for optimal UX
- Endpoints should return minimal data required for initial modal rendering
- Progressive loading for complex modals with multiple data dependencies
- Caching strategies for frequently accessed modal data

#### 4.4.2 Error Handling
- Graceful error handling within modal context
- Ability to retry operations without closing modal
- Clear error messages specific to modal context
- Fallback options when modal operations fail

#### 4.4.3 Security Considerations
- Same authentication requirements as main application
- Additional validation for modal-specific operations
- CSRF protection for all modal form submissions
- Rate limiting for modal-specific endpoints

## 5. Frontend Technical Specifications

### 5.1 Technology Stack
- Framework: React.js 18.0+
- Type System: TypeScript 5.0+
- State Management: Redux Toolkit
- UI Component Library: Material UI v5
- Modal System: Custom React Context with Material UI Dialog components
- CSS Framework: Styled Components
- Data Fetching: React Query
- Form Handling: React Hook Form
- Animation: Framer Motion
- Visualization: D3.js, Google Charts
- Testing: Jest, React Testing Library, Cypress

### 5.2 Application Architecture
- Component Architecture: Atomic Design Pattern
- State Management: Redux slices for domain-specific state
- Modal Management: Context API with custom hooks
- Routing: React Router v6 with code splitting
- API Integration: Custom hooks with React Query
- Authentication: Firebase Authentication with context
- Error Handling: Global error boundary and error tracking
- Internationalization: React-i18next

### 5.3 Core Components

#### 5.3.1 Resource Management Components
- ResourceList: Displays filterable list of resources
- ResourceDetail: Shows detailed view of a resource
- SkillMatrix: Manages resource skills and proficiency
- AvailabilityCalendar: Shows and edits resource availability
- ResourceForm: Creates and updates resource profiles

#### 5.3.2 Project Management Components
- ProjectList: Displays filterable list of projects
- ProjectDetail: Shows detailed view of a project
- TaskBoard: Kanban-style view of project tasks
- TaskDetail: Shows and edits task details
- RequirementBuilder: Defines skill requirements for tasks

#### 5.3.3 Scheduling Components
- ScheduleCalendar: Calendar view of assignments
- ResourceTimeline: Gantt-style timeline of resource schedules
- AssignmentModal: Interface for creating assignments
- ConflictResolver: Interface for resolving scheduling conflicts
- UtilizationChart: Visualization of resource utilization

#### 5.3.4 Reporting Components
- ReportDashboard: Overview of key metrics
- UtilizationReport: Detailed resource utilization reporting
- CostReport: Project cost analysis and visualization
- SkillsReport: Organizational skill distribution
- ExportControls: Report export functionality

### 5.4 Modal Component Architecture (NEW)

#### 5.4.1 Modal System Core Components
- **ModalProvider**: Context provider wrapping the application
- **ModalContainer**: Dynamic container for rendering active modals
- **ModalWrapper**: Base component handling common modal behaviors
- **ModalStack**: Manages multiple open modals when needed
- **useModal**: Custom hook for opening and managing modals

#### 5.4.2 Modal Types
- **ResourceAssignmentModal**: Quick resource assignment interface
- **ConflictResolutionModal**: Conflict detection and resolution interface
- **SkillUpdateModal**: Quick skill profile updating
- **BudgetAdjustmentModal**: Budget modification interface
- **RecommendationModal**: AI-powered resource recommendations
- **ReportGenerationModal**: Quick report configuration and generation
- **ConfirmationModal**: Generic confirmation dialogs
- **NotificationModal**: Enhanced notification displays

#### 5.4.3 Modal Component Hierarchy
```
ModalProvider
└── ModalContainer
    └── ModalStack
        ├── ModalWrapper
        │   └── [Specific Modal Component]
        │       ├── Modal Header
        │       ├── Modal Content
        │       └── Modal Actions
        └── ModalWrapper
            └── [Another Modal Component]
```

#### 5.4.4 Modal State Management
- Centralized modal state in ModalContext
- Local state for individual modal instances
- Redux integration for modals requiring application state
- Modal history tracking for complex workflows
- Persistent state for multi-step modals

### 5.5 Responsive Design Specifications

#### 5.5.1 Breakpoints
- Mobile: 0-600px
- Tablet: 600-960px
- Desktop: 960px+

#### 5.5.2 Layout Strategy
- Mobile: Single column, stacked views, simplified controls, full-screen modals
- Tablet: Two-column layout, adapted visualizations, large modals
- Desktop: Multi-column layout, full-featured visualizations, standard modals

#### 5.5.3 Component Adaptations
- Calendar views simplify on smaller screens
- Tables convert to cards on mobile
- Complex forms split into multi-step wizards on mobile
- Modals adjust size and layout based on screen dimensions
- Touch-optimized controls for mobile modals

#### 5.5.4 Modal Responsive Behavior
- Full-screen modals on mobile devices
- Centered dialog modals on tablets and desktops
- Simplified content and controls on smaller screens
- Adjustable height based on content and screen size
- Touch-friendly button sizing and spacing on mobile

### 5.6 Performance Considerations
- Code splitting for route-based lazy loading
- Dynamic import of modal components
- Virtualized lists for handling large datasets
- Memoization of expensive calculations
- Client-side caching of API responses
- Progressive loading of modal content
- Image and asset optimization
- Service worker for offline capabilities
- Modal-specific performance monitoring

### 5.7 Accessibility Requirements for Modals (NEW)
- Focus management when modals open and close
- Trap focus within active modal
- ARIA roles and attributes for modal dialogs
- Keyboard navigation within modals (Tab, Escape, Enter)
- Screen reader announcements for modal actions
- Sufficient color contrast for all modal elements
- Keyboard shortcuts for common modal actions
- Accessible form validation and error messages
- Compatibility with screen readers and assistive technologies

## 6. Backend Technical Specifications

### 6.1 Cloud Functions Implementation

#### 6.1.1 Authentication Functions
- createUser: Creates new user accounts and sets up initial permissions
- updateUserRoles: Modifies user role assignments
- verifyEmail: Handles email verification process
- resetPassword: Manages password reset workflow

#### 6.1.2 Resource Management Functions
- createResource: Creates new resource profiles
- updateResource: Updates resource information
- calculateResourceAvailability: Computes availability based on assignments
- syncResourceCalendar: Synchronizes with Google Calendar
- computeResourceUtilization: Calculates utilization metrics

#### 6.1.3 Scheduling Functions
- assignResourceToTask: Creates resource assignment
- detectSchedulingConflicts: Identifies conflicts in schedules
- generateScheduleOptions: Creates possible scheduling scenarios
- optimizeProjectAssignments: Optimizes assignments based on constraints
- recalculateProjectTimeline: Updates project timeline based on assignments

#### 6.1.4 Analytics Functions
- generateUtilizationReport: Creates resource utilization reports
- calculateProjectCosts: Computes actual and projected project costs
- analyzeSkillDistribution: Analyzes organizational skill distribution
- forecastResourceNeeds: Forecasts future resource requirements
- exportReportData: Exports report data to various formats

#### 6.1.5 Modal Support Functions (NEW)
- getModalInitialData: Retrieves context-specific data for modals
- processModalAction: Handles actions initiated from modals
- validateModalInput: Validates user input from modal forms
- generateModalRecommendations: Creates AI-powered recommendations for modals
- resolveModalConflicts: Processes conflict resolution from modal
- saveModalState: Persists state for multi-step modals
- trackModalAnalytics: Records modal usage analytics
- loadModalFormData: Loads pre-populated form data for modals

### 6.2 MCP Server Implementation

#### 6.2.1 Server Architecture
- Node.js-based MCP servers
- Express.js for HTTP handling
- Firebase Admin SDK for Firestore access
- Gemini 3.7 API integration for AI capabilities

#### 6.2.2 Resource Matching MCP Implementation
```javascript
// Example implementation (simplified)
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-3.7-pro' });

exports.matchResourcesToProject = functions.https.onCall(async (data, context) => {
  // Verify authentication
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Authentication required');
  }
  
  const { projectId, taskId, startDate, endDate, priorityLevel } = data;
  
  // Retrieve task requirements
  const taskRef = admin.firestore().collection('projects').doc(projectId)
    .collection('tasks').doc(taskId);
  const taskDoc = await taskRef.get();
  if (!taskDoc.exists) {
    throw new functions.https.HttpsError('not-found', 'Task not found');
  }
  
  const taskData = taskDoc.data();
  const requiredSkills = taskData.requiredSkills || [];
  
  // Query resources matching skills
  const resourcesQuery = admin.firestore().collection('resources')
    .where('status', '==', 'Active');
  const resourcesSnapshot = await resourcesQuery.get();
  
  // Calculate availability for the date range
  const availabilityData = await calculateAvailability(
    resourcesSnapshot.docs.map(doc => doc.id), 
    startDate, 
    endDate
  );
  
  // Prepare data for MCP
  const mcpInputData = {
    task: {
      id: taskId,
      name: taskData.name,
      requiredSkills,
      startDate,
      endDate,
      priorityLevel
    },
    resources: resourcesSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: `${data.info.firstName} ${data.info.lastName}`,
        skills: data.skills || [],
        availability: availabilityData[doc.id] || 0,
        rates: data.rates
      };
    })
  };
  
  // Use Gemini to match resources
  const result = await model.generateContent({
    contents: [{
      parts: [{
        text: JSON.stringify(mcpInputData)
      }]
    }],
    tools: [{
      functionDeclarations: [{
        name: "match_resources_to_project",
        description: "Match best resources to a project based on skills and availability",
        parameters: {
          type: "object",
          properties: {
            matches: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  resourceId: { type: "string" },
                  name: { type: "string" },
                  skillMatch: { type: "number" },
                  availabilityMatch: { type: "number" },
                  costEfficiency: { type: "number" },
                  overallMatch: { type: "number" },
                  notes: { type: "string" }
                }
              }
            }
          },
          required: ["matches"]
        }
      }]
    }]
  });
  
  // Process and return results
  const matchResult = JSON.parse(result.functionResults[0].content);
  
  // Record analytics for recommendation quality
  await recordRecommendationAnalytics(taskId, matchResult);
  
  return matchResult;
});

async function calculateAvailability(resourceIds, startDate, endDate) {
  // Implementation to calculate resource availability
  // ...
}

async function recordRecommendationAnalytics(taskId, results) {
  // Implementation to record analytics
  // ...
}
```

#### 6.2.3 Budget Optimization MCP Implementation
```javascript
// Similar implementation pattern for budget optimization MCP
```

#### 6.2.4 Modal Content Optimization MCP Implementation (NEW)
```javascript
// Example implementation for optimizing modal content
exports.optimizeModalContent = functions.https.onCall(async (data, context) => {
  // Verify authentication
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Authentication required');
  }
  
  const { modalType, userContext, deviceContext, applicationContext } = data;
  
  // Get user history with this modal type
  const userInteractions = await admin.firestore().collection('modalInteractions')
    .where('userId', '==', context.auth.uid)
    .where('modalType', '==', modalType)
    .orderBy('startTime', 'desc')
    .limit(10)
    .get();
  
  const userInteractionData = userInteractions.docs.map(doc => doc.data());
  
  // Get global patterns for this modal type
  const globalPatterns = await admin.firestore().collection('modalAnalytics')
    .where('modalType', '==', modalType)
    .limit(1)
    .get();
  
  const globalData = globalPatterns.empty ? {} : globalPatterns.docs[0].data();
  
  // Prepare MCP input
  const mcpInputData = {
    modalType,
    userContext: {
      ...userContext,
      interactionHistory: userInteractionData
    },
    deviceContext,
    applicationContext,
    globalPatterns: globalData
  };
  
  // Use Gemini to optimize content
  const result = await model.generateContent({
    contents: [{
      parts: [{
        text: JSON.stringify(mcpInputData)
      }]
    }],
    tools: [{
      functionDeclarations: [{
        name: "optimize_modal_content",
        description: "Dynamically optimize content and layout of modals based on context",
        parameters: {
          type: "object",
          properties: {
            prioritizedFields: { type: "array", items: { type: "string" } },
            recommendedLayout: { type: "string" },
            fieldGroups: { type: "array" },
            prePopulatedValues: { type: "object" },
            dynamicHelp: { type: "array" }
          }
        }
      }]
    }]
  });
  
  // Process and return results
  const optimizationResult = JSON.parse(result.functionResults[0].content);
  
  return optimizationResult;
});
```

### 6.3 Firebase Rules and Security

#### 6.3.1 Firestore Security Rules
[Comprehensive rules shown earlier in the Database section]

#### 6.3.2 Authentication Configuration
- Email/password authentication
- Google OAuth provider integration
- Multi-factor authentication for administrators
- Password policies and account lockout settings
- Custom claims for role-based access control

#### 6.3.3 API Security Controls
- Firebase App Check for API security
- CORS configuration for frontend access
- Rate limiting on sensitive endpoints
- Request validation middleware
- API key management for service accounts
- Modal-specific security tokens for sensitive operations (NEW)

### 6.4 External Integrations

#### 6.4.1 Google Calendar Integration
- Two-way synchronization of assignments
- Calendar event creation for resource bookings
- Availability checking through Calendar API
- Meeting scheduling for project teams
- Notification management for schedule changes
- Modal-triggered calendar updates (NEW)

#### 6.4.2 Email Notification System
- Assignment notifications
- Schedule conflict alerts
- Approval request workflows
- Daily/weekly digest of upcoming assignments
- Calendar invitation delivery
- Modal action confirmations (NEW)

#### 6.4.3 Financial System Integration
- Cost data export to financial systems
- Budget import from planning systems
- Invoice generation based on time tracking
- Expense tracking for projects
- Financial reporting integration
- Modal-initiated financial transactions (NEW)

## 7. System Performance Requirements

### 7.1 Performance Benchmarks

#### 7.1.1 Response Time Targets
- API response time: <500ms for 95% of requests
- Page load time: <2 seconds for initial load
- Modal open time: <200ms from user action
- Modal data loading: <500ms for initial data
- Data retrieval operations: <1 second
- Complex scheduling operations: <5 seconds
- Report generation: <10 seconds for standard reports

#### 7.1.2 Throughput Requirements
- Support for 200+ concurrent users
- Handle 50+ simultaneous scheduling operations
- Process 1,000+ assignments per hour during peak usage
- Support 100+ concurrent modal operations
- Generate 100+ reports per hour

#### 7.1.3 Scalability Targets
- Support 1,000+ resources in the system
- Handle 500+ concurrent projects
- Manage 10,000+ tasks across all projects
- Store 5+ years of historical data
- Support organization growth to 5,000+ resources
- Handle 300+ simultaneous modal interactions

### 7.2 Database Performance Optimization

#### 7.2.1 Query Optimization Strategies
- Implementation of composite indexes for common queries
- Denormalization of frequently accessed data
- Strategic use of collection groups for cross-collection queries
- Pagination implementation for large result sets
- Cursor-based pagination for improved efficiency
- Query optimization for modal data retrieval (NEW)

#### 7.2.2 Caching Strategy
- Firestore cache configuration for offline support
- Application-level caching of reference data
- Redis caching for computed aggregate data
- Time-to-live (TTL) settings for different data types
- Cache invalidation triggers on data updates
- Modal-specific data caching (NEW)

### 7.3 Front-end Performance Optimization

#### 7.3.1 Code Optimization
- Code splitting and lazy loading of components
- Dynamic import of modal components
- Tree shaking for unused code elimination
- Memoization of expensive calculations
- Virtual scrolling for large lists
- Web worker utilization for intensive operations
- Modal state optimizations to prevent unnecessary renders

#### 7.3.2 Asset Optimization
- Image compression and lazy loading
- Font optimization and subsetting
- CSS minification and critical path extraction
- JavaScript bundle optimization
- Service worker for asset caching
- Preloading of common modal assets

#### 7.3.3 Modal-Specific Optimizations (NEW)
- Preloading of frequently used modals
- Skeleton UI for modals during data loading
- Optimistic UI updates for modal actions
- Background data fetching for anticipated modal operations
- Persistent modal state for multi-step operations
- Efficient modal animation implementations
- Modal component reuse and recycling

### 7.4 Cloud Function Performance

#### 7.4.1 Execution Optimization
- Function memory allocation based on workload
- Cold start mitigation strategies
- Asynchronous processing for non-critical operations
- Batching of related operations
- Background functions for scheduled tasks
- Modal-specific function optimization (NEW)

#### 7.4.2 Monitoring and Alerting
- Cloud Function execution time monitoring
- Error rate tracking and alerting
- Memory consumption monitoring
- Execution count and throttling alerts
- Cost monitoring and optimization
- Modal interaction performance tracking (NEW)

## 8. Testing Requirements

### 8.1 Testing Strategy

#### 8.1.1 Test Levels
- Unit Testing: Individual components and functions
- Integration Testing: API endpoints and service interactions
- System Testing: End-to-end workflows and scenarios
- Performance Testing: Load testing and stress testing
- Security Testing: Vulnerability scanning and penetration testing
- Usability Testing: User experience evaluation
- Modal Testing: Specific testing for modal interactions and flows

#### 8.1.2 Testing Tools
- Unit Testing: Jest, React Testing Library
- API Testing: Postman, Supertest
- E2E Testing: Cypress, Playwright
- Performance Testing: k6, JMeter
- Security Testing: OWASP ZAP, SonarQube
- Monitoring: Firebase Performance Monitoring
- Modal Testing: Cypress, React Testing Library, Axe for accessibility

### 8.2 Test Cases

#### 8.2.1 Resource Management Test Cases
| ID | Test Case | Description | Steps | Expected Result |
|----|-----------|-------------|-------|----------------|
| RM-TC-01 | Create Resource | Verify creation of new resource | 1. Navigate to resource page<br>2. Click "Add Resource"<br>3. Fill out form<br>4. Submit | Resource created and visible in list |
| RM-TC-02 | Update Resource Skills | Verify skill updating | 1. Open resource profile<br>2. Click "Edit Skills"<br>3. Modify skill levels<br>4. Save | Skills updated in profile |
| RM-TC-03 | Check Availability | Verify availability display | 1. Open resource calendar<br>2. Select date range<br>3. View availability | Correct availability displayed |
| RM-TC-04 | Resource Departure | Verify handling of departing resource | 1. Set resource as departing<br>2. Set last day<br>3. Submit | System identifies affected projects |

#### 8.2.2 Project Management Test Cases
| ID | Test Case | Description | Steps | Expected Result |
|----|-----------|-------------|-------|----------------|
| PM-TC-01 | Create Project | Verify project creation | 1. Navigate to projects<br>2. Click "New Project"<br>3. Fill details<br>4. Submit | Project created and visible |
| PM-TC-02 | Add Project Tasks | Verify task creation | 1. Open project<br>2. Click "Add Task"<br>3. Define task<br>4. Submit | Task added to project |
| PM-TC-03 | Define Skill Requirements | Verify skill requirements | 1. Edit task<br>2. Add skill requirements<br>3. Save | Requirements saved correctly |
| PM-TC-04 | Modify Project Timeline | Verify timeline changes | 1. Open project timeline<br>2. Adjust dates<br>3. Save | Timeline updated, conflicts identified |

#### 8.2.3 Scheduling Test Cases
| ID | Test Case | Description | Steps | Expected Result |
|----|-----------|-------------|-------|----------------|
| SC-TC-01 | Assign Resource | Verify resource assignment | 1. Open task<br>2. Click "Assign Resource"<br>3. Select resource<br>4. Submit | Resource assigned, schedule updated |
| SC-TC-02 | Detect Conflicts | Verify conflict detection | 1. Attempt double-booking<br>2. Submit assignment | Conflict detected, warning displayed |
| SC-TC-03 | Allow Double-Booking | Verify double-booking for permitted resources | 1. Enable double-booking<br>2. Assign resource to overlapping tasks | Assignment succeeds with warning |
| SC-TC-04 | Handle Schedule Change | Verify schedule change handling | 1. Modify assignment dates<br>2. Submit changes | Schedule updated, affected parties notified |

#### 8.2.4 AI Optimization Test Cases
| ID | Test Case | Description | Steps | Expected Result |
|----|-----------|-------------|-------|----------------|
| AI-TC-01 | Resource Matching | Verify skill-based matching | 1. Create task with skills<br>2. Request matches<br>3. Review results | Appropriate resources recommended |
| AI-TC-02 | Budget Optimization | Verify cost optimization | 1. Set budget target<br>2. Run optimization<br>3. Review suggestions | Cost-effective options presented |
| AI-TC-03 | Conflict Resolution | Verify conflict resolution | 1. Create scheduling conflict<br>2. Request resolution<br>3. Review options | Viable resolution options provided |
| AI-TC-04 | Skill Gap Analysis | Verify skill gap identification | 1. Define future project<br>2. Run analysis<br>3. Review gaps | Skill gaps correctly identified |

#### 8.2.5 Modal Interaction Test Cases (NEW)
| ID | Test Case | Description | Steps | Expected Result |
|----|-----------|-------------|-------|----------------|
| MDL-TC-01 | Modal Opening | Verify modal opens correctly | 1. Navigate to resource list<br>2. Click "Add Resource"<br>3. Observe modal behavior | Modal appears with animation, focus moves to modal |
| MDL-TC-02 | Modal Form Submission | Verify form submission in modal | 1. Open assignment modal<br>2. Complete form<br>3. Click submit | Data saved, modal closes with success message |
| MDL-TC-03 | Modal Keyboard Navigation | Verify keyboard accessibility | 1. Open any modal<br>2. Use Tab to navigate<br>3. Try Escape key | Focus trapped in modal, Escape closes modal |
| MDL-TC-04 | Modal Error Handling | Verify error states in modal | 1. Open form modal<br>2. Submit invalid data<br>3. Observe error handling | Errors displayed within modal, form not submitted |
| MDL-TC-05 | Multi-step Modal Flow | Verify multi-step processes | 1. Open recommendation modal<br>2. Progress through steps<br>3. Complete process | Each step functions correctly, data persists between steps |
| MDL-TC-06 | Modal Responsive Behavior | Verify responsive adaptation | 1. Open modal on desktop<br>2. Resize to tablet<br>3. Resize to mobile | Modal adapts appropriately to each screen size |
| MDL-TC-07 | Modal Stack Management | Verify multiple modal handling | 1. Open first modal<br>2. Trigger second modal<br>3. Close second modal | Modal stack renders correctly, focus returns to first modal |
| MDL-TC-08 | Modal Load Performance | Verify performance metrics | 1. Monitor open time<br>2. Measure data load time<br>3. Track rendering performance | Modal meets performance benchmarks (<200ms open, <500ms data load) |

### 8.3 Performance Test Scenarios

#### 8.3.1 Load Testing
- Scenario 1: 100 concurrent users accessing dashboard
- Scenario 2: 50 users simultaneously creating assignments
- Scenario 3: 20 users generating complex reports
- Scenario 4: 200 users viewing calendar data
- Scenario 5: 30+ users simultaneously interacting with different modals

#### 8.3.2 Stress Testing
- Scenario 1: System handling 2,000+ resources
- Scenario 2: Processing 1,000+ assignments in 1 hour
- Scenario 3: Handling 300+ simultaneous API requests
- Scenario 4: Generating 50+ concurrent complex reports
- Scenario 5: Rapid opening and closing of multiple modal types

#### 8.3.3 Endurance Testing
- Scenario 1: System running continuously for 72 hours
- Scenario 2: Continuous data synchronization for 24 hours
- Scenario 3: Repeated assignment and unassignment operations for 48 hours
- Scenario 4: Continuous modal interaction operations for 24 hours

## 9. Deployment and DevOps Requirements

### 9.1 Deployment Architecture

#### 9.1.1 Google Cloud Environment
- Firebase Project configuration
- Cloud Functions deployment regions
- Firestore database configuration
- Storage bucket setup
- MCP server deployment infrastructure

#### 9.1.2 Environment Strategy
- Development environment for active development
- Staging environment for pre-release testing
- Production environment for live system
- Environment-specific configuration management
- Isolated database instances for each environment

### 9.2 CI/CD Pipeline

#### 9.2.1 Continuous Integration
- GitHub Actions for automated testing
- Code quality checks with ESLint and SonarQube
- Unit tests execution on each commit
- Integration test execution on pull requests
- Security scanning of dependencies
- Modal-specific component testing (NEW)

#### 9.2.2 Continuous Deployment
- Automated deployment to development environment on main branch commits
- Manual approval for staging deployment
- Automated testing in staging environment
- Manual approval for production deployment
- Rollback capabilities for failed deployments
- Feature flag system for modal implementation (NEW)

### 9.3 Monitoring and Logging

#### 9.3.1 Application Monitoring
- Firebase Performance Monitoring for application metrics
- Custom metrics for business logic performance
- Error tracking and alerting
- User experience monitoring
- API performance tracking
- Modal interaction tracking and analytics (NEW)

#### 9.3.2 Infrastructure Monitoring
- **Cloud Function execution monitoring**
  - Execution time tracking with percentile analysis (p50, p90, p99)
  - Memory usage patterns and optimization
  - Cold start frequency and duration
  - Error rate tracking with alert thresholds
  - Concurrency and throttling metrics
  - Integration with Cloud Monitoring dashboards

- **Firestore monitoring**
  - Read/write operations volume by collection
  - Query performance metrics and slow query identification
  - Index usage efficiency tracking
  - Storage utilization and growth trends
  - Quota consumption with predictive alerts
  - Cache hit rates for frequently accessed data

- **Modal-specific metrics monitoring** (NEW)
  - Modal load time tracking
  - Modal action completion rates
  - API performance for modal-specific endpoints
  - User interaction patterns within modals
  - Error rates during modal operations
  - Modal responsiveness across device types

- **Storage Monitoring**
  - Bucket size and object count tracking
  - Download/upload bandwidth consumption
  - Access patterns and hotspot identification
  - Retention policy enforcement verification
  - Cost optimization opportunities

#### 9.3.3 Logging Strategy
- **Structured logging for all components**
  - JSON-formatted logs with standardized fields
  - Correlation IDs for tracing requests across services
  - Contextual metadata including user, action, and resource
  - Severity levels (DEBUG, INFO, WARN, ERROR, FATAL)
  - Source component and function identification

- **Modal-specific logging** (NEW)
  - Modal lifecycle events (open, close, submit)
  - Modal interaction tracking
  - Modal error conditions with context
  - Modal performance metrics
  - Modal usage patterns for optimization

- **Log level configuration by environment**
  - Development: DEBUG and above
  - Staging: INFO and above
  - Production: WARN and above with sampling for INFO
  - Ability to dynamically adjust log levels for troubleshooting

- **Centralized log aggregation**
  - Firebase Logging integration
  - Log export to Cloud Storage for long-term retention
  - BigQuery export for complex log analysis
  - Integration with log visualization tools
  - Alert generation from log patterns

- **Log retention policies**
  - Hot storage: 30 days
  - Cold storage: 1 year
  - Archival storage: 7 years for compliance logs
  - Automatic purging of expired logs
  - Compliance with data protection regulations

- **Audit logging for security events**
  - Authentication events (login, logout, failed attempts)
  - Authorization changes and permission modifications
  - Resource creation, modification, and deletion
  - Modal-based sensitive operations tracking
  - System configuration changes
  - API access and usage patterns

### 9.4 Alerting and Notification System (NEW)

#### 9.4.1 Alert Configuration
- **Performance Alerts**
  - API response time exceeding thresholds
  - Modal load time exceeding 500ms
  - Database query performance degradation
  - Cloud Function execution time anomalies
  - Frontend rendering performance issues

- **Error Rate Alerts**
  - Application error rate spikes
  - API endpoint failure increases
  - Modal operation failures
  - Authentication failures
  - Integration failures with external systems

- **Capacity Alerts**
  - Database storage approaching limits
  - API quota consumption reaching thresholds
  - User concurrency approaching limits
  - File storage utilization
  - Memory consumption in Cloud Functions

#### 9.4.2 Alert Notification Channels
- **Email notifications** for non-critical alerts
- **SMS alerts** for critical system failures
- **Slack integration** for team collaboration on issues
- **PagerDuty integration** for on-call rotation management
- **Dashboard visualization** of current alert status

#### 9.4.3 Alert Management
- **Alert aggregation** to prevent notification storms
- **Alert correlation** to identify related issues
- **Alert escalation** pathways for unresolved issues
- **Alert history** for trend analysis
- **Post-mortem documentation** workflow

### 9.4 Backup and Disaster Recovery

#### 9.4.1 Backup Strategy
- Automated Firestore backups
- Application configuration backups
- User data export capabilities
- Backup validation and testing
- Retention policy management

#### 9.4.2 Disaster Recovery Plan
- Recovery Point Objective (RPO): 1 hour
- Recovery Time Objective (RTO): 4 hours
- Failover procedures
- Data restoration process
- Communication plan during outages

---

## 10. Security Requirements

### 10.1 Authentication and Authorization

#### 10.1.1 Authentication Methods
- Email/password authentication
- Google OAuth integration
- Multi-factor authentication for administrators
- JWT token management
- Token expiration and refresh policies

#### 10.1.2 Authorization Model
- Role-based access control (RBAC)
- Custom claims for fine-grained permissions
- Resource-level access control
- Project-level access control
- Data access auditing

### 10.2 Data Security

#### 10.2.1 Data Encryption
- Encryption at rest for all Firestore data
- Encryption in transit using TLS/HTTPS
- Client-side encryption for sensitive data
- Key management procedures
- Certificate management

#### 10.2.2 Data Privacy
- Compliance with data protection regulations
- Personal data classification and handling
- Data minimization practices
- User consent management
- Data retention and deletion policies

### 10.3 Application Security

#### 10.3.1 Input Validation
- Server-side validation of all inputs
- Client-side validation for user experience
- Protection against injection attacks
- Request parameter sanitization
- File upload validation and scanning

#### 10.3.2 API Security
- API authentication requirements
- Rate limiting implementation
- CORS configuration
- API versioning strategy
- Security headers implementation

### 10.4 Security Testing

#### 10.4.1 Vulnerability Scanning
- Regular automated vulnerability scanning
- Dependency vulnerability checking
- Code security analysis
- Cloud configuration security analysis
- Remediation process for identified vulnerabilities

#### 10.4.2 Penetration Testing
- Annual penetration testing schedule
- Scope of penetration testing
- Third-party testing requirements
- Findings management and remediation
- Re-testing verification process

---

## 11. Compliance and Documentation

### 11.1 Compliance Requirements

#### 11.1.1 Regulatory Compliance
- Data protection regulations compliance
- Industry-specific regulations
- Corporate policy compliance
- Audit trail requirements
- Reporting obligations

#### 11.1.2 Accessibility Compliance
- WCAG 2.1 AA compliance targets
- Accessibility testing requirements
- Screen reader compatibility
- Keyboard navigation support
- Color contrast requirements

### 11.2 Documentation Requirements

#### 11.2.1 Technical Documentation
- API documentation with examples
- Database schema documentation
- Architecture diagrams
- Component interaction documentation
- Security implementation details

#### 11.2.2 User Documentation
- Administrator guide
- Project manager guide
- Resource manager guide
- Team member guide
- Troubleshooting documentation

---

## 12. Integration and Extensibility

### 12.1 Integration Interfaces

#### 12.1.1 Calendar Integration
- Google Calendar API integration details
- Outlook Calendar integration requirements
- Calendar event synchronization specifications
- Conflict handling between calendars
- Calendar permission requirements

#### 12.1.2 Email Integration
- Email notification formats
- Email delivery infrastructure
- HTML email templates
- Email tracking requirements
- Unsubscribe management

#### 12.1.3 Financial System Integration
- Financial data exchange formats
- Integration points with accounting systems
- Cost data export specifications
- Budget import requirements
- Reconciliation procedures

### 12.2 Extensibility Framework

#### 12.2.1 API Extension Points
- Custom endpoint creation
- Webhook support
- Event-driven architecture
- API versioning strategy
- Third-party extension support

#### 12.2.2 Customization Capabilities
- Custom fields for resources and projects
- Custom workflow definitions
- Report customization framework
- Dashboard widget system
- UI theme customization

---

## 13. Appendices

### 13.1 Data Migration Plan

#### 13.1.1 Source Data Analysis
- Current Excel spreadsheet structure analysis
- Data quality assessment
- Data mapping to new schema
- Gap analysis and remediation plan
- Data cleansing requirements

#### 13.1.2 Migration Strategy
- Phased migration approach
- Validation and verification procedures
- Rollback procedures
- Parallel operation period
- Cutover planning

### 13.2 Capacity Planning

#### 13.2.1 Current Requirements
- User load projections
- Data storage requirements
- API transaction volumes
- Report generation frequency
- Concurrent user estimates

#### 13.2.2 Growth Projections
- 1-year growth estimate
- 3-year growth estimate
- Scaling trigger points
- Infrastructure scaling plan
- Performance monitoring thresholds

### 13.3 Risk Register

| ID | Risk | Impact | Probability | Mitigation |
|----|------|--------|------------|------------|
| RISK-01 | Data migration complexity | High | Medium | Detailed migration planning, test migrations, data validation |
| RISK-02 | Performance issues with large datasets | High | Medium | Early performance testing, optimization, scaling plan |
| RISK-03 | User adoption challenges | Medium | High | Training program, intuitive UI, phased rollout |
| RISK-04 | Integration failures with existing systems | High | Medium | Detailed API specifications, integration testing, fallbacks |
| RISK-05 | AI recommendation quality issues | Medium | Medium | Progressive enhancement, manual overrides, continuous learning |

---

## 14. Approval and Sign-off

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Product Owner | | | |
| Technical Lead | | | |
| Security Officer | | | |
| QA Lead | | | |
| Project Manager | | | |

---

Document End