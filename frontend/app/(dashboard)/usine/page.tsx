"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const initialKpis = {
  ftq: 82, // sous seuil
  tauxProduction: 85, // au-dessus
  productionCible: 95, // sous seuil
  tauxRejets: 6, // au-dessus seuil (inverse)
};

const seuils = {
  ftq: 85,
  tauxProduction: 80,
  productionCible: 100,
  tauxRejets: 5, // seuil max
};

const graphData = [
  { name: "Lundi", conforme: 120, nonConforme: 30 },
  { name: "Mardi", conforme: 140, nonConforme: 20 },
  { name: "Mercredi", conforme: 110, nonConforme: 25 },
  { name: "Jeudi", conforme: 150, nonConforme: 10 },
  { name: "Vendredi", conforme: 130, nonConforme: 15 },
];

const graphDataByDay = [
  { jour: "Lundi", ftq: 82 },
  { jour: "Mardi", ftq: 85 },
  { jour: "Mercredi", ftq: 88 },
  { jour: "Jeudi", ftq: 90 },
  { jour: "Vendredi", ftq: 87 },
];

export default function Page() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [fileName, setFileName] = useState<string | null>(null);
  const kpis = initialKpis;

  const kpiList = [
    { key: "ftq", label: "FTQ (%)", value: kpis.ftq, seuil: seuils.ftq },
    {
      key: "tauxProduction",
      label: "Taux de Production (%)",
      value: kpis.tauxProduction,
      seuil: seuils.tauxProduction,
    },
    {
      key: "productionCible",
      label: "Production Cible",
      value: kpis.productionCible,
      seuil: seuils.productionCible,
    },
    {
      key: "tauxRejets",
      label: "Taux de Rejets (%)",
      value: kpis.tauxRejets,
      seuil: seuils.tauxRejets,
      inverse: true,
    },
  ];

  // Animations conteneur upload + datepicker
  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
  };

  // Animation bouton upload hover (scale + ombre pulsante)
  const uploadButtonHover = {
    scale: 1.05,
    boxShadow: "0 0 15px rgba(99, 102, 241, 0.7)", // violet pulse
    transition: { yoyo: Infinity, duration: 0.8, ease: "easeInOut" },
  };

  // Animation DatePicker slide horizontal
  const datepickerVariants = {
    hidden: { x: 30, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.7 } },
  };

  return (
    <div className="p-6 space-y-10 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-extrabold text-center mb-8 text-indigo-700 select-none">
        Production de l'Usine
      </h1>

      <motion.div
        className="flex flex-col md:flex-row items-center justify-between gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div whileHover={uploadButtonHover} className="relative">
          <input
            type="file"
            accept=".xlsx, .xls, .csv"
            id="upload-file"
            className="hidden"
            onChange={(e) => {
              const files = e.target.files;
              if (files && files[0]) {
                setFileName(files[0].name);
              }
            }}
          />
          <label
            htmlFor="upload-file"
            className="cursor-pointer inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold shadow-md select-none
              transition-transform duration-300 ease-in-out"
          >
            Télécharger un fichier
          </label>
          {fileName && (
            <p className="text-sm text-gray-700 mt-2 ml-1 truncate max-w-xs">
              Fichier sélectionné : {fileName}
            </p>
          )}
        </motion.div>

        <motion.div
          className="flex items-center gap-2"
          variants={datepickerVariants}
          initial="hidden"
          animate="visible"
        >
          <span className="font-medium text-gray-700 select-none">Date :</span>
          <DatePicker
            selected={selectedDate}
            onChange={(date: React.SetStateAction<Date>) =>
              setSelectedDate(date)
            }
            className="border border-gray-300 px-3 py-2 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            dateFormat="dd/MM/yyyy"
          />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {kpiList.map(({ key, label, value, seuil, inverse }) => {
          const alertLow = inverse ? value > seuil : value < seuil;
          return (
            <div
              key={key}
              className={`p-5 rounded-3xl shadow-lg border transition duration-300 ease-in-out transform hover:scale-[1.03] ${
                alertLow
                  ? "bg-red-100 border-red-400"
                  : "bg-white border-gray-200"
              }`}
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                {label}
              </h3>
              <p className="text-4xl font-extrabold text-gray-900">{value}</p>
              <p
                className={`mt-3 text-sm font-semibold ${
                  alertLow ? "text-red-600" : "text-green-600"
                }`}
              >
                {alertLow
                  ? `⚠ ${label} est en dehors du seuil (${value})`
                  : `✅ ${label} est dans la norme (${value})`}
              </p>
            </div>
          );
        })}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="bg-white rounded-2xl shadow-lg p-6 h-[400px] border border-gray-200"
      >
        <h3 className="text-xl font-bold mb-4 text-center text-indigo-700">
          Production Conforme vs Non Conforme
        </h3>
        <ResponsiveContainer width="100%" height="90%">
          <BarChart data={graphData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
            <XAxis dataKey="name" stroke="#4c51bf" />
            <YAxis stroke="#4c51bf" />
            <Tooltip
              contentStyle={{ backgroundColor: "#f9fafb", borderRadius: 8 }}
              cursor={{ fill: "rgba(99,102,241,0.1)" }}
            />
            <Bar dataKey="conforme" fill="#4ade80" />
            <Bar dataKey="nonConforme" fill="#f87171" />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="bg-white rounded-2xl shadow-lg p-6 h-[400px] border border-gray-200"
      >
        <h3 className="text-xl font-bold mb-4 text-center text-indigo-700">
          Analyse de la Production Conforme (Aire)
        </h3>
        <ResponsiveContainer width="100%" height="90%">
          <AreaChart data={graphData}>
            <defs>
              <linearGradient id="colorConforme" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4ade80" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#4ade80" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="name" stroke="#4c51bf" />
            <YAxis stroke="#4c51bf" />
            <Tooltip
              contentStyle={{ backgroundColor: "#f9fafb", borderRadius: 8 }}
              cursor={{ stroke: "#4ade80", strokeWidth: 2 }}
            />
            <Area
              type="monotone"
              dataKey="conforme"
              stroke="#4ade80"
              fillOpacity={1}
              fill="url(#colorConforme)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="bg-white rounded-2xl shadow-lg p-6 h-[400px] border border-gray-200"
      >
        <h3 className="text-xl font-bold mb-4 text-center text-indigo-700">
          FTQ sur 7 Jours (Ligne)
        </h3>
        <ResponsiveContainer width="100%" height="90%">
          <LineChart data={graphDataByDay}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
            <XAxis dataKey="jour" stroke="#4c51bf" />
            <YAxis stroke="#4c51bf" domain={[70, 100]} />
            <Tooltip
              contentStyle={{ backgroundColor: "#f9fafb", borderRadius: 8 }}
              cursor={{ stroke: "#4c51bf", strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="ftq"
              stroke="#6366f1"
              strokeWidth={3}
              dot={{ r: 5, fill: "#6366f1" }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}
