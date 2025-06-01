"use client";

import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import React, { useState } from 'react';

interface ExcelTestProps {
  filePath: string;
}

const ExcelTest: React.FC<ExcelTestProps> = ({ filePath }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  
  // Test parsing the Excel file
  const testExcelParser = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/test-excel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ filePath }),
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error('Error testing Excel parser:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Excel Parser Test Tool</h2>
      
      <div className="mb-4">
        <p className="text-gray-600">File Path: {filePath}</p>
        
        <button
          onClick={testExcelParser}
          disabled={loading}
          className="mt-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center gap-2 disabled:bg-blue-300"
        >
          {loading ? <Loader2 className="animate-spin h-4 w-4" /> : null}
          Test Excel Parser
        </button>
      </div>
      
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md flex items-start gap-2 text-red-700 mb-4">
          <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}
      
      {result && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Parsing Results</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
              <h4 className="font-medium text-gray-700 mb-2">Produits Conformes</h4>
              <p className="text-2xl font-bold">{result.produitsConformes}</p>
            </div>
            
            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
              <h4 className="font-medium text-gray-700 mb-2">Produits Non Conformes</h4>
              <p className="text-2xl font-bold">{result.produitsNonConformes}</p>
            </div>
            
            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
              <h4 className="font-medium text-gray-700 mb-2">Bobines Incomplètes</h4>
              <p className="text-2xl font-bold">{result.bobinesIncompletes}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
              <h4 className="font-medium text-gray-700 mb-2">FTQ</h4>
              <p className="text-2xl font-bold">{result.conformityRate.toFixed(1)}%</p>
            </div>
            
            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
              <h4 className="font-medium text-gray-700 mb-2">Taux de Production</h4>
              <p className="text-2xl font-bold">{result.productionRate.toFixed(1)}%</p>
            </div>
            
            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
              <h4 className="font-medium text-gray-700 mb-2">Taux de Rejets</h4>
              <p className="text-2xl font-bold">{result.rejectRate.toFixed(1)}%</p>
            </div>
          </div>
          
          <div className="mb-6">
            <h4 className="font-medium text-gray-700 mb-2">Information Supplémentaire</h4>
            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 overflow-auto">
              <pre className="whitespace-pre-wrap text-sm">{JSON.stringify(result.extendedInfo, null, 2)}</pre>
            </div>
          </div>
          
          <div className="mb-6">
            <h4 className="font-medium text-gray-700 mb-2">Bobines avec Défauts ({result.bobinesData.filter((b: any) => b.hasDefect).length})</h4>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2 text-left">ID</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Numéro Bobine</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Produit</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Statut</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Défauts</th>
                  </tr>
                </thead>
                <tbody>
                  {result.bobinesData
                    .filter((bobine: any) => bobine.hasDefect)
                    .slice(0, 10) // limit to 10 rows for display
                    .map((bobine: any, index: number) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="border border-gray-300 px-4 py-2">{bobine.id}</td>
                        <td className="border border-gray-300 px-4 py-2">{bobine.numeroBobine}</td>
                        <td className="border border-gray-300 px-4 py-2">{bobine.produit}</td>
                        <td className="border border-gray-300 px-4 py-2">{bobine.statut}</td>
                        <td className="border border-gray-300 px-4 py-2">
                          {Object.entries(bobine.defauts)
                            .filter(([_, value]) => value)
                            .map(([key, _]) => key)
                            .join(', ')}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              {result.bobinesData.filter((b: any) => b.hasDefect).length > 10 && (
                <p className="mt-2 text-sm text-gray-500">
                  Affichage des 10 premiers résultats sur {result.bobinesData.filter((b: any) => b.hasDefect).length} bobines avec défauts.
                </p>
              )}
            </div>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-md p-3 flex items-start gap-2 text-green-700">
            <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Excel file processed successfully!</p>
              <p className="text-sm mt-1">FPS conditions detected: {result.fpsRequired ? 'Yes' : 'No'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExcelTest;
