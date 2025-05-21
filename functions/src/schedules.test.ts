import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { 
    assignResourceToTaskLogic,
    getResourceScheduleLogic,
    getCalendarViewLogic,
} from './schedules'; // Adjust path as necessary
import { AssignResourcePayload } from './types/schedule.types'; // Assuming this type exists for the payload
import { Project } from './types/project.types';
import { Resource } from './types/resource.types';
import { ScheduleEntry, TimeBlock } from './types/schedule.types';

// Mock Firebase Admin SDK
const mockFirestore = {
  collection: jest.fn().mockReturnThis(),
  doc: jest.fn().mockReturnThis(),
  get: jest.fn(),
  set: jest.fn(),
  update: jest.fn(),
  arrayUnion: jest.fn(),
  arrayRemove: jest.fn(),
  increment: jest.fn(),
  batch: jest.fn().mockReturnThis(), // Mock batch() itself
  commit: jest.fn(), // Mock commit() on the batch object
  where: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
};

// Further refine batch mock if needed: batch().update(), batch().set(), etc.
// For now, the top-level batch().commit() is mocked.

// Mock db.collection('-').doc().id for generating unique IDs
const mockGeneratedId = 'mockGeneratedId123';
const mockDbIdGenerator = {
    collection: jest.fn().mockReturnThis(),
    doc: jest.fn(() => ({ id: mockGeneratedId })),
};

jest.mock('firebase-admin', () => ({
  initializeApp: jest.fn(),
  firestore: () => ({
    ...mockFirestore,
    // Specific override for ID generation if needed, otherwise rely on collection/doc mocks
    // For db.collection('-').doc().id, we need to mock collection('-').doc().id
    // This is a bit tricky as firestore() returns the whole db instance.
    // Let's assume db.collection('-').doc().id is called on the main db object.
    // So, when firestore() is called, the returned object should have a collection method
    // that, if called with '-', returns our ID generator mock.
    collection: (path: string) => {
        if (path === '-') {
            return mockDbIdGenerator.collection(); // which then allows .doc().id
        }
        return mockFirestore.collection(path); // Default behavior
    },
    FieldValue: {
        arrayUnion: jest.fn((...args) => `arrayUnion(${args.join(',')})`), // Mock implementation
        arrayRemove: jest.fn((...args) => `arrayRemove(${args.join(',')})`),
        increment: jest.fn((val) => `increment(${val})`),
        serverTimestamp: jest.fn(() => 'mockServerTimestamp'),
    },
  }),
}));

jest.mock('firebase-functions', () => ({
  https: {
    HttpsError: jest.fn((code, message) => new Error(`${code}: ${message}`)), // Simplified mock
  },
  logger: {
    error: jest.fn(console.error),
    warn: jest.fn(console.warn),
    info: jest.fn(console.info),
    debug: jest.fn(console.debug),
  },
}));

// Helper to reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
  // Reset specific mock implementations if they were changed in a test
  mockFirestore.get.mockReset();
  mockFirestore.set.mockReset();
  mockFirestore.update.mockReset();
  mockFirestore.commit.mockReset();
  mockFirestore.collection.mockClear(); // Clear calls for collection itself
  mockFirestore.doc.mockClear(); // Clear calls for doc itself

  // Ensure batch() returns an object that has commit, set, update methods
  const batchMock = {
    set: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    commit: jest.fn().mockResolvedValue(undefined), // Default successful commit
  };
  (admin.firestore().batch as jest.Mock).mockReturnValue(batchMock);
  (admin.firestore().collection('-').doc().id as unknown as jest.Mock).mockReturnValue(mockGeneratedId);

});


