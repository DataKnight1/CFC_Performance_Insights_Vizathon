"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import AnimatedBackground from "./components/animated-background";

// Define different section types for the dashboard
type DashboardSection = {
  title: string;
  description: string;
  path: string;
  icon: React.ReactNode;
  metrics: string[];
  color: string;
  footballIcon: string; // Football-related icon URL
};

export default function Home() {
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const [animateStats, setAnimateStats] = useState(false);
  
  // Trigger animations after initial load
  useEffect(() => {
    // Delay animation to allow page to render first
    const timer = setTimeout(() => {
      setAnimateStats(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Chelsea blues gradient effect for highlights
  const chelseaBlueGradient = "linear-gradient(90deg, #1E54B7, #034694)";
  
  // Dashboard sections with relevant information and football-themed icons
  const sections: DashboardSection[] = [
    {
      title: "Load Demand",
      description: "Monitor player workload, movement demands and physical output metrics",
      path: "/load-demand",
      color: "#1E54B7",
      footballIcon: "https://img.icons8.com/ios-filled/50/FFFFFF/running.png",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
        </svg>
      ),
      metrics: [
        "Games & matches played",
        "Season availability",
        "Training sessions",
        "Physical load management"
      ]
    },
    {
      title: "Injury History",
      description: "Track injury patterns, risk factors and rehabilitation progress",
      path: "/injury-history",
      color: "#E53E3E",
      footballIcon: "https://img.icons8.com/ios-filled/50/FFFFFF/bandage.png",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 19h8"></path>
          <path d="M8 5h8a7 7 0 0 1 0 14H8a7 7 0 0 1 0-14Z"></path>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      ),
      metrics: [
        "Current injury status",
        "Injury risk categorization",
        "Most recent injuries",
        "Return-to-play protocols"
      ]
    },
    {
      title: "Physical Development",
      description: "Measure physical capabilities, strengths and areas for improvement",
      path: "/physical-development",
      color: "#805AD5",
      footballIcon: "https://img.icons8.com/ios-filled/50/FFFFFF/crossfit.png",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"></path>
          <line x1="16" y1="8" x2="2" y2="22"></line>
          <line x1="17.5" y1="15" x2="9" y2="15"></line>
        </svg>
      ),
      metrics: [
        "Physical test capabilities",
        "Development plans",
        "Strength & conditioning logs",
        "Areas of priority"
      ]
    },
    {
      title: "Biography",
      description: "Detailed player profiles and career information",
      path: "/biography",
      color: "#4299E1",
      footballIcon: "https://img.icons8.com/ios-filled/50/FFFFFF/user-male.png",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
          <path d="M12 15h.01"></path>
        </svg>
      ),
      metrics: [
        "Player details",
        "Nationality & background",
        "Position & attributes",
        "Contract information"
      ]
    },
    {
      title: "Recovery Analysis",
      description: "Monitor player recovery status and wellbeing metrics",
      path: "/recovery",
      color: "#38A169",
      footballIcon: "https://img.icons8.com/ios-filled/50/FFFFFF/sleeping.png",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 20V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14"></path>
          <path d="M2 20h20"></path>
          <path d="M14 12v.01"></path>
        </svg>
      ),
      metrics: [
        "Nutrition tracking",
        "Performance behavior adherence",
        "Sleep quality monitoring",
        "Wellness assessments"
      ]
    },
    {
      title: "External Factors",
      description: "Analyze environmental and contextual influences on performance",
      path: "/external-factors",
      color: "#DD6B20",
      footballIcon: "https://img.icons8.com/ios-filled/50/FFFFFF/coach.png",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path>
          <path d="M2 12h20"></path>
        </svg>
      ),
      metrics: [
        "Environmental influences",
        "Team dynamics assessment",
        "Group cohesion monitoring",
        "Motivational tracking"
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

      {/* Animated Football Field Background */}
      <AnimatedBackground />

      <header className="container mx-auto py-6 px-4 z-10">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-chelsea-gradient rounded-full opacity-75 blur-sm group-hover:opacity-100 transition duration-500"></div>
              <div className="relative">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo-SvkMVEyEGNlML3C7t85UPpuMulsAEO.png"
                  alt="Chelsea FC Logo"
                  width={40}
                  height={40}
                  className="mr-3"
                />
              </div>
            </div>
            <span className="text-white text-lg font-bold">CFC Performance Insights</span>
          </div>
          <nav>
            <ul className="hidden md:flex space-x-6">
              {sections.map((section) => (
                <li key={section.title}>
                  <Link 
                    href={section.path} 
                    className="text-white hover:text-[#1E54B7] transition-colors relative group"
                  >
                    <span>{section.title}</span>
                    <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-chelsea-gradient group-hover:w-full transition-all duration-300"></span>
                  </Link>
                </li>
              ))}
            </ul>
            <button className="md:hidden text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-12 z-10">
        <div className="max-w-5xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12 chelsea-glow">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 animate-fadeIn" style={{ fontFamily: "var(--heading-font)" }}>
              Performance Insights Hub
            </h1>
            <div className="w-20 h-1 bg-chelsea-gradient mx-auto mb-6"></div>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Comprehensive player performance analytics for optimized decision-making and elite development
            </p>
            
            {/* Football animation */}
            <div className="relative w-20 h-20 mx-auto mt-8 hidden md:block">
              <div className="absolute inset-0 animate-spin-slow">
                <Image 
                  src="https://img.icons8.com/ios-filled/100/FFFFFF/football2.png"
                  alt="Football"
                  width={80}
                  height={80}
                  className="opacity-30"
                />
              </div>
            </div>
          </div>

          {/* Dashboard Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {sections.map((section) => (
              <Link
                key={section.title}
                href={section.path}
                className="block"
                onMouseEnter={() => setHoveredSection(section.title)}
                onMouseLeave={() => setHoveredSection(null)}
              >
                <div className={`h-full chelsea-card card-transition flex flex-col p-6 rounded-lg ${
                  hoveredSection === section.title ? "border-[#1E54B7]/60 shadow-[0_0_15px_rgba(30,84,183,0.3)]" : ""
                }`}>
                  <div className="flex items-center mb-4 relative">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center mr-4 relative overflow-hidden" 
                      style={{ 
                        background: `linear-gradient(135deg, ${section.color}60, ${section.color}10)`,
                      }}
                    >
                      {/* Football-themed icon */}
                      <Image 
                        src={section.footballIcon}
                        alt={section.title}
                        width={24}
                        height={24}
                        className="z-10"
                      />
                      {/* Animated glow effect on hover */}
                      {hoveredSection === section.title && (
                        <div className="absolute inset-0 bg-chelsea-gradient opacity-30 animate-pulse"></div>
                      )}
                    </div>
                    <h2 className="text-xl font-bold text-white" style={{ fontFamily: "var(--heading-font)" }}>
                      {section.title}
                    </h2>
                    {/* Animated indicator on hover */}
                    {hoveredSection === section.title && (
                      <div className="absolute right-0 flex items-center text-[#1E54B7]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h14"></path>
                          <path d="m12 5 7 7-7 7"></path>
                        </svg>
                      </div>
                    )}
                  </div>
                  <p className="text-gray-300 mb-4">
                    {section.description}
                  </p>
                  <div className="mt-auto">
                    <div className="flex items-center mb-2">
                      <div className="w-3 h-3 rounded-full bg-chelsea-gradient mr-2"></div>
                      <h3 className="text-sm font-medium text-gray-200">Key Metrics</h3>
                    </div>
                    <ul className="text-sm text-gray-400 space-y-1.5">
                      {section.metrics.map((metric, idx) => (
                        <li key={idx} className="flex items-start group">
                          <span className="mr-2 text-[#1E54B7] group-hover:text-white transition-colors">•</span>
                          <span className="group-hover:text-gray-300 transition-colors">{metric}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          {/* Performance Summary Card */}
          <div className="chelsea-card p-6 md:p-8 rounded-lg">
            <h2 className="text-2xl font-bold text-white mb-6" style={{ fontFamily: "var(--heading-font)" }}>
              <span className="inline-block">
                Performance Summary
                <div className="h-1 w-full bg-chelsea-gradient mt-1"></div>
              </span>
            </h2>
            
            <div className="space-y-8">
              {/* Performance stats cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                <div className="bg-gray-800/50 rounded-lg p-5 border border-gray-700 hover:border-[#1E54B7]/40 transition field-pattern">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-gray-300 font-medium">Collected Data Points</h3>
                    <div className="bg-[#1E54B7]/20 p-1 rounded-md">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1E54B7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 3v18h18"></path>
                        <path d="m19 9-5 5-4-4-3 3"></path>
                      </svg>
                    </div>
                  </div>
                  <p className={`text-white text-3xl font-bold ${animateStats ? 'animate-count-up' : ''}`}>8,941</p>
                  <div className="mt-2 flex items-center text-green-400 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m5 12 7-7 7 7"></path>
                      <path d="M12 19V5"></path>
                    </svg>
                    <span className="ml-1">12.4% increase this month</span>
                  </div>
                </div>
                
                <div className="bg-gray-800/50 rounded-lg p-5 border border-gray-700 hover:border-[#1E54B7]/40 transition field-pattern">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-gray-300 font-medium">Avg. Distance/Session</h3>
                    <div className="bg-[#1E54B7]/20 p-1 rounded-md">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1E54B7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path>
                        <path d="M12 12v9"></path>
                        <path d="m8 17 4 4 4-4"></path>
                      </svg>
                    </div>
                  </div>
                  <p className={`text-white text-3xl font-bold ${animateStats ? 'animate-count-up' : ''}`}>4,348 <span className="text-lg font-medium text-gray-400">m</span></p>
                  <div className="mt-2 flex items-center text-green-400 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m5 12 7-7 7 7"></path>
                      <path d="M12 19V5"></path>
                    </svg>
                    <span className="ml-1">8.3% increase this month</span>
                  </div>
                </div>
                
                <div className="bg-gray-800/50 rounded-lg p-5 border border-gray-700 hover:border-[#1E54B7]/40 transition field-pattern">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-gray-300 font-medium">Max Speed Recorded</h3>
                    <div className="bg-[#1E54B7]/20 p-1 rounded-md">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1E54B7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m8 16 3-8 3 8"></path>
                        <path d="M18.42 16.258c.355-.497.538-1.086.538-1.675a3.187 3.187 0 0 0-2.131-3C16.215 8.62 13.944 7 11.144 7a4.985 4.985 0 0 0-3.551 1.469c-.82.82-1.387 1.89-1.552 3.011-.218.579-.357 1.286-.357 2.02 0 3.14 2.636 5.5 5.866 5.5h5.675a3.46 3.46 0 0 0 1.195-.218"></path>
                      </svg>
                    </div>
                  </div>
                  <p className={`text-white text-3xl font-bold ${animateStats ? 'animate-count-up' : ''}`}>32.9 <span className="text-lg font-medium text-gray-400">km/h</span></p>
                  <div className="mt-2 flex items-center text-blue-400 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 5v14"></path>
                      <path d="M19 12H5"></path>
                    </svg>
                    <span className="ml-1">No change from previous record</span>
                  </div>
                </div>
              </div>
              
              {/* Recent Highlights */}
              <div className="pt-6 border-t border-gray-700/50">
                <h3 className="text-white font-semibold mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1E54B7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                    <path d="m12 15 2 2 4-4"></path>
                    <rect width="18" height="18" x="3" y="3" rx="2"></rect>
                  </svg>
                  Recent Team Highlights
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center bg-gray-800/30 p-3 rounded-lg border border-gray-700 hover:border-[#1E54B7]/40 transition">
                    <div className="w-10 h-10 rounded-full bg-[#1E54B7]/20 flex items-center justify-center mr-3">
                      <Image 
                        src="https://img.icons8.com/ios-filled/50/FFFFFF/speed.png"
                        alt="Speed"
                        width={20}
                        height={20}
                      />
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">High-intensity workload</p>
                      <p className="text-gray-400 text-xs">Increased by 15% over the last month</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center bg-gray-800/30 p-3 rounded-lg border border-gray-700 hover:border-[#1E54B7]/40 transition">
                    <div className="w-10 h-10 rounded-full bg-[#1E54B7]/20 flex items-center justify-center mr-3">
                      <Image 
                        src="https://img.icons8.com/ios-filled/50/FFFFFF/sleep.png"
                        alt="Sleep"
                        width={20}
                        height={20}
                      />
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">Recovery metrics</p>
                      <p className="text-gray-400 text-xs">Improved sleep quality patterns reported</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center bg-gray-800/30 p-3 rounded-lg border border-gray-700 hover:border-[#1E54B7]/40 transition">
                    <div className="w-10 h-10 rounded-full bg-[#1E54B7]/20 flex items-center justify-center mr-3">
                      <Image 
                        src="https://img.icons8.com/ios-filled/50/FFFFFF/trophy.png"
                        alt="Trophy"
                        width={20}
                        height={20}
                      />
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">Physical development</p>
                      <p className="text-gray-400 text-xs">Benchmarks exceeded in 7 of 9 categories</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center bg-gray-800/30 p-3 rounded-lg border border-gray-700 hover:border-[#1E54B7]/40 transition">
                    <div className="w-10 h-10 rounded-full bg-[#1E54B7]/20 flex items-center justify-center mr-3">
                      <Image 
                        src="https://img.icons8.com/ios-filled/50/FFFFFF/health-book.png"
                        alt="Health"
                        width={20}
                        height={20}
                      />
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">Injury prevention</p>
                      <p className="text-gray-400 text-xs">23% reduction in non-contact injuries</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Quick actions */}
              <div className="pt-4 flex flex-wrap justify-center gap-4">
                <Link href="/load-demand" className="px-4 py-2 bg-chelsea-gradient rounded-md text-white font-medium hover:opacity-90 transition flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                    <path d="m8 6 4-4 4 4"></path>
                    <path d="M12 2v10.3"></path>
                    <rect width="16" height="8" x="4" y="14" rx="1"></rect>
                  </svg>
                  View Load Demand
                </Link>
                <Link href="/physical-development" className="px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-md text-white font-medium hover:bg-gray-700 transition flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="m4.93 4.93 4.24 4.24"></path>
                    <path d="m14.83 9.17 4.24-4.24"></path>
                    <path d="m14.83 14.83 4.24 4.24"></path>
                    <path d="m9.17 14.83-4.24 4.24"></path>
                    <circle cx="12" cy="12" r="4"></circle>
                  </svg>
                  Physical Development
                </Link>
                <Link href="/recovery" className="px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-md text-white font-medium hover:bg-gray-700 transition flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                    <path d="M18 16.98h-5.99c-1.1 0-1.95.94-2.48 1.9A4 4 0 0 1 2 17c.01-.7.2-1.4.57-2"></path>
                    <path d="m6 17 3.13-5.78c.53-.97.43-2.22-.26-3.07A2.97 2.97 0 0 1 8.5 5"></path>
                    <path d="m9 9 1.34-1.34C11.18 6.84 10.74 5 9.5 4h.01c-.42 0-.83.12-1.19.32L4 7"></path>
                    <path d="M10.89 12.5c.95.95 2.85.63 4.3-.7l5.83-5.83a2.5 2.5 0 0 0-3.55-3.52L11.7 8.18c-1.33 1.45-1.65 3.35-.7 4.3Z"></path>
                  </svg>
                  Recovery Status
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-8 z-10 border-t border-gray-800/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start mb-3">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo-SvkMVEyEGNlML3C7t85UPpuMulsAEO.png"
                  alt="Chelsea FC Logo"
                  width={32}
                  height={32}
                  className="mr-2"
                />
                <span className="text-white font-semibold">CFC Performance</span>
              </div>
              <p className="text-gray-400 text-sm">
                Supporting peak athletic performance through data-driven insights
              </p>
            </div>
            
            <div className="text-center">
              <h4 className="text-white font-medium mb-3">Quick Links</h4>
              <div className="flex flex-wrap justify-center gap-3">
                <Link href="/load-demand" className="text-gray-400 text-sm hover:text-[#1E54B7] transition">Load</Link>
                <Link href="/injury-history" className="text-gray-400 text-sm hover:text-[#1E54B7] transition">Injuries</Link>
                <Link href="/physical-development" className="text-gray-400 text-sm hover:text-[#1E54B7] transition">Development</Link>
                <Link href="/biography" className="text-gray-400 text-sm hover:text-[#1E54B7] transition">Biography</Link>
              </div>
            </div>
            
            <div className="text-center md:text-right">
              <h4 className="text-white font-medium mb-3">About</h4>
              <p className="text-gray-400 text-sm">
                Performance Insights Vizathon - © {new Date().getFullYear()} Chelsea Football Club
              </p>
            </div>
          </div>
          
          <div className="border-t border-gray-800/50 pt-6 text-center">
            <p className="text-gray-500 text-xs">
              All rights reserved. Chelsea FC and the Chelsea FC badge are registered trademarks of Chelsea FC Ltd.
            </p>
          </div>
        </div>
      </footer>
      
      {/* CSS for animations */}
      <style jsx>{`
        @keyframes count-up {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-count-up {
          animation: count-up 0.8s ease-out forwards;
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .animate-spin-slow {
          animation: spin-slow 10s linear infinite;
        }
      `}</style>
    </div>
  );
}