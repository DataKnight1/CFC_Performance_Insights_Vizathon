import { fetchExcel, PhysicalCapabilityData } from "./excel-parser"

// Enum for Movement types
export enum MovementType {
  Sprint = "Sprint",
  Jump = "Jump",
  Agility = "Agility",
  Strength = "Strength",
  Endurance = "Endurance"
}

// Enum for Quality types
export enum QualityType {
  // Sprint qualities
  Acceleration = "Acceleration",
  MaxVelocity = "Max velocity",
  Technique = "Technique",
  Power = "Power",
  
  // Jump qualities
  TakeOff = "Take off",
  Land = "Land",
  VerticalPower = "Vertical power",
  HorizontalPower = "Horizontal power",
  
  // Agility qualities
  Deceleration = "Deceleration",
  ChangeOfDirection = "Change of direction",
  Balance = "Balance",
  
  // Strength qualities
  UpperBody = "Upper body",
  LowerBody = "Lower body",
  Core = "Core",
  Functional = "Functional",
  
  // Endurance qualities
  Aerobic = "Aerobic",
  Anaerobic = "Anaerobic",
  Recovery = "Recovery",
  Stamina = "Stamina",
  
  // Legacy qualities
  Grapple = "Grapple",
  PreLoad = "Pre-load",
  Pull = "Pull",
  Push = "Push",
  Rotate = "Rotate"
}

// Enum for Expression types
export enum ExpressionType {
  Isometric = "Isometric",
  Dynamic = "Dynamic",
  Concentric = "Concentric",
  Eccentric = "Eccentric"
}

// Interface for analysis results
export interface MovementAnalysis {
  movement: string;
  avgBenchmark: number;
  improvementRate: number;
  trendsOverTime: Array<{date: string, value: number}>;
  strengths: string[];
  weaknesses: string[];
}

// Fetch physical capability data
export async function fetchPhysicalCapabilityData(): Promise<PhysicalCapabilityData[]> {
  try {
    const excelUrl = "/api/data/mock-physical";
    return await fetchExcel(excelUrl);
  } catch (error) {
    console.error("Error fetching physical capability data:", error);
    return [];
  }
}

// Get data filtered by movement type
export function getDataByMovement(data: PhysicalCapabilityData[], movement: MovementType): PhysicalCapabilityData[] {
  return data.filter(item => item.movement === movement);
}

// Get data filtered by quality type
export function getDataByQuality(data: PhysicalCapabilityData[], quality: QualityType): PhysicalCapabilityData[] {
  return data.filter(item => item.quality === quality);
}

// Get data filtered by expression type
export function getDataByExpression(data: PhysicalCapabilityData[], expression: ExpressionType): PhysicalCapabilityData[] {
  return data.filter(item => item.expression === expression);
}

// Get average benchmark by movement
export function getAverageBenchmarkByMovement(data: PhysicalCapabilityData[]): Record<string, number> {
  const movementGroups: Record<string, number[]> = {};
  
  // Group benchmarks by movement
  data.forEach(item => {
    if (!movementGroups[item.movement]) {
      movementGroups[item.movement] = [];
    }
    if (typeof item.benchmarkPct === 'number' && !isNaN(item.benchmarkPct)) {
      movementGroups[item.movement].push(item.benchmarkPct);
    }
  });
  
  // Calculate averages
  const averages: Record<string, number> = {};
  Object.keys(movementGroups).forEach(movement => {
    const values = movementGroups[movement];
    if (values.length > 0) {
      averages[movement] = values.reduce((sum, val) => sum + val, 0) / values.length;
    } else {
      averages[movement] = 0;
    }
  });
  
  return averages;
}

// Get average benchmark by quality
export function getAverageBenchmarkByQuality(data: PhysicalCapabilityData[]): Record<string, number> {
  const qualityGroups: Record<string, number[]> = {};
  
  // Group benchmarks by quality
  data.forEach(item => {
    if (!qualityGroups[item.quality]) {
      qualityGroups[item.quality] = [];
    }
    if (typeof item.benchmarkPct === 'number' && !isNaN(item.benchmarkPct)) {
      qualityGroups[item.quality].push(item.benchmarkPct);
    }
  });
  
  // Calculate averages
  const averages: Record<string, number> = {};
  Object.keys(qualityGroups).forEach(quality => {
    const values = qualityGroups[quality];
    if (values.length > 0) {
      averages[quality] = values.reduce((sum, val) => sum + val, 0) / values.length;
    } else {
      averages[quality] = 0;
    }
  });
  
  return averages;
}

// Calculate improvement rates for each movement
export function calculateImprovementRates(data: PhysicalCapabilityData[]): Record<string, number> {
  const improvements: Record<string, number> = {};
  const movements = [...new Set(data.map(item => item.movement))];
  
  movements.forEach(movement => {
    const movementData = data
      .filter(item => item.movement === movement)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    if (movementData.length >= 2) {
      const firstPeriodData = movementData.slice(0, Math.floor(movementData.length / 3));
      const lastPeriodData = movementData.slice(-Math.floor(movementData.length / 3));
      
      const firstAvg = firstPeriodData.reduce((sum, item) => sum + item.benchmarkPct, 0) / firstPeriodData.length;
      const lastAvg = lastPeriodData.reduce((sum, item) => sum + item.benchmarkPct, 0) / lastPeriodData.length;
      
      // Calculate improvement rate as percentage
      if (firstAvg > 0) {
        improvements[movement] = ((lastAvg - firstAvg) / firstAvg) * 100;
      } else {
        improvements[movement] = 0;
      }
    } else {
      improvements[movement] = 0;
    }
  });
  
  return improvements;
}

