import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Project, Task, ProjectStatus, TaskStatus } from './types/project.types';
import { AuditLogEntry } from './types/resource.types'; // Import directly


if (admin.apps.length === 0) {
  admin.initializeApp();
}

const db = admin.firestore();
const projectsCollection = db.collection('projects');

// Helper to get user ID (placeholder)
// const getAuthenticatedUserId = (request: functions.https.Request): string | undefined => {
//   // Implement actual user ID extraction from request.auth or headers
//   return request.headers.authorization; // Example, replace with actual auth
// };



// Core logic for creating a project
export async function createProjectLogic(
  projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'auditLog'>,
  authenticatedUserId?: string
): Promise<Project> {
  // --- Basic Validation ---
  if (!projectData.name || typeof projectData.name !== 'string' || projectData.name.trim() === '') {
    throw new functions.https.HttpsError('invalid-argument', 'Project name is required and must be a non-empty string.');
  }
  if (!projectData.startDate || !Date.parse(projectData.startDate)) {
    throw new functions.https.HttpsError('invalid-argument', 'Project startDate is required and must be a valid date string.');
  }
  if (!projectData.endDate || !Date.parse(projectData.endDate)) {
    throw new functions.https.HttpsError('invalid-argument', 'Project endDate is required and must be a valid date string.');
  }
  if (new Date(projectData.startDate) > new Date(projectData.endDate)) {
    throw new functions.https.HttpsError('invalid-argument', 'Project startDate cannot be after endDate.');
  }
  const allowedStatuses: ProjectStatus[] = ['Planning', 'In Progress', 'Completed', 'On Hold', 'Cancelled'];
  if (!projectData.status || !allowedStatuses.includes(projectData.status)) {
    throw new functions.https.HttpsError('invalid-argument', `Invalid project status. Must be one of: ${allowedStatuses.join(', ')}`);
  }
  // TODO: Add more comprehensive validation (e.g., clientName format if provided, description length)

  const now = new Date().toISOString();
  const newProjectData: Omit<Project, 'id'> = {
    ...projectData,
    createdAt: now,
    updatedAt: now,
    auditLog: [{
      timestamp: now,
      userId: authenticatedUserId || 'system',
      fieldName: 'N/A',
      oldValue: 'N/A',
      newValue: 'N/A',
      description: 'Project created',
    } as AuditLogEntry],
  };

  const docRef = await projectsCollection.add(newProjectData);
  return { id: docRef.id, ...newProjectData };
}

/**
 * Creates a new project.
 * PRD Line: 71-93 (User Story 2.1)
 */
export const createProject = functions.https.onRequest(async (request, response) => {
  if (request.method !== 'POST') {
    response.status(405).send('Method Not Allowed');
    return;
  }

  try {
    const projectData = request.body as Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'auditLog'>;
    // const authenticatedUserId = getAuthenticatedUserId(request); // Placeholder

    const newProject = await createProjectLogic(projectData /*, authenticatedUserId */);
    response.status(201).json(newProject);

  } catch (error) {
    functions.logger.error('Error creating project:', error);
    if (error instanceof functions.https.HttpsError) {
        response.status(error.httpErrorCode.status).json({ error: error.message, details: error.details });
    } else {
        response.status(500).json({ error: 'Failed to create project.', details: (error as Error).message });
    }
  }
});



// Core logic for listing projects
// TODO: Enhance with query parameters for pagination, filtering, sorting like listResourcesLogic
export async function listProjectsLogic(): Promise<Project[]> { 
  const snapshot = await projectsCollection.orderBy('name', 'asc').get();

  if (snapshot.empty) {
    return [];
  }

  const projects: Project[] = [];
  snapshot.forEach(doc => {
    projects.push({ id: doc.id, ...doc.data() } as Project);
  });
  return projects;
}

/**
 * Lists all projects.
 */
export const listProjects = functions.https.onRequest(async (request, response) => {
  if (request.method !== 'GET') {
    response.status(405).send('Method Not Allowed');
    return;
  }

  try {
    // const queryParams = request.query; // For future pagination/filtering
    const projects = await listProjectsLogic();
    response.status(200).json(projects);

  } catch (error) {
    functions.logger.error('Error listing projects:', error);
    // listProjectsLogic currently doesn't throw HttpsError, but good practice for future
    if (error instanceof functions.https.HttpsError) {
        response.status(error.httpErrorCode.status).json({ error: error.message, details: error.details });
    } else {
        response.status(500).json({ error: 'Failed to list projects.', details: (error as Error).message });
    }
  }
});



