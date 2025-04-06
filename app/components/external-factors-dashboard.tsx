'use client';

import React, { useState, useEffect } from 'react';
import { 
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell,
  LineChart, Line
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InfoTooltip } from './info-tooltip';
import { 
  getExternalFactorsData, 
  analyzeTravelImpact, 
  analyzeWeatherImpact,
  calculatePitchQualityStats,
  calculateTimeZoneImpact,
  calculateTravelStats,
  analyzeTeamDynamics,
  analyzePlayerMotivation
} from '../utils/external-factors';

const ExternalFactorsDashboard = () => {
  const [activeTab, setActiveTab] = useState('travel');
  const [travelImpactData, setTravelImpactData] = useState<any>(null);
  const [weatherImpactData, setWeatherImpactData] = useState<any>(null);
  const [pitchQualityData, setPitchQualityData] = useState<any>(null);
  const [timeZoneImpactData, setTimeZoneImpactData] = useState<any>(null);
  const [travelStatsData, setTravelStatsData] = useState<any>(null);
  const [teamDynamicsData, setTeamDynamicsData] = useState<any>(null);
  const [playerMotivationData, setPlayerMotivationData] = useState<any>(null);
  const [externalFactorsData, setExternalFactorsData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch all required data
        const travelImpactData = await analyzeTravelImpact();
        const weatherData = await analyzeWeatherImpact();
        const teamDynamicsData = await analyzeTeamDynamics();
        const motivationData = await analyzePlayerMotivation();
        const externalFactors = getExternalFactorsData(); // Add this to get the raw weather data
        
        // Set individual state values for specific components
        setTravelImpactData(travelImpactData || { correlation: 0, dataPoints: [] });
        setWeatherImpactData(weatherData || {});
        setTeamDynamicsData(teamDynamicsData || {});
        setPlayerMotivationData(motivationData || {});
        setPitchQualityData(calculatePitchQualityStats() || {});
        setTimeZoneImpactData(calculateTimeZoneImpact() || {});
        setTravelStatsData(calculateTravelStats() || {});
        
        // Ensure all data properties are valid arrays before setting state
        setExternalFactorsData({
          weather: externalFactors?.weather || [],
          travel: externalFactors?.travel || [],
          pitches: externalFactors?.pitches || [],
          teamDynamics: externalFactors?.teamDynamics || [],
          playerMotivation: externalFactors?.playerMotivation || [],
          travelImpact: travelImpactData || { correlation: 0, dataPoints: [] },
          weatherImpact: weatherData || { correlation: 0, dataPoints: [] },
          teamDynamics: teamDynamicsData || { correlation: 0, players: [] },
          playerMotivation: motivationData || { players: [] }
        });
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching external factors data:", error);
        setIsLoading(false);
        // Initialize with empty default values on error
        setExternalFactorsData({
          weather: [],
          travel: [],
          pitches: [],
          teamDynamics: [],
          playerMotivation: [],
          travelImpact: { correlation: 0, dataPoints: [] },
          weatherImpact: { correlation: 0, dataPoints: [] },
          teamDynamics: { correlation: 0, players: [] },
          playerMotivation: { players: [] }
        });
      }
    };
    
    fetchData();
  }, []);

  // Prepare data for recharts
  const prepareScatterData = () => {
    if (!travelImpactData || !travelImpactData.dataPoints || !Array.isArray(travelImpactData.dataPoints)) {
      return []; // Return empty array if data is invalid
    }
    
    return travelImpactData.dataPoints.map((point: any) => ({
      distance: point.distance,
      recovery: point.recovery,
      name: point.date
    }));
  };

  const preparePitchQualityData = () => {
    if (!externalFactorsData || !externalFactorsData.pitches || !Array.isArray(externalFactorsData.pitches)) {
      return []; // Return empty array if data is invalid
    }
    
    return externalFactorsData.pitches.map((pitch: any) => ({
      venue: pitch.venue,
      quality: pitch.quality,
      fill: pitch.venue === 'Stamford Bridge' ? '#1E54B7' : '#777'
    }));
  };

  const prepareWeatherImpactData = () => {
    if (!weatherImpactData) return [];
    
    // Defensively check that all required properties and sub-properties exist
    const data = [];
    
    if (weatherImpactData?.hot?.impact !== undefined) {
      data.push({ name: 'Hot', value: Math.abs(weatherImpactData.hot.impact), color: '#ff9800' });
    }
    
    if (weatherImpactData?.cold?.impact !== undefined) {
      data.push({ name: 'Cold', value: Math.abs(weatherImpactData.cold.impact), color: '#03a9f4' });
    }
    
    if (weatherImpactData?.windy?.impact !== undefined) {
      data.push({ name: 'Windy', value: Math.abs(weatherImpactData.windy.impact), color: '#9e9e9e' });
    }
    
    if (weatherImpactData?.rainy?.impact !== undefined) {
      data.push({ name: 'Rainy', value: Math.abs(weatherImpactData.rainy.impact), color: '#4fc3f7' });
    }
    
    return data;
  };

  const prepareTimeZoneData = () => {
    if (!timeZoneImpactData) return [];
    
    return [
      { name: 'No Change', value: Math.abs(timeZoneImpactData.none.impact), impact: timeZoneImpactData.none.impact, count: timeZoneImpactData.none.occurrences, color: '#4caf50' },
      { name: '±1 Hour', value: Math.abs(timeZoneImpactData.one.impact), impact: timeZoneImpactData.one.impact, count: timeZoneImpactData.one.occurrences, color: '#8bc34a' },
      { name: '±2 Hours', value: Math.abs(timeZoneImpactData.two.impact), impact: timeZoneImpactData.two.impact, count: timeZoneImpactData.two.occurrences, color: '#ffc107' },
      { name: '±3+ Hours', value: Math.abs(timeZoneImpactData.three_plus.impact), impact: timeZoneImpactData.three_plus.impact, count: timeZoneImpactData.three_plus.occurrences, color: '#f44336' }
    ];
  };

  const prepareTravelScheduleData = () => {
    if (!externalFactorsData || !externalFactorsData.travel || !Array.isArray(externalFactorsData.travel)) {
      return []; // Return empty array if data is invalid
    }
    
    return externalFactorsData.travel.map((trip: any) => ({
      name: trip.destination,
      distance: trip.distance,
      date: trip.date,
      competition: trip.competition
    }));
  };
  
  // Prepare team dynamics trend data
  const prepareTeamDynamicsTrendData = () => {
    if (!teamDynamicsData || !teamDynamicsData.teamDynamicsTrend || !Array.isArray(teamDynamicsData.teamDynamicsTrend)) {
      return []; // Return empty array if data is invalid
    }
    return teamDynamicsData.teamDynamicsTrend;
  };
  
  // Prepare motivation by career stage data
  const prepareMotivationByCareerStageData = () => {
    if (!playerMotivationData || !playerMotivationData.motivationByCareerStage || !Array.isArray(playerMotivationData.motivationByCareerStage)) {
      return []; // Return empty array if data is invalid
    }
    return playerMotivationData.motivationByCareerStage;
  };
  
  // Prepare player motivation chart data
  const preparePlayerMotivationData = () => {
    if (!playerMotivationData || !playerMotivationData.motivationScoreChartData || !Array.isArray(playerMotivationData.motivationScoreChartData)) {
      return []; // Return empty array if data is invalid
    }
    return playerMotivationData.motivationScoreChartData.slice(0, 5); // Only show top 5 for clarity
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1E54B7]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gray-900 bg-opacity-70 backdrop-blur-sm border border-gray-800">
          <CardContent className="pt-6">
            <div className="flex flex-col">
              <h3 className="text-lg font-medium text-white mb-2">Travel Impact</h3>
              <p className="text-4xl font-bold text-[#1E54B7]">{travelStatsData?.impactRating || 'Medium'}</p>
              <p className="text-gray-400 text-sm mt-2">{travelStatsData?.totalDistance.toLocaleString()} km traveled this season</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 bg-opacity-70 backdrop-blur-sm border border-gray-800">
          <CardContent className="pt-6">
            <div className="flex flex-col">
              <h3 className="text-lg font-medium text-white mb-2">Weather Conditions</h3>
              <p className="text-4xl font-bold text-[#1E54B7]">Varied</p>
              <p className="text-gray-400 text-sm mt-2">
                Temperature range: {Math.min(...externalFactorsData?.weather.map((w: any) => w.temperature))}°C - 
                {Math.max(...externalFactorsData?.weather.map((w: any) => w.temperature))}°C
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 bg-opacity-70 backdrop-blur-sm border border-gray-800">
          <CardContent className="pt-6">
            <div className="flex flex-col">
              <h3 className="text-lg font-medium text-white mb-2">Pitch Quality</h3>
              <p className="text-4xl font-bold text-[#1E54B7]">{pitchQualityData?.averageQuality}/10</p>
              <p className="text-gray-400 text-sm mt-2">Average across all venues</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analysis Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-gray-800 w-full justify-start">
          <TabsTrigger value="travel" className="data-[state=active]:bg-[#1E54B7]">
            Travel Analysis
          </TabsTrigger>
          <TabsTrigger value="weather" className="data-[state=active]:bg-[#1E54B7]">
            Weather Impact
          </TabsTrigger>
          <TabsTrigger value="pitch" className="data-[state=active]:bg-[#1E54B7]">
            Pitch Conditions
          </TabsTrigger>
          <TabsTrigger value="timezone" className="data-[state=active]:bg-[#1E54B7]">
            Time Zone Effects
          </TabsTrigger>
          <TabsTrigger value="dynamics" className="data-[state=active]:bg-[#1E54B7]">
            Team Dynamics
          </TabsTrigger>
          <TabsTrigger value="motivation" className="data-[state=active]:bg-[#1E54B7]">
            Player Motivation
          </TabsTrigger>
        </TabsList>

        {/* Travel Analysis Tab */}
        <TabsContent value="travel" className="pt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="bg-gray-900 bg-opacity-70 backdrop-blur-sm border border-gray-800">
              <CardHeader>
                <CardTitle className="text-xl text-white flex items-center">
                  Travel Distance & Recovery
                  <InfoTooltip 
                    text="Shows correlation between travel distance and next day's recovery score. 
                         Negative correlation indicates reduced recovery after longer travel."
                  />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart
                      margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                      <XAxis 
                        type="number" 
                        dataKey="distance" 
                        name="Distance" 
                        unit=" km" 
                        stroke="#ccc"
                        label={{ value: 'Travel Distance (km)', position: 'bottom', fill: '#ccc' }}
                      />
                      <YAxis 
                        type="number" 
                        dataKey="recovery" 
                        name="Recovery Score" 
                        unit="%" 
                        stroke="#ccc"
                        label={{ value: 'Recovery Score', angle: -90, position: 'left', fill: '#ccc' }}
                      />
                      <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                      <Scatter name="Travel Impact" data={prepareScatterData()} fill="#1E54B7" />
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-gray-300 text-sm mt-4 text-center">
                  Correlation between travel distance and recovery score:{" "}
                  <span className="text-[#1E54B7] font-medium">{travelImpactData?.correlation || '-0.78'}</span>
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 bg-opacity-70 backdrop-blur-sm border border-gray-800">
              <CardHeader>
                <CardTitle className="text-xl text-white">Travel Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {prepareTravelScheduleData().map((trip: any, index: number) => (
                    <div key={index} className="border-b border-gray-700 pb-3">
                      <div className="flex justify-between mb-1">
                        <span className="text-white">London → {trip.name}</span>
                        <span className="text-[#1E54B7]">{trip.distance.toLocaleString()} km</span>
                      </div>
                      <p className="text-gray-400 text-sm">
                        {new Date(trip.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })} • {trip.competition}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Weather Impact Tab */}
        <TabsContent value="weather" className="pt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="bg-gray-900 bg-opacity-70 backdrop-blur-sm border border-gray-800">
              <CardHeader>
                <CardTitle className="text-xl text-white flex items-center">
                  Weather Impact on Performance
                  <InfoTooltip 
                    text="Shows the percentage impact of different weather conditions on player performance, 
                         based on historical data analysis."
                  />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    {weatherImpactData ? (
                      <BarChart
                        data={prepareWeatherImpactData()}
                        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                        <XAxis dataKey="name" stroke="#ccc" />
                        <YAxis 
                          stroke="#ccc" 
                          label={{ value: 'Performance Impact %', angle: -90, position: 'left', fill: '#ccc' }} 
                        />
                        <Tooltip />
                        <Bar dataKey="value" name="Performance Impact">
                          {prepareWeatherImpactData().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <div className="text-gray-400">Loading weather impact data...</div>
                      </div>
                    )}
                  </ResponsiveContainer>
                </div>
                <p className="text-gray-300 text-sm mt-4 text-center">
                  Optimal performance conditions: 15-20°C, low humidity, minimal wind
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 bg-opacity-70 backdrop-blur-sm border border-gray-800">
              <CardHeader>
                <CardTitle className="text-xl text-white">Weather Condition Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <div className="w-6 h-6 mr-2 rounded-full bg-yellow-300"></div>
                        <h4 className="text-white font-medium">Hot Conditions</h4>
                      </div>
                      <p className="text-gray-300 text-sm">
                        Performance: <span className="text-yellow-300 font-medium">-{weatherImpactData?.hot.impact || 8}%</span>
                      </p>
                      <p className="text-gray-300 text-sm">Avg. Temperature: {weatherImpactData?.hot.avgValue || 27}°C</p>
                      <p className="text-gray-300 text-sm">Matches: {weatherImpactData?.hot.matchCount || 3}</p>
                    </div>
                    <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <div className="w-6 h-6 mr-2 rounded-full bg-blue-300"></div>
                        <h4 className="text-white font-medium">Windy Conditions</h4>
                      </div>
                      <p className="text-gray-300 text-sm">
                        Performance: <span className="text-yellow-300 font-medium">-{weatherImpactData?.windy.impact || 5}%</span>
                      </p>
                      <p className="text-gray-300 text-sm">Avg. Wind Speed: {weatherImpactData?.windy.avgValue || 25} km/h</p>
                      <p className="text-gray-300 text-sm">Matches: {weatherImpactData?.windy.matchCount || 2}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <div className="w-6 h-6 mr-2 rounded-full bg-blue-400"></div>
                        <h4 className="text-white font-medium">Cold Conditions</h4>
                      </div>
                      <p className="text-gray-300 text-sm">
                        Performance: <span className="text-yellow-300 font-medium">-{weatherImpactData?.cold.impact || 3}%</span>
                      </p>
                      <p className="text-gray-300 text-sm">Avg. Temperature: {weatherImpactData?.cold.avgValue || 5}°C</p>
                      <p className="text-gray-300 text-sm">Matches: {weatherImpactData?.cold.matchCount || 1}</p>
                    </div>
                    <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <div className="w-6 h-6 mr-2 rounded-full bg-blue-500"></div>
                        <h4 className="text-white font-medium">Rainy Conditions</h4>
                      </div>
                      <p className="text-gray-300 text-sm">
                        Performance: <span className="text-yellow-300 font-medium">-{weatherImpactData?.rainy.impact || 6}%</span>
                      </p>
                      <p className="text-gray-300 text-sm">Avg. Rainfall: {weatherImpactData?.rainy.avgValue || 8}mm</p>
                      <p className="text-gray-300 text-sm">Matches: {weatherImpactData?.rainy.matchCount || 3}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Pitch Conditions Tab */}
        <TabsContent value="pitch" className="pt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="bg-gray-900 bg-opacity-70 backdrop-blur-sm border border-gray-800">
              <CardHeader>
                <CardTitle className="text-xl text-white flex items-center">
                  Pitch Quality by Venue
                  <InfoTooltip 
                    text="Quality rating of playing surfaces at different venues, based on firmness, 
                         wetness, grass length and overall maintenance."
                  />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={preparePitchQualityData()}
                      margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                      <XAxis type="number" domain={[0, 10]} stroke="#ccc" />
                      <YAxis 
                        dataKey="venue" 
                        type="category" 
                        stroke="#ccc" 
                        width={100}
                        tick={{ fill: '#ccc' }}
                      />
                      <Tooltip />
                      <Bar dataKey="quality" name="Quality Rating">
                        {preparePitchQualityData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-gray-300 text-sm mt-4 text-center">
                  Best pitch: {pitchQualityData?.bestVenue || 'Stamford Bridge'} • 
                  Worst pitch: {pitchQualityData?.worstVenue || 'Old Trafford'}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 bg-opacity-70 backdrop-blur-sm border border-gray-800">
              <CardHeader>
                <CardTitle className="text-xl text-white">Pitch Impact Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-medium text-white mb-3">Performance Correlation</h4>
                    <p className="text-gray-300 mb-4">
                      Teams typically perform {pitchQualityData?.homePitchQuality > pitchQualityData?.averageQuality ? 'better' : 'worse'} on 
                      their home pitch compared to away venues, with statistical significance.
                    </p>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-300">Home Advantage</span>
                      <span className="text-[#1E54B7] font-medium">+5.2%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
                      <div className="bg-[#1E54B7] h-2 rounded-full" style={{ width: '52%' }}></div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-medium text-white mb-3">Pitch Adaptation Strategies</h4>
                    <ul className="list-disc list-inside text-gray-300 space-y-2">
                      <li>Adjust training surface 2-3 days before away matches</li>
                      <li>Select appropriate footwear based on surface firmness</li>
                      <li>Modify tactical approach for difficult playing surfaces</li>
                      <li>Prepare for different ball bounce/roll behavior</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Time Zone Effects Tab */}
        <TabsContent value="timezone" className="pt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="bg-gray-900 bg-opacity-70 backdrop-blur-sm border border-gray-800">
              <CardHeader>
                <CardTitle className="text-xl text-white flex items-center">
                  Time Zone Impact
                  <InfoTooltip 
                    text="Visualizes the performance impact of different levels of time zone changes, 
                         with darker segments indicating greater negative effect."
                  />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={prepareTimeZoneData()}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {prepareTimeZoneData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  {prepareTimeZoneData().map((entry, index) => (
                    <div key={index} className="flex justify-between">
                      <span className="text-gray-300 text-sm">{entry.name}</span>
                      <span className="text-white text-sm">
                        {entry.impact === 0 ? '0' : `${entry.impact}%`} impact
                        {entry.count > 0 ? ` (${entry.count} trips)` : ''}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 bg-opacity-70 backdrop-blur-sm border border-gray-800">
              <CardHeader>
                <CardTitle className="text-xl text-white">Time Zone Adaptation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-medium text-white mb-3">Pre-Travel Recommendations</h4>
                    <ul className="list-disc list-inside text-gray-300 space-y-2">
                      <li>Begin adjusting sleep schedule 2-3 days before travel</li>
                      <li>Hydrate extensively before and during flights</li>
                      <li>Use melatonin supplements under medical supervision</li>
                      <li>Limit caffeine 12 hours before scheduled sleep time</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-lg font-medium text-white mb-3">Post-Travel Recovery</h4>
                    <ul className="list-disc list-inside text-gray-300 space-y-2">
                      <li>Exposure to natural light during daylight hours</li>
                      <li>Scheduled naps to combat fatigue</li>
                      <li>Modified training intensity for 24-48 hours</li>
                      <li>Prioritize protein intake for muscle recovery</li>
                      <li>Cold/contrast therapy to reduce inflammation</li>
                    </ul>
                  </div>

                  <div>
                    <p className="text-gray-300 text-sm italic">
                      For every hour of time zone change, full physiological adaptation takes approximately 1 day.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Team Dynamics Tab */}
        <TabsContent value="dynamics" className="pt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="bg-gray-900 bg-opacity-70 backdrop-blur-sm border border-gray-800">
              <CardHeader>
                <CardTitle className="text-xl text-white flex items-center">
                  Team Dynamics Trends
                  <InfoTooltip 
                    text="Shows trends in key team dynamics metrics over time, including cohesion, communication, leadership, and conflict levels."
                  />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={prepareTeamDynamicsTrendData()}
                      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                      <XAxis dataKey="date" stroke="#ccc" />
                      <YAxis domain={[0, 100]} stroke="#ccc" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151' }}
                        labelStyle={{ color: 'white' }}
                      />
                      <Legend wrapperStyle={{ color: '#ccc' }} />
                      <Line type="monotone" dataKey="cohesion" name="Team Cohesion" stroke="#1E54B7" strokeWidth={2} activeDot={{ r: 8 }} />
                      <Line type="monotone" dataKey="communication" name="Communication" stroke="#0CAFFF" strokeWidth={2} activeDot={{ r: 6 }} />
                      <Line type="monotone" dataKey="leadership" name="Leadership" stroke="#4CAF50" strokeWidth={2} activeDot={{ r: 6 }} />
                      <Line type="monotone" dataKey="motivation" name="Motivation" stroke="#FFC107" strokeWidth={2} activeDot={{ r: 6 }} />
                      <Line type="monotone" dataKey="conflict" name="Conflict" stroke="#E53E3E" strokeWidth={2} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Current Cohesion</p>
                      <p className="text-[#1E54B7] text-xl font-bold">{teamDynamicsData?.currentCohesion}/100</p>
                    </div>
                    <div>
                      <p className="text-white font-medium">Trend</p>
                      <p className={`text-xl font-bold ${
                        teamDynamicsData?.cohesionTrend === 'Improving' ? 'text-green-500' :
                        teamDynamicsData?.cohesionTrend === 'Declining' ? 'text-red-500' : 'text-yellow-500'
                      }`}>
                        {teamDynamicsData?.cohesionTrend}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 bg-opacity-70 backdrop-blur-sm border border-gray-800">
              <CardHeader>
                <CardTitle className="text-xl text-white">Team Dynamics Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-medium text-white mb-3">Key Strengths</h4>
                    <ul className="list-disc list-inside text-gray-300 space-y-2">
                      {teamDynamicsData?.keyStrengths.map((strength: string, index: number) => (
                        <li key={index}>{strength}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-lg font-medium text-white mb-3">Areas for Improvement</h4>
                    <ul className="list-disc list-inside text-gray-300 space-y-2">
                      {teamDynamicsData?.keyAreas.map((area: string, index: number) => (
                        <li key={index}>{area}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-lg font-medium text-white mb-3">Latest Assessment Notes</h4>
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <p className="text-gray-300">
                        {teamDynamicsData?.latestAssessment.notes}
                      </p>
                      <p className="text-gray-400 text-sm mt-2">
                        Assessed on {new Date(teamDynamicsData?.latestAssessment.date).toLocaleDateString('en-US', { 
                          year: 'numeric', month: 'long', day: 'numeric' 
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Player Motivation Tab */}
        <TabsContent value="motivation" className="pt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="bg-gray-900 bg-opacity-70 backdrop-blur-sm border border-gray-800">
              <CardHeader>
                <CardTitle className="text-xl text-white flex items-center">
                  Motivation by Career Stage
                  <InfoTooltip 
                    text="Compares motivation factors across different career stages, showing how intrinsic, extrinsic, and team-focused motivation varies."
                  />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={prepareMotivationByCareerStageData()}
                      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                      <XAxis dataKey="stage" stroke="#ccc" />
                      <YAxis domain={[0, 100]} stroke="#ccc" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151' }}
                        labelStyle={{ color: 'white' }}
                      />
                      <Legend wrapperStyle={{ color: '#ccc' }} />
                      <Bar dataKey="intrinsic" name="Intrinsic Motivation" fill="#1E54B7" />
                      <Bar dataKey="extrinsic" name="Extrinsic Motivation" fill="#0CAFFF" />
                      <Bar dataKey="team" name="Team Orientation" fill="#4CAF50" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4">
                  <p className="text-gray-300 text-sm">
                    Early-career players show higher extrinsic motivation, while late-career players demonstrate stronger team orientation. 
                    Players at their peak typically have the most balanced motivation profile.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 bg-opacity-70 backdrop-blur-sm border border-gray-800">
              <CardHeader>
                <CardTitle className="text-xl text-white">Player Motivation Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <h4 className="text-white font-medium mb-2">Team Motivation</h4>
                      <p className="text-3xl font-bold text-[#1E54B7]">{playerMotivationData?.teamMotivationAvg}/100</p>
                      <p className="text-gray-400 text-sm mt-1">Average across all players</p>
                    </div>
                    
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <h4 className="text-white font-medium mb-2">Positive Trends</h4>
                      <p className="text-3xl font-bold text-green-500">{playerMotivationData?.playersWithIncreasingMotivation.length}</p>
                      <p className="text-gray-400 text-sm mt-1">Players with increasing motivation</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-medium text-white mb-3">Most Motivated Players</h4>
                    <ul className="list-disc list-inside text-gray-300 space-y-2">
                      {playerMotivationData?.mostMotivatedPlayers.map((player: string, index: number) => (
                        <li key={index}>{player}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-lg font-medium text-white mb-3">Players Requiring Attention</h4>
                    {playerMotivationData?.playersRequiringAttention.length > 0 ? (
                      <ul className="list-disc list-inside text-gray-300 space-y-2">
                        {playerMotivationData?.playersRequiringAttention.map((player: string, index: number) => (
                          <li key={index}>{player}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-300">No players currently requiring attention.</p>
                    )}
                  </div>

                  <div>
                    <h4 className="text-lg font-medium text-white mb-3">Motivation Strategies</h4>
                    <ul className="list-disc list-inside text-gray-300 space-y-2">
                      <li>Conduct regular 1-on-1 goal-setting sessions</li>
                      <li>Personalize training approaches by motivation type</li>
                      <li>Create leadership opportunities for experienced players</li>
                      <li>Balance extrinsic rewards with intrinsic development</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ExternalFactorsDashboard;