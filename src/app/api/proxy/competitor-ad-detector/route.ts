import { NextResponse } from 'next/server';

// Configure route to allow longer execution (Vercel Pro: 60s, Hobby: 10s)
// Note: maxDuration is only available on Vercel Pro plan
export const maxDuration = 60; // Maximum execution time in seconds

const API_BASE_URL = 'https://spm-project-final.onrender.com';
// Extended timeout for ad collection (can take 15-60s based on API response)
// Set to 50s to stay safely under Next.js/Vercel limits and allow time for processing
const FETCH_TIMEOUT = 50000; // 50 seconds

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Create AbortController for timeout handling
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/collect`, {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
                return NextResponse.json(
                    { 
                        error: errorData.message || errorData.error || `External API error: ${response.status}`,
                        status: response.status
                    },
                    { status: response.status >= 500 ? 502 : response.status }
                );
            }

            const data = await response.json();
            return NextResponse.json(data);
        } catch (fetchError: any) {
            clearTimeout(timeoutId);
            
            // Handle timeout specifically
            if (fetchError.name === 'AbortError' || controller.signal.aborted) {
                return NextResponse.json(
                    { 
                        error: 'Request timeout - The ad collection process is taking longer than expected. Please try again with fewer keywords or lower max_results.',
                        timeout: true
                    },
                    { status: 504 }
                );
            }
            
            throw fetchError;
        }
    } catch (error: any) {
        console.error('Competitor Ad Detector proxy error:', error);
        
        // Handle network errors
        if (error.message?.includes('fetch') || error.message?.includes('network')) {
            return NextResponse.json(
                { 
                    error: 'Network error - Unable to reach the ad detection API. Please check your connection and try again.',
                    networkError: true
                },
                { status: 503 }
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
        // Health check endpoint with shorter timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s for health check

        try {
            const response = await fetch(`${API_BASE_URL}/health`, {
                method: 'GET',
                headers: {
                    'accept': 'application/json',
                },
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
                return NextResponse.json(
                    { 
                        error: errorData.message || errorData.error || `External API error: ${response.status}`,
                        status: response.status
                    },
                    { status: response.status >= 500 ? 502 : response.status }
                );
            }

            const data = await response.json();
            return NextResponse.json(data);
        } catch (fetchError: any) {
            clearTimeout(timeoutId);
            
            if (fetchError.name === 'AbortError' || controller.signal.aborted) {
                return NextResponse.json(
                    { 
                        error: 'Health check timeout - API is not responding',
                        timeout: true
                    },
                    { status: 504 }
                );
            }
            
            throw fetchError;
        }
    } catch (error: any) {
        console.error('Competitor Ad Detector proxy error:', error);
        
        if (error.message?.includes('fetch') || error.message?.includes('network')) {
            return NextResponse.json(
                { 
                    error: 'Network error - Unable to reach the ad detection API',
                    networkError: true
                },
                { status: 503 }
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

