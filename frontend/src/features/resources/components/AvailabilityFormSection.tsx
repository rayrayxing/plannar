import React from 'react';
import {
  Box, Typography, Grid, Paper, Select, MenuItem, InputLabel, FormControl, Button, TextField, Checkbox, FormGroup, FormControlLabel, IconButton, List, ListItem, ListItemText, ListItemSecondaryAction
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Availability, WorkHours, DayWorkHours, ExceptionEntry, ExceptionEntryType, WorkArrangementType } from '../../../types/resource.types';
import { useModal } from '../../../contexts/ModalContext';

interface AvailabilityFormSectionProps {
  availability: Availability;
  setAvailability: React.Dispatch<React.SetStateAction<Availability>>;
}

const daysOfWeek: (keyof WorkHours)[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

const AvailabilityFormSection: React.FC<AvailabilityFormSectionProps> = ({ availability, setAvailability }) => {
  const { workArrangement, workHours, timeZone, exceptions } = availability; // workArrangement is now WorkArrangementType (string)

  const { openModal } = useModal();

  const handleWorkArrangementTypeChange = (event: any) => {
    const newWorkArrangementType = event.target.value as WorkArrangementType;
    let updatedWorkHours: WorkHours | undefined = availability.workHours; // Keep existing hours by default

    if (newWorkArrangementType === 'full-time') {
      updatedWorkHours = {
        monday: { active: true, start: '09:00', end: '17:00' },
        tuesday: { active: true, start: '09:00', end: '17:00' },
        wednesday: { active: true, start: '09:00', end: '17:00' },
        thursday: { active: true, start: '09:00', end: '17:00' },
        friday: { active: true, start: '09:00', end: '17:00' },
        saturday: { active: false },
        sunday: { active: false },
      };
    } else if (newWorkArrangementType === 'part-time') {
      updatedWorkHours = {
        monday: { active: false }, tuesday: { active: false }, wednesday: { active: false },
        thursday: { active: false }, friday: { active: false }, saturday: { active: false }, sunday: { active: false },
      };
    } else if (newWorkArrangementType === 'contractor' || newWorkArrangementType === 'intern') {
      updatedWorkHours = undefined;
    }

    setAvailability({
      ...availability,
      workArrangement: newWorkArrangementType,
      workHours: updatedWorkHours,
    });
  };

  const handleDayHoursChange = (day: keyof WorkHours, field: keyof DayWorkHours, value: any) => {
    setAvailability(prev => {
      // Ensure workHours is initialized if it's undefined
      const currentWorkHours = prev.workHours || {
        monday: { active: false }, tuesday: { active: false }, wednesday: { active: false },
        thursday: { active: false }, friday: { active: false }, saturday: { active: false }, sunday: { active: false },
      };
      return {
        ...prev,
        workHours: {
          ...currentWorkHours,
          [day]: {
            ...(currentWorkHours[day] || { active: false }), // Ensure day object exists
            [field]: value,
          },
        },
      };
    });
  };

  const handleAddException = () => { // Renamed
    openModal<'resourceAvailabilityException'>({
      modalType: 'resourceAvailabilityException',
      modalProps: {
        onSubmit: (newEntry: ExceptionEntry) => { // newEntry is ExceptionEntry
          setAvailability(prev => ({ ...prev, exceptions: [...(prev.exceptions || []), newEntry] }));
        },
      }
    });
  };

  const handleEditException = (index: number) => { // Renamed
    const entryToEdit = exceptions[index]; // Changed from timeOff
    openModal<'resourceAvailabilityException'>({
      modalType: 'resourceAvailabilityException',
      modalProps: {
        initialData: entryToEdit,
        onSubmit: (updatedEntry: ExceptionEntry) => { // Added type
          const updatedList = [...(exceptions || [])]; // Ensure exceptions is an array
          updatedList[index] = updatedEntry;
          setAvailability(prev => ({ ...prev, exceptions: updatedList }));
        },
      }
    });
  };
  const handleRemoveException = (index: number) => { // Renamed
    setAvailability(prev => ({ ...prev, exceptions: (prev.exceptions || []).filter((_, i) => i !== index) }));
  };

  return (
    <Paper elevation={2} className="p-4 mb-6">
      <Typography variant="h6" className="mb-4">Availability</Typography>

      {/* Work Arrangement Section */}
      <Typography variant="subtitle1" className="mt-4 mb-2">Work Arrangement</Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth size="small">
            <InputLabel id="work-arrangement-type-label">Arrangement Type</InputLabel>
            <Select
              labelId="work-arrangement-type-label"
              label="Arrangement Type"
              value={workArrangement} // Changed from workArrangement.type
              onChange={handleWorkArrangementTypeChange} // This handler will be updated later
            >
              <MenuItem value="full-time">Full-time</MenuItem>
              <MenuItem value="part-time">Part-time</MenuItem>
              <MenuItem value="contractor">Contractor</MenuItem> {/* Changed from contract */}
              <MenuItem value="intern">Intern</MenuItem> {/* New value */}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={8}>
          <TextField
            label="Time Zone"
            value={timeZone || ''}
            onChange={(e) => setAvailability({ ...availability, timeZone: e.target.value })}
            fullWidth
            size="small"
            helperText="e.g., America/New_York, Europe/London, UTC"
          />
        </Grid>
      </Grid>

      {workHours && (
        <Box className="mt-4 p-3 border rounded">
          <Typography variant="subtitle2" className="mb-2">Custom Standard Hours</Typography>
          {daysOfWeek.map(day => (
            <Grid container spacing={1} alignItems="center" key={day} className="mb-1">
              <Grid item xs={2}> {/* Checkbox + Label */}
                <FormControlLabel
                  control={<Checkbox 
                    checked={workHours?.[day]?.active || false}
                    onChange={(e) => handleDayHoursChange(day, 'active', e.target.checked)}
                    size="small"
                  />}
                  label={day.charAt(0).toUpperCase() + day.slice(1)}
                  className="text-sm"
                />
              </Grid>
              <Grid item xs={4}> {/* Start Time */}
                <TextField 
                  label="Start Time"
                  type="time"
                  value={workHours?.[day]?.start || ''}
                  onChange={(e) => handleDayHoursChange(day, 'start', e.target.value)}
                  disabled={!workHours?.[day]?.active}
                  fullWidth 
                  size="small"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={4}> {/* End Time */}
                <TextField 
                  label="End Time"
                  type="time"
                  value={workHours?.[day]?.end || ''}
                  onChange={(e) => handleDayHoursChange(day, 'end', e.target.value)}
                  disabled={!workHours?.[day]?.active}
                  fullWidth 
                  size="small"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              {/* Grid item xs={2} for "Hours" TextField removed */}
            </Grid>
          ))}
        </Box>
      )}

      {/* Time Off Section - Title and Add Button */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 4, mb: 2 }}>
        <Typography variant="subtitle1">Time Off / Availability Exceptions</Typography>
        <Button 
          variant="outlined" 
          onClick={handleAddException} // Changed handler
          startIcon={<AddCircleOutlineIcon />}
        >
          Add Exception {/* Changed text */}
        </Button>
      </Box>
      {(exceptions || []).length > 0 && (
        <List dense sx={{ mt: 1 }}>
          {(exceptions || []).map((entry, index) => (
            <ListItem 
              key={entry.id || `exception-${index}`}
              className="mb-1 border rounded"
              secondaryAction={
                <Box>
                  <IconButton edge="end" aria-label="edit" onClick={() => handleEditException(index)} size="small" sx={{ mr: 0.5 }}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveException(index)} size="small">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              }
            >
              <ListItemText 
                primary={`${entry.type.charAt(0).toUpperCase() + entry.type.slice(1)}: ${entry.startDate} to ${entry.endDate}`}
                secondary={entry.description || 'No description'}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
};

export default AvailabilityFormSection;
