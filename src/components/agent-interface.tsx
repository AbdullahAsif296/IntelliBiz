"use client";

import { useState } from "react";
import { Agent } from "@/data/agents";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Play, RefreshCw, Copy, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AgentInterfaceProps {
    agent: Omit<Agent, "icon">;
}

export function AgentInterface({ agent }: AgentInterfaceProps) {
    const [input, setInput] = useState("");
    const [output, setOutput] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleRun = async () => {
        if (!input.trim()) return;

        setIsLoading(true);
        setOutput(null);

        // Simulate API call delay
        setTimeout(() => {
            setIsLoading(false);
            // In a real app, this would be the response from the backend agent
            setOutput(agent.demoOutput);
        }, 1500);
    };

    const handleCopy = () => {
        if (output) {
            navigator.clipboard.writeText(output);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="grid gap-6 lg:grid-cols-2 h-[calc(100vh-12rem)]">
            {/* Input Section */}
            <Card className="flex flex-col h-full">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        Input
                        <Badge variant="secondary" className="font-normal text-xs">
                            {agent.category}
                        </Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col gap-4">
                    <Textarea
                        placeholder={agent.inputPlaceholder}
                        className="flex-1 min-h-[200px] resize-none font-mono text-sm"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <div className="flex justify-end">
                        <Button onClick={handleRun} disabled={isLoading || !input.trim()}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <Play className="mr-2 h-4 w-4" />
                                    Run Agent
                                </>
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Output Section */}
            <Card className="flex flex-col h-full bg-muted/30">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Output</CardTitle>
                    {output && (
                        <div className="flex gap-2">
                            <Button variant="ghost" size="sm" onClick={() => setOutput(null)}>
                                <RefreshCw className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={handleCopy}>
                                {copied ? (
                                    <Check className="h-4 w-4 text-green-500" />
                                ) : (
                                    <Copy className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                    )}
                </CardHeader>
                <CardContent className="flex-1 overflow-auto">
                    {isLoading ? (
                        <div className="flex h-full items-center justify-center text-muted-foreground">
                            <div className="flex flex-col items-center gap-2">
                                <Loader2 className="h-8 w-8 animate-spin" />
                                <p>Agent is thinking...</p>
                            </div>
                        </div>
                    ) : output ? (
                        <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
                            {output}
                        </div>
                    ) : (
                        <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
                            Run the agent to see results here.
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
