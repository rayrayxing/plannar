import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, CircularProgress, Box, Grid, Chip, List, ListItem, ListItemText, Divider, Button } from '@mui/material';
import { useParams, Link as RouterLink } from 'react-router-dom'; // Assuming react-router-dom
import { Resource, SkillEndorsement, Certification, PerformanceMetric, AuditLogEntry, ResourceStatus, ExceptionEntry, DayOfWeek } from '../../../types/resource.types';
import AuditLogDisplay from '../components/AuditLogDisplay';

// TODO: Import an API service
import { resourceService } from '../services/resourceService';



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
    const fetchResource = async () => {
      if (!resourceId) {
        setResource(null); // Or handle as an error/redirect
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const data = await resourceService.getResourceById(resourceId);
        setResource(data);
      } catch (error) {
        console.error("Failed to fetch resource:", error);
        setResource(null); // Clear resource on error
        // TODO: Add user-facing error notification (e.g., toast message)
        // TODO: Potentially differentiate 404 errors to show "Not Found" vs. other errors
      } finally {
        setLoading(false);
      }
    };

    fetchResource();
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
                            <ListItem key={skill.skillId} disableGutters>
                                <ListItemText 
                                    primary={skill.skillName || skill.skillId} 
                                    secondary={
                                        `Proficiency: ${skill.proficiency}/10 | Exp: ${skill.yearsExperience} yr(s)` +
                                        (skill.lastUsedDate ? ` | Last Used: ${skill.lastUsedDate}` : '') +
                                        (skill.interestLevel ? ` | Interest: ${skill.interestLevel}/5` : '') +
                                        (skill.notes ? ` | Notes: ${skill.notes}` : '')
                                    } 
                                />
                            </ListItem>
                        ))}
                    </List>
                ) : <Typography>No skills listed.</Typography>}

                <Typography variant="h6" gutterBottom className="mt-4">Certifications</Typography>
                {(resource.certifications || []).length > 0 ? (
                    <Box className="flex flex-wrap gap-1">
                        {(resource.certifications || []).map((cert) => (
                            <Chip
                              key={cert.id}
                              label={cert.name}
                              size="small"
                              title={
                                `Issued by: ${cert.issuingBody}, Issued: ${cert.issueDate}` +
                                (cert.expirationDate ? `, Expires: ${cert.expirationDate}` : '') +
                                (cert.credentialId ? `, ID: ${cert.credentialId}` : '')
                              }
                              {...(cert.detailsLink && {
                                component: 'a',
                                href: cert.detailsLink,
                                target: '_blank',
                                rel: 'noopener noreferrer',
                                clickable: true,
                              })}
                            />
                        ))}
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
                            <ListItem key={ex.id} disableGutters>
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
                            {resource.preferences.preferredProjects && resource.preferences.preferredProjects.length > 0 && (
                                <Typography><strong>Preferred Projects:</strong> {resource.preferences.preferredProjects.join(', ')}</Typography>
                            )}
                            {resource.preferences.preferredRoles && resource.preferences.preferredRoles.length > 0 && (
                                <Typography><strong>Preferred Roles:</strong> {resource.preferences.preferredRoles.join(', ')}</Typography>
                            )}
                            {resource.preferences.developmentGoals && resource.preferences.developmentGoals.length > 0 && (
                                <Typography><strong>Development Goals:</strong> {resource.preferences.developmentGoals.join(', ')}</Typography>
                            )}
                            {resource.preferences.notificationPreferences && (
                                <Box mt={1}>
                                    <Typography variant="subtitle2">Notification Preferences:</Typography>
                                    <Typography sx={{ pl: 1, fontSize: '0.875rem' }}>
                                        Email: {resource.preferences.notificationPreferences.email ? 'Yes' : 'No'}
                                    </Typography>
                                    <Typography sx={{ pl: 1, fontSize: '0.875rem' }}>
                                        In-App: {resource.preferences.notificationPreferences.inApp ? 'Yes' : 'No'}
                                    </Typography>
                                    <Typography sx={{ pl: 1, fontSize: '0.875rem' }}>
                                        SMS: {resource.preferences.notificationPreferences.sms ? 'Yes' : 'No'}
                                    </Typography>
                                </Box>
                            )}
                            {/* Check if any preference was actually displayed to show "No preferences specified." more accurately */}
                            {!(resource.preferences.preferredProjects?.length ||
                               resource.preferences.preferredRoles?.length ||
                               resource.preferences.developmentGoals?.length ||
                               resource.preferences.notificationPreferences
                            ) && <Typography>No specific preferences detailed.</Typography>}
                        </>
                    ) : <Typography>No preferences specified.</Typography>}
            </Grid>
        </Grid>
            {/* Performance Metrics Section */}
            <Grid item xs={12} className="mt-4">
                <Typography variant="h6" gutterBottom>Performance History</Typography>
                {(resource.performance && resource.performance.length > 0) ? (
                    <List dense>
                        {(resource.performance).map((metric) => (
                            <ListItem key={metric.id} disableGutters sx={{ alignItems: 'flex-start', py: 0.5 }}>
                                <ListItemText 
                                    primary={`${metric.metricName}: ${metric.rating}`} // Assuming rating is displayable as is
                                    secondaryTypographyProps={{ component: 'div', style: { whiteSpace: 'pre-line' } }}
                                    secondary={
                                        `Date: ${metric.reviewDate}` +
                                        (metric.reviewCycleId ? `\nCycle: ${metric.reviewCycleId}` : '') +
                                        (metric.reviewerId ? `\nReviewer: ${metric.reviewerId}` : '') +
                                        (metric.comments ? `\nComments: ${metric.comments}` : '') +
                                        (metric.goalsSet ? `\nGoals Set: ${metric.goalsSet}` : '') +
                                        (metric.achievements ? `\nAchievements: ${metric.achievements}` : '')
                                    } 
                                />
                            </ListItem>
                        ))}
                    </List>
                ) : <Typography>No performance history available.</Typography>}
            </Grid>
        
        <AuditLogDisplay auditLog={resource.auditLog || []} />
        


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
