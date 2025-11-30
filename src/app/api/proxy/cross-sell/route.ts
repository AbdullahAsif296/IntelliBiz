import { NextResponse } from 'next/server';

const API_BASE_URL = 'https://cross-sell-suggestion-agent.onrender.com';

export async function POST(request: Request) {
    try {
        const requestBody = await request.json();
        const { endpoint, ...body } = requestBody;
        
        // Determine which endpoint to call
        let url = `${API_BASE_URL}/api/recommend`;
        if (endpoint === 'search') {
            url = `${API_BASE_URL}/api/search`;
        } else if (endpoint === 'recommend') {
            url = `${API_BASE_URL}/api/recommend`;
        }

        // Clean the body - remove endpoint but keep all other fields
        // The API should accept: product_id, user_id, session_id, request_id, limit, use_ml
        const apiBody: any = {};
        
        // For recommend endpoint
        if (endpoint === 'recommend' || !endpoint) {
            // Required field
            if (body.product_id) {
                apiBody.product_id = body.product_id;
            } else {
                return NextResponse.json(
                    { error: 'product_id is required' },
                    { status: 400 }
                );
            }
            
            // Optional fields - only include if they have values
            if (body.user_id !== undefined && body.user_id !== null && body.user_id !== '') {
                apiBody.user_id = body.user_id;
            }
            if (body.session_id !== undefined && body.session_id !== null && body.session_id !== '') {
                apiBody.session_id = body.session_id;
            }
            if (body.request_id !== undefined && body.request_id !== null && body.request_id !== '') {
                apiBody.request_id = body.request_id;
            }
            if (body.limit !== undefined && body.limit !== null) {
                apiBody.limit = parseInt(String(body.limit)) || 3;
            }
            // use_ml is optional but has a default - only send if explicitly provided
            // Some API versions might not support this field, so we'll try without it if it fails
            if (body.use_ml !== undefined && body.use_ml !== null) {
                apiBody.use_ml = Boolean(body.use_ml);
            }
        }
        // For search endpoint
        else if (endpoint === 'search') {
            if (body.query) {
                apiBody.query = body.query;
            } else {
                return NextResponse.json(
                    { error: 'query is required for search' },
                    { status: 400 }
                );
            }
            if (body.session_id !== undefined && body.session_id !== null && body.session_id !== '') {
                apiBody.session_id = body.session_id;
            }
        }

        let response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json',
            },
            body: JSON.stringify(apiBody)
        });

        // If request fails with validation error about use_ml, retry without it
        if (!response.ok && response.status === 400) {
            const errorData = await response.json().catch(() => ({}));
            const errorMessage = errorData.message || errorData.error || '';
            
            // Check if error is about use_ml being unexpected
            if (errorMessage.includes('use_ml') && errorMessage.includes('unexpected') && apiBody.use_ml !== undefined) {
                // Retry without use_ml field
                const retryBody = { ...apiBody };
                delete retryBody.use_ml;
                
                response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'accept': 'application/json',
                    },
                    body: JSON.stringify(retryBody)
                });
            }
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
            return NextResponse.json(
                { 
                    error: errorData.message || errorData.error || `External API error: ${response.status}`,
                    status: response.status,
                    details: errorData.details || errorData
                },
                { status: response.status >= 500 ? 502 : response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Cross-sell proxy error:', error);
        
        // Handle JSON parsing errors
        if (error instanceof SyntaxError || error.message?.includes('JSON')) {
            return NextResponse.json(
                { error: 'Invalid JSON in request body' },
                { status: 400 }
            );
        }
        
        return NextResponse.json(
            { 
                error: error.message || 'Internal Server Error',
                details: process.env.NODE_ENV === 'development' ? error.stack : undefined
            },
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

