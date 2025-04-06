"use client";

import { useState } from "react";

// Define a very simple GPSData interface for this component
interface SimpleGPSData {
  date: string;
  distance: number;
  distance_over_21: number;
  distance_over_24: number;
  distance_over_27: number;
  peak_speed: number;
}

// Mock data to use when real data isn't available
const mockData: SimpleGPSData[] = [
  {
    date: "2022-08-02",
    distance: 4524.085076,
    distance_over_21: 89.27853044,
    distance_over_24: 85.69031816,
    distance_over_27: 61.6343353,
    peak_speed: 30.7559
  },
  {
    date: "2022-08-03",
    distance: 5264.645855,
    distance_over_21: 245.861691,
    distance_over_24: 91.34814267,
    distance_over_27: 20.21058834,
    peak_speed: 28.67495
  },
  {
    date: "2022-08-04",
    distance: 6886.542272,
    distance_over_21: 199.1802595,
    distance_over_24: 84.63473481,
    distance_over_27: 22.58547047,
    peak_speed: 29.2172
  }
];

export function SimpleDashboard() {
  const [timeframe, setTimeframe] = useState<string>("all");
  
  // Calculate summary metrics
  const totalDistance = mockData.reduce((sum, item) => sum + item.distance, 0);
  const highIntensityDistance = mockData.reduce(
    (sum, item) => sum + item.distance_over_21 + item.distance_over_24 + item.distance_over_27, 
    0
  );
  const maxSpeed = Math.max(...mockData.map(item => item.peak_speed));
  
  return (
    <div className="bg-gray-900 bg-opacity-70 backdrop-blur-sm p-6 rounded-lg border border-gray-800">
      <h2 className="text-xl font-bold text-white mb-6">Load Demand Dashboard</h2>
      
      <div className="flex justify-center space-x-2 mb-6">
        {["7 days", "30 days", "90 days", "all"].map(period => (
          <button 
            key={period}
            className={`px-4 py-2 rounded-md text-sm ${
              timeframe === period 
                ? 'bg-[#1E54B7] text-white' 
                : 'bg-gray-800 text-white'
            }`}
            onClick={() => setTimeframe(period)}
          >
            {period}
          </button>
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-gray-400 text-sm mb-1">Total Distance</h3>
          <p className="text-2xl font-bold text-[#1E54B7]">{totalDistance.toLocaleString()} m</p>
          <p className="text-gray-400 text-xs mt-1">{(totalDistance/1000).toFixed(2)} km</p>
        </div>
        
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-gray-400 text-sm mb-1">High Intensity Distance</h3>
          <p className="text-2xl font-bold text-[#1E54B7]">{highIntensityDistance.toLocaleString()} m</p>
          <p className="text-gray-400 text-xs mt-1">{((highIntensityDistance/totalDistance)*100).toFixed(1)}% of total</p>
        </div>
        
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-gray-400 text-sm mb-1">Max Speed</h3>
          <p className="text-2xl font-bold text-[#1E54B7]">{maxSpeed.toFixed(1)} km/h</p>
          <p className="text-gray-400 text-xs mt-1">Peak recorded value</p>
        </div>
      </div>
      
      <div className="mt-6">
        <h3 className="text-lg font-medium text-white mb-4">Session Data</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-800">
                <th className="p-3 text-left text-sm font-medium text-gray-300">Date</th>
                <th className="p-3 text-left text-sm font-medium text-gray-300">Distance (m)</th>
                <th className="p-3 text-left text-sm font-medium text-gray-300">High Intensity (m)</th>
                <th className="p-3 text-left text-sm font-medium text-gray-300">Peak Speed (km/h)</th>
              </tr>
            </thead>
            <tbody>
              {mockData.map((item, index) => (
                <tr key={index} className="border-t border-gray-700">
                  <td className="p-3 text-sm text-white">{item.date}</td>
                  <td className="p-3 text-sm text-white">{item.distance.toLocaleString()}</td>
                  <td className="p-3 text-sm text-white">
                    {(item.distance_over_21 + item.distance_over_24 + item.distance_over_27).toLocaleString()}
                  </td>
                  <td className="p-3 text-sm text-white">{item.peak_speed.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}