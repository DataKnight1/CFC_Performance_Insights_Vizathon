"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import AnimatedBackground from "../components/animated-background"
import { RecoveryData } from "../components/recovery-data"
import { ExportButtons } from "../components/export-buttons"
import { InfoTooltip } from "../components/info-tooltip"
import { RecoveryMetricsDisplay } from "./recovery-metrics-display"

export default function Recovery() {
  const [recoveryData, setRecoveryData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [timeFrame, setTimeFrame] = useState<'7days' | '30days' | '90days'>('7days')
  
  useEffect(() => {
    async function loadData() {
      try {
        console.log("Recovery page: Loading recovery data")
        
        // Fetch data directly with a timeout
        const response = await fetch('/api/data/mock-recovery');
        if (!response.ok) {
          throw new Error(`Failed to fetch recovery data: ${response.status} ${response.statusText}`);
        }
        
        // Parse the JSON response directly
        const jsonData = await response.json();
        console.log("Recovery page: Recovery data loaded:", jsonData.length, "records") 
        
        setRecoveryData(jsonData);
      } catch (error) {
        console.error("Error loading recovery data:", error)
        // Set empty array to avoid undefined errors
        setRecoveryData([])
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
                <Link href="/physical-development" className="text-white hover:text-[#1E54B7] transition-colors">
                  Physical Development
                </Link>
              </li>
              <li>
                <Link href="/recovery" className="text-[#1E54B7] font-medium">
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
              <h1 className="text-3xl font-bold text-white">Recovery Metrics</h1>
              <div className="text-gray-400 mt-1">
                Sleep, wellness, and recovery analytics 
                <InfoTooltip text="Track metrics including sleep quality, soreness, and biomarkers to optimize the player's recovery process." />
              </div>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-4">
              <ExportButtons data={recoveryData} filename="recovery_data.csv" buttonText="Generate Report" />
            </div>
          </div>

          {/* Recovery Metrics Display */}
          {loading ? (
            <div className="h-[200px] flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#1E54B7]"></div>
            </div>
          ) : (
            <RecoveryMetricsDisplay 
              recoveryData={recoveryData} 
              initialTimeFrame={timeFrame} 
              onTimeFrameChange={setTimeFrame} 
            />
          )}

          <div className="bg-gray-900 bg-opacity-70 backdrop-blur-sm p-6 rounded-lg border border-gray-800 mb-8">
            <h3 className="text-xl font-medium text-white mb-4">Recovery Priorities</h3>
            <RecoveryData />
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
