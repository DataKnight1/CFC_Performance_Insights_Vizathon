import { parseCSV } from './csv-parser';
import { fetchRecoveryData, RecoveryData, calculateRecoveryScore } from './recovery-data';

export interface WeatherData {
  date: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  rainfall: number;
  condition: 'Sunny' | 'Cloudy' | 'Rainy' | 'Windy' | 'Cold' | 'Hot';
}

export interface PitchData {
  venue: string;
  quality: number;
  firmness: number;
  wetness: number;
}

export interface TravelData {
  departure: string;
  destination: string;
  distance: number;
  date: string;
  competition: string;
  timeZoneDiff: number;
}

export interface TeamDynamicsData {
  date: string;
  cohesionScore: number;
  communicationScore: number;
  leadershipScore: number;
  motivationScore: number;
  conflictScore: number;
  notes: string;
}

export interface MotivationData {
  player: string;
  intrinsicScore: number;
  extrinsicScore: number;
  teamScore: number;
  personalGoalAlignment: number;
  careerStage: 'Early' | 'Peak' | 'Late';
  trend: 'Increasing' | 'Stable' | 'Decreasing';
}

export interface ExternalFactorsData {
  weather: WeatherData[];
  pitches: PitchData[];
  travel: TravelData[];
  teamDynamics: TeamDynamicsData[];
  playerMotivation: MotivationData[];
}

