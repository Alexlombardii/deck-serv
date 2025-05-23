import { NextRequest, NextResponse } from 'next/server';
import { redis } from '@/infrastructure/config/redis';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const key = `deck:${Date.now()}`;
    
    // Store the data
    await redis.set(key, JSON.stringify(data));
    
    // Get it back
    const stored = await redis.get(key);
    
    return NextResponse.json({
      success: true,
      key,
      stored: data,
      retrieved: stored
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to store data' 
    }, { status: 500 });
  }
} 