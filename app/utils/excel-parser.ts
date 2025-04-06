"use client";

import * as XLSX from 'xlsx';

export interface PhysicalCapabilityData {
  date: string;
  movement: string;
  quality: string;
  expression: string;
  benchmarkPct: number;
}

export async function fetchExcel(url: string): Promise<PhysicalCapabilityData[]> {
  try {
    console.log('Fetching Excel data from URL:', url);
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch Excel data: ${response.status} ${response.statusText}`);
    }
    
    // Check if it's JSON data from the mock endpoint
    const contentType = response.headers.get('Content-Type');
    if (contentType && contentType.includes('application/json')) {
      console.log('Detected JSON response instead of Excel');
      const jsonData = await response.json();
      console.log('Received JSON data:', jsonData.length, 'records');
      return jsonData;
    }
    
    // Otherwise, process as Excel
    const arrayBuffer = await response.arrayBuffer();
    const data = parseExcel(arrayBuffer);
    console.log('Parsed Excel data:', data.length, 'records');
    return data;
  } catch (error) {
    console.error("Error fetching Excel data:", error);
    return [];
  }
}

export function parseExcel(arrayBuffer: ArrayBuffer): PhysicalCapabilityData[] {
  // Parse the Excel file
  const workbook = XLSX.read(arrayBuffer, { type: 'array' });
  
  // Assume first sheet
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  
  // Convert to JSON
  const rawData = XLSX.utils.sheet_to_json(worksheet);
  
  // Transform data to our expected format
  const formattedData: PhysicalCapabilityData[] = rawData.map((row: any) => ({
    date: row.Date || '',
    movement: row.Movement || '',
    quality: row.Quality || '',
    expression: row.Expression || '',
    benchmarkPct: parseFloat(row.BenchmarkPct) || 0,
  }));
  
  return formattedData;
}