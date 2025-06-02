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
  ligneId?: string;
};

type Announcement = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  ligneId?: string;
};

export default function CalendarEventsAndAnnouncements() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [eventForm, setEventForm] = useState({ title: "", description: "" });
  const [announcementForm, setAnnouncementForm] = useState({
    title: "",
    content: "",
  });
  const [error, setError] = useState<string | null>(null);

  const selectedDateStr = format(selectedDate, "yyyy-MM-dd");

  const fetchData = async () => {
    try {
      const [eventsResponse, announcementsResponse] = await Promise.all([
        fetch("/api/events"),
        fetch("/api/announcements"),
      ]);

      if (!eventsResponse.ok || !announcementsResponse.ok) {
        throw new Error("Failed to fetch data");
      }

      const [eventsData, announcementsData] = await Promise.all([
        eventsResponse.json(),
        announcementsResponse.json(),
      ]);

      setEvents(eventsData);
      setAnnouncements(announcementsData);
      setError(null);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load data. Please try again.");
    }
  };

  const handleDelete = async (type: "event" | "announcement", id: string) => {
    try {
      const response = await fetch(`/api/${type}s`, {
        method: "DELETE",
        body: JSON.stringify({ id }),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete ${type}`);
      }

      await fetchData();
    } catch (err) {
      console.error(`Error deleting ${type}:`, err);
      setError(`Failed to delete ${type}. Please try again.`);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  const handleEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...eventForm,
          date: selectedDateStr,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create event");
      }

      setEventForm({ title: "", description: "" });
      await fetchData();
    } catch (err) {
      console.error("Error creating event:", err);
      setError("Failed to create event. Please try again.");
    }
  };

  const handleAnnouncementSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...announcementForm,
          type: "info",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create announcement");
      }

      setAnnouncementForm({ title: "", content: "" });
      await fetchData();
    } catch (err) {
      console.error("Error creating announcement:", err);
      setError("Failed to create announcement. Please try again.");
    }
  };

  const filteredEvents = events.filter(
    (event) => event.date === selectedDateStr
  );
  return (
    <div className="flex flex-col lg:flex-row gap-6 bg-gradient-to-br from-white via-blue-50 to-white p-8 rounded-3xl shadow-xl">
      <div className="lg:w-1/2 space-y-8">
        {/* Calendar Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Calendar</h2>
            <p className="text-sm text-gray-600">Select a date to manage events</p>
          </div>
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={(date: Date | undefined) => date && setSelectedDate(date)}
            className="mx-auto"
            classNames={{
              day_selected: "bg-blue-600 text-white hover:bg-blue-700",
              day_today: "text-red-500 font-bold",
            }}
          />
        </div>

        {/* Events for Selected Date */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Events
              </h2>
              <p className="text-sm text-gray-600">
                {format(selectedDate, "MMMM d, yyyy")}
              </p>
            </div>
            <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {filteredEvents.length} Events
            </span>
          </div>
          
          {filteredEvents.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-xl">
              <p className="text-gray-500">No events scheduled for this date</p>
              <p className="text-sm text-gray-400 mt-1">Add an event below</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredEvents.map((event) => (
                <div
                  key={event.id}
                  className="group bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold text-blue-900 text-lg">
                      {event.title}
                    </h4>
                    <button
                      onClick={() => handleDelete("event", event.id)}
                      className="opacity-0 group-hover:opacity-100 bg-red-100 text-red-600 rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-200 transition-all duration-200"
                    >
                      ×
                    </button>
                  </div>
                  <p className="mt-2 text-blue-800">{event.description}</p>
                </div>
              ))}
            </div>
          )}

          {/* Add Event Form */}
          <form onSubmit={handleEventSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="eventTitle" className="block text-sm font-medium text-gray-700 mb-1">
                Event Title
              </label>
              <input
                id="eventTitle"
                type="text"
                value={eventForm.title}
                onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                className="w-full px-4 py-2 bg-gray-50 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                placeholder="Enter event title"
                required
              />
            </div>
            <div>
              <label htmlFor="eventDesc" className="block text-sm font-medium text-gray-700 mb-1">
                Event Description
              </label>
              <textarea
                id="eventDesc"
                value={eventForm.description}
                onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                className="w-full px-4 py-2 bg-gray-50 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                placeholder="Enter event description"
                rows={3}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transform hover:-translate-y-0.5 transition-all duration-200"
            >
              Add Event
            </button>
          </form>
        </div>
      </div>

      <div className="lg:w-1/2 space-y-8">
        {/* Announcements Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-emerald-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Announcements
              </h2>
              <p className="text-sm text-gray-600">
                Recent updates and notifications
              </p>
            </div>
            <span className="px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium">
              {announcements.length} Total
            </span>
          </div>

          {/* Announcements List */}
          {announcements.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-xl">
              <p className="text-gray-500">No announcements available</p>
              <p className="text-sm text-gray-400 mt-1">Create one below</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {announcements.map((announcement) => (
                <div
                  key={announcement.id}
                  className="group bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl p-4 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold text-emerald-900 text-lg">
                      {announcement.title}
                    </h4>
                    <button
                      onClick={() => handleDelete("announcement", announcement.id)}
                      className="opacity-0 group-hover:opacity-100 bg-red-100 text-red-600 rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-200 transition-all duration-200"
                    >
                      ×
                    </button>
                  </div>
                  <p className="mt-2 text-emerald-800">{announcement.content}</p>
                  <p className="mt-2 text-xs text-emerald-600">
                    {format(new Date(announcement.createdAt), "PPp")}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Add Announcement Form */}
          <form onSubmit={handleAnnouncementSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="announceTitle" className="block text-sm font-medium text-gray-700 mb-1">
                Announcement Title
              </label>
              <input
                id="announceTitle"
                type="text"
                value={announcementForm.title}
                onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
                className="w-full px-4 py-2 bg-gray-50 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200"
                placeholder="Enter announcement title"
                required
              />
            </div>
            <div>
              <label htmlFor="announceContent" className="block text-sm font-medium text-gray-700 mb-1">
                Announcement Content
              </label>
              <textarea
                id="announceContent"
                value={announcementForm.content}
                onChange={(e) => setAnnouncementForm({ ...announcementForm, content: e.target.value })}
                className="w-full px-4 py-2 bg-gray-50 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200"
                placeholder="Enter announcement content"
                rows={3}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-3 px-6 rounded-xl font-medium hover:from-emerald-700 hover:to-emerald-800 transform hover:-translate-y-0.5 transition-all duration-200"
            >
              Add Announcement
            </button>
          </form>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="absolute top-4 right-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-r-xl shadow-md">
          <p className="font-medium">Error</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
}
