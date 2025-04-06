import { fetchCSV } from "./csv-parser"

export interface PriorityArea {
  Priority: string | number;
  Category: string;
  Area: string;
  Target: string;
  "Performance Type": string;
  "Target set": string;
  "Review Date": string;
  Tracking: string;
}

// Get priority areas filtered by category
export function getPriorityAreasByCategory(data: PriorityArea[], category: string): PriorityArea[] {
  return data.filter(item => item.Category === category);
}

// Calculate progress metrics for priority areas
export function calculatePriorityProgress(data: PriorityArea[]): {
  totalAreas: number;
  achieved: number;
  onTrack: number;
  behind: number;
  notStarted: number;
  achievedPercent: number;
  onTrackPercent: number;
  behindPercent: number;
  notStartedPercent: number;
} {
  const totalAreas = data.length;
  const achieved = data.filter(item => item.Tracking === 'Achieved').length;
  const onTrack = data.filter(item => item.Tracking === 'On Track').length;
  const behind = data.filter(item => item.Tracking === 'Behind').length;
  const notStarted = data.filter(item => item.Tracking === 'Not Started').length;
  
  return {
    totalAreas,
    achieved,
    onTrack,
    behind,
    notStarted,
    achievedPercent: totalAreas > 0 ? (achieved / totalAreas) * 100 : 0,
    onTrackPercent: totalAreas > 0 ? (onTrack / totalAreas) * 100 : 0,
    behindPercent: totalAreas > 0 ? (behind / totalAreas) * 100 : 0,
    notStartedPercent: totalAreas > 0 ? (notStarted / totalAreas) * 100 : 0
  };
}

// Get categories with count
export function getCategoryBreakdown(data: PriorityArea[]): Record<string, number> {
  const categories: Record<string, number> = {};
  
  data.forEach(item => {
    const category = item.Category;
    categories[category] = (categories[category] || 0) + 1;
  });
  
  return categories;
}

// Get areas within a category
export function getAreasByCategory(data: PriorityArea[], category: string): Record<string, number> {
  const areas: Record<string, number> = {};
  
  data.filter(item => item.Category === category).forEach(item => {
    const area = item.Area;
    areas[area] = (areas[area] || 0) + 1;
  });
  
  return areas;
}

// Calculate status by category
export function getStatusByCategory(data: PriorityArea[]): Record<string, Record<string, number>> {
  const result: Record<string, Record<string, number>> = {};
  
  // Get unique categories
  const categories = Array.from(new Set(data.map(item => item.Category)));
  
  categories.forEach(category => {
    result[category] = {
      'Achieved': 0,
      'On Track': 0,
      'Behind': 0,
      'Not Started': 0
    };
    
    // Filter items by category and count by status
    data.filter(item => item.Category === category).forEach(item => {
      result[category][item.Tracking] = (result[category][item.Tracking] || 0) + 1;
    });
  });
  
  return result;
}

// Fetch priority areas data
export async function fetchPriorityAreas(): Promise<PriorityArea[]> {
  const csvUrl = "/api/data/mock-priority";
  
  try {
    const data = await fetchCSV(csvUrl) as PriorityArea[];
    
    // Convert priority to number when possible
    return data.map(item => ({
      ...item,
      Priority: typeof item.Priority === 'number' ? item.Priority : parseInt(item.Priority as string) || item.Priority
    }));
  } catch (error) {
    console.error("Error fetching priority areas data:", error);
    return [];
  }
}