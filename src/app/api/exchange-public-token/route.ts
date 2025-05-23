import { NextRequest, NextResponse } from 'next/server';
import { DECK_CONFIG } from '@/config/deck';
import { createDeckConnectionService } from '@/infrastructure/factories/deck-connection.factory';

export async function POST(req: NextRequest) {
  const DECK_CLIENT_ID = process.env.DECK_CLIENT_ID;
  const DECK_SECRET = process.env.DECK_SECRET;

  if (!DECK_CLIENT_ID || !DECK_SECRET) {
    return NextResponse.json({ error: 'Deck credentials not set in environment variables' }, { status: 500 });
  }

  const { public_token } = await req.json();

  if (!public_token) {
    return NextResponse.json({ error: 'Missing public_token in request body' }, { status: 400 });
  }

  try {
    const response = await fetch(`${DECK_CONFIG.baseUrl}/connection/public_token/exchange`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-deck-client-id': DECK_CLIENT_ID,
        'x-deck-secret': DECK_SECRET,
      },
      body: JSON.stringify({ public_token }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ error: 'Deck API error', status: response.status, details: errorText }, { status: response.status });
    }

    const data = await response.json();
    
    // Store the connection
    const service = createDeckConnectionService();
    await service.createConnection(data.connection_id, data.access_token, data.fields);

    // Just return the access token
    return NextResponse.json({ access_token: data.access_token });
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error', message: err instanceof Error ? err.message : 'Unknown error' }, { status: 500 });
  }
} 