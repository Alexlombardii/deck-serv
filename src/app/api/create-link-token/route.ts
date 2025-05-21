import { NextResponse } from 'next/server';
import { DECK_CONFIG } from '@/config/deck';

export async function POST() {
  const DECK_CLIENT_ID = process.env.DECK_CLIENT_ID;
  const DECK_SECRET = process.env.DECK_SECRET;

  console.log('Debug - Environment Check:', {
    hasClientId: !!DECK_CLIENT_ID,
    hasSecret: !!DECK_SECRET,
    baseUrl: DECK_CONFIG.baseUrl
  });

  if (!DECK_CLIENT_ID || !DECK_SECRET) {
    return NextResponse.json({ error: 'Deck credentials not set in environment variables' }, { status: 500 });
  }

  const body = {
    language: 'EN',
    countries: ['US'],
    source_types: ['Electricity'],
  };

  const apiUrl = `${DECK_CONFIG.baseUrl}/api/v1/link/token/create`;
  console.log('Debug - API Request:', {
    url: apiUrl,
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-deck-client-id': '***', // masked for security
      'x-deck-secret': '***'     // masked for security
    },
    body
  });

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-deck-client-id': DECK_CLIENT_ID,
        'x-deck-secret': DECK_SECRET,
      },
      body: JSON.stringify(body),
    });

    console.log('Debug - API Response:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Debug - API Error:', {
        status: response.status,
        errorText
      });
      return NextResponse.json({ error: 'Deck API error', status: response.status, details: errorText }, { status: response.status });
    }

    const data = await response.json();
    console.log('Debug - API Success:', {
      hasLinkToken: !!data.link_token
    });
    return NextResponse.json({ link_token: data.link_token });
  } catch (err) {
    console.error('Debug - Exception:', err);
    return NextResponse.json({ error: 'Internal server error', message: err instanceof Error ? err.message : 'Unknown error' }, { status: 500 });
  }
} 