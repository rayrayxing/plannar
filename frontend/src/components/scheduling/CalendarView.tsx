import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid'; // for dayGridMonth, dayGridWeek, dayGridDay
import timeGridPlugin from '@fullcalendar/timegrid'; // for timeGridWeek, timeGridDay
import interactionPlugin from '@fullcalendar/interaction'; // for selectable, draggable
import { Box, Typography } from '@mui/material';

// Import FullCalendar's core styles
import '@fullcalendar/common/main.css'; // Using common instead of core for v5+
import '@fullcalendar/daygrid/main.css';
import '@fullcalendar/timegrid/main.css';

interface CalendarViewProps {
  events?: any[]; // Array of event objects (https://fullcalendar.io/docs/event-object)
  initialView?: string; // e.g., 'dayGridMonth', 'dayGridWeek', 'timeGridDay'
  // Add more props for event handlers like dateClick, eventClick, etc.
}

const CalendarView: React.FC<CalendarViewProps> = ({ 
  events = [], 
  initialView = 'dayGridMonth' 
}) => {
  return (
    <Box sx={{ p: 1, "& .fc-toolbar-title": { fontSize: '1.2rem !important' } }}> 
      {/* Custom styling for toolbar title can be done via sx or global CSS */}
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView={initialView}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,dayGridWeek,timeGridDay' // Add timeGridDay if needed
        }}
        events={events} // Example: [{ title: 'Event 1', date: '2024-05-20' }, { title: 'Event 2', start: '2024-05-22T10:00:00', end: '2024-05-22T12:00:00'}]
        editable={true} // Allows dragging and resizing events
        selectable={true} // Allows selecting dates/times
        selectMirror={true}
        dayMaxEvents={true} // When too many events, shows a "+more" link
        // dateClick={(info) => alert('Clicked on: ' + info.dateStr)}
        // eventClick={(info) => alert('Event: ' + info.event.title)}
        // Add more event handlers as needed
        height="auto" // Adjusts height to content; can set to a specific value like "600px"
        contentHeight="auto"
        aspectRatio={1.5} // Adjust aspect ratio as needed, or use height
      />
    </Box>
  );
};

export default CalendarView;
