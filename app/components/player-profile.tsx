"use client"

import Image from "next/image"
import { type PlayerData, getCountryCode } from "../utils/player-data"

interface PlayerProfileProps {
  player: PlayerData | null
}

export function PlayerProfile({ player }: PlayerProfileProps) {
  if (!player) return null

  const countryCode = getCountryCode(player.nationality)

  // Extract the first part of the nationality (e.g., "eng" from "eng ENG")
  const nationalityDisplay = player.nationality.split(" ")[0]

  return (
    <div className="bg-gray-900 bg-opacity-70 backdrop-blur-sm p-6 rounded-lg border border-gray-800">
      <div className="flex items-center">
        <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mr-6 overflow-hidden">
          {countryCode !== "unknown" && (
            <Image
              src={`https://flagcdn.com/w160/${countryCode.toLowerCase()}.png`}
              alt={`${nationalityDisplay} flag`}
              width={80}
              height={80}
              className="object-cover"
            />
          )}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">{player.player}</h2>
          <div className="flex items-center mt-2">
            <span className="px-2 py-1 text-xs rounded-full bg-[#1E54B7]/20 text-[#1E54B7] mr-3">
              {player.position}
            </span>
            <span className="text-gray-400 text-sm">{player.age} years</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg text-center">
          <p className="text-gray-400 text-sm">Games</p>
          <p className="text-2xl font-bold text-white">{player.games}</p>
        </div>
        <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg text-center">
          <p className="text-gray-400 text-sm">Games Started</p>
          <p className="text-2xl font-bold text-white">{player.games_starts}</p>
        </div>
        <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg text-center">
          <p className="text-gray-400 text-sm">Minutes</p>
          <p className="text-2xl font-bold text-white">{player.minutes}</p>
        </div>
        <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg text-center">
          <p className="text-gray-400 text-sm">Minutes per 90</p>
          <p className="text-2xl font-bold text-white">{player.minutes_90s}</p>
        </div>
      </div>
    </div>
  )
}

