import { NextResponse } from 'next/server';

export async function POST() {
  const DECK_CLIENT_ID = process.env.DECK_CLIENT_ID;
  const DECK_SECRET = process.env.DECK_SECRET;

  if (!DECK_CLIENT_ID || !DECK_SECRET) {
    return NextResponse.json({ error: 'Deck credentials not set in environment variables' }, { status: 500 });
  }

  const body = {
    language: 'EN',
    countries: ['US'],
    source_types: ['Electricity'],
  };

  try {
    const response = await fetch('https://sandbox.deck.co/api/v1/link/token/create', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-deck-client-id': DECK_CLIENT_ID,
        'x-deck-secret': DECK_SECRET,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ error: 'Deck API error', status: response.status, details: errorText }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json({ link_token: data.link_token });
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error', message: err instanceof Error ? err.message : 'Unknown error' }, { status: 500 });
  }
} 