"use client";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Announcements from "../../../components/Announcments";
import EventCalendar from "../../../components/EventCalendar";

const generateRandomKpiData = () => {
  const days = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
  return days.map((day) => ({
    day,
    productionRate: Math.random() * 100,
    rejectRate: Math.random() * 100,
    conformityRate: Math.random() * 100,
    targetProduction: Math.random() * 300,
  }));
};

export default function LignePage() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState<any[]>([]);
  const [randomData, setRandomData] = useState({
    conformes: 0,
    nonConformes: 0,
    heures: 0,
  });
  const [kpis, setKpis] = useState({
    productionRate: 0,
    rejectRate: 0,
    conformityRate: 0,
    targetProduction: 0,
  });
  const [kpiChartData, setKpiChartData] = useState<any[]>([]);
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [fpsAlert, setFpsAlert] = useState<number | null>(null); // Alerte FPS

  useEffect(() => {
    // Générer des valeurs aléatoires
    setRandomData({
      conformes: Math.floor(Math.random() * 500),
      nonConformes: Math.floor(Math.random() * 300),
      heures: Math.floor(Math.random() * 8) + 1,
    });
    setKpis({
      productionRate: Math.random() * 100,
      rejectRate: Math.random() * 100,
      conformityRate: Math.random() * 100,
      targetProduction: Math.random() * 300,
    });
    setKpiChartData(generateRandomKpiData());

    // Alerte FPS activée par défaut
    const randomAlert = Math.floor(Math.random() * 9000) + 1000;
    setFpsAlert(randomAlert);
  }, []);

  const handleFileUpload = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const lines = text.trim().split("\n");
    const extracted = lines.slice(1).map((line: string) => {
      const [date, conformes, nonConformes, heures] = line.split(",");
      return {
        date,
        conformes: Number(conformes),
        nonConformes: Number(nonConformes),
        heures: Number(heures),
      };
    });
    setData(extracted);
  };

  const checkAlert = (value: number, threshold: number) => value < threshold;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-4xl font-bold text-center mb-8">
        Dashboard Ligne {id}
      </h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* LEFT SIDE */}
        <div className="lg:w-2/3 space-y-8">
          {/* Boutons */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 items-center relative">
            {/* Import CSV */}
            <label className="relative cursor-pointer">
              <div className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full shadow">
                <Image src="/upload.png" alt="Upload" width={20} height={20} />
                <span>Importer un CSV</span>
              </div>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </label>

            {/* Ajouter FPS */}
            <div className="relative">
              <button
                onClick={() => {
                  const randomAlert = Math.floor(Math.random() * 9000) + 1000;
                  setFpsAlert(randomAlert);
                  setTimeout(() => {
                    router.push("/niveauligne");
                  }, 2000);
                }}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full shadow relative"
              >
                ➕ Ajouter FPS
              </button>

              {/* Alerte affichée */}
              {fpsAlert && (
                <div className="mt-2 text-sm bg-red-100 text-red-600 rounded-md px-4 py-2 shadow animate-pulse">
                  ⚠ FPS détecté : Numéro #{fpsAlert}
                </div>
              )}
            </div>
          </div>

          {/* Sélecteur de date */}
          <select className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full">
            <option value="date-1">
              {new Date().toLocaleDateString("fr-FR", {
                year: "numeric",
                month: "long",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false,
              })}
            </option>
          </select>

          {/* Cartes simples */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card
              title="Produits conformes"
              value={randomData.conformes}
              color="green"
            />
            <Card
              title="Produits non conformes"
              value={randomData.nonConformes}
              color="red"
            />
            <Card
              title="Heures de travail"
              value={randomData.heures}
              color="blue"
            />
          </div>

          {/* Cartes KPI */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <KpiCard
              title="Taux de production"
              value={kpis.productionRate}
              alert={checkAlert(kpis.productionRate, 50)}
            />
            <KpiCard
              title="Taux de rejet"
              value={kpis.rejectRate}
              alert={checkAlert(kpis.rejectRate, 30)}
            />
            <KpiCard
              title="Taux de conformité"
              value={kpis.conformityRate}
              alert={checkAlert(kpis.conformityRate, 70)}
            />
            <KpiCard
              title="Production cible"
              value={kpis.targetProduction}
              alert={checkAlert(kpis.targetProduction, 40)}
            />
          </div>

          {/* Graphiques CSV */}
          {data.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <ChartBox title="Produits conformes">
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" />
                    <XAxis dataKey="date" stroke="#475569" />
                    <YAxis stroke="#475569" />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="conformes"
                      stroke="#10b981"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartBox>
              <ChartBox title="Produits non conformes">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={data}>
                    <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" />
                    <XAxis dataKey="date" stroke="#475569" />
                    <YAxis stroke="#475569" />
                    <Tooltip />
                    <Bar dataKey="nonConformes" fill="#ef4444" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartBox>
              <ChartBox title="Heures de travail">
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" />
                    <XAxis dataKey="date" stroke="#475569" />
                    <YAxis stroke="#475569" />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="heures"
                      stroke="#3b82f6"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartBox>
            </div>
          )}

          {/* KPI sur 7 jours */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Évolution des KPI (7 jours)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <KpiChart
                title="Production Rate"
                data={kpiChartData}
                dataKey="productionRate"
                stroke="#22c55e"
              />
              <KpiChart
                title="Reject Rate"
                data={kpiChartData}
                dataKey="rejectRate"
                stroke="#ef4444"
              />
              <KpiChart
                title="Conformity Rate"
                data={kpiChartData}
                dataKey="conformityRate"
                stroke="#3b82f6"
              />
              <KpiChart
                title="Target Production"
                data={kpiChartData}
                dataKey="targetProduction"
                stroke="#a855f7"
              />
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="lg:w-1/3 space-y-8">
          <EventCalendar setSelectedDate={setCalendarDate} />
          <Announcements />
        </div>
      </div>
    </div>
  );
}

// Composants réutilisables
const Card = ({
  title,
  value,
  color,
}: {
  title: string;
  value: number;
  color: "green" | "red" | "blue";
}) => {
  const borders = {
    green: "border-l-4 border-green-500",
    red: "border-l-4 border-red-500",
    blue: "border-l-4 border-blue-500",
  };
  const texts = {
    green: "text-green-600",
    red: "text-red-600",
    blue: "text-blue-600",
  };
  return (
    <div className={`p-6 bg-white rounded-xl shadow ${borders[color]}`}>
      <h3 className="text-gray-600 uppercase text-sm">{title}</h3>
      <p className={`mt-2 text-3xl font-bold ${texts[color]}`}>{value}</p>
    </div>
  );
};

const KpiCard = ({
  title,
  value,
  alert,
}: {
  title: string;
  value: number;
  alert: boolean;
}) => (
  <div
    className={`p-6 bg-white rounded-xl shadow ${
      alert ? "border-l-4 border-red-500" : "border-l-4 border-green-500"
    }`}
  >
    <h3 className="text-gray-500 uppercase text-sm">{title}</h3>
    <p className="mt-2 text-2xl font-bold text-gray-800">{value.toFixed(2)}%</p>
    {alert && (
      <p className="mt-1 text-xs text-red-600">⚠ KPI en dessous du seuil</p>
    )}
  </div>
);

const ChartBox = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="bg-white p-4 rounded-xl shadow">
    <h4 className="text-gray-700 font-semibold text-center mb-3">{title}</h4>
    {children}
  </div>
);

const KpiChart = ({
  title,
  data,
  dataKey,
  stroke,
}: {
  title: string;
  data: any[];
  dataKey: string;
  stroke: string;
}) => (
  <ChartBox title={title}>
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke={stroke}
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  </ChartBox>
);
