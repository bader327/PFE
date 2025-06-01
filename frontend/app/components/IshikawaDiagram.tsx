"use client";

import React from 'react';

export interface CauseCategory {
  name: string;
  causes: string[];
}

interface IshikawaDiagramProps {
  problem: string;
  categories: CauseCategory[];
}

const IshikawaDiagram: React.FC<IshikawaDiagramProps> = ({ problem, categories }) => {
  return (
    <div className="ishikawa-diagram p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-center mb-6">Diagramme d'Ishikawa</h2>
      
      <div className="flex flex-col items-center relative">
        {/* Main problem box */}
        <div className="problem-box border-2 border-blue-800 p-3 w-64 bg-blue-100 text-center rounded-lg mb-6">
          <span className="font-semibold">{problem}</span>
        </div>
        
        {/* Main horizontal arrow line */}
        <div className="main-arrow w-full h-1 bg-gray-800 relative mb-6">
          {/* Arrow head */}
          <div className="arrow-head absolute right-0 -top-2 w-0 h-0 
            border-t-[10px] border-t-transparent 
            border-b-[10px] border-b-transparent
            border-l-[20px] border-l-gray-800"></div>
        </div>
        
        {/* Cause categories */}
        <div className="cause-categories grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
          {categories.map((category, index) => (
            <div key={index} className="cause-category bg-gray-100 p-3 rounded-lg">
              <h3 className="font-semibold text-blue-800 border-b pb-2 mb-2">{category.name}</h3>
              <ul className="list-disc pl-5">
                {category.causes.map((cause, idx) => (
                  <li key={idx} className="text-sm mb-1">{cause}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>  );
};

export default IshikawaDiagram;
