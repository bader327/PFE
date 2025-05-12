"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

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

const LignePage = () => {
  const { id } = useParams();
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

  const handleFileUpload = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    const text = await file.text();
    const lines = text.trim().split("\n");
    const extractedData = lines.slice(1).map((line: { split: (arg0: string) => [any, any, any, any]; }) => {
      const [date, conformes, nonConformes, heures] = line.split(",");
      return {
        date,
        conformes: Number(conformes),
        nonConformes: Number(nonConformes),
        heures: Number(heures),
      };
    });
    setData(extractedData);
  };

  const checkAlert = (value: number, threshold: number) => value < threshold;

  useEffect(() => {
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
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-7xl mx-auto space-y-10">
        <h1 className="text-4xl font-extrabold text-gray-800 text-center">
          Dashboard Ligne {id}
        </h1>

        {/* Upload */}
        <div className="flex justify-center">
          <label
            htmlFor="csv"
            className="group relative flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-full shadow-xl transition"
          >
            <Image src="/upload.png" alt="Upload" width={24} height={24} />
            <span className="font-semibold">Importer un CSV</span>
            <input
              id="csv"
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full blur opacity-30 group-hover:opacity-50 transition" />
          </label>
        </div>

        {/* Random Data Cards */}
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

        {/* KPI Cards */}
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

        {/* CSV Charts */}
        {data.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <ChartBox title="Produits conformes">
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" />
                  <XAxis dataKey="date" stroke="#475569" />
                  <YAxis stroke="#475569" />
                  <Tooltip wrapperClassName="bg-white rounded-md shadow-lg" />
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
                  <Tooltip wrapperClassName="bg-white rounded-md shadow-lg" />
                  <Bar
                    dataKey="nonConformes"
                    fill="#ef4444"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartBox>
            <ChartBox title="Heures de travail">
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" />
                  <XAxis dataKey="date" stroke="#475569" />
                  <YAxis stroke="#475569" />
                  <Tooltip wrapperClassName="bg-white rounded-md shadow-lg" />
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

        {/* KPI Charts Over 7 Days */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">
            Évolution des KPI (7 jours)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
    </div>
  );
};

const Card = ({
  title,
  value,
  color,
}: {
  title: string;
  value: number;
  color: string;
}) => (
  <div
    className={`p-6 bg-white rounded-xl shadow-lg border-l-4 border-${color}-500`}
  >
    <h3 className="text-gray-600 uppercase text-sm">{title}</h3>
    <p className={`mt-2 text-3xl font-bold text-${color}-600`}>{value}</p>
  </div>
);

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
    className={`p-6 rounded-xl shadow-lg ${
      alert ? "bg-red-50" : "bg-green-50"
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
  <div className="bg-white p-4 rounded-xl shadow-lg">
    <h4 className="text-center font-semibold text-gray-700 mb-3">{title}</h4>
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
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" />
        <XAxis dataKey="day" stroke="#475569" />
        <YAxis stroke="#475569" />
        <Tooltip wrapperClassName="bg-white rounded-md shadow-lg" />
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

export default LignePage;
