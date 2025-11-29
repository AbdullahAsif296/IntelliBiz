/**
 * Customer Support Auto-Agent API Integration
 * 
 * This service integrates with the deployed Customer Support Agent API
 * Endpoint: https://customersupportagent-1.onrender.com
 */

const API_BASE_URL = 'https://customersupportagent-1.onrender.com';

export interface CustomerSupportRequest {
    ticket_id: string;
    customer_id?: string;
    query: string;
    context?: {
        customer_data?: {
            id?: string;
            name?: string;
            email?: string;
            membership?: string;
            [key: string]: any;
        };
        order_history?: Array<{
            order_id: string;
            status: string;
            date: string;
            items: string[];
            total: number;
            [key: string]: any;
        }>;
        previous_interactions?: Array<{
            query: string;
            answer: string;
            timestamp: string;
        }>;
    };
    metadata: {
        timestamp: string;
        source?: 'web' | 'email' | 'chat' | 'api';
        priority?: 'low' | 'medium' | 'high';
    };
}

export interface CustomerSupportResponse {
    success: boolean;
    ticket_id?: string;
    response?: {
        answer: string;
        sentiment: 'positive' | 'neutral' | 'negative';
        confidence: number;
        category: 'general' | 'order_inquiry' | 'refund_return' | 'account_management' | 'technical_support' | 'billing';
        requires_escalation: boolean;
        suggested_actions: Array<{
            action: string;
            priority: string;
        }>;
    };
    metadata?: {
        processing_time_ms: number;
        timestamp: string;
        agent_version: string;
    };
    error?: string;
}

/**
 * Process a customer query through the Customer Support Auto-Agent
 */
export async function processCustomerQuery(
    query: string,
    ticketId?: string,
    customerId?: string,
    context?: CustomerSupportRequest['context']
): Promise<CustomerSupportResponse> {
    const url = `${API_BASE_URL}/api/agent/process`;

    // Generate ticket ID if not provided
    const generatedTicketId = ticketId || `TKT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const payload: CustomerSupportRequest = {
        ticket_id: generatedTicketId,
        customer_id: customerId,
        query: query.trim(),
        context: context || {},
        metadata: {
            timestamp: new Date().toISOString(),
            source: 'web',
            priority: 'medium'
        }
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: CustomerSupportResponse = await response.json();
        return data;
    } catch (error) {
        console.error('Error calling Customer Support Agent API:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred'
        };
    }
}

/**
 * Check the health status of the Customer Support Agent API
 */
export async function checkAgentHealth(): Promise<{
    status: string;
    service: string;
    version: string;
    timestamp: string;
    uptime?: number;
    environment?: string;
}> {
    const url = `${API_BASE_URL}/api/health`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error checking agent health:', error);
        return {
            status: 'error',
            service: 'Customer Support Auto-Agent',
            version: 'unknown',
            timestamp: new Date().toISOString()
        };
    }
}

/**
 * Get agent statistics and status
 */
export async function getAgentStatus(): Promise<{
    success: boolean;
    status: string;
    statistics?: {
        total_queries: number;
        successful_queries: number;
        escalation_rate: string;
        average_processing_time_ms: number;
    };
}> {
    const url = `${API_BASE_URL}/api/agent/status`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error getting agent status:', error);
        return {
            success: false,
            status: 'error'
        };
    }
}

/**
 * Format the API response for display
 */
export function formatCustomerSupportResponse(response: CustomerSupportResponse): string {
    if (!response.success || !response.response) {
        return `**Error:** ${response.error || 'Failed to process query'}`;
    }

    const { answer, sentiment, confidence, category, requires_escalation, suggested_actions } = response.response;

    let output = `**AI Response:**\n${answer}\n\n`;
    output += `**Analysis:**\n`;
    output += `• Sentiment: ${sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}\n`;
    output += `• Confidence: ${(confidence * 100).toFixed(1)}%\n`;
    output += `• Category: ${category.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}\n`;
    output += `• Requires Escalation: ${requires_escalation ? '⚠️ Yes - Route to human agent' : '✅ No'}\n`;

    if (suggested_actions && suggested_actions.length > 0) {
        output += `\n**Suggested Actions:**\n`;
        suggested_actions.forEach((action, index) => {
            output += `${index + 1}. ${action.action} (Priority: ${action.priority})\n`;
        });
    }

    if (response.metadata) {
        output += `\n**Processing Time:** ${response.metadata.processing_time_ms}ms\n`;
    }

    return output;
}
