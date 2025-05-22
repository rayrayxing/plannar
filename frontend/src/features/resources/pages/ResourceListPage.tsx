import React, { useState, useEffect, useMemo } from 'react';
import { Container, Typography, Grid, TextField, Select, MenuItem, InputLabel, FormControl, Box, Paper, CircularProgress, Pagination } from '@mui/material';
import ResourceCard from '../components/ResourceCard';
import { Resource, ResourceStatus, Skill, WorkArrangementType } from '../../../types/resource.types';

// TODO: Import an API service to handle the actual data fetching
import { resourceService } from '../services/resourceService';




const ResourceListPage: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ResourceStatus | 'all'>('all');
  const [skillFilter, setSkillFilter] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState<WorkArrangementType | ''>( '');
  const [minRateFilter, setMinRateFilter] = useState<string>('');
  const [maxRateFilter, setMaxRateFilter] = useState<string>('');
  const [sortKey, setSortKey] = useState<string>(''); // '' for none, 'name', 'status'
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12); // Or a configurable value

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
      const availabilityMatch = availabilityFilter === '' || resource.availability.workArrangement === availabilityFilter;

      const standardRateEntry = resource.rates?.find(r => r.rateType === 'standard');
      const currentRate = standardRateEntry?.standardRate;

      let rateMatch = true;
      const minRate = minRateFilter ? parseFloat(minRateFilter) : null;
      const maxRate = maxRateFilter ? parseFloat(maxRateFilter) : null;

      if (minRate !== null || maxRate !== null) { // Only apply rate filter if at least one is set
        if (currentRate === undefined || currentRate === null) {
          rateMatch = false; // No rate, so fails if filters are active
        } else {
          if (minRate !== null && !isNaN(minRate) && currentRate < minRate) {
            rateMatch = false;
          }
          if (maxRate !== null && !isNaN(maxRate) && currentRate > maxRate) {
            rateMatch = false;
          }
        }
      }
      return (nameMatch || emailMatch) && statusMatch && skillMatch && availabilityMatch && rateMatch;
    });
  }, [resources, searchTerm, statusFilter, skillFilter, availabilityFilter, minRateFilter, maxRateFilter]);

  const sortedAndFilteredResources = useMemo(() => {
    let sorted = [...filteredResources]; // Create a new array for sorting

    if (sortKey === 'name') {
      sorted.sort((a, b) => {
        const nameA = `${a.personalInfo.firstName} ${a.personalInfo.lastName}`.toLowerCase();
        const nameB = `${b.personalInfo.firstName} ${b.personalInfo.lastName}`.toLowerCase();
        if (nameA < nameB) return sortDirection === 'asc' ? -1 : 1;
        if (nameA > nameB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    } else if (sortKey === 'status') {
      sorted.sort((a, b) => {
        const statusA = a.status.toLowerCase();
        const statusB = b.status.toLowerCase();
        if (statusA < statusB) return sortDirection === 'asc' ? -1 : 1;
        if (statusA > statusB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }
    // If sortKey is '', no sorting is done, original filteredResources order is preserved.
    return sorted;
  }, [filteredResources, sortKey, sortDirection]);

  const paginatedResources = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedAndFilteredResources.slice(startIndex, endIndex);
  }, [sortedAndFilteredResources, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(sortedAndFilteredResources.length / itemsPerPage);
  return (
    <Container maxWidth="xl" className="py-8">
      <Paper elevation={3} className="p-6 mb-8">
        <Typography variant="h4" component="h1" gutterBottom className="mb-6">
          Resource Directory
        </Typography>
        <Grid container spacing={2} alignItems="center" className="mb-4">
          <Grid item xs={12} sm={6} md={2}>
            <TextField 
              label="Search by Name/Email"
              variant="outlined"
              fullWidth
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
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
          <Grid item xs={12} sm={6} md={2}>
            <TextField 
              label="Filter by Skill"
              variant="outlined"
              fullWidth
              size="small"
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel>Availability</InputLabel>
              <Select
                value={availabilityFilter}
                onChange={(e) => setAvailabilityFilter(e.target.value as WorkArrangementType | '')}
                label="Availability"
              >
                <MenuItem value=""><em>All</em></MenuItem>
                <MenuItem value="full-time">Full-time</MenuItem>
                <MenuItem value="part-time">Part-time</MenuItem>
                <MenuItem value="contractor">Contractor</MenuItem>
                <MenuItem value="intern">Intern</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                label="Min Rate"
                type="number"
                variant="outlined"
                size="small"
                value={minRateFilter}
                onChange={(e) => setMinRateFilter(e.target.value)}
                sx={{ flex: 1 }}
                InputProps={{ inputProps: { min: 0 } }}
              />
              <TextField
                label="Max Rate"
                type="number"
                variant="outlined"
                size="small"
                value={maxRateFilter}
                onChange={(e) => setMaxRateFilter(e.target.value)}
                sx={{ flex: 1 }}
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <FormControl fullWidth variant="outlined" size="small" sx={{ flex: 1 }}>
                <InputLabel>Sort by</InputLabel>
                <Select
                  value={sortKey}
                  onChange={(e) => setSortKey(e.target.value as string)}
                  label="Sort by"
                >
                  <MenuItem value=""><em>None</em></MenuItem>
                  <MenuItem value="name">Name</MenuItem>
                  <MenuItem value="status">Status</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth variant="outlined" size="small" disabled={!sortKey} sx={{ flex: 1 }}>
                <InputLabel>Direction</InputLabel>
                <Select
                  value={sortDirection}
                  onChange={(e) => setSortDirection(e.target.value as 'asc' | 'desc')}
                  label="Direction"
                >
                  <MenuItem value="asc">Ascending</MenuItem>
                  <MenuItem value="desc">Descending</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Grid>
          {/* TODO: Add more filters like availability, rate range, etc. */}
        </Grid>
      </Paper>

      {loading ? (
        <Box className="flex justify-center items-center h-64">
          <CircularProgress />
          <Typography className="ml-2">Loading Resources...</Typography>
        </Box>
      ) : sortedAndFilteredResources.length > 0 ? (
        <Grid container spacing={3}>
          {paginatedResources.map(resource => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={resource.id}>
              <ResourceCard resource={resource} />
            </Grid>
          ))}
        </Grid>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 2 }}> {/* Updated styling */}
            {totalPages > 1 && ( // Only show pagination if there's more than one page
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(event, value) => setCurrentPage(value)}
                color="primary"
                showFirstButton
                showLastButton
              />
            )}
          </Box>
      ) : (
        <Typography variant="h6" className="text-center text-gray-500 mt-10">
          No resources found matching your criteria.
        </Typography>
      )}
    </Container>
  );
};

export default ResourceListPage;
