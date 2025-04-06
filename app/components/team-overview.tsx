"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import FootballPitch from './football-pitch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import playerPhotos from '../utils/player-photos';

interface PlayerData {
  id: number;
  name: string;
  position: string;
  number: number;
  x: number;
  y: number;
  image?: string;
  stats: {
    gamesPlayed: number;
    minutesPlayed: number;
    loadStatus: 'Low' | 'Medium' | 'High' | 'Very High';
    injuryRisk: 'Low' | 'Medium' | 'High' | 'Injured';
    fitnessLevel: number;
    recoveryStatus: 'Optimal' | 'Good' | 'Fair' | 'Poor';
  };
}

export default function TeamOverview() {
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerData | null>(null);
  
  // Mock data for team players - in a real app, this would come from an API or database
  const players: PlayerData[] = [
    {
      id: 1,
      name: "Robert Sánchez",
      position: "GK",
      number: 1,
      x: 10, // 0-100 scale for x position on pitch
      y: 50, // 0-100 scale for y position on pitch
      image: playerPhotos["Robert Sánchez"],
      stats: {
        gamesPlayed: 31,
        minutesPlayed: 2790,
        loadStatus: 'Low',
        injuryRisk: 'Low',
        fitnessLevel: 87,
        recoveryStatus: 'Optimal'
      }
    },
    {
      id: 2,
      name: "Reece James",
      position: "RB",
      number: 24,
      x: 25,
      y: 20,
      image: playerPhotos["Reece James"],
      stats: {
        gamesPlayed: 11,
        minutesPlayed: 891,
        loadStatus: 'Medium',
        injuryRisk: 'High',
        fitnessLevel: 75,
        recoveryStatus: 'Fair'
      }
    },
    {
      id: 3,
      name: "Wesley Fofana",
      position: "CB",
      number: 33,
      x: 25,
      y: 40,
      image: playerPhotos["Wesley Fofana"],
      stats: {
        gamesPlayed: 0,
        minutesPlayed: 0,
        loadStatus: 'Low',
        injuryRisk: 'Injured',
        fitnessLevel: 60,
        recoveryStatus: 'Poor'
      }
    },
    {
      id: 4,
      name: "Player 4",
      position: "CB",
      number: 4,
      x: 25,
      y: 60,
      stats: {
        gamesPlayed: 28,
        minutesPlayed: 2520,
        loadStatus: 'Medium',
        injuryRisk: 'Low',
        fitnessLevel: 82,
        recoveryStatus: 'Good'
      }
    },
    {
      id: 5,
      name: "Player 5",
      position: "LB",
      number: 5,
      x: 25,
      y: 80,
      stats: {
        gamesPlayed: 25,
        minutesPlayed: 2250,
        loadStatus: 'Medium',
        injuryRisk: 'Low',
        fitnessLevel: 84,
        recoveryStatus: 'Good'
      }
    },
    {
      id: 6,
      name: "Romeo Lavia",
      position: "CDM",
      number: 45,
      x: 40,
      y: 35,
      image: playerPhotos["Romeo Lavia"],
      stats: {
        gamesPlayed: 1,
        minutesPlayed: 90,
        loadStatus: 'Medium',
        injuryRisk: 'High',
        fitnessLevel: 72,
        recoveryStatus: 'Fair'
      }
    },
    {
      id: 7,
      name: "Enzo Fernández",
      position: "CM",
      number: 8,
      x: 40,
      y: 65,
      image: playerPhotos["Enzo Fernández"],
      stats: {
        gamesPlayed: 32,
        minutesPlayed: 2850,
        loadStatus: 'High',
        injuryRisk: 'Medium',
        fitnessLevel: 78,
        recoveryStatus: 'Good'
      }
    },
    {
      id: 8,
      name: "Cole Palmer",
      position: "CAM",
      number: 20,
      x: 60,
      y: 50,
      image: playerPhotos["Cole Palmer"],
      stats: {
        gamesPlayed: 30,
        minutesPlayed: 2700,
        loadStatus: 'High',
        injuryRisk: 'Low',
        fitnessLevel: 90,
        recoveryStatus: 'Optimal'
      }
    },
    {
      id: 9,
      name: "Mykhailo Mudryk",
      position: "LW",
      number: 10,
      x: 75,
      y: 20,
      image: playerPhotos["Mykhailo Mudryk"],
      stats: {
        gamesPlayed: 28,
        minutesPlayed: 1810,
        loadStatus: 'Medium',
        injuryRisk: 'Low',
        fitnessLevel: 86,
        recoveryStatus: 'Good'
      }
    },
    {
      id: 10,
      name: "Nicolas Jackson",
      position: "ST",
      number: 15,
      x: 80,
      y: 50,
      image: playerPhotos["Nicolas Jackson"],
      stats: {
        gamesPlayed: 33,
        minutesPlayed: 2860,
        loadStatus: 'Very High',
        injuryRisk: 'Medium',
        fitnessLevel: 83,
        recoveryStatus: 'Fair'
      }
    },
    {
      id: 11,
      name: "Player 11",
      position: "RW",
      number: 11,
      x: 75,
      y: 80,
      stats: {
        gamesPlayed: 26,
        minutesPlayed: 2120,
        loadStatus: 'Medium',
        injuryRisk: 'Low',
        fitnessLevel: 84,
        recoveryStatus: 'Good'
      }
    },
    // Substitutes (outside of pitch coordinates)
    {
      id: 12,
      name: "Player 12",
      position: "GK",
      number: 13,
      x: -10, // Negative x means it's a substitute
      y: 50,
      stats: {
        gamesPlayed: 7,
        minutesPlayed: 630,
        loadStatus: 'Low',
        injuryRisk: 'Low',
        fitnessLevel: 80,
        recoveryStatus: 'Optimal'
      }
    },
    {
      id: 13,
      name: "Player 13",
      position: "DEF",
      number: 2,
      x: -10,
      y: 50,
      stats: {
        gamesPlayed: 12,
        minutesPlayed: 840,
        loadStatus: 'Low',
        injuryRisk: 'Medium',
        fitnessLevel: 79,
        recoveryStatus: 'Good'
      }
    },
    {
      id: 14,
      name: "Player 14",
      position: "MID",
      number: 16,
      x: -10,
      y: 50,
      stats: {
        gamesPlayed: 20,
        minutesPlayed: 1230,
        loadStatus: 'Medium',
        injuryRisk: 'Low',
        fitnessLevel: 81,
        recoveryStatus: 'Good'
      }
    }
  ];

  const handlePlayerClick = (player: any) => {
    // Find the complete player data
    const fullPlayerData = players.find(p => p.id === player.id) || null;
    setSelectedPlayer(fullPlayerData);
  };

  // Loading status colors
  const getLoadStatusColor = (status: string) => {
    switch (status) {
      case 'Low': return 'bg-green-500/20 text-green-400';
      case 'Medium': return 'bg-blue-500/20 text-blue-400';
      case 'High': return 'bg-yellow-500/20 text-yellow-400';
      case 'Very High': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };
  
  // Injury risk colors
  const getInjuryRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'bg-green-500/20 text-green-400';
      case 'Medium': return 'bg-yellow-500/20 text-yellow-400';
      case 'High': return 'bg-orange-500/20 text-orange-400';
      case 'Injured': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };
  
  // Recovery status colors
  const getRecoveryStatusColor = (status: string) => {
    switch (status) {
      case 'Optimal': return 'bg-green-500/20 text-green-400';
      case 'Good': return 'bg-blue-500/20 text-blue-400';
      case 'Fair': return 'bg-yellow-500/20 text-yellow-400';
      case 'Poor': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Football pitch visualization */}
        <div className="lg:col-span-8">
          <Card className="bg-gray-900 bg-opacity-70 backdrop-blur-sm border border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl text-white flex justify-between items-center">
                <span>Team Formation</span>
                <div className="text-sm font-normal text-gray-400">4-3-3</div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <FootballPitch 
                  players={players}
                  onPlayerClick={handlePlayerClick}
                  highlightedPlayer={selectedPlayer?.id}
                  width={700} 
                  height={500}
                  showSubstitutes
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Player details or instructions */}
        <div className="lg:col-span-4">
          <Card className="bg-gray-900 bg-opacity-70 backdrop-blur-sm border border-gray-800 h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl text-white">
                {selectedPlayer ? 'Player Details' : 'Team Overview'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedPlayer ? (
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#1E54B7] mr-4">
                      {selectedPlayer.image ? (
                        <img 
                          src={selectedPlayer.image} 
                          alt={selectedPlayer.name} 
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#1E54B7] flex items-center justify-center">
                          <span className="text-white text-xl font-bold">{selectedPlayer.number}</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-white">{selectedPlayer.name}</h3>
                      <div className="flex items-center">
                        <span className="text-gray-400 text-sm mr-2">{selectedPlayer.position}</span>
                        <span className="bg-[#1E54B7]/20 text-[#1E54B7] text-xs font-medium px-2 py-0.5 rounded-full">
                          #{selectedPlayer.number}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 mt-4">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Games Played</span>
                      <span className="text-white font-medium">{selectedPlayer.stats.gamesPlayed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Minutes Played</span>
                      <span className="text-white font-medium">{selectedPlayer.stats.minutesPlayed}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Load Status</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${getLoadStatusColor(selectedPlayer.stats.loadStatus)}`}>
                        {selectedPlayer.stats.loadStatus}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Injury Risk</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${getInjuryRiskColor(selectedPlayer.stats.injuryRisk)}`}>
                        {selectedPlayer.stats.injuryRisk}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Fitness Level</span>
                      <div className="flex items-center">
                        <div className="w-24 h-2 bg-gray-700 rounded-full mr-2">
                          <div 
                            className="h-full bg-[#1E54B7] rounded-full"
                            style={{ width: `${selectedPlayer.stats.fitnessLevel}%` }}
                          ></div>
                        </div>
                        <span className="text-white text-sm">{selectedPlayer.stats.fitnessLevel}%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Recovery Status</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${getRecoveryStatusColor(selectedPlayer.stats.recoveryStatus)}`}>
                        {selectedPlayer.stats.recoveryStatus}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-gray-700 grid grid-cols-2 gap-2">
                    <Link 
                      href={`/biography?player=${selectedPlayer.id}`}
                      className="text-center px-3 py-2 bg-[#1E54B7]/20 hover:bg-[#1E54B7]/30 text-[#1E54B7] rounded-md text-sm transition"
                    >
                      Full Profile
                    </Link>
                    <Link 
                      href={`/load-demand?player=${selectedPlayer.id}`}
                      className="text-center px-3 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-md text-sm transition"
                    >
                      Load Analysis
                    </Link>
                    <Link 
                      href={`/injury-history?player=${selectedPlayer.id}`}
                      className="text-center px-3 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-md text-sm transition"
                    >
                      Injury History
                    </Link>
                    <Link 
                      href={`/recovery?player=${selectedPlayer.id}`}
                      className="text-center px-3 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-md text-sm transition"
                    >
                      Recovery Data
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-gray-300">Select a player from the pitch to view their details</p>
                  <div className="pt-4 border-t border-gray-700">
                    <h4 className="text-white font-medium mb-2">Team Status Overview</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">Available Players</span>
                        <span className="text-green-400">18/23</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">Injured Players</span>
                        <span className="text-red-400">5/23</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">High Load Risk</span>
                        <span className="text-yellow-400">3/23</span>
                      </div>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-700">
                    <h4 className="text-white font-medium mb-2">Next Match</h4>
                    <div className="bg-gray-800 rounded-md p-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-300 text-sm">Arsenal (H)</span>
                        <span className="bg-[#1E54B7]/20 text-[#1E54B7] text-xs px-2 py-0.5 rounded-full">Premier League</span>
                      </div>
                      <div className="text-gray-400 text-xs">Saturday, 4 May 2024 • 17:30</div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}