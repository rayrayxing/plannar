import React from 'react';
import { Box, Typography, List, ListItem, ListItemText, Paper } from '@mui/material';

interface RankedResource {
  id: string;
  name: string;
  rankScore: number; // Example ranking criteria
  availability?: string; // e.g., "Available", "Partially Available"
  skillsMatch?: string; // e.g., "Good Match"
}

interface RankedResourceListProps {
  resources: RankedResource[];
  onSelectResource?: (resourceId: string) => void;
}

const RankedResourceList: React.FC<RankedResourceListProps> = ({ resources, onSelectResource }) => {
  if (!resources || resources.length === 0) {
    return (
      <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic' }}>
        No suitable resources found or ranking not performed yet.
      </Typography>
    );
  }

  return (
    <Paper sx={{ mt: 2, p: 2 }}>
      <Typography variant="h6" gutterBottom>Suggested Resources</Typography>
      <List dense>
        {resources.map((resource) => (
          <ListItem 
            key={resource.id} 
            button 
            onClick={() => onSelectResource && onSelectResource(resource.id)}
            secondaryAction={<Typography variant="caption">Score: {resource.rankScore}</Typography>}
          >
            <ListItemText 
              primary={resource.name} 
              secondary={`Availability: ${resource.availability || 'N/A'} | Skills: ${resource.skillsMatch || 'N/A'}`}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default RankedResourceList;
