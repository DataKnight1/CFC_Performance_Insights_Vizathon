"use client"

import { useState, useEffect } from "react"
import { 
  PieChart, Pie, Cell, Tooltip, 
  ResponsiveContainer, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Legend,
  LineChart, Line
} from 'recharts'
import { PhysicalCapabilityData } from "../utils/excel-parser"
import { performInjuryAnalysis, InjuryAnalysisResults, InjuryRecord } from "../utils/injury-analysis"

interface InjuryHistoryDashboardProps {
  physicalData: PhysicalCapabilityData[]
}

export function InjuryHistoryDashboard({ physicalData }: InjuryHistoryDashboardProps) {
  const [analysisResults, setAnalysisResults] = useState<InjuryAnalysisResults | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedBodyPart, setSelectedBodyPart] = useState<string | null>(null)
  const [injuryTypeDistribution, setInjuryTypeDistribution] = useState<{name: string, value: number}[]>([])
  
  useEffect(() => {
    async function runAnalysis() {
      try {
        // Perform comprehensive injury analysis
        const results = await performInjuryAnalysis(physicalData)
        setAnalysisResults(results)
        
        // Calculate injury type distribution
        const typeCount: Record<string, number> = {}
        
        results.injuryHistory.forEach(injury => {
          typeCount[injury.injuryType] = (typeCount[injury.injuryType] || 0) + 1
        })
        
        const distribution = Object.entries(typeCount).map(([name, value]) => ({
          name,
          value
        }))
        
        setInjuryTypeDistribution(distribution)
        setLoading(false)
      } catch (error) {
        console.error("Error performing injury analysis:", error)
        setLoading(false)
      }
    }
    
    runAnalysis()
  }, [physicalData])
  
  // Get total injury count
  const getTotalInjuries = () => {
    return analysisResults?.injuryHistory.length || 0
  }
  
  // Calculate average recovery time (days out)
  const getAverageRecoveryTime = () => {
    if (!analysisResults?.injuryHistory.length) return 0
    
    const totalDaysOut = analysisResults.injuryHistory.reduce((sum, injury) => sum + injury.daysOut, 0)
    return Math.round(totalDaysOut / analysisResults.injuryHistory.length)
  }
  
  // Get injury count in last 6 months
  const getRecentInjuryCount = () => {
    if (!analysisResults?.injuryHistory.length) return 0
    
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
    
    return analysisResults.injuryHistory.filter(injury => {
      const injuryDate = new Date(injury.date)
      return injuryDate >= sixMonthsAgo
    }).length
  }
  
  // Get color for injury severity
  const getSeverityColor = (severity: 'Minor' | 'Moderate' | 'Severe') => {
    switch (severity) {
      case 'Minor':
        return '#4CAF50' // Green
      case 'Moderate':
        return '#FFC107' // Yellow
      case 'Severe':
        return '#FF5722' // Red
      default:
        return '#1E54B7' // Blue
    }
  }
  
  // Get color for injury risk
  const getRiskColor = (risk: 'Low' | 'Moderate' | 'High') => {
    switch (risk) {
      case 'Low':
        return '#4CAF50' // Green
      case 'Moderate':
        return '#FFC107' // Yellow
      case 'High':
        return '#FF5722' // Red
      default:
        return '#1E54B7' // Blue
    }
  }
  
  // Colors for pie chart
  const COLORS = ['#1E54B7', '#0CAFFF', '#365EFF', '#6B7FFF', '#4CAF50', '#FFC107', '#FF5722']
  
  // Format date string (YYYY-MM-DD to MMM DD, YYYY)
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }
  
  // Chart tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 p-3 border border-gray-700 rounded shadow-lg">
          <p className="text-white font-medium">{payload[0].name}</p>
          <p className="text-white">
            {payload[0].value} {payload[0].name === 'Count' ? 'injuries' : ''}
          </p>
        </div>
      )
    }
    return null
  }
  
  // Convert body heatmap data for visualization
  const prepareBodyHeatmapData = () => {
    if (!analysisResults?.bodyHeatmap) return []
    
    return Object.entries(analysisResults.bodyHeatmap)
      .map(([bodyPart, value]) => ({
        name: bodyPart,
        value: value > 0 ? value : 0
      }))
      .filter(item => item.value > 0)
      .sort((a, b) => b.value - a.value)
  }
  
  // Get injury timeline data
  const prepareTimelineData = () => {
    if (!analysisResults?.injuryHistory) return []
    
    // Create a map of months to count injuries
    const monthlyInjuries: Record<string, number> = {}
    
    // Get 12 month range
    const months = []
    const today = new Date()
    for (let i = 11; i >= 0; i--) {
      const d = new Date()
      d.setMonth(today.getMonth() - i)
      const monthYear = d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      months.push(monthYear)
      monthlyInjuries[monthYear] = 0
    }
    
    // Count injuries by month
    analysisResults.injuryHistory.forEach(injury => {
      const date = new Date(injury.date)
      const monthYear = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      
      if (monthlyInjuries.hasOwnProperty(monthYear)) {
        monthlyInjuries[monthYear] += 1
      }
    })
    
    // Convert to chart data format
    return months.map(month => ({
      name: month,
      Count: monthlyInjuries[month]
    }))
  }
  
  if (loading) {
    return (
      <div className="h-[200px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#1E54B7]"></div>
      </div>
    )
  }
  
  return (
    <div className="space-y-8">
      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-900 bg-opacity-70 backdrop-blur-sm p-6 rounded-lg border border-gray-800">
          <h3 className="text-lg font-medium text-white mb-2">Current Status</h3>
          <div className="flex items-center mt-4">
            <div className={`w-4 h-4 rounded-full ${analysisResults?.currentStatus === 'Available' ? 'bg-green-500' : 
                                                   analysisResults?.currentStatus === 'Limited Training' ? 'bg-yellow-500' : 
                                                   'bg-red-500'} mr-2`}></div>
            <span className="text-xl font-bold text-white">{analysisResults?.currentStatus || 'Unknown'}</span>
          </div>
          <p className="text-gray-400 text-sm mt-2">Player availability status</p>
        </div>
        
        <div className="bg-gray-900 bg-opacity-70 backdrop-blur-sm p-6 rounded-lg border border-gray-800">
          <h3 className="text-lg font-medium text-white mb-2">Injury Risk</h3>
          <div className="flex items-center mt-4">
            <div className={`w-4 h-4 rounded-full ${
              analysisResults?.riskFactors.overallRisk === 'Low' ? 'bg-green-500' :
              analysisResults?.riskFactors.overallRisk === 'Moderate' ? 'bg-yellow-500' : 
              'bg-red-500'} mr-2`}></div>
            <span className="text-xl font-bold text-white">{analysisResults?.riskFactors.overallRisk || 'Unknown'}</span>
          </div>
          <p className="text-gray-400 text-sm mt-2">Based on current metrics</p>
        </div>
        
        <div className="bg-gray-900 bg-opacity-70 backdrop-blur-sm p-6 rounded-lg border border-gray-800">
          <h3 className="text-lg font-medium text-white mb-2">Total Injuries</h3>
          <p className="text-3xl font-bold text-[#1E54B7]">{getTotalInjuries()}</p>
          <p className="text-gray-400 text-sm mt-2">{getRecentInjuryCount()} in last 6 months</p>
        </div>
        
        <div className="bg-gray-900 bg-opacity-70 backdrop-blur-sm p-6 rounded-lg border border-gray-800">
          <h3 className="text-lg font-medium text-white mb-2">Avg. Recovery</h3>
          <p className="text-3xl font-bold text-[#1E54B7]">{getAverageRecoveryTime()}d</p>
          <p className="text-gray-400 text-sm mt-2">Average days out per injury</p>
        </div>
      </div>
      
      {/* Injury Type Distribution and Body Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-gray-900 bg-opacity-70 backdrop-blur-sm p-6 rounded-lg border border-gray-800">
          <h3 className="text-xl font-medium text-white mb-4">Injury Type Distribution</h3>
          {injuryTypeDistribution.length > 0 ? (
            <div className="h-[300px] flex flex-col items-center justify-center">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={injuryTypeDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({name, percent}) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {injuryTypeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} injuries`, 'Count']} />
                </PieChart>
              </ResponsiveContainer>
              
              <div className="flex flex-wrap justify-center gap-4">
                {injuryTypeDistribution.map((entry, index) => (
                  <div key={index} className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                    <span className="text-sm text-gray-300">{entry.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-400">
              No injury type data available
            </div>
          )}
        </div>
        
        <div className="bg-gray-900 bg-opacity-70 backdrop-blur-sm p-6 rounded-lg border border-gray-800">
          <h3 className="text-xl font-medium text-white mb-4">Body Area Heatmap</h3>
          {analysisResults?.bodyHeatmap ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[300px]">
              {/* Body Visualization */}
              <div className="relative flex items-center justify-center">
                {/* Simplified human body outline */}
                <svg viewBox="0 0 100 200" className="w-full h-full max-h-[300px]">
                  {/* Head */}
                  <circle cx="50" cy="25" r="15" fill="#1E1E1E" stroke="#444" strokeWidth="1" />

                  {/* Torso */}
                  <rect x="35" y="45" width="30" height="50" fill="#1E1E1E" stroke="#444" strokeWidth="1" rx="2" />

                  {/* Arms */}
                  <rect x="15" y="45" width="15" height="40" fill="#1E1E1E" stroke="#444" strokeWidth="1" rx="5" />
                  <rect x="70" y="45" width="15" height="40" fill="#1E1E1E" stroke="#444" strokeWidth="1" rx="5" />

                  {/* Legs */}
                  <rect x="35" y="100" width="12" height="60" fill="#1E1E1E" stroke="#444" strokeWidth="1" rx="5" />
                  <rect x="53" y="100" width="12" height="60" fill="#1E1E1E" stroke="#444" strokeWidth="1" rx="5" />

                  {/* Injury hotspots */}
                  {Object.entries(analysisResults.bodyHeatmap).map(([part, value], index) => {
                    if (value <= 0) return null
                    
                    // Map body parts to positions on SVG
                    const position = getBodyPartPosition(part)
                    const opacity = Math.min(0.2 + (value * 0.15), 0.9) // Scale opacity based on value
                    const radius = Math.min(4 + (value * 2), 12) // Scale radius based on value
                    
                    return (
                      <circle 
                        key={index}
                        cx={position.x}
                        cy={position.y}
                        r={radius}
                        fill={selectedBodyPart === part ? '#FF5722' : '#1E54B7'}
                        fillOpacity={opacity}
                        onClick={() => setSelectedBodyPart(part)}
                        style={{ cursor: 'pointer' }}
                      />
                    )
                  })}
                </svg>
              </div>
              
              {/* Body Part List */}
              <div className="overflow-y-auto max-h-[300px]">
                <h4 className="text-white text-sm font-medium mb-3">Injury Prone Areas</h4>
                <div className="space-y-2">
                  {prepareBodyHeatmapData().map((item, index) => (
                    <div 
                      key={index} 
                      className={`p-2 rounded-md cursor-pointer ${selectedBodyPart === item.name ? 'bg-[#1E54B7]/20' : 'hover:bg-gray-800'}`}
                      onClick={() => setSelectedBodyPart(item.name === selectedBodyPart ? null : item.name)}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-white text-sm">{item.name}</span>
                        <div className="h-2 bg-gray-700 rounded-full w-24">
                          <div 
                            className="h-2 rounded-full bg-[#1E54B7]" 
                            style={{ width: `${Math.min(item.value * 20, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-400">
              No body area data available
            </div>
          )}
        </div>
      </div>
      
      {/* Injury Timeline and Risk Factors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-gray-900 bg-opacity-70 backdrop-blur-sm p-6 rounded-lg border border-gray-800">
          <h3 className="text-xl font-medium text-white mb-4">Injury Timeline</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={prepareTimelineData()}
              margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis 
                dataKey="name" 
                tick={{ fill: '#ccc' }} 
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis tick={{ fill: '#ccc' }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="Count" name="Injuries" fill="#1E54B7" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="bg-gray-900 bg-opacity-70 backdrop-blur-sm p-6 rounded-lg border border-gray-800">
          <h3 className="text-xl font-medium text-white mb-4">Risk Factors</h3>
          {analysisResults?.riskFactors ? (
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-300">Load Spikes</span>
                  <span className="text-sm" style={{ color: analysisResults.riskFactors.loadSpikes ? '#FF5722' : '#4CAF50' }}>
                    {analysisResults.riskFactors.loadSpikes ? 'High Risk' : 'Low Risk'}
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full" 
                    style={{ 
                      width: analysisResults.riskFactors.loadSpikes ? '70%' : '30%',
                      backgroundColor: analysisResults.riskFactors.loadSpikes ? '#FF5722' : '#4CAF50'
                    }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-300">Fatigue Level</span>
                  <span className="text-sm" style={{ 
                    color: analysisResults.riskFactors.fatigueLevel === 'High' ? '#FF5722' : 
                           analysisResults.riskFactors.fatigueLevel === 'Moderate' ? '#FFC107' : '#4CAF50'
                  }}>
                    {analysisResults.riskFactors.fatigueLevel} Risk
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full" 
                    style={{ 
                      width: analysisResults.riskFactors.fatigueLevel === 'High' ? '80%' : 
                             analysisResults.riskFactors.fatigueLevel === 'Moderate' ? '50%' : '20%',
                      backgroundColor: analysisResults.riskFactors.fatigueLevel === 'High' ? '#FF5722' : 
                                       analysisResults.riskFactors.fatigueLevel === 'Moderate' ? '#FFC107' : '#4CAF50'
                    }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-300">Sleep Quality</span>
                  <span className="text-sm" style={{ 
                    color: analysisResults.riskFactors.sleepQuality === 'Poor' ? '#FF5722' : 
                           analysisResults.riskFactors.sleepQuality === 'Average' ? '#FFC107' : '#4CAF50'
                  }}>
                    {analysisResults.riskFactors.sleepQuality === 'Poor' ? 'High' : 
                      analysisResults.riskFactors.sleepQuality === 'Average' ? 'Moderate' : 'Low'} Risk
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full" 
                    style={{ 
                      width: analysisResults.riskFactors.sleepQuality === 'Poor' ? '80%' : 
                             analysisResults.riskFactors.sleepQuality === 'Average' ? '50%' : '20%',
                      backgroundColor: analysisResults.riskFactors.sleepQuality === 'Poor' ? '#FF5722' : 
                                       analysisResults.riskFactors.sleepQuality === 'Average' ? '#FFC107' : '#4CAF50'
                    }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-300">Muscle Imbalances</span>
                  <span className="text-sm" style={{ 
                    color: analysisResults.riskFactors.muscleImbalances.length > 2 ? '#FF5722' : 
                           analysisResults.riskFactors.muscleImbalances.length > 0 ? '#FFC107' : '#4CAF50'
                  }}>
                    {analysisResults.riskFactors.muscleImbalances.length > 2 ? 'High' : 
                      analysisResults.riskFactors.muscleImbalances.length > 0 ? 'Moderate' : 'Low'} Risk
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full" 
                    style={{ 
                      width: analysisResults.riskFactors.muscleImbalances.length > 2 ? '80%' : 
                             analysisResults.riskFactors.muscleImbalances.length > 0 ? '50%' : '20%',
                      backgroundColor: analysisResults.riskFactors.muscleImbalances.length > 2 ? '#FF5722' : 
                                       analysisResults.riskFactors.muscleImbalances.length > 0 ? '#FFC107' : '#4CAF50'
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[200px] text-gray-400">
              No risk factor data available
            </div>
          )}
        </div>
      </div>
      
      {/* Injury History and Prehab */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="bg-gray-900 bg-opacity-70 backdrop-blur-sm p-6 rounded-lg border border-gray-800 lg:col-span-7">
          <h3 className="text-xl font-medium text-white mb-4">Injury History</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="py-3 px-4 text-sm font-medium text-gray-300">Date</th>
                  <th className="py-3 px-4 text-sm font-medium text-gray-300">Body Part</th>
                  <th className="py-3 px-4 text-sm font-medium text-gray-300">Injury Type</th>
                  <th className="py-3 px-4 text-sm font-medium text-gray-300">Severity</th>
                  <th className="py-3 px-4 text-sm font-medium text-gray-300">Days Out</th>
                  <th className="py-3 px-4 text-sm font-medium text-gray-300">Recurrence</th>
                </tr>
              </thead>
              <tbody>
                {analysisResults?.injuryHistory.map((injury, index) => (
                  <tr key={index} className="border-b border-gray-800 hover:bg-gray-800/50">
                    <td className="py-3 px-4 text-sm text-white">{formatDate(injury.date)}</td>
                    <td className="py-3 px-4 text-sm text-gray-300">{injury.bodyPart}</td>
                    <td className="py-3 px-4 text-sm text-gray-300">{injury.injuryType}</td>
                    <td className="py-3 px-4 text-sm">
                      <span 
                        className="px-2 py-1 text-xs rounded-full" 
                        style={{ 
                          backgroundColor: `${getSeverityColor(injury.severity)}20`,
                          color: getSeverityColor(injury.severity)
                        }}
                      >
                        {injury.severity}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-300">{injury.daysOut}</td>
                    <td className="py-3 px-4 text-sm text-gray-300">{injury.recurrence ? 'Yes' : 'No'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="bg-gray-900 bg-opacity-70 backdrop-blur-sm p-6 rounded-lg border border-gray-800 lg:col-span-5">
          <h3 className="text-xl font-medium text-white mb-4">Recommended Prehab</h3>
          {analysisResults?.recommendedPrehab && analysisResults.recommendedPrehab.length > 0 ? (
            <ul className="space-y-3">
              {analysisResults.recommendedPrehab.map((recommendation, index) => (
                <li key={index} className="flex items-start">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#1E54B7] flex items-center justify-center mt-0.5">
                    <span className="text-xs text-white">{index + 1}</span>
                  </div>
                  <div className="ml-3">
                    <p className="text-white font-medium">{recommendation.split('(')[0].trim()}</p>
                    {recommendation.includes('(') && (
                      <p className="text-gray-400 text-sm">
                        ({recommendation.split('(')[1].replace(')', '')})
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex items-center justify-center h-[200px] text-gray-400">
              No prehab recommendations available
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Helper function to map body parts to positions on the SVG
function getBodyPartPosition(bodyPart: string): {x: number, y: number} {
  const positions: Record<string, {x: number, y: number}> = {
    'Head': { x: 50, y: 25 },
    'Neck': { x: 50, y: 40 },
    'Shoulder': { x: 25, y: 50 },
    'Upper Arm': { x: 20, y: 60 },
    'Elbow': { x: 15, y: 65 },
    'Forearm': { x: 15, y: 75 },
    'Wrist': { x: 15, y: 85 },
    'Hand': { x: 15, y: 90 },
    'Chest': { x: 50, y: 55 },
    'Abdomen': { x: 50, y: 70 },
    'Back': { x: 50, y: 65 },
    'Hip': { x: 40, y: 95 },
    'Groin': { x: 50, y: 95 },
    'Quadriceps': { x: 40, y: 110 },
    'Hamstring': { x: 40, y: 125 },
    'Knee': { x: 40, y: 140 },
    'Calf': { x: 40, y: 155 },
    'Shin': { x: 60, y: 155 },
    'Ankle': { x: 40, y: 170 },
    'Foot': { x: 40, y: 180 }
  }
  
  return positions[bodyPart] || { x: 50, y: 100 } // Default to center if not found
}