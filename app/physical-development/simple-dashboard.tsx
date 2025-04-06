"use client";

import { useState } from "react";

// Mock data for physical capability
const mockData = [
  {
    date: "2022-08-02",
    movement: "Agility",
    quality: "Acceleration",
    expression: "Dynamic",
    benchmarkPct: 85.2
  },
  {
    date: "2022-08-03",
    movement: "Sprint",
    quality: "Max velocity",
    expression: "Dynamic",
    benchmarkPct: 78.6
  },
  {
    date: "2022-08-04",
    movement: "Jump",
    quality: "Take off",
    expression: "Dynamic",
    benchmarkPct: 82.3
  },
  {
    date: "2022-08-05",
    movement: "Upper Body",
    quality: "Push",
    expression: "Isometric",
    benchmarkPct: 75.9
  }
];

export function SimplePhysicalDashboard() {
  const [selectedMovement, setSelectedMovement] = useState<string>("Sprint");
  
  // Get data for selected movement
  const movementData = mockData.filter(item => 
    item.movement.toLowerCase() === selectedMovement.toLowerCase()
  );
  
  // Calculate average benchmark
  const avgBenchmark = movementData.length > 0
    ? movementData.reduce((sum, item) => sum + item.benchmarkPct, 0) / movementData.length
    : 0;
  
  return (
    <div className="bg-gray-900 bg-opacity-70 backdrop-blur-sm p-6 rounded-lg border border-gray-800">
      <h2 className="text-xl font-bold text-white mb-6">Physical Development Dashboard</h2>
      
      <div className="flex justify-center space-x-2 mb-6">
        {["Agility", "Sprint", "Jump", "Upper Body"].map(movement => (
          <button 
            key={movement}
            className={`px-4 py-2 rounded-md text-sm ${
              selectedMovement === movement 
                ? 'bg-[#1E54B7] text-white' 
                : 'bg-gray-800 text-white'
            }`}
            onClick={() => setSelectedMovement(movement)}
          >
            {movement}
          </button>
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-gray-400 text-sm mb-1">Benchmark Score</h3>
          <p className="text-2xl font-bold text-[#1E54B7]">{avgBenchmark.toFixed(1)}%</p>
          <p className="text-gray-400 text-xs mt-1">Overall {selectedMovement} capability</p>
        </div>
        
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-gray-400 text-sm mb-1">Improvement Rate</h3>
          <p className="text-2xl font-bold text-green-500">+4.2%</p>
          <p className="text-gray-400 text-xs mt-1">Over last 30 days</p>
        </div>
        
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-gray-400 text-sm mb-1">League Position</h3>
          <p className="text-2xl font-bold text-[#1E54B7]">Top 20%</p>
          <p className="text-gray-400 text-xs mt-1">Among premier league players</p>
        </div>
      </div>
      
      <div className="mt-6">
        <h3 className="text-lg font-medium text-white mb-4">Movement Analysis</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-800">
                <th className="p-3 text-left text-sm font-medium text-gray-300">Date</th>
                <th className="p-3 text-left text-sm font-medium text-gray-300">Quality</th>
                <th className="p-3 text-left text-sm font-medium text-gray-300">Expression</th>
                <th className="p-3 text-left text-sm font-medium text-gray-300">Benchmark %</th>
              </tr>
            </thead>
            <tbody>
              {movementData.length > 0 ? (
                movementData.map((item, index) => (
                  <tr key={index} className="border-t border-gray-700">
                    <td className="p-3 text-sm text-white">{item.date}</td>
                    <td className="p-3 text-sm text-white">{item.quality}</td>
                    <td className="p-3 text-sm text-white">{item.expression}</td>
                    <td className="p-3 text-sm text-white">{item.benchmarkPct.toFixed(1)}%</td>
                  </tr>
                ))
              ) : (
                <tr className="border-t border-gray-700">
                  <td colSpan={4} className="p-3 text-center text-sm text-gray-400">
                    No data available for {selectedMovement}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="mt-8">
        <h3 className="text-lg font-medium text-white mb-4">Development Recommendations</h3>
        <div className="bg-gray-800 p-4 rounded-lg">
          <ul className="list-disc pl-5 space-y-2 text-gray-200">
            <li>Focus on {selectedMovement.toLowerCase()} technique refinement</li>
            <li>Increase {selectedMovement === "Sprint" ? "speed" : "strength"} training frequency</li>
            <li>Add stability exercises to support {selectedMovement.toLowerCase()} development</li>
          </ul>
        </div>
      </div>
    </div>
  );
}