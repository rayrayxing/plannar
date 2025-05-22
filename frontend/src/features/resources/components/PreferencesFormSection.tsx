import React from 'react';
import { TextField, Grid, Paper, Typography, Select, MenuItem, InputLabel, FormControl, Chip, Box } from '@mui/material';
import { ResourcePreferences } from '../../../types/resource.types';

interface PreferencesFormSectionProps {
  preferences: ResourcePreferences;
  onPreferencesChange: (newPreferences: ResourcePreferences) => void;
}

const PreferencesFormSection: React.FC<PreferencesFormSectionProps> = ({ preferences, onPreferencesChange }) => {

  const handleChange = (field: keyof ResourcePreferences, value: any) => {
    onPreferencesChange({ ...preferences, [field]: value });
  };

  // Helper for string array fields like preferredProjectTypes
  const handleProjectTypesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    const typesArray = value.split(',').map(type => type.trim()).filter(type => type);
    onPreferencesChange({ ...preferences, preferredProjectTypes: typesArray.length > 0 ? typesArray : undefined });
  };

  return (
    <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
        Work Preferences
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Preferred Project Types (comma-separated)"
            fullWidth
            value={preferences.preferredProjectTypes?.join(', ') || ''}
            onChange={handleProjectTypesChange}
            variant="outlined"
            size="small"
            helperText="e.g., Web Development, Mobile Apps, Data Analysis"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Preferred Work Hours"
            fullWidth
            value={preferences.preferredWorkHours || ''}
            onChange={(e) => handleChange('preferredWorkHours', e.target.value || undefined)}
            variant="outlined"
            size="small"
            helperText="e.g., Flexible, 9am-5pm, Early Bird"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Communication Style/Preferences"
            fullWidth
            value={preferences.communicationStyle || ''}
            onChange={(e) => handleChange('communicationStyle', e.target.value || undefined)}
            variant="outlined"
            size="small"
            helperText="e.g., Prefers Slack over Email, Daily stand-ups"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth size="small">
            <InputLabel id="work-location-label">Work Location Preference</InputLabel>
            <Select
              labelId="work-location-label"
              label="Work Location Preference"
              value={preferences.workLocation || ''}
              onChange={(e) => handleChange('workLocation', e.target.value || undefined)}
            >
              <MenuItem value=""><em>None Specified</em></MenuItem>
              <MenuItem value="remote">Remote</MenuItem>
              <MenuItem value="office">Office</MenuItem>
              <MenuItem value="hybrid">Hybrid</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth size="small">
            <InputLabel id="travel-preference-label">Travel Preference</InputLabel>
            <Select
              labelId="travel-preference-label"
              label="Travel Preference"
              value={preferences.travelPreference || ''}
              onChange={(e) => handleChange('travelPreference', e.target.value || undefined)}
            >
              <MenuItem value=""><em>None Specified</em></MenuItem>
              <MenuItem value="none">None</MenuItem>
              <MenuItem value="occasional">Occasional</MenuItem>
              <MenuItem value="frequent">Frequent</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Other Preference Notes"
            fullWidth
            multiline
            rows={3}
            value={preferences.otherNotes || ''}
            onChange={(e) => handleChange('otherNotes', e.target.value || undefined)}
            variant="outlined"
            size="small"
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default PreferencesFormSection;
