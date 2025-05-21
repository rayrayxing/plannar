import React, { useState, useEffect, useCallback } from 'react'; // Added useCallback
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Typography,
  CircularProgress,
  Alert,
  SelectChangeEvent
} from '@mui/material';
import { Project, Task } from '../../../../functions/src/types/project.types'; // Adjusted path
import { Resource } from '../../../../functions/src/types/resource.types'; // Adjusted path
import { AssignResourcePayload, Assignment } from '../../../../functions/src/types/schedule.types'; // Adjusted path

// Base API URL - should ideally come from config
const API_BASE_URL = '/api'; // Assuming functions are served under /api

interface AssignmentFormProps {
  onAssignmentSuccess?: (assignment: Assignment) => void; // Callback on successful assignment
}

const AssignmentForm: React.FC<AssignmentFormProps> = ({ onAssignmentSuccess }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);

  const [selectedProject, setSelectedProject] = useState<string>('');
  const [selectedTask, setSelectedTask] = useState<string>('');
  const [selectedResource, setSelectedResource] = useState<string>('');
  const [startDate, setStartDate] = useState<string>(''); // YYYY-MM-DD
  const [endDate, setEndDate] = useState<string>('');     // YYYY-MM-DD
  const [estimatedHours, setEstimatedHours] = useState<string>('');

  const [loadingProjects, setLoadingProjects] = useState<boolean>(false);
  const [loadingTasks, setLoadingTasks] = useState<boolean>(false);
  const [loadingResources, setLoadingResources] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch projects on component mount
  useEffect(() => {
    const fetchProjects = async () => {
      setLoadingProjects(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/projects`);
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: response.statusText }));
          throw new Error(errorData.message || `Failed to fetch projects: ${response.status}`);
        }
        const data: Project[] = await response.json();
        setProjects(data);
      } catch (err: any) {
        setError(err.message);
        setProjects([]); // Clear projects on error
      } finally {
        setLoadingProjects(false);
      }
    };
    fetchProjects();
  }, []);

  // Fetch tasks when a project is selected
  useEffect(() => {
    if (!selectedProject) {
      setTasks([]);
      setSelectedTask('');
      return;
    }

    const fetchTasks = async () => {
      setLoadingTasks(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/projects/${selectedProject}/tasks`);
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: response.statusText }));
          throw new Error(errorData.message || `Failed to fetch tasks for project ${selectedProject}: ${response.status}`);
        }
        const data: Task[] = await response.json();
        setTasks(data);
      } catch (err: any) {
        setError(err.message);
        setTasks([]); // Clear tasks on error
      } finally {
        setLoadingTasks(false);
      }
    };

    fetchTasks();
  }, [selectedProject]);

  // Fetch resources on component mount
  useEffect(() => {
    const fetchResources = async () => {
      setLoadingResources(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/resources`);
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: response.statusText }));
          throw new Error(errorData.message || `Failed to fetch resources: ${response.status}`);
        }
        const data: Resource[] = await response.json();
        setResources(data);
      } catch (err: any) {
        setError(err.message);
        setResources([]); // Clear resources on error
      } finally {
        setLoadingResources(false);
      }
    };
    fetchResources();
  }, []);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    if (!selectedProject || !selectedTask || !selectedResource || !startDate || !endDate || !estimatedHours) {
      setError('All fields are required.');
      setIsSubmitting(false);
      return;
    }

    // Convert YYYY-MM-DD to ISO string with time for backend compatibility if needed
    // For now, assuming backend handles YYYY-MM-DD if passed, or expects full ISO string.
    // The backend `assignResourceToTaskLogic` expects ISO strings for startDate and endDate.
    // Let's ensure they are full ISO strings, assuming start of day for startDate and end of day for endDate.
    const finalStartDate = startDate.includes('T') ? startDate : `${startDate}T00:00:00.000Z`;
    const finalEndDate = endDate.includes('T') ? endDate : `${endDate}T23:59:59.999Z`;

    const assignmentPayload: AssignResourcePayload = {
      projectId: selectedProject,
      taskId: selectedTask,
      resourceId: selectedResource,
      startDate: finalStartDate,
      endDate: finalEndDate,
      allocatedHours: parseInt(estimatedHours, 10),
    };

    try {
      const response = await fetch(`${API_BASE_URL}/schedules/assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assignmentPayload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred during assignment.' }));
        // Firebase functions often return error in { error: { message: '...', details: '...' } } or { error: 'message' }
        const errorMessage = errorData.error?.message || errorData.error || errorData.message || `Failed to create assignment: ${response.status}`;
        throw new Error(errorMessage);
      }

      const result: Assignment = await response.json();
      setSuccessMessage(`Assignment created successfully! (ID: ${result.assignmentId})`);
      if (onAssignmentSuccess) {
        onAssignmentSuccess(result);
      }
      // Optionally reset form fields here
      // setSelectedProject('');
      // setSelectedTask('');
      // setSelectedResource('');
      // setStartDate('');
      // setEndDate('');
      // setEstimatedHours('');

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, p: 2, border: '1px solid #ccc', borderRadius: '4px' }}>
      <Typography variant="h6" gutterBottom>Assign Resource to Task</Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}

      <FormControl fullWidth margin="normal" required>
        <InputLabel id="project-select-label">Project</InputLabel>
        <Select
          labelId="project-select-label"
          value={selectedProject}
          label="Project"
          onChange={(e: SelectChangeEvent) => setSelectedProject(e.target.value)}
          disabled={loadingProjects}
        >
          {loadingProjects && <MenuItem value=""><CircularProgress size={20} /> Loading...</MenuItem>}
          {projects.map((project) => (
            <MenuItem key={project.id} value={project.id}>{project.name}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal" required disabled={!selectedProject || loadingTasks}>
        <InputLabel id="task-select-label">Task</InputLabel>
        <Select
          labelId="task-select-label"
          value={selectedTask}
          label="Task"
          onChange={(e: SelectChangeEvent) => setSelectedTask(e.target.value)}
        >
          {loadingTasks && <MenuItem value=""><CircularProgress size={20} /> Loading...</MenuItem>}
          {tasks.map((task) => (
            <MenuItem key={task.id} value={task.id}>{task.name}</MenuItem>
          ))}
          {!loadingTasks && tasks.length === 0 && selectedProject && <MenuItem value="" disabled>No tasks found for this project.</MenuItem>}
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal" required>
        <InputLabel id="resource-select-label">Resource</InputLabel>
        <Select
          labelId="resource-select-label"
          value={selectedResource}
          label="Resource"
          onChange={(e: SelectChangeEvent) => setSelectedResource(e.target.value)}
          disabled={loadingResources}
        >
          {loadingResources && <MenuItem value=""><CircularProgress size={20} /> Loading...</MenuItem>}
          {resources.map((resource) => (
            <MenuItem key={resource.id} value={resource.id}>{resource.name}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        label="Start Date"
        type="date"
        fullWidth
        margin="normal"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        InputLabelProps={{ shrink: true }}
        required
      />

      <TextField
        label="End Date"
        type="date"
        fullWidth
        margin="normal"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        InputLabelProps={{ shrink: true }}
        required
      />

      <TextField
        label="Estimated Hours"
        type="number"
        fullWidth
        margin="normal"
        value={estimatedHours}
        onChange={(e) => setEstimatedHours(e.target.value)}
        required
      />

      <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
        Assign Resource
      </Button>
    </Box>
  );
};

export default AssignmentForm;
