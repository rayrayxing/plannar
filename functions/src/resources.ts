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
export const createResource = functions.https.onRequest(async (request, response) => {
  if (request.method !== 'POST') {
    response.status(405).send('Method Not Allowed');
    return;
  }

  try {
    const data = request.body as Partial<Omit<Resource, 'id' | 'createdAt' | 'updatedAt' | 'auditLog'> >;

    // --- Basic Input Validation (expand with a library like Zod or Joi) ---
    if (!data.personalInfo || !data.personalInfo.name || !data.personalInfo.email || !data.personalInfo.employeeId) {
      response.status(400).json({ error: 'Missing required personal information: name, email, employeeId.' });
      return;
    }
    if (!data.status) {
        response.status(400).json({ error: 'Missing required field: status.' });
        return;
    }
    if (!data.rates || data.rates.standard === undefined) {
        response.status(400).json({ error: 'Missing required field: rates.standard.' });
        return;
    }

    // TODO: Add more comprehensive validation for all fields, skills, availability, rates structure.
    // TODO: Check for uniqueness of email and employeeId before creating.
    // This would typically involve a query: 
    // const emailExists = await resourcesCollection.where('personalInfo.email', '==', data.personalInfo.email).limit(1).get();
    // if (!emailExists.empty) { response.status(409).json({ error: 'Email already exists.'}); return; }

    const newResourceId = resourcesCollection.doc().id;
    const now = new Date().toISOString();

    const initialAuditLogEntry: AuditLogEntry = {
      timestamp: now,
      userId: 'system', // Or authenticated user ID if available
      fieldName: 'N/A',
      oldValue: 'N/A',
      newValue: 'N/A',
      description: 'Resource profile created.',
    };

    const newResource: Resource = {
      id: newResourceId,
      ...{
        // Provide defaults for optional top-level fields if not provided
        skills: [],
        availability: { workArrangement: { type: 'full-time' }, timeOff: [] }, // Default work arrangement
        certifications: [],
        specializations: [],
        historicalPerformanceMetrics: [],
        department: 'N/A',
        location: 'N/A',
        managerId: 'N/A',
        ...data, // Spread incoming data, potentially overwriting defaults
      },
      personalInfo: data.personalInfo, // Ensure it's not overwritten by spread if partially provided
      status: data.status,
      rates: data.rates, // Ensure it's not overwritten
      maxAssignments: data.maxAssignments === undefined ? 2 : data.maxAssignments, // PRD Default: 2
      maxHoursPerDay: data.maxHoursPerDay === undefined ? 14 : data.maxHoursPerDay, // PRD Default: 14
      auditLog: [initialAuditLogEntry],
      createdAt: now,
      updatedAt: now,
    };

    // Firestore security rules should protect rate information (PRD Line 68)
    await resourcesCollection.doc(newResourceId).set(newResource);

    response.status(201).json({ id: newResourceId, ...newResource });

  } catch (error) {
    functions.logger.error('Error creating resource:', error);
    response.status(500).json({ error: 'Failed to create resource.', details: (error as Error).message });
  }
});


/**
 * Lists all resources.
 * PRD Line: 300.
 * TODO: Add pagination, filtering, and sorting capabilities.
 * TODO: Consider which fields to return in the list view (full object can be large).
 *       For now, returning the full object.
 */
