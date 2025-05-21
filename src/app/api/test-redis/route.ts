import { NextResponse } from 'next/server';
import { redis } from '@/infrastructure/config/redis';

export async function GET() {
  try {
    // Test setting a value
    await redis.set('test:key', 'Hello from Redis!');
    
    // Test getting the value
    const value = await redis.get('test:key');
    
    // Test listing keys
    const keys = await redis.keys('test:*');
    
    return NextResponse.json({
      success: true,
      value,
      keys,
      message: 'Redis connection is working!'
    });
  } catch (error) {
    console.error('Redis test error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 