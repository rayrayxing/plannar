import React from 'react';
import { Container, Typography, Paper } from '@mui/material';
import ResourceForm from './components/ResourceForm';
import { Resource } from '../../../types/resource.types';

// TODO: Import an API service to handle the actual submission
// import { resourceService } from '../services/resourceService';

const CreateResourcePage: React.FC = () => {
  const handleCreateResource = async (resourceData: Omit<Resource, 'id' | 'createdAt' | 'updatedAt' | 'auditLog'>) => {
    console.log('Submitting new resource:', resourceData);
    // try {
    //   // const newResource = await resourceService.createResource(resourceData);
    //   // console.log('Resource created successfully:', newResource);
    //   // TODO: Add navigation to resource list or detail page
    //   // TODO: Add success notification
    // } catch (error) {
    //   // console.error('Failed to create resource:', error);
    //   // TODO: Add error notification
    // }
  };

  return (
    <Container maxWidth="lg" className="py-8">
      <Paper elevation={3} className="p-6">
        <Typography variant="h4" component="h1" gutterBottom className="text-center mb-6">
          Add New Resource
        </Typography>
        <ResourceForm onSubmit={handleCreateResource} />
      </Paper>
    </Container>
  );
};

export default CreateResourcePage;
