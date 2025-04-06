import { fetchCSV } from "./csv-parser"

export interface RecoveryData {
  date: string;
  bio_completeness: number;
  bio_composite: number;
  msk_joint_range_completeness: number;
  msk_joint_range_composite: number;
  msk_load_tolerance_completeness: number;
  msk_load_tolerance_composite: number;
  subjective_completeness: number;
  subjective_composite: number;
  soreness_completeness: number;
  soreness_composite: number;
  sleep_completeness: number;
  sleep_composite: number;
  emboss_baseline_score: number;
}

// Calculate overall recovery score (normalized to 0-100)
export function calculateRecoveryScore(data: RecoveryData): number {
  if (!data.emboss_baseline_score && data.emboss_baseline_score !== 0) {
    // If no baseline score, calculate weighted average of composites
    const compositeScores = [
      data.bio_composite,
      data.msk_joint_range_composite,
      data.msk_load_tolerance_composite,
      data.subjective_composite,
      data.soreness_composite,
      data.sleep_composite
    ].filter(score => score !== undefined && score !== null);
    
    if (compositeScores.length === 0) return 0;
    
    // Average the available scores
    const avgScore = compositeScores.reduce((sum, score) => sum + score, 0) / compositeScores.length;
    
    // Convert from scale of -1 to 1 to scale of 0 to 100
    return Math.min(Math.max(((avgScore + 1) / 2) * 100, 0), 100);
  }
  
  // Normalize baseline score (assuming it's on -1 to 1 scale)
  return Math.min(Math.max(((data.emboss_baseline_score + 1) / 2) * 100, 0), 100);
}

// Group recovery data by date ranges
export function groupRecoveryByDateRange(data: RecoveryData[], days: number): RecoveryData[] {
  if (!data || data.length === 0) return [];
  
  // Sort data by date
  const sortedData = [...data].sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });
  
  // Get the latest date
  const latestDate = new Date(sortedData[sortedData.length - 1].date);
  
  // Calculate the start date for the range
  const startDate = new Date(latestDate);
  startDate.setDate(startDate.getDate() - days);
  
  // Filter data within the range
  return sortedData.filter(item => {
    const itemDate = new Date(item.date);
    return itemDate >= startDate && itemDate <= latestDate;
  });
}

// Calculate average recovery scores for a time period
export function calculateAverageRecoveryScores(data: RecoveryData[]): {
  overall: number;
  sleep: number;
  soreness: number;
  subjective: number;
  bio: number;
} {
  if (!data || data.length === 0) {
    return { overall: 0, sleep: 0, soreness: 0, subjective: 0, bio: 0 };
  }
  
  // Calculate individual averages
  const sleepScores = data.filter(d => d.sleep_composite !== undefined && d.sleep_composite !== null)
    .map(d => ((d.sleep_composite + 1) / 2) * 100);
  
  const sorenessScores = data.filter(d => d.soreness_composite !== undefined && d.soreness_composite !== null)
    .map(d => ((d.soreness_composite + 1) / 2) * 100);
  
  const subjectiveScores = data.filter(d => d.subjective_composite !== undefined && d.subjective_composite !== null)
    .map(d => ((d.subjective_composite + 1) / 2) * 100);
  
  const bioScores = data.filter(d => d.bio_composite !== undefined && d.bio_composite !== null)
    .map(d => ((d.bio_composite + 1) / 2) * 100);
  
  // Calculate overall scores
  const overallScores = data.map(d => calculateRecoveryScore(d));
  
  const calculateAverage = (scores: number[]): number => {
    return scores.length ? scores.reduce((sum, score) => sum + score, 0) / scores.length : 0;
  };
  
  return {
    overall: calculateAverage(overallScores),
    sleep: calculateAverage(sleepScores),
    soreness: calculateAverage(sorenessScores),
    subjective: calculateAverage(subjectiveScores),
    bio: calculateAverage(bioScores)
  };
}

// Fetch recovery data from the provided URL
export async function fetchRecoveryData(): Promise<RecoveryData[]> {
  const csvUrl = "/api/data/mock-recovery";
  
  try {
    const data = await fetchCSV(csvUrl) as RecoveryData[];
    
    // Convert string values to numbers and handle nulls
    return data.map(item => ({
      ...item,
      bio_completeness: typeof item.bio_completeness === 'number' ? item.bio_completeness : parseFloat(item.bio_completeness as unknown as string) || 0,
      bio_composite: typeof item.bio_composite === 'number' ? item.bio_composite : parseFloat(item.bio_composite as unknown as string) || 0,
      msk_joint_range_completeness: typeof item.msk_joint_range_completeness === 'number' ? item.msk_joint_range_completeness : parseFloat(item.msk_joint_range_completeness as unknown as string) || 0,
      msk_joint_range_composite: typeof item.msk_joint_range_composite === 'number' ? item.msk_joint_range_composite : parseFloat(item.msk_joint_range_composite as unknown as string) || 0,
      msk_load_tolerance_completeness: typeof item.msk_load_tolerance_completeness === 'number' ? item.msk_load_tolerance_completeness : parseFloat(item.msk_load_tolerance_completeness as unknown as string) || 0,
      msk_load_tolerance_composite: typeof item.msk_load_tolerance_composite === 'number' ? item.msk_load_tolerance_composite : parseFloat(item.msk_load_tolerance_composite as unknown as string) || 0,
      subjective_completeness: typeof item.subjective_completeness === 'number' ? item.subjective_completeness : parseFloat(item.subjective_completeness as unknown as string) || 0,
      subjective_composite: typeof item.subjective_composite === 'number' ? item.subjective_composite : parseFloat(item.subjective_composite as unknown as string) || 0,
      soreness_completeness: typeof item.soreness_completeness === 'number' ? item.soreness_completeness : parseFloat(item.soreness_completeness as unknown as string) || 0,
      soreness_composite: typeof item.soreness_composite === 'number' ? item.soreness_composite : parseFloat(item.soreness_composite as unknown as string) || 0,
      sleep_completeness: typeof item.sleep_completeness === 'number' ? item.sleep_completeness : parseFloat(item.sleep_completeness as unknown as string) || 0,
      sleep_composite: typeof item.sleep_composite === 'number' ? item.sleep_composite : parseFloat(item.sleep_composite as unknown as string) || 0,
      emboss_baseline_score: typeof item.emboss_baseline_score === 'number' ? item.emboss_baseline_score : parseFloat(item.emboss_baseline_score as unknown as string) || 0,
    }));
  } catch (error) {
    console.error("Error fetching recovery data:", error);
    return [];
  }
}