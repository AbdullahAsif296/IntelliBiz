import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const response = await fetch('https://web-production-37e1.up.app/analyze', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            return NextResponse.json(
                { error: `External API error: ${response.status}` },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Proxy error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
