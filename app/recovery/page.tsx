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
  
  // Function to generate mock recovery data if API fails
  function generateMockRecoveryData() {
    // Generate dates for the last 100 days
    const mockData = [];
    const today = new Date();
    
    for (let i = 100; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      
      // Base values that improve over time with some randomness
      const dayIndex = 100 - i; // 0 for oldest, 100 for today
      const improvement = dayIndex / 200; // Gradual improvement factor
      
      // Generate some random ups and downs to make it look realistic
      const randomFactor = Math.sin(i * 0.7) * 0.1; // Sine wave variation
      const matchDayEffect = i % 7 === 0 ? -0.1 : 0; // Lower scores on match days (every 7 days)
      const randomNoise = (Math.random() - 0.5) * 0.05; // Small random noise
      
      // Combine factors for the day's adjustment
      const dayAdjustment = improvement + randomFactor + matchDayEffect + randomNoise;
      
      // Create a baseline for this day (0.5 to 0.9 range)
      let baseline = Math.min(Math.max(0.7 + dayAdjustment, 0.5), 0.9);
      
      // Add to data array
      mockData.push({
        "date": dateString,
        "bio_completeness": baseline + (Math.random() * 0.1),
        "bio_composite": baseline - (Math.random() * 0.1),
        "msk_joint_range_completeness": baseline + (Math.random() * 0.15),
        "msk_joint_range_composite": baseline,
        "msk_load_tolerance_completeness": baseline - (Math.random() * 0.05),
        "msk_load_tolerance_composite": baseline - (Math.random() * 0.1),
        "subjective_completeness": baseline + (Math.random() * 0.2),
        "subjective_composite": baseline + (Math.random() * 0.1),
        "soreness_completeness": baseline,
        "soreness_composite": baseline - (Math.random() * 0.05),
        "sleep_completeness": baseline + (Math.random() * 0.1),
        "sleep_composite": baseline,
        "emboss_baseline_score": baseline + (Math.random() * 0.05) - 0.025,
        "stress_load_composite": baseline - (Math.random() * 0.1)
      });
    }
    
    return mockData;
  }
  
  useEffect(() => {
    async function loadData() {
      try {
        console.log("Recovery page: Loading recovery data")
        
        // Use relative URL with basePath support for GitHub Pages
        const basePath = process.env.NODE_ENV === 'production' ? '/CFC_Performance_Insights_Vizathon' : '';
        const response = await fetch(`${basePath}/api/data/mock-recovery`);
        if (!response.ok) {
          console.warn(`Falling back to mock data due to API error: ${response.status} ${response.statusText}`);
          // Fall back to static mock data if API fails on GitHub Pages
          setRecoveryData(generateMockRecoveryData());
          return;
        }
        
        // Parse the JSON response directly
        const jsonData = await response.json();
        console.log("Recovery page: Recovery data loaded:", jsonData.length, "records") 
        
        setRecoveryData(jsonData);
      } catch (error) {
        console.error("Error loading recovery data:", error)
        // Fall back to static mock data on error
        setRecoveryData(generateMockRecoveryData());
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [])
  
  // Fallback function to generate mock data if API fails
  function generateMockRecoveryData() {
    // Generate dates for the last 100 days
    const mockData = [];
    const today = new Date();
    
    for (let i = 100; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      
      // Base values that improve over time with some randomness
      const dayIndex = 100 - i; // 0 for oldest, 100 for today
      const improvement = dayIndex / 200; // Gradual improvement factor
      
      // Generate some random ups and downs to make it look realistic
      const randomFactor = Math.sin(i * 0.7) * 0.1; // Sine wave variation
      const matchDayEffect = i % 7 === 0 ? -0.1 : 0; // Lower scores on match days (every 7 days)
      const randomNoise = (Math.random() - 0.5) * 0.05; // Small random noise
      
      // Combine factors for the day's adjustment
      const dayAdjustment = improvement + randomFactor + matchDayEffect + randomNoise;
      
      // Create a baseline for this day (0.5 to 0.9 range)
      let baseline = Math.min(Math.max(0.7 + dayAdjustment, 0.5), 0.9);
      
      // Add to data array
      mockData.push({
        "date": dateString,
        "bio_completeness": baseline + (Math.random() * 0.1),
        "bio_composite": baseline - (Math.random() * 0.1),
        "msk_joint_range_completeness": baseline + (Math.random() * 0.15),
        "msk_joint_range_composite": baseline,
        "msk_load_tolerance_completeness": baseline - (Math.random() * 0.05),
        "msk_load_tolerance_composite": baseline - (Math.random() * 0.1),
        "subjective_completeness": baseline + (Math.random() * 0.2),
        "subjective_composite": baseline + (Math.random() * 0.1),
        "soreness_completeness": baseline,
        "soreness_composite": baseline - (Math.random() * 0.05),
        "sleep_completeness": baseline + (Math.random() * 0.1),
        "sleep_composite": baseline,
        "emboss_baseline_score": baseline + (Math.random() * 0.05) - 0.025,
        "stress_load_composite": baseline - (Math.random() * 0.1)
      });
    }
    
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
