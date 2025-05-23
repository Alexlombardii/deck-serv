import { NextResponse } from 'next/server';
import { redis } from '@/infrastructure/config/redis';

export async function GET() {
  try {
    // Just try to set and get a simple string
    const testKey = 'test:ping';
    const testValue = 'pong';
    
    console.log('Testing Redis connection...');
    console.log('Redis config:', {
      url: process.env.KV_REST_API_URL ? 'Set' : 'Not Set',
      token: process.env.KV_REST_API_TOKEN ? 'Set' : 'Not Set'
    });
    
    await redis.set(testKey, testValue);
    const value = await redis.get(testKey);
    
    return NextResponse.json({
      success: true,
      message: 'Redis connection successful',
      value,
      config: {
        hasUrl: !!process.env.KV_REST_API_URL,
        hasToken: !!process.env.KV_REST_API_TOKEN
      }
    });
  } catch (error) {
    console.error('Redis connection test failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to connect to Redis',
      config: {
        hasUrl: !!process.env.KV_REST_API_URL,
        hasToken: !!process.env.KV_REST_API_TOKEN
      }
    }, { status: 500 });
  }
} 