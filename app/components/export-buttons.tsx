"use client"

import { useState } from "react"
import { downloadCSV, printToPDF } from "../utils/export-utils"
import { getExternalFactorsData } from "../utils/external-factors"

interface ExportButtonsProps {
  data?: any[]
  filename?: string
  buttonText?: string
  dataType?: 'default' | 'externalFactors'
}

export function ExportButtons({ 
  data = [], 
  filename = "export.csv", 
  buttonText = "Export Data",
  dataType = 'default'
}: ExportButtonsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showOptions, setShowOptions] = useState(false)

  const handleExportCSV = () => {
    setIsLoading(true)
    try {
      if (dataType === 'externalFactors') {
        const externalFactorsDataResult = getExternalFactorsData()
        
        // Create a flattened representation of the data for CSV export
        const flattenedData = [
          // Weather data
          ...externalFactorsDataResult.weather.map(w => ({
            type: 'weather',
            date: w.date,
            temperature: w.temperature,
            humidity: w.humidity,
            windSpeed: w.windSpeed,
            rainfall: w.rainfall,
            condition: w.condition
          })),
          
          // Pitch data
          ...externalFactorsDataResult.pitches.map(p => ({
            type: 'pitch',
            venue: p.venue,
            quality: p.quality,
            firmness: p.firmness,
            wetness: p.wetness
          })),
          
          // Travel data
          ...externalFactorsDataResult.travel.map(t => ({
            type: 'travel',
            departure: t.departure,
            destination: t.destination,
            distance: t.distance,
            date: t.date,
            competition: t.competition,
            timeZoneDiff: t.timeZoneDiff
          }))
        ]
        
        downloadCSV(flattenedData, "external-factors-data.csv")
      } else {
        downloadCSV(data, filename)
      }
    } catch (error) {
      console.error("Error exporting CSV:", error)
    } finally {
      setIsLoading(false)
      setShowOptions(false)
    }
  }

  const handlePrintPDF = () => {
    setIsLoading(true)
    try {
      printToPDF()
    } catch (error) {
      console.error("Error printing PDF:", error)
    } finally {
      setIsLoading(false)
      setShowOptions(false)
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowOptions(!showOptions)}
        disabled={isLoading}
        className="bg-[#1E54B7] text-white px-4 py-2 rounded-md text-sm hover:bg-[#1E54B7]/80 transition-colors disabled:opacity-50"
      >
        {isLoading ? "Processing..." : buttonText}
      </button>

      {showOptions && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg z-20">
          <div className="py-1">
            <button
              onClick={handleExportCSV}
              className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700"
            >
              Export as CSV
            </button>
            <button
              onClick={handlePrintPDF}
              className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700"
            >
              Export as PDF
            </button>
          </div>
        </div>
      )}
    </div>
  )
}