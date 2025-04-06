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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-gray-900 bg-opacity-70 backdrop-blur-sm p-6 rounded-lg border border-gray-800">
              <h3 className="text-xl font-medium text-white mb-4">Sleep Analysis</h3>
              <div className="h-[300px] flex items-center justify-center">
                <div className="w-full h-full relative">
                  {/* Sleep chart simulation */}
                  <svg className="w-full h-full" viewBox="0 0 1000 300" preserveAspectRatio="none">
                    {/* Sleep stages */}
                    <rect x="0" y="50" width="1000" height="50" fill="#1E54B7" fillOpacity="0.2" />
                    <rect x="0" y="100" width="1000" height="50" fill="#1E54B7" fillOpacity="0.4" />
                    <rect x="0" y="150" width="1000" height="50" fill="#1E54B7" fillOpacity="0.6" />
                    <rect x="0" y="200" width="1000" height="50" fill="#1E54B7" fillOpacity="0.8" />

                    {/* Sleep pattern */}
                    <path
                      d="M0,50 L100,50 L100,100 L200,100 L200,150 L300,150 L300,200 L400,200 L400,150 L500,150 L500,200 L600,200 L600,150 L700,150 L700,100 L800,100 L800,50 L900,50 L900,100 L1000,100"
                      fill="none"
                      stroke="#0CAFFF"
                      strokeWidth="3"
                    />

                    {/* Time markers */}
                    <line x1="0" y1="250" x2="1000" y2="250" stroke="#444" strokeWidth="1" />
                    <line x1="0" y1="0" x2="0" y2="250" stroke="#444" strokeWidth="1" />
                    <line x1="125" y1="248" x2="125" y2="252" stroke="#444" strokeWidth="1" />
                    <line x1="250" y1="248" x2="250" y2="252" stroke="#444" strokeWidth="1" />
                    <line x1="375" y1="248" x2="375" y2="252" stroke="#444" strokeWidth="1" />
                    <line x1="500" y1="248" x2="500" y2="252" stroke="#444" strokeWidth="1" />
                    <line x1="625" y1="248" x2="625" y2="252" stroke="#444" strokeWidth="1" />
                    <line x1="750" y1="248" x2="750" y2="252" stroke="#444" strokeWidth="1" />
                    <line x1="875" y1="248" x2="875" y2="252" stroke="#444" strokeWidth="1" />
                    <line x1="1000" y1="248" x2="1000" y2="252" stroke="#444" strokeWidth="1" />

                    {/* Time labels */}
                    <text x="0" y="270" fill="#ccc" fontSize="10" textAnchor="middle">
                      10PM
                    </text>
                    <text x="125" y="270" fill="#ccc" fontSize="10" textAnchor="middle">
                      11PM
                    </text>
                    <text x="250" y="270" fill="#ccc" fontSize="10" textAnchor="middle">
                      12AM
                    </text>
                    <text x="375" y="270" fill="#ccc" fontSize="10" textAnchor="middle">
                      1AM
                    </text>
                    <text x="500" y="270" fill="#ccc" fontSize="10" textAnchor="middle">
                      2AM
                    </text>
                    <text x="625" y="270" fill="#ccc" fontSize="10" textAnchor="middle">
                      3AM
                    </text>
                    <text x="750" y="270" fill="#ccc" fontSize="10" textAnchor="middle">
                      4AM
                    </text>
                    <text x="875" y="270" fill="#ccc" fontSize="10" textAnchor="middle">
                      5AM
                    </text>
                    <text x="1000" y="270" fill="#ccc" fontSize="10" textAnchor="middle">
                      6AM
                    </text>

                    {/* Sleep stage labels */}
                    <text x="990" y="75" fill="#ccc" fontSize="10" textAnchor="end">
                      Awake
                    </text>
                    <text x="990" y="125" fill="#ccc" fontSize="10" textAnchor="end">
                      Light Sleep
                    </text>
                    <text x="990" y="175" fill="#ccc" fontSize="10" textAnchor="end">
                      Deep Sleep
                    </text>
                    <text x="990" y="225" fill="#ccc" fontSize="10" textAnchor="end">
                      REM Sleep
                    </text>
                  </svg>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="text-gray-400 text-sm">Total Sleep</p>
                  <p className="text-white font-medium">8h 12m</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Sleep Efficiency</p>
                  <p className="text-white font-medium">94%</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Deep Sleep</p>
                  <p className="text-white font-medium">2h 15m (27%)</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">REM Sleep</p>
                  <p className="text-white font-medium">1h 45m (21%)</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 bg-opacity-70 backdrop-blur-sm p-6 rounded-lg border border-gray-800">
              <h3 className="text-xl font-medium text-white mb-4">Recovery Trend</h3>
              <div className="h-[300px] flex items-center justify-center">
                <div className="w-full h-full relative">
                  {/* Line chart simulation */}
                  <svg className="w-full h-full" viewBox="0 0 1000 300" preserveAspectRatio="none">
                    {/* Grid lines */}
                    <line x1="0" y1="50" x2="1000" y2="50" stroke="#333" strokeWidth="1" strokeDasharray="5,5" />
                    <line x1="0" y1="100" x2="1000" y2="100" stroke="#333" strokeWidth="1" strokeDasharray="5,5" />
                    <line x1="0" y1="150" x2="1000" y2="150" stroke="#333" strokeWidth="1" strokeDasharray="5,5" />
                    <line x1="0" y1="200" x2="1000" y2="200" stroke="#333" strokeWidth="1" strokeDasharray="5,5" />
                    <line x1="0" y1="250" x2="1000" y2="250" stroke="#333" strokeWidth="1" strokeDasharray="5,5" />

                    {/* Recovery score line */}
                    <path
                      d="M0,150 C50,170 100,180 150,160 C200,140 250,120 300,100 C350,80 400,70 450,90 C500,110 550,130 600,120 C650,110 700,90 750,70 C800,50 850,60 900,80 C950,100 1000,90 1000,90"
                      fill="none"
                      stroke="#1E54B7"
                      strokeWidth="3"
                    />

                    {/* Sleep quality line */}
                    <path
                      d="M0,180 C50,190 100,200 150,180 C200,160 250,140 300,120 C350,100 400,90 450,110 C500,130 550,150 600,140 C650,130 700,110 750,90 C800,70 850,80 900,100 C950,120 1000,110 1000,110"
                      fill="none"
                      stroke="#0CAFFF"
                      strokeWidth="3"
                      strokeDasharray="5,5"
                    />

                    {/* Day markers */}
                    <line x1="0" y1="250" x2="0" y2="255" stroke="#444" strokeWidth="1" />
                    <line x1="143" y1="250" x2="143" y2="255" stroke="#444" strokeWidth="1" />
                    <line x1="286" y1="250" x2="286" y2="255" stroke="#444" strokeWidth="1" />
                    <line x1="429" y1="250" x2="429" y2="255" stroke="#444" strokeWidth="1" />
                    <line x1="572" y1="250" x2="572" y2="255" stroke="#444" strokeWidth="1" />
                    <line x1="715" y1="250" x2="715" y2="255" stroke="#444" strokeWidth="1" />
                    <line x1="858" y1="250" x2="858" y2="255" stroke="#444" strokeWidth="1" />
                    <line x1="1000" y1="250" x2="1000" y2="255" stroke="#444" strokeWidth="1" />

                    {/* Day labels */}
                    <text x="0" y="270" fill="#ccc" fontSize="10" textAnchor="middle">
                      Mon
                    </text>
                    <text x="143" y="270" fill="#ccc" fontSize="10" textAnchor="middle">
                      Tue
                    </text>
                    <text x="286" y="270" fill="#ccc" fontSize="10" textAnchor="middle">
                      Wed
                    </text>
                    <text x="429" y="270" fill="#ccc" fontSize="10" textAnchor="middle">
                      Thu
                    </text>
                    <text x="572" y="270" fill="#ccc" fontSize="10" textAnchor="middle">
                      Fri
                    </text>
                    <text x="715" y="270" fill="#ccc" fontSize="10" textAnchor="middle">
                      Sat
                    </text>
                    <text x="858" y="270" fill="#ccc" fontSize="10" textAnchor="middle">
                      Sun
                    </text>
                    <text x="1000" y="270" fill="#ccc" fontSize="10" textAnchor="middle">
                      Mon
                    </text>

                    {/* Score labels */}
                    <text x="10" y="50" fill="#ccc" fontSize="10" textAnchor="start">
                      100
                    </text>
                    <text x="10" y="100" fill="#ccc" fontSize="10" textAnchor="start">
                      80
                    </text>
                    <text x="10" y="150" fill="#ccc" fontSize="10" textAnchor="start">
                      60
                    </text>
                    <text x="10" y="200" fill="#ccc" fontSize="10" textAnchor="start">
                      40
                    </text>
                    <text x="10" y="250" fill="#ccc" fontSize="10" textAnchor="start">
                      20
                    </text>
                  </svg>
                </div>
              </div>
              <div className="flex justify-center space-x-8 mt-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-[#1E54B7] rounded-full mr-2"></div>
                  <span className="text-sm text-gray-300">Recovery Score</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-[#0CAFFF] rounded-full mr-2"></div>
                  <span className="text-sm text-gray-300">Sleep Quality</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-gray-900 bg-opacity-70 backdrop-blur-sm p-6 rounded-lg border border-gray-800">
              <h3 className="text-xl font-medium text-white mb-4">Hydration Status</h3>
              <div className="flex justify-center mb-6">
                <div className="relative w-32 h-48">
                  <div
                    className="absolute inset-x-0 bottom-0 w-full bg-[#1E54B7]/20 rounded-b-lg"
                    style={{ height: "85%" }}
                  ></div>
                  <div
                    className="absolute inset-x-0 bottom-0 w-full bg-[#1E54B7]/40 rounded-b-lg"
                    style={{ height: "70%" }}
                  ></div>
                  <div
                    className="absolute inset-x-0 bottom-0 w-full bg-[#1E54B7]/60 rounded-b-lg"
                    style={{ height: "55%" }}
                  ></div>
                  <div
                    className="absolute inset-x-0 bottom-0 w-full bg-[#1E54B7] rounded-b-lg"
                    style={{ height: "40%" }}
                  ></div>
                  <div className="absolute inset-0 border-2 border-gray-600 rounded-lg"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">85%</span>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <p className="text-gray-300 mb-2">Daily Target: 3.5L</p>
                <p className="text-white">Current: 3.0L</p>
                <p className="text-[#1E54B7] text-sm mt-2">+0.5L needed</p>
              </div>
            </div>

            <div className="bg-gray-900 bg-opacity-70 backdrop-blur-sm p-6 rounded-lg border border-gray-800">
              <h3 className="text-xl font-medium text-white mb-4">Nutrition Status</h3>
              <div className="flex justify-center mb-6">
                <div className="w-40 h-40 relative">
                  {/* Pie chart simulation */}
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="transparent"
                      stroke="#1E54B7"
                      strokeWidth="10"
                      strokeDasharray="141.3 282.6"
                      strokeDashoffset="0"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="transparent"
                      stroke="#0CAFFF"
                      strokeWidth="10"
                      strokeDasharray="84.8 282.6"
                      strokeDashoffset="-141.3"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="transparent"
                      stroke="#365EFF"
                      strokeWidth="10"
                      strokeDasharray="56.5 282.6"
                      strokeDashoffset="-226.1"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-[60%] h-[60%] rounded-full bg-gray-900 flex items-center justify-center">
                      <span className="text-white text-sm">2,400 kcal</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-gray-400 text-xs">Protein</p>
                  <p className="text-white text-sm">50%</p>
                  <p className="text-[#1E54B7] text-xs">120g</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Carbs</p>
                  <p className="text-white text-sm">30%</p>
                  <p className="text-[#0CAFFF] text-xs">180g</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Fats</p>
                  <p className="text-white text-sm">20%</p>
                  <p className="text-[#365EFF] text-xs">53g</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 bg-opacity-70 backdrop-blur-sm p-6 rounded-lg border border-gray-800">
              <h3 className="text-xl font-medium text-white mb-4">Stress & Recovery</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-300">Stress Level</span>
                    <span className="text-sm text-[#1E54B7]">Low</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-[#1E54B7] h-2 rounded-full" style={{ width: "25%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-300">HRV (ms)</span>
                    <span className="text-sm text-[#1E54B7]">78</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-[#1E54B7] h-2 rounded-full" style={{ width: "78%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-300">Resting HR (bpm)</span>
                    <span className="text-sm text-[#1E54B7]">52</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-[#1E54B7] h-2 rounded-full" style={{ width: "52%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-300">Recovery Rate</span>
                    <span className="text-sm text-[#1E54B7]">Excellent</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-[#1E54B7] h-2 rounded-full" style={{ width: "90%" }}></div>
                  </div>
                </div>
              </div>
            </div>
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

