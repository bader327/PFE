"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

const Niveau1 = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fpsData, setFpsData] = useState<any>(null);

  const fpsId = searchParams.get("id");

  useEffect(() => {
    const fetchFpsData = async () => {
      if (!fpsId) return;

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/fps?id=${fpsId}&level=1`);
        if (!response.ok) throw new Error("Erreur lors de la récupération");
        const data = await response.json();
        setFpsData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    };

    fetchFpsData();
  }, [fpsId]);

  const handleRowSave = (index: number) => {
    alert(`Ligne ${index + 1} enregistrée`);
  };

  const handleRowNextLevel = (index: number) => {
    if (fpsId) router.push(`/niveau2?fps1Id=${fpsId}`);
    else router.push("/niveau2");
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">
        Analyse des Causes - Niveau 1
      </h1>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="animate-spin w-10 h-10 text-blue-600" />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-xl">
            <thead>
              <tr className="bg-blue-900 text-white text-sm">
                <th className="p-2 border">Chef prod</th>
                <th className="p-2 border">Chef qualité</th>
                <th className="p-2 border">Problème</th>
                <th className="p-2 border">N° bobine</th>
                <th className="p-2 border">Cause 1 (apparente)</th>
                <th className="p-2 border">Cause de la cause 1</th>
                <th className="p-2 border">Cause de la cause 2</th>
                <th className="p-2 border">Cause de la cause 3</th>
                <th className="p-2 border">Cause de la cause 4</th>
                <th className="p-2 border">Action</th>
                <th className="p-2 border">Options</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 6 }).map((_, index) => (
                <tr key={index} className="hover:bg-gray-50 align-top">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <td key={i} className="p-2 border min-w-[180px]">
                      <textarea
                        className="w-full p-2 border rounded resize-y min-h-[60px]"
                        rows={3}
                      />
                    </td>
                  ))}
                  <td className="p-2 border text-center space-y-2">
                    <button
                      onClick={() => handleRowSave(index)}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-3 py-1 rounded"
                    >
                      Enregistrer
                    </button>
                    <button
                      onClick={() => handleRowNextLevel(index)}
                      className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold px-3 py-1 rounded"
                    >
                      Niveau 2
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Commentaire et signatures */}
          <div className="mt-6 bg-white p-4 shadow rounded-xl">
            <div className="mb-4">
              <label className="font-semibold block mb-1">Commentaire :</label>
              <textarea
                className="w-full p-2 border rounded"
                rows={3}
              ></textarea>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="font-semibold block mb-1">
                  Resp Qualité process :
                </label>
                <input type="text" className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="font-semibold block mb-1">
                  Resp Production :
                </label>
                <input type="text" className="w-full p-2 border rounded" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Niveau1;
