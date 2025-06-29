"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

type Action = {
  description: string;
  resolu: boolean;
};

type Row = {
  operateur: string;
  defaut: string;
  produit: string;
  bobine: string;
  cause: string;
  actions: Action[];
};

type ApiResponse = {
  success: boolean;
  error?: string;
  data?: any;
};

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
    "Température d'extrusion non adéquate",
    "Matière détériorée",
    "Impuretés dans la matière",
  ],
  "Résistance liniéïque": [
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
};

const inputFieldStyle =
  "w-[450px] p-2 h-10 border rounded-md text-sm bg-gray-50";

const NiveauLignePage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<number, string>>({});

  const [rows, setRows] = useState<Row[]>([
    {
      operateur: "",
      defaut: "",
      produit: "",
      bobine: "",
      cause: "",
      actions: [{ description: "", resolu: false }],
    },
  ]);

  const validateRow = (row: Row): string | null => {
    if (!row.operateur) return "Le nom de l'opérateur est requis";
    if (!row.defaut) return "Le défaut est requis";
    if (!row.produit) return "Le produit est requis";
    if (!row.bobine) return "Le numéro de bobine est requis";
    if (!row.cause) return "La cause est requise";
    if (!row.actions.some(action => action.description)) {
      return "Au moins une action est requise";
    }
    return null;
  };

  const handleInputChange = (
    rowIndex: number,
    field: keyof Omit<Row, "actions">,
    value: string
  ) => {
    const newRows = [...rows];
    newRows[rowIndex][field] = value;
    if (field === "defaut") newRows[rowIndex].cause = "";
    setRows(newRows);
    
    // Clear error when user starts typing
    if (errors[rowIndex]) {
      const newErrors = { ...errors };
      delete newErrors[rowIndex];
      setErrors(newErrors);
    }
  };

  const handleActionChange = (
    rowIndex: number,
    actionIndex: number,
    field: keyof Action,
    value: string | boolean
  ) => {
    const newRows = [...rows];
    if (field === "description" && typeof value === "string") {
      newRows[rowIndex].actions[actionIndex].description = value;
    } else if (field === "resolu" && typeof value === "boolean") {
      newRows[rowIndex].actions[actionIndex].resolu = value;
    }
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

  const handleSave = async (rowIndex: number) => {
    const error = validateRow(rows[rowIndex]);
    if (error) {
      setErrors({ ...errors, [rowIndex]: error });
      return;
    }

    setLoading(true);
    const { bobine, ...rest } = rows[rowIndex];

    const dataToSend = {
      ...rest,
      numeroBobine: bobine,
    };

    try {
      const res = await fetch("/api/fps1", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      const result: ApiResponse = await res.json();
      if (result.success) {
        alert("✅ Données enregistrées !");
        // Clear the row after successful save
        const newRows = [...rows];
        newRows[rowIndex] = {
          operateur: "",
          defaut: "",
          produit: "",
          bobine: "",
          cause: "",
          actions: [{ description: "", resolu: false }],
        };
        setRows(newRows);
      } else {
        alert("❌ Échec : " + (result.error || "Erreur inconnue"));
      }
    } catch (err) {
      console.error("Erreur lors de la sauvegarde :", err);
      alert("❌ Erreur lors de la communication avec le serveur. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasserAuFPS = () => {
    // Check for unsaved changes
    const hasUnsavedChanges = rows.some(row => 
      row.operateur || row.defaut || row.produit || row.bobine || row.cause ||
      row.actions.some(action => action.description)
    );

    if (hasUnsavedChanges) {
      if (window.confirm("Des modifications non enregistrées seront perdues. Voulez-vous continuer ?")) {
        router.push("/niveau1");
      }
    } else {
      router.push("/niveau1");
    }
  };

  return (
    <div className="p-10 bg-gray-100 min-h-screen text-base max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-10">
        Suivi des Défauts - Niveau 1
      </h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-xl text-base w-full">
          <thead>
            <tr className="bg-blue-900 text-white">
              <th colSpan={6} className="text-center p-3 text-base">
                Suivi des défauts
              </th>
              <th className="text-center p-3 text-base">Actions Correctives</th>
              <th className="text-center p-3 text-base">Valider</th>
              <th className="text-center p-3 text-base">FPS</th>
            </tr>
            <tr className="bg-blue-100 text-gray-800">
              <th className="p-3 border">Nom opérateur*</th>
              <th className="p-3 border">Défaut*</th>
              <th className="p-3 border">Produit*</th>
              <th className="p-3 border">N° bobine*</th>
              <th className="p-3 border">Cause*</th>
              <th className="p-3 border">---</th>
              <th className="p-3 border">Actions*</th>
              <th className="p-3 border">Enregistrer</th>
              <th className="p-3 border">FPS Niveau 1</th>
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
                    className={`${inputFieldStyle} ${!row.operateur && errors[rowIndex] ? 'border-red-500' : ''}`}
                    placeholder="Nom opérateur"
                  />
                </td>
                <td className="p-2 border">
                  <select
                    value={row.defaut}
                    onChange={(e) =>
                      handleInputChange(rowIndex, "defaut", e.target.value)
                    }
                    className={`${inputFieldStyle} ${!row.defaut && errors[rowIndex] ? 'border-red-500' : ''}`}
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
                    className={`${inputFieldStyle} ${!row.produit && errors[rowIndex] ? 'border-red-500' : ''}`}
                    placeholder="Produit"
                  />
                </td>
                <td className="p-2 border">
                  <input
                    value={row.bobine}
                    onChange={(e) =>
                      handleInputChange(rowIndex, "bobine", e.target.value)
                    }
                    className={`${inputFieldStyle} ${!row.bobine && errors[rowIndex] ? 'border-red-500' : ''}`}
                    placeholder="N° bobine"
                  />
                </td>
                <td className="p-2 border">
                  <select
                    value={row.cause}
                    onChange={(e) =>
                      handleInputChange(rowIndex, "cause", e.target.value)
                    }
                    className={`${inputFieldStyle} ${!row.cause && errors[rowIndex] ? 'border-red-500' : ''}`}
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
                        className={`${inputFieldStyle} mb-1 ${
                          !row.actions.some(a => a.description) && errors[rowIndex] ? 'border-red-500' : ''
                        }`}
                      />
                      <label className="text-sm flex items-center gap-2">
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
                          className="h-4 w-4"
                        />
                        Résolu ?
                      </label>
                    </div>
                  ))}
                  <button
                    onClick={() => addAction(rowIndex)}
                    className="text-blue-600 mt-1 hover:underline text-sm"
                  >
                    + Ajouter une action
                  </button>
                </td>
                <td className="p-2 border text-center">
                  {errors[rowIndex] && (
                    <div className="text-red-500 text-xs mb-2">{errors[rowIndex]}</div>
                  )}
                  <button
                    onClick={() => handleSave(rowIndex)}
                    disabled={loading}
                    className={`${
                      loading
                        ? 'bg-gray-400'
                        : 'bg-green-600 hover:bg-green-700'
                    } text-white px-4 py-2 rounded-md shadow text-sm transition-colors`}
                  >
                    {loading ? 'Enregistrement...' : 'Enregistrer'}
                  </button>
                </td>
                <td className="p-2 border text-center">
                  <button
                    onClick={handlePasserAuFPS}
                    disabled={loading}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md shadow text-sm"
                  >
                    FPS Niveau 1
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-center">
        <button
          onClick={addRow}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-xl shadow-lg text-base"
        >
          + Ajouter une ligne
        </button>
      </div>

      <div className="mt-4 text-center text-sm text-gray-500">
        * Champs obligatoires
      </div>
    </div>
  );
};

export default NiveauLignePage;
