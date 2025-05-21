import React from 'react';
import { Box, Typography, List, ListItem, ListItemText, Paper, Chip, Tooltip } from '@mui/material';
import { AuditLogEntry } from '../../../types/resource.types';

interface AuditLogDisplayProps {
  auditLog: AuditLogEntry[];
}

const AuditLogDisplay: React.FC<AuditLogDisplayProps> = ({ auditLog }) => {
  if (!auditLog || auditLog.length === 0) {
    return <Typography variant="body2" color="text.secondary">No audit history available.</Typography>;
  }

  return (
    <Paper elevation={1} className="p-4 mt-6">
      <Typography variant="h6" gutterBottom>Profile Change History</Typography>
      <List dense>
        {auditLog.slice().reverse().map((entry, index) => ( // Show newest first
          <ListItem key={index} divider className="flex-wrap">
            <ListItemText 
              primaryTypographyProps={{ variant: 'subtitle2' }}
              primary={`${new Date(entry.timestamp).toLocaleString()} - User: ${entry.userId}`}
              secondaryTypographyProps={{ component: 'div' }}
              secondary={
                <Box component="div" className="mt-1">
                  <Typography variant="body2" component="div" className="mb-1">
                    <strong>Action:</strong> {entry.description}
                  </Typography>
                  {entry.fieldName !== '-' && (
                    <Box component="div" className="text-xs p-2 bg-gray-50 rounded">
                        <Typography variant="caption" display="block"><strong>Field:</strong> {entry.fieldName}</Typography>
                        <Tooltip title={entry.oldValue?.toString() || 'N/A'} placement="top-start">
                            <Typography variant="caption" display="block" className="truncate"><strong>Old:</strong> {entry.oldValue?.toString() || 'N/A'}</Typography>
                        </Tooltip>
                        <Tooltip title={entry.newValue?.toString() || 'N/A'} placement="top-start">
                            <Typography variant="caption" display="block" className="truncate"><strong>New:</strong> {entry.newValue?.toString() || 'N/A'}</Typography>
                        </Tooltip>
                    </Box>
                  )}
                </Box>
              }
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default AuditLogDisplay;
