import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Project, Task } from './types/project.types'; // Assuming Project and Task types are in project.types.ts
import { Resource } from './types/resource.types'; // Assuming Resource type is in resource.types.ts
import { ScheduleEntry, TimeBlock, Assignment } from './types/schedule.types';
import { AuditLogEntry } from './types/resource.types';

if (admin.apps.length === 0) {
  admin.initializeApp();
}

const db = admin.firestore();
const projectsCollection = db.collection('projects');
const resourcesCollection = db.collection('resources');
const schedulesCollection = db.collection('schedules');

interface AssignResourcePayload {
  projectId: string;
  taskId: string;
  resourceId: string;
  startDate: string; // ISO 8601 Timestamp for the assignment start
  endDate: string;   // ISO 8601 Timestamp for the assignment end
  allocatedHours: number; // Total hours allocated for this assignment
  // Potentially add notes or other assignment-specific details here
}

// Core logic for assigning a resource to a task
export async function assignResourceToTaskLogic(
  payload: AssignResourcePayload,
  authenticatedUserId?: string
): Promise<Assignment> {
  const { projectId, taskId, resourceId, startDate, endDate, allocatedHours } = payload;

  // --- 1. Validation ---
  if (!projectId) throw new functions.https.HttpsError('invalid-argument', 'Project ID is required.');
  if (!taskId) throw new functions.https.HttpsError('invalid-argument', 'Task ID is required.');
  if (!resourceId) throw new functions.https.HttpsError('invalid-argument', 'Resource ID is required.');
  if (!startDate || !Date.parse(startDate)) throw new functions.https.HttpsError('invalid-argument', 'Valid startDate is required.');
  if (!endDate || !Date.parse(endDate)) throw new functions.https.HttpsError('invalid-argument', 'Valid endDate is required.');
  if (new Date(startDate) >= new Date(endDate)) throw new functions.https.HttpsError('invalid-argument', 'startDate must be before endDate.');
  if (typeof allocatedHours !== 'number' || allocatedHours <= 0) throw new functions.https.HttpsError('invalid-argument', 'allocatedHours must be a positive number.');

  const projectRef = projectsCollection.doc(projectId);
  const taskRef = projectRef.collection('tasks').doc(taskId);
  const resourceRef = resourcesCollection.doc(resourceId);

  // --- 2. Check Existence of Project, Task, Resource ---
  const [projectDoc, taskDoc, resourceDoc] = await Promise.all([
    projectRef.get(),
    taskRef.get(),
    resourceRef.get(),
  ]);

  if (!projectDoc.exists) throw new functions.https.HttpsError('not-found', `Project with ID "${projectId}" not found.`);
  if (!taskDoc.exists) throw new functions.https.HttpsError('not-found', `Task with ID "${taskId}" in project "${projectId}" not found.`);
  if (!resourceDoc.exists) throw new functions.https.HttpsError('not-found', `Resource with ID "${resourceId}" not found.`);

  // const projectData = projectDoc.data() as Project;
  // const taskData = taskDoc.data() as Task;
  // const resourceData = resourceDoc.data() as Resource;

  // --- 3. Conflict Detection: Check for existing schedule entries for the resource in the date range ---
  const scheduleQueryStartDate = startDate.split('T')[0];
  const scheduleQueryEndDate = endDate.split('T')[0];

  const existingSchedulesQuery = schedulesCollection
    .where('resourceId', '==', resourceId)
    .where('date', '>=', scheduleQueryStartDate)
    .where('date', '<=', scheduleQueryEndDate);

  const existingSchedulesSnapshot = await existingSchedulesQuery.get();

  if (!existingSchedulesSnapshot.empty) {
    // Basic conflict: resource already has scheduled items on one or more days in the proposed period.
    // Collect conflicting dates for a more informative message.
    const conflictingDates = existingSchedulesSnapshot.docs.map(doc => doc.data().date).join(', ');
    throw new functions.https.HttpsError(
      'failed-precondition',
      `Resource ${resourceId} is already scheduled on the following date(s) within the requested period: ${conflictingDates}. Assignment conflicts with existing schedule.`
    );
  }
  // TODO: Implement more advanced conflict detection based on PRD:
  // - Enforce max 2 simultaneous assignments (PRD line 105) - requires checking total active assignments for resource.
  // - Prevent double-booking unless task allows (PRD line 106) - current check is a basic form of double-booking prevention.
  // - Check against resource's maxDailyHours if defined.


  const now = new Date().toISOString();
  const assignmentId = db.collection('-').doc().id; // Generate a unique ID for the assignment

  const newAssignment: Assignment = {
    assignmentId,
    taskId,
    resourceId,
    startDate,
    endDate,
    allocatedHours,
    status: 'active', // Default to active, could be 'proposed' initially
    createdAt: now,
    updatedAt: now,
    // estimatedCost will be calculated later or based on resource rates * allocatedHours
    estimatedCost: 0, // Placeholder
  };

  // --- 4. Create/Update Assignment in Project ---
  // Add the new assignment to the project's assignments array.
  // Also, update the task's assignedResourceId if it's not already set or different.
  const projectUpdatePayload: { assignments: admin.firestore.FieldValue, updatedAt: string, auditLog?: admin.firestore.FieldValue } = {
    assignments: admin.firestore.FieldValue.arrayUnion(newAssignment),
    updatedAt: now,
  };

  const auditLogEntry: AuditLogEntry = {
    timestamp: now,
    userId: authenticatedUserId || 'system',
    fieldName: 'assignments',
    oldValue: 'N/A',
    newValue: `Assignment ${assignmentId} for task ${taskId} to resource ${resourceId}`,
    description: `Resource ${resourceId} assigned to task ${taskId}`,
  };
  projectUpdatePayload.auditLog = admin.firestore.FieldValue.arrayUnion(auditLogEntry);

  // --- 6. Perform Firestore Writes using a Batch for Atomicity ---
  const batch = db.batch();

  // Update project
  batch.update(projectRef, projectUpdatePayload);

  // Update task (add assignedResourceId and audit log for task)
  const taskUpdateData: { assignedResourceId: string, updatedAt: string, auditLog?: admin.firestore.FieldValue } = {
    assignedResourceId: resourceId,
    updatedAt: now,
  };
  const taskAuditLogEntry: AuditLogEntry = {
    timestamp: now,
    userId: authenticatedUserId || 'system',
    fieldName: 'assignedResourceId',
    oldValue: (taskDoc.data() as Task).assignedResourceId || 'N/A',
    newValue: resourceId,
    description: `Task assigned to resource ${resourceId}`,
  };
  taskUpdateData.auditLog = admin.firestore.FieldValue.arrayUnion(taskAuditLogEntry);
  batch.update(taskRef, taskUpdateData);

  // Add/Update schedule entries with refined hour distribution
  let remainingHoursToAllocate = allocatedHours;
  const STANDARD_WORK_HOURS_PER_DAY = 8;
  const WORKDAY_START_HOUR_UTC = 9; // Assuming 9 AM UTC as start of workday

  let scheduleProcessingDate = new Date(startDate.split('T')[0] + 'T00:00:00.000Z'); // Normalize to start of day UTC
  const scheduleFinalDate = new Date(endDate.split('T')[0] + 'T00:00:00.000Z'); // Normalize to start of day UTC

  if (scheduleProcessingDate > scheduleFinalDate) {
    functions.logger.warn('assignResourceToTaskLogic: Start date is after end date for schedule processing after normalization. Skipping schedule entry creation.');
  } else {
    while (scheduleProcessingDate <= scheduleFinalDate && remainingHoursToAllocate > 0) {
      const dateStr = scheduleProcessingDate.toISOString().split('T')[0];
      const scheduleEntryRef = schedulesCollection.doc(`${resourceId}_${dateStr}`);

      const hoursForThisDay = Math.min(remainingHoursToAllocate, STANDARD_WORK_HOURS_PER_DAY);
      if (hoursForThisDay <= 0) break; // All hours allocated or no more standard hours for today

      // Construct date object for the start of the workday on scheduleProcessingDate
      const workDayStartDateTime = new Date(scheduleProcessingDate);
      workDayStartDateTime.setUTCHours(WORKDAY_START_HOUR_UTC, 0, 0, 0);

      const timeBlockStartTime = workDayStartDateTime.toISOString();
      const timeBlockEndTime = new Date(workDayStartDateTime.getTime() + hoursForThisDay * 3600 * 1000).toISOString();

      const timeBlock: TimeBlock = {
        startTime: timeBlockStartTime,
        endTime: timeBlockEndTime,
        hours: hoursForThisDay, // Store actual hours for this block
        projectId,
        taskId,
        type: 'regular',
        status: 'scheduled',
      };

      batch.set(scheduleEntryRef, {
          resourceId,
          date: dateStr,
          timeBlocks: admin.firestore.FieldValue.arrayUnion(timeBlock),
          totalHours: admin.firestore.FieldValue.increment(hoursForThisDay),
          updatedAt: now,
          createdAt: now, // Client-side timestamp, set on first write/merge for this day
      }, { merge: true });

      remainingHoursToAllocate -= hoursForThisDay;
      scheduleProcessingDate.setUTCDate(scheduleProcessingDate.getUTCDate() + 1);
    }
  }

  if (remainingHoursToAllocate > 0) {
    functions.logger.warn(
        `Resource ${resourceId} for task ${taskId} (project ${projectId}): ` +
        `${remainingHoursToAllocate} hours could not be allocated within the specified date range ` +
        `(${startDate} - ${endDate}) using a max of ${STANDARD_WORK_HOURS_PER_DAY} hours/day. ` +
        `Total requested: ${allocatedHours}.`
    );
    // Note: The assignment object still stores the original `allocatedHours`.
    // The sum of `totalHours` in ScheduleEntry documents will reflect what was actually scheduled.
  }

  await batch.commit();

  // TODO: Implement more robust conflict detection (PRD User Story 3.1, 4.1)
  // TODO: Implement logic to update availability calendars automatically (more than just creating schedule entries)

  return newAssignment;
}

