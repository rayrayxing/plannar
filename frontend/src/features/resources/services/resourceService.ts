import { Resource } from '../../../types/resource.types';

const API_BASE_URL = '/api'; // Adjust if your API is hosted elsewhere

export const resourceService = {
  getResourceById: async (id: string): Promise<Resource> => {
    const response = await fetch(`${API_BASE_URL}/resources/${id}`);
    if (!response.ok) {
      // Consider more specific error handling based on status codes
      const errorData = await response.json().catch(() => ({ message: 'Failed to fetch resource and parse error' }));
      throw new Error(errorData.message || `Failed to fetch resource. Status: ${response.status}`);
    }
    return response.json() as Promise<Resource>;
  },

  // Placeholder for other resource-related API calls
  // listResources: async (): Promise<Resource[]> => { ... },
  // createResource: async (resourceData: Partial<Resource>): Promise<Resource> => { ... },
  // updateResource: async (id: string, resourceData: Partial<Resource>): Promise<Resource> => { ... },
};
