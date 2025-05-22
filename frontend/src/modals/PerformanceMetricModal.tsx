import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Grid } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFnsV3 } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { isValid, parseISO, format } from 'date-fns';
import { PerformanceMetric } from '../../../types/resource.types';
import { useModalActionLogger } from '../hooks/useModalActionLogger';

interface PerformanceMetricModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (metric: PerformanceMetric) => void;
  initialData?: PerformanceMetric;
}

const PerformanceMetricModal: React.FC<PerformanceMetricModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [id, setId] = useState<string | undefined>(undefined); // For editing existing
  const [metricName, setMetricName] = useState('');
  const [rating, setRating] = useState<number | '' >(''); // Allow empty string for TextField
  const [reviewDate, setReviewDate] = useState<Date | null>(null);
  const [comments, setComments] = useState('');
  const [reviewCycleId, setReviewCycleId] = useState('');
  const [reviewerId, setReviewerId] = useState('');
  const [goalsSet, setGoalsSet] = useState('');
  const [achievements, setAchievements] = useState('');

  const { logModalAction } = useModalActionLogger('performanceMetricModal');

  useEffect(() => {
    if (initialData) {
      setId(initialData.id); // id is mandatory in PerformanceMetric
      setMetricName(initialData.metricName || '');
      setRating(initialData.rating || '');
      setReviewDate(initialData.reviewDate && isValid(parseISO(initialData.reviewDate)) ? parseISO(initialData.reviewDate) : null);
      setComments(initialData.comments || '');
      setReviewCycleId(initialData.reviewCycleId || '');
      setReviewerId(initialData.reviewerId || '');
      setGoalsSet(initialData.goalsSet || '');
      setAchievements(initialData.achievements || '');
      logModalAction({ action: 'OPEN', outcome: 'EDIT_MODE', metadata: { initialData } });
    } else {
      setId(undefined); // Will be generated on submit for new items
      setMetricName('');
      setRating('');
      setReviewDate(null);
      setComments('');
      setReviewCycleId('');
      setReviewerId('');
      setGoalsSet('');
      setAchievements('');
      logModalAction({ action: 'OPEN', outcome: 'CREATE_MODE' });
    }
  }, [initialData, isOpen, logModalAction]);

  const handleSubmit = () => {
    if (!metricName || rating === '' || !reviewDate || !isValid(reviewDate)) {
      alert('Please fill in all required fields: Metric Name, Rating, and a valid Review Date.');
      logModalAction({ action: 'SUBMIT', outcome: 'FAIL', metadata: { error: 'Missing required fields' } });
      return;
    }

    const finalRating = parseFloat(String(rating));
    if (isNaN(finalRating)) {
        alert('Rating must be a valid number.');
        logModalAction({ action: 'SUBMIT', outcome: 'FAIL', metadata: { error: 'Invalid rating format' } });
        return;
    }

    const metricData: PerformanceMetric = {
      id: id || uuidv4(), // Generate new ID if not editing
      metricName,
      rating: finalRating,
      reviewDate: format(reviewDate as Date, 'yyyy-MM-dd'), // reviewDate is validated to be non-null and valid
      comments: comments || undefined, // Optional fields become undefined if empty
      reviewCycleId: reviewCycleId || undefined,
      reviewerId: reviewerId || undefined,
      goalsSet: goalsSet || undefined,
      achievements: achievements || undefined,
    };
    onSubmit(metricData);
    logModalAction({ action: 'SUBMIT', outcome: 'SUCCESS', metadata: { submittedData: metricData } });
    onClose(); 
  };

  const handleClose = () => {
    logModalAction({ action: 'CLOSE', outcome: 'CANCELLED' });
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} aria-labelledby="performance-metric-dialog-title" maxWidth="sm" fullWidth>
      <LocalizationProvider dateAdapter={AdapterDateFnsV3}>
        <DialogTitle id="performance-metric-dialog-title">
          {initialData?.id ? 'Edit Performance Metric' : 'Add Performance Metric'}
        </DialogTitle>
        <DialogContent sx={{ paddingTop: '16px !important' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Metric Name"
                fullWidth
                value={metricName}
                onChange={(e) => setMetricName(e.target.value)}
                required
                margin="dense"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Rating"
                fullWidth
                type="number"
                value={rating}
                onChange={(e) => setRating(e.target.value === '' ? '' : parseFloat(e.target.value))}
                required
                margin="dense"
                inputProps={{ step: "0.1" }} // Optional: for decimal ratings
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Review Date"
                value={reviewDate}
                onChange={(newValue) => setReviewDate(newValue)}
                slotProps={{ textField: { 
                  fullWidth: true, 
                  margin: "dense", 
                  required: true,
                  helperText: " ",
                } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Comments (Optional)"
                fullWidth
                multiline
                rows={3}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                margin="dense"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Review Cycle ID (Optional)"
                fullWidth
                value={reviewCycleId}
                onChange={(e) => setReviewCycleId(e.target.value)}
                margin="dense"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Reviewer ID (Optional)"
                fullWidth
                value={reviewerId}
                onChange={(e) => setReviewerId(e.target.value)}
                margin="dense"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Goals Set (Optional)"
                fullWidth
                multiline
                rows={2}
                value={goalsSet}
                onChange={(e) => setGoalsSet(e.target.value)}
                margin="dense"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Achievements (Optional)"
                fullWidth
                multiline
                rows={2}
                value={achievements}
                onChange={(e) => setAchievements(e.target.value)}
                margin="dense"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} color="primary">
            {initialData?.id ? 'Save Changes' : 'Add Metric'}
          </Button>
        </DialogActions>
      </LocalizationProvider>
    </Dialog>
  );
};

export default PerformanceMetricModal;
