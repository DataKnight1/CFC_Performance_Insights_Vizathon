import { fetchGPSData, GPSData } from "./gps-data"
import { fetchRecoveryData, RecoveryData } from "./recovery-data"
import { PhysicalCapabilityData } from "./excel-parser"
import { getDataByMovement, MovementType } from "./physical-capability-data"

// Mock injury data (since we don't have actual injury data)
export interface InjuryRecord {
  date: string;
  bodyPart: string;
  injuryType: string;
  severity: 'Minor' | 'Moderate' | 'Severe';
  daysOut: number;
  recurrence: boolean;
  notes: string;
}

// Injury risk factors
export interface InjuryRiskFactors {
  loadSpikes: boolean;
  fatigueLevel: 'Low' | 'Moderate' | 'High';
  sleepQuality: 'Poor' | 'Average' | 'Good';
  muscleImbalances: string[];
  previousInjuries: string[];
  overallRisk: 'Low' | 'Moderate' | 'High';
}

// Injury analysis results
export interface InjuryAnalysisResults {
  currentStatus: 'Available' | 'Limited Training' | 'Injured';
  injuryHistory: InjuryRecord[];
  riskFactors: InjuryRiskFactors;
  bodyHeatmap: Record<string, number>;
  recommendedPrehab: string[];
}

// Return mock injury history data
export function getMockInjuryHistory(): InjuryRecord[] {
  return [
    {
      date: '2024-01-15',
      bodyPart: 'Hamstring',
      injuryType: 'Strain',
      severity: 'Moderate',
      daysOut: 14,
      recurrence: false,
      notes: 'Injured during high-intensity sprint session'
    },
    {
      date: '2023-10-05',
      bodyPart: 'Ankle',
      injuryType: 'Sprain',
      severity: 'Minor',
      daysOut: 7,
      recurrence: false,
      notes: 'Rolled ankle during match'
    },
    {
      date: '2023-03-22',
      bodyPart: 'Quadriceps',
      injuryType: 'Contusion',
      severity: 'Minor',
      daysOut: 5,
      recurrence: false,
      notes: 'Direct impact during tackle'
    },
    {
      date: '2022-11-10',
      bodyPart: 'Groin',
      injuryType: 'Strain',
      severity: 'Moderate',
      daysOut: 12,
      recurrence: false,
      notes: 'Gradual onset during high training load period'
    },
    {
      date: '2022-02-18',
      bodyPart: 'Hamstring',
      injuryType: 'Strain',
      severity: 'Severe',
      daysOut: 28,
      recurrence: false,
      notes: 'Complete tear during sprint'
    }
  ]
}

// Analyze load patterns for injury risk
export function analyzeLoadPatterns(gpsData: GPSData[]): {
  hasLoadSpikes: boolean;
  highestLoadWeek: { date: string; load: number };
  averageWeeklyLoad: number;
  acuteChronicRatio: number;
} {
  // Sort data by date
  const sortedData = [...gpsData].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  
  // Group data by week
  const weeklyLoads: Record<string, number> = {}
  
  sortedData.forEach(item => {
    const date = new Date(item.date)
    const weekStart = new Date(date)
    weekStart.setDate(date.getDate() - date.getDay()) // Set to start of week (Sunday)
    const weekKey = weekStart.toISOString().split('T')[0]
    
    // Use distance as load measure
    weeklyLoads[weekKey] = (weeklyLoads[weekKey] || 0) + item.distance
  })
  
  // Convert to array of {date, load} objects
  const weeklyLoadArray = Object.entries(weeklyLoads).map(([date, load]) => ({ date, load }))
  
  // Find highest load week
  const highestLoadWeek = weeklyLoadArray.reduce((max, current) => 
    current.load > max.load ? current : max, 
    { date: '', load: 0 }
  )
  
  // Calculate average weekly load
  const totalLoad = weeklyLoadArray.reduce((sum, week) => sum + week.load, 0)
  const averageWeeklyLoad = weeklyLoadArray.length > 0 ? totalLoad / weeklyLoadArray.length : 0
  
  // Calculate acute:chronic workload ratio (last week vs previous 3 weeks average)
  let acuteChronicRatio = 1.0
  if (weeklyLoadArray.length >= 4) {
    const acuteLoad = weeklyLoadArray[weeklyLoadArray.length - 1].load
    const chronicLoad = (
      weeklyLoadArray[weeklyLoadArray.length - 2].load +
      weeklyLoadArray[weeklyLoadArray.length - 3].load +
      weeklyLoadArray[weeklyLoadArray.length - 4].load
    ) / 3
    
    acuteChronicRatio = chronicLoad > 0 ? acuteLoad / chronicLoad : 1.0
  }
  
  // Determine if there are load spikes (ACWR > 1.5 is considered high risk)
  const hasLoadSpikes = acuteChronicRatio > 1.5
  
  return {
    hasLoadSpikes,
    highestLoadWeek,
    averageWeeklyLoad,
    acuteChronicRatio
  }
}

