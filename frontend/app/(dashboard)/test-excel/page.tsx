"use client";

import { FileUp } from 'lucide-react';
import React, { useState } from 'react';
import ExcelTest from '../../components/ExcelTest';

export default function TestExcelPage() {
  const [filePath, setFilePath] = useState('');
  const [showTest, setShowTest] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowTest(true);
  };
  
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Excel Parser Test</h1>
      
      <form onSubmit={handleSubmit} className="mb-8 bg-white p-6 rounded-lg shadow">
        <div className="mb-4">
          <label htmlFor="filePath" className="block text-sm font-medium text-gray-700 mb-1">
            Excel File Path
          </label>
          <div className="flex gap-2">
            <input
              id="filePath"
              type="text"
              value={filePath}
              onChange={(e) => setFilePath(e.target.value)}
              placeholder="e.g., C:/Users/ala/Desktop/PFE/08.01 (1).xlsx"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2"
            >
              <FileUp className="h-5 w-5" />
              Test File
            </button>
          </div>
          <p className="mt-1 text-sm text-gray-500">Enter the absolute path to the Excel file you want to test</p>
        </div>
      </form>
      
      {showTest && (
        <ExcelTest filePath={filePath} />
      )}
      
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-md p-4 text-blue-800">
        <h2 className="text-lg font-semibold mb-2">How to use the Excel Parser Test</h2>
        <ol className="list-decimal pl-5 space-y-2">
          <li>Enter the full path to your Excel file in the input field above</li>
          <li>Click "Test File" to analyze the Excel file</li>
          <li>View the results to confirm that the Excel structure is properly understood</li>
          <li>Check if FPS conditions are detected correctly</li>
          <li>Verify that the relevant KPIs are calculated properly</li>
        </ol>
      </div>
    </div>
  );
}
