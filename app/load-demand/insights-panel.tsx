"use client";

import { useState } from "react";

interface InsightsPanelProps {
  role: "coach" | "analyst" | "director" | "all";
}

export function InsightsPanel({ role }: InsightsPanelProps) {
  const [expandedInsight, setExpandedInsight] = useState<number | null>(null);
  
  // Common insights based on GPS data analysis
  const gpsInsights = {
    coach: [
      {
        title: "Match Day Loading Pattern",
        detail: "Data indicates players experiencing highest peak speeds (32.9 km/h) during matches, with significant accumulation of high-intensity distance (avg 325m per match). Consider implementing more speed-based drills in MD-2 training sessions to better prepare players for match demands.",
        action: "Implement progressive speed exposures in MD-2 sessions, focusing on achieving 85-90% of match high-speed distance."
      },
      {
        title: "Recovery Timing Optimization",
        detail: "Players show reduced high-intensity output following congested fixtures (10.2% decrease in distance >24 km/h). Current data suggests 72 hours is insufficient for complete neuromuscular recovery.",
        action: "Extend recovery protocols to 96 hours post-match for players exceeding 9km total match distance, with modified training loads during this period."
      },
      {
        title: "Position-Specific Loading",
        detail: "Wide players accumulate 34% more high-intensity distance than central players, but show more significant performance decrements in the final 15 minutes of matches.",
        action: "Implement position-specific conditioning protocols focusing on repeated sprint ability for wide players to maintain performance throughout the full 90 minutes."
      }
    ],
    
    analyst: [
      {
        title: "Performance Output Trends",
        detail: "Analysis reveals a strong positive correlation (r=0.78) between total high-intensity distance in training (>21 km/h) and successful offensive actions in matches. Players who accumulate >600m at high intensity in MD-2 sessions show 23% more successful offensive actions in the subsequent match.",
        action: "Track and forecast individual player high-intensity capabilities to optimize tactical decisions and substitution timing."
      },
      {
        title: "Load Distribution Analysis",
        detail: "When comparing the data from different training days, MD-2 sessions show optimal balance between intensity (65% of match demands) and volume (70% of match demands), while MD-3 sessions show higher total distance but lower intensity metrics.",
        action: "Recommend adjustments to MD-3 protocol to introduce more quality (intensity) work while maintaining current volume."
      },
      {
        title: "Speed-to-Success Correlation",
        detail: "There's a significant correlation between peak speed achievement and performance metrics. Players reaching >30 km/h in matches have 37% more attacking third entries and 26% more successful dribbles.",
        action: "Develop speed profile benchmarks for each position to guide recruitment strategy and drive individual development programs."
      }
    ],
    
    director: [
      {
        title: "Performance Investment ROI",
        detail: "Players with consistent exposure to speed training (>25 km/h) show 42% fewer soft tissue injuries and 16% higher match availability. Current data indicates potential for 8% increase in player availability through optimized training methodology.",
        action: "Prioritize investment in speed development technology and specialized coaching to enhance player durability and performance ceiling."
      },
      {
        title: "Physical Development Trajectory",
        detail: "Data indicates younger players (U23) require approximately 18 months to adapt to first-team physical demands. Current methodology shows players reach physical maturity at 24.3 years on average.",
        action: "Implement graduated physical development pathway to accelerate physical adaptation of academy players, targeting 12-month transition period."
      },
      {
        title: "Performance Profile Benchmarking",
        detail: "Analysis reveals our high-performing wide players accumulate 1200-1500m of high-intensity distance per match, which exceeds league average by 11% but falls short of Champions League top 8 clubs by 8%.",
        action: "Establish targeted recruitment profiles with specific physical benchmarks (e.g., peak speed >32 km/h for wide attackers) to close performance gap with elite European clubs."
      }
    ]
  };
  
  // Select which insights to display based on role
  const displayInsights = role === 'all' 
    ? [...gpsInsights.coach, ...gpsInsights.analyst, ...gpsInsights.director]
    : gpsInsights[role];
    
  const toggleInsight = (index: number) => {
    if (expandedInsight === index) {
      setExpandedInsight(null);
    } else {
      setExpandedInsight(index);
    }
  };
  
  return (
    <div className="bg-gray-900 bg-opacity-70 backdrop-blur-sm p-6 rounded-lg border border-gray-800">
      <h2 className="text-xl font-bold text-white mb-4">
        {role === 'all' ? 'Key Performance Insights' : `${role.charAt(0).toUpperCase() + role.slice(1)}'s Insights`}
      </h2>
      
      <div className="space-y-4">
        {displayInsights.map((insight, index) => (
          <div 
            key={index}
            className="bg-gray-800 rounded-lg overflow-hidden cursor-pointer"
          >
            <div 
              className="p-4 flex justify-between items-center"
              onClick={() => toggleInsight(index)}
            >
              <h3 className="text-white font-medium">{insight.title}</h3>
              <div className="text-gray-400">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className={`transform transition-transform ${expandedInsight === index ? 'rotate-180' : ''}`}
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
            </div>
            
            {expandedInsight === index && (
              <div className="p-4 pt-0 border-t border-gray-700">
                <p className="text-gray-300 text-sm mb-3">{insight.detail}</p>
                <div className="bg-[#1E54B7]/20 p-3 rounded">
                  <h4 className="text-[#1E54B7] text-sm font-medium mb-1">Recommended Action:</h4>
                  <p className="text-white text-sm">{insight.action}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}