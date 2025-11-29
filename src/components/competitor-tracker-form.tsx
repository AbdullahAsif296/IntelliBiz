"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Loader2,
    Sparkles,
    AlertTriangle,
    CheckCircle2,
    Search,
    ExternalLink,
    Target,
    TrendingUp
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface Competitor {
    name: string;
    link: string;
}

interface CompetitorAnalysisResponse {
    input: string;
    competitors: Competitor[];
    total_competitors_found: number;
}

export function CompetitorTrackerForm() {
    const [productName, setProductName] = useState("iPhone 15");
    const [output, setOutput] = useState<CompetitorAnalysisResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        if (!productName.trim()) {
            setError("Product name is required");
            return;
        }

        setIsLoading(true);
        setOutput(null);
        setError(null);

        try {
            const response = await fetch('https://competitor-analysis-api.vercel.app/api/competitors', {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    input: productName
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
        setProductName("");
        setOutput(null);
        setError(null);
    };

    return (
        <div className="space-y-6">
            {/* API Status Indicator */}
            <Alert className="border-primary/20 bg-gradient-to-r from-primary/5 to-purple-500/5">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <AlertTitle className="text-sm font-semibold">Live API Integration</AlertTitle>
                <AlertDescription className="text-xs text-muted-foreground">
                    This form sends data to the Competitor Analysis API at{" "}
                    <code className="text-xs bg-muted px-1 py-0.5 rounded">competitor-analysis-api.vercel.app</code>
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
                            Product Analysis
                        </CardTitle>
                        <CardDescription>Enter a product name to find competitors</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6 flex-1 flex flex-col">
                        <div className="space-y-4 flex-1">
                            <div className="space-y-2">
                                <Label htmlFor="product-name" className="flex items-center gap-2">
                                    <Search className="h-4 w-4 text-muted-foreground" />
                                    Product Name
                                </Label>
                                <Input
                                    id="product-name"
                                    value={productName}
                                    onChange={(e) => setProductName(e.target.value)}
                                    placeholder="e.g., iPhone 15, Tesla Model 3, MacBook Pro"
                                    className="text-base"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !isLoading) {
                                            handleSubmit();
                                        }
                                    }}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Enter any product name to discover its main competitors
                                </p>
                            </div>

                            {/* Example Products */}
                            <div className="space-y-2">
                                <Label className="text-xs text-muted-foreground">Quick Examples:</Label>
                                <div className="flex flex-wrap gap-2">
                                    {["iPhone 15", "Samsung Galaxy S24", "Tesla Model 3", "MacBook Pro", "PlayStation 5"].map((example) => (
                                        <Badge
                                            key={example}
                                            variant="outline"
                                            className="cursor-pointer hover:bg-primary/10 hover:border-primary/50 transition-colors"
                                            onClick={() => setProductName(example)}
                                        >
                                            {example}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-4 mt-auto border-t border-border/50">
                            <Button
                                onClick={handleSubmit}
                                disabled={isLoading || !productName.trim()}
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
                                        Find Competitors
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
                            Competitor Analysis
                        </CardTitle>
                        <CardDescription>Discovered competitors and market insights</CardDescription>
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
                                    <p className="text-sm font-medium">Analyzing market competitors...</p>
                                </div>
                            </div>
                        ) : output ? (
                            <div className="space-y-6">
                                {/* Header Stats */}
                                <div className="bg-card/50 border border-border/50 rounded-xl p-6 shadow-sm">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/10 to-purple-500/10 flex items-center justify-center">
                                                <Target className="h-6 w-6 text-primary" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-lg">{output.input}</h3>
                                                <p className="text-xs text-muted-foreground">Product analyzed</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-3xl font-bold text-primary">{output.total_competitors_found}</div>
                                            <p className="text-xs text-muted-foreground uppercase tracking-wider">Competitors</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Competitors List */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 mb-3">
                                        <TrendingUp className="h-4 w-4 text-primary" />
                                        <h4 className="text-sm font-semibold">Main Competitors</h4>
                                    </div>

                                    {output.competitors.map((competitor, index) => (
                                        <div
                                            key={index}
                                            className="bg-card/50 border border-border/50 rounded-lg p-4 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300 group"
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <Badge variant="outline" className="text-xs shrink-0">
                                                            #{index + 1}
                                                        </Badge>
                                                        <h5 className="font-semibold text-sm truncate group-hover:text-primary transition-colors">
                                                            {competitor.name}
                                                        </h5>
                                                    </div>
                                                    <a
                                                        href={competitor.link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 group/link truncate"
                                                    >
                                                        <span className="truncate">{competitor.link}</span>
                                                        <ExternalLink className="h-3 w-3 shrink-0 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                                                    </a>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="shrink-0 h-8 w-8 p-0"
                                                    onClick={() => window.open(competitor.link, '_blank')}
                                                >
                                                    <ExternalLink className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Market Insights */}
                                <div className="bg-gradient-to-br from-primary/5 to-purple-500/5 border border-primary/20 rounded-xl p-4 shadow-sm">
                                    <div className="flex items-start gap-3">
                                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                                            <Sparkles className="h-4 w-4 text-primary" />
                                        </div>
                                        <div className="space-y-2">
                                            <h5 className="text-sm font-semibold">Market Insights</h5>
                                            <ul className="text-xs text-muted-foreground space-y-1">
                                                <li className="flex items-start gap-2">
                                                    <span className="text-primary mt-0.5">•</span>
                                                    <span>Found {output.total_competitors_found} direct competitors in the market</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="text-primary mt-0.5">•</span>
                                                    <span>Click on any competitor to visit their product page</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="text-primary mt-0.5">•</span>
                                                    <span>Use this data to benchmark features and pricing</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
                                <div className="text-center space-y-3">
                                    <div className="flex justify-center">
                                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/10 to-purple-500/10 flex items-center justify-center">
                                            <Search className="h-6 w-6 text-primary/50" />
                                        </div>
                                    </div>
                                    <p>Enter a product name to discover competitors</p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
