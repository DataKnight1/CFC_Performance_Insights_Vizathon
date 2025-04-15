import { NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';

// Add these exports for static export compatibility
export const dynamic = 'force-static';
export const revalidate = false;

export async function GET() {
  try {
    // For static export, return mock data instead of reading from file
    if (process.env.NODE_ENV === 'production') {
      console.log('API: Using mock recovery data for static export');
      
      // Mock data in CSV format
      const mockCsvData = `date,bio_completeness,bio_composite,msk_joint_range_completeness,msk_joint_range_composite,msk_load_tolerance_completeness,msk_load_tolerance_composite,subjective_completeness,subjective_composite,soreness_completeness,soreness_composite,sleep_completeness,sleep_composite,emboss_baseline_score,stress_load_composite
2023-04-01,0.85,0.75,0.90,0.82,0.78,0.72,0.88,0.80,0.75,0.70,0.87,0.79,0.76,0.68
2023-04-02,0.87,0.77,0.91,0.83,0.79,0.73,0.89,0.81,0.76,0.71,0.88,0.80,0.77,0.69
2023-04-03,0.83,0.73,0.87,0.79,0.75,0.69,0.85,0.77,0.72,0.67,0.84,0.76,0.73,0.65
2023-04-04,0.88,0.78,0.92,0.84,0.80,0.74,0.90,0.82,0.77,0.72,0.89,0.81,0.78,0.70
2023-04-05,0.90,0.80,0.94,0.86,0.82,0.76,0.92,0.84,0.79,0.74,0.91,0.83,0.80,0.72
2023-04-06,0.82,0.72,0.86,0.78,0.74,0.68,0.84,0.76,0.71,0.66,0.83,0.75,0.72,0.64
2023-04-07,0.70,0.60,0.74,0.66,0.62,0.56,0.72,0.64,0.59,0.54,0.71,0.63,0.60,0.52
2023-04-08,0.75,0.65,0.79,0.71,0.67,0.61,0.77,0.69,0.64,0.59,0.76,0.68,0.65,0.57
2023-04-09,0.84,0.74,0.88,0.80,0.76,0.70,0.86,0.78,0.73,0.68,0.85,0.77,0.74,0.66
2023-04-10,0.86,0.76,0.90,0.82,0.78,0.72,0.88,0.80,0.75,0.70,0.87,0.79,0.76,0.68
2023-04-11,0.88,0.78,0.92,0.84,0.80,0.74,0.90,0.82,0.77,0.72,0.89,0.81,0.78,0.70
2023-04-12,0.83,0.73,0.87,0.79,0.75,0.69,0.85,0.77,0.72,0.67,0.84,0.76,0.73,0.65
2023-04-13,0.87,0.77,0.91,0.83,0.79,0.73,0.89,0.81,0.76,0.71,0.88,0.80,0.77,0.69
2023-04-14,0.69,0.59,0.73,0.65,0.61,0.55,0.71,0.63,0.58,0.53,0.70,0.62,0.59,0.51
2023-04-15,0.78,0.68,0.82,0.74,0.70,0.64,0.80,0.72,0.67,0.62,0.79,0.71,0.68,0.60
2023-04-16,0.85,0.75,0.89,0.81,0.77,0.71,0.87,0.79,0.74,0.69,0.86,0.78,0.75,0.67
2023-04-17,0.87,0.77,0.91,0.83,0.79,0.73,0.89,0.81,0.76,0.71,0.88,0.80,0.77,0.69
2023-04-18,0.89,0.79,0.93,0.85,0.81,0.75,0.91,0.83,0.78,0.73,0.90,0.82,0.79,0.71
2023-04-19,0.84,0.74,0.88,0.80,0.76,0.70,0.86,0.78,0.73,0.68,0.85,0.77,0.74,0.66
2023-04-20,0.86,0.76,0.90,0.82,0.78,0.72,0.88,0.80,0.75,0.70,0.87,0.79,0.76,0.68
2023-04-21,0.68,0.58,0.72,0.64,0.60,0.54,0.70,0.62,0.57,0.52,0.69,0.61,0.58,0.50
2023-04-22,0.73,0.63,0.77,0.69,0.65,0.59,0.75,0.67,0.62,0.57,0.74,0.66,0.63,0.55
2023-04-23,0.83,0.73,0.87,0.79,0.75,0.69,0.85,0.77,0.72,0.67,0.84,0.76,0.73,0.65
2023-04-24,0.85,0.75,0.89,0.81,0.77,0.71,0.87,0.79,0.74,0.69,0.86,0.78,0.75,0.67
2023-04-25,0.87,0.77,0.91,0.83,0.79,0.73,0.89,0.81,0.76,0.71,0.88,0.80,0.77,0.69
2023-04-26,0.82,0.72,0.86,0.78,0.74,0.68,0.84,0.76,0.71,0.66,0.83,0.75,0.72,0.64
2023-04-27,0.84,0.74,0.88,0.80,0.76,0.70,0.86,0.78,0.73,0.68,0.85,0.77,0.74,0.66
2023-04-28,0.67,0.57,0.71,0.63,0.59,0.53,0.69,0.61,0.56,0.51,0.68,0.60,0.57,0.49
2023-04-29,0.76,0.66,0.80,0.72,0.68,0.62,0.78,0.70,0.65,0.60,0.77,0.69,0.66,0.58
2023-04-30,0.84,0.74,0.88,0.80,0.76,0.70,0.86,0.78,0.73,0.68,0.85,0.77,0.74,0.66`;
      
      return new NextResponse(mockCsvData, {
        headers: {
          'Content-Type': 'text/csv',
        },
      });
    }
    
    // For development, read from the file
    const filePath = path.join(process.cwd(), 'data', 'CFC Recovery status Data.csv');
    const csvContent = fs.readFileSync(filePath, 'utf8');
    
    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
      },
    });
  } catch (error) {
    console.error('Error reading Recovery data CSV file:', error);
    
    // Fallback mock data in case of error
    const mockCsvData = `date,bio_completeness,bio_composite,msk_joint_range_completeness,msk_joint_range_composite,msk_load_tolerance_completeness,msk_load_tolerance_composite,subjective_completeness,subjective_composite,soreness_completeness,soreness_composite,sleep_completeness,sleep_composite,emboss_baseline_score,stress_load_composite
2023-04-01,0.85,0.75,0.90,0.82,0.78,0.72,0.88,0.80,0.75,0.70,0.87,0.79,0.76,0.68
2023-04-02,0.87,0.77,0.91,0.83,0.79,0.73,0.89,0.81,0.76,0.71,0.88,0.80,0.77,0.69
2023-04-03,0.83,0.73,0.87,0.79,0.75,0.69,0.85,0.77,0.72,0.67,0.84,0.76,0.73,0.65
2023-04-04,0.88,0.78,0.92,0.84,0.80,0.74,0.90,0.82,0.77,0.72,0.89,0.81,0.78,0.70
2023-04-05,0.90,0.80,0.94,0.86,0.82,0.76,0.92,0.84,0.79,0.74,0.91,0.83,0.80,0.72`;
    
    return new NextResponse(mockCsvData, {
      headers: {
        'Content-Type': 'text/csv',
      },
    });
  }
}