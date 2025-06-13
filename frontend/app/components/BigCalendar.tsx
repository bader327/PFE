"use client";

import moment from "moment";
import { useEffect, useState } from "react";
import { Calendar, momentLocalizer, View, Views } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";

type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
};

const localizer = momentLocalizer(moment);

const BigCalendar = () => {
  const [view, setView] = useState<View>(Views.WORK_WEEK);
  const [events, setEvents] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/events");
        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }
        const data = await response.json();
        
        // Transform events to format required by BigCalendar
        const formattedEvents = data.map((event: Event) => ({
          id: event.id,
          title: event.title,
          start: new Date(event.date),
          end: new Date(event.date),
          description: event.description,
        }));
        
        setEvents(formattedEvents);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Failed to load events");
      }
    };

    fetchEvents();
  }, []);

  const handleOnChangeView = (selectedView: View) => {
    setView(selectedView);
  };

  // Custom event component to show more details
  const EventComponent = ({ event }: any) => (
    <div className="p-1">
      <div className="font-medium text-blue-900 truncate">{event.title}</div>
      {view === Views.DAY && (
        <div className="text-sm text-blue-700 truncate">{event.description}</div>
      )}
    </div>
  );

  return (
    <div className="h-[calc(100vh-12rem)] bg-white rounded-xl shadow-sm p-4">
      {error ? (
        <div className="text-red-500 p-4 text-center">{error}</div>
      ) : (
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          views={["work_week", "day"]}
          view={view}
          onView={handleOnChangeView}
          min={new Date(2025, 1, 0, 8, 0, 0)}
          max={new Date(2025, 1, 0, 17, 0, 0)}
          components={{
            event: EventComponent,
          }}
          className="rounded-lg"
          dayPropGetter={(date) => ({
            className: 'font-medium',
            style: {
              backgroundColor: date.getDay() === 0 || date.getDay() === 6 
                ? '#f8fafc' 
                : undefined,
            },
          })}
          eventPropGetter={() => ({
            className: 'bg-blue-100 border-blue-200 text-blue-900',
          })}
        />
      )}
    </div>
  );
};

export default BigCalendar;
