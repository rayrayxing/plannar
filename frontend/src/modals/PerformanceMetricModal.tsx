import React, { useContext, useState, useEffect } from 'react'; // ADDED useEffect
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Rating, Typography } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'; // ADDED
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'; // ADDED
import { DatePicker } from '@mui/x-date-pickers/DatePicker'; // ADDED
import { ModalContext } from '../contexts/ModalContext';
import { PerformanceMetric } from '../../../types/resource.types';

interface PerformanceMetricModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (metric: PerformanceMetric) => void;
  initialData?: PerformanceMetric;
}

const PerformanceMetricModal: React.FC<PerformanceMetricModalProps> = ({ 
  isOpen, 
  onClose,
  onSubmit,
  initialData,
}) => {
  const modalContext = useContext(ModalContext); 
  const title = initialData ? "Edit Performance Metric" : "Add Performance Metric";

  // Form State
  const [metricName, setMetricName] = useState('');
  const [description, setDescription] = useState('');
  const [rating, setRating] = useState<number | null>(null);
  const [reviewDate, setReviewDate] = useState<Date | null>(null);
  const [notes, setNotes] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setMetricName(initialData.metricName);
      setDescription(initialData.description || '');
      setRating(initialData.rating);
      setReviewDate(initialData.reviewDate ? new Date(initialData.reviewDate) : null);
      setNotes(initialData.notes || '');
      setValidationError(null); // Clear any validation errors when data is loaded
    } else {
      // Reset form when initialData is not present (e.g. modal opened for new entry)
      // or when modal is closed and reopened for a new entry after an edit.
      setMetricName('');
      setDescription('');
      setRating(null);
      setReviewDate(null);
      setNotes('');
      setValidationError(null);
    }
  }, [initialData, isOpen]); // Rerun if initialData changes or modal is (re)opened

  useEffect(() => {
    if (isOpen) {
      modalContext.logModalAction(
        'PerformanceMetricModal', 
        'open', 
        { mode: initialData ? 'edit' : 'add' }
      );
      // Return a cleanup function to log 'close' when the modal is closed or unmounted
      return () => {
        modalContext.logModalAction('PerformanceMetricModal', 'close');
      };
    }
  }, [isOpen, initialData, modalContext]); // Dependencies for logging

  const handleSubmit = () => {
    setValidationError(null); // Clear previous errors
    const genericErrorMessage = 'Metric Name, Rating, and a valid Review Date are required.';

    if (!metricName.trim()) {
      setValidationError(genericErrorMessage);
      return;
    }
    if (rating === null) {
      setValidationError(genericErrorMessage);
      return;
    }
    if (reviewDate === null) {
      setValidationError(genericErrorMessage);
      return;
    }

    const metricToSubmit: PerformanceMetric = {
      id: initialData?.id || Date.now().toString(),
      metricName: metricName.trim(),
      description: description.trim() || undefined,
      rating: rating, 
      reviewDate: reviewDate.toISOString(),
      notes: notes.trim() || undefined,
    };

    modalContext.logModalAction('PerformanceMetricModal', 'submit', { id: metricToSubmit.id, name: metricToSubmit.metricName });
    onSubmit(metricToSubmit);
    onClose(); 
  };

  if (!isOpen) {
    return null;
  }
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog open={isOpen} onClose={onClose} data-testid="minimal-pmm-dialog">
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="metricName"
            label="Metric Name"
            type="text"
            fullWidth
            variant="outlined"
            value={metricName}
            onChange={(e) => setMetricName(e.target.value)}
            error={!!validationError && !metricName.trim()} // Basic error indication
          />
          <TextField
            margin="dense"
            id="description"
            label="Description (Optional)"
            type="text"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Typography component="legend" variant="body2" sx={{ mt: 2, mb: 1 }}>Rating*</Typography>
          <Rating
            name="performance-rating"
            value={rating}
            onChange={(event, newValue) => {
              setRating(newValue);
            }}
            max={5} 
          />
          <DatePicker
            label="Review Date*"
            value={reviewDate}
            onChange={(newValue) => {
              setReviewDate(newValue);
            }}
            sx={{ mt: 2, width: '100%' }}
          />
          <TextField
            margin="dense"
            id="notes"
            label="Notes (Optional)"
            type="text"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            sx={{ mt: 2 }}
          />
          {validationError && (
            <Typography color="error" variant="body2" sx={{ mt: 2 }}>
              {validationError}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} color="primary" variant="contained">
            {initialData ? 'Save Changes' : 'Save Metric'}
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};
export default PerformanceMetricModal;
