// IMPORTANT: jest.mock must be at the top, before any imports that might use firebase-admin.

// --- Define mocks that will be initialized by the factory --- 
// These are exported ONLY for the test file to be able to clear them or check calls.
export const mockFirestore = jest.fn(); // To check if admin.firestore() was called
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
export const mockInitializeApp = jest.fn(); // To check if admin.initializeApp() was called

jest.mock('firebase-admin', () => {
  mockFirestore.mockImplementation(() => ({ 
    collection: mockFirestoreCollection.mockImplementation(() => { 
      return {
        doc: mockFirestoreDoc.mockImplementation((docId?: string) => {
          return {
            id: docId || 'auto-generated-id-mock',
            get: mockFirestoreGet,
            set: mockFirestoreSet,
            update: mockFirestoreUpdate,
            collection: mockFirestoreCollection, 
          };
        }),
        add: mockFirestoreAdd,
        where: mockFirestoreWhere.mockReturnThis(),
        orderBy: mockFirestoreOrderBy.mockReturnThis(),
        limit: mockFirestoreLimit.mockReturnThis(),
        startAfter: mockFirestoreStartAfter.mockReturnThis(),
        get: mockFirestoreGet, 
      };
    }),
  }));

  return {
    initializeApp: mockInitializeApp, 
    firestore: mockFirestore, 
    // Use a getter for apps to ensure it's freshly evaluated as empty by the SUT
    get apps() { return []; }, 
    credential: { applicationDefault: jest.fn() },
    storage: () => ({ bucket: () => ({}) }),
  };
});

// --- Now import everything else ---
import * as functions from 'firebase-functions';
import fft from 'firebase-functions-test';
import { createResourceLogic } from './resources';
import { Resource } from './types/resource.types';

const testEnv = fft(); // Offline mode

jest.spyOn(functions.logger, 'info').mockImplementation(console.log);
jest.spyOn(functions.logger, 'error').mockImplementation(console.error);

describe('Resource Management Cloud Functions - Logic', () => {
  beforeEach(() => {
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

    mockFirestoreSet.mockResolvedValue(undefined);
    mockFirestoreUpdate.mockResolvedValue(undefined);
    mockFirestoreGet.mockResolvedValue({ exists: false, data: () => undefined, id: 'mock-get-id' });
    mockFirestoreAdd.mockResolvedValue({ id: 'new-mock-added-id' });
  });

  afterAll(() => {
    testEnv.cleanup();
  });

  describe('createResourceLogic', () => {
    it('should create a new resource and return it with an ID and audit log', async () => {
      const resourceData: Omit<Resource, 'id' | 'createdAt' | 'updatedAt' | 'auditLog'> = {
        personalInfo: { name: 'Test User', email: 'test@example.com', employeeId: 'T001' },
        skills: [],
        availability: { workArrangement: { type: 'full-time' }, timeOff: [] },
        rates: { standard: 50 },
        status: 'active',
        maxAssignments: 1,
        maxHoursPerDay: 8,
      };
      const testUserId = 'test-user-uid';

      const result = await createResourceLogic(resourceData, testUserId);

      expect(mockInitializeApp).toHaveBeenCalledTimes(2); // Once by fft, once by resources.ts 
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
        
        await expect(createResourceLogic(incompleteData as any, testUserId))
          .rejects
          .toThrow(new functions.https.HttpsError('invalid-argument', 'Missing required personal information: name, email, employeeId.'));
    });

    it('should throw an HttpsError if status is missing', async () => {
      const incompleteData: Partial<Resource> = {
          personalInfo: { name: 'Test User', email: 'test@example.com', employeeId: 'T001' },
          rates: { standard: 50 },
      };
      const testUserId = 'test-user-uid';
      await expect(createResourceLogic(incompleteData as any, testUserId))
        .rejects
        .toThrow(new functions.https.HttpsError('invalid-argument', 'Missing required field: status.'));
    });

    it('should throw an HttpsError if rates.standard is missing', async () => {
      const incompleteData: Partial<Resource> = {
          personalInfo: { name: 'Test User', email: 'test@example.com', employeeId: 'T001' },
          status: 'active',
      };
      const testUserId = 'test-user-uid';
      await expect(createResourceLogic(incompleteData as any, testUserId))
        .rejects
        .toThrow(new functions.https.HttpsError('invalid-argument', 'Missing required field: rates.standard.'));
    });

  });

});
