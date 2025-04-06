"use client"

import { useState, useEffect } from "react"
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer, AreaChart, Area, 
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  BarChart, Bar, Cell, PieChart, Pie
} from 'recharts'
import { fetchRecoveryData, calculateAverageRecoveryScores } from "../utils/recovery-data"

interface RecoveryMetricsDisplayProps {
  recoveryData: any[];
  initialTimeFrame: '7days' | '30days' | '90days';
  onTimeFrameChange: (timeFrame: '7days' | '30days' | '90days') => void;
}

export function RecoveryMetricsDisplay({ 
  recoveryData, 
  initialTimeFrame, 
  onTimeFrameChange 
}: RecoveryMetricsDisplayProps) {
  const [timeRange, setTimeRange] = useState<'7days' | '30days' | '90days'>(initialTimeFrame)
  const [averageMetrics, setAverageMetrics] = useState({
    overall: 0,
    sleep: 0,
    soreness: 0,
    subjective: 0,
    bio: 0
  })
  
  // Update parent component when time range changes
  const handleTimeRangeChange = (newRange: '7days' | '30days' | '90days') => {
    setTimeRange(newRange);
    onTimeFrameChange(newRange);
  };
  
  useEffect(() => {
    if (recoveryData.length > 0) {
      updateMetrics(recoveryData, timeRange)
    }
  }, [timeRange, recoveryData])
  
  const updateMetrics = (data: any[], range: string) => {
    const now = new Date()
    let startDate: Date
    
    // Calculate start date based on range
    switch (range) {
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
        startDate.setDate(now.getDate() - 7)
    }
    
    // Filter data within range
    const filteredData = data.filter(item => {
      const itemDate = new Date(item.date)
      return itemDate >= startDate && itemDate <= now
    })
    
    // Get average metrics
    const averages = calculateAverageRecoveryScores(filteredData)
    setAverageMetrics(averages)
  }
  
  // Prepare trend data
  const prepareTrendData = () => {
    const now = new Date()
    let startDate: Date
    
    // Calculate start date based on range
    switch (timeRange) {
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
        startDate.setDate(now.getDate() - 7)
    }
    
    // Filter data within range and sort by date
    const filteredData = recoveryData
      .filter(item => {
        const itemDate = new Date(item.date)
        return itemDate >= startDate && itemDate <= now
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    
    // Skip some points to avoid overcrowding the chart
    const skipFactor = filteredData.length > 30 ? Math.floor(filteredData.length / 30) : 1
    const sampledData = filteredData.filter((_, index) => index % skipFactor === 0)
    
    // Map to chart format
    return sampledData.map(item => ({
      date: new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      overall: Math.round(((item.emboss_baseline_score + 1) / 2) * 100),
      sleep: Math.round(((item.sleep_composite + 1) / 2) * 100),
      soreness: Math.round(((item.soreness_composite + 1) / 2) * 100),
      mskJoint: Math.round(((item.msk_joint_range_composite + 1) / 2) * 100),
      mskLoad: Math.round(((item.msk_load_tolerance_composite + 1) / 2) * 100),
    }))
  }
  
  // Prepare radar data to show all recovery dimensions at once
  const prepareRecoveryRadarData = () => {
    const now = new Date()
    let startDate: Date
    
    // Calculate start date based on range
    switch (timeRange) {
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
        startDate.setDate(now.getDate() - 7)
    }
    
    // Filter data within the range
    const filteredData = recoveryData.filter(item => {
      const itemDate = new Date(item.date)
      return itemDate >= startDate && itemDate <= now
    })
    
    // If no data, return empty array
    if (filteredData.length === 0) return []
    
    // Helper function to safely calculate average
    const calculateSafeAverage = (data: any[], propPath: string) => {
      const values = data.filter(item => {
        const value = item[propPath];
        return value !== undefined && value !== null;
      }).map(item => ((item[propPath] + 1) / 2) * 100);
      
      return values.length ? Math.round(values.reduce((sum, val) => sum + val, 0) / values.length) : 0;
    };
    
    // Calculate averages for all recovery dimensions
    const sleepAvg = calculateSafeAverage(filteredData, 'sleep_composite');
    const sorenessAvg = calculateSafeAverage(filteredData, 'soreness_composite');
    const mskJointAvg = calculateSafeAverage(filteredData, 'msk_joint_range_composite');
    const mskLoadAvg = calculateSafeAverage(filteredData, 'msk_load_tolerance_composite');
    const stressAvg = calculateSafeAverage(filteredData, 'stress_load_composite');
    const mentalAvg = calculateSafeAverage(filteredData, 'subjective_composite');
    
    // Return radar data format
    return [
      { dimension: 'Sleep', value: sleepAvg },
      { dimension: 'Soreness', value: sorenessAvg },
      { dimension: 'Joint Range', value: mskJointAvg },
      { dimension: 'Load Tolerance', value: mskLoadAvg },
      { dimension: 'Stress', value: stressAvg },
      { dimension: 'Mental', value: mentalAvg }
    ]
  }
  
  // Prepare weekly comparison data
  const prepareWeeklyComparisonData = () => {
    const now = new Date()
    const oneWeekAgo = new Date(now)
    oneWeekAgo.setDate(now.getDate() - 7)
    const twoWeeksAgo = new Date(now)
    twoWeeksAgo.setDate(now.getDate() - 14)
    
    // Filter data for current week
    const currentWeekData = recoveryData.filter(item => {
      const itemDate = new Date(item.date)
      return itemDate >= oneWeekAgo && itemDate <= now
    })
    
    // Filter data for previous week
    const previousWeekData = recoveryData.filter(item => {
      const itemDate = new Date(item.date)
      return itemDate >= twoWeeksAgo && itemDate < oneWeekAgo
    })
    
    // Helper function to safely calculate average with proper normalization
    const calculateSafeAverage = (data: any[], propPath: string) => {
      const values = data
        .filter(item => item[propPath] !== undefined && item[propPath] !== null)
        .map(item => {
          // Normalize from [-1,1] to [0,100] scale
          return ((item[propPath] + 1) / 2) * 100
        });
      
      return values.length ? values.reduce((sum, val) => sum + val, 0) / values.length : 0;
    };
    
    // Calculate metrics for both weeks
    const metrics = [
      {
        name: 'Sleep Quality',
        propPath: 'sleep_composite',
        current: calculateSafeAverage(currentWeekData, 'sleep_composite'),
        previous: calculateSafeAverage(previousWeekData, 'sleep_composite')
      },
      {
        name: 'Muscle Soreness',
        propPath: 'soreness_composite',
        current: calculateSafeAverage(currentWeekData, 'soreness_composite'),
        previous: calculateSafeAverage(previousWeekData, 'soreness_composite')
      },
      {
        name: 'Overall Recovery',
        propPath: 'emboss_baseline_score',
        current: calculateSafeAverage(currentWeekData, 'emboss_baseline_score'),
        previous: calculateSafeAverage(previousWeekData, 'emboss_baseline_score')
      },
      {
        name: 'Mental State',
        propPath: 'subjective_composite',
        current: calculateSafeAverage(currentWeekData, 'subjective_composite'),
        previous: calculateSafeAverage(previousWeekData, 'subjective_composite')
      }
    ];
    
    // Add change calculation and round values
    return metrics.map(item => ({
      name: item.name,
      current: Math.round(item.current),
      previous: Math.round(item.previous),
      change: Math.round((item.current - item.previous) * 10) / 10
    }));
  }
  
  const trendData = prepareTrendData()
  const radarData = prepareRecoveryRadarData()
  const weeklyComparisonData = prepareWeeklyComparisonData()
  
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
      
      {/* Recovery Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-900 bg-opacity-70 backdrop-blur-sm p-6 rounded-lg border border-gray-800">
          <h3 className="text-lg font-medium text-white mb-2">Recovery Score</h3>
          <div className="flex items-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center border-4 border-[#1E54B7] mr-3">
              <span className="text-2xl font-bold text-white">{Math.round(averageMetrics.overall)}</span>
            </div>
            <div>
              <p className="text-gray-400 text-sm">{timeRange === '7days' ? '7-day' : timeRange === '30days' ? '30-day' : '90-day'} average</p>
              <p className="text-[#1E54B7] text-sm">Overall wellness</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-900 bg-opacity-70 backdrop-blur-sm p-6 rounded-lg border border-gray-800">
          <h3 className="text-lg font-medium text-white mb-2">Sleep Quality</h3>
          <div className="flex items-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center border-4 border-[#1E54B7] mr-3">
              <span className="text-2xl font-bold text-white">{Math.round(averageMetrics.sleep)}</span>
            </div>
            <div>
              <p className="text-gray-400 text-sm">{timeRange === '7days' ? '7-day' : timeRange === '30days' ? '30-day' : '90-day'} average</p>
              <p className="text-[#1E54B7] text-sm">Sleep composite</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-900 bg-opacity-70 backdrop-blur-sm p-6 rounded-lg border border-gray-800">
          <h3 className="text-lg font-medium text-white mb-2">Muscle Readiness</h3>
          <div className="flex items-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center border-4 border-[#1E54B7] mr-3">
              <span className="text-2xl font-bold text-white">{Math.round(averageMetrics.soreness)}</span>
            </div>
            <div>
              <p className="text-gray-400 text-sm">{timeRange === '7days' ? '7-day' : timeRange === '30days' ? '30-day' : '90-day'} average</p>
              <p className="text-[#1E54B7] text-sm">Soreness score</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-900 bg-opacity-70 backdrop-blur-sm p-6 rounded-lg border border-gray-800">
          <h3 className="text-lg font-medium text-white mb-2">Mental Readiness</h3>
          <div className="flex items-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center border-4 border-[#1E54B7] mr-3">
              <span className="text-2xl font-bold text-white">{Math.round(averageMetrics.subjective)}</span>
            </div>
            <div>
              <p className="text-gray-400 text-sm">{timeRange === '7days' ? '7-day' : timeRange === '30days' ? '30-day' : '90-day'} average</p>
              <p className="text-[#1E54B7] text-sm">Subjective score</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recovery Trend Chart */}
      {trendData.length > 0 && (
        <div className="bg-gray-900 bg-opacity-70 backdrop-blur-sm p-6 rounded-lg border border-gray-800">
          <h3 className="text-xl font-medium text-white mb-4">Recovery Trends</h3>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart
              data={trendData}
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
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151' }}
                labelStyle={{ color: 'white' }}
              />
              <Legend wrapperStyle={{ color: '#ccc' }} />
              <Area 
                type="monotone" 
                dataKey="overall" 
                name="Overall" 
                stroke="#1E54B7" 
                fill="#1E54B7" 
                fillOpacity={0.3}
                activeDot={{ r: 8 }}
              />
              <Area 
                type="monotone" 
                dataKey="sleep" 
                name="Sleep" 
                stroke="#0CAFFF" 
                fill="#0CAFFF" 
                fillOpacity={0.3}
                activeDot={{ r: 6 }}
              />
              <Area 
                type="monotone" 
                dataKey="soreness" 
                name="Soreness" 
                stroke="#4CAF50" 
                fill="#4CAF50" 
                fillOpacity={0.3}
                activeDot={{ r: 6 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
      
      {/* Add additional charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recovery Dimensions Radar Chart */}
        {radarData.length > 0 && (
          <div className="bg-gray-900 bg-opacity-70 backdrop-blur-sm p-6 rounded-lg border border-gray-800">
            <h3 className="text-xl font-medium text-white mb-4">Recovery Profile</h3>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#444" />
                <PolarAngleAxis dataKey="dimension" tick={{ fill: '#ccc' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#ccc' }} />
                <Radar
                  name="Recovery Score"
                  dataKey="value"
                  stroke="#1E54B7"
                  fill="#1E54B7"
                  fillOpacity={0.5}
                />
                <Tooltip formatter={(value) => [`${Math.round(value)}%`, 'Score']} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        )}
        
        {/* Weekly Comparison Chart */}
        {weeklyComparisonData.length > 0 && (
          <div className="bg-gray-900 bg-opacity-70 backdrop-blur-sm p-6 rounded-lg border border-gray-800">
            <h3 className="text-xl font-medium text-white mb-4">Week-on-Week Comparison</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={weeklyComparisonData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#333" />
                <XAxis type="number" domain={[0, 100]} tick={{ fill: '#ccc' }} />
                <YAxis dataKey="name" type="category" tick={{ fill: '#ccc' }} width={100} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151' }}
                  labelStyle={{ color: 'white' }}
                  formatter={(value) => [`${value}%`, 'Score']}
                />
                <Legend wrapperStyle={{ color: '#ccc' }} />
                <Bar 
                  dataKey="current" 
                  name="Current Week" 
                  fill="#1E54B7" 
                  barSize={20}
                />
                <Bar 
                  dataKey="previous" 
                  name="Previous Week" 
                  fill="#0CAFFF" 
                  barSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
            
            {/* Weekly Change Indicators */}
            <div className="mt-4 space-y-2">
              {weeklyComparisonData.map((item, index) => (
                <div key={index} className="flex justify-between items-center px-2 py-1 bg-gray-800 bg-opacity-40 rounded">
                  <span className="text-sm text-gray-300">{item.name}</span>
                  <div className="flex items-center">
                    <span className={`text-sm font-medium ${
                      item.change > 0 ? 'text-green-400' : 
                      item.change < 0 ? 'text-red-400' : 
                      'text-gray-400'
                    }`}>
                      {item.change > 0 ? '+' : ''}{item.change}%
                    </span>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 24 24" 
                      className={`w-4 h-4 ml-1 ${
                        item.change > 0 ? 'text-green-400' : 
                        item.change < 0 ? 'text-red-400' : 
                        'text-gray-400'
                      }`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      {item.change > 0 ? (
                        <path d="M12 19V5M5 12l7-7 7 7" />
                      ) : item.change < 0 ? (
                        <path d="M12 5v14M5 12l7 7 7-7" />
                      ) : (
                        <path d="M5 12h14" />
                      )}
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}