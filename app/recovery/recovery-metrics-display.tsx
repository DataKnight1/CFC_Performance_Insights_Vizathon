"use client"

import { useState, useEffect } from "react"
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer, LineChart, Line, Area, 
  AreaChart, PieChart, Pie, Cell, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts'
import { InfoTooltip } from "../components/info-tooltip"

interface RecoveryMetricsDisplayProps {
  recoveryData: any[]
  initialTimeFrame: '7days' | '30days' | '90days'
  onTimeFrameChange: (timeFrame: '7days' | '30days' | '90days') => void
}

export function RecoveryMetricsDisplay({ 
  recoveryData, 
  initialTimeFrame,
  onTimeFrameChange
}: RecoveryMetricsDisplayProps) {
  const [timeFrame, setTimeFrame] = useState<'7days' | '30days' | '90days'>(initialTimeFrame)
  
  // Set time frame and notify parent
  const handleTimeFrameChange = (newTimeFrame: '7days' | '30days' | '90days') => {
    setTimeFrame(newTimeFrame)
    onTimeFrameChange(newTimeFrame)
  }
  
  // Filter data based on selected timeframe
  const filteredData = filterDataByTimeframe(recoveryData, timeFrame)
  
  // Calculate key metrics
  const overallScore = calculateAverageScore(filteredData, 'emboss_baseline_score')
  const sleepScore = calculateAverageScore(filteredData, 'sleep_composite')
  const sorenessScore = calculateAverageScore(filteredData, 'soreness_composite')
  const biomarkersScore = calculateAverageScore(filteredData, 'bio_composite')
  
  // Prepare charts data - recovery trend over time
  const recoveryTrendData = prepareRecoveryTrendData(filteredData)
  
  // Prepare radar chart data
  const radarData = [
    { subject: 'Overall', value: normalizeScore(overallScore) },
    { subject: 'Sleep', value: normalizeScore(sleepScore) },
    { subject: 'Soreness', value: normalizeScore(sorenessScore) },
    { subject: 'Biomarkers', value: normalizeScore(biomarkersScore) },
    { subject: 'MSK Joint', value: normalizeScore(calculateAverageScore(filteredData, 'msk_joint_range_composite')) },
    { subject: 'MSK Load', value: normalizeScore(calculateAverageScore(filteredData, 'msk_load_tolerance_composite')) }
  ]
  
  // Prepare pie chart data for recovery status
  const recoveryStatusData = [
    { name: 'Optimal', value: calculateRecoveryStatusPercentage(filteredData, 0.5, 1) },
    { name: 'Good', value: calculateRecoveryStatusPercentage(filteredData, 0, 0.5) },
    { name: 'Fair', value: calculateRecoveryStatusPercentage(filteredData, -0.5, 0) },
    { name: 'Poor', value: calculateRecoveryStatusPercentage(filteredData, -1, -0.5) }
  ]
  
  // Colors
  const COLORS = ['#4CAF50', '#2196F3', '#FFC107', '#FF5722']
  
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
  
  return (
    <div className="space-y-8">
      {/* TimeFrame Selector */}
      <div className="flex justify-center space-x-2">
        <button 
          className={`px-4 py-2 rounded-md text-sm ${timeFrame === '7days' ? 'bg-[#1E54B7] text-white' : 'bg-gray-800 text-white'}`}
          onClick={() => handleTimeFrameChange('7days')}
        >
          7 Days
        </button>
        <button 
          className={`px-4 py-2 rounded-md text-sm ${timeFrame === '30days' ? 'bg-[#1E54B7] text-white' : 'bg-gray-800 text-white'}`}
          onClick={() => handleTimeFrameChange('30days')}
        >
          30 Days
        </button>
        <button 
          className={`px-4 py-2 rounded-md text-sm ${timeFrame === '90days' ? 'bg-[#1E54B7] text-white' : 'bg-gray-800 text-white'}`}
          onClick={() => handleTimeFrameChange('90days')}
        >
          90 Days
        </button>
      </div>
      
      {/* Recovery Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-900 bg-opacity-70 backdrop-blur-sm p-6 rounded-lg border border-gray-800">
          <div className="flex items-center">
            <h3 className="text-lg font-medium text-white mb-2">Overall Recovery</h3>
            <InfoTooltip text="Composite score of all recovery metrics" />
          </div>
          <p className="text-3xl font-bold text-[#1E54B7]">{normalizeScore(overallScore).toFixed(1)}%</p>
          <p className="text-gray-400 text-sm mt-2">{getRecoveryStatusText(overallScore)}</p>
        </div>
        
        <div className="bg-gray-900 bg-opacity-70 backdrop-blur-sm p-6 rounded-lg border border-gray-800">
          <div className="flex items-center">
            <h3 className="text-lg font-medium text-white mb-2">Sleep Quality</h3>
            <InfoTooltip text="Sleep quality metrics including duration and efficiency" />
          </div>
          <p className="text-3xl font-bold text-[#1E54B7]">{normalizeScore(sleepScore).toFixed(1)}%</p>
          <p className="text-gray-400 text-sm mt-2">{getRecoveryStatusText(sleepScore)}</p>
        </div>
        
        <div className="bg-gray-900 bg-opacity-70 backdrop-blur-sm p-6 rounded-lg border border-gray-800">
          <div className="flex items-center">
            <h3 className="text-lg font-medium text-white mb-2">Soreness Level</h3>
            <InfoTooltip text="Muscle soreness and pain indicators" />
          </div>
          <p className="text-3xl font-bold text-[#1E54B7]">{normalizeScore(sorenessScore).toFixed(1)}%</p>
          <p className="text-gray-400 text-sm mt-2">{getRecoveryStatusText(sorenessScore)}</p>
        </div>
        
        <div className="bg-gray-900 bg-opacity-70 backdrop-blur-sm p-6 rounded-lg border border-gray-800">
          <div className="flex items-center">
            <h3 className="text-lg font-medium text-white mb-2">Biomarkers</h3>
            <InfoTooltip text="Internal biochemical indicators of recovery status" />
          </div>
          <p className="text-3xl font-bold text-[#1E54B7]">{normalizeScore(biomarkersScore).toFixed(1)}%</p>
          <p className="text-gray-400 text-sm mt-2">{getRecoveryStatusText(biomarkersScore)}</p>
        </div>
      </div>
      
      {/* Visual Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-gray-900 bg-opacity-70 backdrop-blur-sm p-6 rounded-lg border border-gray-800">
          <h3 className="text-xl font-medium text-white mb-4">Recovery Trend</h3>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart
              data={recoveryTrendData}
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
              <Legend wrapperStyle={{ color: '#ccc' }} />
              <Line 
                type="monotone" 
                dataKey="overall" 
                name="Overall" 
                stroke="#1E54B7" 
                strokeWidth={2} 
                dot={{ r: 4 }}
                activeDot={{ r: 8 }}
              />
              <Line 
                type="monotone" 
                dataKey="sleep" 
                name="Sleep" 
                stroke="#4CAF50" 
                strokeWidth={1.5} 
                dot={{ r: 3 }}
              />
              <Line 
                type="monotone" 
                dataKey="soreness" 
                name="Soreness" 
                stroke="#FFC107" 
                strokeWidth={1.5} 
                dot={{ r: 3 }}
              />
              <Line 
                type="monotone" 
                dataKey="bio" 
                name="Biomarkers" 
                stroke="#FF5722" 
                strokeWidth={1.5} 
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="bg-gray-900 bg-opacity-70 backdrop-blur-sm p-6 rounded-lg border border-gray-800">
          <h3 className="text-xl font-medium text-white mb-4">Recovery Profile</h3>
          <div className="h-[350px] flex flex-col md:flex-row items-center justify-center">
            <div className="w-full h-[250px] mb-4 md:mb-0 md:w-1/2">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid stroke="#444" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#ccc' }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#ccc' }} />
                  <Radar
                    name="Recovery"
                    dataKey="value"
                    stroke="#1E54B7"
                    fill="#1E54B7"
                    fillOpacity={0.6}
                  />
                  <Tooltip formatter={(value) => [`${parseInt(value.toString())}%`, 'Score']} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="w-full md:w-1/2 h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={recoveryStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {recoveryStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value.toFixed(1)}%`, 'Percentage']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recommendations */}
      <div className="bg-gray-900 bg-opacity-70 backdrop-blur-sm p-6 rounded-lg border border-gray-800">
        <h3 className="text-xl font-medium text-white mb-4">Recovery Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-medium text-white mb-3">Based on Current Status</h4>
            <div className="space-y-4">
              {generateRecoveryRecommendations(overallScore, sleepScore, sorenessScore, biomarkersScore).map((rec, index) => (
                <div key={index} className="flex items-start">
                  <div className="h-5 w-5 mt-0.5 flex-shrink-0">
                    <div className="h-2 w-2 rounded-full bg-[#1E54B7]"></div>
                  </div>
                  <p className="ml-2 text-sm text-gray-300">{rec}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-medium text-white mb-3">Focus Areas</h4>
            <div className="space-y-4">
              {generateFocusAreas(radarData).map((area, index) => (
                <div key={index} className="bg-gray-800 p-3 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h5 className="text-white text-sm font-medium">{area.subject} Focus</h5>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      area.value >= 80 ? 'bg-green-500/20 text-green-300' :
                      area.value >= 60 ? 'bg-blue-500/20 text-blue-300' :
                      area.value >= 40 ? 'bg-yellow-500/20 text-yellow-300' :
                      'bg-red-500/20 text-red-300'
                    }`}>
                      {area.value >= 80 ? 'Excellent' :
                       area.value >= 60 ? 'Good' :
                       area.value >= 40 ? 'Fair' :
                       'Poor'}
                    </span>
                  </div>
                  <p className="text-gray-400 text-xs">{generateFocusAreaText(area.subject, area.value)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Functions
function filterDataByTimeframe(data: any[], timeFrame: string): any[] {
  if (!data || data.length === 0) return []
  
  const now = new Date()
  let startDate: Date
  
  switch (timeFrame) {
    case '7days':
      startDate = new Date(now)
      startDate.setDate(now.getDate() - 7)
      break
    case '30days':
      startDate = new Date(now)
      startDate.setDate(now.getDate() - 30)
      break
    case '90days':
      startDate = new Date(now)
      startDate.setDate(now.getDate() - 90)
      break
    default:
      startDate = new Date(now)
      startDate.setDate(now.getDate() - 30)
  }
  
  return data.filter(item => {
    if (!item.date) return false
    const itemDate = new Date(item.date)
    return itemDate >= startDate && itemDate <= now
  })
}

function calculateAverageScore(data: any[], field: string): number {
  if (!data || data.length === 0) return 0
  
  const validScores = data
    .map(item => item[field])
    .filter(score => score !== undefined && score !== null) as number[]
  
  if (validScores.length === 0) return 0
  
  return validScores.reduce((sum, score) => sum + score, 0) / validScores.length
}

function normalizeScore(score: number): number {
  // Convert from -1 to 1 scale to 0-100 scale
  return ((score + 1) / 2) * 100
}

function getRecoveryStatusText(score: number): string {
  const normalizedScore = normalizeScore(score)
  
  if (normalizedScore >= 80) return 'Optimal'
  if (normalizedScore >= 60) return 'Good'
  if (normalizedScore >= 40) return 'Fair'
  return 'Poor'
}

function prepareRecoveryTrendData(data: any[]): any[] {
  if (!data || data.length === 0) return []
  
  // Sort by date
  const sortedData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  
  // Convert to trend format
  return sortedData.map(item => ({
    date: new Date(item.date).toLocaleDateString(),
    overall: normalizeScore(item.emboss_baseline_score || 0),
    sleep: normalizeScore(item.sleep_composite || 0),
    soreness: normalizeScore(item.soreness_composite || 0),
    bio: normalizeScore(item.bio_composite || 0)
  }))
}

function calculateRecoveryStatusPercentage(data: any[], min: number, max: number): number {
  if (!data || data.length === 0) return 0
  
  const scores = data
    .map(item => item.emboss_baseline_score)
    .filter(score => score !== undefined && score !== null) as number[]
  
  if (scores.length === 0) return 0
  
  const inRange = scores.filter(score => score >= min && score <= max).length
  return (inRange / scores.length) * 100
}

function generateRecoveryRecommendations(
  overallScore: number,
  sleepScore: number,
  sorenessScore: number,
  biomarkersScore: number
): string[] {
  const recommendations: string[] = []
  
  // Normalize scores
  const normalizedOverall = normalizeScore(overallScore)
  const normalizedSleep = normalizeScore(sleepScore)
  const normalizedSoreness = normalizeScore(sorenessScore)
  const normalizedBio = normalizeScore(biomarkersScore)
  
  // General recommendations
  if (normalizedOverall < 60) {
    recommendations.push('Consider reducing training load temporarily to prioritize recovery')
  }
  
  // Sleep recommendations
  if (normalizedSleep < 70) {
    recommendations.push('Implement sleep hygiene protocols: regular sleep schedule, limit screen time before bed, optimize sleeping environment')
  }
  if (normalizedSleep < 50) {
    recommendations.push('Prioritize 8+ hours of sleep and consider sleep tracking to identify disruption patterns')
  }
  
  // Soreness recommendations
  if (normalizedSoreness < 70) {
    recommendations.push('Implement recovery strategies: foam rolling, light mobility work, and contrast therapy')
  }
  if (normalizedSoreness < 50) {
    recommendations.push('Schedule massage therapy session and consider reducing eccentric loading in training')
  }
  
  // Biomarker recommendations
  if (normalizedBio < 70) {
    recommendations.push('Focus on nutrition quality and hydration status to support recovery')
  }
  if (normalizedBio < 50) {
    recommendations.push('Consider nutritional assessment and supplementation review')
  }
  
  // Ensure we have at least some recommendations
  if (recommendations.length === 0) {
    recommendations.push('Maintain current recovery protocols - all metrics are in good range')
    recommendations.push('Continue with regular monitoring and adjust training load based on recovery status')
  }
  
  return recommendations
}

function generateFocusAreas(radarData: any[]): any[] {
  // Sort by value (ascending) to prioritize lowest scores
  return [...radarData].sort((a, b) => a.value - b.value).slice(0, 3)
}

function generateFocusAreaText(subject: string, value: number): string {
  switch (subject) {
    case 'Sleep':
      return value < 60 ? 
        'Prioritize sleep quality and duration to improve recovery capacity.' : 
        'Maintain consistent sleep schedule to support optimal recovery.'
    case 'Soreness':
      return value < 60 ? 
        'Implement targeted soft tissue work and anti-inflammatory strategies.' : 
        'Continue monitoring soreness levels and adjust training accordingly.'
    case 'Biomarkers':
      return value < 60 ? 
        'Focus on nutrition quality and hydration to improve internal recovery markers.' : 
        'Maintain nutritional strategies to support metabolic recovery.'
    case 'MSK Joint':
      return value < 60 ? 
        'Implement joint mobility protocols to improve range of motion and function.' : 
        'Continue maintenance mobility work to support joint health.'
    case 'MSK Load':
      return value < 60 ? 
        'Focus on progressively building load tolerance with structured loading protocols.' : 
        'Maintain current load management strategies for optimal tissue resilience.'
    case 'Overall':
      return value < 60 ? 
        'Take a holistic approach to recovery by addressing all contributing factors.' : 
        'Maintain balance across all recovery domains for optimal performance.'
    default:
      return 'Monitor and maintain recovery protocols for optimal performance.'
  }
}