// Analyze recovery metrics for injury risk
export function analyzeRecoveryMetrics(recoveryData: RecoveryData[]): {
  fatigueLevel: 'Low' | 'Moderate' | 'High';
  sleepQuality: 'Poor' | 'Average' | 'Good';
  overallRecoveryStatus: number;
} {
  // Sort data by date (most recent first)
  const sortedData = [...recoveryData].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  
  // Get most recent data points (last 7 days)
  const recentData = sortedData.slice(0, 7)
  
  // Calculate average recovery metrics
  const calcAverage = (values: number[]) => 
    values.length > 0 ? values.reduce((sum, val) => sum + val, 0) / values.length : 0
  
  // Convert metrics from -1 to 1 scale to 0-100 scale
  const normalizeMetric = (value: number) => ((value + 1) / 2) * 100
  
  // Calculate fatigue level from biomarkers and soreness
  const biomarkers = recentData.map(d => d.bio_composite).filter(v => v !== undefined && v !== null)
  const soreness = recentData.map(d => d.soreness_composite).filter(v => v !== undefined && v !== null)
  
  const avgBiomarkers = normalizeMetric(calcAverage(biomarkers))
  const avgSoreness = normalizeMetric(calcAverage(soreness))
  
  // Determine fatigue level (lower scores = higher fatigue)
  let fatigueLevel: 'Low' | 'Moderate' | 'High' = 'Moderate'
  const fatigueScore = (avgBiomarkers + avgSoreness) / 2
  
  if (fatigueScore > 70) fatigueLevel = 'Low'
  else if (fatigueScore < 50) fatigueLevel = 'High'
  
  // Calculate sleep quality
  const sleepMetrics = recentData.map(d => d.sleep_composite).filter(v => v !== undefined && v !== null)
  const avgSleep = normalizeMetric(calcAverage(sleepMetrics))
  
  let sleepQuality: 'Poor' | 'Average' | 'Good' = 'Average'
  if (avgSleep > 70) sleepQuality = 'Good'
  else if (avgSleep < 50) sleepQuality = 'Poor'
  
  // Calculate overall recovery status
  const overallScores = recentData.map(d => d.emboss_baseline_score).filter(v => v !== undefined && v !== null)
  const overallRecoveryStatus = normalizeMetric(calcAverage(overallScores))
  
  return {
    fatigueLevel,
    sleepQuality,
    overallRecoveryStatus
  }
}

