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

export interface SkillEndorsement {
  skillId: string; // FK to global Skills collection
  skillName?: string; // Denormalized skill name for easier display
  proficiency: number; // 1-10 scale
  yearsExperience: number;
  lastUsedDate?: string; // ISO Date string
  interestLevel?: number; // 1-5 scale (e.g., 1=Low, 5=High)
  notes?: string; // Optional field for any specific notes
}

export interface Certification {
  id: string; // Unique ID for this certification instance
  name: string;
  issuingBody: string;
  issueDate: string; // ISO Date string
  expirationDate?: string; // ISO Date string
  credentialId?: string;
  detailsLink?: string; // URL to the credential or details
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

export interface PerformanceMetric {
  id: string; // Unique ID for this performance entry, generated client-side for new entries
  metricName: string; // Name of the metric, e.g., "Communication", "Technical Skill"
  rating: number; // Numerical rating, e.g., 1-5, 1-10
  reviewDate: string; // Date of the review or metric recording, YYYY-MM-DD
  comments?: string; // General comments or notes about the performance
  reviewCycleId?: string; // Optional: Identifier for a specific review cycle (e.g., "Q1-2024-Review")
  reviewerId?: string; // Optional: Identifier of the person who conducted the review/assessment
  goalsSet?: string; // Optional: Description of goals set during this review
  achievements?: string; // Optional: Description of achievements noted
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
  skills: SkillEndorsement[];
  availability: Availability;
  rates: Rates; // Securely handled
  maxAssignments: number; // Default: 2 (PRD Line 239)
  maxHoursPerDay: number; // Default: 14 (PRD Line 240)
  status: ResourceStatus; // active, onboarding, offboarding (PRD Line 241)
  certifications?: Certification[]; // General certifications (TRD Sec 3.2.1)
  specializations?: string[]; // General specializations
  preferences?: ResourcePreferences;
  performance?: PerformanceMetric[]; // Array of performance entries (TRD Sec 3.2.1)
  auditLog?: AuditLogEntry[]; // (PRD Line 69)
  createdAt: string; // Timestamp
  updatedAt: string; // Timestamp
  department?: string; // Optional: for larger orgs
  location?: string; // Optional: for distributed teams
  managerId?: string; // Optional: Employee ID of their manager
}
