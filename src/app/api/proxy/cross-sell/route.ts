import { NextResponse } from 'next/server';

const API_BASE_URL = 'https://cross-sell-suggestion-agent.onrender.com';

export async function POST(request: Request) {
    try {
        const { endpoint, ...body } = await request.json();
        
        // Determine which endpoint to call
        let url = `${API_BASE_URL}/api/recommend`;
        if (endpoint === 'search') {
            url = `${API_BASE_URL}/api/search`;
        } else if (endpoint === 'recommend') {
            url = `${API_BASE_URL}/api/recommend`;
        }

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
            return NextResponse.json(
                { error: errorData.message || `External API error: ${response.status}` },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Cross-sell proxy error:', error);
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
        const sessionId = searchParams.get('session_id');

        let url: string;
        
        if (endpoint === 'status') {
            url = `${API_BASE_URL}/api/status`;
        } else if (endpoint === 'health') {
            url = `${API_BASE_URL}/health`;
        } else if (endpoint === 'memory') {
            if (sessionId) {
                url = `${API_BASE_URL}/api/memory/${sessionId}`;
            } else {
                url = `${API_BASE_URL}/api/memory`;
            }
        } else {
            return NextResponse.json(
                { error: 'Invalid endpoint' },
                { status: 400 }
            );
        }

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
            return NextResponse.json(
                { error: errorData.message || `External API error: ${response.status}` },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Cross-sell proxy error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