// Mock data - in a real app, this would be fetched from an API or database
export const getExternalFactorsData = (): ExternalFactorsData => {
  return {
    weather: [
      { date: '2025-03-05', temperature: 8, humidity: 65, windSpeed: 12, rainfall: 0, condition: 'Cloudy' },
      { date: '2025-03-08', temperature: 12, humidity: 60, windSpeed: 8, rainfall: 0, condition: 'Sunny' },
      { date: '2025-03-12', temperature: 5, humidity: 70, windSpeed: 15, rainfall: 5, condition: 'Rainy' },
      { date: '2025-03-15', temperature: 7, humidity: 75, windSpeed: 20, rainfall: 10, condition: 'Rainy' },
      { date: '2025-03-19', temperature: 4, humidity: 60, windSpeed: 10, rainfall: 0, condition: 'Cold' },
      { date: '2025-03-22', temperature: 14, humidity: 55, windSpeed: 5, rainfall: 0, condition: 'Sunny' },
      { date: '2025-03-26', temperature: 18, humidity: 65, windSpeed: 18, rainfall: 0, condition: 'Windy' },
      { date: '2025-03-29', temperature: 24, humidity: 70, windSpeed: 6, rainfall: 0, condition: 'Hot' },
      { date: '2025-04-02', temperature: 16, humidity: 60, windSpeed: 12, rainfall: 0, condition: 'Cloudy' },
      { date: '2025-04-09', temperature: 22, humidity: 50, windSpeed: 8, rainfall: 0, condition: 'Sunny' },
      { date: '2025-04-13', temperature: 14, humidity: 75, windSpeed: 25, rainfall: 0, condition: 'Windy' },
      { date: '2025-04-20', temperature: 15, humidity: 65, windSpeed: 10, rainfall: 0, condition: 'Cloudy' },
      { date: '2025-04-30', temperature: 10, humidity: 80, windSpeed: 15, rainfall: 8, condition: 'Rainy' }
    ],
    pitches: [
      { venue: 'Stamford Bridge', quality: 9.5, firmness: 8.5, wetness: 2 },
      { venue: 'Old Trafford', quality: 8.2, firmness: 7.8, wetness: 4 },
      { venue: 'Anfield', quality: 8.7, firmness: 8.0, wetness: 3 },
      { venue: 'Etihad Stadium', quality: 9.0, firmness: 8.5, wetness: 2 },
      { venue: 'Emirates Stadium', quality: 8.8, firmness: 8.2, wetness: 2 },
      { venue: 'Santiago Bernabéu', quality: 9.3, firmness: 8.8, wetness: 1 },
      { venue: 'Allianz Arena', quality: 9.2, firmness: 8.7, wetness: 2 }
    ],
    travel: [
      { departure: 'London', destination: 'Manchester', distance: 320, date: '2025-04-02', competition: 'Premier League', timeZoneDiff: 0 },
      { departure: 'London', destination: 'Madrid', distance: 1750, date: '2025-04-09', competition: 'Champions League', timeZoneDiff: 1 },
      { departure: 'London', destination: 'Newcastle', distance: 450, date: '2025-04-13', competition: 'Premier League', timeZoneDiff: 0 },
      { departure: 'London', destination: 'Liverpool', distance: 350, date: '2025-04-20', competition: 'Premier League', timeZoneDiff: 0 },
      { departure: 'London', destination: 'Munich', distance: 1560, date: '2025-04-30', competition: 'Champions League', timeZoneDiff: 1 }
    ],
    teamDynamics: [
      { 
        date: '2025-03-01', 
        cohesionScore: 85, 
        communicationScore: 82, 
        leadershipScore: 88, 
        motivationScore: 90, 
        conflictScore: 15,
        notes: 'Strong team spirit following pre-season training camp'
      },
      { 
        date: '2025-03-15', 
        cohesionScore: 87, 
        communicationScore: 84, 
        leadershipScore: 89, 
        motivationScore: 92, 
        conflictScore: 12,
        notes: 'Improved cohesion after team-building workshop'
      },
      { 
        date: '2025-03-31', 
        cohesionScore: 82, 
        communicationScore: 79, 
        leadershipScore: 86, 
        motivationScore: 84, 
        conflictScore: 22,
        notes: 'Some tension after consecutive losses'
      },
      { 
        date: '2025-04-10', 
        cohesionScore: 86, 
        communicationScore: 83, 
        leadershipScore: 87, 
        motivationScore: 89, 
        conflictScore: 16,
        notes: 'Recovery in team dynamics following crucial win'
      },
      { 
        date: '2025-04-25', 
        cohesionScore: 90, 
        communicationScore: 88, 
        leadershipScore: 91, 
        motivationScore: 94, 
        conflictScore: 10,
        notes: 'Peak cohesion as team enters critical phase of season'
      }
    ],
    playerMotivation: [
      {
        player: 'Reece James',
        intrinsicScore: 92,
        extrinsicScore: 84,
        teamScore: 95,
        personalGoalAlignment: 90,
        careerStage: 'Peak',
        trend: 'Stable'
      },
      {
        player: 'Cole Palmer',
        intrinsicScore: 94,
        extrinsicScore: 87,
        teamScore: 90,
        personalGoalAlignment: 92,
        careerStage: 'Early',
        trend: 'Increasing'
      },
      {
        player: 'Enzo Fernández',
        intrinsicScore: 90,
        extrinsicScore: 85,
        teamScore: 88,
        personalGoalAlignment: 85,
        careerStage: 'Early',
        trend: 'Stable'
      },
      {
        player: 'Wesley Fofana',
        intrinsicScore: 87,
        extrinsicScore: 79,
        teamScore: 86,
        personalGoalAlignment: 83,
        careerStage: 'Early',
        trend: 'Increasing'
      },
      {
        player: 'Thiago Silva',
        intrinsicScore: 95,
        extrinsicScore: 75,
        teamScore: 98,
        personalGoalAlignment: 82,
        careerStage: 'Late',
        trend: 'Stable'
      },
      {
        player: 'Mykhailo Mudryk',
        intrinsicScore: 84,
        extrinsicScore: 89,
        teamScore: 82,
        personalGoalAlignment: 87,
        careerStage: 'Early',
        trend: 'Increasing'
      },
      {
        player: 'Nicolas Jackson',
        intrinsicScore: 88,
        extrinsicScore: 85,
        teamScore: 84,
        personalGoalAlignment: 89,
        careerStage: 'Early',
        trend: 'Increasing'
      },
      {
        player: 'Robert Sánchez',
        intrinsicScore: 86,
        extrinsicScore: 80,
        teamScore: 88,
        personalGoalAlignment: 84,
        careerStage: 'Peak',
        trend: 'Stable'
      }
    ]
  };
};

