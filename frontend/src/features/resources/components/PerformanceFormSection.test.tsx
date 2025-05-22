import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
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

  const defaultProps = {
    performanceMetrics: [] as PerformanceMetric[],
    setPerformanceMetrics: mockSetPerformanceMetrics,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly with title, add button, and empty message when no metrics', () => {
    renderWithModalContext(<PerformanceFormSection {...defaultProps} />);
    expect(screen.getByText('Performance History')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Add New Metric/i })).toBeInTheDocument();
    expect(screen.getByText('No performance metrics recorded.')).toBeInTheDocument();
  });

  // More tests will follow
});
