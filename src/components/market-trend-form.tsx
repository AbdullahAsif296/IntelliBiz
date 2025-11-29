"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Loader2,
    Sparkles,
    AlertTriangle,
    CheckCircle2,
    TrendingUp,
    BarChart3,
    Lightbulb,
    Search,
    Target
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface MarketTrendResponse {
    agent_id: string;
    agent_name: string;
    status: string;
    sector: string;
    analysis_type: string;
    result: {
        trend_direction: string;
        strength: string;
        confidence: number;
        key_patterns: string[];
        insights: string[];
        recommendation: string;
    };
}

export function MarketTrendForm() {
    // Form fields
    const [sector, setSector] = useState("Technology");
    const [queryType, setQueryType] = useState("emerging_trends");

    // State
    const [output, setOutput] = useState<MarketTrendResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        if (!sector) {
            setError("Sector is required");
            return;
        }

        setIsLoading(true);
        setOutput(null);
        setError(null);

        try {
            // Note: Assuming /analyze endpoint based on project patterns, though user provided base URL
            const response = await fetch('https://minahilasif222.pythonanywhere.com/analyze', {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sector,
                    query_type: queryType
                })
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const data = await response.json();
            setOutput(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    const clearForm = () => {
        setSector("Technology");
        setQueryType("emerging_trends");
        setOutput(null);
        setError(null);
    };

    const getStrengthColor = (strength: string) => {
        switch (strength.toLowerCase()) {
            case 'strong': return 'bg-green-500 hover:bg-green-600';
            case 'moderate': return 'bg-yellow-500 hover:bg-yellow-600';
            case 'weak': return 'bg-red-500 hover:bg-red-600';
            default: return 'bg-blue-500 hover:bg-blue-600';
        }
    };

    return (
        <div className="space-y-6">
            {/* API Status Indicator */}
            <Alert className="border-primary/20 bg-gradient-to-r from-primary/5 to-purple-500/5">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <AlertTitle className="text-sm font-semibold">Live API Integration</AlertTitle>
                <AlertDescription className="text-xs text-muted-foreground">
                    This form sends data to the Market Trend Monitor Agent API at{" "}
                    <code className="text-xs bg-muted px-1 py-0.5 rounded">minahilasif222.pythonanywhere.com</code>
                </AlertDescription>
            </Alert>

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
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-lg h-full flex flex-col">
                    <CardHeader className="border-b border-border/50 bg-gradient-to-r from-card to-card/80">
                        <CardTitle className="flex items-center gap-3">
                            <div className="h-8 w-1 rounded-full bg-gradient-to-b from-primary via-purple-500 to-blue-500"></div>
                            Market Analysis Input
                        </CardTitle>
                        <CardDescription>Analyze market trends and emerging patterns</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6 flex-1">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="sector" className="flex items-center gap-2">
                                    <Target className="h-4 w-4 text-muted-foreground" />
                                    Sector / Industry
                                </Label>
                                <Input
                                    id="sector"
                                    value={sector}
                                    onChange={(e) => setSector(e.target.value)}
                                    placeholder="e.g. Technology, Healthcare, Finance"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="query-type" className="flex items-center gap-2">
                                    <Search className="h-4 w-4 text-muted-foreground" />
                                    Query Type
                                </Label>
                                <Select value={queryType} onValueChange={setQueryType}>
                                    <SelectTrigger id="query-type">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="emerging_trends">Emerging Trends</SelectItem>
                                        <SelectItem value="market_growth">Market Growth</SelectItem>
                                        <SelectItem value="competitor_analysis">Competitor Analysis</SelectItem>
                                        <SelectItem value="consumer_behavior">Consumer Behavior</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-4 mt-auto border-t border-border/50">
                            <Button
                                onClick={handleSubmit}
                                disabled={isLoading}
                                className="flex-1 bg-gradient-to-r from-primary via-purple-500 to-blue-500 hover:from-primary/90 hover:via-purple-500/90 hover:to-blue-500/90 text-white shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Analyzing...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="mr-2 h-4 w-4" />
                                        Analyze Market
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
                <Card className="border-border/50 bg-gradient-to-br from-muted/30 via-muted/20 to-card/50 backdrop-blur-sm shadow-lg h-full flex flex-col">
                    <CardHeader className="border-b border-border/50 bg-gradient-to-r from-card/80 to-card/60 shrink-0">
                        <CardTitle className="flex items-center gap-3">
                            <div className="h-8 w-1 rounded-full bg-gradient-to-b from-green-500 via-emerald-500 to-teal-500"></div>
                            Analysis Results
                        </CardTitle>
                        <CardDescription>AI-generated market insights</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-y-auto p-6">
                        {isLoading ? (
                            <div className="flex h-full items-center justify-center text-muted-foreground">
                                <div className="flex flex-col items-center gap-4">
                                    <div className="relative">
                                        <div className="h-16 w-16 rounded-full bg-gradient-to-r from-primary via-purple-500 to-blue-500 opacity-20 animate-pulse"></div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                        </div>
                                    </div>
                                    <p className="text-sm font-medium">Analyzing market data...</p>
                                </div>
                            </div>
                        ) : output ? (
                            <div className="space-y-6">
                                {/* Top Stats */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-card/50 border border-border/50 rounded-xl p-4 shadow-sm flex flex-col items-center justify-center gap-2">
                                        <span className="text-xs font-semibold uppercase text-muted-foreground">Trend Direction</span>
                                        <div className="flex items-center gap-2">
                                            <TrendingUp className="h-5 w-5 text-primary" />
                                            <span className="text-lg font-bold">{output.result.trend_direction}</span>
                                        </div>
                                    </div>
                                    <div className="bg-card/50 border border-border/50 rounded-xl p-4 shadow-sm flex flex-col items-center justify-center gap-2">
                                        <span className="text-xs font-semibold uppercase text-muted-foreground">Strength</span>
                                        <Badge className={`text-base px-4 py-1 capitalize ${getStrengthColor(output.result.strength)}`}>
                                            {output.result.strength}
                                        </Badge>
                                        <span className="text-xs text-muted-foreground">Confidence: {(output.result.confidence * 100).toFixed(0)}%</span>
                                    </div>
                                </div>

                                {/* Recommendation */}
                                <div className="bg-card/50 border border-border/50 rounded-xl p-4 shadow-sm">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Lightbulb className="h-4 w-4 text-primary" />
                                        <Label className="text-xs font-semibold uppercase text-muted-foreground">Recommendation</Label>
                                    </div>
                                    <p className="text-sm font-medium">{output.result.recommendation}</p>
                                </div>

                                {/* Key Patterns */}
                                <div className="space-y-2">
                                    <Label className="text-xs font-semibold uppercase text-muted-foreground">Key Patterns</Label>
                                    <div className="flex flex-wrap gap-2">
                                        {output.result.key_patterns.map((pattern, i) => (
                                            <Badge key={i} variant="outline" className="border-primary/20 text-primary bg-primary/5">
                                                {pattern}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                {/* Insights */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                                        <Label className="text-xs font-semibold uppercase text-muted-foreground">Detailed Insights</Label>
                                    </div>
                                    <div className="space-y-2">
                                        {output.result.insights.map((insight, i) => (
                                            <div key={i} className="flex gap-3 p-3 bg-muted/30 rounded border border-border/30">
                                                <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0"></div>
                                                <p className="text-sm text-muted-foreground">{insight}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Footer Info */}
                                <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-4 border-t border-border/30">
                                    <span>Agent: {output.agent_name}</span>
                                    <span>ID: {output.agent_id}</span>
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
                                    <p>Run the analysis to see market trends</p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
