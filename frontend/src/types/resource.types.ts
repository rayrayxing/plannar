export interface PersonalInfo {
  name: string;
  email: string; // Should be unique
  phone?: string;
  employeeId: string; // Should be unique
}

export interface Skill {
  name: string; // e.g., "React", "Project Management"
  proficiency: number; // 1-10 scale
  yearsExperience: number;
  certifications?: string[]; // List of relevant certification names or IDs
}

export interface CertificationDetail {
  id?: string; // Optional: client-side ID for list management during editing
  name: string;
  issuingOrganization: string;
  issueDate: string; // Should be stored/handled as ISO date string
  expirationDate?: string; // Optional, ISO date string
  credentialId?: string; // Optional
  credentialURL?: string; // Optional
  skillsCovered?: string[]; // Optional array of skill names or IDs
}

export interface WorkArrangement {
  type: 'full-time' | 'part-time' | 'contractor' | 'custom'; // Expanded from PRD
  standardHours?: { // Applicable for full-time, part-time
    monday: { start?: string; end?: string; active: boolean };
    tuesday: { start?: string; end?: string; active: boolean };
    wednesday: { start?: string; end?: string; active: boolean };
    thursday: { start?: string; end?: string; active: boolean };
    friday: { start?: string; end?: string; active: boolean };
    saturday: { start?: string; end?: string; active: boolean };
    sunday: { start?: string; end?: string; active: boolean };
  };
  // PRD's customSchedule array can be represented by making standardHours flexible
  // Or, if truly ad-hoc per day and overriding standard, a separate field might be needed.
  // For now, assuming 'custom' type implies flexible standardHours, or specific overrides are handled in 'timeOff' or 'assignments'.
  hoursPerWeek?: number; // For part-time or to specify for contractors
}

export interface TimeOffEntry {
  id: string; // Unique ID for the time off entry
  startDate: string; // ISO Date string or Timestamp
  endDate: string; // ISO Date string or Timestamp
  reason?: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: string; // Timestamp
  approvedBy?: string; // User ID of approver
}

export interface Availability {
  workArrangement: WorkArrangement;
  timeOff: TimeOffEntry[];
  // Real-time availability will also be derived from 'schedules' collection later
}

export interface Rates {
  standard: number; // Hourly rate
  overtime?: number; // Hourly rate for overtime
  weekend?: number; // Hourly rate for weekend
  // Access control for these fields will be managed at the API/Firestore rules level
}

export interface HistoricalPerformanceMetric {
  metricName: string; // e.g., "Project Completion Rate", "Client Satisfaction Score"
  value: string | number;
  dateRecorded: string; // Timestamp
  notes?: string;
}

export interface AuditLogEntry {
  timestamp: string; // ISO Timestamp string
  userId: string; // User ID of the person who made the change
  fieldName: string;
  oldValue: any;
  newValue: any;
  description?: string; // e.g., "Updated skill proficiency"
}

export type ResourceStatus = 'active' | 'onboarding' | 'offboarding' | 'on-leave' | 'pending-hire';

export interface Resource {
  id: string; // Firestore document ID
  personalInfo: PersonalInfo;
  skills: Skill[];
  availability: Availability;
  rates: Rates; // Securely handled
  maxAssignments: number; // Default: 2 (PRD Line 239)
  maxHoursPerDay: number; // Default: 14 (PRD Line 240)
  status: ResourceStatus; // active, onboarding, offboarding (PRD Line 241)
  certifications?: CertificationDetail[]; // General certifications (TRD Sec 3.2.1)
  specializations?: string[]; // General specializations
  historicalPerformanceMetrics?: HistoricalPerformanceMetric[]; // (PRD Line 62)
  auditLog?: AuditLogEntry[]; // (PRD Line 69)
  createdAt: string; // Timestamp
  updatedAt: string; // Timestamp
  department?: string; // Optional: for larger orgs
  location?: string; // Optional: for distributed teams
  managerId?: string; // Optional: Employee ID of their manager
}
