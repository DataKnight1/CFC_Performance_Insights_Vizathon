"use client"

import { useState, useEffect } from "react"
import { PlayerDataTable } from "./player-data-table"
import { PlayerLoadVisualization } from "./player-load-visualization"
import { PlayerProfile } from "./player-profile"
import { TeamOverviewDashboard } from "./team-overview-dashboard"
import { InfoTooltip } from "./info-tooltip"
import type { PlayerData } from "../utils/player-data"

interface PlayerDataClientWrapperProps {
  playerData: PlayerData[]
  players: string[]
}

export function PlayerDataClientWrapper({ playerData, players }: PlayerDataClientWrapperProps) {
  const [player, setPlayer] = useState("All Players")
  const [selectedPlayerData, setSelectedPlayerData] = useState<PlayerData | null>(null)
  const [totalMatches, setTotalMatches] = useState(0)
  const [showTable, setShowTable] = useState(false)

  useEffect(() => {
    if (player && player !== "All Players") {
      // Find the first record for the selected player to display in the profile
      const playerRecord = playerData.find((item) => item.player === player)
      setSelectedPlayerData(playerRecord || null)

      // Calculate total matches for the player
      const totalGames = getPlayerTotalGames(playerData, player)
      setTotalMatches(totalGames)

      // Debug log
      console.log(`Selected player: ${player}`)
      console.log(
        `Player data:`,
        playerData.filter((item) => item.player === player),
      )
    } else {
      setSelectedPlayerData(null)
      setTotalMatches(0)
    }
  }, [player, playerData])

  // Helper function
  function getPlayerTotalGames(data: PlayerData[], playerName: string): number {
    return data
      .filter((item) => item.player === playerName)
      .reduce((total, item) => total + (Number.parseInt(item.games) || 0), 0)
  }

  return (
    <>
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-300 mb-2">Player</label>
        <select
          className="w-full md:w-1/3 bg-gray-800 text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1E54B7]"
          value={player}
          onChange={(e) => setPlayer(e.target.value)}
        >
          {players.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      {player === "All Players" ? (
        <>
          <TeamOverviewDashboard data={playerData} />

          <div className="mt-8 flex justify-end">
            <button
              onClick={() => setShowTable(!showTable)}
              className="bg-gray-800 text-white px-4 py-2 rounded-md text-sm hover:bg-gray-700 transition-colors"
            >
              {showTable ? "Hide Full Data Table" : "Show Full Data Table"}
            </button>
          </div>

          {showTable && (
            <div className="mt-6">
              <PlayerDataTable data={playerData} player={player} />
            </div>
          )}
        </>
      ) : (
        <>
          {selectedPlayerData && (
            <div className="mb-8">
              <PlayerProfile player={selectedPlayerData} />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-8">
            <div className="bg-gray-900 bg-opacity-70 backdrop-blur-sm p-6 rounded-lg border border-gray-800">
              <div className="flex items-center">
                <h3 className="text-lg font-medium text-white mb-2">Total Matches</h3>
                <InfoTooltip text="This value is calculated from the player's actual data." />
              </div>
              <p className="text-4xl font-bold text-[#1E54B7]">{totalMatches}</p>
              <p className="text-gray-400 text-sm mt-2">Career total</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-1 gap-8 mb-8">
            <PlayerLoadVisualization data={playerData} player={player} />
          </div>

          <div className="mb-8">
            <PlayerDataTable data={playerData} player={player} />
          </div>
        </>
      )}
    </>
  )
}

