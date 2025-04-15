"use client"

import { useState, useEffect } from "react";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer, AreaChart, Area, 
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  BarChart, Bar, Cell, PieChart, Pie, Sector, ScatterChart, Scatter,
  ComposedChart, ReferenceLine
} from 'recharts';
import { fetchRecoveryData, calculateAverageRecoveryScores } from "../utils/recovery-data";

interface RecoveryMetricsDisplayProps {
  recoveryData: any[];
  initialTimeFrame: '7days' | '30days' | '90days';
  onTimeFrameChange: (timeFrame: '7days' | '30days' | '90days') => void;
}

// Custom tooltip that shows more detailed information
const CustomTooltip = ({ active, payload, label, unit = "%" }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 p-3 border border-gray-700 rounded shadow-lg">
        <p className="text-gray-300 text-sm font-medium mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center mb-1 last:mb-0">
            <div 
              className="w-3 h-3 rounded-full mr-2" 
              style={{ backgroundColor: entry.color }}
            />
            <p className="text-sm">
              <span className="text-gray-400">{entry.name}: </span>
              <span className="text-white font-medium">{entry.value}{unit}</span>
            </p>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// Custom active shape for pie chart
const renderActiveShape = (props: any) => {
  const { 
    cx, cy, innerRadius, outerRadius, startAngle, endAngle,
    fill, payload, percent, value 
  } = props;

  return (
    <g>
      <text x={cx} y={cy - 15} dy={8} textAnchor="middle" fill="#fff" fontSize={14}>
        {payload.name}
      </text>
      <text x={cx} y={cy + 15} dy={8} textAnchor="middle" fill="#fff" fontSize={18} fontWeight="bold">
        {`${value}g`}
      </text>
      <text x={cx} y={cy + 35} dy={8} textAnchor="middle" fill="#ccc" fontSize={12}>
        {`(${(percent * 100).toFixed(0)}%)`}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 5}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    </g>
  );
};

// Generate daily sleep data for the past N days
const generateSleepData = (days: number) => {
  const data = [];
  const now = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Generate slightly random but realistic sleep patterns
    const baseHours = 7.5;
    const randomVariation = (Math.random() * 2 - 1); // -1 to +1
    const totalHours = Math.max(5, Math.min(9.5, baseHours + randomVariation));
    
    // Generate sleep phases in minutes
    const remSleep = Math.round((totalHours * 60) * (0.20 + Math.random() * 0.05)); // ~20-25% REM
    const deepSleep = Math.round((totalHours * 60) * (0.15 + Math.random() * 0.1)); // ~15-25% deep
    const lightSleep = Math.round((totalHours * 60) - remSleep - deepSleep); // remainder is light sleep
    
    // Calculate a sleep score (0-100)
    // Good sleep has adequate duration and sufficient deep & REM sleep
    const idealDeepMinutes = 120; // 2 hours is ideal
    const idealRemMinutes = 90; // 1.5 hours is ideal
    const idealTotalMinutes = 480; // 8 hours is ideal
    
    const deepScore = Math.min(100, (deepSleep / idealDeepMinutes) * 100);
    const remScore = Math.min(100, (remSleep / idealRemMinutes) * 100);
    const durationScore = Math.min(100, (totalHours * 60 / idealTotalMinutes) * 100);
    
    // Combined score with weights
    const sleepScore = Math.round(deepScore * 0.4 + remScore * 0.3 + durationScore * 0.3);
    
    data.push({
      date: date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      timestamp: date.getTime(),
      totalSleep: totalHours,
      deepSleep,
      remSleep,
      lightSleep,
      sleepScore
    });
  }
  return data;
};

// Generate hydration data for time chart
const generateHydrationData = (days: number) => {
  const data = [];
  const now = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Generate realistic hydration values (in liters)
    const baseIntake = 2.8; // base target is 2.8L
    const weekendDip = (date.getDay() === 0 || date.getDay() === 6) ? -0.5 : 0; // lower on weekends
    const randomVariation = (Math.random() * 1.4) - 0.7; // -0.7 to +0.7
    const intake = Math.max(1.5, Math.min(4.0, baseIntake + weekendDip + randomVariation));
    
    // Calculate percentage of daily target (3.5L)
    const target = 3.5;
    const percentage = Math.round((intake / target) * 100);
    
    data.push({
      date: date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      intake: parseFloat(intake.toFixed(1)),
      percentage
    });
  }
  return data;
};

