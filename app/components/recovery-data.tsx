"use client"

import { useState, useEffect } from "react"
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer, LineChart, Line,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Cell, PieChart, Pie
} from 'recharts'
import { fetchPriorityAreas, getPriorityAreasByCategory, calculatePriorityProgress } from "../utils/priority-areas"
import { fetchRecoveryData, calculateAverageRecoveryScores } from "../utils/recovery-data"

interface RecoveryDataProps {
  showCharts?: boolean
}

export function RecoveryData({ showCharts = true }: RecoveryDataProps) {
  const [recoveryPriorities, setRecoveryPriorities] = useState<any[]>([])
  const [recoveryMetrics, setRecoveryMetrics] = useState<any>({
    overall: 0,
    sleep: 0,
    soreness: 0,
    subjective: 0,
    bio: 0
  })
  const [progressMetrics, setProgressMetrics] = useState<any>({
    totalAreas: 0,
    achieved: 0,
    onTrack: 0,
    behind: 0,
    notStarted: 0,
    achievedPercent: 0,
    onTrackPercent: 0,
    behindPercent: 0,
    notStartedPercent: 0
  })
  const [areaGroups, setAreaGroups] = useState<Record<string, any[]>>({})
  const [loading, setLoading] = useState(true)
  
  const [timeRange, setTimeRange] = useState<'7days' | '30days' | '90days'>('30days');

  // Function to filter recovery data by time range
  const filterByTimeRange = (data: any[], range: '7days' | '30days' | '90days') => {
    const now = new Date();
    let startDate: Date;
    
    switch (range) {
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
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 30);
    }
    
    return data.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= startDate && itemDate <= now;
    });
  };

  // Effect to load and process data
  useEffect(() => {
    async function loadData() {
      try {
        // Fetch priority areas
        const priorityResponse = await fetch('/api/data/mock-priority');
        if (!priorityResponse.ok) {
          throw new Error(`Failed to fetch priority data: ${priorityResponse.status} ${priorityResponse.statusText}`);
        }
        const priorityData = await priorityResponse.json();
        const recoveryData = getPriorityAreasByCategory(priorityData, "Recovery");
        setRecoveryPriorities(recoveryData);
        
        // Group data by area for analysis
        const groups: Record<string, any[]> = {};
        recoveryData.forEach((item) => {
          if (!groups[item.Area]) {
            groups[item.Area] = [];
          }
          groups[item.Area].push(item);
        });
        setAreaGroups(groups);
        
        // Calculate progress metrics
        const progress = calculatePriorityProgress(recoveryData);
        setProgressMetrics(progress);
        
        // Fetch recovery metrics data
        const metricsResponse = await fetch('/api/data/mock-recovery');
        if (!metricsResponse.ok) {
          throw new Error(`Failed to fetch recovery data: ${metricsResponse.status} ${metricsResponse.statusText}`);
        }
        const metricsData = await metricsResponse.json();
        
        // Filter based on selected time range
        const filteredData = filterByTimeRange(metricsData, timeRange);
        
        // Calculate averages from the filtered data
        const averages = calculateAverageRecoveryScores(filteredData);
        setRecoveryMetrics(averages);
        
        setLoading(false);
      } catch (error) {
        console.error("Error loading recovery data:", error);
        setLoading(false);
      }
    }
    
    loadData();
  }, [timeRange]) // Re-run when time range changes
  
  // Status colors mapping
  const statusColors = {
    "Achieved": "bg-green-500/20 text-green-300",
    "On Track": "bg-blue-500/20 text-blue-300",
    "Behind": "bg-yellow-500/20 text-yellow-300",
    "Not Started": "bg-gray-500/20 text-gray-300"
  }
  
  // Color mapping for charts
  const colors = {
    "Achieved": "#4CAF50",
    "On Track": "#2196F3",
    "Behind": "#FFC107",
    "Not Started": "#9E9E9E"
  }
  
  // Prepare radar chart data
  const radarData = [
    { subject: 'Overall', A: recoveryMetrics.overall },
    { subject: 'Sleep', A: recoveryMetrics.sleep },
    { subject: 'Soreness', A: recoveryMetrics.soreness },
    { subject: 'Subjective', A: recoveryMetrics.subjective },
    { subject: 'Biomarkers', A: recoveryMetrics.bio }
  ]
  
  // Prepare progress bar data
  const progressData = [
    { name: 'Achieved', value: progressMetrics.achieved, percent: progressMetrics.achievedPercent, color: colors.Achieved },
    { name: 'On Track', value: progressMetrics.onTrack, percent: progressMetrics.onTrackPercent, color: colors["On Track"] },
    { name: 'Behind', value: progressMetrics.behind, percent: progressMetrics.behindPercent, color: colors.Behind },
    { name: 'Not Started', value: progressMetrics.notStarted, percent: progressMetrics.notStartedPercent, color: colors["Not Started"] }
  ]
  
  // Prepare area focus data
  const areaFocusData = Object.entries(areaGroups).map(([area, items]) => ({
    name: area,
    value: items.length,
    percent: (items.length / recoveryPriorities.length) * 100
  }))
  
  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#1E54B7]"></div>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      {showCharts && (
        <>
          {/* Time Range Selector */}
          <div className="flex justify-center space-x-2 mb-6">
            <button 
              className={`px-4 py-2 rounded-md text-sm ${timeRange === '7days' ? 'bg-[#1E54B7] text-white' : 'bg-gray-800 text-white'}`}
              onClick={() => setTimeRange('7days')}
            >
              Last 7 Days
            </button>
            <button 
              className={`px-4 py-2 rounded-md text-sm ${timeRange === '30days' ? 'bg-[#1E54B7] text-white' : 'bg-gray-800 text-white'}`}
              onClick={() => setTimeRange('30days')}
            >
              Last 30 Days
            </button>
            <button 
              className={`px-4 py-2 rounded-md text-sm ${timeRange === '90days' ? 'bg-[#1E54B7] text-white' : 'bg-gray-800 text-white'}`}
              onClick={() => setTimeRange('90days')}
            >
              Last 90 Days
            </button>
          </div>
        
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg">
              <h4 className="text-white font-medium mb-3">Recovery Focus Areas</h4>
              {areaFocusData.length > 0 ? (
                <div className="space-y-4">
                  {areaFocusData.map((item, index) => (
                    <div key={item.name}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-300">{item.name}</span>
                        <span className="text-sm text-[#1E54B7]">{item.value}</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-[#1E54B7] h-2 rounded-full"
                          style={{ width: `${item.percent}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-40 text-gray-400">
                  No focus areas found
                </div>
              )}
            </div>

            <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg">
              <h4 className="text-white font-medium mb-3">Recovery Progress</h4>
              {progressData.some(item => item.value > 0) ? (
                <>
                  <div className="flex items-center justify-center h-40">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={progressData}
                          cx="50%"
                          cy="50%"
                          innerRadius={30}
                          outerRadius={60}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {progressData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value, name, props) => [
                            `${value} priorities (${props.payload.percent.toFixed(0)}%)`,
                            props.payload.name
                          ]} 
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {progressData.filter(item => item.value > 0).map((item, index) => (
                      <div key={index} className="flex items-center">
                        <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                        <span className="text-sm text-gray-300">
                          {item.name} ({item.value})
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-40 text-gray-400">
                  No progress data available
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {showCharts && progressData.some(item => item.value > 0) && (
        <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg mb-6">
          <h4 className="text-white font-medium mb-3">Recovery Metrics ({timeRange === '7days' ? '7-Day' : timeRange === '30days' ? '30-Day' : '90-Day'} Average)</h4>
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
              <PolarGrid stroke="#444" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#ccc' }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#ccc' }} />
              <Radar
                name="Recovery Score"
                dataKey="A"
                stroke="#1E54B7"
                fill="#1E54B7"
                fillOpacity={0.6}
              />
              <Tooltip formatter={(value) => [`${parseInt(value.toString())}%`, 'Score']} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg">
        <h4 className="text-white font-medium mb-3">Recovery Priority Areas</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="py-2 px-3 text-xs font-medium text-gray-300">Priority</th>
                <th className="py-2 px-3 text-xs font-medium text-gray-300">Area</th>
                <th className="py-2 px-3 text-xs font-medium text-gray-300">Target</th>
                <th className="py-2 px-3 text-xs font-medium text-gray-300">Performance Type</th>
                <th className="py-2 px-3 text-xs font-medium text-gray-300">Review Date</th>
                <th className="py-2 px-3 text-xs font-medium text-gray-300">Status</th>
              </tr>
            </thead>
            <tbody>
              {recoveryPriorities.length > 0 ? (
                recoveryPriorities.map((item, index) => {
                  const colorKey = item.Tracking as keyof typeof statusColors
                  const statusColor = statusColors[colorKey] || "bg-gray-500/20 text-gray-300"

                  return (
                    <tr key={index} className="border-b border-gray-800">
                      <td className="py-2 px-3 text-sm text-white">{item.Priority}</td>
                      <td className="py-2 px-3 text-sm text-gray-300">{item.Area}</td>
                      <td className="py-2 px-3 text-sm text-gray-300">{item.Target}</td>
                      <td className="py-2 px-3 text-sm text-gray-300">{item["Performance Type"]}</td>
                      <td className="py-2 px-3 text-sm text-gray-300">{item["Review Date"]}</td>
                      <td className="py-2 px-3">
                        <span className={`px-2 py-1 text-xs rounded-full ${statusColor}`}>{item.Tracking}</span>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-gray-400">
                    No recovery priorities found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}