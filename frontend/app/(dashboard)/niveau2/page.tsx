"use client";

import React, { useState } from "react";
import { Download } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function Niveau2() {
  const [team, setTeam] = useState([{ name: "", role: "" }]);
  const [problemDescription, setProblemDescription] = useState("");
  const [containmentActions, setContainmentActions] = useState([
    { action: "", location: "", responsible: "", date: "" },
  ]);
  const [whyList, setWhyList] = useState(["Pourquoi 1"]);
  const [fishboneCauses, setFishboneCauses] = useState({
    Man: "",
    Machine: "",
    Method: "",
    Material: "",
    Environment: "",
    Measurement: "",
  });
  const [correctiveActions, setCorrectiveActions] = useState([
    { cause: "", action: "", responsible: "", dueDate: "" },
  ]);
  const [validation, setValidation] = useState("");
  const [preventiveActions, setPreventiveActions] = useState("");
  const [closureDate, setClosureDate] = useState("");

  const addWhy = () => {
    setWhyList([...whyList, `Pourquoi ${whyList.length + 1}`]);
  };

  const generatePDF = async () => {
    const element = document.getElementById("form-container");
    if (!element) {
      console.error("Element not found");
      return;
    }
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    pdf.addImage(imgData, "PNG", 10, 10, 190, 0);
    pdf.save("rapport_8D.pdf");
  };

  return (
    <div
      id="form-container"
      className="p-6 max-w-6xl mx-auto bg-white shadow-xl rounded-2xl"
    >
      <h1 className="text-3xl font-bold mb-6 text-center">
        🛠️ Formulaire 8D – Traitement d'Incident Qualité
      </h1>

      {/* D1 – Équipe */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">D1 – Équipe Constituée</h2>
        {team.map((member, index) => (
          <div key={index} className="flex gap-4 mb-2">
            <input
              type="text"
              placeholder="Nom"
              className="border p-2 w-1/2 rounded"
              value={member.name}
              onChange={(e) => {
                const updated = [...team];
                updated[index].name = e.target.value;
                setTeam(updated);
              }}
            />
            <input
              type="text"
              placeholder="Rôle"
              className="border p-2 w-1/2 rounded"
              value={member.role}
              onChange={(e) => {
                const updated = [...team];
                updated[index].role = e.target.value;
                setTeam(updated);
              }}
            />
          </div>
        ))}
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded mt-2"
          onClick={() => setTeam([...team, { name: "", role: "" }])}
        >
          + Ajouter un membre
        </button>
      </section>

      {/* D2 – Description du Problème */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">
          D2 – Description du Problème
        </h2>
        <textarea
          rows={4}
          className="w-full border p-2 rounded"
          placeholder="Décrire le défaut, l'impact, le client, etc."
          value={problemDescription}
          onChange={(e) => setProblemDescription(e.target.value)}
        />
      </section>

      {/* D3 – Actions Immédiates */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">D3 – Actions Immédiates</h2>
        {containmentActions.map((action, index) => (
          <div key={index} className="grid grid-cols-4 gap-2 mb-2">
            <input
              type="text"
              placeholder="Action"
              className="border p-2 rounded"
              value={action.action}
              onChange={(e) => {
                const updated = [...containmentActions];
                updated[index].action = e.target.value;
                setContainmentActions(updated);
              }}
            />
            <input
              type="text"
              placeholder="Localisation"
              className="border p-2 rounded"
              value={action.location}
              onChange={(e) => {
                const updated = [...containmentActions];
                updated[index].location = e.target.value;
                setContainmentActions(updated);
              }}
            />
            <input
              type="text"
              placeholder="Responsable"
              className="border p-2 rounded"
              value={action.responsible}
              onChange={(e) => {
                const updated = [...containmentActions];
                updated[index].responsible = e.target.value;
                setContainmentActions(updated);
              }}
            />
            <input
              type="date"
              className="border p-2 rounded"
              value={action.date}
              onChange={(e) => {
                const updated = [...containmentActions];
                updated[index].date = e.target.value;
                setContainmentActions(updated);
              }}
            />
          </div>
        ))}
      </section>

      {/* D4 – Analyse des Causes */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">D4 – Analyse des Causes</h2>

        <h3 className="font-semibold mb-2">🧠 Méthode des 5 Pourquoi</h3>
        {whyList.map((why, index) => (
          <div
            key={index}
            className="flex items-center gap-2 mb-2 border-l-4 pl-4 border-blue-500"
          >
            <span className="font-semibold">{`Pourquoi ${index + 1}`}</span>
            <input
              type="text"
              className="flex-1 border p-2 rounded"
              placeholder={`Explication du Pourquoi ${index + 1}`}
              value={why}
              onChange={(e) => {
                const updated = [...whyList];
                updated[index] = e.target.value;
                setWhyList(updated);
              }}
            />
          </div>
        ))}
        <button onClick={addWhy} className="text-blue-600 hover:underline mb-6">
          + Ajouter un Pourquoi
        </button>

        <h3 className="font-semibold mb-3">🎣 Diagramme d'Ishikawa (5M)</h3>
        <div className="relative p-6 border rounded-xl bg-gray-50">
          <div className="absolute left-1/2 top-1/2 w-2 h-40 bg-gray-600 -translate-x-1/2 -translate-y-1/2 rotate-90"></div>
          {Object.entries(fishboneCauses).map(([category, value], i) => (
            <div
              key={i}
              className={`absolute w-56 ${i < 3 ? "-left-60" : "left-60"} top-[$
                {15 + i * 25
              }%] -translate-y-1/2 flex ${
                i < 3 ? "flex-row-reverse" : "flex-row"
              } items-center`}
            >
              <input
                type="text"
                placeholder={`Cause liée à ${category}`}
                className="border p-2 rounded w-full"
                value={value}
                onChange={(e) =>
                  setFishboneCauses({
                    ...fishboneCauses,
                    [category]: e.target.value,
                  })
                }
              />
              <span className="mx-2 font-semibold text-sm text-gray-600">
                {category}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* D5 – Actions Correctives */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">D5 – Actions Correctives</h2>
        {correctiveActions.map((item, index) => (
          <div key={index} className="grid grid-cols-4 gap-2 mb-2">
            <input
              type="text"
              placeholder="Cause liée"
              className="border p-2 rounded"
              value={item.cause}
              onChange={(e) => {
                const updated = [...correctiveActions];
                updated[index].cause = e.target.value;
                setCorrectiveActions(updated);
              }}
            />
            <input
              type="text"
              placeholder="Action"
              className="border p-2 rounded"
              value={item.action}
              onChange={(e) => {
                const updated = [...correctiveActions];
                updated[index].action = e.target.value;
                setCorrectiveActions(updated);
              }}
            />
            <input
              type="text"
              placeholder="Responsable"
              className="border p-2 rounded"
              value={item.responsible}
              onChange={(e) => {
                const updated = [...correctiveActions];
                updated[index].responsible = e.target.value;
                setCorrectiveActions(updated);
              }}
            />
            <input
              type="date"
              className="border p-2 rounded"
              value={item.dueDate}
              onChange={(e) => {
                const updated = [...correctiveActions];
                updated[index].dueDate = e.target.value;
                setCorrectiveActions(updated);
              }}
            />
          </div>
        ))}
      </section>

      {/* D6 – Validation */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">
          D6 – Validation de l'Efficacité
        </h2>
        <textarea
          rows={3}
          className="w-full border p-2 rounded"
          placeholder="Méthodes de vérification (KPI, audit, tests...)"
          value={validation}
          onChange={(e) => setValidation(e.target.value)}
        />
      </section>

      {/* D7 – Prévention */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">D7 – Actions Préventives</h2>
        <textarea
          rows={3}
          className="w-full border p-2 rounded"
          placeholder="Mise à jour FMEA, formations, etc."
          value={preventiveActions}
          onChange={(e) => setPreventiveActions(e.target.value)}
        />
      </section>

      {/* D8 – Clôture */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3">D8 – Clôture du Rapport</h2>
        <label className="block mb-1 font-medium">Date de clôture :</label>
        <input
          type="date"
          className="border p-2 rounded"
          value={closureDate}
          onChange={(e) => setClosureDate(e.target.value)}
        />
      </section>

      <button
        onClick={generatePDF}
        className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2"
      >
        <Download size={18} /> Télécharger en PDF
      </button>
    </div>
  );
}
