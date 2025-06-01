"use client";

import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

type Announcement = {
  id: number;
  title: string;
  content: string;
  createdAt: string;
};

const Announcements = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [form, setForm] = useState({ title: "", content: "" });

  const fetchAnnouncements = async () => {
    const res = await fetch("/api/announcements");
    const data = await res.json();
    setAnnouncements(data);
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = async () => {
    if (form.title && form.content) {
      const res = await fetch("/api/announcements", {
        method: "POST",
        body: JSON.stringify(form),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        setForm({ title: "", content: "" });
        fetchAnnouncements();
      } else {
        alert("Erreur lors de l'ajout de l'annonce.");
      }
    }
  };

  const selectedDateStr = selectedDate.toISOString().split("T")[0];

  const filteredAnnouncements = announcements.filter(
    (a) => a.createdAt.split("T")[0] === selectedDateStr
  );

  return (
    <div className="bg-white p-4 rounded-md">      <Calendar
        value={selectedDate}
        onChange={(date: any) => setSelectedDate(date)}
      />

      <h2 className="text-lg font-semibold my-4">
        Annonces du {selectedDateStr}
      </h2>

      <div className="space-y-2 mb-4">
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Titre de l'annonce"
          className="w-full border px-2 py-1 rounded-md text-sm"
        />
        <textarea
          name="content"
          value={form.content}
          onChange={handleChange}
          placeholder="Contenu"
          className="w-full border px-2 py-1 rounded-md text-sm"
        />
        <button
          onClick={handleAdd}
          className="bg-green-500 text-white px-4 py-1 rounded-md text-sm"
        >
          Ajouter l'annonce
        </button>
      </div>

      <div className="space-y-4">
        {filteredAnnouncements.length > 0 ? (
          filteredAnnouncements.map((a) => (
            <div
              key={a.id}
              className="p-4 border rounded-md bg-gray-50 shadow-sm"
            >
              <h3 className="font-semibold">{a.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{a.content}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-sm">Aucune annonce pour ce jour.</p>
        )}
      </div>
    </div>
  );
};

export default Announcements;