describe('assignResourceToTaskLogic', () => {
  // TODO: Write tests for assignResourceToTaskLogic
  it('should successfully assign a resource and create schedule entries', async () => {
    // Mock successful document reads
    mockFirestore.get
      .mockResolvedValueOnce({ exists: true, data: () => ({ name: 'Project X' } as Project) }) // Project
      .mockResolvedValueOnce({ exists: true, data: () => ({ name: 'Task Y', assignedResourceId: null } as any) }) // Task (cast to any for test simplicity)
      .mockResolvedValueOnce({ exists: true, data: () => ({ name: 'Resource Z' } as Resource) }); // Resource
    
    // Mock successful schedule query (no existing schedules for conflict check)
    mockFirestore.get.mockResolvedValueOnce({ empty: true, docs: [] }); // For existingSchedulesQuery.get()

    const payload: AssignResourcePayload = {
      projectId: 'proj1',
      taskId: 'task1',
      resourceId: 'res1',
      startDate: '2024-01-01T00:00:00.000Z',
      endDate: '2024-01-02T23:59:59.999Z',
      allocatedHours: 10,
    };

    const result = await assignResourceToTaskLogic(payload, 'testUser');

    expect(result).toBeDefined();
    expect(result.assignmentId).toEqual(mockGeneratedId);
    expect(result.status).toEqual('active');
    expect(result.allocatedHours).toEqual(10);

    const batchInstance = admin.firestore().batch();
    expect(batchInstance.update).toHaveBeenCalledTimes(2); // Project and Task
    expect(batchInstance.set).toHaveBeenCalledTimes(2); // Two schedule entries for 2 days
    expect(batchInstance.commit).toHaveBeenCalledTimes(1);

    // Further assertions on what was written can be added here
    // e.g., checking arguments of batchInstance.set for schedule entries
  });

  it('should throw error if resource is already scheduled (conflict)', async () => {
    mockFirestore.get
      .mockResolvedValueOnce({ exists: true, data: () => ({ name: 'Project X' }) })
      .mockResolvedValueOnce({ exists: true, data: () => ({ name: 'Task Y' }) })
      .mockResolvedValueOnce({ exists: true, data: () => ({ name: 'Resource Z' }) });
    
    // Mock schedule query finding an existing schedule
    mockFirestore.get.mockResolvedValueOnce({ 
        empty: false, 
        docs: [{ data: () => ({ date: '2024-01-01' }) }] 
    });

    const payload: AssignResourcePayload = {
      projectId: 'proj1',
      taskId: 'task1',
      resourceId: 'res1',
      startDate: '2024-01-01T00:00:00.000Z',
      endDate: '2024-01-01T23:59:59.999Z',
      allocatedHours: 8,
    };

    await expect(assignResourceToTaskLogic(payload, 'testUser')).rejects.toThrow(
      'failed-precondition: Resource res1 is already scheduled on the following date(s) within the requested period: 2024-01-01. Assignment conflicts with existing schedule.'
    );
  });

  it('should throw error if startDate is after endDate', async () => {
    const payload: AssignResourcePayload = {
      projectId: 'proj1',
      taskId: 'task1',
      resourceId: 'res1',
      startDate: '2024-01-02T00:00:00.000Z',
      endDate: '2024-01-01T23:59:59.999Z',
      allocatedHours: 8,
    };

    await expect(assignResourceToTaskLogic(payload, 'testUser')).rejects.toThrow(
      'invalid-argument: startDate must be before endDate.'
    );
  });

  describe('Hour Distribution', () => {
    const basePayload: AssignResourcePayload = {
      projectId: 'projDist',
      taskId: 'taskDist',
      resourceId: 'resDist',
      startDate: '2024-02-01T00:00:00.000Z', // Thursday
      endDate: '2024-02-02T23:59:59.999Z',   // Friday (2 days)
      allocatedHours: 0, // Will be set per test
    };
    const mockUserDetails = 'distUser';

    beforeEach(() => {
      // Common mocks for successful document reads for distribution tests
      mockFirestore.get
        .mockResolvedValueOnce({ exists: true, data: () => ({ name: 'Project Dist' }) }) // Project
        .mockResolvedValueOnce({ exists: true, data: () => ({ name: 'Task Dist', assignedResourceId: null }) }) // Task
        .mockResolvedValueOnce({ exists: true, data: () => ({ name: 'Resource Dist' }) }); // Resource
      // Mock no conflict
      mockFirestore.get.mockResolvedValueOnce({ empty: true, docs: [] });
    });

    it('should distribute 12 hours over 2 days (8h on day1, 4h on day2)', async () => {
      const payload = { ...basePayload, allocatedHours: 12 };
      await assignResourceToTaskLogic(payload, mockUserDetails);

      const batchInstance = admin.firestore().batch();
      expect(batchInstance.set).toHaveBeenCalledTimes(2);

      // Day 1: 2024-02-01, 8 hours
      const call1Args = (batchInstance.set as jest.Mock).mock.calls[0];
      expect(call1Args[0].id).toBe('resDist_2024-02-01'); // scheduleEntryRef
      expect(call1Args[1].date).toBe('2024-02-01');
      expect(call1Args[1].timeBlocks).toEqual(expect.any(String)); // arrayUnion mock
      expect(admin.firestore.FieldValue.arrayUnion).toHaveBeenCalledWith(expect.objectContaining({
        startTime: '2024-02-01T09:00:00.000Z',
        endTime: '2024-02-01T17:00:00.000Z', // 9 AM + 8 hours
        hours: 8,
        projectId: payload.projectId,
        taskId: payload.taskId,
      }));
      expect(call1Args[1].totalHours).toEqual('increment(8)'); // increment mock

      // Day 2: 2024-02-02, 4 hours
      const call2Args = (batchInstance.set as jest.Mock).mock.calls[1];
      expect(call2Args[0].id).toBe('resDist_2024-02-02');
      expect(call2Args[1].date).toBe('2024-02-02');
      expect(admin.firestore.FieldValue.arrayUnion).toHaveBeenCalledWith(expect.objectContaining({
        startTime: '2024-02-02T09:00:00.000Z',
        endTime: '2024-02-02T13:00:00.000Z', // 9 AM + 4 hours
        hours: 4,
      }));
      expect(call2Args[1].totalHours).toEqual('increment(4)');
      
      expect(functions.logger.warn).not.toHaveBeenCalled();
    });

    it('should distribute 5 hours over 2 days (5h on day1, 0h on day2)', async () => {
        const payload = { ...basePayload, allocatedHours: 5 };
        await assignResourceToTaskLogic(payload, mockUserDetails);
  
        const batchInstance = admin.firestore().batch();
        expect(batchInstance.set).toHaveBeenCalledTimes(1); // Only one day gets hours
  
        const callArgs = (batchInstance.set as jest.Mock).mock.calls[0];
        expect(callArgs[1].date).toBe('2024-02-01');
        expect(admin.firestore.FieldValue.arrayUnion).toHaveBeenCalledWith(expect.objectContaining({
          hours: 5,
          startTime: '2024-02-01T09:00:00.000Z',
          endTime: '2024-02-01T14:00:00.000Z', // 9 AM + 5 hours
        }));
        expect(callArgs[1].totalHours).toEqual('increment(5)');
        expect(functions.logger.warn).not.toHaveBeenCalled();
      });

    it('should log a warning if allocatedHours exceed capacity (e.g., 20h in 2 days)', async () => {
      const payload = { ...basePayload, allocatedHours: 20 }; // 2 days * 8h/day = 16h capacity
      await assignResourceToTaskLogic(payload, mockUserDetails);

      const batchInstance = admin.firestore().batch();
      expect(batchInstance.set).toHaveBeenCalledTimes(2); // Attempts to schedule for 2 days
      
      // Day 1 should get 8 hours
      const call1Args = (batchInstance.set as jest.Mock).mock.calls[0];
      expect(call1Args[1].date).toBe('2024-02-01');
      expect(admin.firestore.FieldValue.arrayUnion).toHaveBeenCalledWith(expect.objectContaining({ hours: 8 }));
      expect(call1Args[1].totalHours).toEqual('increment(8)');

      // Day 2 should get 8 hours
      const call2Args = (batchInstance.set as jest.Mock).mock.calls[1];
      expect(call2Args[1].date).toBe('2024-02-02');
      expect(admin.firestore.FieldValue.arrayUnion).toHaveBeenCalledWith(expect.objectContaining({ hours: 8 }));
      expect(call2Args[1].totalHours).toEqual('increment(8)');

      expect(functions.logger.warn).toHaveBeenCalledWith(
        expect.stringContaining('4 hours could not be allocated') // 20 requested - 16 scheduled = 4 remaining
      );
    });
  });

  // Add more tests for validation, hour distribution, etc.
});

