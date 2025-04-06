import { NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'CFC Recovery status Data.csv');
    const csvContent = fs.readFileSync(filePath, 'utf8');
    
    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
      },
    });
  } catch (error) {
    console.error('Error reading Recovery data CSV file:', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to read Recovery data' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}