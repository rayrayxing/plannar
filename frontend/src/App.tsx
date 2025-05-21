import React, { useState } from 'react';
// import logo from './logo.svg';
import './App.css';
import CreateResourcePage from './pages/resources/CreateResourcePage'; // Assuming this exists for navigation example
import CreateProjectPage from './pages/projects/CreateProjectPage';
import ProjectListPage from './pages/projects/ProjectListPage';
import ProjectDetailPage from './pages/projects/ProjectDetailPage';
import UpdateProjectPage from './pages/projects/UpdateProjectPage';
import SchedulingPage from './pages/scheduling/SchedulingPage';
import { Button, Box, Typography, CssBaseline, ThemeProvider, createTheme } from '@mui/material';

// A simple theme for Material UI components
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    if (currentPage === 'createProject') {
      return <CreateProjectPage />;
    }
    if (currentPage === 'projectList') {
      return <ProjectListPage />;
    }
    if (currentPage === 'projectDetail') { // Assuming projectId='1' for now
      return <ProjectDetailPage />;
    }
    if (currentPage === 'updateProject') { // Assuming projectId='1' for now
      return <UpdateProjectPage />;
    }
    if (currentPage === 'createResource') { // Example for another page
      return <CreateResourcePage />;
    }
    if (currentPage === 'scheduling') {
      return <SchedulingPage />;
    }
    // Default home page content
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="h4" gutterBottom>Welcome to Plannar</Typography>
        {/* <img src={logo} className="App-logo" alt="logo" style={{maxWidth: '200px'}}/> */}
        <p>Select an action:</p>
      </Box>
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        <Box sx={{ p: 2, borderBottom: '1px solid #ddd', textAlign: 'center' }}>
          <Button variant="text" onClick={() => setCurrentPage('home')} sx={{ mr: 1 }}>Home</Button>
          <Button variant="outlined" onClick={() => setCurrentPage('projectList')} sx={{ mr: 1 }}>View Projects</Button>
          <Button variant="outlined" onClick={() => setCurrentPage('projectDetail')} sx={{ mr: 1 }}>View Project Detail (ID 1)</Button>
          <Button variant="contained" onClick={() => setCurrentPage('createProject')} sx={{ mr: 1 }}>Create Project</Button>
          <Button variant="contained" color="secondary" onClick={() => setCurrentPage('updateProject')} sx={{ mr: 1 }}>Edit Project (ID 1)</Button>
          <Button variant="outlined" onClick={() => setCurrentPage('createResource')} sx={{ mr: 1 }} >Create Resource (Example)</Button>
          <Button variant="contained" color="primary" onClick={() => setCurrentPage('scheduling')} >View Schedules</Button>
        </Box>
        {renderPage()}
      </div>
    </ThemeProvider>
  );
}

export default App;

