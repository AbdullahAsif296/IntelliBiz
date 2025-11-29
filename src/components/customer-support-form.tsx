"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    Loader2,
    Sparkles,
    AlertTriangle,
    CheckCircle2,
    User,
    Send
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { processCustomerQuery, formatCustomerSupportResponse, CustomerSupportRequest, CustomerSupportResponse } from "@/lib/customer-support-api";

export function CustomerSupportForm() {
    // Basic fields
    const [query, setQuery] = useState("");

    // Customer data
    const [customerName, setCustomerName] = useState("");
    const [customerEmail, setCustomerEmail] = useState("");
    const [customerMembership, setCustomerMembership] = useState<"free" | "premium" | "enterprise">("free");

    // State
    const [output, setOutput] = useState<CustomerSupportResponse | null>(null);
    const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'assistant'; content: string; timestamp: string }>>([]);
    const [chatInput, setChatInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [requiresEscalation, setRequiresEscalation] = useState(false);

    // Auto-generate ticket ID logic removed - handled by API


    // Submit to API (Initial Query)
    const handleSubmit = async () => {
        if (!query.trim()) {
            setError("Query is required");
            return;
        }

        setIsLoading(true);
        setOutput(null);
        setError(null);
        setRequiresEscalation(false);
        setChatHistory([]); // Reset chat history on new query

        try {
            // Build context object
            const context: CustomerSupportRequest['context'] = {};

            // Add customer data if provided
            if (customerName || customerEmail) {
                context.customer_data = {
                    name: customerName || undefined,
                    email: customerEmail || undefined,
                    membership: customerMembership
                };
            }

            // Call API
            const response = await processCustomerQuery(
                query,
                undefined, // ticketId auto-generated
                undefined, // customerId removed
                Object.keys(context).length > 0 ? context : undefined
            );

            if (response.success && response.response) {
                setOutput(response);
                setRequiresEscalation(response.response.requires_escalation);

                // Add to chat history
                setChatHistory([
                    { role: 'user', content: query, timestamp: new Date().toISOString() },
                    { role: 'assistant', content: response.response.answer, timestamp: new Date().toISOString() }
                ]);
            } else {
                setError(response.error || "Failed to process query");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    // Handle Chat Message
    const handleChatSubmit = async () => {
        if (!chatInput.trim()) return;

        const userMessage = chatInput;
        setChatInput("");
        setIsLoading(true);

        // Add user message to history immediately for UI responsiveness
        const newHistory = [
            ...chatHistory,
            { role: 'user' as const, content: userMessage, timestamp: new Date().toISOString() }
        ];
        setChatHistory(newHistory);

        try {
            // Build context with updated interactions
            const context: CustomerSupportRequest['context'] = {};

            if (customerName || customerEmail) {
                context.customer_data = {
                    name: customerName || undefined,
                    email: customerEmail || undefined,
                    membership: customerMembership
                };
            }

            // Add chat history pairs as previous interactions
            const currentInteractions: any[] = [];

            // Add chat history pairs
            for (let i = 0; i < newHistory.length - 1; i += 2) {
                if (newHistory[i].role === 'user' && newHistory[i + 1]?.role === 'assistant') {
                    currentInteractions.push({
                        query: newHistory[i].content,
                        answer: newHistory[i + 1].content,
                        timestamp: newHistory[i].timestamp
                    });
                }
            }

            if (currentInteractions.length > 0) {
                context.previous_interactions = currentInteractions;
            }

            // Call API
            const response = await processCustomerQuery(
                userMessage,
                undefined, // ticketId auto-generated
                undefined, // customerId removed
                Object.keys(context).length > 0 ? context : undefined
            );

            if (response.success && response.response) {
                setOutput(response); // Update the main output display with the latest analysis
                setRequiresEscalation(response.response.requires_escalation);

                // Add assistant response to chat history
                setChatHistory([
                    ...newHistory,
                    { role: 'assistant', content: response.response.answer, timestamp: new Date().toISOString() }
                ]);
            } else {
                setError(response.error || "Failed to process message");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    // Clear form
    const clearForm = () => {
        setQuery("");
        setCustomerName("");
        setCustomerEmail("");
        setCustomerMembership("free");
        setOutput(null);
        setError(null);
        setRequiresEscalation(false);
        setChatHistory([]);
        setChatInput("");
    };

    return (
        <div className="space-y-6">
            {/* API Status Indicator */}
            <Alert className="border-primary/20 bg-gradient-to-r from-primary/5 to-purple-500/5">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <AlertTitle className="text-sm font-semibold">Live API Integration</AlertTitle>
                <AlertDescription className="text-xs text-muted-foreground">
                    This form sends data to the Customer Support Auto-Agent API at{" "}
                    <code className="text-xs bg-muted px-1 py-0.5 rounded">customersupportagent-1.onrender.com</code>
                </AlertDescription>
            </Alert>

            {/* Escalation Warning */}
            {requiresEscalation && (
                <Alert className="border-destructive/50 bg-destructive/5">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                    <AlertTitle className="text-sm font-semibold text-destructive">Escalation Required</AlertTitle>
                    <AlertDescription className="text-xs text-destructive/80">
                        This query requires human agent intervention. Please route to your support team.
                    </AlertDescription>
                </Alert>
            )}

            {/* Error Alert */}
            {error && (
                <Alert className="border-destructive/50 bg-destructive/5">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                    <AlertTitle className="text-sm font-semibold text-destructive">Error</AlertTitle>
                    <AlertDescription className="text-xs text-destructive/80">{error}</AlertDescription>
                </Alert>
            )}

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Input Form */}
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-lg">
                    <CardHeader className="border-b border-border/50 bg-gradient-to-r from-card to-card/80">
                        <CardTitle className="flex items-center gap-3">
                            <div className="h-8 w-1 rounded-full bg-gradient-to-b from-primary via-purple-500 to-blue-500"></div>
                            Customer Support Request
                        </CardTitle>
                        <CardDescription>Fill in the details to get AI-powered support</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6 max-h-[calc(100vh-20rem)] overflow-y-auto">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="query" className="flex items-center gap-2">
                                    Customer Query
                                    <Badge variant="destructive" className="text-xs">Required</Badge>
                                </Label>
                                <Textarea
                                    id="query"
                                    placeholder="Enter the customer's question or issue..."
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    className="min-h-[120px] resize-none"
                                />
                            </div>

                            <Separator />

                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <User className="h-4 w-4" />
                                    <span>Customer Information (Optional)</span>
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="customer-name">Name</Label>
                                        <Input
                                            id="customer-name"
                                            placeholder="John Doe"
                                            value={customerName}
                                            onChange={(e) => setCustomerName(e.target.value)}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="customer-email">Email</Label>
                                        <Input
                                            id="customer-email"
                                            type="email"
                                            placeholder="john@example.com"
                                            value={customerEmail}
                                            onChange={(e) => setCustomerEmail(e.target.value)}
                                        />
                                    </div>

                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="membership">Membership</Label>
                                        <Select value={customerMembership} onValueChange={(value: any) => setCustomerMembership(value)}>
                                            <SelectTrigger id="membership">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="free">Free</SelectItem>
                                                <SelectItem value="premium">Premium</SelectItem>
                                                <SelectItem value="enterprise">Enterprise</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-4 border-t border-border/50">
                            <Button
                                onClick={handleSubmit}
                                disabled={isLoading || !query.trim()}
                                className="flex-1 bg-gradient-to-r from-primary via-purple-500 to-blue-500 hover:from-primary/90 hover:via-purple-500/90 hover:to-blue-500/90 text-white shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="mr-2 h-4 w-4" />
                                        Send to AI Agent
                                    </>
                                )}
                            </Button>
                            <Button
                                variant="outline"
                                onClick={clearForm}
                                disabled={isLoading}
                            >
                                Clear
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Output Section */}
                <Card className="border-border/50 bg-gradient-to-br from-muted/30 via-muted/20 to-card/50 backdrop-blur-sm shadow-lg flex flex-col h-[calc(100vh-8rem)]">
                    <CardHeader className="border-b border-border/50 bg-gradient-to-r from-card/80 to-card/60 shrink-0">
                        <CardTitle className="flex items-center gap-3">
                            <div className="h-8 w-1 rounded-full bg-gradient-to-b from-green-500 via-emerald-500 to-teal-500"></div>
                            AI Response & Chat
                        </CardTitle>
                        <CardDescription>AI-powered analysis and conversation</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-hidden p-0 flex flex-col">
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {isLoading && chatHistory.length === 0 ? (
                                <div className="flex h-full items-center justify-center text-muted-foreground">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="relative">
                                            <div className="h-16 w-16 rounded-full bg-gradient-to-r from-primary via-purple-500 to-blue-500 opacity-20 animate-pulse"></div>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                            </div>
                                        </div>
                                        <p className="text-sm font-medium">Calling AI agent API...</p>
                                        <div className="flex gap-1">
                                            <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                            <div className="h-2 w-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                            <div className="h-2 w-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                        </div>
                                    </div>
                                </div>
                            ) : output && output.response ? (
                                <div className="space-y-6">
                                    {/* Main Analysis Card - Always shows latest analysis */}
                                    <div className="bg-card/50 border border-border/50 rounded-xl p-4 shadow-sm space-y-4">
                                        <div className="flex flex-wrap gap-2">
                                            <Badge variant={output.response.sentiment === 'positive' ? 'default' : output.response.sentiment === 'negative' ? 'destructive' : 'secondary'} className="capitalize">
                                                {output.response.sentiment} Sentiment
                                            </Badge>
                                            <Badge variant="outline" className="border-primary/20 text-primary">
                                                {(output.response.confidence * 100).toFixed(0)}% Confidence
                                            </Badge>
                                            <Badge variant="outline" className="capitalize">
                                                {output.response.category.replace(/_/g, ' ')}
                                            </Badge>
                                            {output.response.requires_escalation && (
                                                <Badge variant="destructive" className="animate-pulse">
                                                    Escalation Required
                                                </Badge>
                                            )}
                                        </div>

                                        {output.response.suggested_actions.length > 0 && (
                                            <div className="space-y-2">
                                                <Label className="text-xs font-semibold uppercase text-muted-foreground">Suggested Actions</Label>
                                                <div className="grid gap-2">
                                                    {output.response.suggested_actions.map((action, i) => (
                                                        <div key={i} className="flex items-center justify-between bg-muted/30 p-2 rounded text-sm border border-border/30">
                                                            <span>{action.action}</span>
                                                            <Badge variant="outline" className="text-[10px] h-5">
                                                                {action.priority}
                                                            </Badge>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <Separator />

                                    {/* Chat History */}
                                    <div className="space-y-4">
                                        {chatHistory.map((msg, i) => (
                                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                                <div className={`max-w-[85%] rounded-2xl p-3 ${msg.role === 'user'
                                                    ? 'bg-primary text-primary-foreground rounded-br-none'
                                                    : 'bg-muted/50 border border-border/50 rounded-bl-none'
                                                    }`}>
                                                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                                                    <p className="text-[10px] opacity-50 mt-1 text-right">
                                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                        {isLoading && (
                                            <div className="flex justify-start">
                                                <div className="bg-muted/50 border border-border/50 rounded-2xl rounded-bl-none p-3 flex items-center gap-2">
                                                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                                    <span className="text-xs text-muted-foreground">AI is typing...</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
                                    <div className="text-center space-y-3">
                                        <div className="flex justify-center">
                                            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/10 to-purple-500/10 flex items-center justify-center">
                                                <Sparkles className="h-6 w-6 text-primary/50" />
                                            </div>
                                        </div>
                                        <p>Fill in the form and click "Send to AI Agent" to start</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Chat Input Area - Only show if we have an output/active session */}
                        {output && (
                            <div className="p-4 border-t border-border/50 bg-card/30 backdrop-blur-sm">
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        handleChatSubmit();
                                    }}
                                    className="flex gap-2"
                                >
                                    <Input
                                        placeholder="Type a reply..."
                                        value={chatInput}
                                        onChange={(e) => setChatInput(e.target.value)}
                                        disabled={isLoading}
                                        className="flex-1"
                                    />
                                    <Button type="submit" size="icon" disabled={isLoading || !chatInput.trim()}>
                                        <Send className="h-4 w-4" />
                                    </Button>
                                </form>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div >
    );
}
