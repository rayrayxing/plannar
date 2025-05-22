import React, { useState, useEffect } from 'react';
// import logo from './logo.svg';
import './App.css';
import CreateResourcePage from './features/resources/pages/CreateResourcePage'; // Corrected path
import CreateProjectPage from './pages/projects/CreateProjectPage';
import ProjectListPage from './pages/projects/ProjectListPage';
import ProjectDetailPage from './pages/projects/ProjectDetailPage';
import UpdateProjectPage from './pages/projects/UpdateProjectPage';
import SchedulingPage from './pages/scheduling/SchedulingPage';
import AdminSkillsPage from './pages/admin/AdminSkillsPage'; // New route
import { Button, Box, Typography, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { ModalProvider } from './contexts/ModalContext';
import ModalRenderer from './components/modals/ModalWrapper'; // Renamed to ModalRenderer for clarity
import { trackEvent } from './utils/analytics'; // Adjust path as needed
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext';

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
  const { currentUser, userData, loading, error, loginWithGoogle, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState('home');

  useEffect(() => {
    // Track page view whenever currentPage changes
    // The path in trackEvent will be window.location.pathname, which might not reflect `currentPage` if not using URL routing.
    // For this simple setup, we can pass currentPage as eventData.
    trackEvent('PAGE_VIEW', { page: currentPage, simulatedPath: `/${currentPage}` });
  }, [currentPage]);


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
    if (currentPage === 'adminSkills') {
      return <AdminSkillsPage />;
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
      <AuthProvider>
        <ModalProvider>
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
            <Button variant="contained" color="info" onClick={() => setCurrentPage('adminSkills')} sx={{ mr: 1 }}>Manage Skills</Button>
            {loading && <Typography sx={{ mr: 2 }}>Loading auth...</Typography>}
            {error && <Typography color="error" sx={{ mr: 2 }}>Error: {error.message}</Typography>}
            {currentUser ? (
              <>
                <Typography sx={{ mr: 2 }}>{currentUser.email} (Roles: {userData?.roles?.join(', ') || 'N/A'})</Typography>
                <Button variant="outlined" onClick={logout} sx={{ mr: 1 }}>Logout</Button>
              </>
            ) : (
              <Button variant="contained" onClick={loginWithGoogle} sx={{ mr: 1 }}>Login with Google</Button>
            )}
          </Box>
          {renderPage()}
        </div>
        <ModalRenderer /> {/* Render modals at the top level */}
      </ModalProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

