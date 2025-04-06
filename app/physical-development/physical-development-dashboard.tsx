"use client"

import { useState, useEffect } from "react"
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer, LineChart, Line,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ComposedChart, Area, ScatterChart, Scatter, ZAxis, Cell, PieChart, Pie
} from 'recharts'
import { 
  PhysicalCapabilityData, MovementType, getDataByMovement, 
  analyzePhysicalCapabilityData, getRecommendedFocusAreas, MovementAnalysis
} from "../utils/physical-capability-data"
import { fetchPriorityAreas, getPriorityAreasByCategory } from "../utils/priority-areas"

interface PhysicalDevelopmentDashboardProps {
  physicalData: PhysicalCapabilityData[]
}

export function PhysicalDevelopmentDashboard({ physicalData }: PhysicalDevelopmentDashboardProps) {
  const [selectedMovement, setSelectedMovement] = useState<MovementType>(MovementType.Sprint)
  const [analysisResults, setAnalysisResults] = useState<MovementAnalysis[]>([])
  const [recommendations, setRecommendations] = useState<string[]>([])
  const [priorityAreas, setPriorityAreas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    // Perform analysis on the physical data
    if (physicalData.length > 0) {
      const analysis = analyzePhysicalCapabilityData(physicalData)
      setAnalysisResults(analysis)
      
      // Generate recommendations based on analysis
      const focusAreas = getRecommendedFocusAreas(analysis)
      setRecommendations(focusAreas)
      
      // Load priority areas related to physical development
      loadPriorityAreas()
      
      setLoading(false)
    }
  }, [physicalData])
  
  // Load priority areas data
  const loadPriorityAreas = async () => {
    try {
      const priorityData = await fetchPriorityAreas()
      const physicalPriorities = getPriorityAreasByCategory(priorityData, "Performance")
      setPriorityAreas(physicalPriorities)
    } catch (error) {
      console.error("Error loading priority areas:", error)
    }
  }
  
  // Get data for the selected movement
  const getSelectedMovementData = () => {
    return getDataByMovement(physicalData, selectedMovement)
  }
  
  // Get analysis for the selected movement
  const getSelectedMovementAnalysis = () => {
    return analysisResults.find(item => item.movement === selectedMovement) || null
  }
  
  // Calculate movement-specific metrics
  const getMovementMetrics = () => {
    const movementAnalysis = getSelectedMovementAnalysis()
    
    if (!movementAnalysis) return null
    
    return {
      avgBenchmark: movementAnalysis.avgBenchmark,
      improvementRate: movementAnalysis.improvementRate,
      strengths: movementAnalysis.strengths,
      weaknesses: movementAnalysis.weaknesses
    }
  }
  
  // Prepare trend data for line chart
  const prepareTrendData = () => {
    const movementAnalysis = getSelectedMovementAnalysis()
    
    if (!movementAnalysis) return []
    
    return movementAnalysis.trendsOverTime
  }
  
  // Prepare radar data for movement qualities
  const prepareRadarData = () => {
    const allQualities = new Set<string>()
    
    // Get all qualities from the data
    physicalData.forEach(item => {
      if (item.quality) {
        allQualities.add(item.quality)
      }
    })
    
    // For each quality, calculate benchmark
    const radarData = Array.from(allQualities).map(quality => {
      // Get data for this quality
      const qualityData = physicalData.filter(item => item.quality === quality)
      
      // Calculate average benchmark
      const avgBenchmark = qualityData.reduce((sum, item) => sum + item.benchmarkPct, 0) / qualityData.length
      
      return {
        quality,
        value: avgBenchmark
      }
    })
    
    return radarData
  }
  
  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 p-3 border border-gray-700 rounded shadow-lg">
          <p className="text-white font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {typeof entry.value === 'number' ? entry.value.toFixed(1) : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };
  
  // Background colors for radar chart
  const RADAR_COLORS = {
    background: '#1E54B7',
    backgroundOpacity: 0.3,
    stroke: '#1E54B7'
  }
  
  // Prepare correlation data for scatter plot
  const prepareCorrelationData = () => {
    // Compare two movements to find correlation
    const compareMovements = (movement1: MovementType, movement2: MovementType) => {
      const data: {x: number, y: number, date: string}[] = []
      
      // Group data by date
      const dateMap = new Map<string, {[key in MovementType]?: number}>()
      
      physicalData.forEach(item => {
        if (!dateMap.has(item.date)) {
          dateMap.set(item.date, {})
        }
        
        const dateEntry = dateMap.get(item.date)!
        if (item.movement === movement1) {
          dateEntry[movement1] = item.benchmarkPct
        } else if (item.movement === movement2) {
          dateEntry[movement2] = item.benchmarkPct
        }
      })
      
      // Convert to scatter data where both movements have values
      dateMap.forEach((values, date) => {
        if (values[movement1] !== undefined && values[movement2] !== undefined) {
          data.push({
            x: values[movement1]!,
            y: values[movement2]!,
            date
          })
        }
      })
      
      return data
    }
    
    // For the selected movement, compare with all other movements
    const allMovements = Object.values(MovementType)
    const comparisonMovement = allMovements.find(m => m !== selectedMovement) || MovementType.Jump
    
    return compareMovements(selectedMovement, comparisonMovement)
  }
  
  // Prepare progress over time comparison between all movement types
  const prepareProgressComparisonData = () => {
    const allMovements = Object.values(MovementType)
    const movementData: {[key: string]: {date: string, value: number}[]} = {}
    
    // Initialize empty arrays for each movement
    allMovements.forEach(movement => {
      movementData[movement] = []
    })
    
    // Group data by movement and date
    physicalData.forEach(item => {
      if (item.movement && item.date) {
        // Find if we already have an entry for this date
        const existingEntryIndex = movementData[item.movement].findIndex(
          entry => entry.date === item.date
        )
        
        if (existingEntryIndex >= 0) {
          // Average with existing value
          const existingValue = movementData[item.movement][existingEntryIndex].value
          movementData[item.movement][existingEntryIndex].value = 
            (existingValue + item.benchmarkPct) / 2
        } else {
          // Add new entry
          movementData[item.movement].push({
            date: item.date,
            value: item.benchmarkPct
          })
        }
      }
    })
    
    // Sort each movement's data by date
    Object.keys(movementData).forEach(movement => {
      movementData[movement].sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      )
    })
    
    // Combine data for multi-line chart
    // Find all unique dates across all movements
    const allDates = new Set<string>()
    Object.values(movementData).forEach(data => {
      data.forEach(entry => allDates.add(entry.date))
    })
    
    // Sort dates
    const sortedDates = Array.from(allDates).sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime()
    )
    
    // Create combined data
    return sortedDates.map(date => {
      const entry: {[key: string]: any} = { date }
      
      allMovements.forEach(movement => {
        const dataPoint = movementData[movement].find(item => item.date === date)
        entry[movement] = dataPoint ? dataPoint.value : null
      })
      
      return entry
    })
  }
  
  // Colors for each movement type
  const MOVEMENT_COLORS: {[key in MovementType]: string} = {
    [MovementType.Sprint]: '#1E54B7',
    [MovementType.Jump]: '#0CAFFF',
    [MovementType.Agility]: '#4CAF50',
    [MovementType.Strength]: '#FFC107',
    [MovementType.Endurance]: '#FF5722'
  }
  
  // Get movement metrics
  const movementMetrics = getMovementMetrics()
  
  // Format movement metrics percentages
  const formatPercentage = (value: number) => {
    return value.toFixed(1) + '%'
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
      {/* Movement Type Selector */}
      <div className="flex justify-center space-x-2">
        {Object.values(MovementType).map((movement) => (
          <button 
            key={movement}
            className={`px-4 py-2 rounded-md text-sm ${selectedMovement === movement ? 'bg-[#1E54B7] text-white' : 'bg-gray-800 text-white'}`}
            onClick={() => setSelectedMovement(movement)}
          >
            {movement}
          </button>
        ))}
      </div>
      
      {/* Movement Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-900 bg-opacity-70 backdrop-blur-sm p-6 rounded-lg border border-gray-800">
          <h3 className="text-lg font-medium text-white mb-2">Benchmark Score</h3>
          <p className="text-4xl font-bold text-[#1E54B7]">{movementMetrics ? formatPercentage(movementMetrics.avgBenchmark) : 'N/A'}</p>
          <p className="text-gray-400 text-sm mt-2">Overall {selectedMovement} capability</p>
        </div>
        
        <div className="bg-gray-900 bg-opacity-70 backdrop-blur-sm p-6 rounded-lg border border-gray-800">
          <h3 className="text-lg font-medium text-white mb-2">Improvement Rate</h3>
          <p className={`text-4xl font-bold ${movementMetrics && movementMetrics.improvementRate >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {movementMetrics ? (movementMetrics.improvementRate >= 0 ? '+' : '') + movementMetrics.improvementRate.toFixed(1) + '%' : 'N/A'}
          </p>
          <p className="text-gray-400 text-sm mt-2">Over assessment period</p>
        </div>
        
        <div className="bg-gray-900 bg-opacity-70 backdrop-blur-sm p-6 rounded-lg border border-gray-800">
          <h3 className="text-lg font-medium text-white mb-2">Strengths</h3>
          <div className="space-y-2 mt-3">
            {movementMetrics && movementMetrics.strengths.length > 0 ? (
              movementMetrics.strengths.map((strength, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                  <p className="text-gray-300 text-sm">{strength}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-sm">No significant strengths identified</p>
            )}
          </div>
        </div>
        
        <div className="bg-gray-900 bg-opacity-70 backdrop-blur-sm p-6 rounded-lg border border-gray-800">
          <h3 className="text-lg font-medium text-white mb-2">Development Areas</h3>
          <div className="space-y-2 mt-3">
            {movementMetrics && movementMetrics.weaknesses.length > 0 ? (
              movementMetrics.weaknesses.map((weakness, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
                  <p className="text-gray-300 text-sm">{weakness}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-sm">No significant weaknesses identified</p>
            )}
          </div>
        </div>
      </div>
      
      {/* Trend Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-gray-900 bg-opacity-70 backdrop-blur-sm p-6 rounded-lg border border-gray-800">
          <h3 className="text-xl font-medium text-white mb-4">{selectedMovement} Benchmark Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart
              data={prepareTrendData()}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis 
                dataKey="date" 
                tick={{ fill: '#ccc' }} 
                axisLine={{ stroke: '#666' }}
              />
              <YAxis 
                domain={[0, 100]} 
                tick={{ fill: '#ccc' }} 
                axisLine={{ stroke: '#666' }}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="value" 
                name="Benchmark" 
                stroke="#1E54B7" 
                fill="#1E54B7" 
                fillOpacity={0.3}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                name="Benchmark" 
                stroke="#1E54B7" 
                dot={{ fill: '#1E54B7', r: 4 }}
                activeDot={{ r: 8 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        
        <div className="bg-gray-900 bg-opacity-70 backdrop-blur-sm p-6 rounded-lg border border-gray-800">
          <h3 className="text-xl font-medium text-white mb-4">Physical Quality Profile</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={prepareRadarData()}>
              <PolarGrid stroke="#444" />
              <PolarAngleAxis dataKey="quality" tick={{ fill: '#ccc' }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#ccc' }} />
              <Radar
                name="Benchmark"
                dataKey="value"
                stroke={RADAR_COLORS.stroke}
                fill={RADAR_COLORS.background}
                fillOpacity={RADAR_COLORS.backgroundOpacity}
              />
              <Tooltip formatter={(value) => [`${value.toFixed(1)}%`, 'Benchmark']} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Movement Comparisons */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-gray-900 bg-opacity-70 backdrop-blur-sm p-6 rounded-lg border border-gray-800">
          <h3 className="text-xl font-medium text-white mb-4">All Movement Types Progress</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={prepareProgressComparisonData()}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis 
                dataKey="date" 
                tick={{ fill: '#ccc' }} 
                axisLine={{ stroke: '#666' }}
              />
              <YAxis 
                domain={[0, 100]} 
                tick={{ fill: '#ccc' }} 
                axisLine={{ stroke: '#666' }}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {Object.values(MovementType).map((movement) => (
                <Line 
                  key={movement}
                  type="monotone" 
                  dataKey={movement} 
                  name={movement} 
                  stroke={MOVEMENT_COLORS[movement]}
                  strokeWidth={movement === selectedMovement ? 3 : 1.5}
                  dot={{ fill: MOVEMENT_COLORS[movement], r: movement === selectedMovement ? 4 : 3 }}
                  activeDot={{ r: movement === selectedMovement ? 8 : 6 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="bg-gray-900 bg-opacity-70 backdrop-blur-sm p-6 rounded-lg border border-gray-800">
          <h3 className="text-xl font-medium text-white mb-4">Movement Correlation Analysis</h3>
          <div className="flex justify-center mt-2 mb-4">
            <div className="bg-gray-800 bg-opacity-70 p-2 rounded-md text-sm text-gray-300">
              Shows relationship between {selectedMovement} and other movement types
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <ScatterChart
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis 
                type="number" 
                dataKey="x" 
                name={selectedMovement}
                domain={[0, 100]}
                tick={{ fill: '#ccc' }} 
                axisLine={{ stroke: '#666' }}
                label={{ value: selectedMovement, position: 'insideBottom', offset: -5, fill: '#ccc' }}
              />
              <YAxis 
                type="number" 
                dataKey="y" 
                name={Object.values(MovementType).find(m => m !== selectedMovement) || ''}
                domain={[0, 100]}
                tick={{ fill: '#ccc' }} 
                axisLine={{ stroke: '#666' }}
                label={{ 
                  value: Object.values(MovementType).find(m => m !== selectedMovement) || '', 
                  angle: -90, 
                  position: 'insideLeft', 
                  offset: 10,
                  fill: '#ccc'
                }}
              />
              <ZAxis range={[60, 60]} />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }} 
                formatter={(value, name) => {
                  if (name === 'x') return [`${value.toFixed(1)}%`, selectedMovement];
                  if (name === 'y') return [
                    `${value.toFixed(1)}%`, 
                    Object.values(MovementType).find(m => m !== selectedMovement) || ''
                  ];
                  return [value, name];
                }}
              />
              <Scatter 
                name="Movement Correlation" 
                data={prepareCorrelationData()} 
                fill={MOVEMENT_COLORS[selectedMovement]}
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Development Recommendations */}
      <div className="bg-gray-900 bg-opacity-70 backdrop-blur-sm p-6 rounded-lg border border-gray-800 mb-8">
        <h3 className="text-xl font-medium text-white mb-4">Recommended Focus Areas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-medium text-white mb-2">Based on Data Analysis</h4>
            {recommendations.length > 0 ? (
              <ul className="list-disc pl-5 space-y-2">
                {recommendations.map((recommendation, index) => (
                  <li key={index} className="text-gray-300">{recommendation}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400">No specific recommendations available</p>
            )}
          </div>
          
          <div>
            <h4 className="text-lg font-medium text-white mb-2">Current Priority Areas</h4>
            {priorityAreas.length > 0 ? (
              <div className="space-y-4">
                {priorityAreas.map((item, index) => (
                  <div key={index} className="bg-gray-800 bg-opacity-50 p-3 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="text-white text-sm font-medium">{item.Area}</h5>
                        <p className="text-gray-400 text-xs">{item.Target}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        item.Tracking === 'Achieved' ? 'bg-green-500/20 text-green-300' :
                        item.Tracking === 'On Track' ? 'bg-blue-500/20 text-blue-300' :
                        item.Tracking === 'Behind' ? 'bg-yellow-500/20 text-yellow-300' :
                        'bg-gray-500/20 text-gray-300'
                      }`}>{item.Tracking}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No specific priority areas set</p>
            )}
          </div>
        </div>
      </div>
      
      {/* Development Plan */}
      <div className="bg-gray-900 bg-opacity-70 backdrop-blur-sm p-6 rounded-lg border border-gray-800">
        <h3 className="text-xl font-medium text-white mb-4">Development Plan</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="py-3 px-4 text-sm font-medium text-gray-300">Focus Area</th>
                <th className="py-3 px-4 text-sm font-medium text-gray-300">Current Level</th>
                <th className="py-3 px-4 text-sm font-medium text-gray-300">Target</th>
                <th className="py-3 px-4 text-sm font-medium text-gray-300">Timeline</th>
                <th className="py-3 px-4 text-sm font-medium text-gray-300">Priority</th>
              </tr>
            </thead>
            <tbody>
              {movementMetrics && movementMetrics.weaknesses.length > 0 ? (
                // Dynamic development areas based on weaknesses
                movementMetrics.weaknesses.map((weakness, index) => {
                  // Find data for this weakness
                  const weaknessData = physicalData.filter(item => 
                    item.movement === selectedMovement && 
                    item.quality === weakness
                  )
                  
                  // Calculate current level
                  const currentLevel = weaknessData.length > 0 ? 
                    weaknessData.reduce((sum, item) => sum + item.benchmarkPct, 0) / weaknessData.length :
                    0
                  
                  // Set target level (current + 15% or 85%, whichever is lower)
                  const targetLevel = Math.min(currentLevel * 1.15, 85)
                  
                  // Determine timeline based on gap
                  const gap = targetLevel - currentLevel
                  const timeline = gap < 10 ? "4 weeks" : gap < 20 ? "8 weeks" : "12 weeks"
                  
                  // Determine priority
                  const priority = gap > 20 ? "High" : gap > 10 ? "Medium" : "Low"
                  const priorityColor = priority === "High" ? "bg-red-500/20 text-red-300" :
                                      priority === "Medium" ? "bg-yellow-500/20 text-yellow-300" :
                                      "bg-green-500/20 text-green-300"
                  
                  return (
                    <tr key={index} className="border-b border-gray-800">
                      <td className="py-3 px-4 text-sm text-white">{selectedMovement} {weakness}</td>
                      <td className="py-3 px-4 text-sm text-gray-300">{currentLevel.toFixed(1)}%</td>
                      <td className="py-3 px-4 text-sm text-gray-300">{targetLevel.toFixed(1)}%</td>
                      <td className="py-3 px-4 text-sm text-gray-300">{timeline}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${priorityColor}`}>{priority}</span>
                      </td>
                    </tr>
                  )
                })
              ) : (
                // If no weaknesses found, show some default development plans
                <>
                  <tr className="border-b border-gray-800">
                    <td className="py-3 px-4 text-sm text-white">Sprint Speed</td>
                    <td className="py-3 px-4 text-sm text-gray-300">78.5%</td>
                    <td className="py-3 px-4 text-sm text-gray-300">85.0%</td>
                    <td className="py-3 px-4 text-sm text-gray-300">6 weeks</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 text-xs rounded-full bg-yellow-500/20 text-yellow-300">Medium</span>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="py-3 px-4 text-sm text-white">Sprint Acceleration</td>
                    <td className="py-3 px-4 text-sm text-gray-300">72.3%</td>
                    <td className="py-3 px-4 text-sm text-gray-300">82.0%</td>
                    <td className="py-3 px-4 text-sm text-gray-300">8 weeks</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 text-xs rounded-full bg-red-500/20 text-red-300">High</span>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="py-3 px-4 text-sm text-white">Vertical Jump Height</td>
                    <td className="py-3 px-4 text-sm text-gray-300">81.7%</td>
                    <td className="py-3 px-4 text-sm text-gray-300">86.0%</td>
                    <td className="py-3 px-4 text-sm text-gray-300">4 weeks</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 text-xs rounded-full bg-green-500/20 text-green-300">Low</span>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="py-3 px-4 text-sm text-white">Agility Change of Direction</td>
                    <td className="py-3 px-4 text-sm text-gray-300">68.9%</td>
                    <td className="py-3 px-4 text-sm text-gray-300">80.0%</td>
                    <td className="py-3 px-4 text-sm text-gray-300">10 weeks</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 text-xs rounded-full bg-red-500/20 text-red-300">High</span>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="py-3 px-4 text-sm text-white">Lower Body Strength</td>
                    <td className="py-3 px-4 text-sm text-gray-300">76.2%</td>
                    <td className="py-3 px-4 text-sm text-gray-300">83.0%</td>
                    <td className="py-3 px-4 text-sm text-gray-300">6 weeks</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 text-xs rounded-full bg-yellow-500/20 text-yellow-300">Medium</span>
                    </td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}