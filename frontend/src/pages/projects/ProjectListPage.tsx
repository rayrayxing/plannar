import React, { useEffect, useState } from 'react';
import { Container, Paper, Typography, Button, List, ListItem, ListItemText, CircularProgress, Alert, Box } from '@mui/material';
// import { Link as RouterLink } from 'react-router-dom'; // Uncomment when routing is set up
import { Project } from '../../types/project.types'; // Adjusted path
// import projectsApi from '../../services/projectsApi'; // Uncomment when API service is ready

// Mock API call
const mockFetchProjects = (): Promise<Project[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: '1', name: 'Project Alpha', description: 'First project', startDate: '2024-01-01T00:00:00.000Z', endDate: '2024-06-30T00:00:00.000Z', status: 'Active', tasks: [], auditLog: [], createdAt: new Date(), updatedAt: new Date() },
        { id: '2', name: 'Project Beta', description: 'Second project', startDate: '2024-02-15T00:00:00.000Z', endDate: '2024-08-15T00:00:00.000Z', status: 'Planning', tasks: [], auditLog: [], createdAt: new Date(), updatedAt: new Date() },
      ]);
    }, 1000);
  });
};

const ProjectListPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // const fetchedProjects = await projectsApi.listProjects(); // Real API call
        const fetchedProjects = await mockFetchProjects(); // Mock API call
        setProjects(fetchedProjects);
      } catch (err) {
        console.error('Failed to fetch projects:', err);
        setError('Failed to load projects. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // const navigate = useNavigate(); // Uncomment when routing is set up
  const handleNavigateToCreateProject = () => {
    // navigate('/projects/create');
    alert('Simulating navigation to Create Project page.');
  };

  if (isLoading) {
    return <Container sx={{ textAlign: 'center', mt: 4 }}><CircularProgress /></Container>;
  }

  if (error) {
    return <Container><Alert severity="error" sx={{ mt: 2 }}>{error}</Alert></Container>;
  }

  return (
    <Container maxWidth="lg">
      <Paper sx={{ p: 3, mt: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" component="h1">
            Projects
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleNavigateToCreateProject}
            // component={RouterLink} // Uncomment with react-router-dom
            // to="/projects/create"   // Uncomment with react-router-dom
          >
            Create New Project
          </Button>
        </Box>

        {projects.length === 0 ? (
          <Typography>No projects found. Get started by creating one!</Typography>
        ) : (
          <List>
            {projects.map((project) => (
              <ListItem 
                key={project.id} 
                divider
                // secondaryAction={
                //   <Button component={RouterLink} to={`/projects/${project.id}`}>View</Button>
                // }
              >
                <ListItemText 
                  primary={project.name} 
                  secondary={`Status: ${project.status} | Start: ${new Date(project.startDate).toLocaleDateString()} | End: ${new Date(project.endDate).toLocaleDateString()}`}
                />
                 <Button onClick={() => alert(`View project ${project.id}`)}>View</Button> {/* Placeholder */} 
                 <Button onClick={() => alert(`Edit project ${project.id}`)} sx={{ml:1}}>Edit</Button> {/* Placeholder */} 
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
    </Container>
  );
};

export default ProjectListPage;
