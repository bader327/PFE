"use client";
import { motion } from "framer-motion";
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
import CalendarEventsAndAnnouncements from "../../../components/CalendarEventsAndAnnouncements";
import SerialNumberModal from "../../../components/SerialNumberModal";

// Thresholds for KPIs
const thresholds = {
  ftq: 85,
  productionRate: 80,
  targetProduction: 100,
  rejectionRate: 5, // maximum threshold
};

// Generate random data for KPI charts
const generateRandomKpiData = () => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  return months.map((month) => ({
    name: month,
    ftq: Math.floor(Math.random() * 30) + 70,
    production: Math.floor(Math.random() * 40) + 60,
    rejets: Math.floor(Math.random() * 20) + 1,
    cible: Math.floor(Math.random() * 20) + 80,
  }));
};

const getWeekDates = (endDate = new Date()) => {
  return Array.from({ length: 7 }, (_, offset) => {
    const date = new Date(endDate);
    date.setDate(endDate.getDate() - offset);
    return date;
  }).reverse();
};

export default function LinePage() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [calendarDate, setCalendarDate] = useState<Date>(new Date());
  const [fileUploadDates, setFileUploadDates] = useState<
    { date: Date; id: string }[]
  >([]);
  const [fpsAlert, setFpsAlert] = useState<string | number | null>(null);
  const [detectedFps, setDetectedFps] = useState<any[]>([]);

  // KPI data state
  const [kpiData, setKpiData] = useState({
    summary: {
      produitsConformes: 0,
      produitsNonConformes: 0,
      bobinesIncompletes: 0,
      ftq: 0,
      tauxProduction: 0,
      tauxRejets: 0,
      productionCible: 0,
    },
    files: [
      {
        id: 0,
        uploadedAt: new Date().toISOString(),
        produitsNonConformes: 0,
        bobinesIncompletes: 0,
        serialsNOK: [] as number[],
        serialsIncomplets: [] as number[],
      },
    ],
    hourlyData: [] as any[],
  });

  // KPI stats for charts
  const [kpiStats, setKpiStats] = useState({
    date: getWeekDates(),
    produitsNonConformes: Array(14).fill(0),
    rejectRate: Array(14).fill(0),
    produitsConformes: Array(14).fill(0),
    ftq: Array(14).fill(0),
  });

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalSerials, setModalSerials] = useState<number[]>([]);

  // Handle calendar date change
  const handleCalendarDateChange = (date: Date) => {
    setCalendarDate(date);
  };

  // Fetch file upload dates when calendar date changes
  useEffect(() => {
    const fetchUploadDates = async () => {
      try {
        const response = await fetch(
          `/api/uploads/all-dates?ligneId=${id}&date=${calendarDate.toDateString()}`
        );
        const data = await response.json();
        const dates = data
          .filter((file: any) => file.fileDate)
          .map((file: any) => ({
            id: file._id,
            date: new Date(file.fileDate),
          }));
        setFileUploadDates(dates);
      } catch (error) {
        console.error("Error fetching upload dates:", error);
      }
    };

    fetchUploadDates();
  }, [calendarDate, id]);

  // Fetch data when selected file changes
  useEffect(() => {
    const fetchFileData = async () => {
      if (!selectedFileId) return;

      try {
        const response = await fetch(`/api/uploads/${selectedFileId}`);
        const result = await response.json();
        const record = result[0];

        setDetectedFps(record.detectedFps || []);
        setKpiData({
          summary: {
            produitsConformes: record.produitsConformes ?? 0,
            produitsNonConformes: record.produitsNonConformes ?? 0,
            bobinesIncompletes: record.bobinesIncompletes ?? 0,
            ftq: record.ftq ?? 0,
            tauxProduction: record.tauxProduction ?? 0,
            tauxRejets: record.tauxderejets ?? 0,
            productionCible: record.targetProduction ?? 0,
          },
          files: [
            {
              id: Date.now(),
              uploadedAt: new Date().toISOString(),
              produitsNonConformes: record.produitsNonConformes ?? 0,
              bobinesIncompletes: record.bobinesIncompletes ?? 0,
              serialsNOK: record.serialsNOK ?? [],
              serialsIncomplets: record.serialsIncomplets ?? [],
            },
          ],
          hourlyData: record.hourlyData ?? [],
        });
      } catch (error) {
        console.error("Error fetching file data:", error);
      }
    };

    fetchFileData();
  }, [selectedFileId]);

  // Fetch weekly stats
  useEffect(() => {
    const fetchWeeklyStats = async () => {
      try {
        const response = await fetch(
          `/api/uploads/weekly?startDate=${kpiStats.date[0]}&endDate=${kpiStats.date[6]}&ligneId=${id}`
        );
        const result = await response.json();

        if (result) {
          setKpiStats({
            date: result.date as Date[],
            produitsConformes: result.produitsConformes as number[],
            produitsNonConformes: result.produitsNonConformes as number[],
            rejectRate: result.tauxderejets as number[],
            ftq: result.ftq as number[],
          });
        }
      } catch (error) {
        console.error("Error fetching weekly stats:", error);
      }
    };

    fetchWeeklyStats();
  }, [id, kpiStats.date]);

  // Initial data fetch
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await fetch(
          `/api/uploads/by-hour?date=${new Date().toUTCString()}&ligneId=${id}`
        );
        const result = await response.json();
        const record = result[0];

        setDetectedFps(record.detectedFps || []);
        setKpiData({
          summary: {
            produitsConformes: record.produitsConformes ?? 0,
            produitsNonConformes: record.produitsNonConformes ?? 0,
            bobinesIncompletes: record.bobinesIncompletes ?? 0,
            ftq: record.ftq ?? 0,
            tauxProduction: record.tauxProduction ?? 0,
            tauxRejets: record.tauxderejets ?? 0,
            productionCible: record.targetProduction ?? 0,
          },
          files: [
            {
              id: Date.now(),
              uploadedAt: new Date().toISOString(),
              produitsNonConformes: record.produitsNonConformes ?? 0,
              bobinesIncompletes: record.bobinesIncompletes ?? 0,
              serialsNOK: record.serialsNOK ?? [],
              serialsIncomplets: record.serialsIncomplets ?? [],
            },
          ],
          hourlyData: record.hourlyData ?? [],
        });
      } catch (error) {
        console.error("Error fetching initial data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [id]);

  // Handle file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("ligneId", id as string);

      const response = await fetch("/api/uploads", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      setDetectedFps(result.detectedFps || []);

      setKpiData({
        summary: {
          produitsConformes: result.produitsConformes ?? 0,
          produitsNonConformes: result.produitsNonConformes ?? 0,
          bobinesIncompletes: result.bobinesIncompletes ?? 0,
          ftq: result.ftq ?? 0,
          tauxProduction: result.tauxProduction ?? 0,
          tauxRejets: result.rejectRate ?? 0,
          productionCible: result.targetProduction ?? 0,
        },
        files: [
          {
            id: Date.now(),
            uploadedAt: new Date().toISOString(),
            produitsNonConformes: result.produitsNonConformes ?? 0,
            bobinesIncompletes: result.bobinesIncompletes ?? 0,
            serialsNOK: result.serialsNOK ?? [],
            serialsIncomplets: result.serialsIncomplets ?? [],
          },
        ],
        hourlyData: result.hourlyData ?? [],
      });

      if (result.alertes?.length > 0) {
        setFpsAlert(Math.floor(Math.random() * 9000) + 1000);
      }
    } catch (error) {
      console.error("Error processing file:", error);
      setError("File processing error. Please check the format.");
    }
  };

  // Check if value is below threshold
  const isBelowThreshold = (value: number, threshold: number) =>
    value < threshold;

  // Open serial number modal
  const openSerialModal = (title: string, serials: number[]) => {
    setModalTitle(title);
    setModalSerials(serials);
    setModalOpen(true);
  };

  // Navigate to FPS details
  const navigateToFpsDetails = () => {
    if (detectedFps.length > 0) {
      const bobineNumber = detectedFps[0].bobine;
      const defautType = detectedFps[0].defaut || "";
      router.push(`/niveauligne?bobine=${bobineNumber}&defaut=${defautType}`);
    } else {
      setFpsAlert(Math.floor(Math.random() * 9000) + 1000);
      router.push(`/niveauligne?bobine=${fpsAlert}`);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-4xl font-bold text-center mb-8">
        Dashboard Ligne {id}
      </h1>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-2/3 space-y-8">
          {/* File upload and FPS section */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 items-center relative">
            {/* File upload button */}
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

            {/* Add FPS button */}
            <div className="relative">
              <button
                onClick={navigateToFpsDetails}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full shadow relative"
              >
                ➕ Ajouter FPS
              </button>

              {/* FPS alerts */}
              {detectedFps.map((fps) => (
                <div
                  key={fps.bobine}
                  className="relative mt-6 w-full max-w-xl rounded-2xl border border-red-200 bg-gradient-to-r from-white via-red-50 to-white px-6 py-5 shadow-lg ring-1 ring-red-100 transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl"
                >
                  <div className="absolute -top-3 left-4 flex items-center gap-1 rounded-full bg-red-500 px-3 py-1 text-xs font-semibold text-white shadow-md animate-bounce">
                    ⚠️ Alerte FPS
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-red-600 shadow-inner">
                      <svg
                        className="h-6 w-6 animate-pulse"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 9v2m0 4h.01M5.07 5.07l1.41 1.41M1 12h2m2.93 6.93l1.41-1.41M12 1v2m6.07 1.93l-1.41 1.41M23 12h-2m-2.93 6.93l-1.41-1.41M12 23v-2"
                        />
                      </svg>
                    </div>

                    <div className="flex-1">
                      <h4 className="text-base font-semibold text-red-700 mb-1">
                        Défaut détecté sur une bobine
                      </h4>
                      <p className="text-sm text-gray-700 mb-3">
                        Une erreur critique a été identifiée sur la{" "}
                        <span className="font-bold text-red-600">
                          bobine #{fps.bobine}
                        </span>
                        {fps.defaut ? ` pour le défaut ${fps.defaut}` : ""}.
                      </p>
                      <button
                        onClick={() =>
                          router.push(
                            `/niveauligne?bobine=${fps.bobine}&defaut=${fps.defaut || ""}`
                          )
                        }
                        className="mt-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm transition-colors"
                      >
                        Voir les détails de la bobine
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* File selection dropdown */}
            {fileUploadDates.length > 0 && (
              <select
                className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                onChange={(e) => setSelectedFileId(e.target.value)}
                value={selectedFileId || ""}
              >
                {fileUploadDates.map((file) => (
                  <option key={file.id} value={file.id}>
                    {file.date.toLocaleString("tn-TN")}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* KPI Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Conforming Products */}
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

            {/* Non-Conforming Products */}
            <div
              onClick={() => {
                if (kpiData.files[0]?.serialsNOK?.length > 0) {
                  openSerialModal(
                    "Numéros de série - Produits Non Conformes",
                    kpiData.files[0].serialsNOK
                  );
                }
              }}
              className={`p-5 rounded-3xl shadow-lg border transition duration-300 ease-in-out transform hover:scale-[1.03] cursor-pointer ${
                kpiData.summary.produitsNonConformes > 0
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
                  : "✅ Aucun produit non conforme"}
              </p>
            </div>

            {/* Incomplete Coils */}
            <div
              onClick={() => {
                if (kpiData.files[0]?.serialsIncomplets?.length > 0) {
                  openSerialModal(
                    "Numéros de série - Bobines Incomplètes",
                    kpiData.files[0].serialsIncomplets
                  );
                }
              }}
              className={`p-5 rounded-3xl shadow-lg border transition duration-300 ease-in-out transform hover:scale-[1.03] cursor-pointer ${
                kpiData.summary.bobinesIncompletes > 0
                  ? "bg-orange-100 border-orange-400"
                  : "bg-white border-gray-200"
              }`}
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Bobines Incomplètes
              </h3>
              <p className="text-4xl font-extrabold text-gray-900">
                {kpiData.summary.bobinesIncompletes}
              </p>
              <p
                className={`mt-3 text-sm font-semibold ${
                  kpiData.summary.bobinesIncompletes > 0
                    ? "text-orange-600"
                    : "text-green-600"
                }`}
              >
                {kpiData.summary.bobinesIncompletes > 0
                  ? `⚠ ${kpiData.summary.bobinesIncompletes} bobine(s) incomplète(s)`
                  : "✅ Aucune bobine incomplète"}
              </p>
            </div>

            {/* FTQ (First Time Quality) */}
            <div
              className={`p-5 rounded-3xl shadow-lg border transition duration-300 ease-in-out transform hover:scale-[1.03] ${
                isBelowThreshold(kpiData.summary.ftq, thresholds.ftq)
                  ? "bg-red-100 border-red-400"
                  : "bg-white border-gray-200"
              }`}
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                FTQ (First Time Quality)
              </h3>
              <p className="text-4xl font-extrabold text-gray-900">
                {kpiData.summary.ftq.toFixed(1)}%
              </p>
              <p
                className={`mt-3 text-sm font-semibold ${
                  isBelowThreshold(kpiData.summary.ftq, thresholds.ftq)
                    ? "text-red-600"
                    : "text-green-600"
                }`}
              >
                {isBelowThreshold(kpiData.summary.ftq, thresholds.ftq)
                  ? `⚠ FTQ en dessous du seuil (${thresholds.ftq}%)`
                  : `✅ FTQ dans la norme (>${thresholds.ftq}%)`}
              </p>
            </div>

            {/* Rejection Rate */}
            <div
              className={`p-5 rounded-3xl shadow-lg border transition duration-300 ease-in-out transform hover:scale-[1.03] ${
                kpiData.summary.tauxRejets > thresholds.rejectionRate
                  ? "bg-red-100 border-red-400"
                  : "bg-white border-gray-200"
              }`}
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Taux de Rejets
              </h3>
              <p className="text-4xl font-extrabold text-gray-900">
                {kpiData.summary.tauxRejets.toFixed(1)}%
              </p>
              <p
                className={`mt-3 text-sm font-semibold ${
                  kpiData.summary.tauxRejets > thresholds.rejectionRate
                    ? "text-red-600"
                    : "text-green-600"
                }`}
              >
                {kpiData.summary.tauxRejets > thresholds.rejectionRate
                  ? `⚠ Taux de rejets trop élevé (>${thresholds.rejectionRate}%)`
                  : `✅ Taux de rejets acceptable (<${thresholds.rejectionRate}%)`}
              </p>
            </div>

            {/* Target Production */}
            <div
              className={`p-5 rounded-3xl shadow-lg border transition duration-300 ease-in-out transform hover:scale-[1.03] ${
                isBelowThreshold(
                  kpiData.summary.productionCible,
                  thresholds.targetProduction
                )
                  ? "bg-yellow-100 border-yellow-400"
                  : "bg-white border-gray-200"
              }`}
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Production Cible
              </h3>
              <p className="text-4xl font-extrabold text-gray-900">
                {kpiData.summary.productionCible.toFixed(1)}%
              </p>
              <p
                className={`mt-3 text-sm font-semibold ${
                  isBelowThreshold(
                    kpiData.summary.productionCible,
                    thresholds.targetProduction
                  )
                    ? "text-yellow-600"
                    : "text-green-600"
                }`}
              >
                {isBelowThreshold(
                  kpiData.summary.productionCible,
                  thresholds.targetProduction
                )
                  ? `⚠ En dessous de l'objectif (${thresholds.targetProduction}%)`
                  : `✅ Objectif atteint (${thresholds.targetProduction}%)`}
              </p>
            </div>

            {/* Production Rate */}
            <div
              className={`p-5 rounded-3xl shadow-lg border transition duration-300 ease-in-out transform hover:scale-[1.03] ${
                isBelowThreshold(
                  kpiData.summary.tauxProduction,
                  thresholds.productionRate
                )
                  ? "bg-orange-100 border-orange-400"
                  : "bg-white border-gray-200"
              }`}
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Taux de Production
              </h3>
              <p className="text-4xl font-extrabold text-gray-900">
                {kpiData.summary.tauxProduction.toFixed(1)}%
              </p>
              <p
                className={`mt-3 text-sm font-semibold ${
                  isBelowThreshold(
                    kpiData.summary.tauxProduction,
                    thresholds.productionRate
                  )
                    ? "text-orange-600"
                    : "text-green-600"
                }`}
              >
                {isBelowThreshold(
                  kpiData.summary.tauxProduction,
                  thresholds.productionRate
                )
                  ? `⚠ Taux de production faible (<${thresholds.productionRate}%)`
                  : `✅ Taux de production optimal (>${thresholds.productionRate}%)`}
              </p>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Conforming Products Chart */}
            <ChartBox title="Produits conformes">
              <ResponsiveContainer width="100%" height={250}>
                <LineChart
                  data={kpiStats.date.map((date, index) => ({
                    date,
                    value: kpiStats.produitsConformes[index],
                  }))}
                >
                  <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" />
                  <XAxis dataKey="date" stroke="#475569" />
                  <YAxis stroke="#475569" />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#10b981"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartBox>

            {/* Non-Conforming Products Chart */}
            <ChartBox title="Produits non conformes">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart
                  data={kpiStats.date.map((date, index) => ({
                    date,
                    value: kpiStats.produitsNonConformes[index],
                  }))}
                >
                  <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" />
                  <XAxis dataKey="date" stroke="#475569" />
                  <YAxis stroke="#475569" />
                  <Tooltip />
                  <Bar dataKey="value" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </ChartBox>

            {/* Rejection Rate Chart */}
            <ChartBox title="Taux de rejets">
              <ResponsiveContainer width="100%" height={250}>
                <LineChart
                  data={kpiStats.date.map((date, index) => ({
                    date,
                    value: kpiStats.rejectRate[index],
                  }))}
                >
                  <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" />
                  <XAxis dataKey="date" stroke="#475569" />
                  <YAxis stroke="#475569" />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#3b82f6"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartBox>

            {/* FTQ Chart */}
            <ChartBox title="FTQ">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart
                  data={kpiStats.date.map((date, index) => ({
                    date,
                    value: kpiStats.ftq[index],
                  }))}
                >
                  <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" />
                  <XAxis dataKey="date" stroke="#475569" />
                  <YAxis stroke="#475569" />
                  <Tooltip />
                  <Bar dataKey="value" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </ChartBox>
          </div>

          {/* Hourly Production Analysis */}
          <div className="space-y-4 mt-8">
            <div className="flex items-center">
              <BarChart3 className="mr-2 h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-bold">
                Analyse Horaire de la Production
              </h2>
            </div>
          </div>

          {/* KPI Evolution */}
          <div className="space-y-4 mt-8">
            <h2 className="text-2xl font-bold">Évolution des KPI (7 jours)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <KpiChart
                title="Production Rate"
                data={generateRandomKpiData()}
                dataKey="production"
                stroke="#22c55e"
              />
              <KpiChart
                title="Reject Rate"
                data={generateRandomKpiData()}
                dataKey="rejets"
                stroke="#ef4444"
              />
              <KpiChart
                title="Conformity Rate"
                data={generateRandomKpiData()}
                dataKey="ftq"
                stroke="#3b82f6"
              />
              <KpiChart
                title="Target Production"
                data={generateRandomKpiData()}
                dataKey="cible"
                stroke="#a855f7"
              />
            </div>
          </div>
        </div>

        {/* Calendar and Events Section */}
        <div className="lg:w-1/3 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="w-full flex flex-col gap-8"
          >
            <CalendarEventsAndAnnouncements
              ligneId={id as string}
              onCalendarDateChange={handleCalendarDateChange}
            />
          </motion.div>
        </div>
      </div>

      {/* Serial Number Modal */}
      <SerialNumberModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalTitle}
        serialNumbers={modalSerials}
      />
    </div>
  );
}

// Component for displaying a chart box
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

// Component for KPI charts
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
        <XAxis dataKey="name" />
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
