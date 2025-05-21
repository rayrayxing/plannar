import React from 'react';
import { Container, Paper, Typography } from '@mui/material';
import ProjectForm from '../../components/projects/ProjectForm'; // Adjust path as needed
import { ProjectData } from '../../types/project.types'; // Adjusted path
// import { useNavigate } from 'react-router-dom'; // Uncomment when routing is set up

const CreateProjectPage: React.FC = () => {
  // const navigate = useNavigate(); // Uncomment when routing is set up

  const handleSubmit = async (projectData: ProjectData) => {
    console.log('Submitting new project:', projectData);
    // TODO: Implement API call to create project
    // try {
    //   // const newProject = await projectsApi.createProject(projectData);
    //   // console.log('Project created:', newProject);
    //   // navigate('/projects'); // Or to the new project's detail page
    // } catch (error) {
    //   // console.error('Failed to create project:', error);
    //   // TODO: Show error to user
    // }
    alert('Project submission simulated. Check console.'); // Placeholder
  };

  const handleCancel = () => {
    console.log('Cancelled project creation');
    // navigate('/projects'); // Uncomment when routing is set up, or to a dashboard
    alert('Navigation to projects list simulated.'); // Placeholder
  };

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create New Project
        </Typography>
        <ProjectForm onSubmit={handleSubmit} onCancel={handleCancel} />
      </Paper>
    </Container>
  );
};

export default CreateProjectPage;
