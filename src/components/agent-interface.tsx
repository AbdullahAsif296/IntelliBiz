"use client";

import { useState } from "react";
import { Agent } from "@/data/agents";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, RefreshCw, Copy, Check, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CustomerSupportForm } from "@/components/customer-support-form";
import { ProactiveSurveyForm } from "@/components/proactive-survey-form";
import { CustomerSentimentForm } from "@/components/customer-sentiment-form";
import { MarketTrendForm } from "@/components/market-trend-form";
import { LeadScoringForm } from "@/components/lead-scoring-form";
import { ContentGapForm } from "@/components/content-gap-form";
import { CompetitorTrackerForm } from "@/components/competitor-tracker-form";
import { ChurnPreventionForm } from "@/components/churn-prevention-form";
import { SeoOptimizerForm } from "@/components/seo-optimizer-form";
import { LoyaltyProgramForm } from "@/components/loyalty-program-form";
import { InfluencerEngagementForm } from "@/components/influencer-engagement-form";
import { BrandReputationForm } from "@/components/brand-reputation-form";
import { CrossSellSuggestionForm } from "@/components/cross-sell-suggestion-form";
import { CompetitorAdDetectorForm } from "@/components/competitor-ad-detector-form";

interface AgentInterfaceProps {
    agent: Omit<Agent, "icon">;
}

export function AgentInterface({ agent }: AgentInterfaceProps) {
    // If this is the Customer Support Auto agent, use the comprehensive form
    if (agent.id === "customer-support-auto") {
        return <CustomerSupportForm />;
    }

    if (agent.id === "proactive-survey") {
        return <ProactiveSurveyForm />;
    }

    if (agent.id === "customer-sentiment") {
        return <CustomerSentimentForm />;
    }

    if (agent.id === "market-trend-monitor") {
        return <MarketTrendForm />;
    }

    if (agent.id === "lead-scoring") {
        return <LeadScoringForm />;
    }

    if (agent.id === "content-gap") {
        return <ContentGapForm />;
    }

    if (agent.id === "competitor-tracker") {
        return <CompetitorTrackerForm />;
    }

    if (agent.id === "churn-prevention") {
        return <ChurnPreventionForm />;
    }

    if (agent.id === "seo-optimizer") {
        return <SeoOptimizerForm />;
    }

    if (agent.id === "loyalty-program-optimizer") {
        return <LoyaltyProgramForm />;
    }

    if (agent.id === "influencer-engagement") {
        return <InfluencerEngagementForm />;
    }

    if (agent.id === "brand-reputation-guard") {
        return <BrandReputationForm />;
    }

    if (agent.id === "cross-sell-suggestion") {
        return <CrossSellSuggestionForm />;
    }

    if (agent.id === "competitor-ad-detector") {
        return <CompetitorAdDetectorForm />;
    }

    // For other agents, use the simple interface
    const [input, setInput] = useState("");
    const [output, setOutput] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleRun = async () => {
        if (!input.trim()) return;

        setIsLoading(true);
        setOutput(null);

        // Simulate API call delay for demo agents
        await new Promise(resolve => setTimeout(resolve, 1500));
        setOutput(agent.demoOutput);
        setIsLoading(false);
    };

    const handleCopy = () => {
        if (output) {
            navigator.clipboard.writeText(output);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="grid gap-6 lg:grid-cols-2 h-[calc(100vh-20rem)]">
            {/* Input Section */}
            <Card className="flex flex-col h-full border-border/50 bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="border-b border-border/50 bg-gradient-to-r from-card to-card/80">
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-3 text-lg">
                            <div className="h-8 w-1 rounded-full bg-gradient-to-b from-primary via-purple-500 to-blue-500"></div>
                            Input
                        </CardTitle>
                        <Badge
                            variant="secondary"
                            className="font-normal text-xs bg-gradient-to-r from-primary/10 to-purple-500/10 text-primary border-primary/20"
                        >
                            {agent.category}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col gap-4 pt-6">
                    <Textarea
                        placeholder={agent.inputPlaceholder}
                        className="flex-1 min-h-[200px] resize-none font-mono text-sm border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all duration-300"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <div className="flex justify-end">
                        <Button
                            onClick={handleRun}
                            disabled={isLoading || !input.trim()}
                            className="bg-gradient-to-r from-primary via-purple-500 to-blue-500 hover:from-primary/90 hover:via-purple-500/90 hover:to-blue-500/90 text-white shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300 disabled:opacity-50 disabled:shadow-none font-medium px-6"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    {agent.id === "customer-support-auto" ? "Processing..." : "Processing..."}
                                </>
                            ) : (
                                <>
                                    <Sparkles className="mr-2 h-4 w-4" />
                                    {agent.id === "customer-support-auto" ? "Send to AI Agent" : "Run Agent"}
                                </>
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Output Section */}
            <Card className="flex flex-col h-full border-border/50 bg-gradient-to-br from-muted/30 via-muted/20 to-card/50 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="border-b border-border/50 bg-gradient-to-r from-card/80 to-card/60">
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-3 text-lg">
                            <div className="h-8 w-1 rounded-full bg-gradient-to-b from-green-500 via-emerald-500 to-teal-500"></div>
                            Output
                        </CardTitle>
                        {output && (
                            <div className="flex gap-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setOutput(null)}
                                    className="hover:bg-accent/50 transition-colors"
                                >
                                    <RefreshCw className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleCopy}
                                    className="hover:bg-accent/50 transition-colors"
                                >
                                    {copied ? (
                                        <Check className="h-4 w-4 text-green-500" />
                                    ) : (
                                        <Copy className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="flex-1 overflow-auto pt-6">
                    {isLoading ? (
                        <div className="flex h-full items-center justify-center text-muted-foreground">
                            <div className="flex flex-col items-center gap-4">
                                <div className="relative">
                                    <div className="h-16 w-16 rounded-full bg-gradient-to-r from-primary via-purple-500 to-blue-500 opacity-20 animate-pulse"></div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                    </div>
                                </div>
                                <p className="text-sm font-medium">
                                    {agent.id === "customer-support-auto"
                                        ? "Calling AI agent API..."
                                        : "Agent is thinking..."}
                                </p>
                                <div className="flex gap-1">
                                    <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                    <div className="h-2 w-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                    <div className="h-2 w-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                </div>
                            </div>
                        </div>
                    ) : output ? (
                        <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap p-4 rounded-lg bg-card/50 border border-border/30 shadow-inner">
                            {output}
                        </div>
                    ) : (
                        <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
                            <div className="text-center space-y-3">
                                <div className="flex justify-center">
                                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/10 to-purple-500/10 flex items-center justify-center">
                                        <Sparkles className="h-6 w-6 text-primary/50" />
                                    </div>
                                </div>
                                <p>
                                    {agent.id === "customer-support-auto"
                                        ? "Enter a customer query to get an AI-powered response"
                                        : "Run the agent to see results here."}
                                </p>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
