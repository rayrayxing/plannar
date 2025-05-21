import React, { useEffect, useState } from 'react';
import { Container, Paper, Typography, CircularProgress, Alert, Box, Button, Divider } from '@mui/material';
// import { useParams, Link as RouterLink } from 'react-router-dom'; // Uncomment when routing is set up
import { Project } from '../../types/project.types'; // Adjusted path
// import projectsApi from '../../services/projectsApi'; // Uncomment when API service is ready

// Mock API call
const mockFetchProjectById = (id: string): Promise<Project | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (id === '1') {
        resolve({
          id: '1',
          name: 'Project Alpha',
          description: 'This is the detailed description for Project Alpha. It involves several key phases and deliverables, focusing on market analysis and product development.',
          startDate: '2024-01-01T00:00:00.000Z',
          endDate: '2024-06-30T00:00:00.000Z',
          status: 'Active',
          tasks: [
            { id: 'task1', name: 'Market Analysis', status: 'Completed', description: 'Analyze target market' },
            { id: 'task2', name: 'Product Design', status: 'In Progress', description: 'Design core product features' },
          ],
          auditLog: [
            { timestamp: new Date(Date.now() - 100000000), user: 'admin', action: 'Project Created', details: { name: 'Project Alpha' } },
            { timestamp: new Date(), user: 'manager', action: 'Status Updated', details: { old: 'Planning', new: 'Active' } },
          ],
          createdAt: new Date(Date.now() - 200000000),
          updatedAt: new Date(),
        });
      } else {
        resolve(null);
      }
    }, 500);
  });
};

const ProjectDetailPage: React.FC = () => {
  // const { projectId } = useParams<{ projectId: string }>(); // Real usage with react-router-dom
  const projectId = '1'; // Hardcoded for now, replace with useParams

  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId) {
      setError('Project ID is missing.');
      setIsLoading(false);
      return;
    }

    const fetchProject = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // const fetchedProject = await projectsApi.getProjectById(projectId); // Real API call
        const fetchedProject = await mockFetchProjectById(projectId); // Mock API call
        if (fetchedProject) {
          setProject(fetchedProject);
        } else {
          setError('Project not found.');
        }
      } catch (err) {
        console.error(`Failed to fetch project ${projectId}:`, err);
        setError('Failed to load project details. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  if (isLoading) {
    return <Container sx={{ textAlign: 'center', mt: 4 }}><CircularProgress /></Container>;
  }

  if (error) {
    return <Container><Alert severity="error" sx={{ mt: 2 }}>{error}</Alert></Container>;
  }

  if (!project) {
    return <Container><Alert severity="info" sx={{ mt: 2 }}>Project data is not available.</Alert></Container>;
  }

  return (
    <Container maxWidth="lg">
      <Paper sx={{ p: 3, mt: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" component="h1">
            {project.name}
          </Typography>
          <Button 
            variant="contained" 
            // component={RouterLink} 
            // to={`/projects/edit/${project.id}`}
            onClick={() => alert(`Edit project ${project.id}`)} // Placeholder
          >
            Edit Project
          </Button>
        </Box>
        
        <Typography variant="subtitle1" color="textSecondary" gutterBottom>
          Status: {project.status}
        </Typography>
        <Typography variant="body1" paragraph>
          <strong>Description:</strong> {project.description || 'N/A'}
        </Typography>
        <Typography variant="body2">
          <strong>Start Date:</strong> {new Date(project.startDate).toLocaleDateString()}
        </Typography>
        <Typography variant="body2" gutterBottom>
          <strong>End Date:</strong> {new Date(project.endDate).toLocaleDateString()}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h5" component="h2" gutterBottom>
          Tasks
        </Typography>
        {project.tasks && project.tasks.length > 0 ? (
          project.tasks.map(task => (
            <Box key={task.id} sx={{ mb: 1, p:1, border: '1px solid #eee', borderRadius: 1}}>
              <Typography variant="subtitle1">{task.name} ({task.status})</Typography>
              {task.description && <Typography variant="body2" color="textSecondary">{task.description}</Typography>}
            </Box>
          ))
        ) : (
          <Typography>No tasks defined for this project yet.</Typography>
        )}
        {/* TODO: Button to add/manage tasks */}

        <Divider sx={{ my: 2 }} />

        <Typography variant="h5" component="h2" gutterBottom>
          Audit Log
        </Typography>
        {project.auditLog && project.auditLog.length > 0 ? (
          project.auditLog.map((log, index) => (
            <Box key={index} sx={{ mb: 1, fontSize: '0.9rem'}}>
              <Typography variant="caption">
                {new Date(log.timestamp).toLocaleString()} - {log.user} - {log.action}
              </Typography>
              {log.details && <Typography variant="caption" display="block">Details: {JSON.stringify(log.details)}</Typography>}
            </Box>
          ))
        ) : (
          <Typography>No audit history for this project.</Typography>
        )}

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-start' }}>
          <Button 
            variant="outlined" 
            // component={RouterLink} 
            // to="/projects"
            onClick={() => alert('Navigate to project list')} // Placeholder
          >
            Back to Projects List
          </Button>
        </Box>

      </Paper>
    </Container>
  );
};

export default ProjectDetailPage;
