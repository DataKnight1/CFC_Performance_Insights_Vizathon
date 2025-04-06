"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import AnimatedBackground from "../components/animated-background"
import { ExportButtons } from "../components/export-buttons"
import { InfoTooltip } from "../components/info-tooltip"
import { SimpleInjuryDashboard } from "./simple-dashboard"
import { InjuryInsightsPanel } from "./insights-panel"

export default function InjuryHistory() {
  
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
                <Link href="/injury-history" className="text-[#1E54B7] font-medium">
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
              <h1 className="text-3xl font-bold text-white">Injury History</h1>
              <div className="text-gray-400 mt-1">
                Historical injury data and risk assessment
                <InfoTooltip text="Track injury patterns, current status, risk factors, and recommended prehabilitation protocols." />
              </div>
            </div>
            <div className="mt-4 md:mt-0">
              <ExportButtons
                buttonText="Generate Report"
                filename="injury_analysis_report.csv"
              />
            </div>
          </div>

          {/* Simple Injury Dashboard with static data */}
          <SimpleInjuryDashboard />
          
          {/* Role-specific insights panel */}
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Injury Analysis Insights</h2>
              <div className="flex space-x-2">
                <select 
                  className="bg-gray-800 text-white border border-gray-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E54B7]"
                  defaultValue="coach"
                  onChange={(e) => {
                    const element = document.getElementById('injury-insights-container');
                    if (element) {
                      element.dataset.role = e.target.value;
                    }
                  }}
                >
                  <option value="coach">Coach View</option>
                  <option value="analyst">Analyst View</option>
                  <option value="director">Director View</option>
                </select>
              </div>
            </div>
            
            <div id="injury-insights-container" data-role="coach">
              <InjuryInsightsPanel role="coach" />
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

