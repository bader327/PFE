"use client";

import { format } from "date-fns";
import { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
};

interface EventCalendarProps {
  setSelectedDate?: (date: Date) => void;
}

const EventCalendar = ({ setSelectedDate }: EventCalendarProps) => {
  const [selectedDate, onChange] = useState<Date>(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
  });
  const [editId, setEditId] = useState<string | null>(null);

  const selectedDateStr = format(selectedDate, "yyyy-MM-dd");

  const handleCalendarChange = (date: Date | undefined) => {
    if (date) {
      onChange(date);
      if (setSelectedDate) {
        setSelectedDate(date);
      }
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const fetchEvents = async () => {
    try {
      const res = await fetch("/api/events");
      if (!res.ok) throw new Error("Failed to fetch events");
      const data = await res.json();
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const handleAdd = async () => {
    if (form.title && form.description) {
      try {
        const res = await fetch("/api/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...form,
            date: selectedDateStr,
          }),
        });
        if (!res.ok) throw new Error("Failed to add event");
        setForm({ title: "", description: "" });
        fetchEvents();
      } catch (error) {
        console.error("Error adding event:", error);
      }
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch("/api/events", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Failed to delete event");
      fetchEvents();
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const handleEdit = (event: Event) => {
    setForm({ title: event.title, description: event.description });
    setEditId(event.id);
  };

  const handleUpdate = async () => {
    if (editId && form.title && form.description) {
      try {
        const res = await fetch("/api/events", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editId, ...form }),
        });
        if (!res.ok) throw new Error("Failed to update event");
        setEditId(null);
        setForm({ title: "", description: "" });
        fetchEvents();
      } catch (error) {
        console.error("Error updating event:", error);
      }
    }
  };

  const filteredEvents = events.filter(
    (e) => e.date === selectedDateStr
  );

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Calendar</h2>
        <p className="text-sm text-gray-600">Select a date to manage events</p>
      </div>

      {/* Calendar */}
      <DayPicker
        mode="single"
        selected={selectedDate}
        onSelect={handleCalendarChange}
        className="mx-auto"
        modifiers={{
          hasEvent: events.map(event => new Date(event.date)),
        }}
        modifiersStyles={{
          hasEvent: {
            backgroundColor: '#ebf4ff',
            color: '#1e40af',
            fontWeight: 'bold',
          },
        }}
        classNames={{
          day_selected: "bg-blue-600 text-white hover:bg-blue-700",
          day_today: "text-red-500 font-bold",
        }}
        footer={
          <div className="mt-4 text-center text-sm text-gray-600">
            <div className="flex items-center justify-center gap-4">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                <span>Selected</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span>Today</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-blue-100"></div>
                <span>Has Events</span>
              </div>
            </div>
          </div>
        }
      />

      {/* Events Section */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-800">
            Events for {format(selectedDate, "MMMM d, yyyy")}
          </h3>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            {filteredEvents.length} Events
          </span>
        </div>

        {/* Event Form */}
        <div className="space-y-3 mb-6">
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Event title"
            className="w-full px-4 py-2 bg-gray-50 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
          />
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Event description"
            className="w-full px-4 py-2 bg-gray-50 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
            rows={3}
          />
          {editId ? (
            <button
              onClick={handleUpdate}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-2 px-4 rounded-xl font-medium hover:from-green-700 hover:to-green-800 transition-all duration-200"
            >
              Update Event
            </button>
          ) : (
            <button
              onClick={handleAdd}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 px-4 rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
            >
              Add Event
            </button>
          )}
        </div>

        {/* Events List */}
        <div className="space-y-3">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <div
                key={event.id}
                className="group bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 hover:shadow-md transition-all duration-200"
              >
                <div className="flex justify-between items-start">
                  <h4 className="font-semibold text-blue-900 text-lg">
                    {event.title}
                  </h4>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEdit(event)}
                      className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(event.id)}
                      className="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <p className="mt-2 text-blue-800">{event.description}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-400">
              No events scheduled for this date
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCalendar;