// Get benchmark trends over time for a specific movement
export function getBenchmarkTrendsByMovement(
  data: PhysicalCapabilityData[], 
  movement: MovementType
): Array<{date: string, value: number}> {
  const movementData = data
    .filter(item => item.movement === movement)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  // Group by date and calculate daily average
  const dailyAverages = new Map<string, {sum: number, count: number}>();
  
  movementData.forEach(item => {
    const dateKey = new Date(item.date).toISOString().split('T')[0];
    if (!dailyAverages.has(dateKey)) {
      dailyAverages.set(dateKey, {sum: 0, count: 0});
    }
    
    const record = dailyAverages.get(dateKey)!;
    record.sum += item.benchmarkPct;
    record.count += 1;
  });
  
  // Convert to trend data
  const trends: Array<{date: string, value: number}> = [];
  dailyAverages.forEach((record, date) => {
    trends.push({
      date,
      value: record.sum / record.count
    });
  });
  
  return trends;
}

// Identify strengths and weaknesses
export function identifyStrengthsAndWeaknesses(data: PhysicalCapabilityData[]): {
  strengths: string[],
  weaknesses: string[]
} {
  // Group by quality and calculate average benchmarks
  const qualityAverages = getAverageBenchmarkByQuality(data);
  
  // Sort qualities by benchmark
  const sortedQualities = Object.entries(qualityAverages)
    .sort((a, b) => b[1] - a[1]);
  
  // Get top 3 as strengths (if they're above 60%)
  const strengths = sortedQualities
    .filter(([_, value]) => value >= 60)
    .slice(0, 3)
    .map(([quality]) => quality);
  
  // Get bottom 3 as weaknesses (if they're below 50%)
  const weaknesses = sortedQualities
    .filter(([_, value]) => value < 50)
    .slice(-3)
    .map(([quality]) => quality);
  
  return { strengths, weaknesses };
}

// Comprehensive analysis of physical capability data
export function analyzePhysicalCapabilityData(data: PhysicalCapabilityData[]): MovementAnalysis[] {
  const movements = [...new Set(data.map(item => item.movement))];
  const improvementRates = calculateImprovementRates(data);
  const { strengths, weaknesses } = identifyStrengthsAndWeaknesses(data);
  
  return movements.map(movement => {
    const movementData = data.filter(item => item.movement === movement);
    const avgBenchmark = movementData.reduce((sum, item) => sum + item.benchmarkPct, 0) / movementData.length;
    const trendsOverTime = getBenchmarkTrendsByMovement(data, movement as MovementType);
    
    // Identify movement-specific strengths and weaknesses
    const movementQualities = [...new Set(movementData.map(item => item.quality))];
    const qualityAverages: Record<string, number> = {};
    
    movementQualities.forEach(quality => {
      const qualityData = movementData.filter(item => item.quality === quality);
      const avg = qualityData.reduce((sum, item) => sum + item.benchmarkPct, 0) / qualityData.length;
      qualityAverages[quality] = avg;
    });
    
    // Sort qualities by benchmark
    const sortedQualities = Object.entries(qualityAverages)
      .sort((a, b) => b[1] - a[1]);
    
    // Get top 2 as movement-specific strengths (if they're above 60%)
    const movementStrengths = sortedQualities
      .filter(([_, value]) => value >= 60)
      .slice(0, 2)
      .map(([quality]) => quality);
    
    // Get bottom 2 as movement-specific weaknesses (if they're below 50%)
    const movementWeaknesses = sortedQualities
      .filter(([_, value]) => value < 50)
      .slice(-2)
      .map(([quality]) => quality);
    
    return {
      movement,
      avgBenchmark,
      improvementRate: improvementRates[movement] || 0,
      trendsOverTime,
      strengths: movementStrengths,
      weaknesses: movementWeaknesses
    };
  });
}

// Get recommended training focus areas based on analysis
export function getRecommendedFocusAreas(analysisResults: MovementAnalysis[]): string[] {
  // Focus on movements with lowest benchmarks and qualities marked as weaknesses
  const movementsByAverage = [...analysisResults]
    .sort((a, b) => a.avgBenchmark - b.avgBenchmark);
  
  // Get the two weakest movements
  const weakestMovements = movementsByAverage.slice(0, 2);
  
  // Create recommendations
  const recommendations: string[] = [];
  
  weakestMovements.forEach(movement => {
    if (movement.weaknesses.length > 0) {
      movement.weaknesses.forEach(weakness => {
        recommendations.push(`Improve ${movement.movement} ${weakness}`);
      });
    } else {
      recommendations.push(`Improve overall ${movement.movement} performance`);
    }
  });
  
  // Add recommendations for movements with negative improvement rates
  analysisResults
    .filter(item => item.improvementRate < -5) // Significant negative trend
    .forEach(movement => {
      recommendations.push(`Address declining trend in ${movement.movement} performance`);
    });
  
  return recommendations;
}