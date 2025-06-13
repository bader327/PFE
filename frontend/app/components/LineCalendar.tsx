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
  type?: "info" | "warning" | "alert";
  ligneId?: string;
};

type TabType = "events" | "announcements";

interface LineSelectorProps {
  ligneId?: string;
  className?: string;
  setSelectedDate?: (date: Date) => void;
}

export default function LineCalendar({ ligneId, className = "", setSelectedDate: parentSetSelectedDate }: LineSelectorProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>("events");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedDateStr = format(selectedDate, "yyyy-MM-dd");

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Add ligne filter if ligneId is provided
      const ligneFilter = ligneId ? `?ligneId=${ligneId}` : "";
      
      const [eventsResponse, announcementsResponse] = await Promise.all([
        fetch(`/api/events${ligneFilter}`),
        fetch(`/api/announcements${ligneFilter}`),
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
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [ligneId]);

  // Filter events for the selected date
  const filteredEvents = events.filter(
    (event) => event.date === selectedDateStr
  );

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Calendar Section */}
      <div className="bg-gradient-to-br from-purple-50 to-white rounded-2xl border border-purple-100 shadow-lg overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-purple-600 to-purple-700 text-white">
          <h2 className="text-xl font-bold">Line Calendar</h2>
          <p className="text-purple-100 text-sm">
            {ligneId ? `Line ${ligneId} - Select a date to manage events` : "All Lines - Select a date to manage events"}
          </p>
        </div>
        
        <div className="p-4 bg-white">
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={(date: Date | undefined) => {
              if (date) {
                setSelectedDate(date);
                if (parentSetSelectedDate) {
                  parentSetSelectedDate(date);
                }
              }
            }}
            className="mx-auto"
            modifiers={{
              hasEvent: events.map(event => new Date(event.date)),
            }}
            modifiersStyles={{
              hasEvent: {
                backgroundColor: '#f3e8ff',
                color: '#7c3aed',
                fontWeight: 'bold',
                border: '2px solid #8b5cf6',
              },
            }}
            classNames={{
              day_selected: "bg-purple-600 text-white hover:bg-purple-700 font-bold",
              day_today: "bg-red-100 text-black font-bold border-2 border-red-300",
              day: "hover:bg-purple-50 transition-colors duration-200 text-black",
            }}
          />
          
          {/* Legend */}
          <div className="mt-4 flex justify-center gap-6 text-sm">
            {[
              { color: "bg-purple-600", label: "Selected", textColor: "text-purple-600" },
              { color: "bg-red-100 border-2 border-red-300", label: "Today", textColor: "text-red-600" },
              { color: "bg-purple-100 border-2 border-purple-400", label: "Has Events", textColor: "text-purple-600" }
            ].map((item, index) => (
              <div key={`legend-${index}`} className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded ${item.color}`}></div>
                <span className={`${item.textColor} font-medium`}>{item.label}</span>
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
              className="px-4 py-2 bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-lg text-purple-700 font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
            >
              <option value="events">📅 Events</option>
              <option value="announcements">📢 Announcements</option>
            </select>
          </div>
          
          {activeTab === "events" && (
            <p className="text-sm text-gray-500 mt-1">
              {format(selectedDate, "MMMM d, yyyy")} - {filteredEvents.length} events scheduled
            </p>
          )}
          {activeTab === "announcements" && (
            <p className="text-sm text-gray-500 mt-1">
              {announcements.length} total announcements
            </p>
          )}
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-r-xl shadow-md">
              <div className="flex items-center">
                <span className="text-xl mr-2">⚠️</span>
                <div>
                  <p className="font-medium">Error</p>
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Events Tab Content */}
              {activeTab === "events" && (
                <div className="space-y-6">
                  {/* Events List */}
                  {filteredEvents.length === 0 ? (
                    <div className="text-center py-8 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                      <div className="text-4xl mb-2">📅</div>
                      <p className="text-purple-700 font-medium">No events scheduled for this date</p>
                      <p className="text-purple-500 text-sm mt-1">Events will appear here when scheduled</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                      {filteredEvents.map((event) => (
                        <div
                          key={event.id}
                          className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200 hover:shadow-lg transition-all duration-300"
                        >
                          <div className="flex-1">
                            <h4 className="font-bold text-purple-900 text-lg mb-1">
                              📅 {event.title}
                            </h4>
                            <p className="text-purple-700">{event.description}</p>
                            {event.ligneId && (
                              <p className="text-xs text-purple-600 mt-2">
                                🏭 Line {event.ligneId}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Announcements Tab Content */}
              {activeTab === "announcements" && (
                <div className="space-y-6">
                  {/* Announcements List */}
                  {announcements.length === 0 ? (
                    <div className="text-center py-8 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl border border-emerald-200">
                      <div className="text-4xl mb-2">📢</div>
                      <p className="text-emerald-700 font-medium">No announcements available</p>
                      <p className="text-emerald-500 text-sm mt-1">Announcements will appear here when posted</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                      {announcements.map((announcement) => (
                        <div
                          key={announcement.id}
                          className={`rounded-xl p-4 border hover:shadow-lg transition-all duration-300 ${
                            announcement.type === "warning" 
                              ? "bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200" 
                              : announcement.type === "alert" 
                              ? "bg-gradient-to-r from-red-50 to-red-100 border-red-200" 
                              : "bg-gradient-to-r from-emerald-50 to-emerald-100 border-emerald-200"
                          }`}
                        >
                          <div className="flex-1">
                            <h4 className={`font-bold text-lg mb-1 ${
                              announcement.type === "warning" 
                                ? "text-yellow-900" 
                                : announcement.type === "alert" 
                                ? "text-red-900" 
                                : "text-emerald-900"
                            }`}>
                              {announcement.type === "warning" ? "⚠️" : announcement.type === "alert" ? "🚨" : "📢"} {announcement.title}
                            </h4>
                            <p className={`mb-2 ${
                              announcement.type === "warning" 
                                ? "text-yellow-700" 
                                : announcement.type === "alert" 
                                ? "text-red-700" 
                                : "text-emerald-700"
                            }`}>
                              {announcement.content}
                            </p>
                            <div className="flex justify-between items-center text-xs">
                              <p className={`${
                                announcement.type === "warning" 
                                  ? "text-yellow-600" 
                                  : announcement.type === "alert" 
                                  ? "text-red-600" 
                                  : "text-emerald-600"
                              }`}>
                                🕒 {format(new Date(announcement.createdAt), "PPp")}
                              </p>
                              {announcement.ligneId && (
                                <p className={`${
                                  announcement.type === "warning" 
                                    ? "text-yellow-600" 
                                    : announcement.type === "alert" 
                                    ? "text-red-600" 
                                    : "text-emerald-600"
                                }`}>
                                  🏭 Line {announcement.ligneId}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

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