// Analyze physical imbalances for injury risk
export function analyzePhysicalImbalances(physicalData: PhysicalCapabilityData[]): {
  muscleImbalances: string[];
  lowCapabilities: string[];
} {
  // Get data for different movement types
  const sprintData = getDataByMovement(physicalData, MovementType.Sprint)
  const agilityData = getDataByMovement(physicalData, MovementType.Agility)
  const jumpData = getDataByMovement(physicalData, MovementType.Jump)
  const upperBodyData = getDataByMovement(physicalData, MovementType.UpperBody)
  
  // Calculate average benchmarks for different qualities
  const calculateQualityBenchmarks = (data: PhysicalCapabilityData[]) => {
    const qualityMap: Record<string, {sum: number, count: number}> = {}
    
    data.forEach(item => {
      if (!qualityMap[item.quality]) {
        qualityMap[item.quality] = {sum: 0, count: 0}
      }
      
      qualityMap[item.quality].sum += item.benchmarkPct
      qualityMap[item.quality].count += 1
    })
    
    const result: Record<string, number> = {}
    Object.entries(qualityMap).forEach(([quality, {sum, count}]) => {
      result[quality] = count > 0 ? sum / count : 0
    })
    
    return result
  }
  
  // Calculate averages for each movement type
  const sprintQualities = calculateQualityBenchmarks(sprintData)
  const agilityQualities = calculateQualityBenchmarks(agilityData)
  const jumpQualities = calculateQualityBenchmarks(jumpData)
  
  // Identify imbalances (significant differences between related qualities)
  const muscleImbalances: string[] = []
  
  // Check acceleration vs deceleration (common imbalance linked to hamstring injuries)
  if (sprintQualities['Acceleration'] && sprintQualities['Deceleration']) {
    const accDiff = Math.abs(sprintQualities['Acceleration'] - sprintQualities['Deceleration'])
    if (accDiff > 15) {
      muscleImbalances.push(`Acceleration/Deceleration imbalance (${accDiff.toFixed(1)}% difference)`)
    }
  }
  
  // Check take off vs landing (jump mechanics imbalance)
  if (jumpQualities['Take off'] && jumpQualities['Land']) {
    const jumpDiff = Math.abs(jumpQualities['Take off'] - jumpQualities['Land'])
    if (jumpDiff > 15) {
      muscleImbalances.push(`Jump takeoff/landing imbalance (${jumpDiff.toFixed(1)}% difference)`)
    }
  }
  
  // Identify low capability scores (under 50%)
  const lowCapabilities: string[] = []
  
  // Check sprint qualities
  Object.entries(sprintQualities).forEach(([quality, score]) => {
    if (score < 50) {
      lowCapabilities.push(`Sprint ${quality} (${score.toFixed(1)}%)`)
    }
  })
  
  // Check agility qualities
  Object.entries(agilityQualities).forEach(([quality, score]) => {
    if (score < 50) {
      lowCapabilities.push(`Agility ${quality} (${score.toFixed(1)}%)`)
    }
  })
  
  // Check jump qualities
  Object.entries(jumpQualities).forEach(([quality, score]) => {
    if (score < 50) {
      lowCapabilities.push(`Jump ${quality} (${score.toFixed(1)}%)`)
    }
  })
  
  return {
    muscleImbalances,
    lowCapabilities
  }
}

// Generate body heatmap data based on injury history
export function generateBodyHeatmap(injuryHistory: InjuryRecord[]): Record<string, number> {
  const bodyParts = {
    'Head': 0,
    'Neck': 0,
    'Shoulder': 0,
    'Upper Arm': 0,
    'Elbow': 0,
    'Forearm': 0,
    'Wrist': 0,
    'Hand': 0,
    'Chest': 0,
    'Abdomen': 0,
    'Back': 0,
    'Hip': 0,
    'Groin': 0,
    'Quadriceps': 0,
    'Hamstring': 0,
    'Knee': 0,
    'Calf': 0,
    'Shin': 0,
    'Ankle': 0,
    'Foot': 0
  }
  
  // Calculate injury counts per body part
  injuryHistory.forEach(injury => {
    if (bodyParts.hasOwnProperty(injury.bodyPart)) {
      // Add injury severity factor
      const severityFactor = injury.severity === 'Minor' ? 1 :
                             injury.severity === 'Moderate' ? 2 : 3
      
      // Add recurrence factor
      const recurrenceFactor = injury.recurrence ? 1.5 : 1
      
      // Increase heatmap value
      bodyParts[injury.bodyPart] += severityFactor * recurrenceFactor
    }
  })
  
  return bodyParts
}

// Generate recommended prehab exercises based on injury history and physical data
export function generatePrehab(
  injuryHistory: InjuryRecord[],
  muscleImbalances: string[],
  lowCapabilities: string[]
): string[] {
  const recommendations: string[] = []
  
  // Create a map of body parts to count occurrences
  const bodyPartCount: Record<string, number> = {}
  injuryHistory.forEach(injury => {
    bodyPartCount[injury.bodyPart] = (bodyPartCount[injury.bodyPart] || 0) + 1
  })
  
  // Add recommendations based on frequent injury locations
  Object.entries(bodyPartCount).forEach(([bodyPart, count]) => {
    if (count >= 2) {
      switch (bodyPart) {
        case 'Hamstring':
          recommendations.push('Nordic hamstring exercises (2-3x weekly)')
          recommendations.push('Hamstring flexibility routine (daily)')
          break
        case 'Ankle':
          recommendations.push('Ankle stability exercises with balance board (3x weekly)')
          recommendations.push('Ankle mobility exercises (daily)')
          break
        case 'Quadriceps':
          recommendations.push('Eccentric quad strengthening (2x weekly)')
          break
        case 'Groin':
          recommendations.push('Copenhagen adductor exercises (2-3x weekly)')
          recommendations.push('Groin flexibility routine (daily)')
          break
        case 'Knee':
          recommendations.push('ACL prevention program (3x weekly)')
          break
      }
    }
  })
  
  // Add recommendations based on muscle imbalances
  muscleImbalances.forEach(imbalance => {
    if (imbalance.includes('Acceleration/Deceleration')) {
      recommendations.push('Deceleration training focus (2x weekly)')
    }
    if (imbalance.includes('Jump takeoff/landing')) {
      recommendations.push('Landing mechanics training (2x weekly)')
    }
  })
  
  // Add recommendations based on low capabilities
  lowCapabilities.forEach(capability => {
    if (capability.includes('Sprint Acceleration')) {
      recommendations.push('Acceleration technique work (1x weekly)')
    }
    if (capability.includes('Sprint Deceleration')) {
      recommendations.push('Controlled deceleration drills (2x weekly)')
    }
    if (capability.includes('Agility')) {
      recommendations.push('Agility and change of direction training (2x weekly)')
    }
  })
  
  // Remove duplicates
  return [...new Set(recommendations)]
}

