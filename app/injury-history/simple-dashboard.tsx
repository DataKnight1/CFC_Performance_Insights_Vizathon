"use client";

import { useState } from "react";

// Mock injury data
const mockInjuryData = [
  {
    date: "2022-10-15",
    type: "Hamstring Strain",
    severity: "Grade 2",
    status: "Recovered",
    daysOut: 21,
    recurrence: false,
    mechanism: "Sprint",
    location: "Left leg"
  },
  {
    date: "2023-01-08",
    type: "Ankle Sprain",
    severity: "Grade 1",
    status: "Recovered",
    daysOut: 14,
    recurrence: false,
    mechanism: "Tackle",
    location: "Right ankle"
  },
  {
    date: "2023-03-22",
    type: "Knee Contusion",
    severity: "Mild",
    status: "Recovered",
    daysOut: 7,
    recurrence: false,
    mechanism: "Impact",
    location: "Left knee"
  },
  {
    date: "2023-08-05",
    type: "Calf Strain",
    severity: "Grade 1",
    status: "Active Treatment",
    daysOut: 10,
    recurrence: false,
    mechanism: "Deceleration",
    location: "Right leg"
  }
];

// Mock risk assessment data
const riskAssessment = {
  overall: "Medium",
  specific: {
    hamstring: "High",
    ankle: "Medium",
    knee: "Low",
    groin: "Medium"
  },
  factors: [
    "Previous hamstring injury history increases recurrence risk",
    "Fatigue levels increasing during recent match congestion",
    "Asymmetry in calf strength (R < L by 12%)",
    "Sprint mechanical efficiency shows compensatory patterns"
  ]
};

