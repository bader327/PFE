"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

type Event = {
  id: number;
  title: string;
  description: string;
  date: string;
};

type Announcement = {
  id: number;
  title: string;
  content: string;
  createdAt: string;
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

  const selectedDateStr = format(selectedDate, "yyyy-MM-dd");

  const fetchData = async () => {
    const e = await fetch("/api/events").then((res) => res.json());
    const a = await fetch("/api/announcements").then((res) => res.json());
    setEvents(e);
    setAnnouncements(a);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddEvent = async () => {
    await fetch("/api/events", {
      method: "POST",
      body: JSON.stringify({ ...eventForm, date: selectedDateStr }),
      headers: { "Content-Type": "application/json" },
    });
    setEventForm({ title: "", description: "" });
    fetchData();
  };

  const handleAddAnnouncement = async () => {
    await fetch("/api/announcements", {
      method: "POST",
      body: JSON.stringify({ ...announcementForm, date: selectedDateStr }),
      headers: { "Content-Type": "application/json" },
    });
    setAnnouncementForm({ title: "", content: "" });
    fetchData();
  };

  const handleDelete = async (type: "event" | "announcement", id: number) => {
    await fetch(`/api/${type === "event" ? "events" : "announcements"}`, {
      method: "DELETE",
      body: JSON.stringify({ id }),
      headers: { "Content-Type": "application/json" },
    });
    fetchData();
  };

  const eventsOfDay = events.filter(
    (e) => e.date.split("T")[0] === selectedDateStr
  );
  const announcementsOfDay = announcements.filter(
    (a) => a.createdAt.split("T")[0] === selectedDateStr
  );

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <DayPicker
        selected={selectedDate}
        onSelect={(date) => date && setSelectedDate(date)}
      />

      <h2 className="text-xl font-bold mt-6">
        📅 Date sélectionnée : {selectedDateStr}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        {/* Events Section */}
        <div>
          <h3 className="text-lg font-semibold text-blue-600">Événements</h3>
          <ul className="space-y-2 mt-2">
            {eventsOfDay.length ? (
              eventsOfDay.map((e) => (
                <li key={e.id} className="bg-blue-50 p-3 rounded shadow-sm">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">{e.title}</h4>
                      <p className="text-sm text-gray-700">{e.description}</p>
                    </div>
                    <button
                      onClick={() => handleDelete("event", e.id)}
                      className="text-red-500"
                    >
                      🗑
                    </button>
                  </div>
                </li>
              ))
            ) : (
              <p className="text-sm text-gray-500">Aucun événement</p>
            )}
          </ul>

          {/* Add Event */}
          <div className="mt-4 space-y-2">
            <input
              type="text"
              placeholder="Titre"
              className="border w-full px-2 py-1 rounded text-sm"
              value={eventForm.title}
              onChange={(e) =>
                setEventForm({ ...eventForm, title: e.target.value })
              }
            />
            <textarea
              placeholder="Description"
              className="border w-full px-2 py-1 rounded text-sm"
              value={eventForm.description}
              onChange={(e) =>
                setEventForm({ ...eventForm, description: e.target.value })
              }
            />
            <button
              onClick={handleAddEvent}
              className="bg-blue-500 text-white px-4 py-1 rounded text-sm"
            >
              Ajouter événement
            </button>
          </div>
        </div>

        {/* Announcements Section */}
        <div>
          <h3 className="text-lg font-semibold text-green-600">Annonces</h3>
          <ul className="space-y-2 mt-2">
            {announcementsOfDay.length ? (
              announcementsOfDay.map((a) => (
                <li key={a.id} className="bg-green-50 p-3 rounded shadow-sm">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">{a.title}</h4>
                      <p className="text-sm text-gray-700">{a.content}</p>
                    </div>
                    <button
                      onClick={() => handleDelete("announcement", a.id)}
                      className="text-red-500"
                    >
                      🗑
                    </button>
                  </div>
                </li>
              ))
            ) : (
              <p className="text-sm text-gray-500">Aucune annonce</p>
            )}
          </ul>

          {/* Add Announcement */}
          <div className="mt-4 space-y-2">
            <input
              type="text"
              placeholder="Titre"
              className="border w-full px-2 py-1 rounded text-sm"
              value={announcementForm.title}
              onChange={(e) =>
                setAnnouncementForm({
                  ...announcementForm,
                  title: e.target.value,
                })
              }
            />
            <textarea
              placeholder="Contenu"
              className="border w-full px-2 py-1 rounded text-sm"
              value={announcementForm.content}
              onChange={(e) =>
                setAnnouncementForm({
                  ...announcementForm,
                  content: e.target.value,
                })
              }
            />
            <button
              onClick={handleAddAnnouncement}
              className="bg-green-500 text-white px-4 py-1 rounded text-sm"
            >
              Ajouter annonce
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
