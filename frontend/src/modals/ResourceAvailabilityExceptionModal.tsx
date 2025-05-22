import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Grid, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useModal } from '../contexts/ModalContext';

// As per TRD Sec 3.2.1 (Resources collection, availability.exceptions)
export const AvailabilityExceptionTypes = ["Vacation", "Public Holiday", "Training", "Unavailable", "Other"] as const;
export type AvailabilityExceptionType = typeof AvailabilityExceptionTypes[number];

export interface ResourceAvailabilityExceptionData {
  id?: string; // For editing
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  type: AvailabilityExceptionType;
  description?: string;
  hoursUnavailable?: number; // Optional, for partial day
}

export interface ResourceAvailabilityExceptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ResourceAvailabilityExceptionData) => void;
  initialData?: ResourceAvailabilityExceptionData;
  resourceId?: string; // For logging context
}

const ResourceAvailabilityExceptionModal: React.FC<ResourceAvailabilityExceptionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  resourceId,
}) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [type, setType] = useState<AvailabilityExceptionType>('Vacation');
  const [description, setDescription] = useState('');
  const [hoursUnavailable, setHoursUnavailable] = useState<string>(''); // Store as string for TextField

  const { logModalAction } = useModal();

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setStartDate(initialData.startDate || '');
        setEndDate(initialData.endDate || '');
        setType(initialData.type || 'Vacation');
        setDescription(initialData.description || '');
        setHoursUnavailable(initialData.hoursUnavailable?.toString() || '');
      } else {
        // Reset form
        setStartDate('');
        setEndDate('');
        setType('Vacation');
        setDescription('');
        setHoursUnavailable('');
      }
    }
  }, [initialData, isOpen]);

  const handleSubmit = () => {
    if (!startDate || !endDate || !type) {
      alert('Please fill in all required fields: Start Date, End Date, and Type.');
      logModalAction({ action: 'SUBMIT_FAIL', outcome: 'Validation Error', errorDetails: 'Required fields missing for availability exception' });
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
        alert('Start Date cannot be after End Date.');
        logModalAction({ action: 'SUBMIT_FAIL', outcome: 'Validation Error', errorDetails: 'Start Date after End Date' });
        return;
    }

    const hours = hoursUnavailable ? parseFloat(hoursUnavailable) : undefined;
    if (hoursUnavailable && (isNaN(hours!) || hours! <= 0 || hours! > 24)) {
        alert('Hours Unavailable must be a positive number, not exceeding 24.');
        logModalAction({ action: 'SUBMIT_FAIL', outcome: 'Validation Error', errorDetails: 'Invalid hoursUnavailable value' });
        return;
    }

    onSubmit({
      ...(initialData?.id && { id: initialData.id }),
      startDate,
      endDate,
      type,
      description: description || undefined,
      hoursUnavailable: hours,
    });
    logModalAction({ action: 'SUBMIT_SUCCESS', outcome: 'Availability Exception Added/Updated' });
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} aria-labelledby="resource-availability-exception-dialog-title" maxWidth="sm" fullWidth>
      <DialogTitle id="resource-availability-exception-dialog-title">
        {initialData?.id ? 'Edit Availability Exception' : 'Add Availability Exception'}
      </DialogTitle>
      <DialogContent sx={{ paddingTop: '16px !important' }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Start Date"
              type="date"
              fullWidth
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              InputLabelProps={{ shrink: true }}
              margin="dense"
              // TODO: Consider replacing with @mui/x-date-pickers
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="End Date"
              type="date"
              fullWidth
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
              InputLabelProps={{ shrink: true }}
              margin="dense"
              // TODO: Consider replacing with @mui/x-date-pickers
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth margin="dense" required>
              <InputLabel id="exception-type-label">Type</InputLabel>
              <Select
                labelId="exception-type-label"
                value={type}
                label="Type"
                onChange={(e) => setType(e.target.value as AvailabilityExceptionType)}
              >
                {AvailabilityExceptionTypes.map((exceptionType) => (
                  <MenuItem key={exceptionType} value={exceptionType}>
                    {exceptionType}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Description (Optional)"
              fullWidth
              multiline
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              margin="dense"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Hours Unavailable (Optional, for partial day)"
              type="number"
              fullWidth
              value={hoursUnavailable}
              onChange={(e) => setHoursUnavailable(e.target.value)}
              InputProps={{ inputProps: { min: 0, step: "0.5" } }}
              margin="dense"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => { logModalAction({ action: 'CLOSE', outcome: 'CANCELLED' }); onClose(); }}>Cancel</Button>
        <Button onClick={handleSubmit} color="primary">
          {initialData?.id ? 'Save Changes' : 'Add Exception'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ResourceAvailabilityExceptionModal;
