export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string; // Should be unique
  phone?: string;
  employeeId: string; // Should be unique
  title?: string;
  department?: string;
  location?: string;
  startDate?: string; // ISO Date string
  endDate?: string; // ISO Date string, optional
  employmentStatus?: string; // e.g., Active, Onboarding, Departing (from TRD info.status)
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

export interface DayWorkHours {
  start?: string; // HH:MM
  end?: string; // HH:MM
  active: boolean;
}

export interface WorkHours {
  monday: DayWorkHours;
  tuesday: DayWorkHours;
  wednesday: DayWorkHours;
  thursday: DayWorkHours;
  friday: DayWorkHours;
  saturday: DayWorkHours;
  sunday: DayWorkHours;
}

export type ExceptionEntryType = "PTO" | "Sick Leave" | "Holiday" | "Project Assignment" | "Training" | "Other";

export interface ExceptionEntry {
  id: string;
  startDate: string; // ISO Date string or Timestamp
  endDate: string; // ISO Date string or Timestamp
  type: ExceptionEntryType;
  description?: string;
}

export type WorkArrangementType = "full-time" | "part-time" | "contractor" | "intern";

export interface Availability {
  workHours?: WorkHours;
  timeZone?: string; // e.g., "America/New_York"
  workArrangement: WorkArrangementType;
  exceptions?: ExceptionEntry[];
  // Real-time availability will also be derived from 'schedules' collection later
}

export interface Rates {
  standard: number; // Hourly rate
  overtime?: number; // Hourly rate for overtime
  weekend?: number; // Hourly rate for weekend
  currency?: string; // e.g., "USD", "EUR"
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


export interface NotificationPreferencesType {
  email?: boolean;
  inApp?: boolean;
  sms?: boolean;
}


export interface ResourcePreferences {
  preferredProjects?: string[];
  preferredRoles?: string[];
  developmentGoals?: string[];
  notificationPreferences?: NotificationPreferencesType;
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
  preferences?: ResourcePreferences;
  historicalPerformanceMetrics?: HistoricalPerformanceMetric[]; // (PRD Line 62)
  auditLog?: AuditLogEntry[]; // (PRD Line 69)
  createdAt: string; // Timestamp
  updatedAt: string; // Timestamp
  department?: string; // Optional: for larger orgs
  location?: string; // Optional: for distributed teams
  managerId?: string; // Optional: Employee ID of their manager
}
