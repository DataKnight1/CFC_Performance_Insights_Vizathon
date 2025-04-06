import { NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'CFC Physical Capability Data.xlsx');
    const fileBuffer = fs.readFileSync(filePath);
    
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
    });
  } catch (error) {
    console.error('Error reading Excel file:', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to read physical capability data' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}