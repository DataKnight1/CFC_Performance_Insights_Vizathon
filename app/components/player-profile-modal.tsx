"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { X } from "lucide-react"
import { type PlayerData, getCountryCode } from "../utils/player-data"

interface PlayerProfileModalProps {
  player: PlayerData | null
  onClose: () => void
}

export function PlayerProfileModal({ player, onClose }: PlayerProfileModalProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (player) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }, [player])

  if (!player) return null

  const countryCode = getCountryCode(player.nationality)

  // Extract the first part of the nationality (e.g., "eng" from "eng ENG")
  const nationalityDisplay = player.nationality.split(" ")[0]

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="absolute inset-0 bg-black bg-opacity-70" onClick={onClose}></div>
      <div className="relative bg-gray-900 bg-opacity-90 backdrop-blur-sm p-6 rounded-lg border border-gray-800 w-full max-w-md z-10">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <X size={24} />
        </button>

        <div className="flex items-center mb-6">
          <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mr-4 overflow-hidden">
            {countryCode !== "unknown" && (
              <Image
                src={`https://flagcdn.com/w80/${countryCode.toLowerCase()}.png`}
                alt={`${nationalityDisplay} flag`}
                width={64}
                height={64}
                className="object-cover"
              />
            )}
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{player.player}</h3>
            <div className="flex items-center mt-1">
              <span className="px-2 py-1 text-xs rounded-full bg-[#1E54B7]/20 text-[#1E54B7] mr-2">
                {player.position}
              </span>
              <span className="text-gray-400 text-sm">{player.age} years</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg text-center">
            <p className="text-gray-400 text-sm">Games</p>
            <p className="text-2xl font-bold text-white">{player.games}</p>
          </div>
          <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg text-center">
            <p className="text-gray-400 text-sm">Games Started</p>
            <p className="text-2xl font-bold text-white">{player.games_starts}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg text-center">
            <p className="text-gray-400 text-sm">Minutes</p>
            <p className="text-2xl font-bold text-white">{player.minutes}</p>
          </div>
          <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg text-center">
            <p className="text-gray-400 text-sm">Minutes per 90</p>
            <p className="text-2xl font-bold text-white">{player.minutes_90s}</p>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-700">
          <h4 className="text-lg font-medium text-white mb-3">Season {player.season}</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Position:</span>
              <span className="text-white">{player.position}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Nationality:</span>
              <span className="text-white">{nationalityDisplay}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Age:</span>
              <span className="text-white">{player.age}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