export function SimpleInjuryDashboard() {
  const [timeFrame, setTimeFrame] = useState("all");
  const [injuryType, setInjuryType] = useState("all");
  
  // Calculate summary stats
  const totalInjuries = mockInjuryData.length;
  const totalDaysOut = mockInjuryData.reduce((sum, i) => sum + i.daysOut, 0);
  const avgDaysPerInjury = totalDaysOut / totalInjuries;
  
  return (
    <div className="bg-gray-900 bg-opacity-70 backdrop-blur-sm p-6 rounded-lg border border-gray-800">
      <h2 className="text-xl font-bold text-white mb-6">Injury History Dashboard</h2>
      
      <div className="flex flex-wrap justify-between items-center mb-6">
        <div className="space-x-2 mb-4 md:mb-0">
          <button 
            className={`px-4 py-2 rounded-md text-sm ${timeFrame === "6m" ? 'bg-[#1E54B7] text-white' : 'bg-gray-800 text-white'}`}
            onClick={() => setTimeFrame("6m")}
          >
            Last 6 Months
          </button>
          <button 
            className={`px-4 py-2 rounded-md text-sm ${timeFrame === "12m" ? 'bg-[#1E54B7] text-white' : 'bg-gray-800 text-white'}`}
            onClick={() => setTimeFrame("12m")}
          >
            Last 12 Months
          </button>
          <button 
            className={`px-4 py-2 rounded-md text-sm ${timeFrame === "all" ? 'bg-[#1E54B7] text-white' : 'bg-gray-800 text-white'}`}
            onClick={() => setTimeFrame("all")}
          >
            All Time
          </button>
        </div>
        
        <div className="space-x-2">
          <select 
            className="bg-gray-800 text-white border border-gray-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E54B7]"
            value={injuryType}
            onChange={(e) => setInjuryType(e.target.value)}
          >
            <option value="all">All Injuries</option>
            <option value="hamstring">Hamstring</option>
            <option value="ankle">Ankle</option>
            <option value="knee">Knee</option>
            <option value="calf">Calf</option>
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-gray-400 text-sm mb-1">Total Injuries</h3>
          <p className="text-2xl font-bold text-[#1E54B7]">{totalInjuries}</p>
          <p className="text-gray-400 text-xs mt-1">Past 2 seasons</p>
        </div>
        
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-gray-400 text-sm mb-1">Total Days Out</h3>
          <p className="text-2xl font-bold text-[#1E54B7]">{totalDaysOut}</p>
          <p className="text-gray-400 text-xs mt-1">Due to injuries</p>
        </div>
        
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-gray-400 text-sm mb-1">Avg. Recovery Time</h3>
          <p className="text-2xl font-bold text-[#1E54B7]">{avgDaysPerInjury.toFixed(1)} days</p>
          <p className="text-gray-400 text-xs mt-1">Per injury</p>
        </div>
      </div>
      
      <div className="mb-8">
        <h3 className="text-lg font-medium text-white mb-4">Injury Timeline</h3>
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="relative h-20">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gray-700 rounded-full"></div>
            
            {/* Timeline dots - positioned roughly based on dates */}
            <div className="absolute top-0 left-[20%] w-4 h-4 bg-[#1E54B7] rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute top-0 left-[40%] w-4 h-4 bg-[#1E54B7] rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute top-0 left-[60%] w-4 h-4 bg-[#1E54B7] rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute top-0 left-[80%] w-4 h-4 bg-[#1E54B7] rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
            
            {/* Timeline labels */}
            <div className="absolute top-6 left-[20%] transform -translate-x-1/2 text-center">
              <p className="text-xs text-white">Oct 2022</p>
              <p className="text-xs text-gray-400">Hamstring</p>
            </div>
            <div className="absolute top-6 left-[40%] transform -translate-x-1/2 text-center">
              <p className="text-xs text-white">Jan 2023</p>
              <p className="text-xs text-gray-400">Ankle</p>
            </div>
            <div className="absolute top-6 left-[60%] transform -translate-x-1/2 text-center">
              <p className="text-xs text-white">Mar 2023</p>
              <p className="text-xs text-gray-400">Knee</p>
            </div>
            <div className="absolute top-6 left-[80%] transform -translate-x-1/2 text-center">
              <p className="text-xs text-white">Aug 2023</p>
              <p className="text-xs text-gray-400">Calf</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-white mb-4">Risk Assessment</h3>
          <div className="mb-3">
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-300">Overall Risk</span>
              <span className="text-sm text-yellow-500">Medium</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "50%" }}></div>
            </div>
          </div>
          <div className="mb-3">
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-300">Hamstring Risk</span>
              <span className="text-sm text-red-500">High</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div className="bg-red-500 h-2 rounded-full" style={{ width: "75%" }}></div>
            </div>
          </div>
          <div className="mb-3">
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-300">Ankle Risk</span>
              <span className="text-sm text-yellow-500">Medium</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "50%" }}></div>
            </div>
          </div>
          <div className="mb-3">
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-300">Knee Risk</span>
              <span className="text-sm text-green-500">Low</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: "25%" }}></div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-white mb-4">Risk Factors</h3>
          <ul className="space-y-2">
            {riskAssessment.factors.map((factor, index) => (
              <li key={index} className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 mt-0.5">
                  <div className="h-3 w-3 rounded-full bg-[#1E54B7]"></div>
                </div>
                <p className="ml-2 text-sm text-gray-300">{factor}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium text-white mb-4">Injury Details</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-800">
                <th className="p-3 text-left text-sm font-medium text-gray-300">Date</th>
                <th className="p-3 text-left text-sm font-medium text-gray-300">Type</th>
                <th className="p-3 text-left text-sm font-medium text-gray-300">Severity</th>
                <th className="p-3 text-left text-sm font-medium text-gray-300">Status</th>
                <th className="p-3 text-left text-sm font-medium text-gray-300">Days Out</th>
                <th className="p-3 text-left text-sm font-medium text-gray-300">Mechanism</th>
              </tr>
            </thead>
            <tbody>
              {mockInjuryData.map((injury, index) => (
                <tr key={index} className="border-t border-gray-700">
                  <td className="p-3 text-sm text-white">{injury.date}</td>
                  <td className="p-3 text-sm text-white">{injury.type}</td>
                  <td className="p-3 text-sm text-white">{injury.severity}</td>
                  <td className="p-3 text-sm text-white">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      injury.status === 'Recovered' 
                        ? 'bg-green-500/20 text-green-300' 
                        : 'bg-yellow-500/20 text-yellow-300'
                    }`}>
                      {injury.status}
                    </span>
                  </td>
                  <td className="p-3 text-sm text-white">{injury.daysOut}</td>
                  <td className="p-3 text-sm text-white">{injury.mechanism}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}