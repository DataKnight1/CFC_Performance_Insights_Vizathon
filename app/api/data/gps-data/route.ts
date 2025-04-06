import { NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';

export async function GET() {
  console.log('API: Fetching GPS data from the file system');
  try {
    const filePath = path.join(process.cwd(), 'data', 'CFC GPS Data.csv');
    console.log('Reading file from path:', filePath);
    
    if (!fs.existsSync(filePath)) {
      console.error('File does not exist:', filePath);
      return new NextResponse(JSON.stringify({ error: 'GPS data file not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    const csvContent = fs.readFileSync(filePath, 'utf8');
    console.log('CSV content length:', csvContent.length, 'First 100 chars:', csvContent.substring(0, 100));
    
    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
      },
    });
  } catch (error) {
    console.error('Error reading GPS data CSV file:', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to read GPS data' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}