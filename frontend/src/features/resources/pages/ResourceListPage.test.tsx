import { render, screen, within, fireEvent } from '@testing-library/react';
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

  describe('Navigation', () => {
    it('should navigate to the create resource page when "Add Resource" button is clicked', () => {
      (require('../../../services/api') as { getResources: jest.Mock }).getResources.mockResolvedValueOnce({ data: [], total: 0 });
      renderWithProviders(<ResourceListPage />);
      
      const addResourceButton = screen.getByRole('button', { name: /add resource/i });
      fireEvent.click(addResourceButton);
      
      expect(mockNavigate).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith('/resources/create'); 
    });

    // More navigation tests will follow
  });

  describe('Pagination Functionality', () => {
    const generateMockResources = (length: number, offset: number = 0) => 
      Array.from({ length }, (_, i) => ({ 
        id: `res-${i + offset}`,
        info: { name: `Resource ${i + offset}`, email: `res${i + offset}@example.com`, primaryRole: 'Developer' }, 
        status: 'Available',
        projectCount: i % 3,
      }));

    beforeEach(() => {
      (require('../../../services/api') as { getResources: jest.Mock }).getResources.mockClear();
    });

    it('should fetch the next page of resources when "Next Page" button is clicked', async () => {
      const initialResources = generateMockResources(10); 
      const nextPageResources = generateMockResources(5, 10); 
      const totalResources = 15;
      const pageSize = 10;

      (require('../../../services/api') as { getResources: jest.Mock }).getResources.mockResolvedValueOnce({ data: initialResources, total: totalResources });
      renderWithProviders(<ResourceListPage />);
      
      expect(await screen.findByText('Resource 0')).toBeInTheDocument();
      expect((require('../../../services/api') as { getResources: jest.Mock }).getResources).toHaveBeenCalledWith(expect.objectContaining({ page: 1, limit: pageSize, query: '', status: '', skills: [], rateMin: undefined, rateMax: undefined, availabilityTypes: [], sortBy: 'info.name', sortOrder: 'asc' }));

      (require('../../../services/api') as { getResources: jest.Mock }).getResources.mockResolvedValueOnce({ data: nextPageResources, total: totalResources });
      
      const nextPageButton = screen.getByRole('button', { name: /go to next page/i });
      fireEvent.click(nextPageButton);

      expect(await screen.findByText('Resource 10')).toBeInTheDocument(); 
      expect(screen.queryByText('Resource 0')).not.toBeInTheDocument(); 

      expect((require('../../../services/api') as { getResources: jest.Mock }).getResources).toHaveBeenCalledWith(expect.objectContaining({ page: 2, limit: pageSize, query: '', status: '', skills: [], rateMin: undefined, rateMax: undefined, availabilityTypes: [], sortBy: 'info.name', sortOrder: 'asc' }));
      expect(screen.getByText(`11–${totalResources} of ${totalResources}`)).toBeInTheDocument(); 
    });

    it('should fetch the previous page of resources when "Previous Page" button is clicked', async () => {
      const page1Resources = generateMockResources(10);    
      const page2Resources = generateMockResources(5, 10); 
      const totalResources = 15;
      const pageSize = 10;

      (require('../../../services/api') as { getResources: jest.Mock })
        .mockResolvedValueOnce({ data: page1Resources, total: totalResources }) 
        .mockResolvedValueOnce({ data: page2Resources, total: totalResources }); 

      renderWithProviders(<ResourceListPage />);
      
      expect(await screen.findByText('Resource 0')).toBeInTheDocument();

      const nextPageButton = screen.getByRole('button', { name: /go to next page/i });
      fireEvent.click(nextPageButton);
      
      expect(await screen.findByText('Resource 10')).toBeInTheDocument();
      expect(screen.getByText(`11–${totalResources} of ${totalResources}`)).toBeInTheDocument();
      expect((require('../../../services/api') as { getResources: jest.Mock }).getResources).toHaveBeenLastCalledWith(expect.objectContaining({ page: 2, limit: pageSize }));

      (require('../../../services/api') as { getResources: jest.Mock }).getResources.mockResolvedValueOnce({ data: page1Resources, total: totalResources });
      
      const prevPageButton = screen.getByRole('button', { name: /go to previous page/i });
      expect(prevPageButton).not.toBeDisabled(); 
      fireEvent.click(prevPageButton);

      expect(await screen.findByText('Resource 0')).toBeInTheDocument();
      expect(screen.queryByText('Resource 10')).not.toBeInTheDocument(); 

      expect((require('../../../services/api') as { getResources: jest.Mock }).getResources).toHaveBeenLastCalledWith(expect.objectContaining({ page: 1, limit: pageSize }));
      expect(screen.getByText(`1–${pageSize} of ${totalResources}`)).toBeInTheDocument(); 
    });

    it('should fetch resources with the new page size when "Rows per page" is changed', async () => {
      const initialResourcesPageSize5 = generateMockResources(5); 
      const totalResources = 15; 
      const initialPageSize = 10; 
      const newPageSize = 5;

      (require('../../../services/api') as { getResources: jest.Mock }).getResources.mockResolvedValueOnce({ data: generateMockResources(initialPageSize), total: totalResources });
      renderWithProviders(<ResourceListPage />);
      
      expect(await screen.findByText('Resource 0')).toBeInTheDocument();
      expect((require('../../../services/api') as { getResources: jest.Mock }).getResources).toHaveBeenCalledWith(expect.objectContaining({ page: 1, limit: initialPageSize }));

      (require('../../../services/api') as { getResources: jest.Mock }).getResources.mockResolvedValueOnce({ data: initialResourcesPageSize5, total: totalResources });
      
      const rowsPerPageSelect = screen.getByLabelText(/rows per page/i);
      fireEvent.mouseDown(rowsPerPageSelect); 
      const option5 = await screen.findByRole('option', { name: '5' }); 
      fireEvent.click(option5);
      
      expect(await screen.findByText('Resource 0')).toBeInTheDocument(); 
      expect(screen.queryByText(`Resource ${newPageSize}`)).not.toBeInTheDocument(); 

      expect((require('../../../services/api') as { getResources: jest.Mock }).getResources).toHaveBeenLastCalledWith(expect.objectContaining({ page: 1, limit: newPageSize }));
      expect(screen.getByText(`1–${newPageSize} of ${totalResources}`)).toBeInTheDocument(); 
    });

    // More pagination tests (previous page, rows per page) will follow
  });

  describe('Search Functionality', () => {
    const generateMockResources = (length: number, offset: number = 0, namePrefix: string = 'Resource') => 
      Array.from({ length }, (_, i) => ({ 
        id: `res-${i + offset}`,
        info: { name: `${namePrefix} ${i + offset}`, email: `res${i + offset}@example.com`, primaryRole: 'Developer' }, 
        status: 'Available',
        projectCount: i % 3,
      }));

    beforeEach(() => {
      (require('../../../services/api') as { getResources: jest.Mock }).getResources.mockClear();
      (require('../../../services/api') as { getResources: jest.Mock }).getResources.mockResolvedValueOnce({ data: generateMockResources(5, 0, "Initial"), total: 5 });
    });

    it('should filter resources by name when text is entered in search input', async () => {
      const searchTerm = 'Alice';
      const searchResults = [
        { id: 'res-alice', info: { name: 'Alice Wonderland', email: 'alice@example.com', primaryRole: 'Engineer' }, status: 'Active', projectCount: 1 }
      ];
      
      renderWithProviders(<ResourceListPage />);
      
      expect(await screen.findByText('Initial 0')).toBeInTheDocument();

      const searchInput = screen.getByRole('searchbox', { name: /search/i }); 
      
      (require('../../../services/api') as { getResources: jest.Mock }).getResources.mockResolvedValueOnce({ data: searchResults, total: searchResults.length });
      
      fireEvent.change(searchInput, { target: { value: searchTerm } });
      
      expect(await screen.findByText('Alice Wonderland')).toBeInTheDocument();
      expect(screen.queryByText('Initial 0')).not.toBeInTheDocument(); 

      expect((require('../../../services/api') as { getResources: jest.Mock }).getResources).toHaveBeenLastCalledWith(
        expect.objectContaining({ query: searchTerm, page: 1 })
      );
    });
    
    it('should show all resources when search input is cleared', async () => {
        const searchTerm = 'Alice';
        const searchResults = [{ id: 'res-alice', info: { name: 'Alice Wonderland', email: 'alice@example.com', primaryRole: 'Engineer' }, status: 'Active', projectCount: 1 }];
        const allResourcesAfterClear = generateMockResources(5, 0, "All");

        renderWithProviders(<ResourceListPage />);
        expect(await screen.findByText('Initial 0')).toBeInTheDocument(); 

        const searchInput = screen.getByRole('searchbox', { name: /search/i });

        (require('../../../services/api') as { getResources: jest.Mock }).getResources.mockResolvedValueOnce({ data: searchResults, total: searchResults.length });
        fireEvent.change(searchInput, { target: { value: searchTerm } });
        expect(await screen.findByText('Alice Wonderland')).toBeInTheDocument();

        (require('../../../services/api') as { getResources: jest.Mock }).getResources.mockResolvedValueOnce({ data: allResourcesAfterClear, total: allResourcesAfterClear.length });
        fireEvent.change(searchInput, { target: { value: '' } }); 

        expect(await screen.findByText('All 0')).toBeInTheDocument(); 
        expect(screen.queryByText('Alice Wonderland')).not.toBeInTheDocument(); 

        expect((require('../../../services/api') as { getResources: jest.Mock }).getResources).toHaveBeenLastCalledWith(
            expect.objectContaining({ query: '', page: 1 })
        );
    });
  });

  describe('Status Filter Functionality', () => {
    const generateMockResources = (length: number, offset: number = 0, namePrefix: string = 'Resource', status: string = 'Available') => 
      Array.from({ length }, (_, i) => ({ 
        id: `res-${i + offset}`,
        info: { name: `${namePrefix} ${i + offset}`, email: `res${i + offset}@example.com`, primaryRole: 'Developer' }, 
        status: status, 
        projectCount: i % 3,
      }));

    beforeEach(() => {
      (require('../../../services/api') as { getResources: jest.Mock }).getResources.mockClear();
      (require('../../../services/api') as { getResources: jest.Mock }).getResources.mockResolvedValueOnce({ 
        data: generateMockResources(3, 0, "Initial", "Available").concat(generateMockResources(2, 3, "Initial", "Busy")), 
        total: 5 
      });
    });

    it('should filter resources by status when a status is selected', async () => {
      const filterStatus = 'Available';
      const filteredResults = generateMockResources(2, 0, "Filtered", filterStatus); 
      
      renderWithProviders(<ResourceListPage />);
      
      expect(await screen.findByText('Initial 0')).toBeInTheDocument(); 
      expect(await screen.findByText('Initial 3')).toBeInTheDocument(); 

      const statusFilterSelect = screen.getByLabelText(/status/i); 
      
      (require('../../../services/api') as { getResources: jest.Mock }).getResources.mockResolvedValueOnce({ data: filteredResults, total: filteredResults.length });
      
      fireEvent.mouseDown(statusFilterSelect); 
      const optionAvailable = await screen.findByRole('option', { name: filterStatus });
      fireEvent.click(optionAvailable);
      
      expect(await screen.findByText('Filtered 0')).toBeInTheDocument();
      expect(screen.queryByText(/Initial 3/i)).not.toBeInTheDocument(); 

      expect((require('../../../services/api') as { getResources: jest.Mock }).getResources).toHaveBeenLastCalledWith(
        expect.objectContaining({ status: filterStatus, page: 1 })
      );
    });

    it('should show all resources when status filter is cleared (e.g., selecting "All")', async () => {
        const filterStatus = 'Available';
        const filteredResults = generateMockResources(2, 0, "Filtered", filterStatus);
        const allResourcesAfterClear = generateMockResources(5, 0, "All", "Mixed"); 

        renderWithProviders(<ResourceListPage />);
        expect(await screen.findByText('Initial 0')).toBeInTheDocument();

        const statusFilterSelect = screen.getByLabelText(/status/i);

        (require('../../../services/api') as { getResources: jest.Mock }).getResources.mockResolvedValueOnce({ data: filteredResults, total: filteredResults.length });
        fireEvent.mouseDown(statusFilterSelect);
        fireEvent.click(await screen.findByRole('option', { name: filterStatus }));
        expect(await screen.findByText('Filtered 0')).toBeInTheDocument();

        (require('../../../services/api') as { getResources: jest.Mock }).getResources.mockResolvedValueOnce({ data: allResourcesAfterClear, total: allResourcesAfterClear.length });
        fireEvent.mouseDown(statusFilterSelect);
        const optionAll = await screen.findByRole('option', { name: /all statuses|any/i }); 
        fireEvent.click(optionAll);


        expect(await screen.findByText('All 0')).toBeInTheDocument(); 
        expect(screen.queryByText('Filtered 0')).not.toBeInTheDocument(); 

        expect((require('../../../services/api') as { getResources: jest.Mock }).getResources).toHaveBeenLastCalledWith(
            expect.objectContaining({ status: '', page: 1 }) 
        );
    });
  });

  describe('Skills Filter Functionality', () => {
    const generateMockResources = (length: number, offset: number = 0, namePrefix: string = 'Resource', skills: string[] = []) => 
      Array.from({ length }, (_, i) => ({ 
        id: `res-${i + offset}`,
        info: { name: `${namePrefix} ${i + offset}`, email: `res${i + offset}@example.com`, primaryRole: 'Developer', skills: skills }, 
        status: 'Available',
        projectCount: i % 3,
      }));

    beforeEach(() => {
      (require('../../../services/api') as { getResources: jest.Mock }).getResources.mockClear();
      (require('../../../services/api') as { getResources: jest.Mock }).getResources.mockResolvedValueOnce({ 
        data: generateMockResources(5, 0, "Initial"), 
        total: 5 
      });
    });

    it('should open the skills filter modal when "Skills" filter button is clicked', async () => {
      renderWithProviders(<ResourceListPage />);
      expect(await screen.findByText('Initial 0')).toBeInTheDocument();

      const skillsFilterButton = screen.getByRole('button', { name: /skills/i }); 
      fireEvent.click(skillsFilterButton);

      expect(await screen.findByRole('dialog', { name: /filter by skills/i })).toBeInTheDocument();
    });

    it('should select skills in the modal and apply the filter', async () => {
      const skillsToSelect = ['React', 'Node.js'];
      const filteredResources = generateMockResources(1, 0, 'FilteredSkill', skillsToSelect);

      renderWithProviders(<ResourceListPage />);
      expect(await screen.findByText('Initial 0')).toBeInTheDocument();

      const skillsFilterButton = screen.getByRole('button', { name: /skills/i });
      fireEvent.click(skillsFilterButton);

      const modal = await screen.findByRole('dialog', { name: /filter by skills/i });

      for (const skill of skillsToSelect) {
        const skillCheckbox = await within(modal).findByLabelText(skill, undefined, { timeout: 2000 }); 
        fireEvent.click(skillCheckbox);
      }

      (require('../../../services/api') as { getResources: jest.Mock }).getResources.mockResolvedValueOnce({ data: filteredResources, total: filteredResources.length });

      const applyButton = within(modal).getByRole('button', { name: /apply|save/i }); 
      fireEvent.click(applyButton);

      expect(await screen.findByText('FilteredSkill 0')).toBeInTheDocument();
      expect(screen.queryByText('Initial 0')).not.toBeInTheDocument(); 

      expect((require('../../../services/api') as { getResources: jest.Mock }).getResources).toHaveBeenLastCalledWith(
        expect.objectContaining({ skills: skillsToSelect, page: 1 })
      );
      
      expect(screen.queryByRole('dialog', { name: /filter by skills/i })).not.toBeInTheDocument();
    });

    it('should clear selected skills in the modal and show all resources', async () => {
      const skillsToSelect = ['React'];
      const initialFilteredResources = generateMockResources(1, 0, 'FilteredSkill', skillsToSelect);
      const allResourcesAfterClear = generateMockResources(5, 0, "AllSkillsCleared");

      renderWithProviders(<ResourceListPage />);
      expect(await screen.findByText('Initial 0')).toBeInTheDocument();

      const skillsFilterButton = screen.getByRole('button', { name: /skills/i });
      fireEvent.click(skillsFilterButton);
      const modal = await screen.findByRole('dialog', { name: /filter by skills/i });
      const skillCheckbox = await within(modal).findByLabelText(skillsToSelect[0], undefined, { timeout: 2000 });
      fireEvent.click(skillCheckbox);
      
      (require('../../../services/api') as { getResources: jest.Mock }).getResources.mockResolvedValueOnce({ data: initialFilteredResources, total: initialFilteredResources.length });
      const applyButton = within(modal).getByRole('button', { name: /apply|save/i });
      fireEvent.click(applyButton);
      expect(await screen.findByText('FilteredSkill 0')).toBeInTheDocument();

      fireEvent.click(skillsFilterButton);
      const modalAgain = await screen.findByRole('dialog', { name: /filter by skills/i });

      (require('../../../services/api') as { getResources: jest.Mock }).getResources.mockResolvedValueOnce({ data: allResourcesAfterClear, total: allResourcesAfterClear.length });

      const clearButton = within(modalAgain).getByRole('button', { name: /clear|reset/i }); 
      fireEvent.click(clearButton);
      
      expect(await screen.findByText('AllSkillsCleared 0')).toBeInTheDocument();
      expect(screen.queryByText('FilteredSkill 0')).not.toBeInTheDocument();

      expect((require('../../../services/api') as { getResources: jest.Mock }).getResources).toHaveBeenLastCalledWith(
        expect.objectContaining({ skills: [], page: 1 })
      );
      
      expect(screen.queryByRole('dialog', { name: /filter by skills/i })).not.toBeInTheDocument();
    });

    // Further tests will cover skill selection and application
  });

  // More test suites will follow
});
