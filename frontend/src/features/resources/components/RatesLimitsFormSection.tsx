import React from 'react';
import { TextField, Grid, Paper, Typography, InputAdornment } from '@mui/material';
import { Rates } from '../../../types/resource.types';

interface RatesLimitsFormSectionProps {
  rates: Rates;
  setRates: React.Dispatch<React.SetStateAction<Rates>>;
  maxAssignments: number;
  setMaxAssignments: React.Dispatch<React.SetStateAction<number>>;
  maxHoursPerDay: number;
  setMaxHoursPerDay: React.Dispatch<React.SetStateAction<number>>;
}

const RatesLimitsFormSection: React.FC<RatesLimitsFormSectionProps> = ({
  rates, setRates,
  maxAssignments, setMaxAssignments,
  maxHoursPerDay, setMaxHoursPerDay
}) => {
  return (
    <Paper elevation={2} className="p-4 mb-6">
      <Typography variant="h6" className="mb-4">Rates & Operational Limits</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Standard Rate"
            type="number"
            value={rates.standard}
            onChange={(e) => setRates({ ...rates, standard: parseFloat(e.target.value) || 0 })}
            fullWidth
            required
            size="small"
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
              inputProps: { min: 0 }
            }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Overtime Rate (Optional)"
            type="number"
            value={rates.overtime || ''}
            onChange={(e) => setRates({ ...rates, overtime: parseFloat(e.target.value) || undefined })}
            fullWidth
            size="small"
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
              inputProps: { min: 0 }
            }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Weekend Rate (Optional)"
            type="number"
            value={rates.weekend || ''}
            onChange={(e) => setRates({ ...rates, weekend: parseFloat(e.target.value) || undefined })}
            fullWidth
            size="small"
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
              inputProps: { min: 0 }
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Max Concurrent Assignments"
            type="number"
            value={maxAssignments}
            onChange={(e) => setMaxAssignments(Math.max(1, parseInt(e.target.value, 10) || 1))}
            fullWidth
            required
            size="small"
            InputProps={{ inputProps: { min: 1 } }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Max Billable Hours/Day"
            type="number"
            value={maxHoursPerDay}
            onChange={(e) => setMaxHoursPerDay(Math.max(1, parseInt(e.target.value, 10) || 1))}
            fullWidth
            required
            size="small"
            InputProps={{ inputProps: { min: 1 } }}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default RatesLimitsFormSection;
