# Product Requirements Document (PRD)

## Plannar: Advanced Resource Scheduling System

### Version: 1.0
### Date: May 21, 2025
### Status: Draft

---

## Executive Summary

Plannar is a comprehensive resource scheduling and management system designed to address the complex needs of organizations with large, diverse workforces (1,000+ headcount). The system enables precise assignment of team members to projects based on skills, availability, and cost considerations while optimizing for efficiency and budget constraints. Plannar provides granular 30-minute scheduling increments, handles diverse work arrangements, and leverages AI for optimized resource allocation.

Built on Google Cloud technologies, specifically Firebase and the Model Context Protocol (MCP), Plannar revolutionizes resource management by transforming traditional spreadsheet-based scheduling into an intelligent, cloud-based solution that provides real-time insights and optimization recommendations.

---

## Problem Statement

Organizations managing large teams face significant challenges in resource allocation:

1. **Manual Processes**: Spreadsheet-based scheduling is time-consuming and error-prone
2. **Skill Matching**: Difficulty in optimally matching skills to project requirements
3. **Complex Scheduling**: Managing varying work arrangements and preventing over-allocation
4. **Cost Management**: Limited visibility into project costs and resource utilization
5. **Change Management**: Adapting to project timeline changes, staff turnover, and shifting priorities

Plannar addresses these challenges through automation, intelligent matching, and comprehensive visibility into resource allocation.

---

## Target Users

### Primary Users
- **Project Managers**: Responsible for planning and executing projects with diverse resource requirements
- **Resource Managers**: Overseeing team availability and skills development
- **Team Members**: Need visibility into their schedules and assignments

### Secondary Users
- **Finance Teams**: Monitor project costs and resource utilization
- **Executive Leadership**: Gain insights into organizational capacity and utilization
- **HR Teams**: Manage onboarding/offboarding and skill inventory

---

## User Stories & Requirements

### 1. Resource Profile Management

#### User Story 1.1
**As a** Resource Manager  
**I want to** create and maintain detailed resource profiles  
**So that** skills, availability, and costs are accurately tracked for scheduling

#### Requirements:
- Create comprehensive resource profiles with personal information, skills, availability, and rates
- Support skill taxonomy with 1-10 proficiency ratings
- Track and update work arrangements (full-time, part-time, custom schedules)
- Maintain hourly rate information including regular, overtime, and weekend rates
- Record certification and specialization details
- Track historical performance metrics

#### Acceptance Criteria:
- Resource profiles can be created, viewed, and updated through an intuitive interface
- Skills can be added and rated on a 1-10 scale with experience years
- Multiple work arrangement types are supported with custom schedule capabilities
- Rate information is securely stored and properly access-controlled
- Changes to profiles are tracked with audit history

### 2. Project Definition and Management

#### User Story 2.1
**As a** Project Manager  
**I want to** define new projects with detailed requirements  
**So that** I can accurately plan resource needs and schedules

#### Requirements:
- Create project definitions with scope, timeline, budget, and milestones
- Break projects into phases, deliverables, and tasks
- Specify required skills and minimum proficiency levels for each task
- Indicate resource quantities needed per task
- Configure task dependencies and relationships
- Set project priority levels
- Establish budget constraints and tracking

#### Acceptance Criteria:
- Projects can be created with comprehensive details through a structured interface
- Task breakdowns include skill requirements and proficiency levels
- Dependencies between tasks can be established and visualized
- Budget information is captured and trackable
- Project timelines are visualizable and adjustable

### 3. Resource Assignment and Scheduling

#### User Story 3.1
**As a** Project Manager  
**I want to** assign the best-matched resources to project tasks  
**So that** projects are staffed optimally while respecting availability constraints

#### Requirements:
- Schedule resources in 30-minute increments
- View ranked lists of suitable resources based on skill match
- Check for scheduling conflicts during assignment process
- Enforce maximum 2 simultaneous assignments per person
- Prevent double-booking except for specifically qualified resources
- Calculate and display cost implications of assignment choices
- Send notifications to team members upon assignment
- Update availability calendars automatically

#### Acceptance Criteria:
- Resources can be assigned to tasks with proper conflict checking
- System enforces maximum assignment rules (2 simultaneous projects max)
- Assignments update both project timelines and resource availability calendars
- Cost impacts are calculated and displayed in real-time
- Team members receive notifications about new assignments

### 4. Schedule Management and Conflict Resolution

