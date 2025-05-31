"use client";

import React from "react";
import { useRouter } from "next/navigation"; // ✅ Hook pour la navigation

const Niveau1 = () => {
  const router = useRouter(); // ✅ Initialisation du routeur

  // Fonction temporaire pour les boutons
  const handleSave = () => {
    alert("Enregistrement effectué (fonction à implémenter)");
  };

  const handleExportPDF = () => {
    alert("Export PDF en cours (fonction à implémenter)");
  };

  // ✅ Fonction pour passer à la page Niveau 2
  const handlePasserNiveau2 = () => {
    router.push("/niveau2");
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">
        Analyse des Causes - Niveau 2
      </h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-xl">
          <thead>
            <tr className="bg-blue-900 text-white">
              <th colSpan={8} className="text-center p-2">
                Analyses des causes
              </th>
              <th
                colSpan={3}
                className="bg-green-600 text-white text-center p-2"
              >
                Action
              </th>
            </tr>
            <tr className="bg-blue-100 text-gray-800 text-sm">
              <th className="p-2 border">Chef d'équipe production</th>
              <th className="p-2 border">Chef d'équipe Qualité</th>
              <th className="p-2 border">Problème</th>
              <th className="p-2 border">N° de bobine</th>
              <th className="p-2 border">Cause 1 (apparente)</th>
              <th className="p-2 border">Cause de la cause 1</th>
              <th className="p-2 border">Cause de la cause 2</th>
              <th className="p-2 border">Cause de la cause 3</th>
              <th className="p-2 border">Cause de la cause 4</th>
              <th className="p-2 border">Action</th>
              <th className="p-2 border">Réapparaît dans l’heure ?</th>
              <th className="p-2 border">Réapparaît fin de poste ?</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 6 }).map((_, index) => (
              <tr key={index} className="hover:bg-gray-50">
                {Array.from({ length: 10 }).map((_, i) => (
                  <td key={i} className="p-2 border">
                    <input type="text" className="w-full p-1 border rounded" />
                  </td>
                ))}
                <td className="p-2 border">
                  <label className="block">
                    <input type="checkbox" className="mr-1" />
                    Oui, passe au niveau 2
                  </label>
                  <label className="block">
                    <input type="checkbox" className="mr-1" />
                    Non
                  </label>
                </td>
                <td className="p-2 border">
                  <label className="block">
                    <input type="checkbox" className="mr-1" />
                    Oui, passe au niveau 2
                  </label>
                  <label className="block">
                    <input type="checkbox" className="mr-1" />
                    Non
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Commentaire et signatures */}
        <div className="mt-6 bg-white p-4 shadow rounded-xl">
          <div className="mb-4">
            <label className="font-semibold block mb-1">Commentaire :</label>
            <textarea className="w-full p-2 border rounded" rows={3}></textarea>
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

        {/* Boutons */}
        <div className="mt-6 flex flex-wrap justify-end gap-4">
          <button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl shadow"
          >
            Enregistrer
          </button>
          <button
            onClick={handleExportPDF}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-xl shadow"
          >
            Exporter en PDF
          </button>
          <button
            onClick={handlePasserNiveau2}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-xl shadow"
          >
            Passer au PFS Niveau 2
          </button>
        </div>
      </div>
    </div>
  );
};

export default Niveau1;
