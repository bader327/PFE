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
        uploadedAt: new Date(file.uploadedAt).toLocaleString()
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
        uploadedAt: new Date(file.uploadedAt).toLocaleString()
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
        </motion.div>
      )}      {!loading && !error && (
        <>
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
              <BarChart 
                data={kpiData.chartData.map((item: any) => ({
                  name: new Date(item.date).toLocaleDateString('fr-FR', { weekday: 'short' }),
                  conforme: item.produitsConformes,
                  nonConforme: item.produitsNonConformes + item.bobinesIncompletes
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                <XAxis dataKey="name" stroke="#4c51bf" />
                <YAxis stroke="#4c51bf" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#f9fafb", borderRadius: 8 }}
                  cursor={{ fill: "rgba(99,102,241,0.1)" }}                  formatter={(value: any, name: any) => {
                    return [`${value}`, name === 'conforme' ? 'Produits Conformes' : 'Produits Non Conformes'];
                  }}
                />
                <Bar dataKey="conforme" name="Produits Conformes" fill="#4ade80" />
                <Bar dataKey="nonConforme" name="Produits Non Conformes" fill="#f87171" />
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
              Taux de Production et Rejets
            </h3>
            <ResponsiveContainer width="100%" height="90%">
              <AreaChart 
                data={kpiData.chartData.map((item: any) => ({
                  name: new Date(item.date).toLocaleDateString('fr-FR', { weekday: 'short' }),
                  tauxProduction: item.tauxProduction,
                  tauxRejets: item.tauxRejets
                }))}
              >
                <defs>
                  <linearGradient id="colorProduction" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4ade80" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#4ade80" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorRejets" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f87171" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#f87171" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#4c51bf" />
                <YAxis stroke="#4c51bf" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#f9fafb", borderRadius: 8 }}
                  formatter={(value: any, name: any) => {
                    return [`${parseFloat(value).toFixed(1)}%`, 
                      name === 'tauxProduction' ? 'Taux de Production' : 'Taux de Rejets'];
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="tauxProduction"
                  name="Taux de Production"
                  stroke="#4ade80"
                  fillOpacity={1}
                  fill="url(#colorProduction)"
                />
                <Area
                  type="monotone"
                  dataKey="tauxRejets"
                  name="Taux de Rejets"
                  stroke="#f87171"
                  fillOpacity={0.5}
                  fill="url(#colorRejets)"
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
              FTQ (First Time Quality)
            </h3>
            <ResponsiveContainer width="100%" height="90%">
              <LineChart 
                data={kpiData.chartData.map((item: any) => ({
                  jour: new Date(item.date).toLocaleDateString('fr-FR', { weekday: 'short' }),
                  ftq: item.ftq
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                <XAxis dataKey="jour" stroke="#4c51bf" />
                <YAxis stroke="#4c51bf" domain={['dataMin - 5', 'dataMax + 5']} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#f9fafb", borderRadius: 8 }}
                  cursor={{ stroke: "#4c51bf", strokeWidth: 2 }}
                  formatter={(value: any) => [`${parseFloat(String(value)).toFixed(1)}%`, 'FTQ']}
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
