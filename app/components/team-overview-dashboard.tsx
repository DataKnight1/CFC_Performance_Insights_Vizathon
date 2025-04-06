"use client"

import { useState, useEffect } from "react"
import type { PlayerData } from "../utils/player-data"
import { InfoTooltip } from "./info-tooltip"

interface TeamOverviewDashboardProps {
  data: PlayerData[]
}

export function TeamOverviewDashboard({ data }: TeamOverviewDashboardProps) {
  const [positionDistribution, setPositionDistribution] = useState<{ position: string; count: number }[]>([])
  const [ageDistribution, setAgeDistribution] = useState<{ ageGroup: string; count: number }[]>([])
  const [topPlayers, setTopPlayers] = useState<{ player: string; minutes: number }[]>([])
  const [totalStats, setTotalStats] = useState({
    players: 0,
    totalMinutes: 0,
    totalGames: 0,
    avgAge: 0,
  })

  useEffect(() => {
    if (data.length > 0) {
      // Calculate position distribution
      const positions: Record<string, number> = {}
      data.forEach((player) => {
        if (player.position) {
          positions[player.position] = (positions[player.position] || 0) + 1
        }
      })

      const positionData = Object.entries(positions)
        .map(([position, count]) => ({ position, count }))
        .sort((a, b) => b.count - a.count)

      setPositionDistribution(positionData)

      // Calculate age distribution
      const ages: Record<string, number> = {
        "Under 20": 0,
        "20-23": 0,
        "24-27": 0,
        "28-31": 0,
        "32+": 0,
      }

      data.forEach((player) => {
        const age = Number.parseInt(player.age) || 0
        if (age < 20) ages["Under 20"]++
        else if (age < 24) ages["20-23"]++
        else if (age < 28) ages["24-27"]++
        else if (age < 32) ages["28-31"]++
        else ages["32+"]++
      })

      const ageData = Object.entries(ages).map(([ageGroup, count]) => ({ ageGroup, count }))

      setAgeDistribution(ageData)

      // Calculate top players by minutes
      const playerMinutes: Record<string, number> = {}

      data.forEach((player) => {
        if (player.player && player.minutes) {
          playerMinutes[player.player] = (playerMinutes[player.player] || 0) + (Number.parseInt(player.minutes) || 0)
        }
      })

      const topPlayersList = Object.entries(playerMinutes)
        .map(([player, minutes]) => ({ player, minutes }))
        .sort((a, b) => b.minutes - a.minutes)
        .slice(0, 5) // Show only top 5 players

      setTopPlayers(topPlayersList)

      // Calculate total stats
      const uniquePlayers = new Set(data.map((player) => player.player))
      const totalMinutes = data.reduce((sum, player) => sum + (Number.parseInt(player.minutes) || 0), 0)
      const totalGames = data.reduce((sum, player) => sum + (Number.parseInt(player.games) || 0), 0)
      const totalAge = data.reduce((sum, player) => sum + (Number.parseInt(player.age) || 0), 0)
      const avgAge = totalAge / data.length

      setTotalStats({
        players: uniquePlayers.size,
        totalMinutes,
        totalGames,
        avgAge: Math.round(avgAge * 10) / 10,
      })
    }
  }, [data])

  // Define blue color palette
  const blueColors = [
    "#0078D7", // Microsoft Blue
    "#1E90FF", // Dodger Blue
    "#4169E1", // Royal Blue
    "#00BFFF", // Deep Sky Blue
    "#87CEEB", // Sky Blue
  ]

  return (
    <div className="space-y-8">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-900 bg-opacity-70 backdrop-blur-sm p-6 rounded-lg border border-gray-800">
          <h3 className="text-lg font-medium text-white mb-2">Total Players</h3>
          <p className="text-4xl font-bold text-[#00BFFF]">{totalStats.players}</p>
          <p className="text-gray-400 text-sm mt-2">In database</p>
        </div>

        <div className="bg-gray-900 bg-opacity-70 backdrop-blur-sm p-6 rounded-lg border border-gray-800">
          <h3 className="text-lg font-medium text-white mb-2">Total Minutes</h3>
          <p className="text-4xl font-bold text-[#00BFFF]">{totalStats.totalMinutes.toLocaleString()}</p>
          <p className="text-gray-400 text-sm mt-2">All players combined</p>
        </div>

        <div className="bg-gray-900 bg-opacity-70 backdrop-blur-sm p-6 rounded-lg border border-gray-800">
          <h3 className="text-lg font-medium text-white mb-2">Total Games</h3>
          <p className="text-4xl font-bold text-[#00BFFF]">{totalStats.totalGames.toLocaleString()}</p>
          <p className="text-gray-400 text-sm mt-2">All appearances</p>
        </div>

        <div className="bg-gray-900 bg-opacity-70 backdrop-blur-sm p-6 rounded-lg border border-gray-800">
          <h3 className="text-lg font-medium text-white mb-2">Average Age</h3>
          <p className="text-4xl font-bold text-[#00BFFF]">{totalStats.avgAge}</p>
          <p className="text-gray-400 text-sm mt-2">Team average</p>
        </div>
      </div>

      {/* Top Players & Position Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Players by Minutes */}
        <div className="bg-gray-900 bg-opacity-70 backdrop-blur-sm p-6 rounded-lg border border-gray-800">
          <div className="flex items-center mb-4">
            <h3 className="text-xl font-medium text-white">Top Players by Minutes</h3>
            <InfoTooltip text="Players with the most minutes played across all seasons." />
          </div>

          <div className="flex flex-col">
            {/* Players list with bars */}
            <div className="space-y-4">
              {topPlayers.map((item, index) => {
                const maxMinutes = Math.max(...topPlayers.map((d) => d.minutes), 1)
                const widthPercentage = (item.minutes / maxMinutes) * 100

                return (
                  <div key={index} className="flex items-center">
                    <div
                      className="w-4 h-4 rounded-sm mr-2"
                      style={{ backgroundColor: blueColors[index % blueColors.length] }}
                    ></div>
                    <div className="w-32">
                      <div className="text-sm text-white font-medium truncate" title={item.player}>
                        {item.player}
                      </div>
                      <div className="text-xs text-gray-400">{item.minutes.toLocaleString()} min</div>
                    </div>
                    <div className="flex-1 ml-2">
                      <div className="h-6 bg-gray-800 rounded-sm overflow-hidden">
                        <div
                          className="h-full rounded-sm"
                          style={{
                            width: `${widthPercentage}%`,
                            backgroundColor: blueColors[index % blueColors.length],
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Numbers at the bottom */}
            <div className="flex justify-between mt-4 px-36">
              {[1, 2, 3, 4, 5].map((num) => (
                <div key={num} className="text-xs text-gray-400">
                  {num}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Position Distribution */}
        <div className="bg-gray-900 bg-opacity-70 backdrop-blur-sm p-6 rounded-lg border border-gray-800">
          <div className="flex items-center mb-4">
            <h3 className="text-xl font-medium text-white">Position Distribution</h3>
            <InfoTooltip text="Distribution of players by position." />
          </div>

          <div className="h-[250px] flex items-center justify-center">
            <div className="w-[250px] h-[250px] relative">
              {positionDistribution.length > 0 ? (
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  {positionDistribution.map((item, index) => {
                    const total = positionDistribution.reduce((sum, pos) => sum + pos.count, 0)
                    const percentage = (item.count / total) * 100

                    // Calculate the slice
                    const startAngle =
                      index === 0
                        ? 0
                        : positionDistribution.slice(0, index).reduce((acc, pos) => acc + (pos.count / total) * 360, 0)

                    const endAngle = startAngle + percentage * 3.6

                    // Convert to radians
                    const startRad = ((startAngle - 90) * Math.PI) / 180
                    const endRad = ((endAngle - 90) * Math.PI) / 180

                    // Calculate points
                    const x1 = 50 + 40 * Math.cos(startRad)
                    const y1 = 50 + 40 * Math.sin(startRad)
                    const x2 = 50 + 40 * Math.cos(endRad)
                    const y2 = 50 + 40 * Math.sin(endRad)

                    // Create arc flag
                    const largeArcFlag = percentage > 50 ? 1 : 0

                    // Create path
                    const path = `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`

                    // Use blue color
                    const color = blueColors[index % blueColors.length]

                    return <path key={item.position} d={path} fill={color} stroke="#333" strokeWidth="1" />
                  })}
                  <circle cx="50" cy="50" r="20" fill="#070E16" />
                </svg>
              ) : (
                <div className="flex items-center justify-center w-full text-gray-400">No data available</div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4">
            {positionDistribution.map((item, index) => {
              const color = blueColors[index % blueColors.length]

              return (
                <div key={item.position} className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: color }}></div>
                  <span className="text-sm text-gray-300">
                    {item.position} ({item.count})
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Age Distribution */}
      <div className="bg-gray-900 bg-opacity-70 backdrop-blur-sm p-6 rounded-lg border border-gray-800">
        <div className="flex items-center mb-4">
          <h3 className="text-xl font-medium text-white">Age Distribution</h3>
          <InfoTooltip text="Distribution of players by age group." />
        </div>

        <div className="flex flex-col">
          {/* Age groups with bars */}
          <div className="space-y-4">
            {ageDistribution.map((item, index) => {
              const maxCount = Math.max(...ageDistribution.map((d) => d.count), 1)
              const widthPercentage = (item.count / maxCount) * 100

              return (
                <div key={index} className="flex items-center">
                  <div
                    className="w-4 h-4 rounded-sm mr-2"
                    style={{ backgroundColor: blueColors[index % blueColors.length] }}
                  ></div>
                  <div className="w-32">
                    <div className="text-sm text-white font-medium">{item.ageGroup}</div>
                    <div className="text-xs text-gray-400">{item.count} players</div>
                  </div>
                  <div className="flex-1 ml-2">
                    <div className="h-6 bg-gray-800 rounded-sm overflow-hidden">
                      <div
                        className="h-full rounded-sm"
                        style={{
                          width: `${widthPercentage}%`,
                          backgroundColor: blueColors[index % blueColors.length],
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Labels at the bottom */}
          <div className="flex justify-between mt-4 px-12">
            {ageDistribution.map((item, index) => (
              <div key={index} className="text-xs text-gray-400">
                {item.ageGroup.split("-")[0] || item.ageGroup.replace("Under ", "U")}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

