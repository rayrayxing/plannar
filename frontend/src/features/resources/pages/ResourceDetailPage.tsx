import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, CircularProgress, Box, Grid, Chip, List, ListItem, ListItemText, Divider, Button } from '@mui/material';
import { useParams, Link as RouterLink } from 'react-router-dom'; // Assuming react-router-dom
import { Resource, Skill, AuditLogEntry, ResourceStatus, ExceptionEntry, DayOfWeek } from '../../../types/resource.types';
import AuditLogDisplay from '../components/AuditLogDisplay';

// TODO: Import an API service
// import { resourceService } from '../services/resourceService';

// Mock data for a single resource - replace with API call
const MOCK_SINGLE_RESOURCE: Resource = {
    id: '1',
\
    personalInfo: {
      firstName: 'Alice',
      lastName: 'Wonderland',
      email: 'alice@example.com',
      employeeId: 'EMP001',
      phone: '555-1234',
      title: 'Lead Developer',
      department: 'Core Engineering',
      location: 'Remote (US)',
      startDate: '2020-06-01',
      employmentStatus: 'Active',
    },
    skills: [
        { name: 'React', proficiency: 8, yearsExperience: 3 }, 
        { name: 'Node.js', proficiency: 7, yearsExperience: 2 },
        { name: 'TypeScript', proficiency: 7, yearsExperience: 2 },
    ],
    availability: {
      workArrangement: 'full-time', // WorkArrangementType
      workHours: { // WorkHours
        monday: { active: true, start: '09:00', end: '17:00' },
        tuesday: { active: true, start: '09:00', end: '17:00' },
        wednesday: { active: true, start: '09:00', end: '17:00' },
        thursday: { active: true, start: '09:00', end: '17:00' },
        friday: { active: true, start: '09:00', end: '17:00' },
        saturday: { active: false },
        sunday: { active: false },
      },
      timeZone: 'America/New_York', // string
      exceptions: [ // ExceptionEntry[]
        { id: 'ex1', startDate: '2024-07-01', endDate: '2024-07-05', type: 'vacation', description: 'Summer break' },
        { id: 'ex2', startDate: '2024-08-19', endDate: '2024-08-19', type: 'sick-leave', description: 'Doctor appointment' },
      ]
    },
    rates: { standard: 100, overtime: 150, weekend: 200, currency: 'USD' },
    status: 'active',
    maxAssignments: 2,
    maxHoursPerDay: 8,
    certifications: ['AWS Certified Developer', 'Scrum Master Certified'],
    specializations: ['Frontend Development', 'Cloud Solutions'],

    preferences: {
      projectPreferences: ['Long-term projects', 'Frontend focused'],
      workloadPreferences: 'Prefers 3-4 active tasks',
      skillDevelopment: ['Learn Vue.js', 'Improve AWS skills'],
      other: 'Enjoys mentoring junior developers',
    },
    managerId: 'MGR010',
    historicalPerformanceMetrics: [
        { metricName: 'Project Completion Rate', value: '95%', period: 'Q1 2024' },
        { metricName: 'Client Satisfaction', value: '4.8/5', period: 'Q1 2024' },
    ],
    createdAt: '2023-01-15T09:00:00Z',
    updatedAt: '2024-05-20T14:30:00Z',
    auditLog: [
        { timestamp: '2023-01-15T09:00:00Z', userId: 'system', fieldName: '-', oldValue: '-', newValue: '-', description: 'Resource created' },
        { timestamp: '2024-03-10T11:00:00Z', userId: 'adminUser', fieldName: 'skills', oldValue: 'Old skills array', newValue: 'New skills array', description: 'Updated skills' },
    ],
};

const statusColors: Record<ResourceStatus, string> = {
    active: 'bg-green-100 text-green-800',
    onboarding: 'bg-blue-100 text-blue-800',
    offboarding: 'bg-yellow-100 text-yellow-800',
    'on-leave': 'bg-purple-100 text-purple-800',
    'pending-hire': 'bg-gray-100 text-gray-800',
  };

