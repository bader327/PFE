"use client";

import { AlertTriangle, Download, Loader2 } from 'lucide-react';
import React, { useState } from 'react';
import { generate5MCauses, IshikawaDiagram } from '../../lib/ishikawaGenerator';
import { generateFpsReport } from '../../lib/pdfGenerator';

interface FpsReportProps {
  fps: any;
  onClose?: () => void;
}

const FpsReport: React.FC<FpsReportProps> = ({ fps, onClose }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handleGeneratePdf = async () => {
    if (!fps || !fps.id) {
      setError('Données FPS invalides');
      return;
    }

    try {
      setIsGenerating(true);
      setError(null);
      
      // Get quality trend data for the past 7 days if level 2 or 3
      let qualityTrendData = null;
      
      if (fps.fps2) {
        try {
          // Get current date and calculate date 7 days ago
          const endDate = new Date().toISOString().split('T')[0];
          const startDate = new Date();
          startDate.setDate(startDate.getDate() - 7);
          const startDateStr = startDate.toISOString().split('T')[0];
          
          const ligneId = fps.file?.ligneId;
          
          if (ligneId) {
            const response = await fetch(`/api/kpi?ligneId=${ligneId}&startDate=${startDateStr}&endDate=${endDate}`);
            if (response.ok) {
              const data = await response.json();
              
              if (data.chartData && data.chartData.length > 0) {
                qualityTrendData = {
                  dates: data.chartData.map((day: any) => day.date),
                  ftqValues: data.chartData.map((day: any) => day.ftq),
                  rejectRates: data.chartData.map((day: any) => day.tauxRejets)
                };
              }
            }
          }
        } catch (trendError) {
          console.error('Error fetching trend data:', trendError);
          // Continue with PDF generation even if trend data is not available
        }
      }
        // Generate the PDF directly and download it
      // Since we can't modify the internal implementation of generateFpsReport,
      // we'll call it as is to generate the PDF blob
      const pdfBlob = await generateFpsReport(fps);
      
      // Create a URL for the blob
      const url = URL.createObjectURL(pdfBlob);
      
      // Create a link and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = `FPS-${fps.id}-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
    } catch (err) {
      console.error('Error generating PDF:', err);
      setError('Une erreur est survenue lors de la génération du PDF');
    } finally {
      setIsGenerating(false);
    }
  };

  // Determine the FPS level
  const getFpsLevel = () => {
    if (fps?.fps2?.fps3) return 3;
    if (fps?.fps2) return 2;
    return 1;
  };

  const fpsLevel = getFpsLevel();

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Rapport FPS</h2>
        <div className="flex gap-2">
          <button
            onClick={handleGeneratePdf}
            disabled={isGenerating}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              isGenerating ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Génération...
              </>
            ) : (
              <>
                <Download className="h-5 w-5" />
                Télécharger PDF
              </>
            )}
          </button>
          
          {onClose && (
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
            >
              Fermer
            </button>
          )}
        </div>
      </div>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">
          FPS Niveau {fpsLevel}
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Numéro de référence</p>
            <p className="font-medium">{fps.id}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Date</p>
            <p className="font-medium">
              {fps.file?.uploadedAt
                ? new Date(fps.file.uploadedAt).toLocaleDateString()
                : "Non spécifiée"}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Informations sur le défaut</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-100 p-3 rounded-lg">
            <p className="text-sm text-gray-600">Type de défaut</p>
            <p className="font-medium">{fps.defaut || "Non spécifié"}</p>
          </div>
          <div className="bg-gray-100 p-3 rounded-lg">
            <p className="text-sm text-gray-600">Produit</p>
            <p className="font-medium">{fps.produit || "Non spécifié"}</p>
          </div>
          <div className="bg-gray-100 p-3 rounded-lg">
            <p className="text-sm text-gray-600">Numéro de bobine</p>
            <p className="font-medium">{fps.numeroBobine || "Non spécifié"}</p>
          </div>
          <div className="bg-gray-100 p-3 rounded-lg">
            <p className="text-sm text-gray-600">Opérateur</p>
            <p className="font-medium">{fps.operateur || "Non spécifié"}</p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Analyse et actions</h3>
        <div className="bg-gray-100 p-3 rounded-lg mb-3">
          <p className="text-sm text-gray-600">Cause identifiée</p>
          <p className="font-medium">{fps.cause || "Non spécifiée"}</p>
        </div>
        <div className="bg-gray-100 p-3 rounded-lg">
          <p className="text-sm text-gray-600">Actions correctives</p>
          <p className="font-medium">{fps.actions || "Non spécifiées"}</p>
        </div>
      </div>
      
      {/* Production metrics if available */}
      {fps.file && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Métriques de production</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-gray-100 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Produits conformes</p>
              <p className="font-medium">{fps.file.produitsConformes}</p>
            </div>
            <div className="bg-gray-100 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Produits non conformes</p>
              <p className="font-medium">{fps.file.produitsNonConformes}</p>
            </div>
            <div className="bg-gray-100 p-3 rounded-lg">
              <p className="text-sm text-gray-600">FTQ</p>
              <p className="font-medium">{fps.file.ftq.toFixed(2)}%</p>
            </div>
          </div>
        </div>
      )}

      {/* If we have level 2 info, show Ishikawa diagram */}
      {fps.fps2 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Analyse des causes (5M)</h3>
          <IshikawaDiagram 
            problem={fps.fps2.probleme || "Problème non spécifié"}
            categories={generate5MCauses(fps)}
          />
        </div>
      )}
      
      <div className="text-xs text-gray-500 text-center mt-8">
        <p>Ce rapport a été généré automatiquement par le système KPI Dashboard.</p>
        <p>Date de génération: {new Date().toLocaleString()}</p>
      </div>
    </div>
  );
};

export default FpsReport;