// Analyze correlation between travel distance and recovery
export const analyzeTravelImpact = async (): Promise<{ 
  correlation: number; 
  dataPoints: Array<{ distance: number; recovery: number; date: string }>
}> => {
  const externalFactors = getExternalFactorsData();
  const recoveryData = await fetchRecoveryData();
  
  // Match travel data with recovery data based on date
  const matchedData = externalFactors.travel.map(travel => {
    // Find recovery data for the day after travel (assuming travel impacts the next day's recovery)
    const travelDate = new Date(travel.date);
    const nextDay = new Date(travelDate);
    nextDay.setDate(nextDay.getDate() + 1);
    
    const nextDayISO = nextDay.toISOString().split('T')[0];
    const recoveryForDay = recoveryData.find(r => r.date === nextDayISO);
    
    return {
      distance: travel.distance,
      recovery: recoveryForDay ? calculateRecoveryScore(recoveryForDay) : 75, // Default if no data
      date: travel.date
    };
  });
  
  // Calculate correlation coefficient (Pearson's r)
  // This is a simplified calculation for demonstration
  const distances = matchedData.map(d => d.distance);
  const recoveryScores = matchedData.map(d => d.recovery);
  
  const avgDistance = distances.reduce((sum, val) => sum + val, 0) / distances.length;
  const avgRecovery = recoveryScores.reduce((sum, val) => sum + val, 0) / recoveryScores.length;
  
  let numerator = 0;
  let denomDistances = 0;
  let denomRecovery = 0;
  
  for (let i = 0; i < distances.length; i++) {
    const distanceDiff = distances[i] - avgDistance;
    const recoveryDiff = recoveryScores[i] - avgRecovery;
    
    numerator += distanceDiff * recoveryDiff;
    denomDistances += distanceDiff * distanceDiff;
    denomRecovery += recoveryDiff * recoveryDiff;
  }
  
  const correlation = numerator / (Math.sqrt(denomDistances) * Math.sqrt(denomRecovery));
  
  return {
    correlation: Math.round(correlation * 100) / 100, // Round to 2 decimal places
    dataPoints: matchedData
  };
};

// Analyze weather impact on performance
export const analyzeWeatherImpact = (): Record<string, { 
  impact: number; 
  avgValue: number;
  matchCount: number;
}> => {
  const externalFactors = getExternalFactorsData();
  
  // This would ideally be calculated from actual performance data
  // For this mock, we'll use fixed values representing average impact
  return {
    hot: { 
      impact: -8, 
      avgValue: externalFactors.weather
        .filter(w => w.condition === 'Hot')
        .reduce((sum, w) => sum + w.temperature, 0) / 
        externalFactors.weather.filter(w => w.condition === 'Hot').length,
      matchCount: externalFactors.weather.filter(w => w.condition === 'Hot').length
    },
    cold: { 
      impact: -3, 
      avgValue: externalFactors.weather
        .filter(w => w.condition === 'Cold')
        .reduce((sum, w) => sum + w.temperature, 0) / 
        externalFactors.weather.filter(w => w.condition === 'Cold').length,
      matchCount: externalFactors.weather.filter(w => w.condition === 'Cold').length
    },
    windy: { 
      impact: -5, 
      avgValue: externalFactors.weather
        .filter(w => w.condition === 'Windy')
        .reduce((sum, w) => sum + w.windSpeed, 0) / 
        externalFactors.weather.filter(w => w.condition === 'Windy').length,
      matchCount: externalFactors.weather.filter(w => w.condition === 'Windy').length
    },
    rainy: { 
      impact: -6, 
      avgValue: externalFactors.weather
        .filter(w => w.condition === 'Rainy')
        .reduce((sum, w) => sum + w.rainfall, 0) / 
        externalFactors.weather.filter(w => w.condition === 'Rainy').length,
      matchCount: externalFactors.weather.filter(w => w.condition === 'Rainy').length
    }
  };
};

// Calculate average pitch quality
export const calculatePitchQualityStats = (): { 
  averageQuality: number;
  bestVenue: string;
  worstVenue: string;
  homePitchQuality: number;
} => {
  const externalFactors = getExternalFactorsData();
  
  const averageQuality = externalFactors.pitches
    .reduce((sum, p) => sum + p.quality, 0) / externalFactors.pitches.length;
  
  // Find best and worst venues
  let bestVenue = externalFactors.pitches[0].venue;
  let bestQuality = externalFactors.pitches[0].quality;
  
  let worstVenue = externalFactors.pitches[0].venue;
  let worstQuality = externalFactors.pitches[0].quality;
  
  for (const pitch of externalFactors.pitches) {
    if (pitch.quality > bestQuality) {
      bestQuality = pitch.quality;
      bestVenue = pitch.venue;
    }
    
    if (pitch.quality < worstQuality) {
      worstQuality = pitch.quality;
      worstVenue = pitch.venue;
    }
  }
  
  // Stamford Bridge is Chelsea's home pitch
  const homePitch = externalFactors.pitches.find(p => p.venue === 'Stamford Bridge');
  const homePitchQuality = homePitch?.quality || 0;
  
  return {
    averageQuality: Math.round(averageQuality * 10) / 10, // Round to 1 decimal place
    bestVenue,
    worstVenue,
    homePitchQuality
  };
};

