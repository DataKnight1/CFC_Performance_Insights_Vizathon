"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import FootballPitch from '../components/football-pitch';
import playerPhotos from '../utils/player-photos';

// Simulated data for the team formation
const playerPositions = [
  {
    id: 1,
    name: "Robert Sánchez",
    position: "GK",
    number: 1,
    x: 10,
    y: 50,
    image: playerPhotos["Robert Sánchez"]
  },
  {
    id: 2,
    name: "Reece James",
    position: "RB",
    number: 24,
    x: 25,
    y: 20,
    image: playerPhotos["Reece James"]
  },
  {
    id: 3,
    name: "Wesley Fofana",
    position: "CB",
    number: 33,
    x: 25,
    y: 40,
    image: playerPhotos["Wesley Fofana"]
  },
  {
    id: 4,
    name: "Player 4",
    position: "CB",
    number: 4,
    x: 25,
    y: 60
  },
  {
    id: 5,
    name: "Player 5",
    position: "LB",
    number: 5,
    x: 25,
    y: 80
  },
  {
    id: 6,
    name: "Romeo Lavia",
    position: "CDM",
    number: 45,
    x: 40,
    y: 35,
    image: playerPhotos["Romeo Lavia"]
  },
  {
    id: 7,
    name: "Enzo Fernández",
    position: "CM",
    number: 8,
    x: 40,
    y: 65,
    image: playerPhotos["Enzo Fernández"]
  },
  {
    id: 8,
    name: "Cole Palmer",
    position: "CAM",
    number: 20,
    x: 60,
    y: 50,
    image: playerPhotos["Cole Palmer"]
  },
  {
    id: 9,
    name: "Mykhailo Mudryk",
    position: "LW",
    number: 10,
    x: 75,
    y: 20,
    image: playerPhotos["Mykhailo Mudryk"]
  },
  {
    id: 10,
    name: "Nicolas Jackson",
    position: "ST",
    number: 15,
    x: 80,
    y: 50,
    image: playerPhotos["Nicolas Jackson"]
  },
  {
    id: 11,
    name: "Player 11",
    position: "RW",
    number: 11,
    x: 75,
    y: 80
  },
  // Substitutes
  {
    id: 12,
    name: "Player 12",
    position: "GK",
    number: 13,
    x: -10,
    y: 50
  },
  {
    id: 13,
    name: "Player 13",
    position: "DEF",
    number: 2,
    x: -10,
    y: 50
  },
  {
    id: 14,
    name: "Player 14",
    position: "MID",
    number: 16,
    x: -10,
    y: 50
  }
];