const ResourceDetailPage: React.FC = () => {
  const { resourceId } = useParams<{ resourceId: string }>();
  const [resource, setResource] = useState<Resource | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      // In a real app, fetch the resource with `resourceId`
      // For now, just use the mock if ID matches, or a subset for other IDs
      if (resourceId === MOCK_SINGLE_RESOURCE.id) {
        setResource(MOCK_SINGLE_RESOURCE);
      } else {
        // Simulate finding another resource from a list or a 404
        const anotherMock = {
            ...MOCK_SINGLE_RESOURCE, 
            id: resourceId || 'unknown', 
            personalInfo: {...MOCK_SINGLE_RESOURCE.personalInfo, name: `Resource ${resourceId}`}
        };
        setResource(anotherMock);
      }
      setLoading(false);
    }, 1000);
    // const fetchResource = async () => {
    //   if (!resourceId) return;
    //   try {
    //     // const data = await resourceService.getResourceById(resourceId);
    //     // setResource(data);
    //   } catch (error) {
    //     console.error("Failed to fetch resource:", error);
    //     // TODO: Add error notification, handle 404
    //   }
    //   setLoading(false);
    // };
    // fetchResource();
  }, [resourceId]);

  if (loading) {
    return (
      <Box className="flex justify-center items-center h-screen">
        <CircularProgress />
        <Typography className="ml-2">Loading Resource Details...</Typography>
      </Box>
    );
  }

  if (!resource) {
    return (
      <Container maxWidth="md" className="py-8">
        <Paper elevation={3} className="p-6 text-center">
          <Typography variant="h5" color="error">Resource Not Found</Typography>
          <Button component={RouterLink} to="/resources" variant="outlined" className="mt-4">
            Back to Resource List
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" className="py-8">
      <Paper elevation={3} className="p-6">
        <Box className="flex justify-between items-start mb-4">
            <div>
                <Typography variant="h4" component="h1" gutterBottom>
                    {`${resource.personalInfo.firstName} ${resource.personalInfo.lastName}`}
                </Typography>
                <Chip 
                    label={resource.status.charAt(0).toUpperCase() + resource.status.slice(1)}
                    size="medium"
                    className={`${statusColors[resource.status]} mb-2 font-semibold`}
                />
            </div>
            <Button 
                component={RouterLink} 
                to={`/resources/${resource.id}/edit`} // Assuming edit route
                variant="contained"
            >
                Edit Resource
            </Button>
        </Box>
        <Divider className="my-4"/>

        <Grid container spacing={3}>
            {/* Column 1: Core Info & Contact */}
            <Grid item xs={12} md={4}>
                <Typography variant="h6" gutterBottom>Personal Information</Typography>
                <Typography><strong>Email:</strong> {resource.personalInfo.email}</Typography>
                {resource.personalInfo.phone && <Typography><strong>Phone:</strong> {resource.personalInfo.phone}</Typography>}
                {resource.personalInfo.employeeId && <Typography><strong>Employee ID:</strong> {resource.personalInfo.employeeId}</Typography>}
                {resource.personalInfo.department && <Typography><strong>Department:</strong> {resource.personalInfo.department}</Typography>}
                {resource.personalInfo.location && <Typography><strong>Location:</strong> {resource.personalInfo.location}</Typography>}
                    {resource.personalInfo.title && <Typography><strong>Title:</strong> {resource.personalInfo.title}</Typography>}
                    {resource.personalInfo.startDate && <Typography><strong>Start Date:</strong> {resource.personalInfo.startDate}</Typography>}
                    {resource.personalInfo.endDate && <Typography><strong>End Date:</strong> {resource.personalInfo.endDate}</Typography>}
                    {resource.personalInfo.employmentStatus && <Typography><strong>Employment Status:</strong> {resource.personalInfo.employmentStatus}</Typography>}
                {resource.managerId && <Typography><strong>Manager ID:</strong> {resource.managerId}</Typography>}

                <Typography variant="h6" gutterBottom className="mt-4">Operational Limits</Typography>
                <Typography><strong>Max Assignments:</strong> {resource.maxAssignments}</Typography>
                <Typography><strong>Max Hours/Day:</strong> {resource.maxHoursPerDay}</Typography>
            </Grid>

            {/* Column 2: Skills & Certs */}
            <Grid item xs={12} md={4}>
                <Typography variant="h6" gutterBottom>Skills</Typography>
                {(resource.skills || []).length > 0 ? (
                    <List dense>
                        {(resource.skills || []).map((skill, index) => (
                            <ListItem key={index} disableGutters>
                                <ListItemText primary={skill.name} secondary={`Proficiency: ${skill.proficiency}/10, Experience: ${skill.yearsExperience} yr(s)`} />
                            </ListItem>
                        ))}
                    </List>
                ) : <Typography>No skills listed.</Typography>}

                <Typography variant="h6" gutterBottom className="mt-4">Certifications</Typography>
                {(resource.certifications || []).length > 0 ? (
                    <Box className="flex flex-wrap gap-1">
                        {(resource.certifications || []).map((cert, index) => <Chip key={index} label={cert} size="small" />)}
                    </Box>
                ) : <Typography>No certifications listed.</Typography>}

                <Typography variant="h6" gutterBottom className="mt-4">Specializations</Typography>
                {(resource.specializations || []).length > 0 ? (
                    <Box className="flex flex-wrap gap-1">
                        {(resource.specializations || []).map((spec, index) => <Chip key={index} label={spec} size="small" variant="outlined" />)}
                    </Box>
                ) : <Typography>No specializations listed.</Typography>}
            </Grid>

            {/* Column 3: Availability & Rates */}
            <Grid item xs={12} md={4}>
                <Typography variant="h6" gutterBottom>Availability</Typography>
                <Typography><strong>Arrangement:</strong> {resource.availability.workArrangement}</Typography>
                {/* {resource.availability.workArrangement.notes && <Typography><em>Notes: {resource.availability.workArrangement.notes}</em></Typography>} */}
                    {resource.availability.timeZone && <Typography><strong>Time Zone:</strong> {resource.availability.timeZone}</Typography>}
                    <Typography variant="subtitle1" gutterBottom className="mt-2">Standard Work Hours</Typography>
                    {resource.availability.workHours && Object.entries(resource.availability.workHours)
                        .filter(([_, dayDetails]) => dayDetails.active)
                        .map(([day, dayDetails]) => (
                            <Typography key={day} sx={{ fontSize: '0.875rem', pl:1 }}> {/* dense equivalent */}
                                <strong>{day.charAt(0).toUpperCase() + day.slice(1)}:</strong> {dayDetails.start} - {dayDetails.end}
                            </Typography>
                        ))
                    }
                    {resource.availability.workHours && !Object.values(resource.availability.workHours).some(d => d.active) && (
                        <Typography sx={{ fontSize: '0.875rem', pl:1 }}>No standard work hours defined.</Typography>
                    )}
                {/* TODO: Display custom schedule if applicable */}

                <Typography variant="subtitle1" gutterBottom className="mt-2">Exceptions / Time Off</Typography>
                {(resource.availability.exceptions || []).length > 0 ? (
                    <List dense>
                        {(resource.availability.exceptions || []).map((ex, index) => (
                            <ListItem key={ex.id || index} disableGutters>
                                <ListItemText primary={`${ex.type.charAt(0).toUpperCase() + ex.type.slice(1)}: ${ex.startDate} to ${ex.endDate}`} secondary={ex.description} />
                            </ListItem>
                        ))}
                    </List>
                ) : <Typography>No exceptions scheduled.</Typography>}

                <Typography variant="h6" gutterBottom className="mt-4">Rates</Typography>
                <Typography><strong>Standard:</strong> ${resource.rates.standard}/hr ({resource.rates.currency})</Typography>
                {resource.rates.overtime && <Typography><strong>Overtime:</strong> ${resource.rates.overtime}/hr ({resource.rates.currency})</Typography>}
                {resource.rates.weekend && <Typography><strong>Weekend:</strong> ${resource.rates.weekend}/hr ({resource.rates.currency})</Typography>}
                <Typography variant="h6" gutterBottom className="mt-4">Preferences</Typography>
                {resource.preferences ? (
                    <>
                        {resource.preferences.projectPreferences && resource.preferences.projectPreferences.length > 0 && (
                            <Typography><strong>Project Types:</strong> {resource.preferences.projectPreferences.join(', ')}</Typography>
                        )}
                        {resource.preferences.workloadPreferences && (
                            <Typography><strong>Workload:</strong> {resource.preferences.workloadPreferences}</Typography>
                        )}
                        {resource.preferences.skillDevelopment && resource.preferences.skillDevelopment.length > 0 && (
                            <Typography><strong>Skill Development:</strong> {resource.preferences.skillDevelopment.join(', ')}</Typography>
                        )}
                        {resource.preferences.other && (
                            <Typography><strong>Other:</strong> {resource.preferences.other}</Typography>
                        )}
                    </>
                ) : <Typography>No preferences specified.</Typography>}
            </Grid>
        </Grid>
        
        <AuditLogDisplay auditLog={resource.auditLog || []} />
        
        {/* TODO: Add section for Historical Performance */}

        <Box className="mt-6 text-center">
            <Button component={RouterLink} to="/resources" variant="outlined">
                Back to Resource List
            </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default ResourceDetailPage;