// Generate HRV and heart rate data
const generateHrvData = (days: number) => {
  const data = [];
  const now = new Date();
  
  // Start with baseline values
  let baseHrv = 75; // milliseconds
  let baseRhr = 52; // beats per minute
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Simulate a mild training effect over time (improving HRV, decreasing RHR)
    const trendFactor = i / (days * 2); // subtle upward trend for HRV
    
    // Add random daily variation
    const hrvVariation = Math.random() * 20 - 10; // +/- 10ms
    const rhrVariation = Math.random() * 6 - 3; // +/- 3bpm
    
    // Simulate occasional hard training days or poor recovery (lower HRV, higher RHR)
    const stressFactor = Math.random() > 0.8 ? -15 : 0; // occasionally apply stress
    
    const hrv = Math.round(baseHrv + trendFactor + hrvVariation + stressFactor);
    const rhr = Math.round(baseRhr - trendFactor + rhrVariation - (stressFactor / 3));
    
    // Calculate recovery score based on HRV and RHR
    // Higher HRV and lower RHR is better
    const hrvScore = Math.min(100, Math.max(0, (hrv / 90) * 100));
    const rhrScore = Math.min(100, Math.max(0, (1 - (rhr - 40) / 40) * 100));
    const recoveryScore = Math.round(hrvScore * 0.7 + rhrScore * 0.3);
    
    data.push({
      date: date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      timestamp: date.getTime(),
      hrv,
      rhr,
      hrvScore,
      rhrScore,
      recoveryScore
    });
  }
  return data;
};

// Generate detailed training and recovery data
const generateTrainingLoadData = (days: number) => {
  const data = [];
  const now = new Date();
  
  // Define a training pattern with hard and easy days
  const trainingPattern = [
    { type: 'Hard', load: 8, recovery: 5 },
    { type: 'Medium', load: 6, recovery: 7 },
    { type: 'Easy', load: 4, recovery: 8 },
    { type: 'Rest', load: 1, recovery: 9 },
    { type: 'Hard', load: 9, recovery: 4 },
    { type: 'Medium', load: 5, recovery: 6 },
    { type: 'Easy', load: 3, recovery: 8 }
  ];
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Get the training day type based on the pattern
    const dayIndex = i % trainingPattern.length;
    const { type, load: baseLoad, recovery: baseRecovery } = trainingPattern[dayIndex];
    
    // Add some random variation
    const loadVariation = (Math.random() * 2) - 1; // -1 to +1
    const recoveryVariation = (Math.random() * 2) - 1; // -1 to +1
    
    // Scale to 0-100
    const trainingLoad = Math.min(100, Math.max(0, baseLoad * 10 + loadVariation * 10));
    const recoveryStatus = Math.min(100, Math.max(0, baseRecovery * 10 + recoveryVariation * 10));
    
    // Calculate readiness (inverse relationship with training load, positive with recovery)
    const readiness = Math.min(100, Math.max(0, 
      recoveryStatus - (trainingLoad * 0.3) + (Math.random() * 10)
    ));
    
    data.push({
      date: date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      timestamp: date.getTime(),
      type,
      trainingLoad: Math.round(trainingLoad),
      recoveryStatus: Math.round(recoveryStatus),
      readiness: Math.round(readiness)
    });
  }
  return data;
};

