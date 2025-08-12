"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

interface FpsRecord {
  _id?: string;
  fpsId: string;
  level: number;
  chefProd: string;
  chefQualite: string;
  probleme: string;
  numeroBobine: string;
  cause1Apparente: string;
  causeCause1: string;
  causeCause2: string;
  causeCause3: string;
  causeCause4: string;
  action: string;
  commentaire?: string;
  respQualiteProcess?: string;
  respProduction?: string;
}

const emptyRecord = (fpsId: string): FpsRecord => ({
  fpsId,
  level: 1,
  chefProd: "",
  chefQualite: "",
  probleme: "",
  numeroBobine: "",
  cause1Apparente: "",
  causeCause1: "",
  causeCause2: "",
  causeCause3: "",
  causeCause4: "",
  action: "",
  commentaire: "",
  respQualiteProcess: "",
  respProduction: "",
});

const Niveau1: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fpsId = searchParams.get("id") || "";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fpsData, setFpsData] = useState<FpsRecord[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/fps?id=${fpsId}&level=1`, {
          cache: "no-store", // ⬅️ empêche le cache
        });
        if (!res.ok) throw new Error("Erreur lors de la récupération");
        const data: FpsRecord[] = await res.json();
        setFpsData(data.length ? data : [emptyRecord(fpsId)]);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [fpsId]);

  const handleFieldChange = (
    index: number,
    field: keyof FpsRecord,
    value: string
  ) => {
    const updated = [...fpsData];
    updated[index] = { ...updated[index], [field]: value };
    setFpsData(updated);
  };

  const handleAddRow = () => {
    setFpsData((prev) => [...prev, emptyRecord(fpsId)]);
  };

  const handleSave = async (index: number) => {
    const record = fpsData[index];
    setLoading(true);
    try {
      const method = record._id ? "PUT" : "POST";
      const res = await fetch("/api/fps", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...record, level: 1 }), // ⬅️ assure le level 1
      });
      if (!res.ok) throw new Error("Échec de la sauvegarde");
      const saved: FpsRecord = await res.json();
      const updated = [...fpsData];
      updated[index] = saved;
      setFpsData(updated);
      alert("Enregistré avec succès");
    } catch (e) {
      alert(e instanceof Error ? e.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    router.push(`/niveau2?fps1Id=${fpsId}`);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">
        Analyse des Causes - Niveau 1
      </h1>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      <div className="mb-4">
        <button
          onClick={handleAddRow}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Ajouter une ligne
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="animate-spin w-10 h-10 text-blue-600" />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-xl">
            <thead>
              <tr className="bg-blue-900 text-white text-sm">
                {[
                  "Chef prod",
                  "Chef qualité",
                  "Problème",
                  "N° bobine",
                  "Cause 1 (apparente)",
                  "Cause de la cause 1",
                  "Cause de la cause 2",
                  "Cause de la cause 3",
                  "Cause de la cause 4",
                  "Action",
                  "Options",
                ].map((header) => (
                  <th key={header} className="p-2 border">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {fpsData.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50 align-top">
                  {(
                    [
                      "chefProd",
                      "chefQualite",
                      "probleme",
                      "numeroBobine",
                      "cause1Apparente",
                      "causeCause1",
                      "causeCause2",
                      "causeCause3",
                      "causeCause4",
                      "action",
                    ] as (keyof FpsRecord)[]
                  ).map((field) => (
                    <td key={field} className="p-2 border min-w-[180px]">
                      <textarea
                        value={(row[field] as string) || ""}
                        onChange={(e) =>
                          handleFieldChange(idx, field, e.target.value)
                        }
                        className="w-full p-2 border rounded resize-y min-h-[60px]"
                        rows={3}
                      />
                    </td>
                  ))}
                  <td className="p-2 border text-center">
                    <button
                      onClick={() => handleSave(idx)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                    >
                      Enregistrer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Bloc commentaire + responsables (sur le 1er élément uniquement) */}
          <div className="mt-6 bg-white p-4 shadow rounded-xl">
            <label className="font-semibold block mb-1">Commentaire :</label>
            <textarea
              value={fpsData[0]?.commentaire || ""}
              onChange={(e) =>
                handleFieldChange(0, "commentaire", e.target.value)
              }
              className="w-full p-2 border rounded"
              rows={3}
            />

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="font-semibold block mb-1">
                  Resp Qualité process :
                </label>
                <input
                  type="text"
                  value={fpsData[0]?.respQualiteProcess || ""}
                  onChange={(e) =>
                    handleFieldChange(0, "respQualiteProcess", e.target.value)
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">
                  Resp Production :
                </label>
                <input
                  type="text"
                  value={fpsData[0]?.respProduction || ""}
                  onChange={(e) =>
                    handleFieldChange(0, "respProduction", e.target.value)
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>

            <button
              onClick={handleNext}
              className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
            >
              Niveau 2
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Niveau1;
