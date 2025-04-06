"use client"

import type { PlayerData } from "../utils/player-data"

interface PlayerDataTableProps {
  data: PlayerData[]
  player: string
}

export function PlayerDataTable({ data, player }: PlayerDataTableProps) {
  // Filter data based on selected player
  const filteredData = data.filter((item) => {
    if (player && player !== "All Players" && item.player !== player) return false
    return true
  })

  return (
    <div className="bg-gray-900 bg-opacity-70 backdrop-blur-sm p-6 rounded-lg border border-gray-800">
      <h3 className="text-xl font-medium text-white mb-4">Player Season Data</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="py-3 px-4 text-sm font-medium text-gray-300">Season</th>
              <th className="py-3 px-4 text-sm font-medium text-gray-300">Position</th>
              <th className="py-3 px-4 text-sm font-medium text-gray-300">Age</th>
              <th className="py-3 px-4 text-sm font-medium text-gray-300">Games</th>
              <th className="py-3 px-4 text-sm font-medium text-gray-300">Games Started</th>
              <th className="py-3 px-4 text-sm font-medium text-gray-300">Minutes</th>
              <th className="py-3 px-4 text-sm font-medium text-gray-300">Minutes per 90</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <tr key={index} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                  <td className="py-3 px-4 text-sm text-white">{item.season}</td>
                  <td className="py-3 px-4 text-sm text-gray-300">{item.position}</td>
                  <td className="py-3 px-4 text-sm text-gray-300">{item.age}</td>
                  <td className="py-3 px-4 text-sm text-gray-300">{item.games}</td>
                  <td className="py-3 px-4 text-sm text-gray-300">{item.games_starts}</td>
                  <td className="py-3 px-4 text-sm text-gray-300">{item.minutes}</td>
                  <td className="py-3 px-4 text-sm text-gray-300">{item.minutes_90s}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-6 text-center text-gray-400">
                  No data available for the selected player
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