#### User Story 4.1
**As a** Project Manager  
**I want to** manage changes to project timelines and resolve conflicts  
**So that** projects stay on track despite changing circumstances

#### Requirements:
- Adjust project timelines and detect resulting conflicts
- Visualize the impact of schedule changes on resource availability
- Receive suggestions for resolving conflicts through reallocation or rescheduling
- Handle resource departures by identifying affected projects and suggesting replacements
- Manage resource onboarding by gradually introducing new team members to projects

#### Acceptance Criteria:
- Project timelines can be adjusted with immediate visibility into conflicts
- System suggests viable options for resolving scheduling conflicts
- Resource departures trigger appropriate notifications and replacement suggestions
- Onboarding processes account for ramp-up time in capacity calculations

### 5. AI-Powered Optimization

#### User Story 5.1
**As a** Project Manager  
**I want to** optimize resource allocation for cost efficiency  
**So that** I can meet budget constraints while maintaining quality

#### Requirements:
- Analyze current resource allocations for cost optimization opportunities
- Generate recommendations for resource substitutions that maintain quality but reduce cost
- Suggest schedule adjustments to minimize overtime or premium rates
- Identify opportunities for task consolidation
- Recommend skill development paths to address capability gaps

#### Acceptance Criteria:
- System generates actionable cost optimization recommendations
- Recommendations include estimated savings and quality impact assessments
- Users can accept or reject individual optimization suggestions
- Skill gap analysis provides actionable development recommendations

### 6. Reporting and Analytics

#### User Story 6.1
**As a** Manager  
**I want to** access comprehensive reports on resource utilization and project costs  
**So that** I can make data-driven decisions about capacity and budgeting

#### Requirements:
- Generate resource utilization reports across projects and time periods
- Create cost analysis reports comparing planned vs. actual spending
- Provide skill utilization metrics to identify training needs
- Visualize capacity planning forecasts for future resource needs
- Export reports in various formats (PDF, Excel, CSV)

#### Acceptance Criteria:
- Standard reports are accessible through an intuitive dashboard
- Custom report options allow filtering by various parameters
- Visualizations clearly communicate key metrics and trends
- Reports can be exported in multiple formats
- Data can be drilled down for detailed analysis

---

## Technical Specifications

### Technology Stack

#### Core Infrastructure
- **Cloud Platform**: Google Cloud Platform
- **Backend Framework**: Firebase (Firestore, Cloud Functions, Authentication)
- **Frontend Framework**: React.js with TypeScript
- **UI Component Library**: Material UI
- **AI Integration**: Model Context Protocol (MCP) with Gemini 3.7
- **Authentication**: Firebase Authentication
- **Storage**: Cloud Storage for Firebase

#### Key Technical Components

**1. Firebase Implementation**
- Firestore NoSQL database for resource profiles, projects, and schedules
- Cloud Functions for serverless computing of scheduling algorithms and business logic
- Firebase Authentication for secure user access
- Cloud Storage for document and asset management
- Firebase Hosting for frontend application deployment

**2. MCP Integration**
- MCP servers for AI-powered optimization using Gemini
- Integration with Firebase using MCP Toolbox for Databases
- Specialized MCP servers for resource matching, budget analysis, and schedule optimization

**3. Database Schema**

**Resources Collection:**
```
resources/{resourceId}
├── personalInfo
│   ├── name: string
│   ├── email: string
│   ├── phone: string
│   └── employeeId: string
├── skills: array<Skill>
│   ├── name: string
│   ├── proficiency: number (1-10)
│   ├── yearsExperience: number
│   └── certifications: array<string>
├── availability
│   ├── workArrangement: string (full-time, part-time, custom)
│   ├── standardHours: object
│   │   ├── start: timestamp
│   │   └── end: timestamp
│   ├── customSchedule: array<object>
│   │   ├── day: string
│   │   ├── start: timestamp
│   │   └── end: timestamp
│   └── timeOff: array<object>
│       ├── start: timestamp
│       └── end: timestamp
├── rates
│   ├── standard: number
│   ├── overtime: number
│   └── weekend: number
├── maxAssignments: number (default: 2)
├── maxHoursPerDay: number (default: 14)
└── status: string (active, onboarding, offboarding)
```

