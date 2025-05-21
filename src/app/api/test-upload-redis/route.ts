import { NextRequest, NextResponse } from 'next/server';
import { redis } from '@/infrastructure/config/redis';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const key = `test:upload:${uuidv4()}`;
    await redis.set(key, JSON.stringify(data));
    const value = await redis.get<string>(key);
    return NextResponse.json({
      success: true,
      key,
      stored: data,
      retrieved: value ? JSON.parse(value) : null,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
} 