export default function TeamView() {
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null);
  const [selectedSection, setSelectedSection] = useState('formation');

  const handlePlayerClick = (player: any) => {
    setSelectedPlayer(player);
  };

  // Map of status indicators
  const statusMap = {
    load: {
      high: { players: ['Cole Palmer', 'Nicolas Jackson', 'Enzo Fernández'], color: 'bg-yellow-500/20 text-yellow-500' },
      medium: { players: ['Reece James', 'Mykhailo Mudryk', 'Romeo Lavia'], color: 'bg-blue-500/20 text-blue-500' },
      low: { players: ['Robert Sánchez', 'Wesley Fofana'], color: 'bg-green-500/20 text-green-500' }
    },
    injury: {
      high: { players: ['Reece James', 'Romeo Lavia'], color: 'bg-red-500/20 text-red-500' },
      medium: { players: ['Nicolas Jackson', 'Enzo Fernández'], color: 'bg-yellow-500/20 text-yellow-500' },
      low: { players: ['Cole Palmer', 'Mykhailo Mudryk', 'Robert Sánchez'], color: 'bg-green-500/20 text-green-500' },
      injured: { players: ['Wesley Fofana'], color: 'bg-red-500/90 text-white' }
    },
    recovery: {
      optimal: { players: ['Cole Palmer', 'Robert Sánchez'], color: 'bg-green-500/20 text-green-500' },
      good: { players: ['Mykhailo Mudryk', 'Enzo Fernández'], color: 'bg-blue-500/20 text-blue-500' },
      fair: { players: ['Reece James', 'Nicolas Jackson', 'Romeo Lavia'], color: 'bg-yellow-500/20 text-yellow-500' },
      poor: { players: ['Wesley Fofana'], color: 'bg-red-500/20 text-red-500' }
    }
  };

  // Function to get indicator style based on player name and section
  const getIndicatorStyle = (playerName: string, section: string) => {
    if (section === 'formation') return '';
    
    const categoryMap = statusMap[section as keyof typeof statusMap];
    if (!categoryMap) return '';
    
    for (const [status, { players, color }] of Object.entries(categoryMap)) {
      if (players.includes(playerName)) {
        return color;
      }
    }
    
    return 'bg-gray-500/20 text-gray-500';
  };

  return (
    <div className="space-y-8">
      <Card className="bg-gray-900 bg-opacity-70 backdrop-blur-sm border border-gray-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl text-white flex justify-between items-center">
            <span>Team Overview</span>
            
            <Tabs value={selectedSection} onValueChange={setSelectedSection} className="w-auto">
              <TabsList className="bg-gray-800">
                <TabsTrigger value="formation" className="data-[state=active]:bg-[#1E54B7]">
                  Formation
                </TabsTrigger>
                <TabsTrigger value="load" className="data-[state=active]:bg-[#1E54B7]">
                  Load Status
                </TabsTrigger>
                <TabsTrigger value="injury" className="data-[state=active]:bg-[#1E54B7]">
                  Injury Risk
                </TabsTrigger>
                <TabsTrigger value="recovery" className="data-[state=active]:bg-[#1E54B7]">
                  Recovery Status
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8">
              <div className="flex justify-center">
                <FootballPitch 
                  players={playerPositions.map(player => ({
                    ...player,
                    className: getIndicatorStyle(player.name, selectedSection)
                  }))}
                  onPlayerClick={handlePlayerClick}
                  highlightedPlayer={selectedPlayer?.id}
                  width={700} 
                  height={500}
                  showSubstitutes
                />
              </div>
            </div>
            
            <div className="lg:col-span-4">
              {selectedSection === 'formation' ? (
                <div className="space-y-4 h-full flex flex-col">
                  <div className="bg-gray-800 p-4 rounded-lg mb-2">
                    <h3 className="text-white font-medium mb-2">Formation: 4-3-3</h3>
                    <p className="text-gray-300 text-sm">Standard attacking formation with three central midfielders and three forwards.</p>
                  </div>
                  
                  {selectedPlayer ? (
                    <div className="bg-gray-800 p-4 rounded-lg flex-grow">
                      <div className="flex items-center mb-4">
                        <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#1E54B7] mr-4">
                          {selectedPlayer.image ? (
                            <Image 
                              src={selectedPlayer.image} 
                              alt={selectedPlayer.name} 
                              fill
                              className="object-cover"
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
                      
                      <div className="flex justify-center mt-4">
                        <Link 
                          href={`/biography?player=${selectedPlayer.id}`}
                          className="px-4 py-2 bg-[#1E54B7] text-white rounded-md text-sm transition hover:bg-[#1a4aa3]"
                        >
                          View Full Profile
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-800 p-4 rounded-lg flex-grow">
                      <p className="text-gray-300">Select a player from the pitch to view their details</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4 h-full">
                  {selectedSection === 'load' && (
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <h3 className="text-white font-medium mb-3">Load Status Legend</h3>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-red-500/20 mr-2"></div>
                          <span className="text-red-500 text-sm">Very High Load</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-yellow-500/20 mr-2"></div>
                          <span className="text-yellow-500 text-sm">High Load</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-blue-500/20 mr-2"></div>
                          <span className="text-blue-500 text-sm">Medium Load</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-green-500/20 mr-2"></div>
                          <span className="text-green-500 text-sm">Low Load</span>
                        </div>
                      </div>
                      <Link 
                        href="/load-demand"
                        className="mt-4 inline-block px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md text-xs transition"
                      >
                        View Detailed Load Analysis
                      </Link>
                    </div>
                  )}
                  
                  {selectedSection === 'injury' && (
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <h3 className="text-white font-medium mb-3">Injury Risk Legend</h3>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-red-500/90 mr-2"></div>
                          <span className="text-white text-sm">Currently Injured</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-red-500/20 mr-2"></div>
                          <span className="text-red-500 text-sm">High Risk</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-yellow-500/20 mr-2"></div>
                          <span className="text-yellow-500 text-sm">Medium Risk</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-green-500/20 mr-2"></div>
                          <span className="text-green-500 text-sm">Low Risk</span>
                        </div>
                      </div>
                      <Link 
                        href="/injury-history"
                        className="mt-4 inline-block px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md text-xs transition"
                      >
                        View Injury History
                      </Link>
                    </div>
                  )}
                  
                  {selectedSection === 'recovery' && (
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <h3 className="text-white font-medium mb-3">Recovery Status Legend</h3>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-green-500/20 mr-2"></div>
                          <span className="text-green-500 text-sm">Optimal</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-blue-500/20 mr-2"></div>
                          <span className="text-blue-500 text-sm">Good</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-yellow-500/20 mr-2"></div>
                          <span className="text-yellow-500 text-sm">Fair</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-red-500/20 mr-2"></div>
                          <span className="text-red-500 text-sm">Poor</span>
                        </div>
                      </div>
                      <Link 
                        href="/recovery"
                        className="mt-4 inline-block px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md text-xs transition"
                      >
                        View Recovery Metrics
                      </Link>
                    </div>
                  )}
                  
                  {selectedPlayer && (
                    <div className="bg-gray-800 p-4 rounded-lg mt-4">
                      <div className="flex items-center mb-4">
                        <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#1E54B7] mr-3">
                          {selectedPlayer.image ? (
                            <Image 
                              src={selectedPlayer.image} 
                              alt={selectedPlayer.name} 
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-[#1E54B7] flex items-center justify-center">
                              <span className="text-white text-lg font-bold">{selectedPlayer.number}</span>
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="text-md font-medium text-white">{selectedPlayer.name}</h3>
                          <div className="flex items-center">
                            <span className="text-gray-400 text-xs mr-2">{selectedPlayer.position}</span>
                            <span className="bg-[#1E54B7]/20 text-[#1E54B7] text-xs font-medium px-1.5 py-0.5 rounded-full">
                              #{selectedPlayer.number}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {selectedSection === 'load' && (
                        <div className="mt-3">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-300 text-sm">Load Status:</span>
                            <span className={`px-2 py-0.5 rounded-full text-xs ${getIndicatorStyle(selectedPlayer.name, 'load')}`}>
                              {statusMap.load.high.players.includes(selectedPlayer.name) 
                                ? 'High' 
                                : statusMap.load.medium.players.includes(selectedPlayer.name)
                                  ? 'Medium'
                                  : statusMap.load.low.players.includes(selectedPlayer.name)
                                    ? 'Low'
                                    : 'Unknown'}
                            </span>
                          </div>
                        </div>
                      )}
                      
                      {selectedSection === 'injury' && (
                        <div className="mt-3">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-300 text-sm">Injury Status:</span>
                            <span className={`px-2 py-0.5 rounded-full text-xs ${getIndicatorStyle(selectedPlayer.name, 'injury')}`}>
                              {statusMap.injury.injured.players.includes(selectedPlayer.name) 
                                ? 'Injured' 
                                : statusMap.injury.high.players.includes(selectedPlayer.name)
                                  ? 'High Risk'
                                  : statusMap.injury.medium.players.includes(selectedPlayer.name)
                                    ? 'Medium Risk'
                                    : statusMap.injury.low.players.includes(selectedPlayer.name)
                                      ? 'Low Risk'
                                      : 'Unknown'}
                            </span>
                          </div>
                        </div>
                      )}
                      
                      {selectedSection === 'recovery' && (
                        <div className="mt-3">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-300 text-sm">Recovery Status:</span>
                            <span className={`px-2 py-0.5 rounded-full text-xs ${getIndicatorStyle(selectedPlayer.name, 'recovery')}`}>
                              {statusMap.recovery.optimal.players.includes(selectedPlayer.name) 
                                ? 'Optimal' 
                                : statusMap.recovery.good.players.includes(selectedPlayer.name)
                                  ? 'Good'
                                  : statusMap.recovery.fair.players.includes(selectedPlayer.name)
                                    ? 'Fair'
                                    : statusMap.recovery.poor.players.includes(selectedPlayer.name)
                                      ? 'Poor'
                                      : 'Unknown'}
                            </span>
                          </div>
                        </div>
                      )}
                      
                      <div className="mt-4 text-center">
                        <Link 
                          href={`/biography?player=${selectedPlayer.id}`}
                          className="px-3 py-1.5 bg-[#1E54B7] text-white rounded-md text-xs transition hover:bg-[#1a4aa3]"
                        >
                          View Full Profile
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}