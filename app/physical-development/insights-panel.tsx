"use client";

import { useState } from "react";

interface InsightsPanelProps {
  role: "coach" | "analyst" | "director" | "all";
}

export function PhysicalInsightsPanel({ role }: InsightsPanelProps) {
  const [expandedInsight, setExpandedInsight] = useState<number | null>(null);
  
  // Advanced physical development insights for different roles
  const physicalInsights = {
    coach: [
      {
        title: "Neuromuscular Power Development",
        detail: "Physical testing data indicates significant improvement in sprint mechanics (17.2% increase in force production), but relative stagnation in eccentric strength capacity. Players with high eccentric strength scores show 32% better deceleration ability and 46% reduced risk of non-contact injuries.",
        action: "Implement twice-weekly eccentric-focused training blocks focusing on Nordic hamstring exercises and drop landings, particularly for players showing lower eccentric strength scores."
      },
      {
        title: "Movement Quality Enhancement",
        detail: "Movement screening data shows that 68% of players have suboptimal frontal plane control during change of direction movements. This correlates strongly with reduced agility performance (r=0.76) and increased risk of ankle/knee injuries.",
        action: "Incorporate movement quality assessments into daily preparation with corrective exercises for players demonstrating frontal plane deficiencies."
      },
      {
        title: "Positional Power Profiles",
        detail: "Comparison of power output metrics shows wide players achieving significantly higher horizontal power outputs but lower vertical power. Central defenders displaying the opposite pattern. Both profiles show position-specific performance advantages when optimized.",
        action: "Develop position-specific power development programs emphasizing horizontal power for wide players and vertical power for central players to maximize match performance profiles."
      }
    ],
    
    analyst: [
      {
        title: "Physical-Technical Integration Analysis",
        detail: "Data correlation reveals physical capabilities strongly influence technical execution. Players achieving >92% of benchmark in agility tests show 26% higher technical action success rates in the final 30 minutes of matches. Pattern is most pronounced in midfielders and attacking players.",
        action: "Develop integrated physical-technical tracking to identify optimal physical development targets that directly enhance technical performance metrics under fatigue."
      },
      {
        title: "Force-Velocity Profiling Insights",
        detail: "Force-velocity profiling indicates 72% of the squad demonstrate force dominance vs velocity dominance. This helps explain strong aerial performance (force-dependent) but limited transition effectiveness (velocity-dependent).",
        action: "Implement individualized force-velocity profiling to guide specific training interventions targeting each player's limiting factor in power production."
      },
      {
        title: "Speed Development Progression Modeling",
        detail: "Longitudinal analysis of speed development shows 'responders' and 'non-responders' to current speed training methods. Responders show progressive 5-8% improvements over a season, while non-responders plateau after initial 2-3% gains.",
        action: "Create machine learning algorithm to identify response patterns to different training modalities and predict optimal stimulus type for each individual player profile."
      }
    ],
    
    director: [
      {
        title: "Physical Development ROI Assessment",
        detail: "Investment in force plate technology has yielded 14.3% improvement in lower limb power output across the squad. This correlates with 22% reduction in non-contact lower limb injuries and 8.7% improvement in duels won, representing estimated £2.4M performance value.",
        action: "Expand physical assessment technology investment with focus on velocity-based training systems showing 3:1 ROI in elite football environments."
      },
      {
        title: "Academy-to-First Team Physical Pathway",
        detail: "Analysis of physical development data shows significant gap between U23 and first team physical benchmarks, particularly in maximum speed (11.2% gap) and power endurance (16.8% gap). Current development pathway closes only 50% of this gap.",
        action: "Redesign academy physical development curriculum with specific benchmarks at each age group aligned with first team physical profile requirements."
      },
      {
        title: "Physical Performance Benchmarking",
        detail: "Positional analysis versus league and European competition shows our central midfielders underperforming in high-intensity endurance metrics (-9.7% vs. Champions League average) despite strong strength and power scores. Wide players show competitive speed profiles but below-average repeated sprint ability.",
        action: "Establish clear physical recruitment profiles with minimum benchmarks for each position based on both league averages and elite European competition standards."
      }
    ]
  };
  
  // Select which insights to display based on role
  const displayInsights = role === 'all' 
    ? [...physicalInsights.coach, ...physicalInsights.analyst, ...physicalInsights.director]
    : physicalInsights[role];
    
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
        {role === 'all' ? 'Physical Development Insights' : `${role.charAt(0).toUpperCase() + role.slice(1)}'s Physical Insights`}
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