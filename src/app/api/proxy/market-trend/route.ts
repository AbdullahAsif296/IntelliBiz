import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.MARKET_TREND_API_URL || 'https://minahilasif222.pythonanywhere.com';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const response = await fetch(`${API_BASE_URL}/analyze`, {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
            return NextResponse.json(
                { 
                    error: errorData.error || errorData.message || `External API error: ${response.status}`,
                    details: errorData.details
                },
                { status: response.status >= 500 ? 502 : response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Market Trend proxy error:', error);
        return NextResponse.json(
            { 
                error: 'Failed to contact Market Trend Monitor API',
                details: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}
