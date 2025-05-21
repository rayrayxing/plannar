import React, { useState, useEffect, useCallback } from 'react'; // Added useState, useEffect, useCallback
import { Container, Typography, Paper, Grid, CircularProgress, Alert, Box } from '@mui/material'; // Added CircularProgress, Alert, Box
import CalendarView from '../../components/scheduling/CalendarView';
import AssignmentForm from '../../components/scheduling/AssignmentForm';
import { ScheduleEntry, TimeBlock, Assignment } from '../../../../functions/src/types/schedule.types'; // Import types

// Base API URL - should ideally come from config
const API_BASE_URL = '/api'; // Assuming functions are served under /api

interface FullCalendarEvent {
  id?: string;
  title: string;
  start: string; // ISO8601 string or YYYY-MM-DD
  end?: string;   // ISO8601 string or YYYY-MM-DD
  allDay?: boolean;
  resourceId?: string; // Custom property
  color?: string; // Optional color for the event
  // Add other FullCalendar event properties as needed
}

// Helper to transform ScheduleEntry data to FullCalendar events
const transformScheduleDataToEvents = (scheduleData: Record<string, ScheduleEntry[]>): FullCalendarEvent[] => {
  const events: FullCalendarEvent[] = [];
  Object.keys(scheduleData).forEach(resourceId => {
    scheduleData[resourceId].forEach(entry => {
      entry.timeBlocks.forEach((block, index) => {
        // Try to get resource and project/task names for better titles - requires more data fetching or passing names around
        // For now, using IDs
        const title = `Res: ${resourceId.substring(0,4)} - Proj: ${block.projectId.substring(0,4)} - Task: ${block.taskId.substring(0,4)} (${block.hours}h)`;
        events.push({
          id: `${entry.id}_${index}`,
          title: title,
          start: block.startTime, 
          end: block.endTime,
          allDay: false, // Assuming timeBlocks are not allDay unless specified
          resourceId: resourceId,
          // You can add color based on project, type, etc.
          // color: block.projectId === 'proj1' ? 'blue' : 'green',
        });
      });
    });
  });
  return events;
};

const SchedulingPage: React.FC = () => {
  const [calendarEvents, setCalendarEvents] = useState<FullCalendarEvent[]>([]);
  const [loadingCalendar, setLoadingCalendar] = useState<boolean>(false);
  const [calendarError, setCalendarError] = useState<string | null>(null);

  // Define default resource IDs and date range for initial load
  // These could come from user selection later
  const defaultResourceIds = ['res1', 'res2', 'resDist']; // Example resource IDs
  const defaultStartDate = new Date();
  const defaultEndDate = new Date();
  defaultEndDate.setDate(defaultStartDate.getDate() + 30); // Next 30 days

  const fetchCalendarData = useCallback(async (resourceIds: string[], startDate: string, endDate: string) => {
    setLoadingCalendar(true);
    setCalendarError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/schedules/calendar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resourceIds, startDate, endDate }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        const errorMessage = errorData.error?.message || errorData.error || errorData.message || `Failed to fetch calendar data: ${response.status}`;
        throw new Error(errorMessage);
      }
      const data: Record<string, ScheduleEntry[]> = await response.json();
      const transformedEvents = transformScheduleDataToEvents(data);
      setCalendarEvents(transformedEvents);
    } catch (err: any) {
      setCalendarError(err.message);
      setCalendarEvents([]);
    } finally {
      setLoadingCalendar(false);
    }
  }, []);

  useEffect(() => {
    // Fetch initial calendar data
    fetchCalendarData(
      defaultResourceIds, 
      defaultStartDate.toISOString().split('T')[0],
      defaultEndDate.toISOString().split('T')[0]
    );
  }, [fetchCalendarData]); // fetchCalendarData is stable due to useCallback

  const handleAssignmentSuccess = (newAssignment: Assignment) => {
    console.log('Assignment successful, refreshing calendar:', newAssignment);
    // Refresh calendar data - could be more targeted if newAssignment provides enough info
    // For simplicity, refetching the current view
    fetchCalendarData(
      defaultResourceIds, // Or derive resourceIds from current view/filters
      defaultStartDate.toISOString().split('T')[0], // Or use current calendar view range
      defaultEndDate.toISOString().split('T')[0]
    );
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Scheduling & Resource Assignment
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', minHeight: '500px' }}>
            <Typography variant="h5" gutterBottom>
              Resource & Project Calendar
            </Typography>
            {/* TODO: Add controls for filtering calendar (date range, resources) */}
            {loadingCalendar && <Box sx={{display: 'flex', justifyContent: 'center', my: 2}}><CircularProgress /></Box>}
            {calendarError && <Alert severity="error" sx={{my: 2}}>{calendarError}</Alert>}
            {!loadingCalendar && !calendarError && (
              <CalendarView events={calendarEvents} initialView="dayGridMonth" />
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <AssignmentForm onAssignmentSuccess={handleAssignmentSuccess} />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SchedulingPage;