// Core logic for getting a project by ID
export async function getProjectByIdLogic(projectId: string): Promise<Project> {
  if (!projectId) {
    throw new functions.https.HttpsError('invalid-argument', 'Project ID is required.');
  }

  const doc = await projectsCollection.doc(projectId).get();

  if (!doc.exists) {
    throw new functions.https.HttpsError('not-found', 'Project not found.');
  }

  return { id: doc.id, ...doc.data() } as Project;
}

/**
 * Gets a specific project by its ID.
 */
export const getProjectById = functions.https.onRequest(async (request, response) => {
  if (request.method !== 'GET') {
    response.status(405).send('Method Not Allowed');
    return;
  }

  try {
    const pathParts = request.path.split('/');
    const projectId = pathParts.pop();

    if (!projectId) {
      // This check is technically redundant if getProjectByIdLogic handles it,
      // but good for early exit before calling the logic function.
      response.status(400).json({ error: 'Project ID is required in the path.' });
      return;
    }

    const project = await getProjectByIdLogic(projectId);
    response.status(200).json(project);

  } catch (error) {
    functions.logger.error('Error getting project by ID:', error);
    if (error instanceof functions.https.HttpsError) {
        response.status(error.httpErrorCode.status).json({ error: error.message, details: error.details });
    } else {
        response.status(500).json({ error: 'Failed to get project.', details: (error as Error).message });
    }
  }
});



// Core logic for updating a project
export async function updateProjectLogic(
  projectId: string,
  updateData: Partial<Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'auditLog'> >,
  authenticatedUserId?: string
): Promise<void> {
  if (!projectId) {
    throw new functions.https.HttpsError('invalid-argument', 'Project ID is required.');
  }
  if (Object.keys(updateData).length === 0) {
    throw new functions.https.HttpsError('invalid-argument', 'No update data provided.');
  }

  const projectRef = projectsCollection.doc(projectId);
  const doc = await projectRef.get();

  if (!doc.exists) {
    throw new functions.https.HttpsError('not-found', 'Project not found.');
  }
  const existingProject = doc.data() as Project;

  // --- Basic Validation for updated fields ---
  if (updateData.name !== undefined && (typeof updateData.name !== 'string' || updateData.name.trim() === '')) {
    throw new functions.https.HttpsError('invalid-argument', 'Project name must be a non-empty string if provided.');
  }
  if (updateData.startDate && !Date.parse(updateData.startDate)) {
    throw new functions.https.HttpsError('invalid-argument', 'Invalid project startDate format.');
  }
  if (updateData.endDate && !Date.parse(updateData.endDate)) {
    throw new functions.https.HttpsError('invalid-argument', 'Invalid project endDate format.');
  }

  const newStartDate = updateData.startDate ? new Date(updateData.startDate) : new Date(existingProject.startDate);
  const newEndDate = updateData.endDate ? new Date(updateData.endDate) : new Date(existingProject.endDate);

  if (newStartDate > newEndDate) {
    throw new functions.https.HttpsError('invalid-argument', 'Project startDate cannot be after endDate.');
  }

  if (updateData.status) {
    const allowedStatuses: ProjectStatus[] = ['Planning', 'In Progress', 'Completed', 'On Hold', 'Cancelled'];
    if (!allowedStatuses.includes(updateData.status)) {
      throw new functions.https.HttpsError('invalid-argument', `Invalid project status. Must be one of: ${allowedStatuses.join(', ')}`);
    }
  }
  // TODO: Add more validation for other fields if they are updated

  const now = new Date().toISOString();
  const newAuditLogEntries: AuditLogEntry[] = [];

  for (const key in updateData) {
    if (Object.prototype.hasOwnProperty.call(updateData, key)) {
      const typedKey = key as keyof typeof updateData;
      if (JSON.stringify(existingProject[typedKey]) !== JSON.stringify(updateData[typedKey])) {
        newAuditLogEntries.push({
          timestamp: now,
          userId: authenticatedUserId || 'system',
          fieldName: typedKey,
          oldValue: existingProject[typedKey],
          newValue: updateData[typedKey],
          description: `Updated ${typedKey}`,
        });
      }
    }
  }

  const finalUpdateData: any = {
    ...updateData,
    updatedAt: now,
  };

  if (newAuditLogEntries.length > 0) {
    finalUpdateData.auditLog = admin.firestore.FieldValue.arrayUnion(...newAuditLogEntries);
  }

  await projectRef.update(finalUpdateData);
}

