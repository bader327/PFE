"use client";
import { motion } from "framer-motion";
import { AlertCircle, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Area,
  AreaChart,
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
import UploadButton from "../../components/UploadButton";

// Définition des seuils pour les KPIs
const seuils = {
  ftq: 85,
  tauxProduction: 80,
  productionCible: 100,
  tauxRejets: 5, // seuil max
};

export default function Page() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [kpiData, setKpiData] = useState<any>({
    summary: {
      produitsConformes: 0,
      produitsNonConformes: 0,
      bobinesIncompletes: 0,
      ftq: 0,
      tauxProduction: 0,
      tauxRejets: 0,
      productionCible: 0
    },
    chartData: [],
    files: []
  });
  const [modalContent, setModalContent] = useState<{
    title: string;
    data: any[];
    isOpen: boolean;
  }>({
    title: "",
    data: [],
    isOpen: false,
  });
  
  // Fonction pour formater la date en chaîne YYYY-MM-DD pour l'API
  const formatDateForApi = (date: Date) => {
    return date.toISOString().split('T')[0];
  };
  
  // Charger les données KPI
  useEffect(() => {
    const fetchKpiData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/kpi?date=${formatDateForApi(selectedDate)}`);
        
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des données KPI');
        }
        
        const data = await response.json();
        setKpiData(data);
      } catch (err) {
        console.error('Error fetching KPI data:', err);
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };
    
    fetchKpiData();
  }, [selectedDate]);  const [fileName, setFileName] = useState<string | null>(null);
  const initialKpis = {
    ftq: 85.3,
    tauxProduction: 78.5,
    productionCible: 95.0,
    tauxRejets: 6.2,
  };
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
  // Fonction pour ouvrir le modal des produits non conformes
  const showNonConformes = () => {
    // Extraire les IDs des produits non conformes de tous les fichiers
    const nonConformesIds = kpiData.files.flatMap((file: any) => {
      // Simuler l'extraction des IDs (à adapter selon la structure réelle des données)
      return Array.from({ length: file.produitsNonConformes }, (_, i) => ({
        id: `NC-${file.id}-${i+1}`,
        uploadedAt: new Date(file.uploadedAt).toLocaleString('fr-FR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })
      }));
    });
    
    setModalContent({
      title: "Produits Non Conformes",
      data: nonConformesIds,
      isOpen: true,
    });
  };
  
  // Fonction pour ouvrir le modal des bobines incomplètes
  const showBobinesIncompletes = () => {
    // Extraire les IDs des bobines incomplètes de tous les fichiers
    const bobinesIncompletesIds = kpiData.files.flatMap((file: any) => {
      // Simuler l'extraction des IDs (à adapter selon la structure réelle des données)
      return Array.from({ length: file.bobinesIncompletes }, (_, i) => ({
        id: `BI-${file.id}-${i+1}`,
        uploadedAt: new Date(file.uploadedAt).toLocaleString('fr-FR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })
      }));
    });
    
    setModalContent({
      title: "Bobines Incomplètes",
      data: bobinesIncompletesIds,
      isOpen: true,
    });
  };
  
  // Fonction pour fermer le modal
  const closeModal = () => {
    setModalContent(prev => ({ ...prev, isOpen: false }));
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
        <UploadButton 
          className="w-full md:w-auto"
          onUploadSuccess={() => {
            // Rafraîchir les données après l'upload
            const fetchNewData = async () => {
              setLoading(true);
              try {
                const response = await fetch(`/api/kpi?date=${formatDateForApi(selectedDate)}`);
                if (response.ok) {
                  const newData = await response.json();
                  setKpiData(newData);
                }
              } catch (err) {
                console.error('Error refreshing data:', err);
              } finally {
                setLoading(false);
              }
            };
            fetchNewData();
          }} 
        />

        <motion.div
          className="flex items-center gap-2"
          variants={datepickerVariants}
          initial="hidden"
          animate="visible"
        >
          <span className="font-medium text-gray-700 select-none">Date :</span>
          <DatePicker
            selected={selectedDate}            onChange={(date: Date | null) =>
              setSelectedDate(date as Date)
            }
            className="border border-gray-300 px-3 py-2 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            dateFormat="dd/MM/yyyy"
          />
        </motion.div>
      </motion.div>      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-lg text-gray-600">Chargement des données...</span>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-64 text-red-500">
          <AlertCircle className="h-8 w-8 mr-2" />
          <span>{error}</span>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {/* Carte Produits Conformes */}
          <div
            className={`p-5 rounded-3xl shadow-lg border transition duration-300 ease-in-out transform hover:scale-[1.03] bg-white border-gray-200`}
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Produits Conformes
            </h3>
            <p className="text-4xl font-extrabold text-gray-900">{kpiData.summary.produitsConformes}</p>
            <p className="mt-3 text-sm font-semibold text-green-600">
              ✅ Produits validés par le contrôle qualité
            </p>
          </div>
          
          {/* Carte Produits Non Conformes (Cliquable) */}
          <div
            className={`p-5 rounded-3xl shadow-lg border transition duration-300 ease-in-out transform hover:scale-[1.03] ${
              kpiData.summary.produitsNonConformes > 0
                ? "bg-red-100 border-red-400 cursor-pointer"
                : "bg-white border-gray-200"
            }`}
            onClick={() => kpiData.summary.produitsNonConformes > 0 && showNonConformes()}
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Produits Non Conformes {kpiData.summary.produitsNonConformes > 0 && "(Cliquer pour détails)"}
            </h3>
            <p className="text-4xl font-extrabold text-gray-900">{kpiData.summary.produitsNonConformes}</p>
            <p
              className={`mt-3 text-sm font-semibold ${
                kpiData.summary.produitsNonConformes > 0 ? "text-red-600" : "text-green-600"
              }`}
            >
              {kpiData.summary.produitsNonConformes > 0
                ? `⚠ ${kpiData.summary.produitsNonConformes} produit(s) avec défauts`
                : `✅ Aucun produit non conforme`}
            </p>
          </div>
          
          {/* Carte Bobines Incomplètes (Cliquable) */}
          <div
            className={`p-5 rounded-3xl shadow-lg border transition duration-300 ease-in-out transform hover:scale-[1.03] ${
              kpiData.summary.bobinesIncompletes > 0
                ? "bg-orange-100 border-orange-400 cursor-pointer"
                : "bg-white border-gray-200"
            }`}
            onClick={() => kpiData.summary.bobinesIncompletes > 0 && showBobinesIncompletes()}
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Bobines Incomplètes {kpiData.summary.bobinesIncompletes > 0 && "(Cliquer pour détails)"}
            </h3>
            <p className="text-4xl font-extrabold text-gray-900">{kpiData.summary.bobinesIncompletes}</p>
            <p
              className={`mt-3 text-sm font-semibold ${
                kpiData.summary.bobinesIncompletes > 0 ? "text-orange-600" : "text-green-600"
              }`}
            >
              {kpiData.summary.bobinesIncompletes > 0
                ? `⚠ ${kpiData.summary.bobinesIncompletes} bobine(s) incomplète(s)`
                : `✅ Aucune bobine incomplète`}
            </p>
          </div>
          
          {/* Carte FTQ */}
          <div
            className={`p-5 rounded-3xl shadow-lg border transition duration-300 ease-in-out transform hover:scale-[1.03] ${
              kpiData.summary.ftq < seuils.ftq
                ? "bg-red-100 border-red-400"
                : "bg-white border-gray-200"
            }`}
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              FTQ (First Time Quality)
            </h3>
            <p className="text-4xl font-extrabold text-gray-900">{kpiData.summary.ftq.toFixed(1)}%</p>
            <p
              className={`mt-3 text-sm font-semibold ${
                kpiData.summary.ftq < seuils.ftq ? "text-red-600" : "text-green-600"
              }`}
            >
              {kpiData.summary.ftq < seuils.ftq
                ? `⚠ FTQ en dessous du seuil (${seuils.ftq}%)`
                : `✅ FTQ dans la norme (>${seuils.ftq}%)`}
            </p>
          </div>

          {/* Carte Taux de Rejets */}
          <div
            className={`p-5 rounded-3xl shadow-lg border transition duration-300 ease-in-out transform hover:scale-[1.03] ${
              (kpiData.summary.tauxRejets || 0) > seuils.tauxRejets
                ? "bg-red-100 border-red-400"
                : "bg-white border-gray-200"
            }`}
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Taux de Rejets
            </h3>
            <p className="text-4xl font-extrabold text-gray-900">{(kpiData.summary.tauxRejets || 0).toFixed(1)}%</p>
            <p
              className={`mt-3 text-sm font-semibold ${
                (kpiData.summary.tauxRejets || 0) > seuils.tauxRejets ? "text-red-600" : "text-green-600"
              }`}
            >
              {(kpiData.summary.tauxRejets || 0) > seuils.tauxRejets
                ? `⚠ Taux de rejets trop élevé (>${seuils.tauxRejets}%)`
                : `✅ Taux de rejets acceptable (<${seuils.tauxRejets}%)`}
            </p>
          </div>

          {/* Carte Production Cible */}
          <div
            className={`p-5 rounded-3xl shadow-lg border transition duration-300 ease-in-out transform hover:scale-[1.03] ${
              (kpiData.summary.productionCible || 0) < seuils.productionCible
                ? "bg-yellow-100 border-yellow-400"
                : "bg-white border-gray-200"
            }`}
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Production Cible
            </h3>
            <p className="text-4xl font-extrabold text-gray-900">{(kpiData.summary.productionCible || 0).toFixed(1)}%</p>
            <p
              className={`mt-3 text-sm font-semibold ${
                (kpiData.summary.productionCible || 0) < seuils.productionCible ? "text-yellow-600" : "text-green-600"
              }`}
            >
              {(kpiData.summary.productionCible || 0) < seuils.productionCible
                ? `⚠ En dessous de l'objectif (${seuils.productionCible}%)`
                : `✅ Objectif atteint (${seuils.productionCible}%)`}
            </p>
          </div>

          {/* Carte Taux de Production */}
          <div
            className={`p-5 rounded-3xl shadow-lg border transition duration-300 ease-in-out transform hover:scale-[1.03] ${
              (kpiData.summary.tauxProduction || 0) < seuils.tauxProduction
                ? "bg-orange-100 border-orange-400"
                : "bg-white border-gray-200"
            }`}
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Taux de Production
            </h3>
            <p className="text-4xl font-extrabold text-gray-900">{(kpiData.summary.tauxProduction || 0).toFixed(1)}%</p>
            <p
              className={`mt-3 text-sm font-semibold ${
                (kpiData.summary.tauxProduction || 0) < seuils.tauxProduction ? "text-orange-600" : "text-green-600"
              }`}
            >
              {(kpiData.summary.tauxProduction || 0) < seuils.tauxProduction
                ? `⚠ Taux de production faible (<${seuils.tauxProduction}%)`
                : `✅ Taux de production optimal (>${seuils.tauxProduction}%)`}
            </p>
          </div>
        </motion.div>
      )}
      {!loading && !error && (
        <>
          <div className="space-y-8">
          {/* Section Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Analyse des Performances</h2>
            <p className="text-gray-600">Visualisation détaillée des indicateurs de production</p>
          </motion.div>

          {/* Charts Grid - 2x2 Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
            {/* Chart 1: Production Volume - Stacked Bar Chart */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-shadow duration-300"
            >
              <div className="mb-6">
                <h3 className="text-xl font-bold text-indigo-700 mb-2">
                  Volume de Production Quotidien
                </h3>
                <p className="text-sm text-gray-500">Répartition des produits sur 7 jours</p>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={kpiData.chartData.map((item: any) => ({
                      jour: new Date(item.date).toLocaleDateString('fr-FR', { 
                        weekday: 'short', 
                        day: '2-digit', 
                        month: '2-digit' 
                      }),
                      conformes: item.produitsConformes,
                      nonConformes: item.produitsNonConformes,
                      bobinesIncompletes: item.bobinesIncompletes,
                      total: item.produitsConformes + item.produitsNonConformes + item.bobinesIncompletes
                    }))}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="jour" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} />
                    <Tooltip
                      contentStyle={{ 
                        backgroundColor: "#ffffff", 
                        borderRadius: 12,
                        border: "1px solid #e2e8f0",
                        boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
                      }}
                      formatter={(value: any, name: any) => {
                        const labels: any = {
                          conformes: 'Produits Conformes',
                          nonConformes: 'Produits Non Conformes',
                          bobinesIncompletes: 'Bobines Incomplètes'
                        };
                        return [`${value} unités`, labels[name] || name];
                      }}
                    />
                    <Bar dataKey="conformes" stackId="a" name="conformes" fill="#10b981" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="nonConformes" stackId="a" name="nonConformes" fill="#ef4444" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="bobinesIncompletes" stackId="a" name="bobinesIncompletes" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Chart 2: KPI Performance Dashboard - Multi-line Chart */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-shadow duration-300"
            >
              <div className="mb-6">
                <h3 className="text-xl font-bold text-indigo-700 mb-2">
                  Évolution des KPI de Performance
                </h3>
                <p className="text-sm text-gray-500">Tendances des indicateurs clés (%)</p>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart 
                    data={kpiData.chartData.map((item: any) => ({
                      jour: new Date(item.date).toLocaleDateString('fr-FR', { 
                        weekday: 'short', 
                        day: '2-digit' 
                      }),
                      ftq: item.ftq,
                      tauxProduction: item.tauxProduction,
                      productionCible: item.productionCible
                    }))}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="jour" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{ 
                        backgroundColor: "#ffffff", 
                        borderRadius: 12,
                        border: "1px solid #e2e8f0",
                        boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
                      }}
                      formatter={(value: any, name: any) => {
                        const labels: any = {
                          ftq: 'FTQ',
                          tauxProduction: 'Taux de Production',
                          productionCible: 'Production Cible'
                        };
                        return [`${parseFloat(value).toFixed(1)}%`, labels[name]];
                      }}
                    />
                    {/* Ligne de seuil FTQ */}
                    <Line 
                      type="monotone" 
                      dataKey={() => seuils.ftq} 
                      stroke="#94a3b8" 
                      strokeDasharray="5 5" 
                      strokeWidth={1}
                      dot={false}
                      name="Seuil FTQ"
                    />
                    <Line
                      type="monotone"
                      dataKey="ftq"
                      stroke="#6366f1"
                      strokeWidth={3}
                      dot={{ r: 4, fill: "#6366f1" }}
                      activeDot={{ r: 6, fill: "#6366f1", stroke: "#ffffff", strokeWidth: 2 }}
                      name="ftq"
                    />
                    <Line
                      type="monotone"
                      dataKey="tauxProduction"
                      stroke="#10b981"
                      strokeWidth={3}
                      dot={{ r: 4, fill: "#10b981" }}
                      activeDot={{ r: 6, fill: "#10b981", stroke: "#ffffff", strokeWidth: 2 }}
                      name="tauxProduction"
                    />
                    <Line
                      type="monotone"
                      dataKey="productionCible"
                      stroke="#f59e0b"
                      strokeWidth={3}
                      dot={{ r: 4, fill: "#f59e0b" }}
                      activeDot={{ r: 6, fill: "#f59e0b", stroke: "#ffffff", strokeWidth: 2 }}
                      name="productionCible"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Chart 3: Quality Analysis - Area Chart with Rejection Rate */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-shadow duration-300"
            >
              <div className="mb-6">
                <h3 className="text-xl font-bold text-indigo-700 mb-2">
                  Analyse Qualité
                </h3>
                <p className="text-sm text-gray-500">Taux de rejets vs seuil critique</p>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart 
                    data={kpiData.chartData.map((item: any) => ({
                      jour: new Date(item.date).toLocaleDateString('fr-FR', { 
                        weekday: 'short', 
                        day: '2-digit' 
                      }),
                      tauxRejets: item.tauxRejets,
                      seuilCritique: seuils.tauxRejets,
                      conformite: 100 - item.tauxRejets
                    }))}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <defs>
                      <linearGradient id="colorRejets" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1} />
                      </linearGradient>
                      <linearGradient id="colorConformite" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="jour" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{ 
                        backgroundColor: "#ffffff", 
                        borderRadius: 12,
                        border: "1px solid #e2e8f0",
                        boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
                      }}
                      formatter={(value: any, name: any) => {
                        const labels: any = {
                          tauxRejets: 'Taux de Rejets',
                          conformite: 'Taux de Conformité',
                          seuilCritique: 'Seuil Critique'
                        };
                        return [`${parseFloat(value).toFixed(1)}%`, labels[name]];
                      }}
                    />
                    {/* Zone de conformité */}
                    <Area
                      type="monotone"
                      dataKey="conformite"
                      stackId="1"
                      stroke="#10b981"
                      fill="url(#colorConformite)"
                      name="conformite"
                    />
                    {/* Zone de rejets */}
                    <Area
                      type="monotone"
                      dataKey="tauxRejets"
                      stroke="#ef4444"
                      fill="url(#colorRejets)"
                      name="tauxRejets"
                    />
                    {/* Ligne de seuil critique */}
                    <Line 
                      type="monotone" 
                      dataKey="seuilCritique" 
                      stroke="#dc2626" 
                      strokeDasharray="8 4" 
                      strokeWidth={2}
                      dot={false}
                      name="seuilCritique"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Chart 4: Production Efficiency Gauge-style Bar Chart */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-shadow duration-300"
            >
              <div className="mb-6">
                <h3 className="text-xl font-bold text-indigo-700 mb-2">
                  Efficacité de Production
                </h3>
                <p className="text-sm text-gray-500">Performance quotidienne vs objectif</p>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={kpiData.chartData.map((item: any) => {
                      const efficacite = (item.produitsConformes / (item.produitsConformes + item.produitsNonConformes + item.bobinesIncompletes)) * 100;
                      return {
                        jour: new Date(item.date).toLocaleDateString('fr-FR', { 
                          weekday: 'short', 
                          day: '2-digit' 
                        }),
                        efficacite: efficacite,
                        objectif: 95, // Objectif d'efficacité
                        ecart: efficacite - 95
                      };
                    })}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="jour" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{ 
                        backgroundColor: "#ffffff", 
                        borderRadius: 12,
                        border: "1px solid #e2e8f0",
                        boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
                      }}
                      formatter={(value: any, name: any) => {
                        const labels: any = {
                          efficacite: 'Efficacité Réelle',
                          objectif: 'Objectif',
                          ecart: 'Écart vs Objectif'
                        };
                        return [`${parseFloat(value).toFixed(1)}%`, labels[name]];
                      }}
                    />
                    {/* Barre d'objectif (référence) */}
                    <Bar 
                      dataKey="objectif" 
                      fill="#e2e8f0" 
                      name="objectif"
                      radius={[4, 4, 4, 4]}
                    />
                    {/* Barre d'efficacité réelle */}
                    <Bar 
                      dataKey="efficacite" 
                      fill="#3b82f6" 
                      name="efficacite"
                      radius={[4, 4, 4, 4]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>
        </div>
          
          {/* Modal pour afficher les détails des produits */}
          {modalContent.isOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-auto">
                <h2 className="text-2xl font-bold mb-4">{modalContent.title}</h2>
                
                {modalContent.data.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {modalContent.data.map((item, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.uploadedAt}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-center text-gray-500">Aucune donnée disponible</p>
                )}
                
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={closeModal}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
