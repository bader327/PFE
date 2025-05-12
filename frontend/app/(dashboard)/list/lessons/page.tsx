"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FaSpinner } from "react-icons/fa";

export default function ChatbotKPIPage() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  );
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ message: input }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Erreur serveur: ${errorText}`);
      }

      const data = await res.json();

      if (data.reply) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.reply },
        ]);
      } else {
        throw new Error("Aucune réponse reçue.");
      }
    } catch (err: any) {
      setError(err.message || "Erreur inconnue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-lg h-[90vh] flex flex-col">
      <h1 className="text-3xl font-bold mb-4 text-center text-blue-700">
        🤖 Assistant KPI Industriel
      </h1>

      <div className="flex-1 overflow-y-auto space-y-4 border rounded-lg p-4 bg-gray-50 shadow-inner">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`max-w-xl ${
              msg.role === "user" ? "ml-auto text-right" : "mr-auto text-left"
            }`}
          >
            <div
              className={`px-4 py-3 rounded-2xl shadow-md inline-block ${
                msg.role === "user"
                  ? "bg-blue-200 text-blue-900"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {msg.content}
            </div>
          </motion.div>
        ))}

        {loading && (
          <div className="flex justify-center items-center text-gray-500">
            <FaSpinner className="animate-spin" size={20} />
            <span className="ml-2">Le chatbot rédige une réponse…</span>
          </div>
        )}

        {error && <div className="text-red-500 text-sm">{error}</div>}
      </div>

      <div className="mt-4 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Pose ta question sur un KPI industriel..."
          className="flex-1 border px-4 py-2 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          aria-label="Poser une question"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition"
        >
          Envoyer
        </button>
      </div>
    </div>
  );
}
