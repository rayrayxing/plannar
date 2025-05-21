import React, { useState, useEffect } from 'react';
import { TextField, Button, Select, MenuItem, InputLabel, FormControl, Grid, Typography, Box } from '@mui/material';
import { Project, ProjectStatus, ProjectData } from '../../types/project.types'; // Adjusted path

interface ProjectFormProps {
  project?: Project; // For editing existing project
  onSubmit: (projectData: ProjectData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ project, onSubmit, onCancel, isLoading }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState<ProjectStatus>('Planning');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (project) {
      setName(project.name);
      setDescription(project.description || '');
      setStartDate(project.startDate.split('T')[0]); // Assuming ISO string, take date part
      setEndDate(project.endDate.split('T')[0]);     // Assuming ISO string, take date part
      setStatus(project.status);
    } else {
      // Default values for new project
      setName('');
      setDescription('');
      setStartDate('');
      setEndDate('');
      setStatus('Planning');
    }
  }, [project]);

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!name.trim()) newErrors.name = 'Project name is required.';
    if (!startDate) newErrors.startDate = 'Start date is required.';
    if (!endDate) newErrors.endDate = 'End date is required.';
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      newErrors.endDate = 'End date cannot be before start date.';
    }
    if (!status) newErrors.status = 'Status is required.'; // Should not happen with default

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (validate()) {
      const projectData: ProjectData = {
        name,
        description,
        startDate,
        endDate,
        status,
      };
      onSubmit(projectData);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
      <Typography variant="h6" gutterBottom>
        {project ? 'Edit Project' : 'Create New Project'}
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            name="name"
            required
            fullWidth
            id="name"
            label="Project Name"
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={!!errors.name}
            helperText={errors.name}
            disabled={isLoading}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="description"
            fullWidth
            id="description"
            label="Description"
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isLoading}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="startDate"
            required
            fullWidth
            id="startDate"
            label="Start Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            error={!!errors.startDate}
            helperText={errors.startDate}
            disabled={isLoading}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="endDate"
            required
            fullWidth
            id="endDate"
            label="End Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            error={!!errors.endDate}
            helperText={errors.endDate}
            disabled={isLoading}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth required error={!!errors.status} disabled={isLoading}>
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="status-label"
              id="status"
              value={status}
              label="Status"
              onChange={(e) => setStatus(e.target.value as ProjectStatus)}
            >
              {(Object.values(ProjectStatus) as Array<ProjectStatus>).map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </Select>
            {errors.status && <Typography color="error" variant="caption">{errors.status}</Typography>}
          </FormControl>
        </Grid>
      </Grid>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        <Button onClick={onCancel} sx={{ mr: 1 }} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" variant="contained" disabled={isLoading}>
          {isLoading ? 'Saving...' : (project ? 'Save Changes' : 'Create Project')}
        </Button>
      </Box>
    </Box>
  );
};

export default ProjectForm;
