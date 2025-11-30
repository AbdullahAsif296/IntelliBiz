import { NextResponse } from 'next/server';

// Use the production URL from the existing form, but can be configured via env
const API_BASE_URL = process.env.LEAD_SCORING_API_URL || 'https://lead-scoring-agent-production.up.railway.app';

export async function POST(request: Request) {
    try {
        const { endpoint, ...body } = await request.json();
        
        // Determine which endpoint to call
        let url: string;
        if (endpoint === 'score') {
            url = `${API_BASE_URL}/score`;
        } else if (endpoint === 'retrain') {
            url = `${API_BASE_URL}/retrain`;
        } else {
            // Default to score if no endpoint specified
            url = `${API_BASE_URL}/score`;
        }

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
            // Set timeout to 5s minimum as per documentation
            signal: AbortSignal.timeout(6000) // 6s to account for network overhead
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
            return NextResponse.json(
                { 
                    error: errorData.error || errorData.message || `External API error: ${response.status}`,
                    details: errorData.details,
                    timestamp: errorData.timestamp
                },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Lead Scoring proxy error:', error);
        
        // Handle timeout errors
        if (error.name === 'AbortError' || error.name === 'TimeoutError') {
            return NextResponse.json(
                { error: 'Request timeout - API took too long to respond' },
                { status: 504 }
            );
        }
        
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const endpoint = searchParams.get('endpoint');

        let url: string;
        if (endpoint === 'health') {
            url = `${API_BASE_URL}/health`;
        } else if (endpoint === 'info') {
            url = `${API_BASE_URL}/info`;
        } else {
            return NextResponse.json(
                { error: 'Invalid endpoint. Use ?endpoint=health or ?endpoint=info' },
                { status: 400 }
            );
        }

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'accept': 'application/json',
            },
            signal: AbortSignal.timeout(5000)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
            return NextResponse.json(
                { 
                    error: errorData.error || errorData.message || `External API error: ${response.status}`,
                    timestamp: errorData.timestamp
                },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Lead Scoring proxy error:', error);
        
        if (error.name === 'AbortError' || error.name === 'TimeoutError') {
            return NextResponse.json(
                { error: 'Request timeout - API took too long to respond' },
                { status: 504 }
            );
        }
        
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

