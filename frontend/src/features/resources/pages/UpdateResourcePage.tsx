import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, CircularProgress, Box, Alert } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom'; // Assuming react-router-dom
import ResourceForm from './components/ResourceForm';
import { Resource } from '../../../types/resource.types';

// TODO: Import an API service
// import { resourceService } from '../services/resourceService';

// Mock data for a single resource - replace with API call
const MOCK_SINGLE_RESOURCE_FOR_UPDATE: Resource = {
    id: '1',
    personalInfo: { name: 'Alice Wonderland', email: 'alice@example.com', employeeId: 'EMP001', phone: '555-1234' },
    skills: [
        { name: 'React', proficiency: 8, yearsExperience: 3 }, 
        { name: 'Node.js', proficiency: 7, yearsExperience: 2 },
    ],
    availability: {
        workArrangement: { type: 'full-time', standardHours: { monday: {active: true, startTime: '09:00', endTime: '17:00'}, tuesday: {active: true, startTime: '09:00', endTime: '17:00'}, wednesday: {active: true, startTime: '09:00', endTime: '17:00'}, thursday: {active: true, startTime: '09:00', endTime: '17:00'}, friday: {active: true, startTime: '09:00', endTime: '17:00'}, saturday: {active: false}, sunday: {active: false}} },
        timeOff: [
            { startDate: '2024-07-01', endDate: '2024-07-05', type: 'vacation', description: 'Summer break' },
        ],
    },
    rates: { standard: 100, overtime: 150, weekend: 200 },
    status: 'active',
    maxAssignments: 2,
    maxHoursPerDay: 8,
    certifications: ['AWS Certified Developer'],
    specializations: ['Frontend Development'],
    createdAt: '2023-01-15T09:00:00Z',
    updatedAt: '2024-05-20T14:30:00Z',
    auditLog: [],
};

const UpdateResourcePage: React.FC = () => {
  const { resourceId } = useParams<{ resourceId: string }>();
  const navigate = useNavigate();
  const [resource, setResource] = useState<Resource | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!resourceId) {
      setError('Resource ID is missing.');
      setLoading(false);
      return;
    }
    setLoading(true);
    // Simulate API call to fetch resource data
    setTimeout(() => {
      // const fetchedResource = await resourceService.getResourceById(resourceId);
      // For now, use mock data if ID matches
      if (resourceId === MOCK_SINGLE_RESOURCE_FOR_UPDATE.id) {
        setResource(MOCK_SINGLE_RESOURCE_FOR_UPDATE);
      } else {
        // Simulate not found for other IDs for this specific update mock
        setError(`Resource with ID ${resourceId} not found for update.`);
        setResource(null);
      }
      setLoading(false);
    }, 1000);
  }, [resourceId]);

  const handleUpdateResource = async (updatedData: Omit<Resource, 'id' | 'createdAt' | 'updatedAt' | 'auditLog'>) => {
    if (!resourceId) return;
    console.log('Updating resource:', resourceId, updatedData);
    setSuccess(null);
    setError(null);
    // Simulate API call
    // try {
    //   await resourceService.updateResource(resourceId, updatedData);
    //   setSuccess('Resource updated successfully!');
    //   setTimeout(() => navigate(`/resources/${resourceId}`), 2000); // Navigate to detail page after success
    // } catch (err) {
    //   setError('Failed to update resource. Please try again.');
    //   console.error(err);
    // }

    // Mock success
    setTimeout(() => {
        setSuccess('Resource updated successfully! (Mocked)');
        // Update the local state to reflect changes immediately in the form if needed, or rely on re-fetch/cache invalidation
        setResource(prev => prev ? { ...prev, ...updatedData, personalInfo: updatedData.personalInfo, updatedAt: new Date().toISOString() } : null);
        setTimeout(() => navigate(`/resources/${resourceId}`), 1500);
    }, 1000);
  };

  if (loading) {
    return (
      <Box className="flex justify-center items-center h-screen">
        <CircularProgress />
        <Typography className="ml-2">Loading Resource Data...</Typography>
      </Box>
    );
  }

  if (error && !resource) { // Show error prominently if resource couldn't be loaded
    return (
      <Container maxWidth="md" className="py-8">
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }
  
  if (!resource) { // Should ideally be covered by the error state above
    return (
        <Container maxWidth="md" className="py-8">
            <Alert severity="warning">Resource data not available.</Alert>
        </Container>
    );
  }

  return (
    <Container maxWidth="lg" className="py-8">
      <Paper elevation={3} className="p-6">
        <Typography variant="h4" component="h1" gutterBottom>
          Update Resource Profile
        </Typography>
        {success && <Alert severity="success" className="mb-4">{success}</Alert>}
        {error && <Alert severity="error" className="mb-4">{error}</Alert>} {/* For update errors */}
        <ResourceForm 
          onSubmit={handleUpdateResource} 
          initialData={resource} 
          isUpdating={true} 
        />
      </Paper>
    </Container>
  );
};

export default UpdateResourcePage;
