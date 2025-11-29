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
    ShieldAlert,
    ShieldCheck,
    Globe,
    Newspaper,
    AlertTriangle,
    ExternalLink,
    Search
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ReputationResponse {
    brand_name: string;
    fake_news_Reallife: any[];
    mentions_detected: string;
    recommendation: string;
    status: string;
    summary: string;
    suspicious_posts: number;
    timestamp: string;
    top_sources: string[];
}

export function BrandReputationForm() {
    const [brandName, setBrandName] = useState("Cloudflare");
    const [type, setType] = useState("webservice");
    const [dateRange, setDateRange] = useState("2010-10-01 to 2025-10-20");
    const [region, setRegion] = useState("Global");
    const [language, setLanguage] = useState("English");

    const [output, setOutput] = useState<ReputationResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        setIsLoading(true);
        setOutput(null);
        setError(null);

        try {
            const response = await fetch('/api/proxy/reputation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    brand_name: brandName,
                    Type: type,
                    date_range: dateRange,
                    sources: ["Twitter", "NewsAPI"], // Hardcoded for now as per example
                    metadata: {
                        region: region,
                        language: language
                    }
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

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'safe': return 'text-green-500';
            case 'warning': return 'text-yellow-500';
            case 'critical': return 'text-red-500';
            default: return 'text-muted-foreground';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'safe': return <ShieldCheck className="h-8 w-8 text-green-500" />;
            case 'warning': return <AlertTriangle className="h-8 w-8 text-yellow-500" />;
            case 'critical': return <ShieldAlert className="h-8 w-8 text-red-500" />;
            default: return <Search className="h-8 w-8 text-muted-foreground" />;
        }
    };

    return (
        <div className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Input Form */}
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-lg h-full flex flex-col">
                    <CardHeader className="border-b border-border/50 bg-gradient-to-r from-card to-card/80">
                        <CardTitle className="flex items-center gap-3">
                            <div className="h-8 w-1 rounded-full bg-gradient-to-b from-blue-500 via-indigo-500 to-purple-500"></div>
                            Brand Reputation Guard
                        </CardTitle>
                        <CardDescription>Monitor brand sentiment and detect threats</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6 flex-1 flex flex-col">
                        <div className="space-y-4 flex-1">
                            <div className="space-y-2">
                                <Label>Brand Name</Label>
                                <Input value={brandName} onChange={(e) => setBrandName(e.target.value)} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Type</Label>
                                    <Select value={type} onValueChange={setType}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="webservice">Web Service</SelectItem>
                                            <SelectItem value="product">Product</SelectItem>
                                            <SelectItem value="person">Person</SelectItem>
                                            <SelectItem value="organization">Organization</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Region</Label>
                                    <Input value={region} onChange={(e) => setRegion(e.target.value)} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Date Range</Label>
                                <Input value={dateRange} onChange={(e) => setDateRange(e.target.value)} placeholder="YYYY-MM-DD to YYYY-MM-DD" />
                            </div>
                        </div>

                        {error && (
                            <Alert variant="destructive">
                                <AlertTriangle className="h-4 w-4" />
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <div className="pt-4 mt-auto border-t border-border/50">
                            <Button
                                onClick={handleSubmit}
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/20"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Analyzing Reputation...
                                    </>
                                ) : (
                                    <>
                                        <ShieldCheck className="mr-2 h-4 w-4" />
                                        Analyze Brand
                                    </>
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Output Section */}
                <Card className="border-border/50 bg-gradient-to-br from-muted/30 via-muted/20 to-card/50 backdrop-blur-sm shadow-lg h-full flex flex-col">
                    <CardHeader className="border-b border-border/50 bg-gradient-to-r from-card/80 to-card/60 shrink-0">
                        <CardTitle className="flex items-center gap-3">
                            <div className="h-8 w-1 rounded-full bg-gradient-to-b from-orange-500 via-red-500 to-pink-500"></div>
                            Analysis Report
                        </CardTitle>
                        <CardDescription>Real-time reputation insights</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-y-auto p-6">
                        {isLoading ? (
                            <div className="flex h-full items-center justify-center text-muted-foreground">
                                <div className="flex flex-col items-center gap-4">
                                    <div className="relative">
                                        <div className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-20 animate-pulse"></div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                                        </div>
                                    </div>
                                    <p className="text-sm font-medium">Scanning sources...</p>
                                </div>
                            </div>
                        ) : output ? (
                            <div className="space-y-6">
                                {/* Status Header */}
                                <div className="flex items-center justify-between bg-card/50 border border-border/50 rounded-xl p-4 shadow-sm">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-muted/50 rounded-full">
                                            {getStatusIcon(output.status)}
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Reputation Status</p>
                                            <h3 className={`text-xl font-bold ${getStatusColor(output.status)}`}>
                                                {output.status}
                                            </h3>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-muted-foreground">Mentions</p>
                                        <p className="font-semibold">{output.mentions_detected}</p>
                                    </div>
                                </div>

                                {/* Summary */}
                                <div className="bg-card/50 border border-border/50 rounded-xl p-4 shadow-sm space-y-2">
                                    <h4 className="font-semibold flex items-center gap-2">
                                        <Newspaper className="h-4 w-4 text-primary" />
                                        Executive Summary
                                    </h4>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {output.summary}
                                    </p>
                                </div>

                                {/* Recommendation */}
                                <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4 shadow-sm space-y-2">
                                    <h4 className="font-semibold flex items-center gap-2 text-blue-600 dark:text-blue-400">
                                        <ShieldCheck className="h-4 w-4" />
                                        Strategic Recommendation
                                    </h4>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {output.recommendation}
                                    </p>
                                </div>

                                {/* Top Sources */}
                                <div className="bg-card/50 border border-border/50 rounded-xl p-4 shadow-sm space-y-3">
                                    <h4 className="font-semibold flex items-center gap-2">
                                        <Globe className="h-4 w-4 text-primary" />
                                        Top Sources
                                    </h4>
                                    <div className="space-y-2">
                                        {output.top_sources.map((source, idx) => (
                                            <a
                                                key={idx}
                                                href={source}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors truncate block"
                                            >
                                                <ExternalLink className="h-3 w-3 shrink-0" />
                                                <span className="truncate">{source}</span>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
                                <div className="text-center space-y-3">
                                    <div className="flex justify-center">
                                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500/10 to-indigo-500/10 flex items-center justify-center">
                                            <ShieldAlert className="h-6 w-6 text-blue-500/50" />
                                        </div>
                                    </div>
                                    <p>Enter brand details to analyze reputation</p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
