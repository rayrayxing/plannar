// Define mocks that are used by jest.doMock or jest.mock
export const mockInitializeApp = jest.fn();
export const mockFirestore = jest.fn();
export const mockFirestoreCollection = jest.fn();
export const mockFirestoreDoc = jest.fn();
export const mockFirestoreSet = jest.fn();
export const mockFirestoreGet = jest.fn();
export const mockFirestoreAdd = jest.fn();
export const mockFirestoreUpdate = jest.fn();
export const mockFirestoreWhere = jest.fn();
export const mockFirestoreOrderBy = jest.fn();
export const mockFirestoreLimit = jest.fn();
export const mockFirestoreStartAfter = jest.fn();

// Import functions and types needed for test setup, but NOT the SUT yet.
import * as functions from 'firebase-functions';
import { Resource } from './types/resource.types';

// Logger mocks can be spied here as functions is imported.
jest.spyOn(functions.logger, 'info').mockImplementation(console.log);
jest.spyOn(functions.logger, 'error').mockImplementation(console.error);

describe('Resource Management Cloud Functions - Logic', () => {
  // Declare a variable to hold the dynamically imported SUT function.
  let createResourceLogicActual: typeof import('./resources').createResourceLogic;

  beforeEach(async () => {
    // 1. Clear all previously defined mock functions to ensure test isolation.
    mockInitializeApp.mockClear();
    mockFirestore.mockClear();
    mockFirestoreCollection.mockClear();
    mockFirestoreDoc.mockClear();
    mockFirestoreSet.mockClear();
    mockFirestoreGet.mockClear();
    mockFirestoreAdd.mockClear();
    mockFirestoreUpdate.mockClear();
    mockFirestoreWhere.mockClear();
    mockFirestoreOrderBy.mockClear();
    mockFirestoreLimit.mockClear();
    mockFirestoreStartAfter.mockClear();

    // 2. Re-define default behaviors for mocks that return promises or complex objects.
    mockFirestore.mockImplementation(() => ({ 
      collection: mockFirestoreCollection.mockImplementation(() => ({ 
        doc: mockFirestoreDoc.mockImplementation((docId?: string) => ({
          id: docId || 'auto-generated-id-mock',
          get: mockFirestoreGet,
          set: mockFirestoreSet,
          update: mockFirestoreUpdate,
          collection: mockFirestoreCollection, 
        })),
        add: mockFirestoreAdd,
        where: mockFirestoreWhere.mockReturnThis(),
        orderBy: mockFirestoreOrderBy.mockReturnThis(),
        limit: mockFirestoreLimit.mockReturnThis(),
        startAfter: mockFirestoreStartAfter.mockReturnThis(),
        get: mockFirestoreGet, 
      })),
    }));
    mockFirestoreSet.mockResolvedValue(undefined);
    mockFirestoreUpdate.mockResolvedValue(undefined);
    mockFirestoreGet.mockResolvedValue({ exists: false, data: () => undefined, id: 'mock-get-id' });
    mockFirestoreAdd.mockResolvedValue({ id: 'new-mock-added-id' });

    // 3. Use jest.doMock to set up the firebase-admin mock *before* importing the SUT.
    jest.doMock('firebase-admin', () => ({
      initializeApp: mockInitializeApp,
      firestore: mockFirestore,
      apps: [], // CRITICAL: Ensures admin.apps.length === 0 for the SUT.
      credential: { applicationDefault: jest.fn() },
      storage: jest.fn(() => ({ bucket: jest.fn(() => ({})) })),
    }));

    // 4. Dynamically import the SUT (./resources) AFTER mocks are in place.
    const resourcesModule = await import('./resources');
    createResourceLogicActual = resourcesModule.createResourceLogic;
  });

  afterEach(() => {
    // Reset modules after each test to ensure a clean slate for the next jest.doMock.
    jest.resetModules();
  });

  describe('createResourceLogic', () => {
    it('should create a new resource and return it with an ID and audit log', async () => {
      const resourceData: Omit<Resource, 'id' | 'createdAt' | 'updatedAt' | 'auditLog'> = {
        personalInfo: { name: 'Test User', email: 'test@example.com', employeeId: 'T001' }, // Corrected
        skills: [],
        availability: { workArrangement: { type: 'full-time' }, timeOff: [] },
        rates: { standard: 50 },
        status: 'active',
        maxAssignments: 1,
        maxHoursPerDay: 8,
      };
      const testUserId = 'test-user-uid';

      const result = await createResourceLogicActual(resourceData, testUserId);

      expect(mockInitializeApp).toHaveBeenCalledTimes(1);
      expect(mockFirestore).toHaveBeenCalledTimes(1);
      expect(mockFirestoreCollection).toHaveBeenCalledWith('resources');
      expect(mockFirestoreDoc).toHaveBeenCalledTimes(2);
      expect(mockFirestoreDoc).toHaveBeenNthCalledWith(1);
      expect(mockFirestoreDoc).toHaveBeenNthCalledWith(2, 'auto-generated-id-mock');
      expect(mockFirestoreSet).toHaveBeenCalledTimes(1);
      const setData = mockFirestoreSet.mock.calls[0][0];
      expect(setData.id).toBe('auto-generated-id-mock');
      expect(setData.personalInfo.name).toBe('Test User');
      expect(setData.status).toBe('active');
      expect(setData.createdAt).toBeInstanceOf(String);
      expect(setData.updatedAt).toBeInstanceOf(String);
      expect(setData.auditLog).toHaveLength(1);
      expect(setData.auditLog[0].description).toBe('Resource profile created.');
      expect(setData.auditLog[0].userId).toBe(testUserId);
      expect(result).toBeDefined();
      expect(result.id).toBe(setData.id);
      expect(result.personalInfo.name).toBe('Test User');
      expect(result.auditLog!).toHaveLength(1);
      expect(result.auditLog![0].userId).toBe(testUserId);
    });

    it('should throw an HttpsError if required personalInfo fields are missing', async () => {
      const incompleteData: Partial<Resource> = {
        skills: [],
        availability: { workArrangement: { type: 'full-time' }, timeOff: [] },
        rates: { standard: 50 },
        status: 'active',
      };
      const testUserId = 'test-user-uid';
      await expect(createResourceLogicActual(incompleteData as any, testUserId))
        .rejects
        .toThrow(new functions.https.HttpsError('invalid-argument', 'Missing required personal information: name, email, employeeId.'));
    });

    it('should throw an HttpsError if status is missing', async () => {
      const incompleteData: Partial<Resource> = {
        personalInfo: { name: 'Test User', email: 'test@example.com', employeeId: 'T001' }, // Corrected
        rates: { standard: 50 },
      };
      const testUserId = 'test-user-uid';
      await expect(createResourceLogicActual(incompleteData as any, testUserId))
        .rejects
        .toThrow(new functions.https.HttpsError('invalid-argument', 'Missing required field: status.'));
    });

    it('should throw an HttpsError if rates.standard is missing', async () => {
      const incompleteData: Partial<Resource> = {
        personalInfo: { name: 'Test User', email: 'test@example.com', employeeId: 'T001' }, // Corrected
        status: 'active',
      };
      const testUserId = 'test-user-uid';
      await expect(createResourceLogicActual(incompleteData as any, testUserId))
        .rejects
        .toThrow(new functions.https.HttpsError('invalid-argument', 'Missing required field: rates.standard.'));
    });
  });
});
