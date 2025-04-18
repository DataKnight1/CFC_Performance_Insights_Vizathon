"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import AnimatedBackground from "../components/animated-background"
import { ExportButtons } from "../components/export-buttons"
import { InfoTooltip } from "../components/info-tooltip"
import { fetchPhysicalCapabilityData } from "../utils/physical-capability-data"
import { PhysicalDevelopmentDashboard } from "./physical-development-dashboard"
import { SimplePhysicalDashboard } from "./simple-dashboard"
import { PhysicalInsightsPanel } from "./insights-panel"

export default function PhysicalDevelopment() {
  const [physicalData, setPhysicalData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [role, setRole] = useState<'coach' | 'analyst' | 'director'>('coach')
  
  useEffect(() => {
    async function loadData() {
      try {
        console.log("Physical development page: Loading physical data")
        // Use relative URL with basePath support for GitHub Pages
        const basePath = process.env.NODE_ENV === 'production' ? '/CFC_Performance_Insights_Vizathon' : '';
        const response = await fetch(`${basePath}/api/data/mock-physical`);
        if (!response.ok) {
          console.warn(`Falling back to mock data due to API error: ${response.status} ${response.statusText}`);
          // Fall back to static mock data if API fails on GitHub Pages
          setPhysicalData(generateMockPhysicalData());
          return;
        }
        
        // Parse the JSON response directly
        const jsonData = await response.json();
        console.log("Physical development page: Data loaded:", jsonData.length, "records")
        
        setPhysicalData(jsonData)
      } catch (error) {
        console.error("Error loading physical capability data:", error)
        // Fall back to static mock data on error
        setPhysicalData(generateMockPhysicalData());
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [])
  
  // Fallback function to generate mock data if API fails
  function generateMockPhysicalData() {
    const movements = ["Sprint", "Jump", "Agility", "Strength", "Endurance"];
    const qualities = {
      "Sprint": ["Acceleration", "Max velocity", "Technique", "Power"],
      "Jump": ["Take off", "Land", "Vertical power", "Horizontal power"],
      "Agility": ["Acceleration", "Deceleration", "Change of direction", "Balance"],
      "Strength": ["Upper body", "Lower body", "Core", "Functional"],
      "Endurance": ["Aerobic", "Anaerobic", "Recovery", "Stamina"]
    };
    
    const expressions = ["Dynamic", "Isometric", "Concentric", "Eccentric"];
    
    // Generate dates for the last 90 days
    const dates = [];
    const today = new Date();
    for (let i = 90; i >= 0; i -= 2) { // Every 2 days
      const date = new Date();
      date.setDate(today.getDate() - i);
      dates.push(date.toISOString().split('T')[0]); // Format as YYYY-MM-DD
    }
    
    const mockData = [];
    
    // Generate data for all movement types across all dates
    dates.forEach(date => {
      movements.forEach(movement => {
        // Get qualities for this movement
        const movementQualities = qualities[movement];
        
        // Add entries for each quality
        movementQualities.forEach(quality => {
          // Calculate a benchmark that improves slightly over time to show progression
          // Base score between 70-90 with some random variation
          const dayIndex = dates.indexOf(date);
          const improvementFactor = dayIndex / dates.length * 10; // Max 10% improvement over time
          const baseScore = 70 + Math.random() * 20;
          const benchmarkPct = Math.min(baseScore + improvementFactor, 95);
          
          // Random expression
          const expression = expressions[Math.floor(Math.random() * expressions.length)];
          
          mockData.push({
            date,
            movement,
            quality,
            expression,
            benchmarkPct: parseFloat(benchmarkPct.toFixed(1))
          });
        });
      });
    });
    
    return mockData;
  }
  
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
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo-SvkMVEyEGNlML3C7t85UPpuMulsAEO.png"
              alt="Chelsea FC Logo"
              width={40}
              height={40}
              className="mr-3"
            />
            <span className="text-white text-lg font-bold">CFC Vizathon</span>
          </Link>
          <nav>
            <ul className="hidden md:flex space-x-6">
              <li>
                <Link href="/load-demand" className="text-white hover:text-[#1E54B7] transition-colors">
                  Load Demand
                </Link>
              </li>
              <li>
                <Link href="/injury-history" className="text-white hover:text-[#1E54B7] transition-colors">
                  Injury History
                </Link>
              </li>
              <li>
                <Link href="/physical-development" className="text-[#1E54B7] font-medium">
                  Physical Development
                </Link>
              </li>
              <li>
                <Link href="/recovery" className="text-white hover:text-[#1E54B7] transition-colors">
                  Recovery
                </Link>
              </li>
              <li>
                <Link href="/biography" className="text-white hover:text-[#1E54B7] transition-colors">
                  Biography
                </Link>
              </li>
              <li>
                <Link href="/external-factors" className="text-white hover:text-[#1E54B7] transition-colors">
                  External Factors
                </Link>
              </li>
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
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white">Physical Development</h1>
              <div className="text-gray-400 mt-1">
                Physical capability and development tracking
                <InfoTooltip text="Monitor physical test capabilities, development plans, and strength & conditioning progress over time." />
              </div>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-4">
              <ExportButtons data={physicalData} filename="physical_capability_data.csv" buttonText="Export Data" />
            </div>
          </div>

          {/* Physical Development Dashboard with actual data */}
          {physicalData.length > 0 ? (
            <PhysicalDevelopmentDashboard physicalData={physicalData} />
          ) : (
            loading ? (
              <div className="h-[400px] flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#1E54B7]"></div>
              </div>
            ) : (
              <SimplePhysicalDashboard />
            )
          )}
          
          {/* Role-specific insights panel */}
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Physical Development Insights</h2>
              <div className="flex space-x-2">
                <select 
                  className="bg-gray-800 text-white border border-gray-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E54B7]"
                  value={role}
                  onChange={(e) => setRole(e.target.value as 'coach' | 'analyst' | 'director')}
                >
                  <option value="coach">Coach View</option>
                  <option value="analyst">Analyst View</option>
                  <option value="director">Director View</option>
                </select>
              </div>
            </div>
            
            <PhysicalInsightsPanel role={role} />
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
  )
}

