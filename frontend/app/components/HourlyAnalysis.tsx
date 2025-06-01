"use client";

import { AlertTriangle, Calendar, Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';

interface HourlyAnalysisProps {
  ligneId: string;
  date: string;
}

interface HourlyData {
  hour: number;
  hourLabel: string;
  produitsConformes: number;
  produitsNonConformes: number;
  bobinesIncompletes: number;
  ftq: number;
  tauxProduction: number;
  tauxRejets: number;
  fileCount: number;
}

interface Alert {
  hour: number;
  hourLabel: string;
  ftq: number;
  tauxProduction: number;
  message: string;
}

interface ShiftData {
  name: string;
  hours: number[];
  data: {
    produitsConformes: number;
    produitsNonConformes: number;
    bobinesIncompletes: number;
    ftq: number;
    count: number;
  };
}

const HourlyAnalysis: React.FC<HourlyAnalysisProps> = ({ ligneId, date }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hourlyData, setHourlyData] = useState<HourlyData[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [shifts, setShifts] = useState<ShiftData[]>([]);
  
  useEffect(() => {
    const fetchHourlyData = async () => {
      if (!ligneId || !date) {
        setError('ligne ID and date are required');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(
          `/api/hourly-analysis?ligneId=${ligneId}&date=${date}`
        );
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        setHourlyData(data.hourlyData);
        setAlerts(data.alerts);
        setShifts(data.shifts);
        
      } catch (err) {
        console.error('Error fetching hourly analysis:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    
    fetchHourlyData();
  }, [ligneId, date]);
  
  // Filter out hours with no data for better chart visualization
  const activeHours = hourlyData.filter(hour => hour.fileCount > 0);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-5">
        <div className="flex">
          <AlertTriangle className="h-6 w-6 text-red-400" />
          <div className="ml-3">
            <p className="text-sm text-red-700">
              Error loading hourly analysis data: {error}
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  if (activeHours.length === 0) {
    return (
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              No production data available for the selected date.
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center mb-6">
        <Calendar className="h-5 w-5 text-blue-600 mr-2" />
        <h2 className="text-xl font-bold">
          Hourly Production Analysis - {new Date(date).toLocaleDateString()}
        </h2>
      </div>
      
      {alerts.length > 0 && (
        <div className="mb-6 bg-orange-50 border-l-4 border-orange-500 p-4 rounded">
          <h3 className="text-lg font-semibold flex items-center text-orange-800">
            <AlertTriangle className="h-5 w-5 mr-2" /> 
            Alert Hours
          </h3>
          <ul className="mt-2 space-y-1">
            {alerts.map((alert, index) => (
              <li key={index} className="text-orange-700">
                {alert.message}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Hourly FTQ & Production Rates</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={activeHours}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hourLabel" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="ftq" 
                name="FTQ (%)" 
                stroke="#3b82f6" 
                strokeWidth={2} 
                dot={{ r: 5 }}
                activeDot={{ r: 8 }}
              />
              <Line 
                type="monotone" 
                dataKey="tauxProduction" 
                name="Production Rate (%)" 
                stroke="#10b981" 
                strokeWidth={2}
                dot={{ r: 5 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Hourly Production Volumes</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={activeHours}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hourLabel" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar 
                dataKey="produitsConformes" 
                name="Products OK" 
                fill="#10b981" 
                stackId="a"
              />
              <Bar 
                dataKey="produitsNonConformes" 
                name="Products NOK" 
                fill="#ef4444" 
                stackId="a"
              />
              <Bar 
                dataKey="bobinesIncompletes" 
                name="Incomplete Reels" 
                fill="#f59e0b" 
                stackId="a"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Shift Performance Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {shifts.map((shift, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h4 className="font-semibold text-lg mb-2">{shift.name}</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-700">FTQ:</span>
                  <span className={`font-semibold ${shift.data.ftq < 85 ? 'text-red-600' : 'text-green-600'}`}>
                    {shift.data.ftq ? `${shift.data.ftq}%` : 'N/A'}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-700">Products OK:</span>
                  <span className="font-semibold">{shift.data.produitsConformes}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-700">Products NOK:</span>
                  <span className="font-semibold">{shift.data.produitsNonConformes}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-700">Incomplete:</span>
                  <span className="font-semibold">{shift.data.bobinesIncompletes}</span>
                </div>
              </div>
              
              {shift.data.ftq < 85 && shift.data.count > 0 && (
                <div className="mt-3 bg-red-50 p-2 rounded border border-red-200 text-sm text-red-700">
                  <AlertTriangle className="h-4 w-4 inline-block mr-1" />
                  Low FTQ detected
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HourlyAnalysis;