**Projects Collection:**
```
projects/{projectId}
├── info
│   ├── name: string
│   ├── description: string
│   ├── priority: number (1-5)
│   ├── startDate: timestamp
│   └── endDate: timestamp
├── budget
│   ├── total: number
│   ├── spent: number
│   └── remaining: number
├── phases: array<Phase>
│   ├── name: string
│   ├── startDate: timestamp
│   ├── endDate: timestamp
│   └── tasks: array<Task>
│       ├── name: string
│       ├── description: string
│       ├── startDate: timestamp
│       ├── endDate: timestamp
│       ├── status: string
│       ├── estimatedHours: number
│       ├── requiredSkills: array<RequiredSkill>
│       │   ├── name: string
│       │   └── minProficiency: number
│       ├── allowDoubleBooking: boolean
│       └── dependencies: array<string> (task IDs)
└── assignments: array<Assignment>
    ├── taskId: string
    ├── resourceId: string
    ├── startDate: timestamp
    ├── endDate: timestamp
    ├── allocatedHours: number
    └── estimatedCost: number
```

**Schedules Collection:**
```
schedules/{scheduleId}
├── resourceId: string
├── date: timestamp
├── timeBlocks: array<TimeBlock>
│   ├── startTime: timestamp
│   ├── endTime: timestamp
│   ├── projectId: string
│   ├── taskId: string
│   ├── type: string (regular, overtime)
│   └── status: string (scheduled, completed, canceled)
└── totalHours: number
```

**4. API Endpoints**

**Resource Management APIs:**
- `GET /api/resources`: List all resources
- `GET /api/resources/{id}`: Get resource details
- `POST /api/resources`: Create new resource
- `PUT /api/resources/{id}`: Update resource
- `GET /api/resources/{id}/schedule`: Get resource schedule
- `GET /api/resources/{id}/skills`: Get resource skills

**Project Management APIs:**
- `GET /api/projects`: List all projects
- `GET /api/projects/{id}`: Get project details
- `POST /api/projects`: Create new project
- `PUT /api/projects/{id}`: Update project
- `GET /api/projects/{id}/tasks`: Get project tasks
- `POST /api/projects/{id}/tasks`: Create new task
- `PUT /api/projects/{id}/tasks/{taskId}`: Update task

**Scheduling APIs:**
- `POST /api/schedules/assign`: Assign resource to task
- `GET /api/schedules/conflicts`: Check for scheduling conflicts
- `POST /api/schedules/optimize`: Run schedule optimization
- `GET /api/schedules/calendar`: Get calendar view for multiple resources

**MCP API Endpoints:**
- `POST /mcp/resource-matching`: Match resources to project requirements
- `POST /mcp/budget-optimization`: Optimize resource allocation for budget
- `POST /mcp/schedule-conflicts`: Detect and resolve scheduling conflicts

---

## User Interface Design

### Core Screens and Components

#### 1. Dashboard
- Resource utilization overview
- Project status summary
- Upcoming deadlines
- Potential conflicts requiring attention
- Budget status indicators

#### 2. Resource Management
- Resource list with filtering options
- Detailed resource profile view
- Skill management interface
- Availability calendar
- Assignment history

#### 3. Project Management
- Project list with status indicators
- Project detail view with timeline
- Task breakdown interface
- Resource requirement definition
- Budget tracking visualization

#### 4. Scheduling Interface
- Calendar view (day/week/month)
- Resource allocation timeline
- Drag-and-drop assignment capability
- Conflict highlighting
- Filter by project/resource/skill

#### 5. Reports and Analytics
- Resource utilization reports
- Cost analysis dashboards
- Skill distribution visualizations
- Capacity forecasting charts
- Custom report builder

#### 6. AI Recommendation Center
- Resource matching suggestions
- Cost optimization recommendations
- Skill development proposals
- Conflict resolution options

### User Interface Mock-ups

*Note: Detailed mockups would be included in the final PRD*

#### Example: Resource Assignment Screen

```
+---------------------------------------------------------------+
|                      RESOURCE ASSIGNMENT                       |
+---------------------------------------------------------------+
| Project: Website Redesign     Task: Create Wireframes         |
| Duration: 40 hours            Timeframe: May 26-30, 2025      |
+---------------------------------------------------------------+
| Required Skills:                                              |
| - Wireframing (min: 7/10)                                     |
| - UX Design (min: 6/10)                                       |
+---------------------------------------------------------------+
| MATCHED RESOURCES                                             |
+---------------------------------------------------------------+
| Name          | Skills Match | Availability | Est. Cost       |
+---------------------------------------------------------------+
| Jane Chen     | 98%          | 100%         | $3,400         |
| David Lopez   | 95%          | 60%          | $3,610         |
| Priya Sharma  | 90%          | 100%         | $3,200         |
+---------------------------------------------------------------+
|                         [ ASSIGN ]                            |
+---------------------------------------------------------------+
```