describe('getResourceScheduleLogic', () => {
  it('should return schedule entries for a resource', async () => {
    const mockScheduleData: ScheduleEntry[] = [
      { resourceId: 'res1', date: '2024-03-01', totalHours: 8, timeBlocks: [], createdAt: 'ts', updatedAt: 'ts' },
      { resourceId: 'res1', date: '2024-03-02', totalHours: 6, timeBlocks: [], createdAt: 'ts', updatedAt: 'ts' },
    ];
    mockFirestore.get.mockResolvedValueOnce({ 
      empty: false, 
      docs: mockScheduleData.map(d => ({ id: `${d.resourceId}_${d.date}`, data: () => d })) 
    });

    const result = await getResourceScheduleLogic({ resourceId: 'res1' });

    expect(result.length).toBe(2);
    expect(result[0].date).toBe('2024-03-01');
    expect(mockFirestore.where).toHaveBeenCalledWith('resourceId', '==', 'res1');
    expect(mockFirestore.orderBy).toHaveBeenCalledWith('date', 'asc');
  });

  it('should filter schedule entries by startDate and endDate', async () => {
    mockFirestore.get.mockResolvedValueOnce({ empty: true, docs: [] }); // Assume no results for simplicity

    await getResourceScheduleLogic({
      resourceId: 'res1',
      startDate: '2024-03-01',
      endDate: '2024-03-05',
    });

    expect(mockFirestore.where).toHaveBeenCalledWith('resourceId', '==', 'res1');
    expect(mockFirestore.where).toHaveBeenCalledWith('date', '>=', '2024-03-01');
    expect(mockFirestore.where).toHaveBeenCalledWith('date', '<=', '2024-03-05');
  });

  it('should return empty array if no schedule entries found', async () => {
    mockFirestore.get.mockResolvedValueOnce({ empty: true, docs: [] });
    const result = await getResourceScheduleLogic({ resourceId: 'resNonExistent' });
    expect(result).toEqual([]);
  });

  it('should throw error for missing resourceId', async () => {
    // @ts-expect-error Testing invalid input
    await expect(getResourceScheduleLogic({ startDate: '2024-01-01' })).rejects.toThrow(
        'invalid-argument: Resource ID is required.'
    );
  });
});