// Calculate time zone impact prediction
export const calculateTimeZoneImpact = (): Record<string, { 
  impact: number; 
  occurrences: number;
}> => {
  const externalFactors = getExternalFactorsData();
  
  // Count occurrences of each time zone difference
  const timeZoneCounts: Record<number, number> = {};
  
  for (const travel of externalFactors.travel) {
    const diff = Math.abs(travel.timeZoneDiff);
    timeZoneCounts[diff] = (timeZoneCounts[diff] || 0) + 1;
  }
  
  // Map time zone differences to impact levels
  return {
    'none': { impact: 0, occurrences: timeZoneCounts[0] || 0 },
    'one': { impact: -2, occurrences: timeZoneCounts[1] || 0 },
    'two': { impact: -5, occurrences: timeZoneCounts[2] || 0 },
    'three_plus': { impact: -8, occurrences: timeZoneCounts[3] || 0 + (timeZoneCounts[4] || 0) + (timeZoneCounts[5] || 0) + (timeZoneCounts[6] || 0) }
  };
};

// Calculate total travel impact statistics
export const calculateTravelStats = (): { 
  totalDistance: number; 
  averageDistancePerTrip: number;
  longestTrip: { destination: string; distance: number; };
  impactRating: 'Low' | 'Medium' | 'High';
} => {
  const externalFactors = getExternalFactorsData();
  
  const totalDistance = externalFactors.travel.reduce((sum, t) => sum + t.distance, 0);
  const averageDistancePerTrip = totalDistance / externalFactors.travel.length;
  
  // Find longest trip
  let longestTrip = { destination: '', distance: 0 };
  
  for (const trip of externalFactors.travel) {
    if (trip.distance > longestTrip.distance) {
      longestTrip = { destination: trip.destination, distance: trip.distance };
    }
  }
  
  // Determine impact rating based on total distance
  let impactRating: 'Low' | 'Medium' | 'High';
  
  if (totalDistance < 5000) {
    impactRating = 'Low';
  } else if (totalDistance < 10000) {
    impactRating = 'Medium';
  } else {
    impactRating = 'High';
  }
  
  return {
    totalDistance,
    averageDistancePerTrip: Math.round(averageDistancePerTrip),
    longestTrip,
    impactRating
  };
};

// Analyze team dynamics trends
export const analyzeTeamDynamics = (): {
  currentCohesion: number;
  cohesionTrend: 'Improving' | 'Stable' | 'Declining';
  latestAssessment: TeamDynamicsData;
  keyStrengths: string[];
  keyAreas: string[];
  teamDynamicsTrend: { date: string; cohesion: number; communication: number; leadership: number; motivation: number; conflict: number; }[];
} => {
  const externalFactors = getExternalFactorsData();
  
  // Sort team dynamics data by date (most recent first)
  const sortedData = [...externalFactors.teamDynamics].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  // Get the latest assessment
  const latestAssessment = sortedData[0];
  
  // Get the assessment from the beginning of the analyzed period
  const earliestAssessment = sortedData[sortedData.length - 1];
  
  // Calculate cohesion trend
  const cohesionDifference = latestAssessment.cohesionScore - earliestAssessment.cohesionScore;
  let cohesionTrend: 'Improving' | 'Stable' | 'Declining';
  
  if (cohesionDifference >= 3) {
    cohesionTrend = 'Improving';
  } else if (cohesionDifference <= -3) {
    cohesionTrend = 'Declining';
  } else {
    cohesionTrend = 'Stable';
  }
  
  // Determine key strengths and areas for improvement
  const latestScores = {
    cohesion: latestAssessment.cohesionScore,
    communication: latestAssessment.communicationScore,
    leadership: latestAssessment.leadershipScore,
    motivation: latestAssessment.motivationScore,
    conflict: latestAssessment.conflictScore
  };
  
  // Sort metrics by score (excluding conflict which is better when lower)
  const sortedMetrics = Object.entries(latestScores)
    .filter(([key]) => key !== 'conflict')
    .sort((a, b) => b[1] - a[1]);
  
  // Top 2 metrics are strengths
  const keyStrengths = sortedMetrics.slice(0, 2).map(([key]) => {
    switch(key) {
      case 'cohesion': return 'Team Cohesion';
      case 'communication': return 'Communication';
      case 'leadership': return 'Leadership';
      case 'motivation': return 'Motivation';
      default: return key;
    }
  });
  
  // Bottom 2 metrics are areas for improvement (plus conflict if it's high)
  const keyAreas = [
    ...sortedMetrics.slice(-2).map(([key]) => {
      switch(key) {
        case 'cohesion': return 'Team Cohesion';
        case 'communication': return 'Communication';
        case 'leadership': return 'Leadership';
        case 'motivation': return 'Motivation';
        default: return key;
      }
    })
  ];
  
  // Add conflict if it's high (lower is better for conflict)
  if (latestScores.conflict > 15) {
    keyAreas.push('Conflict Management');
  }
  
  // Prepare trend data for charts (sorting by date ascending)
  const teamDynamicsTrend = sortedData
    .slice()
    .reverse()
    .map(item => ({
      date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      cohesion: item.cohesionScore,
      communication: item.communicationScore,
      leadership: item.leadershipScore,
      motivation: item.motivationScore,
      conflict: item.conflictScore
    }));
  
  return {
    currentCohesion: latestAssessment.cohesionScore,
    cohesionTrend,
    latestAssessment,
    keyStrengths,
    keyAreas,
    teamDynamicsTrend
  };
};

