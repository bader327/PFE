"use client";
import React, { useState } from "react";

// Définition de l'interface pour le state formData
interface FormData {
  // D1-D2 Data
  customerName: string;
  incidentNumber: string;
  incidentDate: string;
  rejectedQuantity: string;
  customerId: string;
  internalClaimNumber: string;
  function: string;
  color: string;
  productionDate: string;
  receivedDate: string;
  whatHappened: string;
  whyProblem: string;
  whenDetected: string;
  whoDetected: string;
  whereDetected: string;
  howDetected: string;
  badPartsCount: string;
  productionProcess: string;
  plantLocation: string;
  defectName: string;
  defectFamily: string;
  lastSimilarProblem: string;
  isCritical: string;
  criticalityClassification: string;
  qualityManagerValidation: string;
  validationDate: string;

  // D3 Data
  containmentActions: Array<{
    localization: string;
    actionTaken: string;
    responsible: string;
    date: string;
    status: string;
    comments: string;
  }>;

  spool1: string;
  spool2: string;
  spool3: string;
  extrusionRef: string;
  extrusionAction: string;
  extrusionResults: string;
  extrusionStatus: string;
  extrusionResponsible: string;
  extrusionDate: string;
  transitResults: string;
  transitId: string;
  transitReference: string;
  transitLength: string;
  transitProdDate: string;
  transitColor: string;
  transitResponsible: string;
  transitDate: string;
  transitStatus: string;
  customerStockResults: string;
  customerStockId: string;
  customerStockReference: string;
  customerStockLength: string;
  customerStockProdDate: string;
  customerStockEMP: string;
  customerStockResponsible: string;
  customerStockDate: string;
  customerStockStatus: string;
  okSpools: string;
  nokSpools: string;
  resultCommunicated: string;
  communicationDate: string;
  customerCareValidation: string;
  customerCareValidationDate: string;
  replacementId: string;
  replacementSerial: string;
  replacementItem: string;
  replacementDescription: string;
  replacementQuantity: string;
  replacementDate: string;
  alertIncidentNumber: string;
  alertIncidentType: string;
  alertCustomerDescription: string;
  awarenessMessage: string;
  awarenessEnsuredBy: string;
  awarenessDate: string;

  // D4-D8 Data (à compléter selon besoin)
  rootCauses: any[];
  correctiveActions: any[];
  effectivenessChecks: any[];
  preventiveActions: any[];
  closureData: any;
}

export default function QualityDashboard() {
  const [activeTab, setActiveTab] = useState("d1");
  const [formData, setFormData] = useState<FormData>({
    // D1-D2 Initial Data
    customerName: "",
    incidentNumber: "",
    incidentDate: "",
    rejectedQuantity: "",
    customerId: "",
    internalClaimNumber: "",
    function: "",
    color: "",
    productionDate: "",
    receivedDate: "",
    whatHappened: "",
    whyProblem: "",
    whenDetected: "",
    whoDetected: "",
    whereDetected: "",
    howDetected: "",
    badPartsCount: "",
    productionProcess: "",
    plantLocation: "",
    defectName: "",
    defectFamily: "",
    lastSimilarProblem: "",
    isCritical: "",
    criticalityClassification: "",
    qualityManagerValidation: "",
    validationDate: "",

    // D3 Initial Data
    containmentActions: [],
    spool1: "",
    spool2: "",
    spool3: "",
    extrusionRef: "",
    extrusionAction: "",
    extrusionResults: "",
    extrusionStatus: "",
    extrusionResponsible: "",
    extrusionDate: "",
    transitResults: "",
    transitId: "",
    transitReference: "",
    transitLength: "",
    transitProdDate: "",
    transitColor: "",
    transitResponsible: "",
    transitDate: "",
    transitStatus: "",
    customerStockResults: "",
    customerStockId: "",
    customerStockReference: "",
    customerStockLength: "",
    customerStockProdDate: "",
    customerStockEMP: "",
    customerStockResponsible: "",
    customerStockDate: "",
    customerStockStatus: "",
    okSpools: "",
    nokSpools: "",
    resultCommunicated: "",
    communicationDate: "",
    customerCareValidation: "",
    customerCareValidationDate: "",
    replacementId: "",
    replacementSerial: "",
    replacementItem: "",
    replacementDescription: "",
    replacementQuantity: "",
    replacementDate: "",
    alertIncidentNumber: "",
    alertIncidentType: "",
    alertCustomerDescription: "",
    awarenessMessage: "",
    awarenessEnsuredBy: "",
    awarenessDate: "",

    // D4-D8 Initial Data
    rootCauses: [],
    correctiveActions: [],
    effectivenessChecks: [],
    preventiveActions: [],
    closureData: {},
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (
    arrayName: keyof FormData,
    index: number,
    field: string,
    value: string
  ) => {
    setFormData((prev) => {
      const newArray = [...(prev[arrayName] as any[])];
      newArray[index] = { ...newArray[index], [field]: value };
      return { ...prev, [arrayName]: newArray };
    });
  };

  const addArrayItem = (arrayName: keyof FormData, template: any) => {
    setFormData((prev) => ({
      ...prev,
      [arrayName]: [...(prev[arrayName] as any[]), template],
    }));
  };

  // Render functions remain the same as before...
  const renderD1D2 = () => (
    <div className="p-6 bg-white rounded-lg shadow">
      {/* ... (same as before) */}
    </div>
  );

  const renderD3 = () => (
    <div className="p-6 bg-white rounded-lg shadow">
      {/* ... (same as before) */}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-blue-800 text-white p-4 shadow-md">
        <h1 className="text-2xl font-bold">
          8D Report - Quality Incident Analysis
        </h1>
        <p className="text-sm">COFICAB Quality Management System</p>
      </div>

      <div className="container mx-auto p-4">
        <div className="mb-6 bg-white rounded-lg shadow overflow-hidden">
          <div className="flex border-b">
            {["d1", "d3", "d4", "d5", "d6", "d7", "d8"].map((tab) => (
              <button
                key={tab}
                className={`px-4 py-2 font-medium ${
                  activeTab === tab
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {activeTab === "d1" && renderD1D2()}
        {activeTab === "d3" && renderD3()}
        {/* Add other tab renders here */}

        <div className="mt-6 flex justify-end space-x-4">
          <button className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Save Draft
          </button>
          <button className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Submit Report
          </button>
        </div>
      </div>
    </div>
  );
}
