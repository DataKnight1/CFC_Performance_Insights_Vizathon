import { NextResponse } from 'next/server';

// Add these exports for static export compatibility
export const dynamic = 'force-static';
export const revalidate = false;

export async function GET() {
  console.log('API: Using mock physical capability data for static export');
  
  // Return mock JSON data instead of reading from Excel file
  const mockData = [
    {
      date: "2023-01-15",
      movement: "Sprint",
      quality: "Acceleration",
      expression: "Dynamic",
      benchmarkPct: 78.5
    },
    {
      date: "2023-01-15",
      movement: "Sprint",
      quality: "Max velocity",
      expression: "Dynamic",
      benchmarkPct: 82.3
    },
    {
      date: "2023-01-15",
      movement: "Sprint", 
      quality: "Deceleration",
      expression: "Dynamic",
      benchmarkPct: 76.1
    },
    {
      date: "2023-01-15",
      movement: "Jump",
      quality: "Take off",
      expression: "Dynamic",
      benchmarkPct: 84.2
    },
    {
      date: "2023-01-15",
      movement: "Jump",
      quality: "Land",
      expression: "Dynamic",
      benchmarkPct: 79.8
    },
    {
      date: "2023-01-15",
      movement: "Agility",
      quality: "Change of direction",
      expression: "Dynamic",
      benchmarkPct: 85.3
    },
    {
      date: "2023-01-15",
      movement: "Agility",
      quality: "Balance",
      expression: "Static",
      benchmarkPct: 81.7
    },
    {
      date: "2023-01-15",
      movement: "Strength",
      quality: "Upper body",
      expression: "Concentric",
      benchmarkPct: 76.9
    },
    {
      date: "2023-01-15",
      movement: "Strength",
      quality: "Lower body",
      expression: "Concentric",
      benchmarkPct: 80.5
    },
    {
      date: "2023-01-15",
      movement: "Endurance",
      quality: "Aerobic",
      expression: "Dynamic",
      benchmarkPct: 83.1
    },
    {
      date: "2023-02-15",
      movement: "Sprint",
      quality: "Acceleration",
      expression: "Dynamic",
      benchmarkPct: 79.2
    },
    {
      date: "2023-02-15",
      movement: "Sprint",
      quality: "Max velocity",
      expression: "Dynamic",
      benchmarkPct: 83.0
    },
    {
      date: "2023-02-15",
      movement: "Sprint", 
      quality: "Deceleration",
      expression: "Dynamic",
      benchmarkPct: 77.5
    },
    {
      date: "2023-02-15",
      movement: "Jump",
      quality: "Take off",
      expression: "Dynamic",
      benchmarkPct: 85.1
    },
    {
      date: "2023-02-15",
      movement: "Jump",
      quality: "Land",
      expression: "Dynamic",
      benchmarkPct: 80.3
    },
    {
      date: "2023-03-15",
      movement: "Sprint",
      quality: "Acceleration",
      expression: "Dynamic",
      benchmarkPct: 80.1
    },
    {
      date: "2023-03-15",
      movement: "Sprint",
      quality: "Max velocity",
      expression: "Dynamic",
      benchmarkPct: 83.9
    },
    {
      date: "2023-03-15",
      movement: "Sprint", 
      quality: "Deceleration",
      expression: "Dynamic",
      benchmarkPct: 78.6
    },
    {
      date: "2023-03-15",
      movement: "Jump",
      quality: "Take off",
      expression: "Dynamic",
      benchmarkPct: 86.3
    },
    {
      date: "2023-03-15",
      movement: "Jump",
      quality: "Land",
      expression: "Dynamic",
      benchmarkPct: 81.2
    },
    {
      date: "2023-04-15",
      movement: "Sprint",
      quality: "Acceleration",
      expression: "Dynamic",
      benchmarkPct: 81.0
    },
    {
      date: "2023-04-15",
      movement: "Sprint",
      quality: "Max velocity",
      expression: "Dynamic",
      benchmarkPct: 84.8
    },
    {
      date: "2023-04-15",
      movement: "Sprint", 
      quality: "Deceleration",
      expression: "Dynamic",
      benchmarkPct: 79.5
    }
  ];

  return new NextResponse(JSON.stringify(mockData), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}