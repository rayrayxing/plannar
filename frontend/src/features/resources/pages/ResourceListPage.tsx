import React, { useState, useEffect, useMemo } from 'react';
import { Container, Typography, Grid, TextField, Select, MenuItem, InputLabel, FormControl, Box, Paper, CircularProgress } from '@mui/material';
import ResourceCard from '../components/ResourceCard';
import { Resource, ResourceStatus, Skill } from '../../../types/resource.types';

// TODO: Import an API service to handle the actual data fetching
import { resourceService } from '../services/resourceService';




const ResourceListPage: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ResourceStatus | 'all'>('all');
  const [skillFilter, setSkillFilter] = useState('');

  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);
      try {
        const data = await resourceService.listResources();
        setResources(data);
      } catch (error) {
        console.error("Failed to fetch resources:", error);
        // TODO: Add user-facing error notification (e.g., toast message)
        setResources([]); // Clear resources on error or set to an empty state
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []); // Empty dependency array means this runs once on mount

  const filteredResources = useMemo(() => {
    return resources.filter(resource => {
      const searchTermLower = searchTerm.toLowerCase();
      const nameMatch = 
        resource.personalInfo.firstName.toLowerCase().includes(searchTermLower) ||
        resource.personalInfo.lastName.toLowerCase().includes(searchTermLower);
      const emailMatch = resource.personalInfo.email.toLowerCase().includes(searchTermLower);
      const statusMatch = statusFilter === 'all' || resource.status === statusFilter;
      const skillFilterLower = skillFilter.toLowerCase();
      const skillMatch = skillFilter === '' || (resource.skills || []).some(skill => 
        (skill.skillName || '').toLowerCase().includes(skillFilterLower)
      );
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
