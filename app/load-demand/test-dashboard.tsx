"use client";

import { useState, useEffect } from "react";

export function TestDashboard() {
  return (
    <div className="p-4 bg-gray-900 text-white rounded-lg">
      <h2 className="text-xl font-bold mb-4">Test Dashboard</h2>
      <p>This is a simple test dashboard to verify that components are rendering correctly.</p>
      
      <div className="mt-4 p-4 bg-gray-800 rounded">
        <h3 className="text-lg font-semibold mb-2">Sample Metrics</h3>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="bg-blue-900 p-3 rounded">
            <div className="text-sm text-gray-300">Total Distance</div>
            <div className="text-2xl font-bold">7,500 m</div>
          </div>
          <div className="bg-blue-900 p-3 rounded">
            <div className="text-sm text-gray-300">High Intensity</div>
            <div className="text-2xl font-bold">1,200 m</div>
          </div>
          <div className="bg-blue-900 p-3 rounded">
            <div className="text-sm text-gray-300">Max Speed</div>
            <div className="text-2xl font-bold">32 km/h</div>
          </div>
        </div>
      </div>
    </div>
  );
}