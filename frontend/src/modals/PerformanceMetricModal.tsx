import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Grid } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFnsV3 } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { isValid, parseISO, format } from 'date-fns';
import { FormHistoricalPerformanceMetric } from '../features/resources/components/PerformanceFormSection'; // Adjust path as needed
import { useModalActionLogger } from '../hooks/useModalActionLogger';

interface PerformanceMetricModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (metric: FormHistoricalPerformanceMetric) => void;
  initialData?: FormHistoricalPerformanceMetric;
}

const PerformanceMetricModal: React.FC<PerformanceMetricModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [metricName, setMetricName] = useState('');
  const [value, setValue] = useState<string | number>('');
  const [dateRecorded, setDateRecorded] = useState<Date | null>(null);
  const [notes, setNotes] = useState('');
  const [id, setId] = useState<string | undefined>(undefined);

  const { logModalAction } = useModalActionLogger('performanceMetricModal');

  useEffect(() => {
    if (initialData) {
      setId(initialData.id);
      setMetricName(initialData.metricName || '');
      setValue(initialData.value || '');
      setDateRecorded(initialData.dateRecorded && isValid(parseISO(initialData.dateRecorded)) ? parseISO(initialData.dateRecorded) : null);
      setNotes(initialData.notes || '');
      logModalAction({ action: 'OPEN', outcome: 'EDIT_MODE', metadata: { initialData } });
    } else {
      setId(undefined);
      setMetricName('');
      setValue('');
      setDateRecorded(null);
      setNotes('');
      logModalAction({ action: 'OPEN', outcome: 'CREATE_MODE' });
    }
  }, [initialData, isOpen, logModalAction]);

  const handleSubmit = () => {
    if (!metricName || value === '' || !dateRecorded || !isValid(dateRecorded)) {
      alert('Please fill in all required fields: Metric Name, Value, and a valid Date Recorded.');
      logModalAction({ action: 'SUBMIT', outcome: 'FAIL', metadata: { error: 'Missing required fields' } });
      return;
    }

    const metricData: FormHistoricalPerformanceMetric = {
      id,
      metricName,
      value,
      dateRecorded: format(dateRecorded, 'yyyy-MM-dd\'T\'HH:mm:ss.SSSxxx'), // ISO 8601 format
      notes,
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
                label="Value"
                fullWidth
                value={value}
                onChange={(e) => setValue(e.target.value)} // Store as string, can be parsed later if numeric type needed
                required
                margin="dense"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Date Recorded"
                value={dateRecorded}
                onChange={(newValue) => setDateRecorded(newValue)}
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
                label="Notes (Optional)"
                fullWidth
                multiline
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
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
