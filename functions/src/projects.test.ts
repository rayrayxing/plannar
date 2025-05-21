
// Define mocks that are used by jest.doMock or jest.mock
export const mockInitializeApp = jest.fn();
export const mockFirestore = jest.fn();
export const mockFirestoreCollection = jest.fn();
export const mockFirestoreDoc = jest.fn();
export const mockFirestoreSet = jest.fn(); // For creating/setting whole doc
export const mockFirestoreAdd = jest.fn(); // For adding to a collection (auto-ID)
export const mockFirestoreUpdate = jest.fn(); // For updating existing doc
export const mockFirestoreGet = jest.fn();
export const mockFirestoreWhere = jest.fn();
export const mockFirestoreOrderBy = jest.fn();
export const mockFirestoreLimit = jest.fn();
export const mockFirestoreStartAfter = jest.fn();
export const mockArrayUnion = jest.fn();
export const mockFieldValue = { arrayUnion: mockArrayUnion };

// Mock for admin.app() and the return of initializeApp()
const mockAppInstance = {
  firestore: mockFirestore, // This should be the function that returns the db instance with .collection etc.
  // auth: jest.fn(), // Add other services if needed by SUT
  // storage: jest.fn(),
};
mockInitializeApp.mockReturnValue(mockAppInstance);
const mockAdminAppFunction = jest.fn().mockReturnValue(mockAppInstance);

// Import functions and types needed for test setup, but NOT the SUT yet.
import * as functions from 'firebase-functions';
import { Project, Task, ProjectStatus, TaskStatus } from './types/project.types';
import { AuditLogEntry } from './types/resource.types'; // Assuming AuditLogEntry is used

// Logger mocks can be spied here as functions is imported.
jest.spyOn(functions.logger, 'info').mockImplementation(console.log);
jest.spyOn(functions.logger, 'error').mockImplementation(console.error);

// Placeholder for SUT functions - will be dynamically imported
let createProjectLogicActual: typeof import('./projects').createProjectLogic;
let listProjectsLogicActual: typeof import('./projects').listProjectsLogic;
let getProjectByIdLogicActual: typeof import('./projects').getProjectByIdLogic;
let updateProjectLogicActual: typeof import('./projects').updateProjectLogic;
let createTaskLogicActual: typeof import('./projects').createTaskLogic;
let listTasksLogicActual: typeof import('./projects').listTasksLogic;
let updateTaskLogicActual: typeof import('./projects').updateTaskLogic;


