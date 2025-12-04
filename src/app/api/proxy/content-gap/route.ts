import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.CONTENT_GAP_API_URL || "https://busked-schematically-amiyah.ngrok-free.dev";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { action, ...payload } = body;

        let url: string;
        let method: string = 'POST';

        // Handle different actions
        if (action === 'run') {
            url = `${API_BASE_URL}/run`;
        } else {
            return NextResponse.json(
                { error: 'Invalid action. Use action: "run"' },
                { status: 400 }
            );
        }

        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true',
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            return NextResponse.json(
                { error: `External API error: ${response.status}`, details: errorText },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Content Gap proxy error:', error);
        return NextResponse.json(
            {
                error: 'Failed to contact Content Gap Analysis API',
                details: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const endpoint = searchParams.get('endpoint');

        if (!endpoint) {
            return NextResponse.json(
                { error: 'Missing endpoint parameter' },
                { status: 400 }
            );
        }

        let url: string;
        
        switch (endpoint) {
            case 'recommendations':
                url = `${API_BASE_URL}/recommendations`;
                break;
            case 'gaps':
                url = `${API_BASE_URL}/gaps`;
                break;
            case 'metrics':
                url = `${API_BASE_URL}/metrics`;
                break;
            case 'package':
                url = `${API_BASE_URL}/package`;
                break;
            case 'corpus-stats':
                url = `${API_BASE_URL}/corpus-stats`;
                break;
            default:
                return NextResponse.json(
                    { error: 'Invalid endpoint' },
                    { status: 400 }
                );
        }

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true',
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            return NextResponse.json(
                { error: `External API error: ${response.status}`, details: errorText },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Content Gap proxy error:', error);
        return NextResponse.json(
            {
                error: 'Failed to contact Content Gap Analysis API',
                details: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}

