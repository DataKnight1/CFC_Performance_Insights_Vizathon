"use client"

import { useState } from "react"
import { Info } from "lucide-react"

interface InfoTooltipProps {
  text: string
}

export function InfoTooltip({ text }: InfoTooltipProps) {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div className="relative inline-block ml-2">
      <button
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={() => setIsVisible(!isVisible)}
        className="text-gray-400 hover:text-white focus:outline-none"
      >
        <Info size={16} />
      </button>

      {isVisible && (
        <div className="absolute z-10 w-64 p-3 text-sm text-white bg-gray-800 rounded-md shadow-lg -left-32 top-6">
          {text}
          <div className="absolute w-2 h-2 bg-gray-800 transform rotate-45 -top-1 left-1/2 -translate-x-1/2"></div>
        </div>
      )}
    </div>
  )
}

