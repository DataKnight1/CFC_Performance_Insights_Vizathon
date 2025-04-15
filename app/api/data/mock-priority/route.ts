import { NextResponse } from 'next/server';

// Add these exports for static export compatibility
export const dynamic = 'force-static';
export const revalidate = false;

export async function GET() {
  // Generate direct JSON data instead of CSV
  const mockData = [
    {
      "Priority": 1,
      "Category": "Performance",
      "Area": "Sprint Speed",
      "Target": "Increase max speed to 32 km/h",
      "Performance Type": "Peak Output",
      "Target set": "2022-08-01",
      "Review Date": "2022-12-31",
      "Tracking": "On Track"
    },
    {
      "Priority": 2,
      "Category": "Performance",
      "Area": "Agility",
      "Target": "Improve COD by 15%",
      "Performance Type": "Movement",
      "Target set": "2022-08-01",
      "Review Date": "2022-12-31",
      "Tracking": "Behind"
    },
    {
      "Priority": 3,
      "Category": "Performance",
      "Area": "Upper Body Strength",
      "Target": "Increase bench press by 10kg",
      "Performance Type": "Strength",
      "Target set": "2022-08-01",
      "Review Date": "2022-12-31",
      "Tracking": "On Track"
    },
    {
      "Priority": 4,
      "Category": "Recovery",
      "Area": "Sleep Quality",
      "Target": "Improve sleep score to 85%",
      "Performance Type": "Recovery",
      "Target set": "2022-09-01",
      "Review Date": "2022-12-31",
      "Tracking": "On Track"
    },
    {
      "Priority": 5,
      "Category": "Recovery",
      "Area": "Post-match Recovery",
      "Target": "Reduce soreness ratings post-match",
      "Performance Type": "Recovery",
      "Target set": "2022-08-01",
      "Review Date": "2022-12-31",
      "Tracking": "Achieved"
    },
    {
      "Priority": 6,
      "Category": "Recovery",
      "Area": "Hydration",
      "Target": "Maintain optimal hydration levels during matches",
      "Performance Type": "Recovery",
      "Target set": "2022-09-15",
      "Review Date": "2023-01-15",
      "Tracking": "Behind"
    },
    {
      "Priority": 7,
      "Category": "Recovery",
      "Area": "Nutrition",
      "Target": "Optimize pre-match nutrition protocol",
      "Performance Type": "Recovery",
      "Target set": "2022-09-01",
      "Review Date": "2022-12-31",
      "Tracking": "On Track"
    },
    {
      "Priority": 8,
      "Category": "Tactical",
      "Area": "Positioning",
      "Target": "Improve defensive transition positioning",
      "Performance Type": "Tactical",
      "Target set": "2022-08-01",
      "Review Date": "2022-12-31",
      "Tracking": "On Track"
    },
    {
      "Priority": 9,
      "Category": "Technical",
      "Area": "First Touch",
      "Target": "Reduce failed controls under pressure",
      "Performance Type": "Technical",
      "Target set": "2022-08-01",
      "Review Date": "2022-12-31",
      "Tracking": "Behind"
    },
    {
      "Priority": 10,
      "Category": "Performance",
      "Area": "Jump",
      "Target": "Increase vertical leap by 5cm",
      "Performance Type": "Power",
      "Target set": "2022-08-01",
      "Review Date": "2022-12-31",
      "Tracking": "On Track"
    },
    {
      "Priority": 11,
      "Category": "Recovery",
      "Area": "Stress Management",
      "Target": "Implement mindfulness routine",
      "Performance Type": "Recovery",
      "Target set": "2022-10-01",
      "Review Date": "2023-01-31",
      "Tracking": "Not Started"
    },
    {
      "Priority": 12,
      "Category": "Recovery",
      "Area": "Sleep Quality",
      "Target": "Reduce screen time before bed",
      "Performance Type": "Recovery",
      "Target set": "2022-10-15",
      "Review Date": "2023-01-15",
      "Tracking": "On Track"
    },
    {
      "Priority": 13,
      "Category": "Tactical",
      "Area": "Off-ball Runs",
      "Target": "Improve attacking third movement",
      "Performance Type": "Tactical",
      "Target set": "2022-08-01",
      "Review Date": "2022-12-31",
      "Tracking": "Not Started"
    },
    {
      "Priority": 14,
      "Category": "Technical",
      "Area": "Long Passing",
      "Target": "Improve accuracy of long switches",
      "Performance Type": "Technical",
      "Target set": "2022-08-01",
      "Review Date": "2022-12-31",
      "Tracking": "On Track"
    },
    {
      "Priority": 15,
      "Category": "Performance",
      "Area": "Endurance",
      "Target": "Increase high-intensity output in 2nd half",
      "Performance Type": "Endurance",
      "Target set": "2022-08-01",
      "Review Date": "2022-12-31",
      "Tracking": "Achieved"
    }
  ];

  return new NextResponse(JSON.stringify(mockData), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}