---

## Feature Prioritization and Roadmap

### Phase 1: Core Resource Management (3-4 months)
- Resource profile creation and management
- Basic project definition capabilities
- Simple scheduling interface with conflict detection
- Calendar integration for availability tracking
- Basic reporting functionality

### Phase 2: Advanced Scheduling Features (2-3 months)
- Enhanced constraint management
- Multi-project resource allocation
- Double-booking controls and validation
- Cost tracking and budget management
- Expanded reporting and analytics

### Phase 3: AI and Optimization (3-4 months)
- MCP integration for AI-powered suggestions
- Resource matching algorithms
- Budget optimization recommendations
- Predictive analytics for capacity planning
- Skill gap analysis and development pathways

### Phase 4: Enterprise Integration and Scaling (2-3 months)
- Advanced security features and role-based access
- Custom workflows and approval processes
- Mobile application development
- API ecosystem for third-party integration
- Performance optimization for large datasets

---

## Detailed Scenarios

### Scenario 1: Onboarding a New Team Member

1. **HR initiates onboarding process**
   - Creates new resource profile with basic information
   - Schedules skill assessment session

2. **Resource Manager completes profile**
   - Adds detailed skill ratings based on assessment results
   - Sets up work arrangement (full-time, 10am-8pm schedule)
   - Configures hourly rates and assignment limits

3. **Profile is activated in system**
   - Resource becomes available in resource pool
   - System applies "onboarding" status with reduced capacity (75%)
   - Project managers are notified of new resource availability
   
4. **Initial assignments are made**
   - System suggests appropriate starter tasks based on skills
   - Assignments respect onboarding capacity limitations
   - Resource manager receives feedback on initial performance

### Scenario 2: Project Timeline Adjustment

1. **Project Manager identifies need for timeline change**
   - Client requests two-week extension for website redesign project
   - Manager accesses project dashboard to modify timeline

2. **System analyzes impact**
   - Identifies all tasks affected by the schedule shift
   - Detects three resources with new conflicts created by the change
   - Finds two previously unavailable resources now available for project

3. **Conflict resolution**
   - System presents recommendations for resolving conflicts:
     - Reassign QA Testing from Carlos to Mei
     - Extend Development Phase by 5 days
     - Adjust Testing Phase to parallel final development
   
4. **Manager implements changes**
   - Accepts recommended changes
   - System updates all affected resources' schedules
   - Notifications are sent to all impacted team members
   - Project budget is recalculated based on new timeline

### Scenario 3: Resource Departure Handling

1. **HR initiates departure process**
   - Marks David Lopez (Senior Frontend Developer) as departing
   - Sets last working day as July 15, 2025

2. **System conducts impact assessment**
   - Identifies three active projects affected
   - Calculates 160 hours of assigned work needing reallocation
   - Identifies critical React Native expertise gap (8/10 level)

3. **Project Managers receive notifications**
   - View affected tasks and deadlines
   - Review system-generated replacement suggestions:
     - Project A: Reassign to Sarah Kim (95% skill match)
     - Project B: Split between James Wilson and Nadia Ahmed
     - Project C: Consider contractor engagement

4. **Resource reallocation**
   - Managers implement recommended reassignments
   - System updates project schedules and resource calendars
   - Knowledge transfer sessions are scheduled with departing resource

### Scenario 4: Budget Optimization

1. **Leadership requests cost reduction**
   - Finance sets goal of 10% cost reduction across projects
   - Project managers activate AI optimization function

2. **System analyzes opportunities**
   - Examines current resource allocations and rates
   - Identifies tasks that could be reassigned to lower-cost resources
   - Finds schedule adjustments to minimize overtime
   - Discovers task consolidation opportunities

3. **Optimization recommendations**
   - System presents actionable suggestions:
     - Reassign UI component development from senior to mid-level developers with senior oversight
     - Reschedule performance testing to regular hours instead of weekend
     - Consolidate content migration tasks
     - Use internal QA resources instead of external consultants

4. **Implementation and tracking**
   - Manager reviews and selects recommendations to implement
   - System calculates projected savings ($13,500)
   - Changes are implemented and tracked against target
   - Quality impact is monitored post-implementation

---

## Performance & Success Metrics

### Key Performance Indicators (KPIs)

