import { NextResponse } from 'next/server';

// Add these exports for static export compatibility
export const dynamic = 'force-static';
export const revalidate = false;

export async function GET() {
  console.log("Simple GPS API: Generating direct JSON response");
  
  // Generate realistic data for the last 90 days
  const today = new Date();
  const dates = [];
  
  // Generate dates for the last 90 days
  for (let i = 90; i >= 0; i -= 2) { // Every 2 days for simplicity
    const date = new Date();
    date.setDate(today.getDate() - i);
    dates.push(date.toISOString().split('T')[0]); // Format as YYYY-MM-DD
  }
  
  // Generate mock data with these dates
  let mockData = [];
  
  // Generate current data for our dates
  dates.forEach((date, index) => {
    // Generate realistic training data with variations
    // Base values that will be adjusted
    const baseDistance = 5000 + Math.random() * 2000;
    const baseHighIntensity = 150 + Math.random() * 100;
    const baseAccelDecel = 100 + Math.random() * 50;
    
    // Adjust for match days (every 7th entry for simplicity)
    const isMatchDay = index % 7 === 0;
    
    // Add variations based on training cycle
    const dayCycle = index % 7; // 0-6 to represent weekly cycle
    let mdCode = "";
    let dayType = "";
    
    // Set MD codes based on the cycle
    if (isMatchDay) {
      mdCode = "0";
      dayType = "Match Day";
    } else {
      const daysToNextMatch = 7 - dayCycle;
      mdCode = `-${daysToNextMatch}`;
      dayType = `Training (MD${mdCode})`;
    }
    
    // Adjust training values based on proximity to match day
    const matchDayProximityFactor = isMatchDay ? 
      1.5 : // Higher on match days
      (1 - (Math.abs(parseInt(mdCode)) * 0.05)); // Gradually increases as match day approaches
    
    // Create entry
    mockData.push({
      "date": date,
      "opposition_code": isMatchDay ? "OPP" : "",
      "opposition_full": isMatchDay ? "Opposition" : "",
      "md_plus_code": "0", 
      "md_minus_code": mdCode,
      "season": "2023/2024",
      "distance": baseDistance * matchDayProximityFactor,
      "distance_over_21": baseHighIntensity * matchDayProximityFactor * 0.5,
      "distance_over_24": baseHighIntensity * matchDayProximityFactor * 0.3,
      "distance_over_27": baseHighIntensity * matchDayProximityFactor * 0.2,
      "accel_decel_over_2_5": baseAccelDecel * matchDayProximityFactor * 0.6,
      "accel_decel_over_3_5": baseAccelDecel * matchDayProximityFactor * 0.3,
      "accel_decel_over_4_5": baseAccelDecel * matchDayProximityFactor * 0.1,
      "day_duration": 60 + Math.random() * 60,
      "peak_speed": 27 + Math.random() * 5,
      "hr_zone_1_hms": `00:0${Math.floor(3 + Math.random() * 7)}:00`,
      "hr_zone_2_hms": `00:${Math.floor(10 + Math.random() * 15)}:00`,
      "hr_zone_3_hms": `00:${Math.floor(10 + Math.random() * 15)}:00`,
      "hr_zone_4_hms": `00:0${Math.floor(2 + Math.random() * 8)}:00`,
      "hr_zone_5_hms": `00:00:${Math.floor(Math.random() * 30)}`
    });
  });

  return new NextResponse(JSON.stringify(mockData), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}