// HTTPS Callable Function
export const assignResourceToTask = functions.https.onRequest(async (request, response) => {
  if (request.method !== 'POST') {
    response.status(405).send('Method Not Allowed');
    return;

  }
  try {
    const payload = request.body as AssignResourcePayload;
    // const authenticatedUserId = getAuthenticatedUserId(request); // Implement auth
    const assignment = await assignResourceToTaskLogic(payload /*, authenticatedUserId */);
    response.status(201).json(assignment);
  } catch (error) {
    functions.logger.error('Error assigning resource to task:', error);
    if (error instanceof functions.https.HttpsError) {
      response.status(error.httpErrorCode.status).json({ error: error.message, details: error.details });
    } else {
      response.status(500).json({ error: 'Failed to assign resource.', details: (error as Error).message });
    }
  }
});


// --- Get Resource Schedule Logic ---
interface GetResourceSchedulePayload {
  resourceId: string;
  startDate?: string; // Optional: ISO 8601 Date string YYYY-MM-DD
  endDate?: string;   // Optional: ISO 8601 Date string YYYY-MM-DD
}

export async function getResourceScheduleLogic(payload: GetResourceSchedulePayload): Promise<ScheduleEntry[]> {
  const { resourceId, startDate, endDate } = payload;

  if (!resourceId) {
    throw new functions.https.HttpsError('invalid-argument', 'Resource ID is required.');
  }

  let query = schedulesCollection.where('resourceId', '==', resourceId);

  // Validate and use only the date part for Firestore queries if full timestamps are passed
  let validatedStartDate: string | undefined = undefined;
  if (startDate) {
    if (!Date.parse(startDate)) throw new functions.https.HttpsError('invalid-argument', 'Invalid startDate format.');
    validatedStartDate = startDate.split('T')[0];
    query = query.where('date', '>=', validatedStartDate);
  }

  let validatedEndDate: string | undefined = undefined;
  if (endDate) {
    if (!Date.parse(endDate)) throw new functions.https.HttpsError('invalid-argument', 'Invalid endDate format.');
    validatedEndDate = endDate.split('T')[0];
    query = query.where('date', '<=', validatedEndDate);
  }

  query = query.orderBy('date', 'asc');

  try {
    const snapshot = await query.get();
    if (snapshot.empty) {
      return [];
    }
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ScheduleEntry));
  } catch (error) {
    functions.logger.error('Error fetching resource schedule:', error);
    throw new functions.https.HttpsError('internal', 'Could not fetch resource schedule.');
  }
}

