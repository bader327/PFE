"use client";

import { getUserRoleFromUser } from "@/lib/roleUtils";
import { useUser } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

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

const actionsCorrectives: string[] = [
  "Refuser et stopper la bobine d'alimentation",
  "Informer le chef d'équipe et l'animateur qualité",
  "Remplacer la bobine",
  "Confirmer la recette",
  "Confirmer les paramètres de températures",
  "Vérifier l'état du contrôleur de diamètre",
  "Vérifier le choix de filière",
  "Vérifier le réglage du débit ou tamis bouché",
  "Confirmer l'alignement de la tête d'extrusion",
  "Vérifier la vibration du toron",
  "Vérifier les interférences électrostatiques",
  "Vérifier la qualité du toron (brin sortant, pas de torsion)",
  "Vérifier l'outillage (filière/poinçon usé)",
  "Vérifier le circuit cuivre jusqu'à la tête",
  "Vérifier diamètre guide fil",
  "Vérifier compactage toron",
  "Confirmer profil de température",
  "Vérifier le type de claquage",
  "Vérifier qualité matière isolante",
  "Vérifier enfilage du fil",
  "Vérifier dosage de colorant",
  "Nettoyer les miroirs de contrôle",
  "Vérifier fonctionnement du sécheur",
  "Vérifier force d'enroulement",
  "Vérifier pression de pantin",
  "Corriger l'étiquette",
  "Appliquer check-list LPA",
  "Stopper la bobine et alerter chef",
];

const inputFieldStyle =
  "w-[450px] p-2 h-10 border rounded-md text-sm bg-gray-50";

const NiveauLignePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoaded } = useUser();
  const userRole = getUserRoleFromUser(user);

  const isLoadingUser = !isLoaded;
  const isQualiticien = userRole === "QUALITICIEN";
  const isChefAtelier = userRole === "CHEF_ATELIER";
  const isSuperAdmin = userRole === "SUPERADMIN";
  // Controls
  const disableText = isLoadingUser || isQualiticien || isChefAtelier; // QUALITICIEN & CHEF_ATELIER cannot edit text inputs
  const disableCheckbox = isLoadingUser || isChefAtelier; // CHEF_ATELIER cannot toggle checkbox; QUALITICIEN can
  const disableActions = isLoadingUser || isQualiticien || isChefAtelier; // disable add/save/fps for QUALITICIEN & CHEF_ATELIER

  // Récupération de tous les paramètres de bobines et défauts
  const bobinesFromUrl = searchParams.getAll("bobine");
  const defautsFromUrl = searchParams.getAll("defaut");

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<number, string>>({});

  // Création des lignes initiales avec toutes les bobines détectées
  const initialRows = bobinesFromUrl.map((bobine, index) => ({
    operateur: "",
    defaut: defautsFromUrl[index] || "",
    produit: "",
    bobine: bobine || "",
    cause: "",
    actions: [{ description: "", resolu: false }],
  }));

  const [rows, setRows] = useState<Row[]>(
    initialRows.length > 0
      ? initialRows
      : [
          {
            operateur: "",
            defaut: "",
            produit: "",
            bobine: "",
            cause: "",
            actions: [{ description: "", resolu: false }],
          },
        ]
  );

  const validateRow = (row: Row): string | null => {
    if (!row.operateur) return "Le nom de l'opérateur est requis";
    if (!row.defaut) return "Le défaut est requis";
    if (!row.produit) return "Le produit est requis";
    if (!row.bobine) return "Le numéro de bobine est requis";
    if (!row.cause) return "La cause est requise";
    if (!row.actions.some((action) => action.description)) {
      return "Au moins une action est requise";
    }
    return null;
  };

  const handleInputChange = (
    rowIndex: number,
    field: keyof Omit<Row, "actions">,
    value: string
  ) => {
  if (disableText) return; // Restricted roles cannot edit text inputs
    const newRows = [...rows];
    newRows[rowIndex][field] = value;
    if (field === "defaut") newRows[rowIndex].cause = "";
    setRows(newRows);

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
  // Restrict based on field type
  if (field === "description") {
    if (disableText) return;
  } else if (field === "resolu") {
    if (disableCheckbox) return;
  }
    const newRows = [...rows];
    if (field === "description" && typeof value === "string") {
      newRows[rowIndex].actions[actionIndex].description = value;
    } else if (field === "resolu" && typeof value === "boolean") {
      newRows[rowIndex].actions[actionIndex].resolu = value;
    }
    setRows(newRows);
  };

  const addAction = (rowIndex: number) => {
  if (disableActions) return;
    const newRows = [...rows];
    newRows[rowIndex].actions.push({ description: "", resolu: false });
    setRows(newRows);
  };

  const addRow = () => {
  if (disableActions) return;
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
  if (disableActions) return;
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      const result: ApiResponse = await res.json();
      if (result.success) {
        alert("✅ Données enregistrées !");
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
      alert("❌ Erreur de communication avec le serveur.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasserAuFPS = async () => {
  if (isQualiticien) return;
    const rowToSend = rows.find(
      (row) =>
        row.operateur ||
        row.defaut ||
        row.produit ||
        row.bobine ||
        row.cause ||
        row.actions.some((action) => action.description)
    );

    if (!rowToSend) {
      router.push("/niveau1");
      return;
    }

    const confirm = window.confirm(
      "Des données vont être envoyées au responsable. Continuer ?"
    );
    if (!confirm) return;

    try {
      const res = await fetch("/api/send-fps-alerte", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operateur: rowToSend.operateur,
          defaut: rowToSend.defaut,
          produit: rowToSend.produit,
          numeroBobine: rowToSend.bobine,
          cause: rowToSend.cause,
          actions: rowToSend.actions,
        }),
      });

      const result = await res.json();

      if (result.success) {
        alert("📩 Email envoyé avec succès !");
        router.push("/niveau1");
      } else {
        alert("❌ Erreur lors de l'envoi : " + result.error);
      }
    } catch (error) {
      console.error("Erreur email :", error);
      alert("❌ Une erreur est survenue.");
    }
  };

  return (
    <div className="p-10 bg-gray-100 min-h-screen max-w-7xl mx-auto">
      <datalist id="defautsList">
        {Object.keys(defautsAvecCauses).map((d) => (
          <option key={d} value={d} />
        ))}
      </datalist>
      <datalist id="actionsList">
        {actionsCorrectives.map((a) => (
          <option key={a} value={a} />
        ))}
      </datalist>
      <h1 className="text-3xl font-bold text-center mb-10">
        Suivi des Défauts - Niveau 1
      </h1>

      {bobinesFromUrl.length > 0 && (
        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-6 rounded">
          <p className="font-bold mb-2">Bobines détectées automatiquement :</p>
          <ul className="list-disc pl-5">
            {bobinesFromUrl.map((bobine, index) => (
              <li key={index}>
                Bobine #{bobine}
                {defautsFromUrl[index] && ` - Défaut: ${defautsFromUrl[index]}`}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-xl text-base w-full">
          <thead>
            <tr className="bg-blue-900 text-white text-center">
              <th colSpan={6} className="p-3">
                Suivi des défauts
              </th>
              <th className="p-3">Actions Correctives</th>
              <th className="p-3">Valider</th>
              <th className="p-3">FPS</th>
            </tr>
            <tr className="bg-blue-100 text-gray-800 text-center">
              <th className="p-3 border">Opérateur*</th>
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
              <tr key={rowIndex} className="align-top">
                <td className="p-2 border">
                  <input
                    className={inputFieldStyle}
                    value={row.operateur}
                    disabled={disableText}
                    onChange={(e) =>
                      handleInputChange(rowIndex, "operateur", e.target.value)
                    }
                  />
                </td>
                <td className="p-2 border">
                  <input
                    list="defautsList"
                    className={inputFieldStyle}
                    value={row.defaut}
                    disabled={disableText}
                    onChange={(e) =>
                      handleInputChange(rowIndex, "defaut", e.target.value)
                    }
                  />
                </td>
                <td className="p-2 border">
                  <input
                    className={inputFieldStyle}
                    value={row.produit}
                    disabled={disableText}
                    onChange={(e) =>
                      handleInputChange(rowIndex, "produit", e.target.value)
                    }
                  />
                </td>
                <td className="p-2 border">
                  <input
                    className={inputFieldStyle}
                    value={row.bobine}
                    disabled={disableText}
                    onChange={(e) =>
                      handleInputChange(rowIndex, "bobine", e.target.value)
                    }
                  />
                </td>
                <td className="p-2 border">
                  <input
                    list="causesList"
                    className={inputFieldStyle}
                    value={row.cause}
                    disabled={disableText}
                    onChange={(e) =>
                      handleInputChange(rowIndex, "cause", e.target.value)
                    }
                  />
                  <datalist id="causesList">
                    {(defautsAvecCauses[row.defaut] || []).map((cause) => (
                      <option key={cause} value={cause} />
                    ))}
                  </datalist>
                </td>
                <td className="p-2 border text-gray-400 text-center">--</td>
                <td className="p-2 border">
                  {row.actions.map((action, actionIndex) => (
                    <div key={actionIndex}>
                      <input
                        list="actionsList"
                        className={inputFieldStyle}
                        value={action.description}
                        disabled={disableText}
                        onChange={(e) =>
                          handleActionChange(
                            rowIndex,
                            actionIndex,
                            "description",
                            e.target.value
                          )
                        }
                      />
                      <label className="flex items-center gap-2 text-sm mt-1">
                        <input
                          type="checkbox"
                          checked={action.resolu}
                          disabled={disableCheckbox}
                          onChange={(e) =>
                            handleActionChange(
                              rowIndex,
                              actionIndex,
                              "resolu",
                              e.target.checked
                            )
                          }
                        />
                        Résolu et fermer FPS ?
                      </label>
                    </div>
                  ))}
                  <button
                    onClick={() => addAction(rowIndex)}
                    className="text-blue-600 hover:underline text-sm mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={disableActions}
                  >
                    + Ajouter une action
                  </button>
                </td>
                <td className="p-2 border text-center">
                  <button
                    onClick={() => handleSave(rowIndex)}
                    className="bg-green-600 text-white px-4 py-2 rounded shadow text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading || disableActions}
                  >
                    {loading ? "..." : "Enregistrer"}
                  </button>
                </td>
                <td className="p-2 border text-center">
                  <button
                    onClick={handlePasserAuFPS}
                    className="bg-red-600 text-white px-4 py-2 rounded shadow text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={disableActions}
                  >
                    FPS
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="text-center mt-6">
        <button
          onClick={addRow}
          className="bg-blue-600 text-white px-6 py-2 rounded-xl shadow disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={disableActions}
        >
          + Ajouter une ligne
        </button>
      </div>
    </div>
  );
};

export default NiveauLignePage;
