import React, { useState, useEffect, useMemo } from 'react';
import { Container, Typography, Grid, TextField, Select, MenuItem, InputLabel, FormControl, Box, Paper, CircularProgress } from '@mui/material';
import ResourceCard from './components/ResourceCard';
import { Resource, ResourceStatus, Skill } from '../../../types/resource.types';

// TODO: Import an API service to handle the actual data fetching
// import { resourceService } from '../services/resourceService';

// Mock data for now
const MOCK_RESOURCES: Resource[] = [
  {
    id: '1',
    personalInfo: { name: 'Alice Wonderland', email: 'alice@example.com', employeeId: 'EMP001' },
    skills: [{ name: 'React', proficiency: 8, yearsExperience: 3 }, { name: 'Node.js', proficiency: 7, yearsExperience: 2 }],
    availability: { workArrangement: { type: 'full-time' }, timeOff: [] },
    rates: { standard: 100 },
    status: 'active',
    maxAssignments: 2,
    maxHoursPerDay: 8,
    certifications: ['AWS Certified Developer'],
    specializations: ['Frontend Development'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    auditLog: [],
  },
  {
    id: '2',
    personalInfo: { name: 'Bob The Builder', email: 'bob@example.com', employeeId: 'EMP002' },
    skills: [{ name: 'Project Management', proficiency: 9, yearsExperience: 10 }, { name: 'AutoCAD', proficiency: 7, yearsExperience: 8 }],
    availability: { workArrangement: { type: 'part-time' }, timeOff: [] },
    rates: { standard: 120 },
    status: 'on-leave',
    maxAssignments: 1,
    maxHoursPerDay: 6,
    certifications: ['PMP'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    auditLog: [],
  },
  {
    id: '3',
    personalInfo: { name: 'Charlie Brown', email: 'charlie@example.com', employeeId: 'EMP003' },
    skills: [{ name: 'Java', proficiency: 6, yearsExperience: 5 }, { name: 'Spring Boot', proficiency: 5, yearsExperience: 3 }],
    availability: { workArrangement: { type: 'contract' }, timeOff: [] },
    rates: { standard: 90 },
    status: 'pending-hire',
    maxAssignments: 3,
    maxHoursPerDay: 10,
    certifications: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    auditLog: [],
  },
];

const ResourceListPage: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ResourceStatus | 'all'>('all');
  const [skillFilter, setSkillFilter] = useState('');

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      setResources(MOCK_RESOURCES);
      setLoading(false);
    }, 1000);
    // In a real app: 
    // const fetchResources = async () => {
    //   try {
    //     // const data = await resourceService.listResources({ status: statusFilter, skill: skillFilter, search: searchTerm });
    //     // setResources(data);
    //   } catch (error) {
    //     console.error("Failed to fetch resources:", error);
    //     // TODO: Add error notification
    //   }
    //   setLoading(false);
    // };
    // fetchResources();
  }, []); // Removed filters from dependency array for mock, add them for real API

  const filteredResources = useMemo(() => {
    return resources.filter(resource => {
      const nameMatch = resource.personalInfo.name.toLowerCase().includes(searchTerm.toLowerCase());
      const emailMatch = resource.personalInfo.email.toLowerCase().includes(searchTerm.toLowerCase());
      const statusMatch = statusFilter === 'all' || resource.status === statusFilter;
      const skillMatch = skillFilter === '' || (resource.skills || []).some(skill => skill.name.toLowerCase().includes(skillFilter.toLowerCase()));
      return (nameMatch || emailMatch) && statusMatch && skillMatch;
    });
  }, [resources, searchTerm, statusFilter, skillFilter]);

  return (
    <Container maxWidth="xl" className="py-8">
      <Paper elevation={3} className="p-6 mb-8">
        <Typography variant="h4" component="h1" gutterBottom className="mb-6">
          Resource Directory
        </Typography>
        <Grid container spacing={2} alignItems="center" className="mb-4">
          <Grid item xs={12} sm={6} md={4}>
            <TextField 
              label="Search by Name/Email"
              variant="outlined"
              fullWidth
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as ResourceStatus | 'all')}
                label="Status"
              >
                <MenuItem value="all">All Statuses</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="onboarding">Onboarding</MenuItem>
                <MenuItem value="offboarding">Offboarding</MenuItem>
                <MenuItem value="on-leave">On Leave</MenuItem>
                <MenuItem value="pending-hire">Pending Hire</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField 
              label="Filter by Skill"
              variant="outlined"
              fullWidth
              size="small"
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
            />
          </Grid>
          {/* TODO: Add more filters like availability, rate range, etc. */}
        </Grid>
      </Paper>

      {loading ? (
        <Box className="flex justify-center items-center h-64">
          <CircularProgress />
          <Typography className="ml-2">Loading Resources...</Typography>
        </Box>
      ) : filteredResources.length > 0 ? (
        <Grid container spacing={3}>
          {filteredResources.map(resource => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={resource.id}>
              <ResourceCard resource={resource} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="h6" className="text-center text-gray-500 mt-10">
          No resources found matching your criteria.
        </Typography>
      )}
    </Container>
  );
};

export default ResourceListPage;