/**
 * Updates an existing project by its ID.
 */
export const updateProject = functions.https.onRequest(async (request, response) => {
  if (request.method !== 'PUT') {
    response.status(405).send('Method Not Allowed');
    return;
  }

  try {
    const pathParts = request.path.split('/');
    const projectId = pathParts.pop();
    const updateData = request.body as Partial<Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'auditLog'> >;
    // const authenticatedUserId = getAuthenticatedUserId(request); // Placeholder

    if (!projectId) {
      response.status(400).json({ error: 'Project ID is required in the path.' });
      return;
    }

    await updateProjectLogic(projectId, updateData /*, authenticatedUserId */);
    response.status(200).json({ id: projectId, message: 'Project updated successfully.' });

  } catch (error) {
    functions.logger.error('Error updating project:', error);
    if (error instanceof functions.https.HttpsError) {
        response.status(error.httpErrorCode.status).json({ error: error.message, details: error.details });
    } else {
        response.status(500).json({ error: 'Failed to update project.', details: (error as Error).message });
    }
  }
});



// Core logic for creating a task
export async function createTaskLogic(
  projectId: string,
  taskData: Omit<Task, 'id' | 'projectId' | 'createdAt' | 'updatedAt' | 'auditLog'>,
  authenticatedUserId?: string
): Promise<Task> {
  if (!projectId) {
    throw new functions.https.HttpsError('invalid-argument', 'Project ID is required to create a task.');
  }

  const projectRef = projectsCollection.doc(projectId);
  const projectDoc = await projectRef.get();
  if (!projectDoc.exists) {
    throw new functions.https.HttpsError('not-found', `Project with ID "${projectId}" not found.`);
  }

  // --- Basic Validation for Task ---
  if (!taskData.name || typeof taskData.name !== 'string' || taskData.name.trim() === '') {
    throw new functions.https.HttpsError('invalid-argument', 'Task name is required and must be a non-empty string.');
  }
  const allowedStatuses: TaskStatus[] = ['To Do', 'In Progress', 'Done', 'Blocked'];
  if (!taskData.status || !allowedStatuses.includes(taskData.status)) {
    throw new functions.https.HttpsError('invalid-argument', `Invalid task status. Must be one of: ${allowedStatuses.join(', ')}`);
  }
  if (taskData.startDate && !Date.parse(taskData.startDate)) {
    throw new functions.https.HttpsError('invalid-argument', 'Invalid task startDate format.');
  }
  if (taskData.endDate && !Date.parse(taskData.endDate)) {
    throw new functions.https.HttpsError('invalid-argument', 'Invalid task endDate format.');
  }
  if (taskData.startDate && taskData.endDate && new Date(taskData.startDate) > new Date(taskData.endDate)) {
    throw new functions.https.HttpsError('invalid-argument', 'Task startDate cannot be after endDate.');
  }
  if (taskData.estimatedHours !== undefined && (typeof taskData.estimatedHours !== 'number' || taskData.estimatedHours < 0)) {
    throw new functions.https.HttpsError('invalid-argument', 'Task estimatedHours must be a non-negative number if provided.');
  }
  if (taskData.actualHours !== undefined && (typeof taskData.actualHours !== 'number' || taskData.actualHours < 0)) {
    throw new functions.https.HttpsError('invalid-argument', 'Task actualHours must be a non-negative number if provided.');
  }
  // TODO: Validate assignedResourceId if provided (check if resource exists)

  const now = new Date().toISOString();
  const newTaskData: Omit<Task, 'id'> = {
    ...taskData,
    projectId: projectId,
    createdAt: now,
    updatedAt: now,
    auditLog: [{
      timestamp: now,
      userId: authenticatedUserId || 'system',
      fieldName: 'N/A',
      oldValue: 'N/A',
      newValue: 'N/A',
      description: 'Task created',
    } as AuditLogEntry],
  };

  const tasksCollectionRef = projectRef.collection('tasks');
  const docRef = await tasksCollectionRef.add(newTaskData);
  return { id: docRef.id, ...newTaskData };
}

/**
 * Creates a new task for a specific project.
 * Tasks are stored as a subcollection under the project.
 */
