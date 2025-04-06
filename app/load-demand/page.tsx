"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import AnimatedBackground from "../components/animated-background"
import { ExportButtons } from "../components/export-buttons"
import { InfoTooltip } from "../components/info-tooltip"
import { fetchGPSData } from "../utils/gps-data"
import { LoadDemandDashboard } from "./load-demand-dashboard"
import { TestDashboard } from "./test-dashboard"
import { SimpleDashboard } from "./simple-dashboard"
import { InsightsPanel } from "./insights-panel"

export default function LoadDemand() {
  const [gpsData, setGpsData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [timeFrame, setTimeFrame] = useState<'7days' | '30days' | '90days' | 'all'>('30days')
  const [role, setRole] = useState<'coach' | 'analyst' | 'director'>('coach')
  
  useEffect(() => {
    async function loadData() {
      try {
        console.log("Load demand page: Loading GPS data")
        
        // Fetch data directly with a timeout
        const response = await fetch('/api/data/simple-gps');
        if (!response.ok) {
          throw new Error(`Failed to fetch GPS data: ${response.status} ${response.statusText}`);
        }
        
        // Parse the JSON response directly
        const jsonData = await response.json();
        console.log("Load demand page: GPS data loaded:", jsonData.length, "records") 
        
        // Convert string values to numbers if needed
        const processedData = jsonData.map((item: any) => ({
          ...item,
          distance: typeof item.distance === 'number' ? item.distance : parseFloat(item.distance) || 0,
          distance_over_21: typeof item.distance_over_21 === 'number' ? item.distance_over_21 : parseFloat(item.distance_over_21) || 0,
          distance_over_24: typeof item.distance_over_24 === 'number' ? item.distance_over_24 : parseFloat(item.distance_over_24) || 0,
          distance_over_27: typeof item.distance_over_27 === 'number' ? item.distance_over_27 : parseFloat(item.distance_over_27) || 0,
          accel_decel_over_2_5: typeof item.accel_decel_over_2_5 === 'number' ? item.accel_decel_over_2_5 : parseFloat(item.accel_decel_over_2_5) || 0,
          accel_decel_over_3_5: typeof item.accel_decel_over_3_5 === 'number' ? item.accel_decel_over_3_5 : parseFloat(item.accel_decel_over_3_5) || 0,
          accel_decel_over_4_5: typeof item.accel_decel_over_4_5 === 'number' ? item.accel_decel_over_4_5 : parseFloat(item.accel_decel_over_4_5) || 0,
          day_duration: typeof item.day_duration === 'number' ? item.day_duration : parseFloat(item.day_duration) || 0,
          peak_speed: typeof item.peak_speed === 'number' ? item.peak_speed : parseFloat(item.peak_speed) || 0,
        }));
        
        setGpsData(processedData);
      } catch (error) {
        console.error("Error loading GPS data:", error)
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [])
  
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
                <Link href="/load-demand" className="text-[#1E54B7] font-medium">
                  Load Demand
                </Link>
              </li>
              <li>
                <Link href="/injury-history" className="text-white hover:text-[#1E54B7] transition-colors">
                  Injury History
                </Link>
              </li>
              <li>
                <Link href="/physical-development" className="text-white hover:text-[#1E54B7] transition-colors">
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
              <h1 className="text-3xl font-bold text-white">Load Demand</h1>
              <div className="text-gray-400 mt-1">
                Physical movement and workload metrics
                <InfoTooltip text="Track player movement demands including speed, distance, and acceleration to assess workload and physical output." />
              </div>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-4">
              <select 
                className="bg-gray-800 text-white border border-gray-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E54B7]"
                value={timeFrame}
                onChange={(e) => setTimeFrame(e.target.value as '7days' | '30days' | '90days' | 'all')}
              >
                <option value="7days">Last 7 days</option>
                <option value="30days">Last 30 days</option>
                <option value="90days">Last 90 days</option>
                <option value="all">All Data</option>
              </select>
              <ExportButtons data={gpsData} filename="load_demand_data.csv" buttonText="Export Data" />
            </div>
          </div>

          {/* LoadDemand Dashboard with real data */}
          {gpsData.length > 0 ? (
            <LoadDemandDashboard gpsData={gpsData} />
          ) : (
            loading ? (
              <div className="h-[400px] flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#1E54B7]"></div>
              </div>
            ) : (
              <SimpleDashboard />
            )
          )}
          
          {/* Role-specific insights panel */}
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Performance Insights</h2>
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
            
            <InsightsPanel role={role} />
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