// Analyze player motivation patterns
export const analyzePlayerMotivation = (): {
  teamMotivationAvg: number;
  motivationByCareerStage: { stage: string; intrinsic: number; extrinsic: number; team: number; }[];
  playersWithIncreasingMotivation: string[];
  playersRequiringAttention: string[];
  mostMotivatedPlayers: string[];
  motivationScoreChartData: { player: string; intrinsic: number; extrinsic: number; team: number; }[];
} => {
  const externalFactors = getExternalFactorsData();
  
  // Calculate average motivation scores
  const intrinsicAvg = externalFactors.playerMotivation.reduce((sum, p) => sum + p.intrinsicScore, 0) / 
    externalFactors.playerMotivation.length;
  
  const extrinsicAvg = externalFactors.playerMotivation.reduce((sum, p) => sum + p.extrinsicScore, 0) / 
    externalFactors.playerMotivation.length;
  
  const teamAvg = externalFactors.playerMotivation.reduce((sum, p) => sum + p.teamScore, 0) / 
    externalFactors.playerMotivation.length;
  
  const goalAlignmentAvg = externalFactors.playerMotivation.reduce((sum, p) => sum + p.personalGoalAlignment, 0) / 
    externalFactors.playerMotivation.length;
  
  // Calculate motivation by career stage
  const stages = ['Early', 'Peak', 'Late'] as const;
  const motivationByCareerStage = stages.map(stage => {
    const playersInStage = externalFactors.playerMotivation.filter(p => p.careerStage === stage);
    
    if (playersInStage.length === 0) {
      return { stage, intrinsic: 0, extrinsic: 0, team: 0 };
    }
    
    return {
      stage,
      intrinsic: playersInStage.reduce((sum, p) => sum + p.intrinsicScore, 0) / playersInStage.length,
      extrinsic: playersInStage.reduce((sum, p) => sum + p.extrinsicScore, 0) / playersInStage.length,
      team: playersInStage.reduce((sum, p) => sum + p.teamScore, 0) / playersInStage.length
    };
  });
  
  // Find players with increasing motivation
  const playersWithIncreasingMotivation = externalFactors.playerMotivation
    .filter(p => p.trend === 'Increasing')
    .map(p => p.player);
  
  // Find players requiring attention (below average in multiple categories)
  const playersRequiringAttention = externalFactors.playerMotivation
    .filter(p => {
      let belowAverageCount = 0;
      
      if (p.intrinsicScore < intrinsicAvg - 5) belowAverageCount++;
      if (p.extrinsicScore < extrinsicAvg - 5) belowAverageCount++;
      if (p.teamScore < teamAvg - 5) belowAverageCount++;
      if (p.personalGoalAlignment < goalAlignmentAvg - 5) belowAverageCount++;
      
      return belowAverageCount >= 2 || p.trend === 'Decreasing';
    })
    .map(p => p.player);
  
  // Find most motivated players (composite score)
  const mostMotivatedPlayers = [...externalFactors.playerMotivation]
    .sort((a, b) => {
      const scoreA = (a.intrinsicScore + a.teamScore + a.personalGoalAlignment) / 3;
      const scoreB = (b.intrinsicScore + b.teamScore + b.personalGoalAlignment) / 3;
      return scoreB - scoreA;
    })
    .slice(0, 3)
    .map(p => p.player);
  
  // Prepare data for the motivation score chart
  const motivationScoreChartData = externalFactors.playerMotivation
    .map(p => ({
      player: p.player,
      intrinsic: p.intrinsicScore,
      extrinsic: p.extrinsicScore,
      team: p.teamScore
    }));
  
  return {
    teamMotivationAvg: Math.round((intrinsicAvg + teamAvg) / 2),
    motivationByCareerStage,
    playersWithIncreasingMotivation,
    playersRequiringAttention,
    mostMotivatedPlayers,
    motivationScoreChartData
  };
};