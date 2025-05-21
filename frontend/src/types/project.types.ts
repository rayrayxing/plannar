// /workspace/plannar/functions/src/types/project.types.ts

export type ProjectStatus = 'Planning' | 'In Progress' | 'Completed' | 'On Hold' | 'Cancelled';

export interface Project {
  id: string; // Firestore document ID
  name: string;
  clientName?: string; // Optional, as some projects might be internal
  description?: string;
  startDate: string; // ISO Date string
  endDate: string; // ISO Date string
  status: ProjectStatus;
  // Future considerations: budget, project manager, team members (links to resources)
  createdAt: string; // ISO Timestamp string
  updatedAt: string; // ISO Timestamp string
  auditLog?: AuditLogEntry[]; // Using the same AuditLogEntry from resource.types.ts
}

export type TaskStatus = 'To Do' | 'In Progress' | 'Done' | 'Blocked';

export interface Task {
  id: string; // Firestore document ID (tasks will be a subcollection of projects)
  projectId: string; // ID of the parent project
  name: string;
  description?: string;
  assignedResourceId?: string; // Link to Resource.id
  startDate?: string; // ISO Date string
  endDate?: string; // ISO Date string
  status: TaskStatus;
  estimatedHours?: number;
  actualHours?: number;
  // Future: dependencies, priority
  createdAt: string; // ISO Timestamp string
  updatedAt: string; // ISO Timestamp string
  auditLog?: AuditLogEntry[]; // Using the same AuditLogEntry
}

// Re-using AuditLogEntry from resource.types.ts for consistency
// If it's not already exported or needs to be shared, we might need a common types file.
// For now, assuming it can be imported or redefined if necessary.
// Let's try to import it.

import { AuditLogEntry } from './resource.types';
