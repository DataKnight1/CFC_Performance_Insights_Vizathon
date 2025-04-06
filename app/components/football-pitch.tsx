"use client";

import React from "react";
import Image from "next/image";

interface PlayerPosition {
  id: number;
  name: string;
  x: number;
  y: number;
  position: string;
  number: number;
  image?: string;
}

interface FootballPitchProps {
  players: PlayerPosition[];
  onPlayerClick?: (player: PlayerPosition) => void;
  showPlayerNames?: boolean;
  highlightedPlayer?: number | null;
  width?: number;
  height?: number;
  showSubstitutes?: boolean;
}

export default function FootballPitch({
  players,
  onPlayerClick,
  showPlayerNames = true,
  highlightedPlayer = null,
  width = 800,
  height = 600,
  showSubstitutes = false,
}: FootballPitchProps) {
  // Calculate relative positioning
  const scaledX = (x: number) => (x / 100) * width;
  const scaledY = (y: number) => (y / 100) * height;

  // Substitutes default positioning
  const substitutes = players.filter(
    (player) => player.x < 0 || player.y < 0 || player.x > 100 || player.y > 100
  );
  
  // Active players on the pitch
  const activePlayers = players.filter(
    (player) => player.x >= 0 && player.y >= 0 && player.x <= 100 && player.y <= 100
  );

  return (
    <div className="relative">
      <div
        className="relative overflow-hidden rounded-lg bg-[#2a633a] border-4 border-white"
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        {/* Pitch markings */}
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          className="absolute inset-0"
        >
          {/* Outer boundary */}
          <rect
            x={width * 0.02}
            y={height * 0.02}
            width={width * 0.96}
            height={height * 0.96}
            stroke="white"
            strokeWidth="2"
            fill="none"
          />

          {/* Center circle */}
          <circle
            cx={width / 2}
            cy={height / 2}
            r={height * 0.12}
            stroke="white"
            strokeWidth="2"
            fill="none"
          />

          {/* Center line */}
          <line
            x1={width / 2}
            y1={height * 0.02}
            x2={width / 2}
            y2={height * 0.98}
            stroke="white"
            strokeWidth="2"
          />

          {/* Center spot */}
          <circle
            cx={width / 2}
            cy={height / 2}
            r="3"
            fill="white"
          />

          {/* Left penalty area */}
          <rect
            x={width * 0.02}
            y={height * 0.3}
            width={width * 0.16}
            height={height * 0.4}
            stroke="white"
            strokeWidth="2"
            fill="none"
          />

          {/* Right penalty area */}
          <rect
            x={width * 0.82}
            y={height * 0.3}
            width={width * 0.16}
            height={height * 0.4}
            stroke="white"
            strokeWidth="2"
            fill="none"
          />

          {/* Left goal area */}
          <rect
            x={width * 0.02}
            y={height * 0.4}
            width={width * 0.06}
            height={height * 0.2}
            stroke="white"
            strokeWidth="2"
            fill="none"
          />

          {/* Right goal area */}
          <rect
            x={width * 0.92}
            y={height * 0.4}
            width={width * 0.06}
            height={height * 0.2}
            stroke="white"
            strokeWidth="2"
            fill="none"
          />

          {/* Left goal */}
          <rect
            x={width * 0.005}
            y={height * 0.425}
            width={width * 0.015}
            height={height * 0.15}
            stroke="white"
            strokeWidth="2"
            fill="none"
          />

          {/* Right goal */}
          <rect
            x={width * 0.98}
            y={height * 0.425}
            width={width * 0.015}
            height={height * 0.15}
            stroke="white"
            strokeWidth="2"
            fill="none"
          />

          {/* Left penalty spot */}
          <circle
            cx={width * 0.12}
            cy={height / 2}
            r="3"
            fill="white"
          />

          {/* Right penalty spot */}
          <circle
            cx={width * 0.88}
            cy={height / 2}
            r="3"
            fill="white"
          />

          {/* Left penalty arc */}
          <path
            d={`M ${width * 0.16} ${height * 0.42} A ${height * 0.1} ${height * 0.1} 0 0 1 ${width * 0.16} ${height * 0.58}`}
            stroke="white"
            strokeWidth="2"
            fill="none"
          />

          {/* Right penalty arc */}
          <path
            d={`M ${width * 0.84} ${height * 0.42} A ${height * 0.1} ${height * 0.1} 0 0 0 ${width * 0.84} ${height * 0.58}`}
            stroke="white"
            strokeWidth="2"
            fill="none"
          />

          {/* Grass pattern for visual effect */}
          <pattern id="grass" patternUnits="userSpaceOnUse" width="30" height="30">
            <path
              d="M 0,15 L 30,15 M 15,0 L 15,30"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="0.5"
            />
          </pattern>
          <rect
            x="0"
            y="0"
            width={width}
            height={height}
            fill="url(#grass)"
          />
        </svg>

        {/* Player positions */}
        {activePlayers.map((player) => (
          <div
            key={player.id}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 ${
              highlightedPlayer === player.id
                ? "scale-110 z-10"
                : "hover:scale-105"
            }`}
            style={{
              left: scaledX(player.x),
              top: scaledY(player.y),
            }}
            onClick={() => onPlayerClick && onPlayerClick(player)}
          >
            <div
              className={`relative w-12 h-12 rounded-full overflow-hidden border-2 flex items-center justify-center ${
                highlightedPlayer === player.id
                  ? "border-[#1E54B7] shadow-[0_0_10px_rgba(30,84,183,0.5)]"
                  : "border-white"
              }`}
            >
              {player.image ? (
                <Image
                  src={player.image}
                  alt={player.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-[#1E54B7] flex items-center justify-center">
                  <span className="text-white font-bold">{player.number}</span>
                </div>
              )}
            </div>

            {showPlayerNames && (
              <div className="mt-1 text-center">
                <div className="bg-[#070E16]/80 px-2 py-0.5 rounded-md">
                  <p className="text-xs font-medium text-white whitespace-nowrap">
                    {player.name}
                  </p>
                  <p className="text-[0.6rem] text-gray-300">{player.position}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Substitutes bench */}
      {showSubstitutes && substitutes.length > 0 && (
        <div className="mt-6 p-4 bg-gray-900 bg-opacity-70 backdrop-blur-sm rounded-lg border border-gray-800">
          <h3 className="text-lg font-medium text-white mb-3">Substitutes</h3>
          <div className="flex flex-wrap gap-4">
            {substitutes.map((player) => (
              <div
                key={player.id}
                className={`cursor-pointer transition-all duration-300 ${
                  highlightedPlayer === player.id
                    ? "scale-110 z-10"
                    : "hover:scale-105"
                }`}
                onClick={() => onPlayerClick && onPlayerClick(player)}
              >
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-10 h-10 rounded-full overflow-hidden border-2 flex items-center justify-center ${
                      highlightedPlayer === player.id
                        ? "border-[#1E54B7] shadow-[0_0_10px_rgba(30,84,183,0.5)]"
                        : "border-gray-600"
                    }`}
                  >
                    {player.image ? (
                      <Image
                        src={player.image}
                        alt={player.name}
                        width={40}
                        height={40}
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                        <span className="text-white font-medium">{player.number}</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{player.name}</p>
                    <p className="text-xs text-gray-400">{player.position}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}