export const createTask = functions.https.onRequest(async (request, response) => {
  if (request.method !== 'POST') {
    response.status(405).send('Method Not Allowed');
    return;
  }

  try {
    const pathParts = request.path.split('/'); // e.g., /projects/projectIdValue/tasks
    const projectId = pathParts[pathParts.length - 2]; // projectId is second to last
    const taskData = request.body as Omit<Task, 'id' | 'projectId' | 'createdAt' | 'updatedAt' | 'auditLog'>;
    // const authenticatedUserId = getAuthenticatedUserId(request); // Placeholder

    if (!projectId) {
      // This check is technically redundant if createTaskLogic handles it,
      // but good for early exit before calling the logic function.
      response.status(400).json({ error: 'Project ID is required in the path.' });
      return;
    }

    const newTask = await createTaskLogic(projectId, taskData /*, authenticatedUserId */);
    response.status(201).json(newTask);

  } catch (error) {
    functions.logger.error('Error creating task:', error);
    if (error instanceof functions.https.HttpsError) {
        response.status(error.httpErrorCode.status).json({ error: error.message, details: error.details });
    } else {
        response.status(500).json({ error: 'Failed to create task.', details: (error as Error).message });
    }
  }
});



// Core logic for listing tasks for a project
// TODO: Enhance with query parameters for pagination, filtering, sorting
export async function listTasksLogic(projectId: string): Promise<Task[]> {
  if (!projectId) {
    throw new functions.https.HttpsError('invalid-argument', 'Project ID is required to list tasks.');
  }

  const projectRef = projectsCollection.doc(projectId);
  const projectDoc = await projectRef.get();
  if (!projectDoc.exists) {
    throw new functions.https.HttpsError('not-found', `Project with ID "${projectId}" not found.`);
  }

  const tasksCollectionRef = projectRef.collection('tasks');
  const snapshot = await tasksCollectionRef.orderBy('name', 'asc').get();

  if (snapshot.empty) {
    return [];
  }

  const tasks: Task[] = [];
  snapshot.forEach(doc => {
    tasks.push({ id: doc.id, ...doc.data() } as Task);
  });
  return tasks;
}

/**
 * Lists all tasks for a specific project.
 */
export const listTasks = functions.https.onRequest(async (request, response) => {
  if (request.method !== 'GET') {
    response.status(405).send('Method Not Allowed');
    return;
  }

  try {
    const pathParts = request.path.split('/'); // e.g., /projects/projectIdValue/tasks
    const projectId = pathParts[pathParts.length - 2];

    if (!projectId) {
      // Redundant if logic function handles it, but good for early exit.
      response.status(400).json({ error: 'Project ID is required in the path.' });
      return;
    }

    const tasks = await listTasksLogic(projectId);
    response.status(200).json(tasks);

  } catch (error) {
    functions.logger.error('Error listing tasks:', error);
    if (error instanceof functions.https.HttpsError) {
        response.status(error.httpErrorCode.status).json({ error: error.message, details: error.details });
    } else {
        response.status(500).json({ error: 'Failed to list tasks.', details: (error as Error).message });
    }
  }
});