// Main component
export function RecoveryMetricsDisplay({ 
  recoveryData = [], 
  initialTimeFrame = '7days', 
  onTimeFrameChange 
}: RecoveryMetricsDisplayProps) {
  const [timeRange, setTimeRange] = useState(initialTimeFrame);
  const [averageMetrics, setAverageMetrics] = useState({
    overall: 0,
    sleep: 0,
    soreness: 0,
    subjective: 0,
    bio: 0
  });
  const [sleepData, setSleepData] = useState<any[]>([]);
  const [hydrationData, setHydrationData] = useState<any[]>([]);
  const [hrvData, setHrvData] = useState<any[]>([]);
  const [trainingLoadData, setTrainingLoadData] = useState<any[]>([]);
  const [activeNutrientIndex, setActiveNutrientIndex] = useState(0);
  
  // Define the days to show based on timeRange
  const daysToShow = timeRange === '7days' ? 7 : timeRange === '30days' ? 30 : 90;
  
  // Handle time range changes
  const handleTimeRangeChange = (newRange: '7days' | '30days' | '90days') => {
    setTimeRange(newRange);
    if (onTimeFrameChange) {
      onTimeFrameChange(newRange);
    }
  };
  
  // Generate all the example data when time range changes
  useEffect(() => {
    // Generate sample data for charts
    setSleepData(generateSleepData(daysToShow));
    setHydrationData(generateHydrationData(daysToShow));
    setHrvData(generateHrvData(daysToShow));
    setTrainingLoadData(generateTrainingLoadData(daysToShow));
    
    // If we had real data, we'd process it here
    if (recoveryData.length > 0) {
      updateMetrics(recoveryData, timeRange);
    } else {
      // Set sample values if no real data
      setAverageMetrics({
        overall: 76,
        sleep: 82,
        soreness: 68,
        subjective: 74,
        bio: 78
      });
    }
  }, [timeRange, recoveryData, daysToShow]);
  
  // Process real data when available
  const updateMetrics = (data: any[], range: string) => {
    const now = new Date();
    let startDate = new Date(now);
    
    // Calculate start date based on range
    switch (range) {
      case '7days':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30days':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90days':
        startDate.setDate(now.getDate() - 90);
        break;
      default:
        startDate.setDate(now.getDate() - 7);
    }
    
    // Filter data within range
    const filteredData = data.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= startDate && itemDate <= now;
    });
    
    // Calculate average metrics
    if (filteredData.length > 0) {
      const calculateAverage = (items: any[], property: string, normalizeFrom = [-1, 1], normalizeTo = [0, 100]) => {
        const values = items
          .filter(item => item[property] !== undefined && item[property] !== null)
          .map(item => {
            // Normalize from source range to target range
            const sourceRange = normalizeFrom[1] - normalizeFrom[0];
            const targetRange = normalizeTo[1] - normalizeTo[0];
            const normalizedValue = ((item[property] - normalizeFrom[0]) / sourceRange) * targetRange + normalizeTo[0];
            return normalizedValue;
          });
        
        return values.length ? 
          values.reduce((sum: number, val: number) => sum + val, 0) / values.length : 
          0;
      };
      
      setAverageMetrics({
        overall: Math.round(calculateAverage(filteredData, 'emboss_baseline_score')),
        sleep: Math.round(calculateAverage(filteredData, 'sleep_composite')),
        soreness: Math.round(calculateAverage(filteredData, 'soreness_composite')),
        subjective: Math.round(calculateAverage(filteredData, 'subjective_composite')),
        bio: Math.round(calculateAverage(filteredData, 'stress_load_composite'))
      });
    }
  };
  
  // Sample nutrition data
  const nutritionData = [
    { name: 'Protein', value: 120, color: '#1E54B7' },
    { name: 'Carbs', value: 180, color: '#0CAFFF' },
    { name: 'Fats', value: 53, color: '#365EFF' }
  ];
  
  // Daily training readiness data
  const readinessGauge = {
    score: trainingLoadData.length > 0 ? trainingLoadData[trainingLoadData.length - 1].readiness : 78,
    color: '#1E54B7'
  };
  
  return (
    <div className="space-y-8 mb-8">
      {/* Time Range Selector */}
      <div className="flex justify-center space-x-2">
        <button 
          className={`px-4 py-2 rounded-md text-sm ${timeRange === '7days' ? 'bg-[#1E54B7] text-white' : 'bg-gray-800 text-white'}`}
          onClick={() => handleTimeRangeChange('7days')}
        >
          Last 7 Days
        </button>
        <button 
          className={`px-4 py-2 rounded-md text-sm ${timeRange === '30days' ? 'bg-[#1E54B7] text-white' : 'bg-gray-800 text-white'}`}
          onClick={() => handleTimeRangeChange('30days')}
        >
          Last 30 Days
        </button>
        <button 
          className={`px-4 py-2 rounded-md text-sm ${timeRange === '90days' ? 'bg-[#1E54B7] text-white' : 'bg-gray-800 text-white'}`}
          onClick={() => handleTimeRangeChange('90days')}
        >
          Last 90 Days
        </button>
      </div>
      
      {/* Recovery Score Overview */}
      <div className="bg-gray-900 bg-opacity-70 backdrop-blur-sm p-6 rounded-lg border border-gray-800">
        <h3 className="text-xl font-medium text-white mb-4">Recovery Status</h3>
        <div className="flex flex-col md:flex-row items-center justify-between mb-6">
          {/* Recovery Score Circle */}
          <div className="flex flex-col items-center mb-4 md:mb-0">
            <div className="relative w-40 h-40">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {/* Background circle */}
                <circle 
                  cx="50" cy="50" r="45" 
                  fill="transparent" 
                  stroke="#1f2937" 
                  strokeWidth="10"
                />
                {/* Progress circle */}
                <circle 
                  cx="50" cy="50" r="45" 
                  fill="transparent" 
                  stroke="#1E54B7" 
                  strokeWidth="10"
                  strokeDasharray={`${readinessGauge.score * 2.83} 283`} 
                  strokeDashoffset="0" 
                  transform="rotate(-90 50 50)"
                  strokeLinecap="round"
                />
                <text x="50" y="45" textAnchor="middle" fill="white" fontSize="22" fontWeight="bold">
                  {readinessGauge.score}%
                </text>
                <text x="50" y="65" textAnchor="middle" fill="#ccc" fontSize="10">
                  READINESS SCORE
                </text>
              </svg>
            </div>
            <div className="mt-2 text-center">
              <p className="text-gray-300 text-sm">Today's Status</p>
              <p className={`text-lg font-medium ${
                readinessGauge.score >= 80 ? 'text-green-400' : 
                readinessGauge.score >= 60 ? 'text-yellow-400' : 
                'text-red-400'
              }`}>
                {readinessGauge.score >= 80 ? 'Excellent' : 
                 readinessGauge.score >= 60 ? 'Good' :
                 'Needs Recovery'}
              </p>
            </div>
          </div>
          
          {/* Recovery Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full md:w-3/4">
            <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg">
              <h4 className="text-sm text-gray-400 mb-1">Overall</h4>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full flex items-center justify-center border-3 border-[#1E54B7] mr-2">
                  <span className="text-xl font-bold text-white">{Math.round(averageMetrics.overall)}</span>
                </div>
                <div className="w-full">
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-[#1E54B7] h-2 rounded-full" 
                      style={{ width: `${Math.round(averageMetrics.overall)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg">
              <h4 className="text-sm text-gray-400 mb-1">Sleep</h4>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full flex items-center justify-center border-3 border-[#0CAFFF] mr-2">
                  <span className="text-xl font-bold text-white">{Math.round(averageMetrics.sleep)}</span>
                </div>
                <div className="w-full">
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-[#0CAFFF] h-2 rounded-full" 
                      style={{ width: `${Math.round(averageMetrics.sleep)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg">
              <h4 className="text-sm text-gray-400 mb-1">Soreness</h4>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full flex items-center justify-center border-3 border-[#4CAF50] mr-2">
                  <span className="text-xl font-bold text-white">{Math.round(averageMetrics.soreness)}</span>
                </div>
                <div className="w-full">
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-[#4CAF50] h-2 rounded-full" 
                      style={{ width: `${Math.round(averageMetrics.soreness)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg">
              <h4 className="text-sm text-gray-400 mb-1">Mental</h4>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full flex items-center justify-center border-3 border-[#FF6B6B] mr-2">
                  <span className="text-xl font-bold text-white">{Math.round(averageMetrics.subjective)}</span>
                </div>
                <div className="w-full">
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-[#FF6B6B] h-2 rounded-full" 
                      style={{ width: `${Math.round(averageMetrics.subjective)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Training Load & Recovery Balance */}
        {trainingLoadData.length > 0 && (
          <div className="mt-6">
            <h4 className="text-lg font-medium text-white mb-3">Training Load & Recovery Balance</h4>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={trainingLoadData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fill: '#ccc' }} 
                  axisLine={{ stroke: '#666' }}
                />
                <YAxis 
                  yAxisId="left"
                  domain={[0, 100]} 
                  tick={{ fill: '#ccc' }} 
                  axisLine={{ stroke: '#666' }}
                  label={{ value: 'Score', angle: -90, position: 'insideLeft', fill: '#ccc' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ color: '#ccc' }} />
                <Bar 
                  yAxisId="left"
                  dataKey="trainingLoad" 
                  name="Training Load" 
                  fill="#FF6B6B" 
                  radius={[4, 4, 0, 0]}
                />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="recoveryStatus" 
                  name="Recovery Status" 
                  stroke="#4CAF50" 
                  strokeWidth={2}
                  dot={{ r: 4, fill: '#4CAF50' }}
                />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="readiness" 
                  name="Readiness" 
                  stroke="#1E54B7" 
                  strokeWidth={2}
                  dot={{ r: 4, fill: '#1E54B7' }}
                />
                <ReferenceLine y={70} stroke="#FFD700" strokeDasharray="3 3" />
              </ComposedChart>
            </ResponsiveContainer>
            <div className="flex justify-center mt-2">
              <div className="flex items-center mx-2">
                <div className="w-3 h-3 bg-[#FF6B6B] rounded-sm mr-1"></div>
                <span className="text-xs text-gray-300">Training Load</span>
              </div>
              <div className="flex items-center mx-2">
                <div className="w-3 h-3 bg-[#4CAF50] rounded-full mr-1"></div>
                <span className="text-xs text-gray-300">Recovery Status</span>
              </div>
              <div className="flex items-center mx-2">
                <div className="w-3 h-3 bg-[#1E54B7] rounded-full mr-1"></div>
                <span className="text-xs text-gray-300">Readiness</span>
              </div>
              <div className="flex items-center mx-2">
                <div className="w-6 h-0.5 bg-[#FFD700] mr-1 dashed"></div>
                <span className="text-xs text-gray-300">Optimal Zone</span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Sleep Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gray-900 bg-opacity-70 backdrop-blur-sm p-6 rounded-lg border border-gray-800">
          <h3 className="text-xl font-medium text-white mb-4">Sleep Analysis</h3>
          {sleepData.length > 0 && (
            <>
              <ResponsiveContainer width="100%" height={200} className="mb-4">
                <ComposedChart data={sleepData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fill: '#ccc' }} 
                    axisLine={{ stroke: '#666' }}
                  />
                  <YAxis 
                    yAxisId="left"
                    domain={[0, 10]} 
                    tick={{ fill: '#ccc' }} 
                    axisLine={{ stroke: '#666' }}
                    label={{ value: 'Hours', angle: -90, position: 'insideLeft', fill: '#ccc' }}
                  />
                  <YAxis 
                    yAxisId="right"
                    orientation="right"
                    domain={[0, 100]} 
                    tick={{ fill: '#ccc' }} 
                    axisLine={{ stroke: '#666' }}
                    label={{ value: 'Score', angle: 90, position: 'insideRight', fill: '#ccc' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ color: '#ccc' }} />
                  <Bar 
                    yAxisId="left"
                    dataKey="totalSleep" 
                    name="Total Sleep" 
                    fill="#1E54B7" 
                    radius={[4, 4, 0, 0]}
                    unit="h"
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="sleepScore" 
                    name="Sleep Score" 
                    stroke="#0CAFFF" 
                    strokeWidth={2}
                    dot={{ r: 4, fill: '#0CAFFF' }}
                  />
                  <ReferenceLine yAxisId="left" y={8} stroke="#4CAF50" strokeDasharray="3 3" />
                </ComposedChart>
              </ResponsiveContainer>
              
              {/* Last Night's Sleep */}
              <div className="mb-4">
                <h4 className="text-white font-medium mb-2">Last Night's Sleep Stages</h4>
                <div className="flex h-20 w-full bg-gray-800 rounded-lg overflow-hidden">
                  {/* REM sleep */}
                  <div 
                    className="bg-[#0CAFFF] h-full flex items-center justify-center"
                    style={{ width: `${sleepData[sleepData.length-1].remSleep / (sleepData[sleepData.length-1].totalSleep * 60) * 100}%` }}
                  >
                    <span className="text-xs text-white font-medium">{Math.round(sleepData[sleepData.length-1].remSleep / 60 * 10) / 10}h</span>
                  </div>
                  {/* Deep sleep */}
                  <div 
                    className="bg-[#1E54B7] h-full flex items-center justify-center"
                    style={{ width: `${sleepData[sleepData.length-1].deepSleep / (sleepData[sleepData.length-1].totalSleep * 60) * 100}%` }}
                  >
                    <span className="text-xs text-white font-medium">{Math.round(sleepData[sleepData.length-1].deepSleep / 60 * 10) / 10}h</span>
                  </div>
                  {/* Light sleep */}
                  <div 
                    className="bg-[#365EFF] h-full flex items-center justify-center"
                    style={{ width: `${sleepData[sleepData.length-1].lightSleep / (sleepData[sleepData.length-1].totalSleep * 60) * 100}%` }}
                  >
                    <span className="text-xs text-white font-medium">{Math.round(sleepData[sleepData.length-1].lightSleep / 60 * 10) / 10}h</span>
                  </div>
                </div>
                <div className="flex justify-center mt-2 text-xs text-gray-400">
                  <div className="flex items-center mx-2">
                    <div className="w-3 h-3 bg-[#0CAFFF] mr-1"></div>
                    <span>REM</span>
                  </div>
                  <div className="flex items-center mx-2">
                    <div className="w-3 h-3 bg-[#1E54B7] mr-1"></div>
                    <span>Deep</span>
                  </div>
                  <div className="flex items-center mx-2">
                    <div className="w-3 h-3 bg-[#365EFF] mr-1"></div>
                    <span>Light</span>
                  </div>
                </div>
              </div>
              
              {/* Sleep metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-gray-800 bg-opacity-50 p-3 rounded">
                  <p className="text-gray-400 text-xs">Total Sleep</p>
                  <p className="text-white font-medium">{sleepData[sleepData.length-1].totalSleep.toFixed(1)}h</p>
                </div>
                <div className="bg-gray-800 bg-opacity-50 p-3 rounded">
                  <p className="text-gray-400 text-xs">Sleep Score</p>
                  <p className="text-white font-medium">{sleepData[sleepData.length-1].sleepScore}/100</p>
                </div>
                <div className="bg-gray-800 bg-opacity-50 p-3 rounded">
                  <p className="text-gray-400 text-xs">Deep Sleep</p>
                  <p className="text-white font-medium">{Math.round(sleepData[sleepData.length-1].deepSleep / 60 * 10) / 10}h</p>
                </div>
                <div className="bg-gray-800 bg-opacity-50 p-3 rounded">
                  <p className="text-gray-400 text-xs">REM Sleep</p>
                  <p className="text-white font-medium">{Math.round(sleepData[sleepData.length-1].remSleep / 60 * 10) / 10}h</p>
                </div>
              </div>
            </>
          )}
        </div>
        
        {/* HRV & Recovery Indicators */}
        <div className="bg-gray-900 bg-opacity-70 backdrop-blur-sm p-6 rounded-lg border border-gray-800">
          <h3 className="text-xl font-medium text-white mb-4">Recovery Biomarkers</h3>
          {hrvData.length > 0 && (
            <>
              <ResponsiveContainer width="100%" height={200} className="mb-4">
                <LineChart data={hrvData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fill: '#ccc' }} 
                    axisLine={{ stroke: '#666' }}
                  />
                  <YAxis 
                    yAxisId="left"
                    domain={[30, 120]} 
                    tick={{ fill: '#ccc' }} 
                    axisLine={{ stroke: '#666' }}
                    label={{ value: 'HRV (ms)', angle: -90, position: 'insideLeft', fill: '#ccc' }}
                  />
                  <YAxis 
                    yAxisId="right"
                    orientation="right"
                    domain={[30, 70]} 
                    tick={{ fill: '#ccc' }} 
                    axisLine={{ stroke: '#666' }}
                    label={{ value: 'RHR (bpm)', angle: 90, position: 'insideRight', fill: '#ccc' }}
                  />
                  <Tooltip 
                    content={<CustomTooltip />}
                  />
                  <Legend wrapperStyle={{ color: '#ccc' }} />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="hrv" 
                    name="HRV" 
                    stroke="#1E54B7" 
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    unit=" ms"
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="rhr" 
                    name="Resting HR" 
                    stroke="#FF6B6B" 
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    unit=" bpm"
                  />
                </LineChart>
              </ResponsiveContainer>
              
              {/* Current biomarkers */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-800 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-300">Heart Rate Variability</span>
                    <span className={`text-sm font-medium ${
                      hrvData[hrvData.length-1].hrv >= 70 ? 'text-green-400' : 
                      hrvData[hrvData.length-1].hrv >= 50 ? 'text-yellow-400' : 
                      'text-red-400'
                    }`}>
                      {hrvData[hrvData.length-1].hrv} ms
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2 mb-3">
                    <div 
                      className={`h-2 rounded-full ${
                        hrvData[hrvData.length-1].hrv >= 70 ? 'bg-green-400' : 
                        hrvData[hrvData.length-1].hrv >= 50 ? 'bg-yellow-400' : 
                        'bg-red-400'
                      }`}
                      style={{ width: `${Math.min(100, (hrvData[hrvData.length-1].hrv / 120) * 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Poor</span>
                    <span>Average</span>
                    <span>Excellent</span>
                  </div>
                </div>
                
                <div className="bg-gray-800 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-300">Resting Heart Rate</span>
                    <span className={`text-sm font-medium ${
                      hrvData[hrvData.length-1].rhr <= 50 ? 'text-green-400' : 
                      hrvData[hrvData.length-1].rhr <= 60 ? 'text-yellow-400' : 
                      'text-red-400'
                    }`}>
                      {hrvData[hrvData.length-1].rhr} bpm
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2 mb-3">
                    <div 
                      className={`h-2 rounded-full ${
                        hrvData[hrvData.length-1].rhr <= 50 ? 'bg-green-400' : 
                        hrvData[hrvData.length-1].rhr <= 60 ? 'bg-yellow-400' : 
                        'bg-red-400'
                      }`}
                      style={{ width: `${Math.min(100, 100 - ((hrvData[hrvData.length-1].rhr - 40) / 50) * 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Elevated</span>
                    <span>Normal</span>
                    <span>Athletic</span>
                  </div>
                </div>
              </div>
              
              {/* Recovery score trend */}
              <ResponsiveContainer width="100%" height={100}>
                <AreaChart data={hrvData}>
                  <defs>
                    <linearGradient id="recoveryGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1E54B7" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#1E54B7" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="date" 
                    tick={{ fill: '#ccc', fontSize: 10 }} 
                    axisLine={{ stroke: '#666' }}
                    height={20}
                  />
                  <YAxis 
                    domain={[0, 100]} 
                    hide={true}
                  />
                  <Tooltip
                    content={<CustomTooltip />}
                  />
                  <Area
                    type="monotone"
                    dataKey="recoveryScore"
                    name="Recovery Score"
                    stroke="#1E54B7"
                    fillOpacity={1}
                    fill="url(#recoveryGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </>
          )}
        </div>
      </div>
      
      {/* Nutrition & Hydration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Hydration Chart */}
        <div className="bg-gray-900 bg-opacity-70 backdrop-blur-sm p-6 rounded-lg border border-gray-800">
          <h3 className="text-xl font-medium text-white mb-4">Hydration Tracking</h3>
          {hydrationData.length > 0 && (
            <>
              <ResponsiveContainer width="100%" height={200} className="mb-4">
                <ComposedChart data={hydrationData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fill: '#ccc' }} 
                    axisLine={{ stroke: '#666' }}
                  />
                  <YAxis 
                    yAxisId="left"
                    domain={[0, 5]} 
                    tick={{ fill: '#ccc' }} 
                    axisLine={{ stroke: '#666' }}
                    label={{ value: 'Intake (L)', angle: -90, position: 'insideLeft', fill: '#ccc' }}
                  />
                  <YAxis 
                    yAxisId="right"
                    orientation="right"
                    domain={[0, 120]} 
                    tick={{ fill: '#ccc' }} 
                    axisLine={{ stroke: '#666' }}
                    label={{ value: 'Target %', angle: 90, position: 'insideRight', fill: '#ccc' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ color: '#ccc' }} />
                  <Bar 
                    yAxisId="left"
                    dataKey="intake" 
                    name="Intake" 
                    fill="#0CAFFF" 
                    radius={[3, 3, 0, 0]}
                    unit="L"
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="percentage" 
                    name="% of Target" 
                    stroke="#1E54B7" 
                    strokeWidth={2}
                    dot={{ r: 3, fill: '#1E54B7' }}
                    unit="%"
                  />
                  <ReferenceLine yAxisId="left" y={3.5} stroke="#4CAF50" strokeDasharray="3 3" label={{ 
                    value: 'Target', 
                    position: 'insideBottomRight',
                    fill: '#4CAF50'
                  }} />
                </ComposedChart>
              </ResponsiveContainer>
              
              {/* Today's hydration status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="relative w-20 h-32 mr-4">
                    <div
                      className="absolute inset-x-0 bottom-0 w-full bg-[#1E54B7]/20 rounded-b-lg"
                      style={{ height: "90%" }}
                    ></div>
                    <div
                      className="absolute inset-x-0 bottom-0 w-full bg-[#1E54B7]/40 rounded-b-lg"
                      style={{ height: "75%" }}
                    ></div>
                    <div
                      className="absolute inset-x-0 bottom-0 w-full bg-[#1E54B7]/60 rounded-b-lg"
                      style={{ height: "60%" }}
                    ></div>
                    <div
                      className="absolute inset-x-0 bottom-0 w-full bg-[#1E54B7] rounded-b-lg"
                      style={{ height: `${hydrationData[hydrationData.length-1].percentage > 100 ? 100 : hydrationData[hydrationData.length-1].percentage}%` }}
                    ></div>
                    <div className="absolute inset-0 border-2 border-gray-600 rounded-lg"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-white text-lg font-bold">{hydrationData[hydrationData.length-1].percentage}%</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-white text-lg font-semibold mb-1">{hydrationData[hydrationData.length-1].intake}L</h4>
                    <p className="text-gray-400 text-sm mb-1">Today's intake</p>
                    <p className="text-gray-400 text-xs">Target: 3.5L</p>
                    
                    {hydrationData[hydrationData.length-1].intake < 3.5 && (
                      <p className="text-[#1E54B7] text-sm mt-1">
                        + {(3.5 - hydrationData[hydrationData.length-1].intake).toFixed(1)}L needed
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex flex-col items-end">
                    <div className="flex items-center mb-1">
                      <div className="w-2 h-2 rounded-full bg-green-400 mr-1"></div>
                      <span className="text-xs text-gray-300">Optimal: 3.5-4.0L</span>
                    </div>
                    <div className="flex items-center mb-1">
                      <div className="w-2 h-2 rounded-full bg-yellow-400 mr-1"></div>
                      <span className="text-xs text-gray-300">Adequate: 2.5-3.5L</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-red-400 mr-1"></div>
                      <span className="text-xs text-gray-300">Low: <2.5L</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
        
        {/* Nutrition Chart */}
        <div className="bg-gray-900 bg-opacity-70 backdrop-blur-sm p-6 rounded-lg border border-gray-800">
          <h3 className="text-xl font-medium text-white mb-4">Nutrition Breakdown</h3>
          <div className="flex flex-col md:flex-row items-center mb-4">
            <div className="w-48 h-48 relative mb-4 md:mb-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    activeIndex={activeNutrientIndex}
                    activeShape={renderActiveShape}
                    data={nutritionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    dataKey="value"
                    onMouseEnter={(_, index) => setActiveNutrientIndex(index)}
                  >
                    {nutritionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="ml-0 md:ml-6 w-full">
              <h4 className="text-white text-lg font-semibold mb-3">Macronutrient Goals</h4>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-300">Protein</span>
                    <span className="text-sm text-[#1E54B7]">120g / 140g</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-[#1E54B7] h-2 rounded-full" style={{ width: "86%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-300">Carbohydrates</span>
                    <span className="text-sm text-[#0CAFFF]">180g / 200g</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-[#0CAFFF] h-2 rounded-full" style={{ width: "90%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-300">Fats</span>
                    <span className="text-sm text-[#365EFF]">53g / 60g</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-[#365EFF] h-2 rounded-full" style={{ width: "88%" }}></div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between mt-4 text-center">
                <div>
                  <p className="text-white font-medium">2,400</p>
                  <p className="text-xs text-gray-400">Calories</p>
                </div>
                <div>
                  <p className="text-white font-medium">120g</p>
                  <p className="text-xs text-gray-400">Protein (25%)</p>
                </div>
                <div>
                  <p className="text-white font-medium">180g</p>
                  <p className="text-xs text-gray-400">Carbs (50%)</p>
                </div>
                <div>
                  <p className="text-white font-medium">53g</p>
                  <p className="text-xs text-gray-400">Fats (25%)</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Micronutrient highlights */}
          <div className="mt-4 pt-4 border-t border-gray-700">
            <h4 className="text-white text-base font-medium mb-3">Recovery Micronutrients</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="bg-gray-800 p-2 rounded text-center">
                <div className="text-lg font-semibold text-orange-400">85%</div>
                <div className="text-xs text-gray-300">Vitamin C</div>
              </div>
              <div className="bg-gray-800 p-2 rounded text-center">
                <div className="text-lg font-semibold text-blue-400">92%</div>
                <div className="text-xs text-gray-300">Magnesium</div>
              </div>
              <div className="bg-gray-800 p-2 rounded text-center">
                <div className="text-lg font-semibold text-green-400">78%</div>
                <div className="text-xs text-gray-300">Omega-3</div>
              </div>
              <div className="bg-gray-800 p-2 rounded text-center">
                <div className="text-lg font-semibold text-yellow-400">65%</div>
                <div className="text-xs text-gray-300">Zinc</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
