import React from 'react';
import {
  Box, Typography, Grid, Paper, Select, MenuItem, InputLabel, FormControl, Button, TextField, Checkbox, FormGroup, FormControlLabel, IconButton, List, ListItem, ListItemText, ListItemSecondaryAction
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Availability, WorkArrangement, TimeOffEntry, DayHours } from '../../../types/resource.types';
import { useModal } from '../../../contexts/ModalContext';

interface AvailabilityFormSectionProps {
  availability: Availability;
  setAvailability: React.Dispatch<React.SetStateAction<Availability>>;
}

const daysOfWeek: (keyof WorkArrangement['standardHours'])[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

const AvailabilityFormSection: React.FC<AvailabilityFormSectionProps> = ({ availability, setAvailability }) => {
  const { workArrangement, timeOff } = availability;

  const { openModal } = useModal();

  const handleWorkArrangementTypeChange = (event: any) => {
    const type = event.target.value as WorkArrangement['type'];
    let newStandardHours = workArrangement.standardHours || {};
    if (type === 'full-time') {
        newStandardHours = {
            monday: { active: true, startTime: '09:00', endTime: '17:00' },
            tuesday: { active: true, startTime: '09:00', endTime: '17:00' },
            wednesday: { active: true, startTime: '09:00', endTime: '17:00' },
            thursday: { active: true, startTime: '09:00', endTime: '17:00' },
            friday: { active: true, startTime: '09:00', endTime: '17:00' },
            saturday: { active: false },
            sunday: { active: false },
        };
    } else if (type === 'custom' && Object.keys(newStandardHours).length === 0) {
        // Initialize custom if not already set
        newStandardHours = {
            monday: { active: false }, tuesday: { active: false }, wednesday: { active: false },
            thursday: { active: false }, friday: { active: false }, saturday: { active: false }, sunday: { active: false },
        };
    }
    setAvailability({ 
        ...availability, 
        workArrangement: { ...workArrangement, type, standardHours: newStandardHours }
    });
  };

  const handleDayHoursChange = (day: keyof WorkArrangement['standardHours'], field: keyof DayHours, value: any) => {
    setAvailability({
      ...availability,
      workArrangement: {
        ...workArrangement,
        standardHours: {
          ...workArrangement.standardHours,
          [day]: {
            ...(workArrangement.standardHours?.[day] || { active: false }),
            [field]: value,
          },
        },
      },
    });
  };

  const handleAddTimeOff = () => {
    openModal<'resourceAvailabilityException'>({
      modalType: 'resourceAvailabilityException',
      modalProps: {
        onSubmit: (newEntry) => {
          setAvailability({ ...availability, timeOff: [...timeOff, newEntry] });
        },
      }
    });
  };

  const handleEditTimeOff = (index: number) => {
    const entryToEdit = timeOff[index];
    openModal<'resourceAvailabilityException'>({
      modalType: 'resourceAvailabilityException',
      modalProps: {
        initialData: entryToEdit,
        onSubmit: (updatedEntry) => {
          const updatedList = [...timeOff];
          updatedList[index] = updatedEntry;
          setAvailability({ ...availability, timeOff: updatedList });
        },
      }
    });
  };
  const handleRemoveTimeOff = (index: number) => {
    setAvailability({ ...availability, timeOff: timeOff.filter((_, i) => i !== index) });
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
              value={workArrangement.type}
              onChange={handleWorkArrangementTypeChange}
            >
              <MenuItem value="full-time">Full-time</MenuItem>
              <MenuItem value="part-time">Part-time</MenuItem>
              <MenuItem value="contract">Contract</MenuItem>
              <MenuItem value="temporary">Temporary</MenuItem>
              <MenuItem value="custom">Custom</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={8}>
            <TextField 
                label="Notes (e.g. timezone, specific preferences)"
                value={workArrangement.notes || ''}
                onChange={(e) => setAvailability({ ...availability, workArrangement: { ...workArrangement, notes: e.target.value }})}
                fullWidth
                multiline
                rows={1}
                size="small"
            />
        </Grid>
      </Grid>

      {workArrangement.type === 'custom' && (
        <Box className="mt-4 p-3 border rounded">
          <Typography variant="subtitle2" className="mb-2">Custom Standard Hours</Typography>
          {daysOfWeek.map(day => (
            <Grid container spacing={1} alignItems="center" key={day} className="mb-1">
              <Grid item xs={2}>
                <FormControlLabel
                  control={<Checkbox 
                    checked={workArrangement.standardHours?.[day]?.active || false}
                    onChange={(e) => handleDayHoursChange(day, 'active', e.target.checked)}
                    size="small"
                  />}
                  label={day.charAt(0).toUpperCase() + day.slice(1)}
                  className="text-sm"
                />
              </Grid>
              <Grid item xs={3}>
                <TextField 
                  label="Start Time"
                  type="time"
                  value={workArrangement.standardHours?.[day]?.startTime || ''}
                  onChange={(e) => handleDayHoursChange(day, 'startTime', e.target.value)}
                  disabled={!workArrangement.standardHours?.[day]?.active}
                  fullWidth 
                  size="small"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={3}>
                <TextField 
                  label="End Time"
                  type="time"
                  value={workArrangement.standardHours?.[day]?.endTime || ''}
                  onChange={(e) => handleDayHoursChange(day, 'endTime', e.target.value)}
                  disabled={!workArrangement.standardHours?.[day]?.active}
                  fullWidth 
                  size="small"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
               <Grid item xs={2}>
                <TextField 
                  label="Hours"
                  type="number"
                  value={workArrangement.standardHours?.[day]?.hours || ''}
                  onChange={(e) => handleDayHoursChange(day, 'hours', parseFloat(e.target.value))}
                  disabled={!workArrangement.standardHours?.[day]?.active}
                  fullWidth 
                  size="small"
                  InputProps={{ inputProps: { min: 0, step: 0.5 } }}
                />
              </Grid>
            </Grid>
          ))}
        </Box>
      )}

      {/* Time Off Section - Title and Add Button */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 4, mb: 2 }}>
        <Typography variant="subtitle1">Time Off / Availability Exceptions</Typography>
        <Button 
          variant="outlined" 
          onClick={handleAddTimeOff} 
          startIcon={<AddCircleOutlineIcon />}
        >
          Add Time Off
        </Button>
      </Box>
      {timeOff.length > 0 && (
        <List dense sx={{ mt: 1 }}>
          {timeOff.map((entry, index) => (
            <ListItem 
              key={entry.id || index}
              className="mb-1 border rounded"
              secondaryAction={
                <Box>
                  <IconButton edge="end" aria-label="edit" onClick={() => handleEditTimeOff(index)} size="small" sx={{ mr: 0.5 }}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveTimeOff(index)} size="small">
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