export const getResourceSchedule = functions.https.onRequest(async (request, response) => {
  if (request.method !== 'GET') {
    response.status(405).send('Method Not Allowed');
    return;
  }
  try {
    const pathParts = request.path.split('/'); // Expected: /api/resources/{resourceId}/schedule or similar
    // Ensure pathParts has enough elements and the one for resourceId is correct based on actual routing in Firebase Hosting/Functions
    // For a path like "/resources/RESOURCE_ID/schedule", length is 4, ID is at index 2 (0-indexed)
    // If functions are hosted with a base path like "/api", then "/api/resources/RESOURCE_ID/schedule", length 5, ID at index 3.
    // Assuming the function is triggered at a path where resourceId is the second to last part before '/schedule'
    let resourceId: string | undefined;
    if (pathParts.length >= 3 && pathParts[pathParts.length -1] === 'schedule') {
        resourceId = pathParts[pathParts.length - 2];
    }

    if (!resourceId) {
        throw new functions.https.HttpsError('invalid-argument', 'Resource ID not found in path. Expected format: /resources/{resourceId}/schedule');
    }
    
    const { startDate, endDate } = request.query;

    const payload: GetResourceSchedulePayload = {
      resourceId,
      startDate: startDate as string | undefined,
      endDate: endDate as string | undefined,
    };

    const scheduleEntries = await getResourceScheduleLogic(payload);
    response.status(200).json(scheduleEntries);

  } catch (error) {
    functions.logger.error('Error in getResourceSchedule function:', error);
    if (error instanceof functions.https.HttpsError) {
      response.status(error.httpErrorCode.status).json({ error: error.message, details: error.details });
    } else {
      response.status(500).json({ error: 'Failed to get resource schedule.', details: (error as Error).message });
    }
  }
});


