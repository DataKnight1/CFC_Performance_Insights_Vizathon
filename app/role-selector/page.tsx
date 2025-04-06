"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import AnimatedBackground from "../components/animated-background";

export default function RoleSelector() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  
  const roles = [
    {
      id: "coach",
      title: "Head Coach",
      description: "Focus on performance optimization, tactical implementation, and athlete readiness",
      image: "/coach-icon.png", // You can add these icons to your public directory
      keyMetrics: [
        "Player readiness status",
        "Tactical performance indicators",
        "Weekly load management recommendations",
        "Match preparation insights"
      ]
    },
    {
      id: "analyst",
      title: "Performance Analyst",
      description: "Deep dive into data patterns, trend analysis, and technical performance metrics",
      image: "/analyst-icon.png",
      keyMetrics: [
        "Detailed performance trends",
        "Advanced statistical analysis",
        "Opposition pattern recognition",
        "Technical efficiency metrics"
      ]
    },
    {
      id: "director",
      title: "Football Director",
      description: "Strategic overview focusing on long-term planning, recruitment, and department integration",
      image: "/director-icon.png",
      keyMetrics: [
        "Player development pathways",
        "Recruitment profile alignment",
        "Department performance benchmarks",
        "Resource optimization strategies"
      ]
    }
  ];
  
  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Bring_your_boots_tour_2025_header-s6bQPBCt2XFNbuZXnTP1CH2zcSEnnq.webp"
          alt="Chelsea FC Stadium"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-[#070E16]/80"></div>
      </div>
      
      {/* Animated Lines Overlay */}
      <AnimatedBackground />
      
      <header className="container mx-auto py-6 px-4 z-10">
        <div className="flex items-center">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo-SvkMVEyEGNlML3C7t85UPpuMulsAEO.png"
            alt="Chelsea FC Logo"
            width={40}
            height={40}
            className="mr-3"
          />
          <span className="text-white text-lg font-bold">CFC Performance Insights</span>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto px-4 py-12 z-10 flex items-center justify-center">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-3">Select Your Role</h1>
            <p className="text-gray-300">Personalized insights tailored to your specific role in the football organization</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {roles.map((role) => (
              <div 
                key={role.id}
                className={`bg-gray-900 bg-opacity-80 backdrop-blur-sm p-6 rounded-lg border ${
                  selectedRole === role.id 
                    ? 'border-[#1E54B7] ring-2 ring-[#1E54B7]' 
                    : 'border-gray-800 hover:border-gray-700'
                } cursor-pointer transition-all duration-300 h-full flex flex-col`}
                onClick={() => setSelectedRole(role.id)}
              >
                <div className="mb-4 flex justify-center">
                  {/* You can add actual icons here */}
                  <div className="w-16 h-16 rounded-full bg-[#1E54B7]/30 flex items-center justify-center text-[#1E54B7]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      {role.id === "coach" ? (
                        // Whistle icon for coach
                        <>
                          <circle cx="12" cy="12" r="8" />
                          <line x1="12" y1="8" x2="12" y2="12" />
                          <line x1="12" y1="16" x2="12.01" y2="16" />
                        </>
                      ) : role.id === "analyst" ? (
                        // Chart icon for analyst
                        <>
                          <line x1="18" y1="20" x2="18" y2="10" />
                          <line x1="12" y1="20" x2="12" y2="4" />
                          <line x1="6" y1="20" x2="6" y2="14" />
                        </>
                      ) : (
                        // Building icon for director
                        <>
                          <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
                          <line x1="12" y1="18" x2="12" y2="18.01" />
                        </>
                      )}
                    </svg>
                  </div>
                </div>
                
                <h2 className="text-xl font-bold text-white mb-2">{role.title}</h2>
                <p className="text-gray-400 text-sm mb-4">{role.description}</p>
                
                <div className="mt-auto">
                  <h3 className="text-sm font-medium text-gray-300 mb-2">Key Metrics:</h3>
                  <ul className="text-xs text-gray-400 space-y-1">
                    {role.keyMetrics.map((metric, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-[#1E54B7] mr-2">•</span>
                        <span>{metric}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-10 flex justify-center">
            <Link href="/" className={`px-8 py-3 rounded-md font-medium ${
              selectedRole 
                ? 'bg-[#1E54B7] text-white hover:bg-[#1E54B7]/90' 
                : 'bg-gray-700 text-gray-300 cursor-not-allowed'
            }`}>
              Continue as {selectedRole ? roles.find(r => r.id === selectedRole)?.title : 'Selected Role'}
            </Link>
          </div>
        </div>
      </main>
      
      <footer className="py-6 z-10">
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Chelsea Football Club. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}