describe('getCalendarViewLogic', () => {
  const basePayload = {
    resourceIds: ['res1', 'res2'],
    startDate: '2024-04-01',
    endDate: '2024-04-02',
  };

  it('should return schedule entries grouped by resourceId', async () => {
    const mockData: ScheduleEntry[] = [
      { resourceId: 'res1', date: '2024-04-01', totalHours: 8, timeBlocks: [], createdAt:'ts', updatedAt:'ts' },
      { resourceId: 'res2', date: '2024-04-01', totalHours: 7, timeBlocks: [], createdAt:'ts', updatedAt:'ts' },
      { resourceId: 'res1', date: '2024-04-02', totalHours: 4, timeBlocks: [], createdAt:'ts', updatedAt:'ts' },
    ];
    mockFirestore.get.mockResolvedValueOnce({ 
      empty: false, 
      docs: mockData.map(d => ({ id: `${d.resourceId}_${d.date}`, data: () => d })) 
    });

    const result = await getCalendarViewLogic(basePayload);

    expect(result['res1'].length).toBe(2);
    expect(result['res2'].length).toBe(1);
    expect(result['res1'][0].date).toBe('2024-04-01');
    expect(result['res2'][0].date).toBe('2024-04-01');

    expect(mockFirestore.where).toHaveBeenCalledWith('resourceId', 'in', basePayload.resourceIds);
    expect(mockFirestore.where).toHaveBeenCalledWith('date', '>=', basePayload.startDate);
    expect(mockFirestore.where).toHaveBeenCalledWith('date', '<=', basePayload.endDate);
    expect(mockFirestore.orderBy).toHaveBeenCalledWith('resourceId', 'asc');
    expect(mockFirestore.orderBy).toHaveBeenCalledWith('date', 'asc');
  });

  it('should return empty arrays for resources with no entries', async () => {
    mockFirestore.get.mockResolvedValueOnce({ empty: true, docs: [] });
    const result = await getCalendarViewLogic({ ...basePayload, resourceIds: ['resNoData'] });
    expect(result['resNoData']).toEqual([]);
  });

  it('should throw error if resourceIds array is empty', async () => {
    await expect(getCalendarViewLogic({ ...basePayload, resourceIds: [] })).rejects.toThrow(
      'invalid-argument: At least one Resource ID is required.'
    );
  });

  it('should throw error if resourceIds array exceeds 30 (current limit)', async () => {
    const tooManyResourceIds = Array.from({ length: 31 }, (_, i) => `res${i}`);
    await expect(getCalendarViewLogic({ ...basePayload, resourceIds: tooManyResourceIds })).rejects.toThrow(
      'invalid-argument: Too many resource IDs. Maximum 30 per query for calendar view in this version.'
    );
  });

  it('should throw error for invalid startDate or endDate', async () => {
    await expect(getCalendarViewLogic({ ...basePayload, startDate: 'invalid-date' })).rejects.toThrow(
      'invalid-argument: Valid startDate (YYYY-MM-DD) is required.'
    );
    await expect(getCalendarViewLogic({ ...basePayload, endDate: 'invalid-date' })).rejects.toThrow(
      'invalid-argument: Valid endDate (YYYY-MM-DD) is required.'
    );
  });
});