// --- Get Calendar View Logic ---
interface GetCalendarViewPayload {
  resourceIds: string[]; // Array of resource IDs
  startDate: string;   // ISO 8601 Date string YYYY-MM-DD
  endDate: string;     // ISO 8601 Date string YYYY-MM-DD
}

export async function getCalendarViewLogic(payload: GetCalendarViewPayload): Promise<Record<string, ScheduleEntry[]>> {
  const { resourceIds, startDate, endDate } = payload;

  if (!resourceIds || resourceIds.length === 0) {
    throw new functions.https.HttpsError('invalid-argument', 'At least one Resource ID is required.');
  }
  if (!startDate || !Date.parse(startDate)) {
    throw new functions.https.HttpsError('invalid-argument', 'Valid startDate (YYYY-MM-DD) is required.');
  }
  if (!endDate || !Date.parse(endDate)) {
    throw new functions.https.HttpsError('invalid-argument', 'Valid endDate (YYYY-MM-DD) is required.');
  }

  const validatedStartDate = startDate.split('T')[0];
  const validatedEndDate = endDate.split('T')[0];

  if (new Date(validatedStartDate) > new Date(validatedEndDate)) {
    throw new functions.https.HttpsError('invalid-argument', 'startDate cannot be after endDate.');
  }

  // Firestore 'in' query supports up to 30 elements. If more, multiple queries are needed.
  // For simplicity, this example assumes resourceIds.length <= 30.
  // Production code should handle batching for larger arrays of resourceIds.
  if (resourceIds.length > 30) {
      functions.logger.warn('Calendar view requested for more than 30 resources. Querying only the first 30.');
      // Consider throwing an error or implementing pagination/batching for the resourceIds array.
      // For now, we'll proceed with a truncated list if it exceeds 30, or throw an error.
      throw new functions.https.HttpsError('invalid-argument', 'Too many resource IDs. Maximum 30 per query for calendar view in this version.');
  }

  try {
    const query = schedulesCollection
      .where('resourceId', 'in', resourceIds)
      .where('date', '>=', validatedStartDate)
      .where('date', '<=', validatedEndDate)
      .orderBy('resourceId', 'asc') // Optional: group by resourceId first
      .orderBy('date', 'asc');

    const snapshot = await query.get();
    const results: Record<string, ScheduleEntry[]> = {};
    resourceIds.forEach(id => results[id] = []); // Initialize for all requested resources

    if (!snapshot.empty) {
      snapshot.docs.forEach(doc => {
        const entry = { id: doc.id, ...doc.data() } as ScheduleEntry;
        if (results[entry.resourceId]) {
          results[entry.resourceId].push(entry);
        } else {
          results[entry.resourceId] = [entry];
        }
      });
    }
    return results;
  } catch (error) {
    functions.logger.error('Error fetching calendar view:', error);
    throw new functions.https.HttpsError('internal', 'Could not fetch calendar view.');
  }
}

export const getCalendarView = functions.https.onRequest(async (request, response) => {
  if (request.method !== 'POST') { // Changed to POST to accept array in body
    response.status(405).send('Method Not Allowed. Use POST.');
    return;
  }
  try {
    // Expects resourceIds, startDate, endDate in request body
    const { resourceIds, startDate, endDate } = request.body as GetCalendarViewPayload;

    if (!Array.isArray(resourceIds) || resourceIds.some(id => typeof id !== 'string')) {
        throw new functions.https.HttpsError('invalid-argument', 'resourceIds must be an array of strings.');
    }

    const payload: GetCalendarViewPayload = { resourceIds, startDate, endDate };
    const calendarData = await getCalendarViewLogic(payload);
    response.status(200).json(calendarData);

  } catch (error) {
    functions.logger.error('Error in getCalendarView function:', error);
    if (error instanceof functions.https.HttpsError) {
      response.status(error.httpErrorCode.status).json({ error: error.message, details: error.details });
    } else {
      response.status(500).json({ error: 'Failed to get calendar view.', details: (error as Error).message });
    }
  }
});

// --- Placeholder for other schedule-related functions ---
