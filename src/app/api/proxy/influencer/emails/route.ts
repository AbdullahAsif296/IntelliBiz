import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const response = await fetch('https://email-marketing-bot-chi.vercel.app/api/emails', {
            method: 'GET',
            headers: {
                'accept': 'application/json',
            }
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
