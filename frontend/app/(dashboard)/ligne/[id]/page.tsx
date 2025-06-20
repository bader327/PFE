"use client";
import { BarChart3 } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
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
import LineCalendar from "../../../components/LineCalendar";
import SerialNumberModal from "../../../components/SerialNumberModal";

// Définition des seuils pour les KPIs
const seuils = {
  ftq: 85,
  tauxProduction: 80,
  productionCible: 100,
  tauxRejets: 5, // seuil max
};

// Generate random data for KPI charts
const generateRandomKpiData = () => {
  const data = [];
  const categories = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  for (const month of categories) {
    data.push({
      name: month,
      ftq: Math.floor(Math.random() * 30) + 70,
      production: Math.floor(Math.random() * 40) + 60,
      rejets: Math.floor(Math.random() * 20) + 1,
      cible: Math.floor(Math.random() * 20) + 80,
    });
  }
  return data;
};

export default function LignePage() {
  const { id } = useParams();
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any[]>([]);
  const [randomData, setRandomData] = useState({
    conformes: 87,
    nonConformes: 13,
    heures: 768,
  });
  const [kpis, setKpis] = useState({
    productionRate: 85,
    rejectRate: 15,
    conformityRate: 87,
    targetProduction: 95,
  });
  const [kpiChartData, setKpiChartData] = useState<any[]>([]);
  const [fpsAlert, setFpsAlert] = useState<string | number | null>(null);
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [kpiData, setKpiData] = useState<any>({
    summary: {
      produitsConformes: 0,
      produitsNonConformes: 0,
      bobinesIncompletes: 0,
      ftq: 0,
      tauxProduction: 0,
      tauxRejets: 0,
      productionCible: 0,
    },
    chartData: [],
    files: [],
    hourlyData: [],
  });
  const [fpsRecords, setFpsRecords] = useState<any[]>([]);
  const [showFpsModal, setShowFpsModal] = useState(false);
  const [selectedHour, setSelectedHour] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalSerials, setModalSerials] = useState<number[]>([]);

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

    try {
      const buffer = await file.arrayBuffer();
      const formData = new FormData();
      formData.append("file", file);
      formData.append("ligneId", id as string);
      const reqResult = await fetch("/api/uploads", {
        method: "POST",
        body: formData,
      });
      console.log(reqResult);
      const result = await reqResult.json();
      // Update KPI data with the processed results
      setKpiData({
        summary: {
          produitsConformes: result.produitsConformes ?? 0,
          produitsNonConformes: result.produitsNonConformes ?? 0,
          bobinesIncompletes: result.bobinesIncompletes ?? 0,
          ftq: result.ftq,
          productionRate: result.tauxProduction ?? 0,
          tauxRejets: result.rejectRate ?? 0,
          productionCible: result.targetProduction ?? 0,
        },
        files: [
          {
            id: Date.now(),
            uploadedAt: new Date().toISOString(),
            produitsNonConformes: result.produitsNonConformes,
            bobinesIncompletes: result.bobinesIncompletes,
            serialsNOK: result.serialsNOK,
            serialsIncomplets: result.serialsIncomplets,
          },
        ],
        hourlyData: result.hourlyData,
      });

      // Update KPIs state
      setKpis({
        productionRate: result.tauxProduction,
        rejectRate: result.tauxRejets,
        conformityRate: result.ftq ?? 0,
        targetProduction: result.targetProduction ?? 0,
      });

      // Update random data for charts
      // setRandomData({
      //   conformes: result.produitsConformes,
      //   nonConformes: result.produitsNonConformes,
      //   heures: Object.keys(result.hourlyData).length
      // });

      // Check for FPS alerts from the parser
      if (result.alertes && result.alertes.length > 0) {
        const randomFpsNumber = Math.floor(Math.random() * 9000) + 1000;
        setFpsAlert(randomFpsNumber);
        // setTimeout(() => {
        //   router.push("/niveauligne");
        // }, 2000);
      }
    } catch (error) {
      console.error("Error processing file:", error);
      setError("Erreur lors du traitement du fichier. Vérifiez le format.");
    }
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
                <span>Importer un fichier</span>
              </div>
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
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
              {selectedDate.toLocaleDateString("fr-FR", {
                year: "numeric",
                month: "long",
                day: "2-digit",
              })}
            </option>
          </select>
          {/* Cartes KPI principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Carte Produits Conformes */}
            <div className="p-5 rounded-3xl shadow-lg border transition duration-300 ease-in-out transform hover:scale-[1.03] bg-white border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Produits Conformes
              </h3>
              <p className="text-4xl font-extrabold text-gray-900">
                {kpiData.summary.produitsConformes}
              </p>
              <p className="mt-3 text-sm font-semibold text-green-600">
                ✅ Produits validés par le contrôle qualité
              </p>
            </div>

            {/* Carte Produits Non Conformes */}
            <div
              onClick={() => {
                if (kpiData.files[0]?.serialsNOK?.length > 0) {
                  setModalTitle("Numéros de série - Produits Non Conformes");
                  setModalSerials(kpiData.files[0].serialsNOK);
                  setModalOpen(true);
                }
              }}
              className={`p-5 rounded-3xl shadow-lg border transition duration-300 ease-in-out transform hover:scale-[1.03] cursor-pointer ${
                randomData.nonConformes > 0
                  ? "bg-red-100 border-red-400"
                  : "bg-white border-gray-200"
              }`}
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Produits Non Conformes
              </h3>
              <p className="text-4xl font-extrabold text-gray-900">
                {kpiData.summary.produitsNonConformes}
              </p>
              <p
                className={`mt-3 text-sm font-semibold ${
                  kpiData.summary.produitsNonConformes > 0
                    ? "text-red-600"
                    : "text-green-600"
                }`}
              >
                {kpiData.summary.produitsNonConformes > 0
                  ? `⚠ ${kpiData.summary.produitsNonConformes} produit(s) avec défauts`
                  : `✅ Aucun produit non conforme`}
              </p>
            </div>

            {/* Carte Bobines Incomplètes */}
            <div
              onClick={() => {
                if (kpiData.files[0]?.serialsIncomplets?.length > 0) {
                  setModalTitle("Numéros de série - Bobines Incomplètes");
                  setModalSerials(kpiData.summary.serialsIncomplets);
                  setModalOpen(true);
                }
              }}
              className={`p-5 rounded-3xl shadow-lg border transition duration-300 ease-in-out transform hover:scale-[1.03] cursor-pointer ${
                (kpiData.summary.bobinesIncompletes || 0) > 0
                  ? "bg-orange-100 border-orange-400"
                  : "bg-white border-gray-200"
              }`}
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Bobines Incomplètes
              </h3>
              <p className="text-4xl font-extrabold text-gray-900">
                {kpiData.summary.bobinesIncompletes || 0}
              </p>
              <p
                className={`mt-3 text-sm font-semibold ${
                  (kpiData.summary.bobinesIncompletes || 0) > 0
                    ? "text-orange-600"
                    : "text-green-600"
                }`}
              >
                {(kpiData.summary.bobinesIncompletes || 0) > 0
                  ? `⚠ ${kpiData.summary.bobinesIncompletes} bobine(s) incomplète(s)`
                  : `✅ Aucune bobine incomplète`}
              </p>
            </div>

            {/* Carte FTQ */}
            <div
              className={`p-5 rounded-3xl shadow-lg border transition duration-300 ease-in-out transform hover:scale-[1.03] ${
                kpis.conformityRate < seuils.ftq
                  ? "bg-red-100 border-red-400"
                  : "bg-white border-gray-200"
              }`}
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                FTQ (First Time Quality)
              </h3>
              <p className="text-4xl font-extrabold text-gray-900">
                {kpis.conformityRate.toFixed(1)}%
              </p>
              <p
                className={`mt-3 text-sm font-semibold ${
                  kpis.conformityRate < seuils.ftq
                    ? "text-red-600"
                    : "text-green-600"
                }`}
              >
                {kpis.conformityRate < seuils.ftq
                  ? `⚠ FTQ en dessous du seuil (${seuils.ftq}%)`
                  : `✅ FTQ dans la norme (>${seuils.ftq}%)`}
              </p>
            </div>

            {/* Carte Taux de Rejets */}
            <div
              className={`p-5 rounded-3xl shadow-lg border transition duration-300 ease-in-out transform hover:scale-[1.03] ${
                kpis.rejectRate > seuils.tauxRejets
                  ? "bg-red-100 border-red-400"
                  : "bg-white border-gray-200"
              }`}
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Taux de Rejets
              </h3>
              <p className="text-4xl font-extrabold text-gray-900">
                {kpis.rejectRate.toFixed(1)}%
              </p>
              <p
                className={`mt-3 text-sm font-semibold ${
                  kpis.rejectRate > seuils.tauxRejets
                    ? "text-red-600"
                    : "text-green-600"
                }`}
              >
                {kpis.rejectRate > seuils.tauxRejets
                  ? `⚠ Taux de rejets trop élevé (>${seuils.tauxRejets}%)`
                  : `✅ Taux de rejets acceptable (<${seuils.tauxRejets}%)`}
              </p>
            </div>

            {/* Carte Production Cible */}
            <div
              className={`p-5 rounded-3xl shadow-lg border transition duration-300 ease-in-out transform hover:scale-[1.03] ${
                kpis.targetProduction < seuils.productionCible
                  ? "bg-yellow-100 border-yellow-400"
                  : "bg-white border-gray-200"
              }`}
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Production Cible
              </h3>
              <p className="text-4xl font-extrabold text-gray-900">
                {kpis.targetProduction.toFixed(1)}%
              </p>
              <p
                className={`mt-3 text-sm font-semibold ${
                  kpis.targetProduction < seuils.productionCible
                    ? "text-yellow-600"
                    : "text-green-600"
                }`}
              >
                {kpis.targetProduction < seuils.productionCible
                  ? `⚠ En dessous de l'objectif (${seuils.productionCible}%)`
                  : `✅ Objectif atteint (${seuils.productionCible}%)`}
              </p>
            </div>

            {/* Carte Taux de Production */}
            <div
              className={`p-5 rounded-3xl shadow-lg border transition duration-300 ease-in-out transform hover:scale-[1.03] ${
                kpis.productionRate < seuils.tauxProduction
                  ? "bg-orange-100 border-orange-400"
                  : "bg-white border-gray-200"
              }`}
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Taux de Production
              </h3>
              <p className="text-4xl font-extrabold text-gray-900">
                {kpis.productionRate.toFixed(1)}%
              </p>
              <p
                className={`mt-3 text-sm font-semibold ${
                  kpis.productionRate < seuils.tauxProduction
                    ? "text-orange-600"
                    : "text-green-600"
                }`}
              >
                {kpis.productionRate < seuils.tauxProduction
                  ? `⚠ Taux de production faible (<${seuils.tauxProduction}%)`
                  : `✅ Taux de production optimal (>${seuils.tauxProduction}%)`}
              </p>
            </div>
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
          )}{" "}
          {/* Hourly Analysis Section */}
          <div className="space-y-4 mt-8">
            <div className="flex items-center">
              <BarChart3 className="mr-2 h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-bold">
                Analyse Horaire de la Production
              </h2>
            </div>
          </div>
          {/* KPI sur 7 jours */}
          <div className="space-y-4 mt-8">
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
        </div>{" "}
        {/* RIGHT SIDE */}
        <div className="lg:w-1/3 space-y-8">
          {" "}
          <LineCalendar
            ligneId={id as string}
            setSelectedDate={setCalendarDate}
            className="shadow-xl"
          />
        </div>
      </div>

      {/* Modal pour afficher les numéros de série */}
      <SerialNumberModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalTitle}
        serialNumbers={modalSerials}
      />
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
