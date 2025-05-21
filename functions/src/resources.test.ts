import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import fft from 'firebase-functions-test';

// Initialize firebase-functions-test. Requires a service account key and project ID.
// Since we don't have a real project, we can use offline mode.
const testEnv = fft(); // Offline mode by default, no need for config

// Import the functions to be tested
import { createResource, listResources, getResourceById, updateResource, getResourceSkills } from './resources';
import { Resource, PersonalInfo, Skill, Availability, Rates, ResourceStatus, AuditLogEntry } from './types/resource.types';

// Mock Firebase Admin SDK
// We need to mock the parts of Firestore that our functions use.
const mockCollection = jest.fn().mockReturnThis();
const mockDoc = jest.fn().mockReturnThis();
const mockAdd = jest.fn();
const mockSet = jest.fn();
const mockGet = jest.fn();
const mockUpdate = jest.fn();
const mockWhere = jest.fn().mockReturnThis();
const mockOrderBy = jest.fn().mockReturnThis();
const mockLimit = jest.fn().mockReturnThis();
const mockStartAfter = jest.fn().mockReturnThis();

jest.mock('firebase-admin', () => ({
  initializeApp: jest.fn(),
  firestore: jest.fn(() => ({
    collection: mockCollection,
    // doc: mockDoc, // We'll define this more granularly if needed or let collection().doc() work
  })),
  credential: {
    applicationDefault: jest.fn(), // if you use this in your functions
  },
  storage: jest.fn(() => ({
    bucket: jest.fn(() => ({ // Mock the default bucket
      // Mock file operations if your functions use Storage
    })),
  })),
}));

// Mock functions.logger
jest.spyOn(functions.logger, 'info').mockImplementation(console.log);
jest.spyOn(functions.logger, 'error').mockImplementation(console.error);

describe('Resource Management Cloud Functions', () => {
  beforeEach(() => {
    // Reset mocks before each test
    mockCollection.mockClear();
    mockDoc.mockClear();
    mockAdd.mockClear();
    mockSet.mockClear();
    mockGet.mockClear();
    mockUpdate.mockClear();
    mockWhere.mockClear();
    mockOrderBy.mockClear();
    mockLimit.mockClear();
    mockStartAfter.mockClear();

    // Default behavior for collection().doc()
    mockCollection.mockImplementation((collectionPath: string) => {
        // console.log(`Mocking collection: ${collectionPath}`);
        return {
            doc: mockDoc.mockImplementation((docId?: string) => {
                // console.log(`Mocking doc: ${docId} in ${collectionPath}`);
                const resolvedDocId = docId || 'generated-id'; // Simulate auto-ID generation
                return {
                    id: resolvedDocId,
                    get: mockGet,
                    set: mockSet,
                    update: mockUpdate,
                    collection: mockCollection, // For subcollections if any
                };
            }),
            add: mockAdd,
            where: mockWhere,
            orderBy: mockOrderBy,
            limit: mockLimit,
            startAfter: mockStartAfter,
            get: mockGet, // For collection queries
        };
    });
  });

  afterAll(() => {
    // Clean up firebase-functions-test
    testEnv.cleanup();
  });

  describe('createResource', () => {
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

      const mockResourceId = 'mockResourceId';
      mockAdd.mockResolvedValueOnce({ id: mockResourceId }); // Simulate Firestore's add() returning a DocumentReference

      // Wrap the Cloud Function
      const wrapped = testEnv.wrap(createResource);
      
      // Call the function with mock data
      // For callable functions, data is the first arg, context is the second.
      const result = await wrapped(resourceData, { auth: { uid: 'test-user-uid' } });

      expect(mockCollection).toHaveBeenCalledWith('resources');
      expect(mockAdd).toHaveBeenCalledTimes(1);
      const addedData = mockAdd.mock.calls[0][0];
      expect(addedData.personalInfo.name).toBe('Test User');
      expect(addedData.status).toBe('active');
      expect(addedData.createdAt).toBeInstanceOf(Date);
      expect(addedData.updatedAt).toBeInstanceOf(Date);
      expect(addedData.auditLog).toHaveLength(1);
      expect(addedData.auditLog[0].description).toBe('Resource created');
      expect(addedData.auditLog[0].userId).toBe('test-user-uid');

      expect(result).toBeDefined();
      expect(result.id).toBe(mockResourceId);
      expect(result.personalInfo.name).toBe('Test User');
      expect(result.auditLog).toHaveLength(1);
    });

    it('should throw an error if required fields are missing', async () => {
        const incompleteData = {
            // personalInfo is missing
            skills: [],
            availability: { workArrangement: { type: 'full-time' }, timeOff: [] },
            rates: { standard: 50 },
            status: 'active',
        } as any; // Cast to any to bypass type checking for test
  
        const wrapped = testEnv.wrap(createResource);
        
        await expect(wrapped(incompleteData, { auth: { uid: 'test-user-uid' } }))
          .rejects
          .toThrow('Missing required fields in resource data.'); // Or whatever error your validation throws
    });

    // TODO: Add more tests for createResource (e.g., specific field validations, uniqueness checks if implemented)
  });

  // TODO: Add describe blocks for listResources, getResourceById, updateResource, getResourceSkills

});
