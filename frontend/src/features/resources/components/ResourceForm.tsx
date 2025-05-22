import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, Grid, Paper, MenuItem, Select, InputLabel, FormControl, Chip, Rating } from '@mui/material';
import { Resource, PersonalInfo, Skill, Availability, WorkArrangement, TimeOffEntry, Rates, ResourceStatus, CertificationDetail } from '../../../types/resource.types';

import SkillsCertsFormSection from './SkillsCertsFormSection';
import AvailabilityFormSection from './AvailabilityFormSection';
import RatesLimitsFormSection from './RatesLimitsFormSection';


interface ResourceFormProps {
  onSubmit: (resource: Omit<Resource, 'id' | 'createdAt' | 'updatedAt' | 'auditLog'>) => void;
  initialData?: Partial<Resource>; // For update functionality later
  isUpdating?: boolean;
}

const ResourceForm: React.FC<ResourceFormProps> = ({ onSubmit, initialData, isUpdating = false }) => {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>(initialData?.personalInfo || { name: '', email: '', employeeId: '', phone: '' });
  const [skills, setSkills] = useState<Skill[]>(initialData?.skills || []);
  const [availability, setAvailability] = useState<Availability>(initialData?.availability || { workArrangement: { type: 'full-time', standardHours: { monday: {active: true}, tuesday: {active: true}, wednesday: {active: true}, thursday: {active: true}, friday: {active: true}, saturday: {active: false}, sunday: {active: false}} }, timeOff: [] });
  const [rates, setRates] = useState<Rates>(initialData?.rates || { standard: 0, overtime: 0, weekend: 0 });
  const [status, setStatus] = useState<ResourceStatus>(initialData?.status || 'active');
  const [maxAssignments, setMaxAssignments] = useState<number>(initialData?.maxAssignments || 2);
  const [maxHoursPerDay, setMaxHoursPerDay] = useState<number>(initialData?.maxHoursPerDay || 14);
  const [certifications, setCertifications] = useState<CertificationDetail[]>(initialData?.certifications || []);
  const [specializations, setSpecializations] = useState<string[]>(initialData?.specializations || []);
  // historicalPerformanceMetrics will likely be managed elsewhere or through a different interface

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const resourceData: Omit<Resource, 'id' | 'createdAt' | 'updatedAt' | 'auditLog'> = {
      personalInfo,
      skills,
      availability,
      rates,
      status,
      maxAssignments,
      maxHoursPerDay,
      certifications,
      specializations,
      // department, location, managerId can be added if needed
    };
    onSubmit(resourceData);
  };

  // Placeholder for sub-form sections
  const renderPersonalInfoForm = () => (
    <Paper elevation={2} className="p-4 mb-6">
      <Typography variant="h6" className="mb-4">Personal Information</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Full Name"
            value={personalInfo.name}
            onChange={(e) => setPersonalInfo({ ...personalInfo, name: e.target.value })}
            fullWidth
            required
            className="mb-4"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Email"
            type="email"
            value={personalInfo.email}
            onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
            fullWidth
            required
            className="mb-4"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Employee ID"
            value={personalInfo.employeeId}
            onChange={(e) => setPersonalInfo({ ...personalInfo, employeeId: e.target.value })}
            fullWidth
            required
            className="mb-4"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Phone (Optional)"
            value={personalInfo.phone || ''}
            onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
            fullWidth
            className="mb-4"
          />
        </Grid>
      </Grid>
    </Paper>
  );

  return (
    <Box component="form" onSubmit={handleSubmit} className="p-4 space-y-6">
      <Typography variant="h5" className="mb-6">
        {isUpdating ? 'Update Resource' : 'Create New Resource'}
      </Typography>

      {renderPersonalInfoForm()}

      <SkillsCertsFormSection 
        skills={skills} 
        setSkills={setSkills} 
        certifications={certifications} 
        setCertifications={setCertifications} 
      />

      <AvailabilityFormSection 
        availability={availability} 
        setAvailability={setAvailability} 
      />

      <RatesLimitsFormSection 
        rates={rates}
        setRates={setRates}
        maxAssignments={maxAssignments}
        setMaxAssignments={setMaxAssignments}
        maxHoursPerDay={maxHoursPerDay}
        setMaxHoursPerDay={setMaxHoursPerDay}
      />

      <Paper elevation={2} className="p-4 mb-6">
        <Typography variant="h6" className="mb-4">Status</Typography>
        <FormControl fullWidth required className="mb-4">
            <InputLabel id="status-select-label">Status</InputLabel>
            <Select
                labelId="status-select-label"
                value={status}
                label="Status"
                onChange={(e) => setStatus(e.target.value as ResourceStatus)}
            >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="onboarding">Onboarding</MenuItem>
                <MenuItem value="offboarding">Offboarding</MenuItem>
                <MenuItem value="on-leave">On Leave</MenuItem>
                <MenuItem value="pending-hire">Pending Hire</MenuItem>
            </Select>
        </FormControl>
      </Paper>

      <Box className="flex justify-end mt-6">
        <Button type="submit" variant="contained" color="primary" size="large">
          {isUpdating ? 'Save Changes' : 'Create Resource'}
        </Button>
      </Box>
    </Box>
  );
};

export default ResourceForm;
