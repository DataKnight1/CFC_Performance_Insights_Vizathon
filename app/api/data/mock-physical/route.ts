import { NextResponse } from 'next/server';

// Add these exports for static export compatibility
export const dynamic = 'force-static';
export const revalidate = false;

export async function GET() {
  console.log("Mock Physical API: Generating mock data");
  // Generate a comprehensive dataset with all movement types and qualities
  // Create entries for the last 3 months with different dates
  
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

  return new NextResponse(JSON.stringify(mockData), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}