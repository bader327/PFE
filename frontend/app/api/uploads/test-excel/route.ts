import { promises as fs } from 'fs';
import { NextResponse } from 'next/server';
import path from 'path';
import { processExcelFile } from '../../../../lib/excelParser';
import { checkFpsConditions } from '../../../../lib/fpsDetection';

export async function POST(req: Request) {
  try {
  const { filePath } = await req.json();
    
    if (!filePath) {
      return NextResponse.json({ error: 'No file path provided' }, { status: 400 });
    }
    
  // Resolve and read the file, then process the Excel file
  const absPath = path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath);
  const buf = await fs.readFile(absPath);
  const arrayBuffer = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
  const result = await processExcelFile(arrayBuffer as ArrayBuffer);
    
    // Check for FPS conditions
  const fpsRequired = checkFpsConditions(result.bobinesData as any) !== null;
    
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
