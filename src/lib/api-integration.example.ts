/**
 * API Integration Example
 * 
 * This file demonstrates how to integrate your deployed agents with the IntelliBiz platform.
 * Replace the demo implementation in AgentInterface with actual API calls.
 */

// Example 1: Simple Fetch API Integration
export async function callAgent(agentId: string, input: string): Promise<string> {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/agents/${agentId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
            },
            body: JSON.stringify({ input }),
        });

        if (!response.ok) {
            throw new Error(`Agent request failed: ${response.statusText}`);
        }

        const data = await response.json();
        return data.output;
    } catch (error) {
        console.error('Error calling agent:', error);
        throw error;
    }
}

// Example 2: With Retry Logic
export async function callAgentWithRetry(
    agentId: string,
    input: string,
    maxRetries: number = 3
): Promise<string> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            return await callAgent(agentId, input);
        } catch (error) {
            lastError = error as Error;
            console.log(`Attempt ${attempt + 1} failed, retrying...`);

            // Exponential backoff
            await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }
    }

    throw lastError || new Error('Max retries exceeded');
}

// Example 3: Streaming Response (for long-running agents)
export async function* callAgentStreaming(
    agentId: string,
    input: string
): AsyncGenerator<string, void, unknown> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/agents/${agentId}/stream`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
        },
        body: JSON.stringify({ input }),
    });

    if (!response.ok) {
        throw new Error(`Agent request failed: ${response.statusText}`);
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
        throw new Error('Response body is not readable');
    }

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        yield chunk;
    }
}

// Example 4: Batch Processing Multiple Inputs
export async function callAgentBatch(
    agentId: string,
    inputs: string[]
): Promise<string[]> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/agents/${agentId}/batch`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
        },
        body: JSON.stringify({ inputs }),
    });

    if (!response.ok) {
        throw new Error(`Batch request failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.outputs;
}

// Example 5: Agent-Specific Endpoints
export const agentEndpoints = {
    'market-trend-monitor': '/api/agents/market-trends',
    'competitor-tracker': '/api/agents/competitor-analysis',
    'customer-sentiment': '/api/agents/sentiment-analysis',
    'campaign-optimizer': '/api/agents/campaign-optimization',
    'pricing-strategy': '/api/agents/pricing-recommendations',
    'sales-pipeline-predictor': '/api/agents/sales-forecast',
    'churn-prevention': '/api/agents/churn-analysis',
    'customer-support-auto': '/api/agents/support-automation',
    'cross-sell-suggestion': '/api/agents/cross-sell',
    'influencer-engagement': '/api/agents/influencer-discovery',
    'seo-optimizer': '/api/agents/seo-analysis',
    'brand-reputation-guard': '/api/agents/brand-monitoring',
    'competitor-ad-detector': '/api/agents/ad-intelligence',
    'content-gap': '/api/agents/content-analysis',
    'proactive-survey': '/api/agents/survey-generation',
    'lead-scoring': '/api/agents/lead-scoring',
    'loyalty-program-optimizer': '/api/agents/loyalty-optimization',
};

// Example 6: Type-Safe API Response
export interface AgentResponse {
    success: boolean;
    output: string;
    metadata?: {
        processingTime: number;
        confidence?: number;
        sources?: string[];
    };
    error?: string;
}

export async function callAgentTypeSafe(
    agentId: string,
    input: string
): Promise<AgentResponse> {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/agents/${agentId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
            },
            body: JSON.stringify({ input }),
        });

        const data: AgentResponse = await response.json();
        return data;
    } catch (error) {
        return {
            success: false,
            output: '',
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}

// Example 7: WebSocket Connection (for real-time agents)
export class AgentWebSocket {
    private ws: WebSocket | null = null;
    private agentId: string;

    constructor(agentId: string) {
        this.agentId = agentId;
    }

    connect(onMessage: (data: string) => void, onError?: (error: Event) => void) {
        const wsUrl = `${process.env.NEXT_PUBLIC_WS_URL}/agents/${this.agentId}`;
        this.ws = new WebSocket(wsUrl);

        this.ws.onmessage = (event) => {
            onMessage(event.data);
        };

        this.ws.onerror = (error) => {
            console.error('WebSocket error:', error);
            onError?.(error);
        };

        this.ws.onclose = () => {
            console.log('WebSocket connection closed');
        };
    }

    send(input: string) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({ input }));
        } else {
            throw new Error('WebSocket is not connected');
        }
    }

    disconnect() {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }
}

// Example Usage in AgentInterface Component:
/*
import { callAgent, callAgentWithRetry } from '@/lib/api-integration';

const handleRun = async () => {
  if (!input.trim()) return;

  setIsLoading(true);
  setOutput(null);

  try {
    // Simple call
    const result = await callAgent(agent.id, input);
    setOutput(result);

    // Or with retry
    // const result = await callAgentWithRetry(agent.id, input);
    // setOutput(result);
  } catch (error) {
    setOutput(`Error: ${error instanceof Error ? error.message : 'Failed to get response'}`);
  } finally {
    setIsLoading(false);
  }
};
*/

// Environment Variables Required (.env.local):
/*
NEXT_PUBLIC_API_BASE_URL=https://your-api-domain.com
NEXT_PUBLIC_API_KEY=your-api-key-here
NEXT_PUBLIC_WS_URL=wss://your-websocket-domain.com
*/
