"use client";

import Image from "next/image";
import { MouseEvent, useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

type Event = {
  id: number;
  title: string;
  description: string;
  date: string;
};

interface EventCalendarProps {
  setSelectedDate?: (date: Date) => void;
}

type CalendarValue = Date | null | [Date | null, Date | null];

const EventCalendar = ({ setSelectedDate }: EventCalendarProps) => {
  const [value, onChange] = useState<Date>(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
  });
  const [editId, setEditId] = useState<number | null>(null);

  const selectedDateStr = value.toISOString().split("T")[0];

  const handleCalendarChange = (
    newValue: CalendarValue,
    event: MouseEvent<HTMLButtonElement>
  ) => {
    if (newValue instanceof Date) {
      onChange(newValue);
      if (setSelectedDate) {
        setSelectedDate(newValue);
      }
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const fetchEvents = async () => {
    const res = await fetch("/api/events");
    const data = await res.json();
    setEvents(data);
  };

  const handleAdd = async () => {
    if (form.title && form.description) {
      await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          date: selectedDateStr,
        }),
      });
      setForm({ title: "", description: "" });
      fetchEvents();
    }
  };

  const handleDelete = async (id: number) => {
    await fetch("/api/events", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchEvents();
  };

  const handleEdit = (event: Event) => {
    setForm({ title: event.title, description: event.description });
    setEditId(event.id);
  };

  const handleUpdate = async () => {
    if (editId && form.title && form.description) {
      await fetch("/api/events", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editId, ...form }),
      });
      setEditId(null);
      setForm({ title: "", description: "" });
      fetchEvents();
    }
  };

  const filteredEvents = events.filter(
    (e) => e.date.split("T")[0] === selectedDateStr
  );

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="bg-white p-4 rounded-md shadow-md">
      {/* Calendrier */}
      <Calendar onChange={handleCalendarChange} value={value} />

      {/* Titre */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold my-4">
          Événements pour le {selectedDateStr}
        </h1>
        <Image src="/moreDark.png" alt="more" width={20} height={20} />
      </div>

      {/* Formulaire */}
      <div className="space-y-2 mb-4">
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Titre de l'événement"
          className="w-full border px-2 py-1 rounded-md text-sm"
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full border px-2 py-1 rounded-md text-sm"
        />
        {editId ? (
          <button
            onClick={handleUpdate}
            className="bg-green-600 text-white px-4 py-1 rounded-md text-sm"
          >
            Mettre à jour
          </button>
        ) : (
          <button
            onClick={handleAdd}
            className="bg-blue-500 text-white px-4 py-1 rounded-md text-sm"
          >
            Ajouter
          </button>
        )}
      </div>

      {/* Liste des événements */}
      <div className="flex flex-col gap-4">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <div
              key={event.id}
              className="p-4 rounded-md border border-gray-200 bg-gray-50"
            >
              <div className="flex justify-between items-center">
                <h1 className="font-semibold text-gray-700">{event.title}</h1>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(event)}
                    className="text-xs bg-yellow-400 text-white px-2 py-1 rounded"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="text-xs bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
              <p className="mt-2 text-gray-600 text-sm">{event.description}</p>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-400">
            Aucun événement pour cette date.
          </p>
        )}
      </div>
    </div>
  );
};

export default EventCalendar;
