import { fetchCSV } from "./csv-parser"

export interface GPSData {
  date: string;
  opposition_code: string;
  opposition_full: string;
  md_plus_code: string;
  md_minus_code: string;
  season: string;
  distance: number;
  distance_over_21: number;
  distance_over_24: number;
  distance_over_27: number;
  accel_decel_over_2_5: number;
  accel_decel_over_3_5: number;
  accel_decel_over_4_5: number;
  day_duration: number;
  peak_speed: number;
  hr_zone_1_hms: string;
  hr_zone_2_hms: string;
  hr_zone_3_hms: string;
  hr_zone_4_hms: string;
  hr_zone_5_hms: string;
}

// Convert heart rate zone time (H:M:S) to minutes
export function hrZoneToMinutes(hrZone: string): number {
  if (!hrZone) return 0;
  
  const parts = hrZone.split(':');
  if (parts.length !== 3) return 0;
  
  const hours = parseInt(parts[0], 10) || 0;
  const minutes = parseInt(parts[1], 10) || 0;
  const seconds = parseInt(parts[2], 10) || 0;
  
  return hours * 60 + minutes + seconds / 60;
}

// Calculate high intensity minutes (Zones 4-5)
export function calculateHighIntensityMinutes(data: GPSData): number {
  const zone4Minutes = hrZoneToMinutes(data.hr_zone_4_hms);
  const zone5Minutes = hrZoneToMinutes(data.hr_zone_5_hms);
  
  return zone4Minutes + zone5Minutes;
}

// Calculate sprint distance (total of all high-speed distances)
export function calculateSprintDistance(data: GPSData): number {
  return (
    (typeof data.distance_over_21 === 'number' ? data.distance_over_21 : 0) +
    (typeof data.distance_over_24 === 'number' ? data.distance_over_24 : 0) +
    (typeof data.distance_over_27 === 'number' ? data.distance_over_27 : 0)
  );
}

// Group GPS data by date, season, or match code
export function groupGPSData(data: GPSData[], groupBy: 'date' | 'season' | 'opposition_code'): Record<string, GPSData[]> {
  const groupedData: Record<string, GPSData[]> = {};
  
  data.forEach(item => {
    const key = item[groupBy] as string;
    if (!groupedData[key]) {
      groupedData[key] = [];
    }
    groupedData[key].push(item);
  });
  
  return groupedData;
}

// Calculate weekly load (total distance per week)
export function calculateWeeklyLoad(data: GPSData[]): Record<string, number> {
  const weeklyLoad: Record<string, number> = {};
  
  data.forEach(item => {
    if (!item.date) return;
    
    // Create a date object and get the week number
    const date = new Date(item.date);
    if (isNaN(date.getTime())) return;
    
    const weekNumber = getWeekNumber(date);
    const weekKey = `${date.getFullYear()}-W${weekNumber}`;
    
    if (!weeklyLoad[weekKey]) {
      weeklyLoad[weekKey] = 0;
    }
    
    weeklyLoad[weekKey] += (typeof item.distance === 'number' ? item.distance : 0);
  });
  
  return weeklyLoad;
}

// Helper function to get week number
function getWeekNumber(d: Date): number {
  // Copy date so don't modify original
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  // Set to nearest Thursday: current date + 4 - current day number
  // Make Sunday's day number 7
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  // Get first day of year
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  // Calculate full weeks to nearest Thursday
  const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  
  return weekNo;
}

// Fetch GPS data from the provided URL
export async function fetchGPSData(): Promise<GPSData[]> {
  console.log('Starting to fetch GPS data');
  const csvUrl = "/api/data/simple-gps";
  
  try {
    const data = await fetchCSV(csvUrl) as GPSData[];
    console.log('GPS data fetched:', data.length, 'records');
    
    if (data.length === 0) {
      console.error('No GPS data records found');
      return [];
    }
    
    console.log('Sample record:', JSON.stringify(data[0]));
    
    // Convert string values to numbers where appropriate
    const convertedData = data.map(item => ({
      ...item,
      distance: typeof item.distance === 'number' ? item.distance : parseFloat(item.distance as unknown as string) || 0,
      distance_over_21: typeof item.distance_over_21 === 'number' ? item.distance_over_21 : parseFloat(item.distance_over_21 as unknown as string) || 0,
      distance_over_24: typeof item.distance_over_24 === 'number' ? item.distance_over_24 : parseFloat(item.distance_over_24 as unknown as string) || 0,
      distance_over_27: typeof item.distance_over_27 === 'number' ? item.distance_over_27 : parseFloat(item.distance_over_27 as unknown as string) || 0,
      accel_decel_over_2_5: typeof item.accel_decel_over_2_5 === 'number' ? item.accel_decel_over_2_5 : parseFloat(item.accel_decel_over_2_5 as unknown as string) || 0,
      accel_decel_over_3_5: typeof item.accel_decel_over_3_5 === 'number' ? item.accel_decel_over_3_5 : parseFloat(item.accel_decel_over_3_5 as unknown as string) || 0,
      accel_decel_over_4_5: typeof item.accel_decel_over_4_5 === 'number' ? item.accel_decel_over_4_5 : parseFloat(item.accel_decel_over_4_5 as unknown as string) || 0,
      day_duration: typeof item.day_duration === 'number' ? item.day_duration : parseFloat(item.day_duration as unknown as string) || 0,
      peak_speed: typeof item.peak_speed === 'number' ? item.peak_speed : parseFloat(item.peak_speed as unknown as string) || 0,
    }));
    
    console.log('Converted GPS data:', convertedData.length, 'records');
    return convertedData;
  } catch (error) {
    console.error("Error fetching GPS data:", error);
    return [];
  }
}