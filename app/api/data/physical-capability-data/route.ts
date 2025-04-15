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
      quality: "
