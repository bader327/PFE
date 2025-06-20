"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

// Défauts et causes associées
const defautsAvecCauses: Record<string, string[]> = {
  "Dépassement de diamètre": [
    "Erreur de programmation",
    "Profil température non correspondant",
    "Matière première NOK",
    "Impureté dans la caméra contrôleur",
  ],
  "Mauvais marquage": [
    "Impuretés sur le marqueur",
    "Marqueur mal-positionné",
    "Mauvaise recette",
    "Vitesse excessive",
    "Marqueur mal nettoyé",
  ],
  Claquage: [
    "Température d’extrusion non adéquate",
    "Matière détériorée",
    "Impuretés dans la matière",
  ],
  "Résistance linéïque": [
    "Tension trop importante",
    "Composition erronée",
    "Circuit de câblage non conforme",
    "Filière non adéquate ou trop petite",
    "Allongement trop important",
    "Céramiques de la lyre en mauvais état",
    "Vitesse incorrecte",
  ],
  "Diamètre de brins": [
    "Filière endommagée",
    "Mauvaise répartition",
    "Tension importante",
  ],
  "Allongement des brins": [
    "Pression dans les bobinoirs",
    "Facteur de recuit incorrect",
    "Panne électrique",
  ],
  "Nœud / Rétrécissement": [
    "Température extrusion non adéquate",
    "Matière détériorée ou impure",
    "Mauvais trancannage",
    "Mauvais séchage",
    "Matière non homogène",
    "Vitesse excessive",
    "Mauvais guide-fil",
    "Poussière dans le conducteur",
    "Mauvaise forme de toron",
  ],
  // Ajoute ici d'autres défauts selon ta liste complète
};

const NiveauLignePage = () => {
  const router = useRouter();

  const [rows, setRows] = useState([
    {
      operateur: "",
      defaut: "",
      produit: "",
      bobine: "",
      cause: "",
      actions: [{ description: "", resolu: false }],
    },
  ]);

  const handleInputChange = (rowIndex: number, field: string, value: any) => {
    const newRows = [...rows];
    newRows[rowIndex][field] = value;
    // Réinitialise la cause si le défaut change
    if (field === "defaut") newRows[rowIndex].cause = "";
    setRows(newRows);
  };

  const handleActionChange = (
    rowIndex: number,
    actionIndex: number,
    field: string,
    value: any
  ) => {
    const newRows = [...rows];
    newRows[rowIndex].actions[actionIndex][field] = value;
    setRows(newRows);
  };

  const addAction = (rowIndex: number) => {
    const newRows = [...rows];
    newRows[rowIndex].actions.push({ description: "", resolu: false });
    setRows(newRows);
  };

  const addRow = () => {
    setRows([
      ...rows,
      {
        operateur: "",
        defaut: "",
        produit: "",
        bobine: "",
        cause: "",
        actions: [{ description: "", resolu: false }],
      },
    ]);
  };

  const handleSave = (rowIndex: number) => {
    console.log("Données enregistrées :", rows[rowIndex]);
    alert("Données enregistrées !");
  };

  const handlePasserAuFPS = () => {
    router.push("/niveau1");
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">
        Suivi des Défauts - Niveau 1
      </h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-xl">
          <thead>
            <tr className="bg-blue-900 text-white">
              <th colSpan={6} className="text-center p-2">
                Suivi des défauts
              </th>
              <th className="text-center p-2">Actions Correctives</th>
              <th className="text-center p-2">Valider</th>
              <th className="text-center p-2">FPS</th>
            </tr>
            <tr className="bg-blue-100 text-gray-800">
              <th className="p-2 border">Nom opérateur</th>
              <th className="p-2 border">Défaut</th>
              <th className="p-2 border">Produit</th>
              <th className="p-2 border">N° bobine</th>
              <th className="p-2 border">Cause</th>
              <th className="p-2 border">---</th>
              <th className="p-2 border">Actions</th>
              <th className="p-2 border">Enregistrer</th>
              <th className="p-2 border">FPS Niveau 1</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-100 align-top">
                <td className="p-2 border">
                  <input
                    value={row.operateur}
                    onChange={(e) =>
                      handleInputChange(rowIndex, "operateur", e.target.value)
                    }
                    className="w-full p-1 border rounded"
                    placeholder="Nom opérateur"
                  />
                </td>
                <td className="p-2 border">
                  <select
                    value={row.defaut}
                    onChange={(e) =>
                      handleInputChange(rowIndex, "defaut", e.target.value)
                    }
                    className="w-full p-1 border rounded"
                  >
                    <option value="">-- Sélectionner un défaut --</option>
                    {Object.keys(defautsAvecCauses).map((defaut) => (
                      <option key={defaut} value={defaut}>
                        {defaut}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border">
                  <input
                    value={row.produit}
                    onChange={(e) =>
                      handleInputChange(rowIndex, "produit", e.target.value)
                    }
                    className="w-full p-1 border rounded"
                    placeholder="Produit"
                  />
                </td>
                <td className="p-2 border">
                  <input
                    value={row.bobine}
                    onChange={(e) =>
                      handleInputChange(rowIndex, "bobine", e.target.value)
                    }
                    className="w-full p-1 border rounded"
                    placeholder="N° bobine"
                  />
                </td>
                <td className="p-2 border">
                  <select
                    value={row.cause}
                    onChange={(e) =>
                      handleInputChange(rowIndex, "cause", e.target.value)
                    }
                    className="w-full p-1 border rounded"
                    disabled={!row.defaut}
                  >
                    <option value="">-- Sélectionner une cause --</option>
                    {defautsAvecCauses[row.defaut]?.map((cause) => (
                      <option key={cause} value={cause}>
                        {cause}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-center text-gray-400">--</td>
                <td className="p-2 border">
                  {row.actions.map((action, actionIndex) => (
                    <div key={actionIndex} className="mb-2">
                      <input
                        value={action.description}
                        onChange={(e) =>
                          handleActionChange(
                            rowIndex,
                            actionIndex,
                            "description",
                            e.target.value
                          )
                        }
                        placeholder={`Action ${actionIndex + 1}`}
                        className="w-full p-1 border rounded mb-1"
                      />
                      <label className="text-sm">
                        <input
                          type="checkbox"
                          checked={action.resolu}
                          onChange={(e) =>
                            handleActionChange(
                              rowIndex,
                              actionIndex,
                              "resolu",
                              e.target.checked
                            )
                          }
                          className="mr-1"
                        />
                        Résolu ?
                      </label>
                    </div>
                  ))}
                  <button
                    onClick={() => addAction(rowIndex)}
                    className="text-sm text-blue-600 mt-1 hover:underline"
                  >
                    + Ajouter une action
                  </button>
                </td>
                <td className="p-2 border text-center">
                  <button
                    onClick={() => handleSave(rowIndex)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded"
                  >
                    Enregistrer
                  </button>
                </td>
                <td className="p-2 border text-center">
                  <button
                    onClick={handlePasserAuFPS}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                  >
                    FPS Niveau 1
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Ajouter une ligne */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={addRow}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-xl shadow-lg transition"
        >
          + Ajouter une ligne
        </button>
      </div>
    </div>
  );
};

export default NiveauLignePage;