// Core logic for updating a task
export async function updateTaskLogic(
  projectId: string,
  taskId: string,
  updateData: Partial<Omit<Task, 'id' | 'projectId' | 'createdAt' | 'updatedAt' | 'auditLog'> >,
  authenticatedUserId?: string
): Promise<void> {
  if (!projectId || !taskId) {
    throw new functions.https.HttpsError('invalid-argument', 'Project ID and Task ID are required.');
  }
  if (Object.keys(updateData).length === 0) {
    throw new functions.https.HttpsError('invalid-argument', 'No update data provided.');
  }

  const projectRef = projectsCollection.doc(projectId);
  // First, check if the project itself exists, though not strictly necessary for task update if task path is globally unique
  // However, it's good practice for ensuring data integrity and correct pathing.
  const projectDoc = await projectRef.get();
  if (!projectDoc.exists) {
      throw new functions.https.HttpsError('not-found', `Project with ID "${projectId}" not found.`);
  }

  const taskRef = projectRef.collection('tasks').doc(taskId);
  const taskDoc = await taskRef.get();

  if (!taskDoc.exists) {
    throw new functions.https.HttpsError('not-found', `Task with ID "${taskId}" not found in project "${projectId}".`);
  }
  const existingTask = taskDoc.data() as Task;

  // --- Basic Validation for updated fields ---
  if (updateData.name !== undefined && (typeof updateData.name !== 'string' || updateData.name.trim() === '')) {
    throw new functions.https.HttpsError('invalid-argument', 'Task name must be a non-empty string if provided.');
  }
  if (updateData.status) {
    const allowedStatuses: TaskStatus[] = ['To Do', 'In Progress', 'Done', 'Blocked'];
    if (!allowedStatuses.includes(updateData.status)) {
      throw new functions.https.HttpsError('invalid-argument', `Invalid task status. Must be one of: ${allowedStatuses.join(', ')}`);
    }
  }
  if (updateData.startDate && !Date.parse(updateData.startDate)) {
    throw new functions.https.HttpsError('invalid-argument', 'Invalid task startDate format.');
  }
  if (updateData.endDate && !Date.parse(updateData.endDate)) {
    throw new functions.https.HttpsError('invalid-argument', 'Invalid task endDate format.');
  }

  const newStartDate = updateData.startDate ? new Date(updateData.startDate) : (existingTask.startDate ? new Date(existingTask.startDate) : null);
  const newEndDate = updateData.endDate ? new Date(updateData.endDate) : (existingTask.endDate ? new Date(existingTask.endDate) : null);

  if (newStartDate && newEndDate && newStartDate > newEndDate) {
    throw new functions.https.HttpsError('invalid-argument', 'Task startDate cannot be after endDate.');
  }
  if (updateData.estimatedHours !== undefined && (typeof updateData.estimatedHours !== 'number' || updateData.estimatedHours < 0)) {
    throw new functions.https.HttpsError('invalid-argument', 'Task estimatedHours must be a non-negative number if provided.');
  }
  if (updateData.actualHours !== undefined && (typeof updateData.actualHours !== 'number' || updateData.actualHours < 0)) {
    throw new functions.https.HttpsError('invalid-argument', 'Task actualHours must be a non-negative number if provided.');
  }
  // TODO: Validate assignedResourceId if provided

  const now = new Date().toISOString();
  const newAuditLogEntries: AuditLogEntry[] = [];

  for (const key in updateData) {
    if (Object.prototype.hasOwnProperty.call(updateData, key)) {
      const typedKey = key as keyof typeof updateData;
      if (JSON.stringify(existingTask[typedKey]) !== JSON.stringify(updateData[typedKey])) {
        newAuditLogEntries.push({
          timestamp: now,
          userId: authenticatedUserId || 'system',
          fieldName: typedKey,
          oldValue: existingTask[typedKey],
          newValue: updateData[typedKey],
          description: `Updated ${typedKey}`,
        });
      }
    }
  }

  const finalUpdateData: any = {
    ...updateData,
    updatedAt: now,
  };

  if (newAuditLogEntries.length > 0) {
    finalUpdateData.auditLog = admin.firestore.FieldValue.arrayUnion(...newAuditLogEntries);
  }

  await taskRef.update(finalUpdateData);
}

/**
 * Updates an existing task within a project.
 */
export const updateTask = functions.https.onRequest(async (request, response) => {
  if (request.method !== 'PUT') {
    response.status(405).send('Method Not Allowed');
    return;
  }

  try {
    const pathParts = request.path.split('/'); // e.g., /projects/projectIdValue/tasks/taskIdValue
    const taskId = pathParts.pop();
    const projectId = pathParts[pathParts.length - 1]; // After popping taskId, projectId is now last
    
    const updateData = request.body as Partial<Omit<Task, 'id' | 'projectId' | 'createdAt' | 'updatedAt' | 'auditLog'> >;
    // const authenticatedUserId = getAuthenticatedUserId(request); // Placeholder

    if (!projectId || !taskId) {
      // Redundant if logic function handles it, but good for early exit.
      response.status(400).json({ error: 'Project ID and Task ID are required in the path.' });
      return;
    }

    await updateTaskLogic(projectId, taskId, updateData /*, authenticatedUserId */);
    response.status(200).json({ projectId: projectId, taskId: taskId, message: 'Task updated successfully.' });

  } catch (error) {
    functions.logger.error('Error updating task:', error);
    if (error instanceof functions.https.HttpsError) {
        response.status(error.httpErrorCode.status).json({ error: error.message, details: error.details });
    } else {
        response.status(500).json({ error: 'Failed to update task.', details: (error as Error).message });
    }
  }
});


