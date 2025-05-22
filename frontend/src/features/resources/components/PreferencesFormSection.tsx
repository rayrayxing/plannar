import React from 'react';
import { TextField, Grid, Paper, Typography, Checkbox, FormControlLabel, FormControl, InputLabel, MenuItem, Select, Box, Chip } from '@mui/material'; // Added Checkbox, FormControlLabel, reordered for consistency
import { ResourcePreferences, NotificationPreferencesType } from '../../../types/resource.types';

interface PreferencesFormSectionProps {
  preferences: ResourcePreferences;
  onPreferencesChange: (newPreferences: ResourcePreferences) => void;
}

const PreferencesFormSection: React.FC<PreferencesFormSectionProps> = ({ preferences, onPreferencesChange }) => {

  const handleStringArrayChange = (field: 'preferredProjects' | 'preferredRoles' | 'developmentGoals', value: string) => {
    const itemsArray = value.split(',').map(item => item.trim()).filter(item => item);
    onPreferencesChange({ ...preferences, [field]: itemsArray.length > 0 ? itemsArray : undefined });
  };

  const handleNotificationChange = (field: keyof NotificationPreferencesType, checked: boolean) => {
    onPreferencesChange({
      ...preferences,
      notificationPreferences: {
        ...(preferences.notificationPreferences || {}), // Ensure notificationPreferences object exists
        [field]: checked,
      },
    });
  };

  return (
    <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
        Work Preferences
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Preferred Projects (comma-separated)"
            fullWidth
            value={preferences.preferredProjects?.join(', ') || ''}
            onChange={(e) => handleStringArrayChange('preferredProjects', e.target.value)}
            variant="outlined"
            size="small"
            helperText="e.g., Project Alpha, Internal Tools, Client X Integration"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Preferred Roles (comma-separated)"
            fullWidth
            value={preferences.preferredRoles?.join(', ') || ''}
            onChange={(e) => handleStringArrayChange('preferredRoles', e.target.value)}
            variant="outlined"
            size="small"
            helperText="e.g., Frontend Lead, Backend Developer, QA Engineer"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Development Goals (comma-separated)"
            fullWidth
            value={preferences.developmentGoals?.join(', ') || ''}
            onChange={(e) => handleStringArrayChange('developmentGoals', e.target.value)}
            variant="outlined"
            size="small"
            helperText="e.g., Learn Kubernetes, Improve public speaking, Master new JS framework"
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom sx={{ mt: 1, mb: 1 }}>
            Notification Preferences
          </Typography>
          <FormControl component="fieldset">
            <Grid container spacing={1}>
              <Grid item xs={12} sm={4}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={preferences.notificationPreferences?.email || false}
                      onChange={(e) => handleNotificationChange('email', e.target.checked)}
                      name="emailNotifications"
                    />
                  }
                  label="Email"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={preferences.notificationPreferences?.inApp || false}
                      onChange={(e) => handleNotificationChange('inApp', e.target.checked)}
                      name="inAppNotifications"
                    />
                  }
                  label="In-App"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={preferences.notificationPreferences?.sms || false}
                      onChange={(e) => handleNotificationChange('sms', e.target.checked)}
                      name="smsNotifications"
                    />
                  }
                  label="SMS"
                />
              </Grid>
            </Grid>
          </FormControl>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default PreferencesFormSection;
