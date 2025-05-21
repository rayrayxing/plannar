import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Resource, AuditLogEntry } from './types/resource.types';

// Assumes Firebase Admin SDK is initialized in index.ts or a similar central file
// e.g., admin.initializeApp();
const db = admin.firestore();
const resourcesCollection = db.collection('resources');

/**
 * Creates a new resource.
 * PRD Lines: 57-62, 69, 213-241, 302.
 */
// Core logic for creating a resource
export async function createResourceLogic(
    data: Partial<Omit<Resource, 'id' | 'createdAt' | 'updatedAt' | 'auditLog'> >,
    authenticatedUserId?: string // Optional: pass if auth is integrated
  ): Promise<Resource> {
    // --- Basic Input Validation (expand with a library like Zod or Joi) ---
    if (!data.personalInfo || !data.personalInfo.name || !data.personalInfo.email || !data.personalInfo.employeeId) {
      throw new functions.https.HttpsError('invalid-argument', 'Missing required personal information: name, email, employeeId.');
    }
    if (!data.status) {
        throw new functions.https.HttpsError('invalid-argument', 'Missing required field: status.');
    }
    if (!data.rates || data.rates.standard === undefined) {
        throw new functions.https.HttpsError('invalid-argument', 'Missing required field: rates.standard.');
    }

// TODO: Add more comprehensive validation for all fields, skills, availability, rates structure.

    // --- PersonalInfo Validation ---
    const emailRegex = /^(([^<>()[\]\\.,;:\\s@"]+(\\.[^<>()[\]\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$/;
    if (data.personalInfo && data.personalInfo.email && !emailRegex.test(data.personalInfo.email)) {
      throw new functions.https.HttpsError('invalid-argument', 'Invalid email format for personalInfo.email.');
    }

    // --- Status Validation ---
    // Assuming ResourceStatus is imported or defined in scope
    const allowedStatuses: ResourceStatus[] = ['active', 'onboarding', 'offboarding', 'on-leave', 'pending-hire'];
    if (data.status && !allowedStatuses.includes(data.status as ResourceStatus)) {
      throw new functions.https.HttpsError('invalid-argument', `Invalid status value. Must be one of: ${allowedStatuses.join(', ')}.`);
    }

    // --- Rates Validation ---
    if (data.rates && data.rates.standard !== undefined && (typeof data.rates.standard !== 'number' || data.rates.standard <= 0)) {
      throw new functions.https.HttpsError('invalid-argument', 'rates.standard must be a positive number.');
    }
    if (data.rates && data.rates.overtime !== undefined && (typeof data.rates.overtime !== 'number' || data.rates.overtime <= 0)) {
      throw new functions.https.HttpsError('invalid-argument', 'rates.overtime must be a positive number if provided.');
    }
    if (data.rates && data.rates.weekend !== undefined && (typeof data.rates.weekend !== 'number' || data.rates.weekend <= 0)) {
      throw new functions.https.HttpsError('invalid-argument', 'rates.weekend must be a positive number if provided.');
    }

    // --- Skills Validation ---
    if (data.skills && Array.isArray(data.skills)) {
      for (const skill of data.skills) {
        if (!skill.name || typeof skill.name !== 'string') {
          throw new functions.https.HttpsError('invalid-argument', 'Each skill must have a non-empty name.');
        }
        if (typeof skill.proficiency !== 'number' || skill.proficiency < 1 || skill.proficiency > 10) {
          throw new functions.https.HttpsError('invalid-argument', `Skill "${skill.name}" proficiency must be a number between 1 and 10.`);
        }
        if (typeof skill.yearsExperience !== 'number' || skill.yearsExperience < 0) {
          throw new functions.https.HttpsError('invalid-argument', `Skill "${skill.name}" yearsExperience must be a non-negative number.`);
        }
      }
    }
    
    // --- Availability Validation ---
    if (data.availability) {
      if (!data.availability.workArrangement || !data.availability.workArrangement.type) {
        throw new functions.https.HttpsError('invalid-argument', 'availability.workArrangement.type is required.');
      }
      // Assuming WorkArrangement is imported or defined in scope
      const allowedWorkArrangementTypes: WorkArrangement['type'][] = ['full-time', 'part-time', 'contractor', 'custom'];
      if (!allowedWorkArrangementTypes.includes(data.availability.workArrangement.type)) {
        throw new functions.https.HttpsError('invalid-argument', `Invalid workArrangement.type. Must be one of: ${allowedWorkArrangementTypes.join(', ')}.`);
      }
      // TODO: Add validation for standardHours based on workArrangement.type if needed (e.g., start/end time formats)
      // TODO: Add validation for timeOff entries (dates, status, etc.)
    }

    // --- Max Assignments & Max Hours Per Day Validation ---
    if (data.maxAssignments !== undefined && (typeof data.maxAssignments !== 'number' || !Number.isInteger(data.maxAssignments) || data.maxAssignments < 0)) {
        throw new functions.https.HttpsError('invalid-argument', 'maxAssignments must be a non-negative integer if provided.');
    }
    if (data.maxHoursPerDay !== undefined && (typeof data.maxHoursPerDay !== 'number' || !Number.isInteger(data.maxHoursPerDay) || data.maxHoursPerDay <= 0)) {
        throw new functions.https.HttpsError('invalid-argument', 'maxHoursPerDay must be a positive integer if provided.');
    }

    // --- Uniqueness Checks ---
    if (data.personalInfo && data.personalInfo.email) {
      const emailExists = await resourcesCollection.where('personalInfo.email', '==', data.personalInfo.email).limit(1).get();
      if (!emailExists.empty) {
        throw new functions.https.HttpsError('already-exists', `A resource with email "${data.personalInfo.email}" already exists.`);
      }
    }
    if (data.personalInfo && data.personalInfo.employeeId) {
      const employeeIdExists = await resourcesCollection.where('personalInfo.employeeId', '==', data.personalInfo.employeeId).limit(1).get();
      if (!employeeIdExists.empty) {
        throw new functions.https.HttpsError('already-exists', `A resource with employee ID "${data.personalInfo.employeeId}" already exists.`);
      }
    }

    const newResourceId = resourcesCollection.doc().id;
    const now = new Date().toISOString();

    const initialAuditLogEntry: AuditLogEntry = {
      timestamp: now,
      userId: authenticatedUserId || 'system', 
      fieldName: 'N/A',
      oldValue: 'N/A',
      newValue: 'N/A',
      description: 'Resource profile created.',
    };

    const newResource: Resource = {
      id: newResourceId,
      ...{
        skills: [],
        availability: { workArrangement: { type: 'full-time' }, timeOff: [] },
        certifications: [],
        specializations: [],
        historicalPerformanceMetrics: [],
        department: 'N/A',
        location: 'N/A',
        managerId: 'N/A',
        ...data,
      },
      personalInfo: data.personalInfo, 
      status: data.status,
      rates: data.rates, 
      maxAssignments: data.maxAssignments === undefined ? 2 : data.maxAssignments, 
      maxHoursPerDay: data.maxHoursPerDay === undefined ? 14 : data.maxHoursPerDay, 
      auditLog: [initialAuditLogEntry],
      createdAt: now,
      updatedAt: now,
    };

    await resourcesCollection.doc(newResourceId).set(newResource);
    return newResource; // Return the full new resource, ID is part of it
}

/**
 * Creates a new resource.
 * PRD Lines: 57-62, 69, 213-241, 302.
 */
export const createResource = functions.https.onRequest(async (request, response) => {
  if (request.method !== 'POST') {
    response.status(405).send('Method Not Allowed');
    return;
  }

  try {
    const data = request.body as Partial<Omit<Resource, 'id' | 'createdAt' | 'updatedAt' | 'auditLog'> >;
    // TODO: Extract authenticated user ID from request if auth is set up (e.g., from a decoded token)
    // const authenticatedUserId = getUserIdFromRequest(request); 
    const newResource = await createResourceLogic(data /*, authenticatedUserId */);
    response.status(201).json(newResource);

  } catch (error) {
    functions.logger.error('Error creating resource:', error);
    if (error instanceof functions.https.HttpsError) {
      response.status(error.httpErrorCode.status).json({ error: error.message, details: error.details });
    } else {
      response.status(500).json({ error: 'Failed to create resource.', details: (error as Error).message });
    }
  }
});


/**
 * Lists all resources.
 * PRD Line: 300.
 * TODO: Add pagination, filtering, and sorting capabilities.
 * TODO: Consider which fields to return in the list view (full object can be large).
 *       For now, returning the full object.
 */

// Core logic for listing resources with filtering, sorting, and pagination
export async function listResourcesLogic(queryParams: {
  limit?: string;
  startAfter?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: string;
}): Promise<{ data: Resource[]; nextPageToken: string | null }> {
  const { limit, startAfter, status, sortBy, sortOrder } = queryParams;

  let query: admin.firestore.Query = resourcesCollection;

  // Filtering
  if (status && typeof status === 'string') {
    query = query.where('status', '==', status);
  }
  // TODO: Add more complex filtering (e.g., skills.name array-contains, availability.workArrangement.type)
  // Note: Firestore requires indexes for most composite queries (filter + sort).

  // Sorting
  if (sortBy && typeof sortBy === 'string') {
    const order = sortOrder === 'desc' ? 'desc' : 'asc';
    query = query.orderBy(sortBy, order);
  } else {
    query = query.orderBy('personalInfo.name', 'asc'); // Default sort
  }

  // Pagination
  const numLimit = parseInt(limit || '10', 10); // Default limit to 10 if not provided
  query = query.limit(numLimit);

  if (startAfter && typeof startAfter === 'string') {
    const startAfterDoc = await resourcesCollection.doc(startAfter).get();
    if (startAfterDoc.exists) {
      query = query.startAfter(startAfterDoc);
    } else {
      functions.logger.warn(`Document with ID "${startAfter}" provided for startAfter not found. Proceeding without it.`);
      // Consider throwing an error if startAfter doc must exist: 
      // throw new functions.https.HttpsError('invalid-argument', `startAfter document ID "${startAfter}" not found.`);
    }
  }

  const snapshot = await query.get();

  if (snapshot.empty) {
    return { data: [], nextPageToken: null };
  }

  const resources: Resource[] = [];
  snapshot.forEach(doc => {
    resources.push({ id: doc.id, ...doc.data() } as Resource);
  });

  let nextPageToken: string | null = null;
  if (resources.length === numLimit) { // If the number of docs returned equals the limit, there might be more.
    nextPageToken = snapshot.docs[snapshot.docs.length - 1].id;
  }

  return { data: resources, nextPageToken };
}

export const listResources = functions.https.onRequest(async (request, response) => {
  if (request.method !== 'GET') {
    response.status(405).send('Method Not Allowed');
    return;
  }

  try {
    // queryParams are directly from request.query, which are all optional strings
    const result = await listResourcesLogic(request.query as any);
    response.status(200).json(result);

  } catch (error) {
    functions.logger.error('Error listing resources:', error);
    if (error instanceof functions.https.HttpsError) {
        response.status(error.httpErrorCode.status).json({ error: error.message, details: error.details });
    } else {
        response.status(500).json({ error: 'Failed to list resources.', details: (error as Error).message });
    }
  }
});



// Core logic for getting a resource by ID
export async function getResourceByIdLogic(resourceId: string): Promise<Resource> {
  if (!resourceId) {
    throw new functions.https.HttpsError('invalid-argument', 'Resource ID is required.');
  }
  const doc = await resourcesCollection.doc(resourceId).get();

  if (!doc.exists) {
    throw new functions.https.HttpsError('not-found', 'Resource not found.');
  }
  return { id: doc.id, ...doc.data() } as Resource;
}

/**
 * Gets a specific resource by its ID.
 * PRD Line: 301.
 */
export const getResourceById = functions.https.onRequest(async (request, response) => {
  if (request.method !== 'GET') {
    response.status(405).send('Method Not Allowed');
    return;
  }

  try {
    const pathParts = request.path.split('/');
    const resourceId = pathParts.pop();

    if (!resourceId) {
      response.status(400).json({ error: 'Resource ID is required in the path.' });
      return;
    }

    const resource = await getResourceByIdLogic(resourceId);
    response.status(200).json(resource);

  } catch (error) {
    functions.logger.error('Error getting resource by ID:', error);
    if (error instanceof functions.https.HttpsError) {
      response.status(error.httpErrorCode.status).json({ error: error.message, details: error.details });
    } else {
      response.status(500).json({ error: 'Failed to get resource.', details: (error as Error).message });
    }
  }
});



// Core logic for updating a resource
export async function updateResourceLogic(
  resourceId: string,
  updateData: Partial<Omit<Resource, 'id' | 'createdAt' | 'updatedAt' | 'auditLog'> >,
  authenticatedUserId?: string // Optional: pass if auth is integrated
): Promise<void> {
  if (Object.keys(updateData).length === 0) {
    throw new functions.https.HttpsError('invalid-argument', 'No update data provided.');
  }

  const resourceRef = resourcesCollection.doc(resourceId);
  const doc = await resourceRef.get();

  if (!doc.exists) {
    throw new functions.https.HttpsError('not-found', 'Resource not found.');
  }

  const existingResource = doc.data() as Resource;
  const now = new Date().toISOString();
  const newAuditLogEntries: AuditLogEntry[] = [];

  // --- Input Validation for update (similar to create, but for partial data) ---
  // Email format (if provided)
  if (updateData.personalInfo && updateData.personalInfo.email) {
    const emailRegex = /^(([^<>()[\]\\.,;:\\s@"]+(\\.[^<>()[\]\\.,;:\\s@"]+)*)|(\".+\"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegex.test(updateData.personalInfo.email)) {
      throw new functions.https.HttpsError('invalid-argument', 'Invalid email format for personalInfo.email.');
    }
    // Uniqueness check for email if it's being changed
    if (updateData.personalInfo.email !== existingResource.personalInfo.email) {
        const emailExists = await resourcesCollection.where('personalInfo.email', '==', updateData.personalInfo.email).limit(1).get();
        if (!emailExists.empty) {
            throw new functions.https.HttpsError('already-exists', `A resource with email "${updateData.personalInfo.email}" already exists.`);
        }
    }
  }
  // EmployeeId uniqueness if it's being changed
  if (updateData.personalInfo && updateData.personalInfo.employeeId && updateData.personalInfo.employeeId !== existingResource.personalInfo.employeeId) {
    const employeeIdExists = await resourcesCollection.where('personalInfo.employeeId', '==', updateData.personalInfo.employeeId).limit(1).get();
    if (!employeeIdExists.empty) {
        throw new functions.https.HttpsError('already-exists', `A resource with employee ID "${updateData.personalInfo.employeeId}" already exists.`);
    }
  }
  // Status validation (if provided)
  if (updateData.status) {
    const allowedStatuses: ResourceStatus[] = ['active', 'onboarding', 'offboarding', 'on-leave', 'pending-hire'];
    if (!allowedStatuses.includes(updateData.status as ResourceStatus)) {
      throw new functions.https.HttpsError('invalid-argument', `Invalid status value. Must be one of: ${allowedStatuses.join(', ')}.`);
    }
  }
  // Rates validation (if provided)
  if (updateData.rates) {
    if (updateData.rates.standard !== undefined && (typeof updateData.rates.standard !== 'number' || updateData.rates.standard <= 0)) {
      throw new functions.https.HttpsError('invalid-argument', 'rates.standard must be a positive number.');
    }
    if (updateData.rates.overtime !== undefined && (typeof updateData.rates.overtime !== 'number' || updateData.rates.overtime <= 0)) {
      throw new functions.https.HttpsError('invalid-argument', 'rates.overtime must be a positive number if provided.');
    }
    if (updateData.rates.weekend !== undefined && (typeof updateData.rates.weekend !== 'number' || updateData.rates.weekend <= 0)) {
      throw new functions.https.HttpsError('invalid-argument', 'rates.weekend must be a positive number if provided.');
    }
  }
  // TODO: Add more granular validation for skills, availability, etc. if they are part of updateData, similar to createResourceLogic

  // --- Construct Audit Log Entries ---
  for (const key in updateData) {
    if (Object.prototype.hasOwnProperty.call(updateData, key)) {
      const typedKey = key as keyof typeof updateData;
      if (JSON.stringify(existingResource[typedKey]) !== JSON.stringify(updateData[typedKey])) {
        newAuditLogEntries.push({
          timestamp: now,
          userId: authenticatedUserId || 'system',
          fieldName: typedKey,
          oldValue: existingResource[typedKey],
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

  // Business rule: Prevent direct change of employeeId after creation if it's an immutable identifier post-creation.
  // For now, we log if it changes. Email can change but must remain unique.
  if (updateData.personalInfo && updateData.personalInfo.employeeId && updateData.personalInfo.employeeId !== existingResource.personalInfo.employeeId) {
      functions.logger.warn(`Resource ${resourceId} employeeId changed from ${existingResource.personalInfo.employeeId} to ${updateData.personalInfo.employeeId}. Ensure this is allowed by business rules.`);
  }
  if (updateData.personalInfo && updateData.personalInfo.email && updateData.personalInfo.email !== existingResource.personalInfo.email) {
      functions.logger.info(`Resource ${resourceId} email changed from ${existingResource.personalInfo.email} to ${updateData.personalInfo.email}.`);
  }

  await resourceRef.update(finalUpdateData);
}

/**
 * Updates an existing resource by its ID.
 * PRD Line: 303.
 * Handles partial updates and maintains an audit log for changes.
 */
export const updateResource = functions.https.onRequest(async (request, response) => {
  if (request.method !== 'PUT') {
    response.status(405).send('Method Not Allowed');
    return;
  }

  try {
    const pathParts = request.path.split('/');
    const resourceId = pathParts.pop();
    const updateData = request.body as Partial<Omit<Resource, 'id' | 'createdAt' | 'updatedAt' | 'auditLog'> >;
    // const authenticatedUserId = getUserIdFromRequest(request); // Placeholder for actual user ID extraction

    if (!resourceId) {
      // This check is good, but updateResourceLogic will also handle missing resourceId if passed as undefined/null by mistake
      // However, for an HTTP endpoint, it makes sense to validate path params early.
      response.status(400).json({ error: 'Resource ID is required in the path.' });
      return;
    }

    // updateResourceLogic will throw HttpsError on validation issues or if not found.
    await updateResourceLogic(resourceId, updateData /*, authenticatedUserId */);
    response.status(200).json({ id: resourceId, message: 'Resource updated successfully.' });


  } catch (error) {
    functions.logger.error('Error updating resource:', error);
    if (error instanceof functions.https.HttpsError) {
      response.status(error.httpErrorCode.status).json({ error: error.message, details: error.details });
    } else {
      response.status(500).json({ error: 'Failed to update resource.', details: (error as Error).message });
    }
  }
});


/**
 * Gets the skills of a specific resource by its ID.
 * PRD Line: 305.
 */

// Core logic for getting resource skills
export async function getResourceSkillsLogic(resourceId: string): Promise<Skill[]> {
  if (!resourceId) {
    throw new functions.https.HttpsError('invalid-argument', 'Resource ID is required.');
  }
  const doc = await resourcesCollection.doc(resourceId).get();

  if (!doc.exists) {
    throw new functions.https.HttpsError('not-found', 'Resource not found.');
  }
  const resourceData = doc.data() as Resource;
  return resourceData.skills || [];
}

export const getResourceSkills = functions.https.onRequest(async (request, response) => {
  if (request.method !== 'GET') {
    response.status(405).send('Method Not Allowed');
    return;
  }

  try {
    const pathParts = request.path.split('/'); // e.g. /getResourceSkills/resourceId/skills
    const resourceId = pathParts[pathParts.length - 2]; // Second to last part is ID

    if (!resourceId) {
      response.status(400).json({ error: 'Resource ID is required in the path.' });
      return;
    }

    const skills = await getResourceSkillsLogic(resourceId);
    response.status(200).json(skills);

  } catch (error) {
    functions.logger.error('Error getting resource skills:', error);
    if (error instanceof functions.https.HttpsError) {
      response.status(error.httpErrorCode.status).json({ error: error.message, details: error.details });
    } else {
      response.status(500).json({ error: 'Failed to get resource skills.', details: (error as Error).message });
    }
  }
});
