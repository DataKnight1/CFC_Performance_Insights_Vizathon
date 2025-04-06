import { NextResponse } from 'next/server';

export async function GET() {
  // Generate dates for the last 100 days
  const mockData = [];
  const today = new Date();
  
  for (let i = 100; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    const dateString = date.toISOString().split('T')[0];
    
    // Base values that improve over time with some randomness
    const dayIndex = 100 - i; // 0 for oldest, 100 for today
    const improvement = dayIndex / 200; // Gradual improvement factor
    
    // Generate some random ups and downs to make it look realistic
    const randomFactor = Math.sin(i * 0.7) * 0.1; // Sine wave variation
    const matchDayEffect = i % 7 === 0 ? -0.1 : 0; // Lower scores on match days (every 7 days)
    const randomNoise = (Math.random() - 0.5) * 0.05; // Small random noise
    
    // Combine factors for the day's adjustment
    const dayAdjustment = improvement + randomFactor + matchDayEffect + randomNoise;
    
    // Create a baseline for this day (0.5 to 0.9 range)
    let baseline = Math.min(Math.max(0.7 + dayAdjustment, 0.5), 0.9);
    
    // Add to data array
    mockData.push({
      "date": dateString,
      "bio_completeness": baseline + (Math.random() * 0.1),
      "bio_composite": baseline - (Math.random() * 0.1),
      "msk_joint_range_completeness": baseline + (Math.random() * 0.15),
      "msk_joint_range_composite": baseline,
      "msk_load_tolerance_completeness": baseline - (Math.random() * 0.05),
      "msk_load_tolerance_composite": baseline - (Math.random() * 0.1),
      "subjective_completeness": baseline + (Math.random() * 0.2),
      "subjective_composite": baseline + (Math.random() * 0.1),
      "soreness_completeness": baseline,
      "soreness_composite": baseline - (Math.random() * 0.05),
      "sleep_completeness": baseline + (Math.random() * 0.1),
      "sleep_composite": baseline,
      "emboss_baseline_score": baseline + (Math.random() * 0.05) - 0.025,
      "stress_load_composite": baseline - (Math.random() * 0.1)
    });
  }

  // Return JSON data
  return new NextResponse(JSON.stringify(mockData), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}