import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import PerformanceFormSection from './PerformanceFormSection';
import { ModalContext, ModalContextType } from '../../../contexts/ModalContext'; 
import { PerformanceMetric } from '../../../types/resource.types';

// Mock the uuidv4 function
jest.mock('uuid', () => ({
  v4: () => 'mocked-uuid-v4',
}));

// Mock @mui/x-date-pickers components
jest.mock('@mui/x-date-pickers/LocalizationProvider', () => ({
  __esModule: true,
  LocalizationProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));
jest.mock('@mui/x-date-pickers/DatePicker', () => ({
  __esModule: true,
  DatePicker: (props: any) => {
    const { value, onChange, label, ...rest } = props;
    return (
      <input
        data-testid={props["data-testid"] || "mock-datepicker"}
        aria-label={label}
        type="date"
        value={value ? new Date(value).toISOString().split('T')[0] : ''}
        onChange={(e) => {
          // @ts-ignore
          onChange(e.target.valueAsDate, { validationError: null });
        }}
        {...rest}
      />
    );
  },
}));
jest.mock('@mui/x-date-pickers/AdapterDateFns', () => ({
  __esModule: true,
  AdapterDateFns: function MockAdapterDateFns() { /* constructor mock */ }
}));

// Mock PerformanceMetricModal as it's opened by PerformanceFormSection
jest.mock('../../../../modals/PerformanceMetricModal', () => ({
  __esModule: true,
  default: jest.fn((props) => {
    if (props.isOpen) {
      return (
        <div data-testid="mock-performance-metric-modal">
          Mock Performance Metric Modal
          <button onClick={() => props.onClose()}>Close</button>
          <button onClick={() => {
            const mockMetric: PerformanceMetric = {
              id: props.initialData?.id || 'mocked-uuid-v4',
              metricName: props.initialData?.metricName || 'Test Metric from Modal',
              description: props.initialData?.description || 'Test Description',
              rating: props.initialData?.rating || 4,
              reviewDate: props.initialData?.reviewDate || new Date().toISOString(),
              notes: props.initialData?.notes || 'Test notes',
              reviewerId: 'reviewer-mock-id',
              resourceId: 'resource-mock-id', 
            };
            props.onSubmit(mockMetric);
            props.onClose();
          }}>Submit Mock Metric</button>
        </div>
      );
    }
    return null;
  }),
}));


const mockLogModalAction = jest.fn();
const mockOpenModal = jest.fn(); // For ModalContext

const renderWithModalContext = (ui: React.ReactElement, providerProps?: Partial<ModalContextType>) => {
  const baseContextValue: ModalContextType = {
    logModalAction: mockLogModalAction,
    modalViewHistory: [],
    openModal: mockOpenModal, 
    closeModal: jest.fn(), 
    getModalState: jest.fn(() => undefined), 
  };
  return render(
    <ModalContext.Provider value={{ ...baseContextValue, ...providerProps }}>
      {ui}
    </ModalContext.Provider>
  );
};

describe('PerformanceFormSection', () => {
  const mockSetPerformanceMetrics = jest.fn();

  const baseDefaultProps = { 
    performanceMetrics: [] as PerformanceMetric[],
    setPerformanceMetrics: mockSetPerformanceMetrics,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly with title, add button, and empty message when no metrics', () => {
    renderWithModalContext(<PerformanceFormSection {...baseDefaultProps} />);
    expect(screen.getByText('Historical Performance Metrics')).toBeInTheDocument(); 
    expect(screen.getByRole('button', { name: /Add Metric/i })).toBeInTheDocument(); 
    expect(screen.getByText('No performance metrics recorded.')).toBeInTheDocument();
  });

  it('should render a list of metrics when performanceMetrics are provided', () => {
    const mockMetricsData: PerformanceMetric[] = [
      {
        id: 'metric-1',
        metricName: 'Communication',
        rating: 5,
        reviewDate: '2023-01-15T10:00:00.000Z',
        reviewerId: 'reviewer-1',
        resourceId: 'resource-123',
        comments: 'Excellent communication skills.',
      },
      {
        id: 'metric-2',
        metricName: 'Technical Skills',
        rating: 4,
        reviewDate: '2023-07-20T10:00:00.000Z',
        reviewerId: 'reviewer-2',
        resourceId: 'resource-123',
      },
    ];
    const propsWithMetrics = {
      ...baseDefaultProps,
      performanceMetrics: mockMetricsData,
    };

    renderWithModalContext(<PerformanceFormSection {...propsWithMetrics} />);

    expect(screen.getByText('Historical Performance Metrics')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Add Metric/i })).toBeInTheDocument();
    expect(screen.queryByText('No performance metrics recorded.')).not.toBeInTheDocument();

    mockMetricsData.forEach(metric => {
      const primaryText = `${metric.metricName}: ${metric.rating}`;
      let secondaryTextRegexStr = `Date: ${metric.reviewDate.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')}`;
      secondaryTextRegexStr += ` \\| Reviewer: ${metric.reviewerId || 'N/A'}`;
      if (metric.comments) {
        secondaryTextRegexStr += ` \\| Comments: ${metric.comments.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')}`;
      }
      
      const listItem = screen.getByText(primaryText).closest('li');
      expect(listItem).not.toBeNull();

      if (listItem) {
        expect(within(listItem).getByText(primaryText)).toBeInTheDocument();
        expect(within(listItem).getByText(new RegExp(secondaryTextRegexStr))).toBeInTheDocument();
        
        expect(within(listItem).getByRole('button', { name: /edit/i })).toBeInTheDocument();
        expect(within(listItem).getByRole('button', { name: /delete/i })).toBeInTheDocument();
      }
    });
  });

  describe('Add New Metric functionality', () => {
    it('should call openModal with correct parameters when "Add Metric" button is clicked', () => {
      renderWithModalContext(<PerformanceFormSection {...baseDefaultProps} />);
      
      const addButton = screen.getByRole('button', { name: /Add Metric/i });
      fireEvent.click(addButton);

      expect(mockOpenModal).toHaveBeenCalledTimes(1);
      expect(mockOpenModal).toHaveBeenCalledWith(
        expect.objectContaining({
          modalType: 'performanceMetricModal',
          modalProps: expect.objectContaining({
            onSubmit: expect.any(Function),
          }),
        })
      );
      const openModalArgs = mockOpenModal.mock.calls[0][0];
      expect(openModalArgs.modalProps.initialData).toBeUndefined();
    });

    it('should call setPerformanceMetrics with the new metric when modal submits', () => {
      const initialMetrics: PerformanceMetric[] = [];
      const props = {
        performanceMetrics: initialMetrics,
        setPerformanceMetrics: mockSetPerformanceMetrics,
      };
      renderWithModalContext(<PerformanceFormSection {...props} />);
      
      const addButton = screen.getByRole('button', { name: /Add Metric/i });
      fireEvent.click(addButton);

      expect(mockOpenModal).toHaveBeenCalledTimes(1);
      const openModalCallArgs = mockOpenModal.mock.calls[0][0];
      const onSubmitFromModalProps = openModalCallArgs.modalProps.onSubmit;

      expect(onSubmitFromModalProps).toEqual(expect.any(Function));

      const newMetricFromModal: PerformanceMetric = {
        id: 'new-metric-id',
        metricName: 'Problem Solving',
        rating: 4,
        reviewDate: '2024-01-01T10:00:00.000Z',
        reviewerId: 'reviewer-3',
        resourceId: 'resource-123',
      };
      
      onSubmitFromModalProps(newMetricFromModal);

      expect(mockSetPerformanceMetrics).toHaveBeenCalledTimes(1);
      expect(mockSetPerformanceMetrics).toHaveBeenCalledWith([...initialMetrics, newMetricFromModal]);
    });

    it('should append new metric to existing metrics when modal submits', () => {
        const existingMetric: PerformanceMetric = {
            id: 'metric-1',
            metricName: 'Communication',
            rating: 5,
            reviewDate: '2023-01-15T10:00:00.000Z',
            reviewerId: 'reviewer-1',
            resourceId: 'resource-123',
        };
        const initialMetrics: PerformanceMetric[] = [existingMetric];
        const props = {
          performanceMetrics: initialMetrics,
          setPerformanceMetrics: mockSetPerformanceMetrics,
        };
        renderWithModalContext(<PerformanceFormSection {...props} />);
        
        const addButton = screen.getByRole('button', { name: /Add Metric/i });
        fireEvent.click(addButton);
  
        expect(mockOpenModal).toHaveBeenCalledTimes(1);
        const openModalCallArgs = mockOpenModal.mock.calls[0][0];
        const onSubmitFromModalProps = openModalCallArgs.modalProps.onSubmit;
  
        const newMetricFromModal: PerformanceMetric = {
          id: 'new-metric-id-2',
          metricName: 'Teamwork',
          rating: 5,
          reviewDate: '2024-02-01T10:00:00.000Z',
          reviewerId: 'reviewer-4',
          resourceId: 'resource-123',
        };
        
        onSubmitFromModalProps(newMetricFromModal);
  
        expect(mockSetPerformanceMetrics).toHaveBeenCalledTimes(1);
        expect(mockSetPerformanceMetrics).toHaveBeenCalledWith([existingMetric, newMetricFromModal]);
      });
  });
  describe('Edit Metric functionality', () => {
    const metric1: PerformanceMetric = {
      id: 'metric-id-1',
      metricName: 'Quality of Work',
      rating: 4,
      reviewDate: '2023-03-10T10:00:00.000Z',
      reviewerId: 'reviewer-edit-1',
      resourceId: 'resource-123',
    };
    const metric2: PerformanceMetric = {
      id: 'metric-id-2',
      metricName: 'Punctuality',
      rating: 5,
      reviewDate: '2023-04-10T10:00:00.000Z',
      reviewerId: 'reviewer-edit-2',
      resourceId: 'resource-123',
    };
    const initialMetricsForEdit: PerformanceMetric[] = [metric1, metric2];

    const propsForEdit = {
      performanceMetrics: initialMetricsForEdit,
      setPerformanceMetrics: mockSetPerformanceMetrics,
    };

    it('should call openModal with correct initialData when an "Edit" button is clicked', () => {
      renderWithModalContext(<PerformanceFormSection {...propsForEdit} />);
      
      const listItemForMetric1 = screen.getByText(`${metric1.metricName}: ${metric1.rating}`).closest('li');
      expect(listItemForMetric1).not.toBeNull();
      if (!listItemForMetric1) return; 

      const editButton = within(listItemForMetric1).getByRole('button', { name: /edit/i });
      fireEvent.click(editButton);

      expect(mockOpenModal).toHaveBeenCalledTimes(1);
      expect(mockOpenModal).toHaveBeenCalledWith(
        expect.objectContaining({
          modalType: 'performanceMetricModal',
          modalProps: expect.objectContaining({
            initialData: metric1, 
            onSubmit: expect.any(Function),
          }),
        })
      );
    });

    it('should call setPerformanceMetrics with the updated metric when modal submits for an edit', () => {
      renderWithModalContext(<PerformanceFormSection {...propsForEdit} />);
      
      const listItemForMetric1 = screen.getByText(`${metric1.metricName}: ${metric1.rating}`).closest('li');
      expect(listItemForMetric1).not.toBeNull();
      if (!listItemForMetric1) return;

      const editButton = within(listItemForMetric1).getByRole('button', { name: /edit/i });
      fireEvent.click(editButton);

      expect(mockOpenModal).toHaveBeenCalledTimes(1);
      const openModalCallArgs = mockOpenModal.mock.calls[0][0];
      const onSubmitFromModalProps = openModalCallArgs.modalProps.onSubmit;

      expect(onSubmitFromModalProps).toEqual(expect.any(Function));

      const updatedMetricData: PerformanceMetric = {
        ...metric1, 
        metricName: 'Improved Quality of Work',
        rating: 5,
        comments: 'Significant improvement noted.',
      };
      
      onSubmitFromModalProps(updatedMetricData);

      expect(mockSetPerformanceMetrics).toHaveBeenCalledTimes(1);
      const expectedMetricsList = [...initialMetricsForEdit];
      expectedMetricsList[0] = updatedMetricData; 
      expect(mockSetPerformanceMetrics).toHaveBeenCalledWith(expectedMetricsList);
    });
  });
  describe('Delete Metric functionality', () => {
    const metricToDelete: PerformanceMetric = {
      id: 'metric-id-del-1',
      metricName: 'Adaptability',
      rating: 3,
      reviewDate: '2023-05-10T10:00:00.000Z',
      reviewerId: 'reviewer-del-1',
      resourceId: 'resource-123',
    };
    const metricToKeep: PerformanceMetric = {
      id: 'metric-id-keep-1',
      metricName: 'Leadership',
      rating: 5,
      reviewDate: '2023-06-10T10:00:00.000Z',
      reviewerId: 'reviewer-keep-1',
      resourceId: 'resource-123',
    };
    const initialMetricsForDelete: PerformanceMetric[] = [metricToDelete, metricToKeep];

    const propsForDelete = {
      performanceMetrics: initialMetricsForDelete,
      setPerformanceMetrics: mockSetPerformanceMetrics,
    };

    it('should call setPerformanceMetrics with the metric removed when a "Delete" button is clicked', () => {
      renderWithModalContext(<PerformanceFormSection {...propsForDelete} />);
      
      const listItemForMetricToDelete = screen.getByText(`${metricToDelete.metricName}: ${metricToDelete.rating}`).closest('li');
      expect(listItemForMetricToDelete).not.toBeNull();
      if (!listItemForMetricToDelete) return; 

      const deleteButton = within(listItemForMetricToDelete).getByRole('button', { name: /delete/i });
      fireEvent.click(deleteButton);

      expect(mockSetPerformanceMetrics).toHaveBeenCalledTimes(1);
      expect(mockSetPerformanceMetrics).toHaveBeenCalledWith([metricToKeep]);
    });

    it('should correctly remove a metric when it is not the first in the list', () => {
        const metricToKeepFirst: PerformanceMetric = {
            id: 'metric-id-keep-2',
            metricName: 'Initiative',
            rating: 4,
            reviewDate: '2023-07-10T10:00:00.000Z',
            reviewerId: 'reviewer-keep-2',
            resourceId: 'resource-123',
          };
        const metricToDeleteSecond: PerformanceMetric = {
            id: 'metric-id-del-2',
            metricName: 'Collaboration',
            rating: 4,
            reviewDate: '2023-08-10T10:00:00.000Z',
            reviewerId: 'reviewer-del-2',
            resourceId: 'resource-123',
        };
        const initialMetricsForDeleteVariant: PerformanceMetric[] = [metricToKeepFirst, metricToDeleteSecond];
        const propsForDeleteVariant = {
            performanceMetrics: initialMetricsForDeleteVariant,
            setPerformanceMetrics: mockSetPerformanceMetrics,
          };

        renderWithModalContext(<PerformanceFormSection {...propsForDeleteVariant} />);
        
        const listItemForMetricToDelete = screen.getByText(`${metricToDeleteSecond.metricName}: ${metricToDeleteSecond.rating}`).closest('li');
        expect(listItemForMetricToDelete).not.toBeNull();
        if (!listItemForMetricToDelete) return;
  
        const deleteButton = within(listItemForMetricToDelete).getByRole('button', { name: /delete/i });
        fireEvent.click(deleteButton);
  
        expect(mockSetPerformanceMetrics).toHaveBeenCalledTimes(1);
        expect(mockSetPerformanceMetrics).toHaveBeenCalledWith([metricToKeepFirst]);
      });
  });
  // More tests will follow
});