// Analyze overall injury risk
export function analyzeInjuryRisk(
  loadAnalysis: { hasLoadSpikes: boolean; acuteChronicRatio: number },
  recoveryAnalysis: { fatigueLevel: 'Low' | 'Moderate' | 'High'; sleepQuality: 'Poor' | 'Average' | 'Good' },
  physicalAnalysis: { muscleImbalances: string[]; lowCapabilities: string[] },
  injuryHistory: InjuryRecord[]
): 'Low' | 'Moderate' | 'High' {
  let riskScore = 0
  
  // Load risk factors
  if (loadAnalysis.hasLoadSpikes) riskScore += 2
  if (loadAnalysis.acuteChronicRatio > 1.3) riskScore += loadAnalysis.acuteChronicRatio
  
  // Recovery risk factors
  if (recoveryAnalysis.fatigueLevel === 'High') riskScore += 2
  else if (recoveryAnalysis.fatigueLevel === 'Moderate') riskScore += 1
  
  if (recoveryAnalysis.sleepQuality === 'Poor') riskScore += 2
  else if (recoveryAnalysis.sleepQuality === 'Average') riskScore += 1
  
  // Physical risk factors
  riskScore += physicalAnalysis.muscleImbalances.length
  riskScore += Math.min(physicalAnalysis.lowCapabilities.length, 3)
  
  // Injury history risk factors
  const recentInjuries = injuryHistory.filter(injury => {
    const injuryDate = new Date(injury.date)
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
    
    return injuryDate >= sixMonthsAgo
  })
  
  riskScore += recentInjuries.length * 1.5
  
  // Recurring injuries
  const recurringInjuries = injuryHistory.filter(injury => injury.recurrence)
  riskScore += recurringInjuries.length * 2
  
  // Determine risk level
  if (riskScore >= 8) return 'High'
  if (riskScore >= 4) return 'Moderate'
  return 'Low'
}

// Perform comprehensive injury analysis
export async function performInjuryAnalysis(
  physicalData: PhysicalCapabilityData[]
): Promise<InjuryAnalysisResults> {
  // Get mock injury history
  const injuryHistory = getMockInjuryHistory()
  
  // Fetch GPS and recovery data
  const gpsData = await fetchGPSData()
  const recoveryData = await fetchRecoveryData()
  
  // Perform analysis
  const loadAnalysis = analyzeLoadPatterns(gpsData)
  const recoveryAnalysis = analyzeRecoveryMetrics(recoveryData)
  const physicalAnalysis = analyzePhysicalImbalances(physicalData)
  
  // Generate body heatmap
  const bodyHeatmap = generateBodyHeatmap(injuryHistory)
  
  // Generate prehab recommendations
  const recommendedPrehab = generatePrehab(
    injuryHistory,
    physicalAnalysis.muscleImbalances,
    physicalAnalysis.lowCapabilities
  )
  
  // Analyze overall injury risk
  const overallRisk = analyzeInjuryRisk(
    loadAnalysis,
    recoveryAnalysis,
    physicalAnalysis,
    injuryHistory
  )
  
  // Compile risk factors
  const riskFactors: InjuryRiskFactors = {
    loadSpikes: loadAnalysis.hasLoadSpikes,
    fatigueLevel: recoveryAnalysis.fatigueLevel,
    sleepQuality: recoveryAnalysis.sleepQuality,
    muscleImbalances: physicalAnalysis.muscleImbalances,
    previousInjuries: injuryHistory.map(injury => `${injury.bodyPart} ${injury.injuryType}`),
    overallRisk
  }
  
  return {
    currentStatus: 'Available', // Assuming player is available
    injuryHistory,
    riskFactors,
    bodyHeatmap,
    recommendedPrehab
  }
}