export const listResources = functions.https.onRequest(async (request, response) => {
  if (request.method !== 'GET') {
    response.status(405).send('Method Not Allowed');
    return;
  }

  try {
    const snapshot = await resourcesCollection.get();
    if (snapshot.empty) {
      response.status(200).json([]);
      return;
    }

    const resources: Resource[] = [];
    snapshot.forEach(doc => {
      resources.push(doc.data() as Resource);
    });

    response.status(200).json(resources);

  } catch (error) {
    functions.logger.error('Error listing resources:', error);
    response.status(500).json({ error: 'Failed to list resources.', details: (error as Error).message });
  }
});


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
    // The resource ID is expected to be the last part of the path,
    // e.g., /api/resources/{id} -> functions are typically named like project-region-functionName
    // So, request.path might be /project-region-getResourceById/resource_id_value
    // Or if using Express routing within the function, it's handled differently.
    // For a simple Cloud Function, we often rely on query parameters or a fixed path structure if not using a framework.
    // Assuming the ID is passed as the last segment of the URL path or a query param.
    // Firebase Hosting rewrites can map /api/resources/:id to this function.
    // Let's assume the ID is passed as a query parameter `id` for simplicity here, 
    // or parsed from path if using Express.js style routing with Firebase Hosting.
    // For this example, let's assume the function is triggered by a path like /getResourceById?id=xxx
    // OR, if the function name itself is `api-resources-id` (not typical), then path parsing is needed.

    // A more robust way with Firebase Hosting + Cloud Functions is to use Express app:
    // const parts = request.path.split('/');
    // const resourceId = parts.pop() || parts.pop(); // Handle trailing slash

    // For a direct function call, let's assume the ID is in the query for now.
    // Or, if the function is deployed as `api/resources/:resourceId`, then `request.params.resourceId` would be available if using an Express wrapper.
    // Given the current setup, we'll assume the function is called with the ID as part of the path that Firebase Hosting maps.
    // functions.logger.info('Request path:', request.path); // e.g. /getResourceById/theactualid
    const pathParts = request.path.split('/');
    const resourceId = pathParts.pop();

    if (!resourceId) {
      response.status(400).json({ error: 'Resource ID is required in the path.' });
      return;
    }

    const doc = await resourcesCollection.doc(resourceId).get();

    if (!doc.exists) {
      response.status(404).json({ error: 'Resource not found.' });
      return;
    }

    response.status(200).json(doc.data() as Resource);

  } catch (error) {
    functions.logger.error('Error getting resource by ID:', error);
    response.status(500).json({ error: 'Failed to get resource.', details: (error as Error).message });
  }
});


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

    if (!resourceId) {
      response.status(400).json({ error: 'Resource ID is required in the path.' });
      return;
    }

    if (Object.keys(updateData).length === 0) {
      response.status(400).json({ error: 'No update data provided.' });
      return;
    }

    const resourceRef = resourcesCollection.doc(resourceId);
    const doc = await resourceRef.get();

    if (!doc.exists) {
      response.status(404).json({ error: 'Resource not found.' });
      return;
    }

    const existingResource = doc.data() as Resource;
    const now = new Date().toISOString();
    const newAuditLogEntries: AuditLogEntry[] = [];

    // --- Construct Audit Log Entries ---
    // This is a simplified audit log. For nested objects, you might want more granular tracking.
    // For example, if only `personalInfo.phone` changes, this logs the whole `personalInfo` object.
    // A more sophisticated approach would compare nested fields.
    for (const key in updateData) {
      if (Object.prototype.hasOwnProperty.call(updateData, key)) {
        const typedKey = key as keyof typeof updateData;
        if (JSON.stringify(existingResource[typedKey]) !== JSON.stringify(updateData[typedKey])) {
          newAuditLogEntries.push({
            timestamp: now,
            userId: 'system', // Or authenticated user ID
            fieldName: typedKey,
            oldValue: existingResource[typedKey],
            newValue: updateData[typedKey],
            description: `Updated ${typedKey}`,
          });
        }
      }
    }

    // Prepare the data for Firestore update
    const finalUpdateData: any = {
      ...updateData,
      updatedAt: now,
    };

    if (newAuditLogEntries.length > 0) {
      finalUpdateData.auditLog = admin.firestore.FieldValue.arrayUnion(...newAuditLogEntries);
    }
    
    // Prevent changing email or employeeId if they are meant to be immutable or have special handling
    if (updateData.personalInfo && (updateData.personalInfo.email !== existingResource.personalInfo.email || updateData.personalInfo.employeeId !== existingResource.personalInfo.employeeId)) {
        // TODO: Add logic to handle/prevent changes to unique identifiers like email/employeeId or trigger a verification process.
        // For now, we allow it but this should be reviewed for business rules.
        functions.logger.warn(`Resource ${resourceId} email or employeeId changed. Ensure this is allowed.`);
    }

    // Firestore security rules should protect rate information (PRD Line 68)
    await resourceRef.update(finalUpdateData);

    response.status(200).json({ id: resourceId, message: 'Resource updated successfully.' });

  } catch (error) {
    functions.logger.error('Error updating resource:', error);
    response.status(500).json({ error: 'Failed to update resource.', details: (error as Error).message });
  }
});


/**
 * Gets the skills of a specific resource by its ID.
 * PRD Line: 305.
 */
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

    const doc = await resourcesCollection.doc(resourceId).get();

    if (!doc.exists) {
      response.status(404).json({ error: 'Resource not found.' });
      return;
    }

    const resourceData = doc.data() as Resource;
    response.status(200).json(resourceData.skills || []);

  } catch (error) {
    functions.logger.error('Error getting resource skills:', error);
    response.status(500).json({ error: 'Failed to get resource skills.', details: (error as Error).message });
  }
});
