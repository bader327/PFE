// app/plan-action/page.tsx
"use client";

import { useState } from "react";
import { CheckCircleIcon, PlusIcon } from "lucide-react";

export default function PlanActionPage() {
  const [kpis, setKpis] = useState([
    {
      id: Date.now(),
      name: "",
      actions: [
        {
          id: Date.now(),
          description: "",
          duree: "",
          responsable: "",
          avancement: "",
          dateLancement: "",
        },
      ],
    },
  ]);

  const handleKpiChange = (index: number, value: string) => {
    setKpis((prev) => {
      const updated = [...prev];
      updated[index].name = value;
      return updated;
    });
  };

  const handleActionChange = (
    kpiIndex: number,
    actionIndex: number,
    field: string,
    value: string
  ) => {
    setKpis((prev) => {
      const updated = [...prev];
      updated[kpiIndex].actions[actionIndex] = {
        ...updated[kpiIndex].actions[actionIndex],
        [field]: value,
      };
      return updated;
    });
  };

  const addKpi = () => {
    setKpis((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: "",
        actions: [
          {
            id: Date.now(),
            description: "",
            duree: "",
            responsable: "",
            avancement: "",
            dateLancement: "",
          },
        ],
      },
    ]);
  };

  const addAction = (kpiIndex: number) => {
    setKpis((prev) => {
      const updated = [...prev];
      updated[kpiIndex].actions.push({
        id: Date.now(),
        description: "",
        duree: "",
        responsable: "",
        avancement: "",
        dateLancement: "",
      });
      return updated;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-10 space-y-10">
      <h1 className="text-4xl font-extrabold text-center text-blue-800">
        📋 Suivi du Plan d'Action Corrective
      </h1>

      {kpis.map((kpi, kpiIndex) => (
        <div
          key={kpi.id}
          className="bg-white border shadow-lg rounded-2xl p-6 space-y-6"
        >
          <div className="space-y-2">
            <label className="text-lg font-semibold text-gray-700 block">
              🎯 Nom du KPI
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Ex : Taux de rebut"
              value={kpi.name}
              onChange={(e) => handleKpiChange(kpiIndex, e.target.value)}
            />
          </div>

          <div className="space-y-4">
            {kpi.actions.map((action, actionIndex) => (
              <div
                key={action.id}
                className="grid grid-cols-1 md:grid-cols-5 gap-6 bg-gray-100 p-5 rounded-xl shadow-sm"
              >
                <div>
                  <label className="font-medium text-gray-700">
                    🛠 Action corrective
                  </label>
                  <textarea
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1"
                    placeholder="Décrire l'action"
                    value={action.description}
                    onChange={(e) =>
                      handleActionChange(
                        kpiIndex,
                        actionIndex,
                        "description",
                        e.target.value
                      )
                    }
                  />
                </div>
                <div>
                  <label className="font-medium text-gray-700">⏱ Durée</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1"
                    placeholder="Ex : 2 semaines"
                    value={action.duree}
                    onChange={(e) =>
                      handleActionChange(
                        kpiIndex,
                        actionIndex,
                        "duree",
                        e.target.value
                      )
                    }
                  />
                </div>
                <div>
                  <label className="font-medium text-gray-700">
                    👤 Responsable
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1"
                    placeholder="Ex : M. Dupont"
                    value={action.responsable}
                    onChange={(e) =>
                      handleActionChange(
                        kpiIndex,
                        actionIndex,
                        "responsable",
                        e.target.value
                      )
                    }
                  />
                </div>
                <div>
                  <label className="font-medium text-gray-700">
                    📊 Avancement
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1"
                    placeholder="Ex : 50%"
                    value={action.avancement}
                    onChange={(e) =>
                      handleActionChange(
                        kpiIndex,
                        actionIndex,
                        "avancement",
                        e.target.value
                      )
                    }
                  />
                </div>
                <div>
                  <label className="font-medium text-gray-700">
                    📅 Date de lancement
                  </label>
                  <input
                    type="date"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1"
                    value={action.dateLancement}
                    onChange={(e) =>
                      handleActionChange(
                        kpiIndex,
                        actionIndex,
                        "dateLancement",
                        e.target.value
                      )
                    }
                  />
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => addAction(kpiIndex)}
            className="mt-2 flex items-center text-blue-600 hover:underline text-sm"
          >
            <PlusIcon className="w-4 h-4 mr-1" /> Ajouter une action corrective
          </button>
        </div>
      ))}

      <div className="text-center">
        <button
          onClick={addKpi}
          className="mt-6 inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-full text-lg shadow hover:bg-blue-700 transition"
        >
          <PlusIcon className="w-5 h-5 mr-2" /> Ajouter un KPI
        </button>
      </div>
    </div>
  );
}
