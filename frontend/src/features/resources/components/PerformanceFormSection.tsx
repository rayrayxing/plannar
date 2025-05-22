import React from 'react';
import { Box, Typography, Paper, Button, List, ListItem, ListItemText, IconButton, ListItemSecondaryAction } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { PerformanceMetric } from '../../../types/resource.types';
import { useModal } from '../../../contexts/ModalContext';

interface PerformanceFormSectionProps {
  performanceMetrics: PerformanceMetric[];
  setPerformanceMetrics: React.Dispatch<React.SetStateAction<PerformanceMetric[]>>;
}

const PerformanceFormSection: React.FC<PerformanceFormSectionProps> = ({ performanceMetrics, setPerformanceMetrics }) => {
  const { openModal } = useModal();

  const handleAddMetric = () => {
    openModal<'performanceMetricModal'>({ // Assuming 'performanceMetricModal' will be the modalType
      modalType: 'performanceMetricModal',
      modalProps: {
        onSubmit: (newMetric: PerformanceMetric) => {
          setPerformanceMetrics([...performanceMetrics, newMetric]);
        },
      }
    });
  };

  const handleEditMetric = (index: number) => {
    const metricToEdit = performanceMetrics[index];
    openModal<'performanceMetricModal'>({ 
      modalType: 'performanceMetricModal',
      modalProps: {
        initialData: metricToEdit,
        onSubmit: (updatedMetric: PerformanceMetric) => {
          const updatedList = [...performanceMetrics];
          updatedList[index] = updatedMetric;
          setPerformanceMetrics(updatedList);
        },
      }
    });
  };

  const handleRemoveMetric = (index: number) => {
    setPerformanceMetrics(performanceMetrics.filter((_, i) => i !== index));
  };

  return (
    <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Historical Performance Metrics</Typography>
        <Button 
          variant="outlined" 
          onClick={handleAddMetric} 
          startIcon={<AddCircleOutlineIcon />}
        >
          Add Metric
        </Button>
      </Box>
      {performanceMetrics.length > 0 ? (
        <List dense>
          {performanceMetrics.map((metric, index) => (
            <ListItem 
              key={metric.id} 
              sx={{ borderBottom: '1px solid #eee', mb: 1, pb: 1 }}
              secondaryAction={
                <Box>
                  <IconButton edge="end" aria-label="edit" onClick={() => handleEditMetric(index)} size="small" sx={{ mr: 0.5 }}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveMetric(index)} size="small">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              }
            >
              <ListItemText 
                primary={`${metric.metricName}: ${metric.rating}`}
                secondary={
                  `Date: ${metric.reviewDate} | Reviewer: ${metric.reviewerId || 'N/A'}` +
                  (metric.reviewCycleId ? ` | Cycle: ${metric.reviewCycleId}` : '') +
                  (metric.comments ? ` | Comments: ${metric.comments}` : '') +
                  (metric.goalsSet ? ` | Goals: ${metric.goalsSet}` : '') +
                  (metric.achievements ? ` | Achievements: ${metric.achievements}` : '')
                }
              />
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography variant="body2" color="textSecondary">No performance metrics recorded.</Typography>
      )}
    </Paper>
  );
};

export default PerformanceFormSection;
