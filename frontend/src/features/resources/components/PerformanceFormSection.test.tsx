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

  // More tests will follow
});
