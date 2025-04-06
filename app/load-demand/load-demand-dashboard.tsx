"use client"

import { useState } from "react"
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer, LineChart, Line, Area, 
  AreaChart, PieChart, Pie, Cell, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts'
import { InfoTooltip } from "../components/info-tooltip"
import type { GPSData, calculateHighIntensityMinutes, calculateSprintDistance } from "../utils/gps-data"

interface LoadDemandDashboardProps {
  gpsData: GPSData[]
}

export function LoadDemandDashboard({ gpsData }: LoadDemandDashboardProps) {
  const [timeFrame, setTimeFrame] = useState<'7days' | '30days' | '90days' | 'all'>('30days')
  
  // Filter data based on selected timeframe
  const filteredData = filterDataByTimeframe(gpsData, timeFrame)
  
  // Calculate key metrics
  const totalDistance = filteredData.reduce((sum, item) => sum + item.distance, 0)
  const highIntensityDistance = filteredData.reduce((sum, item) => 
    sum + item.distance_over_21 + item.distance_over_24 + item.distance_over_27, 0)
  const totalAccelerations = filteredData.reduce((sum, item) => 
    sum + item.accel_decel_over_2_5 + item.accel_decel_over_3_5 + item.accel_decel_over_4_5, 0)
  const maxPeakSpeed = Math.max(...filteredData.map(item => item.peak_speed))
  
  // Prepare chart data
  const dailyDistanceData = filteredData.map(item => ({
    date: new Date(item.date).toLocaleDateString(),
    distance: item.distance,
    highIntensity: item.distance_over_21 + item.distance_over_24 + item.distance_over_27,
    accelerations: item.accel_decel_over_2_5 + item.accel_decel_over_3_5 + item.accel_decel_over_4_5
  })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  
  // Prepare high-intensity distribution data
  const highIntensityData = [
    { name: "21-24 km/h", value: filteredData.reduce((sum, item) => sum + item.distance_over_21, 0) },
    { name: "24-27 km/h", value: filteredData.reduce((sum, item) => sum + item.distance_over_24, 0) },
    { name: "27+ km/h", value: filteredData.reduce((sum, item) => sum + item.distance_over_27, 0) }
  ]
  
  // Prepare acceleration distribution data
  const accelerationData = [
    { name: "2.5-3.5 m/s²", value: filteredData.reduce((sum, item) => sum + item.accel_decel_over_2_5, 0) },
    { name: "3.5-4.5 m/s²", value: filteredData.reduce((sum, item) => sum + item.accel_decel_over_3_5, 0) },
    { name: "4.5+ m/s²", value: filteredData.reduce((sum, item) => sum + item.accel_decel_over_4_5, 0) }
  ]
  
  // Prepare session type distribution
  const sessionTypes = filteredData.reduce((acc, item) => {
    const type = determineSessionType(item);
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const sessionTypeData = Object.entries(sessionTypes).map(([name, value]) => ({ name, value }));
  
  // Colors
  const COLORS = ['#1E54B7', '#0CAFFF', '#365EFF', '#4169E1'];
  
  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 p-3 border border-gray-700 rounded shadow-lg">
          <p className="text-white font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value.toLocaleString()} {entry.name === 'distance' ? 'm' : 
                entry.name === 'highIntensity' ? 'm' : 
                entry.name === 'accelerations' ? 'count' : ''}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };
  
  // Prepare radar chart data
  const performanceRadarData = [
    { subject: 'Distance', A: calculatePerformancePercentile(filteredData, 'distance'), fullMark: 100 },
    { subject: 'Speed', A: calculatePerformancePercentile(filteredData, 'peak_speed'), fullMark: 100 },
    { subject: 'Hi-Int. Dist', A: calculatePerformancePercentile(filteredData, 'high_intensity'), fullMark: 100 },
    { subject: 'Accelerations', A: calculatePerformancePercentile(filteredData, 'accelerations'), fullMark: 100 },
    { subject: 'Duration', A: calculatePerformancePercentile(filteredData, 'day_duration'), fullMark: 100 },
  ];
  
  return (
    <div className="space-y-8">
      {/* TimeFrame Selector */}
      <div className="flex justify-center space-x-2">
        <button 
          className={`px-4 py-2 rounded-md text-sm ${timeFrame === '7days' ? 'bg-[#1E54B7] text-white' : 'bg-gray-800 text-white'}`}
          onClick={() => setTimeFrame('7days')}
        >
          7 Days
        </button>
        <button 
          className={`px-4 py-2 rounded-md text-sm ${timeFrame === '30days' ? 'bg-[#1E54B7] text-white' : 'bg-gray-800 text-white'}`}
          onClick={() => setTimeFrame('30days')}
        >
          30 Days
        </button>
        <button 
          className={`px-4 py-2 rounded-md text-sm ${timeFrame === '90days' ? 'bg-[#1E54B7] text-white' : 'bg-gray-800 text-white'}`}
          onClick={() => setTimeFrame('90days')}
        >
          90 Days
        </button>
        <button 
          className={`px-4 py-2 rounded-md text-sm ${timeFrame === 'all' ? 'bg-[#1E54B7] text-white' : 'bg-gray-800 text-white'}`}
          onClick={() => setTimeFrame('all')}
        >
          All Data
        </button>
      </div>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-900 bg-opacity-70 backdrop-blur-sm p-6 rounded-lg border border-gray-800">
          <div className="flex items-center">
            <h3 className="text-lg font-medium text-white mb-2">Total Distance</h3>
            <InfoTooltip text="Total distance covered during all sessions in the selected time period" />
          </div>
          <p className="text-3xl font-bold text-[#1E54B7]">{totalDistance.toLocaleString()} m</p>
          <p className="text-gray-400 text-sm mt-2">{(totalDistance / 1000).toFixed(2)} km</p>
        </div>
        
        <div className="bg-gray-900 bg-opacity-70 backdrop-blur-sm p-6 rounded-lg border border-gray-800">
          <div className="flex items-center">
            <h3 className="text-lg font-medium text-white mb-2">High Intensity Distance</h3>
            <InfoTooltip text="Distance covered at speeds above 21 km/h" />
          </div>
          <p className="text-3xl font-bold text-[#1E54B7]">{highIntensityDistance.toLocaleString()} m</p>
          <p className="text-gray-400 text-sm mt-2">{((highIntensityDistance / totalDistance) * 100).toFixed(1)}% of total</p>
        </div>
        
        <div className="bg-gray-900 bg-opacity-70 backdrop-blur-sm p-6 rounded-lg border border-gray-800">
          <div className="flex items-center">
            <h3 className="text-lg font-medium text-white mb-2">Accelerations</h3>
            <InfoTooltip text="Total count of accelerations/decelerations above 2.5 m/s²" />
          </div>
          <p className="text-3xl font-bold text-[#1E54B7]">{totalAccelerations.toLocaleString()}</p>
          <p className="text-gray-400 text-sm mt-2">Across all intensities</p>
        </div>
        
        <div className="bg-gray-900 bg-opacity-70 backdrop-blur-sm p-6 rounded-lg border border-gray-800">
          <div className="flex items-center">
            <h3 className="text-lg font-medium text-white mb-2">Max Speed</h3>
            <InfoTooltip text="Highest recorded speed during the selected time period" />
          </div>
          <p className="text-3xl font-bold text-[#1E54B7]">{maxPeakSpeed.toFixed(1)} km/h</p>
          <p className="text-gray-400 text-sm mt-2">Peak recorded value</p>
        </div>
      </div>
      
      {/* Distance Trend Over Time */}
      <div className="bg-gray-900 bg-opacity-70 backdrop-blur-sm p-6 rounded-lg border border-gray-800">
        <h3 className="text-xl font-medium text-white mb-4">Distance & High-Intensity Trend</h3>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart
            data={dailyDistanceData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis 
              dataKey="date" 
              tick={{ fill: '#ccc' }} 
              axisLine={{ stroke: '#666' }}
            />
            <YAxis 
              tick={{ fill: '#ccc' }} 
              axisLine={{ stroke: '#666' }}
              tickFormatter={(value) => `${value.toLocaleString()}`} 
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ color: '#ccc' }} />
            <Area 
              type="monotone" 
              dataKey="distance" 
              name="Total Distance (m)" 
              stroke="#1E54B7" 
              fill="#1E54B780" 
            />
            <Area 
              type="monotone" 
              dataKey="highIntensity" 
              name="High Intensity Distance (m)" 
              stroke="#0CAFFF" 
              fill="#0CAFFF80" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      {/* Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* High Intensity Distribution */}
        <div className="bg-gray-900 bg-opacity-70 backdrop-blur-sm p-6 rounded-lg border border-gray-800">
          <h3 className="text-xl font-medium text-white mb-4">High Intensity Distance Distribution</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={highIntensityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {highIntensityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value.toLocaleString()} m`, 'Distance']} />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="flex flex-col justify-center">
              {highIntensityData.map((entry, index) => (
                <div key={index} className="flex items-center mb-3">
                  <div 
                    className="w-4 h-4 rounded-sm mr-3" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <div>
                    <p className="text-white text-sm">{entry.name}</p>
                    <p className="text-gray-400 text-xs">{entry.value.toLocaleString()} m</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Acceleration Distribution */}
        <div className="bg-gray-900 bg-opacity-70 backdrop-blur-sm p-6 rounded-lg border border-gray-800">
          <h3 className="text-xl font-medium text-white mb-4">Acceleration/Deceleration Intensity</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={accelerationData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis 
                dataKey="name" 
                tick={{ fill: '#ccc' }} 
                axisLine={{ stroke: '#666' }}
              />
              <YAxis 
                tick={{ fill: '#ccc' }} 
                axisLine={{ stroke: '#666' }}
                tickFormatter={(value) => `${value.toLocaleString()}`} 
              />
              <Tooltip formatter={(value) => [`${value.toLocaleString()}`, 'Count']} />
              <Bar 
                dataKey="value" 
                name="Count" 
                fill="#1E54B7" 
              >
                {accelerationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Session Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Session Types */}
        <div className="bg-gray-900 bg-opacity-70 backdrop-blur-sm p-6 rounded-lg border border-gray-800">
          <h3 className="text-xl font-medium text-white mb-4">Session Types</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={sessionTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {sessionTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="flex flex-col justify-center">
              {sessionTypeData.map((entry, index) => (
                <div key={index} className="flex items-center mb-3">
                  <div 
                    className="w-4 h-4 rounded-sm mr-3" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <div>
                    <p className="text-white text-sm">{entry.name}</p>
                    <p className="text-gray-400 text-xs">{entry.value} sessions</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Performance Radar */}
        <div className="bg-gray-900 bg-opacity-70 backdrop-blur-sm p-6 rounded-lg border border-gray-800">
          <h3 className="text-xl font-medium text-white mb-4">Performance Metrics</h3>
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={performanceRadarData}>
              <PolarGrid stroke="#444" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#ccc' }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#ccc' }} />
              <Radar
                name="Performance"
                dataKey="A"
                stroke="#1E54B7"
                fill="#1E54B7"
                fillOpacity={0.6}
              />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// Filter data based on selected timeframe
function filterDataByTimeframe(data: GPSData[], timeFrame: string): GPSData[] {
  if (timeFrame === 'all' || !data.length) return data;
  
  const now = new Date();
  let startDate: Date;
  
  switch (timeFrame) {
    case '7days':
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 7);
      break;
    case '30days':
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 30);
      break;
    case '90days':
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 90);
      break;
    default:
      return data;
  }
  
  return data.filter(item => {
    const itemDate = new Date(item.date);
    return itemDate >= startDate && itemDate <= now;
  });
}

// Determine session type based on data attributes
function determineSessionType(data: GPSData): string {
  if (!data.md_minus_code && !data.md_plus_code) {
    return "Other";
  }
  
  if (data.md_minus_code) {
    return `MD${data.md_minus_code}`;
  }
  
  if (data.md_plus_code) {
    return `MD+${data.md_plus_code}`;
  }
  
  return "Match Day";
}

// Calculate performance percentile for radar chart
function calculatePerformancePercentile(data: GPSData[], metric: string): number {
  if (!data.length) return 0;
  
  let values: number[] = [];
  
  switch (metric) {
    case 'distance':
      values = data.map(item => item.distance);
      break;
    case 'peak_speed':
      values = data.map(item => item.peak_speed);
      break;
    case 'high_intensity':
      values = data.map(item => item.distance_over_21 + item.distance_over_24 + item.distance_over_27);
      break;
    case 'accelerations':
      values = data.map(item => item.accel_decel_over_2_5 + item.accel_decel_over_3_5 + item.accel_decel_over_4_5);
      break;
    case 'day_duration':
      values = data.map(item => item.day_duration);
      break;
    default:
      return 0;
  }
  
  // Sort values
  values.sort((a, b) => a - b);
  
  // Get the max value
  const maxValue = values[values.length - 1];
  
  // Get the average of the top 25%
  const topQuartileStart = Math.floor(values.length * 0.75);
  const topQuartileValues = values.slice(topQuartileStart);
  const topQuartileAvg = topQuartileValues.reduce((sum, val) => sum + val, 0) / topQuartileValues.length;
  
  // Get the average
  const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
  
  // Calculate percentile (current avg / top quartile avg) * 100, capped at 100
  return Math.min(Math.round((avg / topQuartileAvg) * 100), 100);
}