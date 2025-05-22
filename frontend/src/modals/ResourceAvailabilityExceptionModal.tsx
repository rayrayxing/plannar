import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Grid, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFnsV3 } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { isValid, parseISO, format, isAfter } from 'date-fns'; // Added isAfter
import { useModal } from '../contexts/ModalContext';
import { ExceptionEntry, ExceptionEntryType } from '../../types/resource.types';

// As per TRD Sec 3.2.1 (Resources collection, availability.exceptions)
// export const AvailabilityExceptionTypes = ["Vacation", "Public Holiday", "Training", "Unavailable", "Other"] as const; // Removed
// export type AvailabilityExceptionType = typeof AvailabilityExceptionTypes[number]; // Removed

// export interface ResourceAvailabilityExceptionData { // Removed, using ExceptionEntry directly
//   id?: string; // For editing
//   startDate: string; // YYYY-MM-DD
//   endDate: string; // YYYY-MM-DD
//   type: ExceptionEntryType;
//   description?: string;
// }

export interface ResourceAvailabilityExceptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ExceptionEntry) => void;
  initialData?: ExceptionEntry;
  resourceId?: string; // For logging context
}

const ResourceAvailabilityExceptionModal: React.FC<ResourceAvailabilityExceptionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  resourceId,
}) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [type, setType] = useState<ExceptionEntryType>('vacation'); // Changed type and default
  const [description, setDescription] = useState('');

  const { logModalAction } = useModal();

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setStartDate(initialData.startDate && isValid(parseISO(initialData.startDate)) ? parseISO(initialData.startDate) : null);
        setEndDate(initialData.endDate && isValid(parseISO(initialData.endDate)) ? parseISO(initialData.endDate) : null);
        setType(initialData.type || 'vacation'); // Changed default
        setDescription(initialData.description || '');
        // setHoursUnavailable(initialData.hoursUnavailable?.toString() || ''); // Removed
      } else {
        // Reset form
        setStartDate(null);
        setEndDate(null);
        setType('vacation'); // Changed default
        setDescription('');
        // setHoursUnavailable(''); // Removed
      }
    }
  }, [initialData, isOpen]);

  const handleSubmit = () => {
    if (!startDate || !endDate || !type) {
      alert('Please fill in all required fields: Start Date, End Date, and Type.');
      logModalAction({ action: 'SUBMIT_FAIL', outcome: 'Validation Error', errorDetails: 'Required fields missing for availability exception' });
      return;
    }
    if (startDate && endDate && isAfter(startDate, endDate)) {
        alert('Start Date cannot be after End Date.');
        logModalAction({ action: 'SUBMIT_FAIL', outcome: 'Validation Error', errorDetails: 'Start Date after End Date' });
        return;
    }

    // const hours = hoursUnavailable ? parseFloat(hoursUnavailable) : undefined; // Removed
    // if (hoursUnavailable && (isNaN(hours!) || hours! <= 0 || hours! > 24)) { // Removed
    //     alert('Hours Unavailable must be a positive number, not exceeding 24.'); // Removed
    //     logModalAction({ action: 'SUBMIT_FAIL', outcome: 'Validation Error', errorDetails: 'Invalid hoursUnavailable value' }); // Removed
    //     return; // Removed
    // } // Removed

    onSubmit({
      ...(initialData?.id && { id: initialData.id }),
      startDate: format(startDate!, 'yyyy-MM-dd'), // startDate is non-null here due to validation
      endDate: format(endDate!, 'yyyy-MM-dd'),   // endDate is non-null here due to validation
      type,
      description: description || undefined,
      // hoursUnavailable: hours, // Removed
    });
    logModalAction({ action: 'SUBMIT_SUCCESS', outcome: 'Availability Exception Added/Updated' });
    onClose();
  };

  const exceptionTypeOptions: { value: ExceptionEntryType; label: string }[] = [
    { value: 'vacation', label: 'Vacation' },
    { value: 'sick-leave', label: 'Sick Leave' },
    { value: 'public-holiday', label: 'Public Holiday' },
    { value: 'other', label: 'Other' },
  ];


  return (
    <Dialog open={isOpen} onClose={onClose} aria-labelledby="resource-availability-exception-dialog-title" maxWidth="sm" fullWidth>
      <LocalizationProvider dateAdapter={AdapterDateFnsV3}>
        <DialogTitle id="resource-availability-exception-dialog-title">
          {initialData?.id ? 'Edit Availability Exception' : 'Add Availability Exception'}
        </DialogTitle>
        <DialogContent sx={{ paddingTop: '16px !important' }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
                slotProps={{ textField: { 
                  fullWidth: true, 
                  margin: "dense", 
                  required: true,
                  helperText: " ",
                } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="End Date"
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
                slotProps={{ textField: { 
                  fullWidth: true, 
                  margin: "dense", 
                  required: true,
                  helperText: " ",
                } }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth margin="dense" required>
                <InputLabel id="exception-type-label">Type</InputLabel>
                <Select
                  labelId="exception-type-label"
                  value={type}
                  label="Type"
                  onChange={(e) => setType(e.target.value as ExceptionEntryType)}
                >
                  {exceptionTypeOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
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
            {/* <Grid item xs={12} sm={6}> // Removed hoursUnavailable field
              <TextField
                label="Hours Unavailable (Optional, for partial day)"
                type="number"
                fullWidth
                value={hoursUnavailable}
                onChange={(e) => setHoursUnavailable(e.target.value)}
                InputProps={{ inputProps: { min: 0, step: "0.5" } }}
                margin="dense"
              />
            </Grid> */}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { logModalAction({ action: 'CLOSE', outcome: 'CANCELLED' }); onClose(); }}>Cancel</Button>
          <Button onClick={handleSubmit} color="primary">
            {initialData?.id ? 'Save Changes' : 'Add Exception'}
          </Button>
        </DialogActions>
      </LocalizationProvider>
    </Dialog>
  );
};

export default ResourceAvailabilityExceptionModal;
