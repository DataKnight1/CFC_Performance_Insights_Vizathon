"use client"

import { useState, useEffect } from "react"
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer, LineChart, Line, Area, 
  AreaChart, ComposedChart
} from 'recharts'
import type { PlayerData } from "../utils/player-data"

interface PlayerLoadVisualizationProps {
  data: PlayerData[]
  player: string
}

export function PlayerLoadVisualization({ data, player }: PlayerLoadVisualizationProps) {
  const [chartData, setChartData] = useState<{ name: string; minutes: number; games: number }[]>([])
  const [chartType, setChartType] = useState<'bar' | 'line' | 'area' | 'composed'>('bar')
  const [showTotal, setShowTotal] = useState(false)

  useEffect(() => {
    // Filter and prepare data for visualization
    if (player && player !== "All Players") {
      // Filter data for the selected player
      const playerData = data.filter((item) => item.player === player)

      if (playerData.length > 0) {
        // Map seasons to minutes for the selected player
        const seasonData = playerData.map((item) => ({
          name: item.season,
          minutes: Number.parseInt(item.minutes) || 0,
          games: Number.parseInt(item.games) || 0,
        }))

        // Sort by season
        seasonData.sort((a, b) => a.name.localeCompare(b.name))

        setChartData(seasonData)
      } else {
        console.log(`No data found for player: ${player}`)
        setChartData([])
      }
    } else {
      // If no specific player is selected, show top 10 players by minutes
      const playerStats: Record<string, { minutes: number, games: number }> = {}

      // Sum minutes and games for each player
      data.forEach((item) => {
        if (item.player) {
          if (!playerStats[item.player]) {
            playerStats[item.player] = { minutes: 0, games: 0 }
          }
          playerStats[item.player].minutes += Number.parseInt(item.minutes) || 0
          playerStats[item.player].games += Number.parseInt(item.games) || 0
        }
      })

      // Convert to array and sort
      const topPlayers = Object.entries(playerStats)
        .sort((a, b) => b[1].minutes - a[1].minutes)
        .slice(0, 10)
        .map(([player, stats]) => ({ 
          name: player, 
          minutes: stats.minutes,
          games: stats.games
        }))

      setChartData(topPlayers)
    }
  }, [data, player])

  // Calculate totals
  const totalMinutes = chartData.reduce((sum, item) => sum + item.minutes, 0)
  const totalGames = chartData.reduce((sum, item) => sum + item.games, 0)
  const averageMinutesPerGame = totalGames > 0 ? Math.round(totalMinutes / totalGames) : 0

  // Define color palette
  const primaryColor = "#1E54B7" // Chelsea blue
  const secondaryColor = "#0CAFFF"
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 p-3 border border-gray-700 rounded shadow-lg">
          <p className="text-white font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value.toLocaleString()} {entry.name === 'minutes' ? 'min' : ''}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Render different chart types
  const renderChart = () => {
    switch (chartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart
              data={chartData}
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
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ color: '#ccc' }} />
              <Bar dataKey="minutes" name="Minutes" fill={primaryColor} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={350}>
            <LineChart
              data={chartData}
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
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ color: '#ccc' }} />
              <Line 
                type="monotone" 
                dataKey="minutes" 
                name="Minutes" 
                stroke={primaryColor} 
                activeDot={{ r: 8 }}
                strokeWidth={2} 
              />
              <Line 
                type="monotone" 
                dataKey="games" 
                name="Games" 
                stroke={secondaryColor} 
                activeDot={{ r: 6 }}
                strokeWidth={2} 
              />
            </LineChart>
          </ResponsiveContainer>
        );
      
      case 'area':
        return (
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart
              data={chartData}
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
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ color: '#ccc' }} />
              <Area 
                type="monotone" 
                dataKey="minutes" 
                name="Minutes" 
                stroke={primaryColor} 
                fill={`${primaryColor}80`} 
              />
            </AreaChart>
          </ResponsiveContainer>
        );
      
      case 'composed':
        return (
          <ResponsiveContainer width="100%" height={350}>
            <ComposedChart
              data={chartData}
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
                yAxisId="left"
              />
              <YAxis 
                tick={{ fill: '#ccc' }} 
                axisLine={{ stroke: '#666' }}
                orientation="right" 
                yAxisId="right"
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ color: '#ccc' }} />
              <Bar 
                dataKey="minutes" 
                name="Minutes" 
                fill={primaryColor} 
                radius={[4, 4, 0, 0]} 
                yAxisId="left"
              />
              <Line 
                type="monotone" 
                dataKey="games" 
                name="Games" 
                stroke={secondaryColor} 
                strokeWidth={2} 
                yAxisId="right"
              />
            </ComposedChart>
          </ResponsiveContainer>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-900 bg-opacity-70 backdrop-blur-sm p-6 rounded-lg border border-gray-800">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <h3 className="text-xl font-medium text-white">
          {player && player !== "All Players" ? `Minutes by Season for ${player}` : "Top Players by Minutes"}
        </h3>
        
        <div className="flex space-x-2 mt-3 md:mt-0">
          <select 
            className="bg-gray-800 text-white border border-gray-700 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E54B7]"
            value={chartType}
            onChange={(e) => setChartType(e.target.value as 'bar' | 'line' | 'area' | 'composed')}
          >
            <option value="bar">Bar Chart</option>
            <option value="line">Line Chart</option>
            <option value="area">Area Chart</option>
            <option value="composed">Combined Chart</option>
          </select>
          
          <button 
            className={`px-3 py-1 text-sm rounded-md ${showTotal ? 'bg-[#1E54B7] text-white' : 'bg-gray-800 text-white'}`}
            onClick={() => setShowTotal(!showTotal)}
          >
            {showTotal ? 'Hide Totals' : 'Show Totals'}
          </button>
        </div>
      </div>

      {chartData.length > 0 ? (
        <>
          {renderChart()}
          
          {showTotal && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-800 p-4 rounded-lg">
                <p className="text-gray-400 text-sm mb-1">Total Minutes</p>
                <p className="text-2xl font-bold text-white">{totalMinutes.toLocaleString()}</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <p className="text-gray-400 text-sm mb-1">Total Games</p>
                <p className="text-2xl font-bold text-white">{totalGames}</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <p className="text-gray-400 text-sm mb-1">Minutes per Game</p>
                <p className="text-2xl font-bold text-white">{averageMinutesPerGame}</p>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="flex items-center justify-center h-[350px] text-gray-400">
          No data available for this player
        </div>
      )}
    </div>
  )
}

