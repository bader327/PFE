import { NextResponse } from 'next/server';
import { processExcelFile } from '../../../lib/excelParser';
import { checkFpsConditions } from '../../../lib/fpsDetection';

export async function POST(req: Request) {
  try {
    const { filePath } = await req.json();
    
    if (!filePath) {
      return NextResponse.json({ error: 'No file path provided' }, { status: 400 });
    }
    
    // Process the Excel file
    const result = await processExcelFile(filePath);
    
    // Check for FPS conditions
    const fpsRequired = checkFpsConditions(result.bobinesData) !== null;
    
    return NextResponse.json({ 
      ...result,
      fpsRequired
    });
  } catch (error) {
    console.error('Error testing Excel file:', error);
    return NextResponse.json({ 
      error: 'Error processing Excel file',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
