import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import ResourceListPage from './ResourceListPage';
import { ModalProvider } from '../../../context/ModalContext'; // Adjust path as needed

// Mock react-router-dom's useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock API calls (e.g., axios)
jest.mock('../../../services/api', () => ({ // Adjust path as needed
  getResources: jest.fn(),
  deleteResource: jest.fn(),
}));

// Mock any components that are complex or not relevant to the current tests
// jest.mock('../components/ResourceCard', () => () => <div data-testid="mock-resource-card">Mock Resource Card</div>);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false, // Disable retries for tests
      staleTime: Infinity,
    },
  },
});

const theme = createTheme();

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <MemoryRouter>
          <ModalProvider>
            {ui}
          </ModalProvider>
        </MemoryRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

describe('ResourceListPage', () => {
  beforeEach(() => {
    // Clear mock call history before each test
    mockNavigate.mockClear();
    jest.clearAllMocks(); 
    queryClient.clear(); // Clear react-query cache
  });

  describe('Basic Rendering', () => {
    it('should display the page title "Resources"', () => {
      // Mock getResources to return an empty array to prevent errors during initial render
      (require('../../../services/api') as { getResources: jest.Mock }).getResources.mockResolvedValueOnce({ data: [], total: 0 });
      renderWithProviders(<ResourceListPage />);
      expect(screen.getByRole('heading', { name: /resources/i, level: 1 })).toBeInTheDocument();
    });

    it('should display the "Add Resource" button', () => {
      (require('../../../services/api') as { getResources: jest.Mock }).getResources.mockResolvedValueOnce({ data: [], total: 0 });
      renderWithProviders(<ResourceListPage />);
      expect(screen.getByRole('button', { name: /add resource/i })).toBeInTheDocument();
    });

    it('should display the correct table headers', () => {
      (require('../../../services/api') as { getResources: jest.Mock }).getResources.mockResolvedValueOnce({ data: [], total: 0 });
      renderWithProviders(<ResourceListPage />);
      
      const table = screen.getByRole('table'); 
      expect(table).toBeInTheDocument();

      const expectedHeaders = ['Name', 'Email', 'Status', 'Primary Role', 'Project Count', 'Actions'];
      expectedHeaders.forEach(headerText => {
        expect(within(table).getByRole('columnheader', { name: new RegExp(headerText, 'i') })).toBeInTheDocument();
      });
    });

    it('should display pagination controls when there are more items than page size', () => {
      // Assuming a page size of 10 for this test
      const mockResources = Array.from({ length: 15 }, (_, i) => ({ 
        id: `res-${i}`,
        info: { name: `Resource ${i}`, email: `res${i}@example.com`, primaryRole: 'Developer' }, 
        status: 'Available',
        projectCount: 0, // Simplified for this test
      }));
      (require('../../../services/api') as { getResources: jest.Mock }).getResources.mockResolvedValueOnce({ data: mockResources.slice(0, 10), total: 15 });
      
      renderWithProviders(<ResourceListPage />);
      
      expect(screen.getByLabelText(/rows per page/i)).toBeInTheDocument();
      expect(screen.getByText(/1–10 of 15/i)).toBeInTheDocument(); 
      expect(screen.getByRole('button', { name: /go to next page/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /go to previous page/i })).toBeDisabled(); 
    });

    it('should not display pagination controls when items are less than or equal to page size', () => {
        const mockResources = Array.from({ length: 5 }, (_, i) => ({ 
            id: `res-${i}`,
            info: { name: `Resource ${i}`, email: `res${i}@example.com`, primaryRole: 'Developer' }, 
            status: 'Available',
            projectCount: 0,
          }));
        (require('../../../services/api') as { getResources: jest.Mock }).getResources.mockResolvedValueOnce({ data: mockResources, total: 5 });
        
        renderWithProviders(<ResourceListPage />);
        
        expect(screen.queryByLabelText(/rows per page/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/1–5 of 5/i)).not.toBeInTheDocument(); 
      });

    it('should display a "No resources found" message when no resources are provided', () => {
      (require('../../../services/api') as { getResources: jest.Mock }).getResources.mockResolvedValueOnce({ data: [], total: 0 });
      renderWithProviders(<ResourceListPage />);
      
      expect(screen.getByText(/no resources found/i)).toBeInTheDocument();
      expect(screen.queryAllByRole('row')).toHaveLength(1); // Assuming only header row is present
    });

    it('should display resource data in table rows when resources are provided', () => {
      const mockResourcesData = [
        { id: 'res-1', info: { name: 'Alice Wonderland', email: 'alice@example.com', primaryRole: 'Engineer' }, status: 'Active', projectCount: 2 },
        { id: 'res-2', info: { name: 'Bob The Builder', email: 'bob@example.com', primaryRole: 'Manager' }, status: 'Inactive', projectCount: 1 },
      ];
      (require('../../../services/api') as { getResources: jest.Mock }).getResources.mockResolvedValueOnce({ data: mockResourcesData, total: 2 });
      
      renderWithProviders(<ResourceListPage />);
      
      const rows = screen.getAllByRole('row').slice(1); 
      expect(rows).toHaveLength(mockResourcesData.length);

      mockResourcesData.forEach((resource, index) => {
        const row = rows[index];
        expect(within(row).getByText(resource.info.name)).toBeInTheDocument();
        expect(within(row).getByText(resource.info.email)).toBeInTheDocument();
        expect(within(row).getByText(resource.status)).toBeInTheDocument();
        expect(within(row).getByText(resource.info.primaryRole)).toBeInTheDocument();
        expect(within(row).getByText(resource.projectCount.toString())).toBeInTheDocument();
        expect(within(row).getByRole('button', { name: /view details/i })).toBeInTheDocument();
        expect(within(row).getByRole('button', { name: /edit/i })).toBeInTheDocument();
        expect(within(row).getByRole('button', { name: /delete/i })).toBeInTheDocument();
      });
    });

    // More tests for basic rendering will follow here
  });

  // More test suites will follow
});
