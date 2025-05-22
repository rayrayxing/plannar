import React from 'react';
import { Box, Typography, Paper, Button, List, ListItem, ListItemText, IconButton, ListItemSecondaryAction } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { HistoricalPerformanceMetric } from '../../../types/resource.types';
import { useModal } from '../../../contexts/ModalContext';

// Augmenting with optional id for client-side list management if needed by modal
export interface FormHistoricalPerformanceMetric extends HistoricalPerformanceMetric {
  id?: string; 
}

interface PerformanceFormSectionProps {
  performanceMetrics: FormHistoricalPerformanceMetric[];
  setPerformanceMetrics: React.Dispatch<React.SetStateAction<FormHistoricalPerformanceMetric[]>>;
}

const PerformanceFormSection: React.FC<PerformanceFormSectionProps> = ({ performanceMetrics, setPerformanceMetrics }) => {
  const { openModal } = useModal();

  const handleAddMetric = () => {
    openModal<'performanceMetricModal'>({ // Assuming 'performanceMetricModal' will be the modalType
      modalType: 'performanceMetricModal',
      modalProps: {
        onSubmit: (newMetric: FormHistoricalPerformanceMetric) => {
          // Ensure newMetric has a unique ID if not provided by modal (e.g., for purely client-side additions before save)
          const metricToAdd = { ...newMetric, id: newMetric.id || `temp-${Date.now()}` };
          setPerformanceMetrics([...performanceMetrics, metricToAdd]);
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
        onSubmit: (updatedMetric: FormHistoricalPerformanceMetric) => {
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
              key={metric.id || index} 
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
                primary={`${metric.metricName}: ${metric.value}`}
                secondary={`Recorded: ${new Date(metric.dateRecorded).toLocaleDateString()} ${metric.notes ? ' | Notes: ' + metric.notes : ''}`}
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
