"use client";

import { format } from "date-fns";
import { Bell, Calendar, CalendarDays, Info, Plus, X } from "lucide-react";
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
  type: string;
  ligneId?: string;
};

export default function CompactCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isEventsOpen, setIsEventsOpen] = useState(false);
  const [isAnnouncementsOpen, setIsAnnouncementsOpen] = useState(false);
  const [eventCount, setEventCount] = useState(0);
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

      const todayEvents = eventsData.filter(
        (event: Event) => event.date === format(new Date(), "yyyy-MM-dd")
      );
      setEventCount(todayEvents.length);

      setError(null);
      console.log(announcementsData);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load data");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredEvents = events.filter(
    (event) => event.date === selectedDateStr
  );

  return (
    <div className="relative">
      <div className="flex space-x-2 bg-white rounded-lg shadow-sm p-1">
        <button
          onClick={() => setIsCalendarOpen(!isCalendarOpen)}
          className={`p-2 rounded-lg transition flex items-center gap-2 ${
            isCalendarOpen
              ? "bg-blue-50 text-blue-600"
              : "text-gray-700 hover:bg-gray-50"
          }`}
          aria-label="Calendar"
        >
          <CalendarDays size={20} />
          <span className="text-sm font-medium hidden md:inline">Calendar</span>
        </button>

        <button
          onClick={() => setIsEventsOpen(!isEventsOpen)}
          className={`p-2 rounded-lg transition flex items-center gap-2 ${
            isEventsOpen
              ? "bg-blue-50 text-blue-600"
              : "text-gray-700 hover:bg-gray-50"
          }`}
          aria-label="Events"
        >
          <Calendar size={20} />
          <span className="text-sm font-medium hidden md:inline">Events</span>
          {eventCount > 0 && (
            <span className="bg-blue-100 text-blue-600 text-xs font-medium px-2 py-0.5 rounded-full">
              {eventCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setIsAnnouncementsOpen(!isAnnouncementsOpen)}
          className={`p-2 rounded-lg transition flex items-center gap-2 ${
            isAnnouncementsOpen
              ? "bg-blue-50 text-blue-600"
              : "text-gray-700 hover:bg-gray-50"
          }`}
          aria-label="Announcements"
        >
          <Bell size={20} />
          <span className="text-sm font-medium hidden md:inline">
            Announcements
          </span>
          {announcements.length > 0 && (
            <span className="bg-blue-100 text-blue-600 text-xs font-medium px-2 py-0.5 rounded-full">
              {announcements.length}
            </span>
          )}
        </button>
      </div>

      {isCalendarOpen && (
        <div className="absolute top-full right-0 mt-2 z-50">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 w-[350px] p-4 animate-fade-in">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-gray-800">Calendar</h3>
              <button
                onClick={() => setIsCalendarOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={18} />
              </button>
            </div>
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={(date: Date | undefined) => {
                if (date) {
                  setSelectedDate(date);
                  setIsCalendarOpen(false);
                  setIsEventsOpen(true);
                }
              }}
              classNames={{
                day_selected: "bg-blue-600 text-white hover:bg-blue-700",
                day_today: "text-red-500 font-bold",
              }}
            />
          </div>
        </div>
      )}

      {isEventsOpen && (
        <div className="absolute top-full right-0 mt-2 z-50">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 w-[350px] max-h-[500px] overflow-y-auto animate-fade-in">
            <div className="sticky top-0 bg-white p-4 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-800">
                  Events for {format(selectedDate, "MMM d, yyyy")}
                </h3>
                <button
                  onClick={() => setIsEventsOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="p-4">
              {filteredEvents.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="mx-auto text-gray-300" size={48} />
                  <p className="text-gray-500 mt-2">No events for this date</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredEvents.map((event) => (
                    <div
                      key={event.id}
                      className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-3"
                    >
                      <h4 className="font-medium text-blue-900">
                        {event.title}
                      </h4>
                      <p className="text-sm text-blue-700 mt-1">
                        {event.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-4 text-center">
                <a
                  href="/calendar"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800"
                >
                  <Plus size={16} className="mr-1" />
                  Manage Events
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {isAnnouncementsOpen && (
        <div className="absolute top-full right-0 mt-2 z-50">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 w-[350px] max-h-[500px] overflow-y-auto animate-fade-in">
            <div className="sticky top-0 bg-white p-4 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-800">Announcements</h3>
                <button
                  onClick={() => setIsAnnouncementsOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="p-4">
              {announcements.length === 0 ? (
                <div className="text-center py-8">
                  <Bell className="mx-auto text-gray-300" size={48} />
                  <p className="text-gray-500 mt-2">No announcements</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {announcements.map((announcement) => (
                    <div
                      key={announcement.id}
                      className={`rounded-lg p-3 ${
                        announcement.type === "warning"
                          ? "bg-yellow-50"
                          : announcement.type === "alert"
                          ? "bg-red-50"
                          : "bg-green-50"
                      }`}
                    >
                      <h4 className="font-medium text-gray-900">
                        {announcement.title}
                      </h4>
                      <p className="text-sm text-gray-700 mt-1">
                        {announcement.content}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        {format(new Date(announcement.date), "MMM d, h:mm a")}
                      </p>
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-4 text-center">
                <a
                  href="/calendar"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800"
                >
                  <Plus size={16} className="mr-1" />
                  Manage Announcements
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-red-50 border-l-4 border-red-500 text-red-700 p-3 rounded shadow-md">
          <div className="flex">
            <Info className="h-5 w-5 mr-2" />
            <span>{error}</span>
          </div>
        </div>
      )}

      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.2s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