describe('Project and Task Management Cloud Functions - Logic', () => {
  beforeEach(async () => {
    // 1. Clear all previously defined mock functions to ensure test isolation.
    mockInitializeApp.mockClear();
    mockFirestore.mockClear();
    mockFirestoreCollection.mockClear();
    mockFirestoreDoc.mockClear();
    mockFirestoreSet.mockClear();
    mockFirestoreAdd.mockClear();
    mockFirestoreUpdate.mockClear();
    mockFirestoreGet.mockClear();
    mockFirestoreWhere.mockClear();
    mockFirestoreOrderBy.mockClear();
    mockFirestoreLimit.mockClear();
    mockFirestoreStartAfter.mockClear();
    mockArrayUnion.mockClear();
    mockAdminAppFunction.mockClear(); // Clear this new mock too

    // Re-mock return value for initializeApp for each test in case it was changed in a specific test
    mockInitializeApp.mockReturnValue(mockAppInstance);
    mockAdminAppFunction.mockReturnValue(mockAppInstance);

    // 2. Re-define default behaviors for mocks.
    // This setup is crucial and needs to correctly mock the Firestore fluent API.

    // Default implementation for mockFirestoreCollection itself
    mockFirestoreCollection.mockImplementation((collectionPath: string) => ({
      doc: mockFirestoreDoc, // Assign the mock function itself
      add: mockFirestoreAdd,         // Used by createTaskLogic
      where: mockFirestoreWhere.mockReturnThis(),
      orderBy: mockFirestoreOrderBy.mockReturnThis(),
      limit: mockFirestoreLimit.mockReturnThis(),
      startAfter: mockFirestoreStartAfter.mockReturnThis(),
      get: mockFirestoreGet,         // Used by listProjectsLogic, listTasksLogic
    }));

    // Default implementation for mockFirestoreDoc itself
    mockFirestoreDoc.mockImplementation((docId?: string) => ({
      id: docId || 'auto-generated-doc-id-mock',
      get: mockFirestoreGet,
      set: mockFirestoreSet,
      update: mockFirestoreUpdate,
      collection: mockFirestoreCollection, // For sub-sub-collections if ever needed
    }));

    // mockFirestore is the function that admin.firestore() or app.firestore() will resolve to.
    // It returns an object that has mockFirestoreCollection as its 'collection' method.
    mockFirestore.mockImplementation(() => ({
      collection: mockFirestoreCollection, // Assign the mock function itself
      // batch: jest.fn(() => ({ commit: jest.fn().mockResolvedValue(undefined) })), // Example if batch is needed
    }));

    // Default resolved values for Firestore operations
    mockFirestoreSet.mockResolvedValue(undefined);
    mockFirestoreAdd.mockResolvedValue({ id: 'new-task-id-mock' });
    mockFirestoreUpdate.mockResolvedValue(undefined);
    // Default for .get() on a document - typically { exists: true, data: () => object, id: string }
    // or { exists: false, data: () => undefined, id: string }
    mockFirestoreGet.mockResolvedValue({ exists: false, data: () => undefined, id: 'mock-get-doc-id' }); 

    // 3. Use jest.doMock to set up the firebase-admin mock *before* importing the SUT.
    jest.doMock('firebase-admin', () => ({
      initializeApp: mockInitializeApp,
      app: mockAdminAppFunction, // Use the new mock for admin.app()
      firestore: Object.assign(mockFirestore, { // admin.firestore (static) should also work
        FieldValue: mockFieldValue,
      }),
      apps: [], // CRITICAL: Ensures admin.apps.length === 0 for the SUT.
      credential: { applicationDefault: jest.fn() },
      storage: jest.fn(() => ({ bucket: jest.fn(() => ({})) })),
    }));

    // 4. Dynamically import the SUT (./projects) AFTER mocks are in place.
    const projectsModule = await import('./projects');
    createProjectLogicActual = projectsModule.createProjectLogic;
    listProjectsLogicActual = projectsModule.listProjectsLogic;
    getProjectByIdLogicActual = projectsModule.getProjectByIdLogic;
    updateProjectLogicActual = projectsModule.updateProjectLogic;
    createTaskLogicActual = projectsModule.createTaskLogic;
    listTasksLogicActual = projectsModule.listTasksLogic;
    updateTaskLogicActual = projectsModule.updateTaskLogic;
  });

  afterEach(() => {
    // Reset modules after each test to ensure a clean slate for the next jest.doMock.
    jest.resetModules();
  });

  // Test suites for each logic function will go here
  describe('createProjectLogic', () => {
    const basicProjectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'auditLog'> = {
      name: 'Test Project',
      description: 'A project for testing',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      status: 'Planning',
      // projectManagerId: 'pm-123', // Not in type
      // budget: 10000, // Not in type
      // currency: 'USD', // Not in type
      // customFields: { client: 'Test Client' }, // Not in type
    };
    const testUserId = 'user-test-uid';

    it('should create a new project and return it with id, timestamps, and audit log', async () => {
      // Arrange
      const mockCreatedDocId = 'mock-project-id-123';
      // mockFirestoreAdd is called by projectsCollection.add()
      // It should resolve with an object containing the ID of the newly created document.
      mockFirestoreAdd.mockResolvedValueOnce({ id: mockCreatedDocId });

      // Act
      const result = await createProjectLogicActual(basicProjectData, testUserId);

      // Assert
      expect(mockInitializeApp).toHaveBeenCalledTimes(1); // Should be called once per SUT import
      expect(mockFirestore).toHaveBeenCalledTimes(1);
      expect(mockFirestoreCollection).toHaveBeenCalledWith('projects');
      expect(mockFirestoreCollection).toHaveBeenCalledTimes(1); // Called once to get the collection reference

      expect(mockFirestoreAdd).toHaveBeenCalledTimes(1);
      const addData = mockFirestoreAdd.mock.calls[0][0]; // Data passed to collection.add()

      // Verify the data sent to Firestore (should not contain 'id')
      expect(addData.id).toBeUndefined(); // ID is generated by Firestore, not passed in addData
      expect(addData.name).toBe(basicProjectData.name);
      expect(addData.status).toBe(basicProjectData.status);
      expect(addData.startDate).toBe(basicProjectData.startDate);
      expect(addData.endDate).toBe(basicProjectData.endDate);
      expect(addData.description).toBe(basicProjectData.description);
      expect(addData.createdAt).toEqual(expect.any(String));
      expect(addData.updatedAt).toEqual(expect.any(String));
      expect(addData.createdAt).toEqual(addData.updatedAt); // For new projects, these are the same
      expect(addData.auditLog).toHaveLength(1);
      expect(addData.auditLog[0].description).toBe('Project created'); // Match exact string from projects.ts
      expect(addData.auditLog[0].userId).toBe(testUserId);
      expect(addData.auditLog[0].fieldName).toBe('N/A');
      expect(addData.auditLog[0].oldValue).toBe('N/A');
      expect(addData.auditLog[0].newValue).toBe('N/A');

      // Verify the returned project object
      expect(result).toBeDefined();
      expect(result.id).toBe(mockCreatedDocId); // ID should be the one returned by mockFirestoreAdd
      expect(result.name).toBe(basicProjectData.name);
      expect(result.status).toBe(basicProjectData.status);
      expect(result.startDate).toBe(basicProjectData.startDate);
      expect(result.endDate).toBe(basicProjectData.endDate);
      expect(result.description).toBe(basicProjectData.description);
      expect(result.createdAt).toEqual(addData.createdAt);
      expect(result.updatedAt).toEqual(addData.updatedAt);
      expect(result.auditLog).toEqual(addData.auditLog);
    });

    it('should throw HttpsError if project name is missing', async () => {
      const invalidData = { ...basicProjectData, name: undefined as any };
      await expect(createProjectLogicActual(invalidData, testUserId))
        .rejects
        .toThrow(new functions.https.HttpsError('invalid-argument', 'Project name is required and must be a non-empty string.'));
    });

    it('should throw HttpsError if project name is empty', async () => {
      const invalidData = { ...basicProjectData, name: '   ' };
      await expect(createProjectLogicActual(invalidData, testUserId))
        .rejects
        .toThrow(new functions.https.HttpsError('invalid-argument', 'Project name is required and must be a non-empty string.'));
    });

    it('should throw HttpsError if startDate is missing', async () => {
      const invalidData = { ...basicProjectData, startDate: undefined as any };
      await expect(createProjectLogicActual(invalidData, testUserId))
        .rejects
        .toThrow(new functions.https.HttpsError('invalid-argument', 'Project startDate is required and must be a valid date string.'));
    });

    it('should throw HttpsError if endDate is missing', async () => {
      const invalidData = { ...basicProjectData, endDate: undefined as any };
      await expect(createProjectLogicActual(invalidData, testUserId))
        .rejects
        .toThrow(new functions.https.HttpsError('invalid-argument', 'Project endDate is required and must be a valid date string.'));
    });

    it('should throw HttpsError if status is missing', async () => {
      const invalidData = { ...basicProjectData, status: undefined as any };
      await expect(createProjectLogicActual(invalidData, testUserId))
        .rejects
        .toThrow(new functions.https.HttpsError('invalid-argument', 'Invalid project status. Must be one of: Planning, In Progress, Completed, On Hold, Cancelled'));
    });

    it('should throw HttpsError for invalid startDate format', async () => {
      const invalidData = { ...basicProjectData, startDate: 'invalid-date' };
      await expect(createProjectLogicActual(invalidData, testUserId))
        .rejects
        .toThrow(new functions.https.HttpsError('invalid-argument', 'Project startDate is required and must be a valid date string.'));
    });

    it('should throw HttpsError for invalid endDate format', async () => {
      const invalidData = { ...basicProjectData, endDate: 'invalid-date' };
      await expect(createProjectLogicActual(invalidData, testUserId))
        .rejects
        .toThrow(new functions.https.HttpsError('invalid-argument', 'Project endDate is required and must be a valid date string.'));
    });

    it('should throw HttpsError if startDate is after endDate', async () => {
      const invalidData = { ...basicProjectData, startDate: '2025-01-01', endDate: '2024-01-01' };
      await expect(createProjectLogicActual(invalidData, testUserId))
        .rejects
        .toThrow(new functions.https.HttpsError('invalid-argument', 'Project startDate cannot be after endDate.'));
    });

    it('should throw HttpsError for invalid status value', async () => {
      const invalidData = { ...basicProjectData, status: 'InvalidStatus' as ProjectStatus };
      await expect(createProjectLogicActual(invalidData, testUserId))
        .rejects
        .toThrow(new functions.https.HttpsError('invalid-argument', 'Invalid project status. Must be one of: Planning, In Progress, Completed, On Hold, Cancelled'));
    });
  });

  describe('listProjectsLogic', () => {
    it('should return an empty array if no projects exist', async () => {
      // Arrange
      mockFirestoreGet.mockResolvedValueOnce({ // Mock for the projects collection get()
        empty: true,
        docs: [],
      });

      // Act
      const result = await listProjectsLogicActual();

      // Assert
      expect(mockFirestoreCollection).toHaveBeenCalledWith('projects');
      expect(mockFirestoreOrderBy).toHaveBeenCalledWith('name', 'asc');
      expect(mockFirestoreGet).toHaveBeenCalledTimes(1);
      expect(result).toEqual([]);
    });

    it('should return a list of projects ordered by name', async () => {
      // Arrange
      const project1 = { id: 'proj-1', name: 'Alpha Project', status: 'Planning', startDate: '2024-01-01', endDate: '2024-06-01' };
      const project2 = { id: 'proj-2', name: 'Beta Project', status: 'In Progress', startDate: '2024-02-01', endDate: '2024-07-01' };
      const mockDocs = [
        { id: project1.id, data: () => project1 },
        { id: project2.id, data: () => project2 },
      ];
      mockFirestoreGet.mockResolvedValueOnce({ // Mock for the projects collection get()
        empty: false,
        docs: mockDocs,
        forEach: (callback: (doc: any) => void) => mockDocs.forEach(callback), // Add forEach mock
      });
      
      // Act
      const result = await listProjectsLogicActual();

      // Assert
      expect(mockFirestoreCollection).toHaveBeenCalledWith('projects');
      expect(mockFirestoreOrderBy).toHaveBeenCalledWith('name', 'asc');
      expect(mockFirestoreGet).toHaveBeenCalledTimes(1);
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual(expect.objectContaining(project1));
      expect(result[1]).toEqual(expect.objectContaining(project2));
    });
  });

  describe('getProjectByIdLogic', () => {
    const projectId = 'test-project-id';
    const projectData = {
      id: projectId,
      name: 'Specific Project',
      description: 'Details for a specific project',
      startDate: '2024-03-01',
      endDate: '2024-09-01',
      status: 'In Progress' as ProjectStatus,
      auditLog: [],
    };

    it('should return a project if found', async () => {
      // Arrange
      mockFirestoreGet.mockResolvedValueOnce({ // Mock for the document get()
        exists: true,
        id: projectId,
        data: () => projectData,
      });

      // Act
      const result = await getProjectByIdLogicActual(projectId);

      // Assert
      expect(mockFirestoreCollection).toHaveBeenCalledWith('projects');
      expect(mockFirestoreDoc).toHaveBeenCalledWith(projectId);
      expect(mockFirestoreGet).toHaveBeenCalledTimes(1);
      expect(result).toEqual(projectData);
    });

    it('should throw HttpsError if project ID is not provided', async () => {
      await expect(getProjectByIdLogicActual(undefined as any))
        .rejects
        .toThrow(new functions.https.HttpsError('invalid-argument', 'Project ID is required.'));
    });

    it('should throw HttpsError with code "not-found" if project does not exist', async () => {
      // Arrange
      mockFirestoreGet.mockResolvedValueOnce({ // Mock for the document get()
        exists: false,
        id: projectId,
        data: () => undefined,
      });

      // Act & Assert
      await expect(getProjectByIdLogicActual(projectId))
        .rejects
        .toThrow(new functions.https.HttpsError('not-found', 'Project not found.'));
      expect(mockFirestoreDoc).toHaveBeenCalledWith(projectId);
    });
  });

  describe('updateProjectLogic', () => {
    const projectId = 'existing-project-id';
    const testUserId = 'user-updater-uid';
    const existingProjectData: Project = {
      id: projectId,
      name: 'Original Project Name',
      description: 'Original description',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      status: 'Planning',
      createdAt: new Date('2024-01-01T10:00:00Z').toISOString(),
      updatedAt: new Date('2024-01-01T10:00:00Z').toISOString(),
      auditLog: [
        { timestamp: new Date('2024-01-01T10:00:00Z').toISOString(), userId: 'creator', fieldName: 'N/A', oldValue: 'N/A', newValue: 'N/A', description: 'Project created' }
      ],
    };

    beforeEach(() => {
      // Default behavior for get() in updateProjectLogic is that the project exists
      mockFirestoreGet.mockResolvedValue({ 
        exists: true, 
        id: projectId, 
        data: () => ({ ...existingProjectData }) // Return a copy
      });
      mockArrayUnion.mockImplementation((...args) => args); // Simple mock for arrayUnion arguments
    });

    it('should update a project and add an audit log entry for changed fields', async () => {
      const updateData: Partial<Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'auditLog'> > = {
        name: 'Updated Project Name',
        status: 'In Progress',
        description: 'Updated description'
      };

      await updateProjectLogicActual(projectId, updateData, testUserId);

      expect(mockFirestoreCollection).toHaveBeenCalledWith('projects');
      expect(mockFirestoreDoc).toHaveBeenCalledWith(projectId);
      expect(mockFirestoreGet).toHaveBeenCalledTimes(1); // To fetch existing project
      expect(mockFirestoreUpdate).toHaveBeenCalledTimes(1);

      const updateCallData = mockFirestoreUpdate.mock.calls[0][0];
      expect(updateCallData.name).toBe(updateData.name);
      expect(updateCallData.status).toBe(updateData.status);
      expect(updateCallData.description).toBe(updateData.description);
      expect(updateCallData.updatedAt).toEqual(expect.any(String));
      expect(updateCallData.updatedAt).not.toBe(existingProjectData.updatedAt);
      
      expect(mockArrayUnion).toHaveBeenCalledTimes(1);
      const auditEntries = mockArrayUnion.mock.calls[0]; // mockArrayUnion was called with spread newAuditLogEntries
      expect(auditEntries).toHaveLength(3); // name, status, description changed

      const nameAudit = auditEntries.find((e: AuditLogEntry) => e.fieldName === 'name');
      expect(nameAudit).toBeDefined();
      expect(nameAudit.oldValue).toBe(existingProjectData.name);
      expect(nameAudit.newValue).toBe(updateData.name);
      expect(nameAudit.userId).toBe(testUserId);

      const statusAudit = auditEntries.find((e: AuditLogEntry) => e.fieldName === 'status');
      expect(statusAudit).toBeDefined();
      expect(statusAudit.oldValue).toBe(existingProjectData.status);
      expect(statusAudit.newValue).toBe(updateData.status);

      const descriptionAudit = auditEntries.find((e: AuditLogEntry) => e.fieldName === 'description');
      expect(descriptionAudit).toBeDefined();
      expect(descriptionAudit.oldValue).toBe(existingProjectData.description);
      expect(descriptionAudit.newValue).toBe(updateData.description);
    });

    it('should not add audit log if field value is unchanged', async () => {
      const updateData: Partial<Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'auditLog'> > = {
        name: existingProjectData.name, // Same name
        status: 'In Progress', // Different status
      };

      await updateProjectLogicActual(projectId, updateData, testUserId);
      expect(mockFirestoreUpdate).toHaveBeenCalledTimes(1);
      const updateCallData = mockFirestoreUpdate.mock.calls[0][0];
      expect(updateCallData.name).toBe(existingProjectData.name); // Should be unchanged
      expect(updateCallData.status).toBe(updateData.status); // Should be updated
      expect(updateCallData.updatedAt).toEqual(expect.any(String));

      expect(mockArrayUnion).toHaveBeenCalledTimes(1);
      const auditEntries = mockArrayUnion.mock.calls[0];
      expect(auditEntries).toHaveLength(1); // Only status should be audited
      expect(auditEntries[0].fieldName).toBe('status');
      expect(auditEntries[0].oldValue).toBe(existingProjectData.status);
      expect(auditEntries[0].newValue).toBe(updateData.status);
    });

    it('should throw HttpsError if project ID is not provided', async () => {
      await expect(updateProjectLogicActual(undefined as any, {}, testUserId))
        .rejects
        .toThrow(new functions.https.HttpsError('invalid-argument', 'Project ID is required.'));
    });

    it('should throw HttpsError if updateData is empty', async () => {
      await expect(updateProjectLogicActual(projectId, {}, testUserId))
        .rejects
        .toThrow(new functions.https.HttpsError('invalid-argument', 'No update data provided.'));
    });

    it('should throw HttpsError with code "not-found" if project does not exist', async () => {
      mockFirestoreGet.mockResolvedValueOnce({ exists: false, id: projectId, data: () => undefined });
      await expect(updateProjectLogicActual(projectId, { name: 'New Name' }, testUserId))
        .rejects
        .toThrow(new functions.https.HttpsError('not-found', 'Project not found.'));
    });

    it('should throw HttpsError for invalid project name (empty string)', async () => {
      await expect(updateProjectLogicActual(projectId, { name: ' ' }, testUserId))
        .rejects
        .toThrow(new functions.https.HttpsError('invalid-argument', 'Project name must be a non-empty string if provided.'));
    });

    it('should throw HttpsError for invalid startDate format', async () => {
      await expect(updateProjectLogicActual(projectId, { startDate: 'invalid-date' }, testUserId))
        .rejects
        .toThrow(new functions.https.HttpsError('invalid-argument', 'Invalid project startDate format.'));
    });

    it('should throw HttpsError for invalid endDate format', async () => {
      await expect(updateProjectLogicActual(projectId, { endDate: 'invalid-date' }, testUserId))
        .rejects
        .toThrow(new functions.https.HttpsError('invalid-argument', 'Invalid project endDate format.'));
    });

    it('should throw HttpsError if new startDate is after existing endDate (when only startDate changes)', async () => {
      await expect(updateProjectLogicActual(projectId, { startDate: '2025-01-01' }, testUserId)) // existing endDate is 2024-12-31
        .rejects
        .toThrow(new functions.https.HttpsError('invalid-argument', 'Project startDate cannot be after endDate.'));
    });

    it('should throw HttpsError if existing startDate is after new endDate (when only endDate changes)', async () => {
      await expect(updateProjectLogicActual(projectId, { endDate: '2023-01-01' }, testUserId)) // existing startDate is 2024-01-01
        .rejects
        .toThrow(new functions.https.HttpsError('invalid-argument', 'Project startDate cannot be after endDate.'));
    });

    it('should throw HttpsError if new startDate is after new endDate', async () => {
      await expect(updateProjectLogicActual(projectId, { startDate: '2025-01-01', endDate: '2024-06-01' }, testUserId))
        .rejects
        .toThrow(new functions.https.HttpsError('invalid-argument', 'Project startDate cannot be after endDate.'));
    });

    it('should throw HttpsError for invalid status value', async () => {
      await expect(updateProjectLogicActual(projectId, { status: 'FakeStatus' as ProjectStatus }, testUserId))
        .rejects
        .toThrow(new functions.https.HttpsError('invalid-argument', 'Invalid project status. Must be one of: Planning, In Progress, Completed, On Hold, Cancelled'));
    });
  });

  describe('createTaskLogic', () => {
    const projectId = 'parent-project-id';
    const testUserId = 'task-creator-uid';
    const basicTaskData: Omit<Task, 'id' | 'projectId' | 'createdAt' | 'updatedAt' | 'auditLog'> = {
      name: 'Test Task',
      description: 'A sub-task for testing',
      status: 'To Do',
      startDate: '2024-02-01',
      endDate: '2024-02-28',
      estimatedHours: 10,
    };

    beforeEach(() => {
      // Default: Project exists for task creation
      mockFirestoreGet.mockResolvedValue({ 
        exists: true, 
        id: projectId, 
        data: () => ({ name: 'Parent Project' }) // Minimal project data
      });
      // mockFirestoreAdd is used by createTaskLogic
      mockFirestoreAdd.mockResolvedValue({ id: 'newly-created-task-id' });
    });

    it('should create a new task under a project and return it', async () => {
      const result = await createTaskLogicActual(projectId, basicTaskData, testUserId);

      expect(mockFirestoreDoc).toHaveBeenCalledWith(projectId); // To check project existence
      expect(mockFirestoreGet).toHaveBeenCalledTimes(1); // For project existence check
      // mockFirestoreCollection should be called twice: once for projects, once for tasks subcollection
      expect(mockFirestoreCollection).toHaveBeenCalledWith('projects');
      expect(mockFirestoreCollection).toHaveBeenCalledWith('tasks'); 
      expect(mockFirestoreAdd).toHaveBeenCalledTimes(1);

      const addData = mockFirestoreAdd.mock.calls[0][0];
      expect(addData.name).toBe(basicTaskData.name);
      expect(addData.projectId).toBe(projectId);
      expect(addData.status).toBe(basicTaskData.status);
      expect(addData.createdAt).toEqual(expect.any(String));
      expect(addData.updatedAt).toEqual(addData.createdAt);
      expect(addData.auditLog).toHaveLength(1);
      expect(addData.auditLog[0].description).toBe('Task created');
      expect(addData.auditLog[0].userId).toBe(testUserId);

      expect(result).toBeDefined();
      expect(result.id).toBe('newly-created-task-id');
      expect(result.name).toBe(basicTaskData.name);
      expect(result.projectId).toBe(projectId);
      expect(result.auditLog).toEqual(addData.auditLog);
    });

    it('should throw HttpsError if project ID is not provided', async () => {
      await expect(createTaskLogicActual(undefined as any, basicTaskData, testUserId))
        .rejects
        .toThrow(new functions.https.HttpsError('invalid-argument', 'Project ID is required to create a task.'));
    });

    it('should throw HttpsError with code "not-found" if parent project does not exist', async () => {
      mockFirestoreGet.mockResolvedValueOnce({ exists: false, id: projectId, data: () => undefined }); // Project not found
      await expect(createTaskLogicActual(projectId, basicTaskData, testUserId))
        .rejects
        .toThrow(new functions.https.HttpsError('not-found', `Project with ID "${projectId}" not found.`));
    });

    it('should throw HttpsError if task name is missing or empty', async () => {
      await expect(createTaskLogicActual(projectId, { ...basicTaskData, name: undefined as any }, testUserId))
        .rejects.toThrow('Task name is required and must be a non-empty string.');
      await expect(createTaskLogicActual(projectId, { ...basicTaskData, name: '  ' }, testUserId))
        .rejects.toThrow('Task name is required and must be a non-empty string.');
    });

    it('should throw HttpsError if task status is missing or invalid', async () => {
      const allowedStatuses: TaskStatus[] = ['To Do', 'In Progress', 'Done', 'Blocked'];
      await expect(createTaskLogicActual(projectId, { ...basicTaskData, status: undefined as any }, testUserId))
        .rejects.toThrow(`Invalid task status. Must be one of: ${allowedStatuses.join(', ')}`);
      await expect(createTaskLogicActual(projectId, { ...basicTaskData, status: 'InvalidStatus' as TaskStatus }, testUserId))
        .rejects.toThrow(`Invalid task status. Must be one of: ${allowedStatuses.join(', ')}`);
    });

    it('should throw HttpsError for invalid startDate or endDate format', async () => {
      await expect(createTaskLogicActual(projectId, { ...basicTaskData, startDate: 'invalid' }, testUserId))
        .rejects.toThrow('Invalid task startDate format.');
      await expect(createTaskLogicActual(projectId, { ...basicTaskData, endDate: 'invalid' }, testUserId))
        .rejects.toThrow('Invalid task endDate format.');
    });

    it('should throw HttpsError if startDate is after endDate', async () => {
      await expect(createTaskLogicActual(projectId, { ...basicTaskData, startDate: '2024-03-01', endDate: '2024-02-01' }, testUserId))
        .rejects.toThrow('Task startDate cannot be after endDate.');
    });

    it('should throw HttpsError for invalid estimatedHours (negative)', async () => {
      await expect(createTaskLogicActual(projectId, { ...basicTaskData, estimatedHours: -5 }, testUserId))
        .rejects.toThrow('Task estimatedHours must be a non-negative number if provided.');
    });

    it('should throw HttpsError for invalid actualHours (negative)', async () => {
      await expect(createTaskLogicActual(projectId, { ...basicTaskData, actualHours: -2 }, testUserId))
        .rejects.toThrow('Task actualHours must be a non-negative number if provided.');
    });

    it('should allow null or undefined for optional fields like description, dates, hours', async () => {
      const minimalTaskData: Omit<Task, 'id' | 'projectId' | 'createdAt' | 'updatedAt' | 'auditLog'> = {
        name: 'Minimal Task',
        status: 'To Do',
        // description, startDate, endDate, estimatedHours, actualHours, assignedResourceId are optional
      };
      const result = await createTaskLogicActual(projectId, minimalTaskData, testUserId);
      expect(result).toBeDefined();
      expect(result.name).toBe('Minimal Task');
      expect(result.status).toBe('To Do');
      expect(result.description).toBeUndefined();
      expect(result.startDate).toBeUndefined();
      expect(result.endDate).toBeUndefined();
    });
  });

  describe('listTasksLogic', () => {
    const projectId = 'project-with-tasks-id';

    beforeEach(() => {
      // Default: Project exists
      mockFirestoreGet.mockResolvedValueOnce({ // For the project doc itself
        exists: true, 
        id: projectId, 
        data: () => ({ name: 'Parent Project' })
      });
    });

    it('should return an empty array if no tasks exist for the project', async () => {
      // Arrange
      // After project check, the tasks subcollection get() is called
      mockFirestoreGet.mockResolvedValueOnce({ // For the tasks collection get()
        empty: true,
        docs: [],
      });

      // Act
      const result = await listTasksLogicActual(projectId);

      // Assert
      expect(mockFirestoreDoc).toHaveBeenCalledWith(projectId); // Project existence check
      expect(mockFirestoreCollection).toHaveBeenCalledWith('tasks'); // Tasks subcollection
      expect(mockFirestoreOrderBy).toHaveBeenCalledWith('name', 'asc');
      expect(mockFirestoreGet).toHaveBeenCalledTimes(2); // Once for project, once for tasks collection
      expect(result).toEqual([]);
    });

    it('should return a list of tasks for the project ordered by name', async () => {
      // Arrange
      const task1 = { id: 'task-a', name: 'Alpha Task', status: 'To Do' as TaskStatus, projectId };
      const task2 = { id: 'task-b', name: 'Beta Task', status: 'In Progress' as TaskStatus, projectId };
      const mockTaskDocs = [
        { id: task1.id, data: () => task1 },
        { id: task2.id, data: () => task2 },
      ];
      mockFirestoreGet.mockResolvedValueOnce({ // For the tasks collection get()
        empty: false,
        docs: mockTaskDocs,
        forEach: (callback: (doc: any) => void) => mockTaskDocs.forEach(callback),
      });

      // Act
      const result = await listTasksLogicActual(projectId);

      // Assert
      expect(mockFirestoreDoc).toHaveBeenCalledWith(projectId);
      expect(mockFirestoreCollection).toHaveBeenCalledWith('tasks');
      expect(mockFirestoreOrderBy).toHaveBeenCalledWith('name', 'asc');
      expect(mockFirestoreGet).toHaveBeenCalledTimes(2);
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual(expect.objectContaining(task1));
      expect(result[1]).toEqual(expect.objectContaining(task2));
    });

    it('should throw HttpsError if project ID is not provided', async () => {
      // Reset the project existence mock as it won't be called if projectId is undefined early
      mockFirestoreGet.mockReset(); 
      await expect(listTasksLogicActual(undefined as any))
        .rejects
        .toThrow(new functions.https.HttpsError('invalid-argument', 'Project ID is required to list tasks.'));
      expect(mockFirestoreGet).not.toHaveBeenCalled(); // Ensure it didn't try to fetch project/tasks
    });

    it('should throw HttpsError with code "not-found" if project does not exist', async () => {
      // Override the default project existence for this test
      mockFirestoreGet.mockReset(); // Clear previous beforeEach mock
      mockFirestoreGet.mockResolvedValueOnce({ exists: false, id: projectId, data: () => undefined }); // Project not found

      await expect(listTasksLogicActual(projectId))
        .rejects
        .toThrow(new functions.https.HttpsError('not-found', `Project with ID "${projectId}" not found.`));
      expect(mockFirestoreDoc).toHaveBeenCalledWith(projectId);
      expect(mockFirestoreGet).toHaveBeenCalledTimes(1); // Only project check should happen
      expect(mockFirestoreCollection).not.toHaveBeenCalledWith('tasks'); // Should not try to get tasks
    });
  });

  describe('updateTaskLogic', () => {
    const projectId = 'project-for-task-update';
    const taskId = 'task-to-update';
    const testUserId = 'task-updater-uid';
    const existingTaskData: Task = {
      id: taskId,
      projectId: projectId,
      name: 'Original Task Name',
      description: 'Original task description',
      status: 'To Do',
      startDate: '2024-03-01',
      endDate: '2024-03-15',
      estimatedHours: 8,
      createdAt: new Date('2024-03-01T09:00:00Z').toISOString(),
      updatedAt: new Date('2024-03-01T09:00:00Z').toISOString(),
      auditLog: [{ timestamp: 'time', userId: 'creator', fieldName:'N/A', oldValue:'N/A', newValue:'N/A', description: 'Task created'}],
    };

    beforeEach(() => {
      // Default: Project exists
      mockFirestoreGet.mockResolvedValueOnce({ 
        exists: true, 
        id: projectId, 
        data: () => ({ name: 'Parent Project' })
      });
      // Default: Task exists
      mockFirestoreGet.mockResolvedValueOnce({ 
        exists: true, 
        id: taskId, 
        data: () => ({ ...existingTaskData }) // Return a copy
      });
      mockArrayUnion.mockImplementation((...args) => args);
    });

    it('should update a task and add an audit log entry for changed fields', async () => {
      const updateData: Partial<Omit<Task, 'id' | 'projectId' | 'createdAt' | 'updatedAt' | 'auditLog'> > = {
        name: 'Updated Task Name',
        status: 'In Progress',
        actualHours: 4,
      };

      await updateTaskLogicActual(projectId, taskId, updateData, testUserId);

      // Project existence check, then task existence check
      expect(mockFirestoreDoc).toHaveBeenNthCalledWith(1, projectId);
      expect(mockFirestoreDoc).toHaveBeenNthCalledWith(2, taskId); // Path to task: projects/{pid}/tasks/{tid}
      expect(mockFirestoreGet).toHaveBeenCalledTimes(2); // Once for project, once for task
      expect(mockFirestoreUpdate).toHaveBeenCalledTimes(1);

      const updateCallData = mockFirestoreUpdate.mock.calls[0][0];
      expect(updateCallData.name).toBe(updateData.name);
      expect(updateCallData.status).toBe(updateData.status);
      expect(updateCallData.actualHours).toBe(updateData.actualHours);
      expect(updateCallData.updatedAt).toEqual(expect.any(String));
      expect(updateCallData.updatedAt).not.toBe(existingTaskData.updatedAt);
      
      expect(mockArrayUnion).toHaveBeenCalledTimes(1);
      const auditEntries = mockArrayUnion.mock.calls[0];
      expect(auditEntries).toHaveLength(3); // name, status, actualHours

      const nameAudit = auditEntries.find((e: AuditLogEntry) => e.fieldName === 'name');
      expect(nameAudit.oldValue).toBe(existingTaskData.name);
      expect(nameAudit.newValue).toBe(updateData.name);
      expect(nameAudit.userId).toBe(testUserId);
    });

    it('should throw HttpsError if project ID or task ID is not provided', async () => {
      mockFirestoreGet.mockReset(); // No DB calls if IDs are missing early
      await expect(updateTaskLogicActual(undefined as any, taskId, {}, testUserId))
        .rejects.toThrow('Project ID and Task ID are required.');
      await expect(updateTaskLogicActual(projectId, undefined as any, {}, testUserId))
        .rejects.toThrow('Project ID and Task ID are required.');
    });

    it('should throw HttpsError if updateData is empty', async () => {
      mockFirestoreGet.mockReset(); // No DB calls if data is empty early
      await expect(updateTaskLogicActual(projectId, taskId, {}, testUserId))
        .rejects.toThrow('No update data provided.');
    });

    it('should throw HttpsError with code "not-found" if project does not exist', async () => {
      mockFirestoreGet.mockReset(); // Clear beforeEach mocks
      mockFirestoreGet.mockResolvedValueOnce({ exists: false, id: projectId, data: () => undefined }); // Project not found
      // No need to mock task get, as it won't be reached

      await expect(updateTaskLogicActual(projectId, taskId, { name: 'New Name' }, testUserId))
        .rejects
        .toThrow(new functions.https.HttpsError('not-found', `Project with ID "${projectId}" not found.`));
      expect(mockFirestoreDoc).toHaveBeenCalledWith(projectId);
      expect(mockFirestoreGet).toHaveBeenCalledTimes(1); // Only project check
    });

    it('should throw HttpsError with code "not-found" if task does not exist', async () => {
      mockFirestoreGet.mockReset(); // Clear beforeEach mocks
      mockFirestoreGet.mockResolvedValueOnce({ exists: true, id: projectId, data: () => ({}) }); // Project exists
      mockFirestoreGet.mockResolvedValueOnce({ exists: false, id: taskId, data: () => undefined }); // Task not found

      await expect(updateTaskLogicActual(projectId, taskId, { name: 'New Name' }, testUserId))
        .rejects
        .toThrow(new functions.https.HttpsError('not-found', `Task with ID "${taskId}" not found in project "${projectId}".`));
      expect(mockFirestoreDoc).toHaveBeenNthCalledWith(1, projectId);
      expect(mockFirestoreDoc).toHaveBeenNthCalledWith(2, taskId);
      expect(mockFirestoreGet).toHaveBeenCalledTimes(2); // Project and Task checks
    });

    // Add other validation tests similar to createTaskLogic (name, status, dates, hours)
    it('should throw HttpsError for invalid task name (empty string)', async () => {
      await expect(updateTaskLogicActual(projectId, taskId, { name: ' ' }, testUserId))
        .rejects
        .toThrow('Task name must be a non-empty string if provided.');
    });

    it('should throw HttpsError for invalid status value', async () => {
      const allowedStatuses: TaskStatus[] = ['To Do', 'In Progress', 'Done', 'Blocked'];
      await expect(updateTaskLogicActual(projectId, taskId, { status: 'FakeStatus' as TaskStatus }, testUserId))
        .rejects
        .toThrow(`Invalid task status. Must be one of: ${allowedStatuses.join(', ')}`);
    });

    it('should throw HttpsError if new startDate is after existing endDate (when only startDate changes)', async () => {
      await expect(updateTaskLogicActual(projectId, taskId, { startDate: '2024-03-20' }, testUserId)) // existing endDate is 2024-03-15
        .rejects
        .toThrow('Task startDate cannot be after endDate.');
    });
  });

});
