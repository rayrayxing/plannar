import React from 'react';
import { Card, CardContent, Typography, Chip, Box, Button, Rating } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom'; // Assuming react-router-dom for navigation
import { Resource, ResourceStatus } from '../../../types/resource.types';

interface ResourceCardProps {
  resource: Resource;
}

const statusColors: Record<ResourceStatus, string> = {
  active: 'bg-green-100 text-green-800',
  onboarding: 'bg-blue-100 text-blue-800',
  offboarding: 'bg-yellow-100 text-yellow-800',
  'on-leave': 'bg-purple-100 text-purple-800',
  'pending-hire': 'bg-gray-100 text-gray-800',
};

const ResourceCard: React.FC<ResourceCardProps> = ({ resource }) => {
  const { id, personalInfo, skills, status, availability } = resource;

  return (
    <Card variant="outlined" className="mb-4 h-full flex flex-col">
      <CardContent className="flex-grow">
        <Typography variant="h6" component="div" className="mb-1">
          {personalInfo.firstName} {personalInfo.lastName}
        </Typography>
        <Typography variant="body2" color="text.secondary" className="mb-1">
          {personalInfo.email}
        </Typography>
        {personalInfo.employeeId && (
          <Typography variant="caption" color="text.secondary" className="block mb-2">
            ID: {personalInfo.employeeId}
          </Typography>
        )}
        <Chip 
          label={status.charAt(0).toUpperCase() + status.slice(1)}
          size="small"
          className={`${statusColors[status]} mb-2`}
        />
        
        <Typography variant="subtitle2" className="mt-2 mb-1">Key Skills:</Typography>
        <Box className="flex flex-wrap gap-1 mb-2">
          {(skills || []).slice(0, 3).map((skill, index) => (
            <Chip key={index} label={`${skill.skillName || 'Unnamed Skill'} (${skill.proficiency}/10)`} size="small" variant="outlined" />
          ))}
          {(skills || []).length > 3 && <Chip label={`+${(skills || []).length - 3} more`} size="small" />}
          {(skills || []).length === 0 && <Typography variant="caption" color="text.secondary">No skills listed</Typography>}
        </Box>

        <Typography variant="subtitle2" className="mt-2 mb-1">Availability:</Typography>
        <Typography variant="body2" color="text.secondary">
            {availability.workArrangement.charAt(0).toUpperCase() + availability.workArrangement.slice(1)}
        </Typography>

      </CardContent>
      <Box className="p-2 border-t">
        <Button 
          component={RouterLink} 
          to={`/resources/${id}`} // Assuming a route like /resources/:resourceId for details
          size="small" 
          variant="outlined"
          fullWidth
        >
          View Details
        </Button>
      </Box>
    </Card>
  );
};

export default ResourceCard;