1. **System Performance**
   - Schedule generation time: <5 seconds for standard projects
   - Conflict detection latency: <2 seconds
   - System uptime: 99.9%
   - API response time: <500ms for 95% of requests

2. **Business Impact**
   - Reduction in scheduling time: 70% decrease from baseline
   - Resource utilization improvement: 15-20% increase
   - Project delivery on-time rate: >90%
   - Budget adherence: Within 5% of planned

3. **User Adoption**
   - Daily active users: >80% of target users
   - Feature utilization: >70% of key features used regularly
   - User satisfaction score: >8/10
   - Training completion rate: >95%

4. **AI Effectiveness**
   - Recommendation acceptance rate: >60%
   - Cost savings from AI recommendations: >8%
   - Conflict resolution success rate: >85%
   - Skill matching accuracy: >90%

---

## Security and Compliance Requirements

### Data Security

1. **Authentication and Access Control**
   - Role-based access control (RBAC) system
   - Multi-factor authentication for administrative access
   - Session timeout and automatic logout features
   - Granular permissions for sensitive data (e.g., rate information)

2. **Data Protection**
   - Encryption of data at rest and in transit
   - Secure API authentication using Firebase Authentication
   - Regular security audits and penetration testing
   - Compliance with relevant data protection regulations

3. **Audit and Compliance**
   - Comprehensive audit logs for all system changes
   - Record of all resource assignments and modifications
   - Schedule change history with attribution
   - Regular compliance reviews

---

## Testing Requirements

### Testing Strategies

1. **Unit Testing**
   - Core scheduling algorithm validation
   - Resource matching function accuracy
   - Conflict detection completeness

2. **Integration Testing**
   - Firebase and MCP component integration
   - Calendar synchronization accuracy
   - API endpoint validation

3. **Performance Testing**
   - Load testing with 1,000+ resources
   - Scheduling optimization performance
   - Concurrent user operation handling

4. **User Acceptance Testing**
   - Resource manager workflow validation
   - Project manager assignment process
   - Report generation and export functionality

---

## Implementation Considerations

### Dependencies

1. **Technical Dependencies**
   - Firebase project setup and configuration
   - Google Cloud Platform account with appropriate permissions
   - MCP SDK and Toolbox integration
   - Gemini API access and configuration

2. **Organizational Dependencies**
   - Standardized skill taxonomy creation
   - Resource rate information collection
   - Project template standardization
   - User training and onboarding plan

### Risk Management

1. **Technical Risks**
   - Data migration challenges from existing spreadsheets
   - Performance issues with large datasets
   - Integration complexity with existing systems
   - AI recommendation quality assurance

2. **Mitigation Strategies**
   - Phased implementation approach
   - Comprehensive testing strategy
   - Pilot deployment with limited user group
   - Regular performance monitoring and optimization
   - Continuous feedback loops for AI improvement

---

## Conclusion and Recommendations

Plannar represents a transformative solution for complex resource scheduling challenges. By leveraging Google Cloud technologies, particularly Firebase and the Model Context Protocol (MCP), the system will deliver significant improvements in efficiency, accuracy, and cost optimization compared to traditional spreadsheet-based approaches.

The recommended implementation approach follows a phased rollout strategy, starting with core functionality and gradually introducing advanced features. This approach minimizes risk while delivering value early and continuously.

Successfully implementing Plannar will require close collaboration between technical teams, resource managers, and project managers, with a focus on data quality, user adoption, and continuous improvement of AI recommendation capabilities.

We recommend proceeding with Phase 1 implementation immediately to establish the foundation for advanced capabilities in subsequent phases. Regular review points should be established to assess progress and adjust priorities based on user feedback and business impact.

---

## Glossary

- **Resource**: An individual team member with specific skills, availability, and cost parameters
- **Project**: A set of related tasks with defined timelines, deliverables, and resource requirements
- **Task**: A specific unit of work within a project requiring particular skills and time allocation
- **Skill**: A specific capability or expertise area with associated proficiency rating
- **MCP**: Model Context Protocol, a standardized way to connect AI models with external tools and data
- **Double-booking**: Assigning a resource to multiple projects simultaneously
- **Resource utilization**: Percentage of available hours assigned to productive work
- **Firebase**: Google's platform for creating mobile and web applications
- **Gemini**: Google's advanced AI model used for intelligent recommendations

---

*Note: This PRD represents the initial planning document for Plannar. It will evolve based on stakeholder feedback, technical discoveries, and changing business requirements.*