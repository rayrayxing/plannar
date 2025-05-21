/**
 * Represents a time block within a resource's schedule for a specific day.
 * Based on PRD lines 287-293.
 */
export interface TimeBlock {
  startTime: string; // ISO 8601 timestamp
  endTime: string;   // ISO 8601 timestamp
  hours: number;     // Actual hours for this specific block
  projectId: string;
  taskId: string;
  type: 'regular' | 'overtime' | 'time_off' | 'other'; // Expanded based on common needs, PRD mentions regular, overtime
  status: 'scheduled' | 'tentative' | 'confirmed' | 'completed' | 'cancelled'; // PRD mentions scheduled, completed, canceled
  notes?: string;
}

/**
 * Represents a resource's schedule for a specific day.
 * Based on PRD lines 284-294.
 */
export interface ScheduleEntry {
  id?: string; // Document ID, could be auto-generated or e.g., resourceId_YYYY-MM-DD
  resourceId: string;
  date: string;      // ISO 8601 date string (YYYY-MM-DD), representing the day of the schedule
  timeBlocks: TimeBlock[];
  totalHours: number; // Sum of hours in timeBlocks for this day
  updatedAt: string; // ISO 8601 timestamp
  createdAt: string; // ISO 8601 timestamp
  // Potentially add auditLog here if needed for schedule changes
}

/**
 * Represents an assignment of a resource to a task within a project.
 * This will be part of the Project type.
 * Based on PRD lines 273-280.
 */
export interface Assignment {
  assignmentId: string; // Unique ID for the assignment itself
  taskId: string;
  resourceId: string;
  startDate: string;    // ISO 8601 timestamp (overall assignment start)
  endDate: string;      // ISO 8601 timestamp (overall assignment end)
  allocatedHours: number;
  estimatedCost: number;
  status: 'proposed' | 'active' | 'completed' | 'cancelled'; // Assignment status
  notes?: string;
  createdAt?: string; // ISO 8601 timestamp
  updatedAt?: string; // ISO 8601 timestamp
  // Audit log for changes to this specific assignment could be here
}

/**
 * Payload for the assignResourceToTaskLogic function.
 */
export interface AssignResourcePayload {
  projectId: string;
  taskId: string;
  resourceId: string;
  startDate: string;    // ISO 8601 timestamp (e.g., "2024-01-15T09:00:00.000Z")
  endDate: string;      // ISO 8601 timestamp (e.g., "2024-01-19T17:00:00.000Z")
  allocatedHours: number;
  // Optional: notes, specific time preferences, etc.
}

