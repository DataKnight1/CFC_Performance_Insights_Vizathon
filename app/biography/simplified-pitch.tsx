"use client";

import React, { useState } from 'react';
import Image from 'next/image';

// Simple football pitch component that works directly in the Biography page
// without relying on external modules or routes

export default function SimplifiedPitch() {
  const [hoveredPlayer, setHoveredPlayer] = useState<number | null>(null);
  
  // Updated player data for 4-2-2-2 formation with realistic positioning
  const players = [
    { id: 1, name: "Sánchez", position: "GK", number: 1, x: 50, y: 90, age: 27, image: "https://www.zerozero.pt/img/jogadores/new/37/77/483777_robert_sanchez_20240817015740.png" },
    { id: 2, name: "Gusto", position: "RB", number: 27, x: 75, y: 75, age: 21, image: "https://www.zerozero.pt/img/jogadores/new/82/97/748297_malo_gusto_20240817015111.png" },
    { id: 3, name: "Adarabioyo", position: "CB", number: 4, x: 60, y: 75, age: 26, image: "https://www.zerozero.pt/img/jogadores/new/33/55/303355_tosin_adarabioyo_20240817015338.png" },
    { id: 4, name: "Colwill", position: "CB", number: 26, x: 40, y: 75, age: 22, image: "https://www.zerozero.pt/img/jogadores/new/82/41/748241_levi_colwill__20240817014842.png" },
    { id: 5, name: "Cucurella", position: "LB", number: 3, x: 25, y: 75, age: 26, image: "https://www.zerozero.pt/img/jogadores/new/62/32/436232_marc_cucurella_20240817014444.png" },
    { id: 6, name: "Caicedo", position: "CDM", number: 25, x: 40, y: 55, age: 23, image: "https://www.zerozero.pt/img/jogadores/new/71/55/727155_moises_caicedo_20240817020927.png" },
    { id: 7, name: "Fernández", position: "CDM", number: 8, x: 60, y: 55, age: 24, image: "https://www.zerozero.pt/img/jogadores/new/76/23/697623_enzo_fernandez_20240817021231.png" },
    { id: 8, name: "Palmer", position: "RAM", number: 20, x: 65, y: 35, age: 22, image: "https://www.zerozero.pt/img/jogadores/new/90/19/659019_cole_palmer_20240817020947.png" },
    { id: 9, name: "Nkunku", position: "LAM", number: 18, x: 35, y: 35, age: 27, image: "https://www.zerozero.pt/img/jogadores/new/51/16/425116_christopher_nkunku_20240817020636.png" },
    { id: 10, name: "Neto", position: "RS", number: 7, x: 60, y: 20, age: 25, image: "https://www.zerozero.pt/img/jogadores/new/64/69/296469_pedro_neto_20250321120254.png" },
    { id: 11, name: "Jackson", position: "LS", number: 15, x: 40, y: 20, age: 23, image: "https://www.zerozero.pt/img/jogadores/new/78/26/827826_nicolas_jackson_20240817020748.png" },
  ];
  
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative h-[400px] bg-[#2a633a] rounded-lg border-2 border-white">
        {/* Pitch markings */}
        <div className="absolute inset-0">
          {/* Outer boundary */}
          <div className="absolute inset-4 border-2 border-white/70 rounded-md"></div>
          
          {/* Center circle */}
          <div className="absolute top-1/2 left-1/2 w-24 h-24 border-2 border-white/70 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
          
          {/* Center line */}
          <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-white/70 transform -translate-x-1/2"></div>
          
          {/* Center spot */}
          <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
          
          {/* Penalty areas */}
          <div className="absolute top-[25%] left-4 right-[75%] bottom-[25%] border-2 border-white/70"></div>
          <div className="absolute top-[25%] right-4 left-[75%] bottom-[25%] border-2 border-white/70"></div>
          
          {/* Goals */}
          <div className="absolute top-[40%] left-2 w-2 h-[20%] border-2 border-white/70"></div>
          <div className="absolute top-[40%] right-2 w-2 h-[20%] border-2 border-white/70"></div>
        </div>
        
        {/* Players */}
        {players.map((player) => (
          <div
            key={player.id}
            className={`absolute cursor-pointer transition-all duration-300 ${
              hoveredPlayer === player.id ? "scale-110 z-10" : "hover:scale-105"
            }`}
            style={{
              left: `${player.x}%`,
              top: `${player.y}%`,
              transform: "translate(-50%, -50%)"
            }}
            onMouseEnter={() => setHoveredPlayer(player.id)}
            onMouseLeave={() => setHoveredPlayer(null)}
          >
            <div
              className={`w-10 h-10 rounded-full overflow-hidden relative border-2 ${
                hoveredPlayer === player.id
                  ? "border-white shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                  : "border-white/70"
              }`}
            >
              {player.image ? (
                <Image
                  src={player.image}
                  alt={player.name}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              ) : (
                <div className="w-full h-full bg-[#1E54B7] flex items-center justify-center">
                  <span className="text-white font-bold text-xs">{player.number}</span>
                </div>
              )}
            </div>
            
            <div className={`absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-black/70 px-2 py-0.5 rounded text-xs text-white whitespace-nowrap transition-opacity ${
              hoveredPlayer === player.id ? "opacity-100" : "opacity-0"
            }`}>
              {player.name} ({player.age})
              <span className="text-gray-300 text-[10px] ml-1">#{player.number} • {player.position}</span>
            </div>
          </div>
        ))}
        
        {/* Legend */}
        <div className="absolute bottom-2 left-2 bg-black/50 px-3 py-1 rounded-md">
          <div className="text-white text-xs font-medium">Formation: 4-2-2-2</div>
          <div className="text-white/70 text-[10px]">Hover over players to see details</div>
        </div>
      </div>
    </div>
  );
}