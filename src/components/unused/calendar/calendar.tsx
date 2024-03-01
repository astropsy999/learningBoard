import { useState } from 'react';
import FullCalendar, { DateSelectArg, formatDate } from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  useTheme,
} from '@mui/material';
import { EventClickArg } from '@fullcalendar/core';
import { tokens } from '../../../theme';
import React from 'react';
import Header from '../../Header';

interface Event {
  id: string;
  title: string;
  start: string;
  end: string;
  allDay: boolean;
}

const Calendar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentEvents, setCurrentEvents] = useState<Event[]>([]);

  const handleDateClick = (arg: DateSelectArg) => {
    const title = prompt('Please enter a new title for your event');
    const calendarApi = arg.view.calendar;
    calendarApi.unselect();

    if (title) {
      calendarApi.addEvent({
        id: `${arg.start}-${title}`,
        title,
        start: arg.startStr,
        end: arg.endStr,
        allDay: arg.allDay,
      });
    }
  };

  const handleEventClick = (selected: EventClickArg) => {
    if (
      window.confirm(
        `Are you sure you want to delete the event '${selected.event.title}'`,
      )
    ) {
      selected.event.remove();
    }
  };

  return (
    <Box m="20px">
      <Header title="Календарь" subtitle="Full Calendar Interactive Page" />

      <Box display="flex" justifyContent="space-between">
        {/* CALENDAR SIDEBAR */}
        <Box
          sx={{
            flex: '1 1 20%',
            backgroundColor: colors.primary[400],
            p: '15px',
            borderRadius: '4px',
          }}
        >
          <Typography variant="h5">Events</Typography>
          <List>
            {currentEvents.map((event) => (
              <ListItem
                key={event.id}
                sx={{
                  backgroundColor: colors.greenAccent[500],
                  margin: '10px 0',
                  borderRadius: '2px',
                }}
              >
                <ListItemText
                  primary={event.title}
                  secondary={
                    <Typography>
                      {formatDate(event.start, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>

        {/* CALENDAR */}
        <Box flex="1 1 100%" ml="15px">
          <FullCalendar
            height="75vh"
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              interactionPlugin,
              listPlugin,
            ]}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth',
            }}
            initialView="dayGridMonth"
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            select={handleDateClick}
            eventClick={handleEventClick}
            // eventsSet={(events) => setCurrentEvents(events)}
            initialEvents={[
              {
                id: '12315',
                title: 'All-day event',
                start: '2022-09-14',
                allDay: true,
              },
              {
                id: '5123',
                title: 'Timed event',
                start: '2022-09-28',
                end: '2022-09-29',
                allDay: false,
              },
            ]}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Calendar;
