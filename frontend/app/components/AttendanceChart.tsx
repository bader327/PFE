"use client";
import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const lignes = [
  "Ligne 1",
  "Ligne 2",
  "Ligne 3",
  "Ligne 4",
  "Ligne 5",
  "Ligne 6",
  "Ligne 7",
];

const initialData = lignes.reduce((acc, ligne) => {
  acc[ligne] = { conforme: 0, nonConforme: 0 };
  return acc;
}, {} as Record<string, { conforme: number; nonConforme: number }>);

export default function AttendanceChart() {
  const [selectedLine, setSelectedLine] = useState("Ligne 1");
  const [data, setData] = useState(initialData);
  const [conforme, setConforme] = useState("");
  const [nonConforme, setNonConforme] = useState("");

  const handleSave = () => {
    setData((prev) => ({
      ...prev,
      [selectedLine]: {
        conforme: Number(conforme),
        nonConforme: Number(nonConforme),
      },
    }));
    setConforme("");
    setNonConforme("");
  };

  const chartData = Object.entries(data).map(([name, values]) => ({
    name,
    Conforme: values.conforme,
    "Non Conforme": values.nonConforme,
  }));

  return (
    <div className="bg-white p-6 rounded-xl shadow-md w-full">
      <h2 className="text-xl font-semibold mb-4 text-center">
        Production par Ligne
      </h2>

      {/* Lignes sélection */}
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {lignes.map((ligne) => (
          <button
            key={ligne}
            onClick={() => setSelectedLine(ligne)}
            className={`px-3 py-1 text-sm rounded-full border ${
              selectedLine === ligne
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {ligne}
          </button>
        ))}
      </div>

      {/* Formulaire de saisie */}
      <div className="flex flex-wrap justify-center gap-4 mb-4">
        <input
          type="number"
          placeholder="Conforme"
          value={conforme}
          onChange={(e) => setConforme(e.target.value)}
          className="w-28 px-2 py-1 text-sm border rounded-md"
        />
        <input
          type="number"
          placeholder="Non Conforme"
          value={nonConforme}
          onChange={(e) => setNonConforme(e.target.value)}
          className="w-28 px-2 py-1 text-sm border rounded-md"
        />
        <button
          onClick={handleSave}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded-md text-sm"
        >
          Enregistrer
        </button>
      </div>

      {/* Graphique */}
      <div className="w-full h-72">
        <ResponsiveContainer>
          <BarChart data={chartData}>
            <XAxis dataKey="name" interval={0} />
            <YAxis />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: "12px" }} />
            <Bar dataKey="Conforme" fill="#4ade80" />
            <Bar dataKey="Non Conforme" fill="#f87171" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
