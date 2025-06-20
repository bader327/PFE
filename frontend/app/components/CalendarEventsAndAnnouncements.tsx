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
  date: string;
  ligneId?: string;
};

type TabType = "events" | "announcements";

export default function CalendarEventsAndAnnouncements() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>("events");
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
      const now = new Date();
      const date = selectedDate;
      date.setHours(now.getHours());
      date.setMinutes(now.getMinutes());
      date.setSeconds(now.getSeconds());
      const response = await fetch("/api/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...announcementForm,
          type: "info",
          date: date,
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
    <div className="space-y-6">
      {/* Calendar Section */}
      <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl border border-blue-100 shadow-lg overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <h2 className="text-xl font-bold">Calendar</h2>
          <p className="text-blue-100 text-sm">
            Select a date to manage events
          </p>
        </div>

        <div className="p-4 bg-white">
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={(date: Date | undefined) => {
              console.log(date);
              date && setSelectedDate(date);
            }}
            className="mx-auto"
            modifiers={{
              hasEvent: events.map((event) => new Date(event.date)),
            }}
            modifiersStyles={{
              hasEvent: {
                backgroundColor: "#dbeafe",
                color: "#1e40af",
                fontWeight: "bold",
                border: "2px solid #3b82f6",
              },
            }}
            classNames={{
              day_selected:
                "bg-blue-600 text-white hover:bg-blue-700 font-bold",
              day_today:
                "bg-red-100 text-black font-bold border-2 border-red-300",
              day: "hover:bg-blue-50 transition-colors duration-200 text-black",
            }}
          />

          {/* Legend */}
          <div className="mt-4 flex justify-center gap-6 text-sm">
            {[
              {
                color: "bg-blue-600",
                label: "Selected",
                textColor: "text-blue-600",
              },
              {
                color: "bg-red-100 border-2 border-red-300",
                label: "Today",
                textColor: "text-red-600",
              },
              {
                color: "bg-blue-100 border-2 border-blue-400",
                label: "Has Events",
                textColor: "text-blue-600",
              },
            ].map((item, index) => (
              <div key={`legend-${index}`} className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded ${item.color}`}></div>
                <span className={`${item.textColor} font-medium`}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Selector Dropdown */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-md overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">
              Manage {activeTab === "events" ? "Events" : "Announcements"}
            </h3>
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value as TabType)}
              className="px-4 py-2 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg text-blue-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            >
              <option value="events">📅 Events</option>
              <option value="announcements">📢 Announcements</option>
            </select>
          </div>

          {activeTab === "events" && (
            <p className="text-sm text-gray-500 mt-1">
              {format(selectedDate, "MMMM d, yyyy")} - {filteredEvents.length}{" "}
              events scheduled
            </p>
          )}
          {activeTab === "announcements" && (
            <p className="text-sm text-gray-500 mt-1">
              {announcements.length} total announcements
            </p>
          )}
        </div>

        <div className="p-6">
          {/* Events Tab Content */}
          {activeTab === "events" && (
            <div className="space-y-6">
              {/* Events List */}
              {filteredEvents.length === 0 ? (
                <div className="text-center py-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                  <div className="text-4xl mb-2">📅</div>
                  <p className="text-blue-700 font-medium">
                    No events scheduled for this date
                  </p>
                  <p className="text-blue-500 text-sm mt-1">
                    Create your first event below
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredEvents.map((event) => (
                    <div
                      key={event.id}
                      className="group bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-bold text-blue-900 text-lg mb-1">
                            📅 {event.title}
                          </h4>
                          <p className="text-blue-700">{event.description}</p>
                        </div>
                        <button
                          onClick={() => handleDelete("event", event.id)}
                          className="opacity-0 group-hover:opacity-100 bg-red-100 text-red-600 rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-200 transition-all duration-200 ml-3"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Event Form */}
              <form
                onSubmit={handleEventSubmit}
                className="space-y-4 bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl border border-blue-200"
              >
                <h4 className="font-semibold text-blue-800 text-lg mb-4">
                  ➕ Add New Event
                </h4>
                <div>
                  <label
                    htmlFor="eventTitle"
                    className="block text-sm font-medium text-blue-700 mb-2"
                  >
                    Event Title
                  </label>
                  <input
                    id="eventTitle"
                    type="text"
                    value={eventForm.title}
                    onChange={(e) =>
                      setEventForm({ ...eventForm, title: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-white rounded-xl border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                    placeholder="Enter event title"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="eventDesc"
                    className="block text-sm font-medium text-blue-700 mb-2"
                  >
                    Event Description
                  </label>
                  <textarea
                    id="eventDesc"
                    value={eventForm.description}
                    onChange={(e) =>
                      setEventForm({
                        ...eventForm,
                        description: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 bg-white rounded-xl border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                    placeholder="Enter event description"
                    rows={3}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transform hover:-translate-y-1 hover:shadow-lg transition-all duration-200"
                >
                  📅 Add Event for {format(selectedDate, "MMM d, yyyy")}
                </button>
              </form>
            </div>
          )}

          {/* Announcements Tab Content */}
          {activeTab === "announcements" && (
            <div className="space-y-6">
              {/* Announcements List */}
              {announcements.length === 0 ? (
                <div className="text-center py-8 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl border border-emerald-200">
                  <div className="text-4xl mb-2">📢</div>
                  <p className="text-emerald-700 font-medium">
                    No announcements available
                  </p>
                  <p className="text-emerald-500 text-sm mt-1">
                    Create your first announcement below
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {announcements.map((announcement) => (
                    <div
                      key={announcement.id}
                      className="group bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl p-4 border border-emerald-200 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-bold text-emerald-900 text-lg mb-1">
                            📢 {announcement.title}
                          </h4>
                          <p className="text-emerald-700 mb-2">
                            {announcement.content}
                          </p>
                          <p className="text-xs text-emerald-600">
                            🕒 {format(new Date(announcement.date), "PPp")}
                          </p>
                        </div>
                        <button
                          onClick={() =>
                            handleDelete("announcement", announcement.id)
                          }
                          className="opacity-0 group-hover:opacity-100 bg-red-100 text-red-600 rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-200 transition-all duration-200 ml-3"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Announcement Form */}
              <form
                onSubmit={handleAnnouncementSubmit}
                className="space-y-4 bg-gradient-to-br from-emerald-50 to-white p-6 rounded-xl border border-emerald-200"
              >
                <h4 className="font-semibold text-emerald-800 text-lg mb-4">
                  ➕ Add New Announcement
                </h4>
                <div>
                  <label
                    htmlFor="announceTitle"
                    className="block text-sm font-medium text-emerald-700 mb-2"
                  >
                    Announcement Title
                  </label>
                  <input
                    id="announceTitle"
                    type="text"
                    value={announcementForm.title}
                    onChange={(e) =>
                      setAnnouncementForm({
                        ...announcementForm,
                        title: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 bg-white rounded-xl border border-emerald-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200"
                    placeholder="Enter announcement title"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="announceContent"
                    className="block text-sm font-medium text-emerald-700 mb-2"
                  >
                    Announcement Content
                  </label>
                  <textarea
                    id="announceContent"
                    value={announcementForm.content}
                    onChange={(e) =>
                      setAnnouncementForm({
                        ...announcementForm,
                        content: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 bg-white rounded-xl border border-emerald-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200"
                    placeholder="Enter announcement content"
                    rows={3}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-3 px-6 rounded-xl font-medium hover:from-emerald-700 hover:to-emerald-800 transform hover:-translate-y-1 hover:shadow-lg transition-all duration-200"
                >
                  📢 Add Announcement
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-r-xl shadow-md">
          <div className="flex items-center">
            <span className="text-xl mr-2">⚠️</span>
            <div>
              <p className="font-medium">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
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
