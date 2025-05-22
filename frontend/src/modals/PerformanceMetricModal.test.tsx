import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Button from '@mui/material/Button';
import { Dialog, DialogTitle } from '@mui/material';
import PerformanceMetricModal from './PerformanceMetricModal';
import { ModalContext } from '../contexts/ModalContext';
import { ModalContextType } from '../contexts/ModalContext';
import { PerformanceMetric } from '../../../types/resource.types';

const mockLogModalAction = jest.fn();

// Mock Firebase
jest.mock('../firebase', () => ({
  __esModule: true,
  auth: {
    onAuthStateChanged: jest.fn(() => jest.fn()),
  },
  functions: {
    httpsCallable: jest.fn(() => jest.fn(async () => ({ data: { success: true } }))),
  },
}));

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
    // A simplified mock that allows changing the value for testing purposes
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


const renderWithModalContext = (ui: React.ReactElement, providerProps?: Partial<ModalContextType>) => {
  const baseContextValue: ModalContextType = {
    logModalAction: mockLogModalAction,
    modalViewHistory: [], // Ensure this is always provided
  };
  return render(
    <ModalContext.Provider value={{ ...baseContextValue, ...providerProps }}>
      {ui}
    </ModalContext.Provider>
  );
};

describe('PerformanceMetricModal', () => {
  const mockOnClose = jest.fn();
  const mockOnSubmit = jest.fn();

  const defaultProps = {
    isOpen: true, // Changed from 'open'
    onClose: mockOnClose,
    onSubmit: mockOnSubmit,
    initialData: undefined, // Changed from null
    existingMetricNames: [],
  };

  beforeEach(() => {
    mockOnClose.mockClear();
    mockOnSubmit.mockClear();
    mockLogModalAction.mockClear();
  });

  test('renders minimal modal with onSubmit and initialData props defined', () => {
    const propsToSpread = {
      isOpen: true,
      onClose: mockOnClose,
      onSubmit: mockOnSubmit, 
      initialData: undefined, // Explicitly provide, even if undefined
    };
    renderWithModalContext(
      <PerformanceMetricModal {...propsToSpread} /> 
    ); 
    expect(screen.getByTestId('minimal-pmm-dialog')).toBeInTheDocument();
    expect(screen.getByText('Add Performance Metric')).toBeInTheDocument();
  });

  test('renders the modal with "Edit Performance Metric" title when initialData is provided', () => {
    const initialData: PerformanceMetric = {
      id: '1',
      metricName: 'Communication',
      rating: 4,
      reviewDate: '2023-10-01',
      comments: 'Good',
    };
    renderWithModalContext(<PerformanceMetricModal {...defaultProps} initialData={initialData} />);
    expect(screen.getByText('Edit Performance Metric')).toBeInTheDocument();
  });

  test('calls onClose when Cancel button is clicked', () => {
    renderWithModalContext(<PerformanceMetricModal {...defaultProps} />);
    fireEvent.click(screen.getByText('Cancel'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('displays validation error if metric name is missing on submit', () => {
    renderWithModalContext(<PerformanceMetricModal {...defaultProps} />);
    fireEvent.click(screen.getByText('Save Metric'));
    expect(screen.getByText('Metric Name, Rating, and a valid Review Date are required.')).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });
  
  test('displays validation error if rating is missing on submit', () => {
    renderWithModalContext(<PerformanceMetricModal {...defaultProps} />);
    const metricNameInput = screen.getByLabelText(/Metric Name/i);
    fireEvent.change(metricNameInput, { target: { value: 'Test Metric' } });
    // Assuming DatePicker is handled, for now, let's focus on rating
    // const reviewDateInput = screen.getByLabelText(/Review Date/i); // This will be a DatePicker
    // fireEvent.change(reviewDateInput, { target: { value: '2024-01-01' } }); // This won't work directly for MUI DatePicker

    fireEvent.click(screen.getByText('Save Metric'));
    expect(screen.getByText('Metric Name, Rating, and a valid Review Date are required.')).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });


  test('successfully submits new metric data', async () => {
    renderWithModalContext(<PerformanceMetricModal {...defaultProps} />);

    // Fill out the form
    fireEvent.change(screen.getByLabelText(/Metric Name/i), { target: { value: 'New Metric' } });
    
    // Interact with Rating: MUI Rating renders as a set of radio buttons.
    // Each radio input has an accessible name like "X Stars".
    const fourthStarRadio = screen.getByRole('radio', { name: '4 Stars' });
    fireEvent.click(fourthStarRadio);

    // Select a date using the mocked DatePicker
    const reviewDateInput = screen.getByLabelText(/Review Date/i);
    // The mock DatePicker expects a string that can be parsed by `new Date()` and then it calls onChange with a Date object.
    // The input value itself is set to YYYY-MM-DD format by the mock.
    fireEvent.change(reviewDateInput, { target: { value: '2024-05-22' } }); 

    // Click Save
    fireEvent.click(screen.getByText('Save Metric'));

    // Assertions
    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    expect(mockOnSubmit).toHaveBeenCalledWith(expect.objectContaining({
      metricName: 'New Metric',
      rating: 4, 
      reviewDate: new Date('2024-05-22T00:00:00.000Z').toISOString(), // Ensure UTC for consistency in test
      description: undefined, 
      notes: undefined, 
      id: expect.any(String),
    }));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
    expect(screen.queryByText('Metric Name, Rating, and a valid Review Date are required.')).not.toBeInTheDocument();
  });


  test('successfully submits edited metric data and populates form initially', async () => {
    const initialData: PerformanceMetric = {
      id: 'metric-123',
      metricName: 'Old Metric Name',
      description: 'Old Description',
      rating: 3,
      reviewDate: new Date('2023-01-15T00:00:00.000Z').toISOString(),
      notes: 'Old Notes',
    };
    renderWithModalContext(<PerformanceMetricModal {...defaultProps} initialData={initialData} />);

    // Verify form is populated
    expect(screen.getByLabelText(/Metric Name/i)).toHaveValue('Old Metric Name');
    expect(screen.getByLabelText(/Description/i)).toHaveValue('Old Description');
    expect(screen.getByRole('radio', { name: '3 Stars' })).toBeChecked();
    expect(screen.getByLabelText(/Review Date/i)).toHaveValue('2023-01-15');
    expect(screen.getByLabelText(/Notes/i)).toHaveValue('Old Notes');

    // Change some values
    fireEvent.change(screen.getByLabelText(/Metric Name/i), { target: { value: 'Updated Metric Name' } });
    fireEvent.click(screen.getByRole('radio', { name: '5 Stars' })); // Change rating to 5
    fireEvent.change(screen.getByLabelText(/Review Date/i), { target: { value: '2024-06-01' } });


    // Click Save Changes
    fireEvent.click(screen.getByText('Save Changes'));

    // Assertions
    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    expect(mockOnSubmit).toHaveBeenCalledWith(expect.objectContaining({
      id: 'metric-123', // Important: ID should be preserved
      metricName: 'Updated Metric Name',
      rating: 5,
      reviewDate: new Date('2024-06-01T00:00:00.000Z').toISOString(),
      description: 'Old Description', // This was not changed
      notes: 'Old Notes', // This was not changed
    }));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });


  test('logs modal open and close actions via ModalContext', () => {
    const { unmount } = renderWithModalContext(<PerformanceMetricModal {...defaultProps} isOpen={true} />);
    expect(mockLogModalAction).toHaveBeenCalledWith('PerformanceMetricModal', 'open', { mode: 'add' });
    
    unmount(); // This should trigger the cleanup function in useEffect
    expect(mockLogModalAction).toHaveBeenCalledWith('PerformanceMetricModal', 'close');
    expect(mockLogModalAction).toHaveBeenCalledTimes(2); // open and close
  });

  test('logs modal open (edit mode) and close actions via ModalContext', () => {
    const initialData: PerformanceMetric = { id: '1', metricName: 'Test', rating: 1, reviewDate: new Date().toISOString() };
    const { unmount } = renderWithModalContext(<PerformanceMetricModal {...defaultProps} isOpen={true} initialData={initialData} />);
    expect(mockLogModalAction).toHaveBeenCalledWith('PerformanceMetricModal', 'open', { mode: 'edit' });
    
    unmount();
    expect(mockLogModalAction).toHaveBeenCalledWith('PerformanceMetricModal', 'close');
    expect(mockLogModalAction).toHaveBeenCalledTimes(2);
  });

  test('logs modal submit action via ModalContext', () => {
    renderWithModalContext(<PerformanceMetricModal {...defaultProps} isOpen={true} />);
    
    // Fill form to pass validation
    fireEvent.change(screen.getByLabelText(/Metric Name/i), { target: { value: 'Submit Log Test' } });
    fireEvent.click(screen.getByRole('radio', { name: '1 Star' }));
    fireEvent.change(screen.getByLabelText(/Review Date/i), { target: { value: '2024-01-01' } });

    fireEvent.click(screen.getByText('Save Metric'));
    
    expect(mockLogModalAction).toHaveBeenCalledWith(
      'PerformanceMetricModal', 
      'submit', 
      expect.objectContaining({ name: 'Submit Log Test', id: expect.any(String) })
    );
    expect(mockLogModalAction.mock.calls[0]).toEqual(['PerformanceMetricModal', 'open', { mode: 'add' }]);
    expect(mockLogModalAction.mock.calls[1][0]).toEqual('PerformanceMetricModal');
    expect(mockLogModalAction.mock.calls[1][1]).toEqual('submit');
    expect(mockLogModalAction.mock.calls[1][2]).toEqual(expect.objectContaining({ name: 'Submit Log Test' }));

    expect(mockLogModalAction).toHaveBeenCalledTimes(2); 
  });


  test('renders a simple MUI Button', () => {
    render(<Button>Test Button</Button>);
    expect(screen.getByText('Test Button')).toBeInTheDocument();
  });

  // More tests to be added:
  // - Test for missing review date validation


  test('renders a simple MUI Dialog directly', () => {
    const { debug } = render(
      <Dialog open={true}>
        <DialogTitle>Direct Dialog Title</DialogTitle>
      </Dialog>
    );
    debug();
    expect(screen.getByText('Direct Dialog Title')).toBeInTheDocument();
  });
  // - Test successful submission with new data (mocking date selection)
  // - Test successful submission with existing data (editing)
  // - Test population of form fields when initialData is provided
  // - Test that metricName cannot be one of the existingMetricNames when creating
  // - Test that metricName can be the same as initialData.metricName when editing
});
