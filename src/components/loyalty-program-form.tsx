"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Loader2,
    Gift,
    User,
    TrendingUp,
    AlertTriangle,
    CheckCircle2,
    History
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

interface LoyaltyAnalysisResponse {
    customer_id: string;
    recommended_reward: string;
    predicted_retention: number;
    segment: string;
    rfm_score: number;
    churn_risk: string;
    timestamp: string;
    history?: any[];
}

export function LoyaltyProgramForm() {
    const [customerId, setCustomerId] = useState("CUST-12345");
    const [includeHistory, setIncludeHistory] = useState(false);
    const [output, setOutput] = useState<LoyaltyAnalysisResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        setIsLoading(true);
        setOutput(null);
        setError(null);

        try {
            const response = await fetch('/api/proxy/loyalty', {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    customer_id: customerId,
                    include_history: includeHistory
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
        setCustomerId("");
        setIncludeHistory(false);
        setOutput(null);
        setError(null);
    };

    const getRetentionColor = (score: number) => {
        if (score >= 0.7) return "text-green-500";
        if (score >= 0.4) return "text-yellow-500";
        return "text-red-500";
    };

    const getRiskBadgeVariant = (risk: string) => {
        switch (risk.toLowerCase()) {
            case 'high': return 'destructive';
            case 'medium': return 'secondary'; // Using secondary for medium as warning isn't standard
            case 'low': return 'default'; // Using default (primary) for low risk (good)
            default: return 'outline';
        }
    };

    return (
        <div className="space-y-6">
            {/* API Status Indicator */}
            <Alert className="border-primary/20 bg-gradient-to-r from-primary/5 to-purple-500/5">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <AlertTitle className="text-sm font-semibold">Live API Integration</AlertTitle>
                <AlertDescription className="text-xs text-muted-foreground">
                    This form sends data to the Loyalty Program Optimizer API via a secure proxy.
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
                            Loyalty Optimization
                        </CardTitle>
                        <CardDescription>Analyze customer for retention and rewards</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6 flex-1 flex flex-col">
                        <div className="space-y-4 flex-1">
                            <div className="space-y-2">
                                <Label htmlFor="customer-id" className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    Customer ID
                                </Label>
                                <Input
                                    id="customer-id"
                                    value={customerId}
                                    onChange={(e) => setCustomerId(e.target.value)}
                                    placeholder="e.g., CUST-12345"
                                />
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="include-history"
                                    checked={includeHistory}
                                    onCheckedChange={(checked) => setIncludeHistory(checked as boolean)}
                                />
                                <Label htmlFor="include-history" className="text-sm font-normal cursor-pointer">
                                    Include historical data analysis
                                </Label>
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
                                        <Gift className="mr-2 h-4 w-4" />
                                        Optimize Loyalty
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
                        <CardDescription>Retention prediction and reward suggestion</CardDescription>
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
                                    <p className="text-sm font-medium">Analyzing customer data...</p>
                                </div>
                            </div>
                        ) : output ? (
                            <div className="space-y-6">
                                {/* Retention Score */}
                                <div className="bg-card/50 border border-border/50 rounded-xl p-6 shadow-sm flex flex-col items-center justify-center">
                                    <div className="relative h-32 w-32 flex items-center justify-center mb-2">
                                        <svg className="h-full w-full transform -rotate-90" viewBox="0 0 100 100">
                                            <circle
                                                className="text-muted/20"
                                                strokeWidth="8"
                                                stroke="currentColor"
                                                fill="transparent"
                                                r="40"
                                                cx="50"
                                                cy="50"
                                            />
                                            <circle
                                                className={getRetentionColor(output.predicted_retention)}
                                                strokeWidth="8"
                                                strokeDasharray={251.2}
                                                strokeDashoffset={251.2 * (1 - output.predicted_retention)}
                                                strokeLinecap="round"
                                                stroke="currentColor"
                                                fill="transparent"
                                                r="40"
                                                cx="50"
                                                cy="50"
                                            />
                                        </svg>
                                        <div className="absolute flex flex-col items-center">
                                            <span className={`text-3xl font-bold ${getRetentionColor(output.predicted_retention)}`}>
                                                {Math.round(output.predicted_retention * 100)}%
                                            </span>
                                            <span className="text-xs text-muted-foreground uppercase tracking-wider">Retention</span>
                                        </div>
                                    </div>
                                    <div className="w-full space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span>Churn Risk</span>
                                            <Badge variant={getRiskBadgeVariant(output.churn_risk) as any}>
                                                {output.churn_risk}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>

                                {/* Recommended Reward */}
                                <div className="bg-card/50 border border-border/50 rounded-xl p-4 shadow-sm">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Gift className="h-4 w-4 text-primary" />
                                        <span className="text-sm font-semibold">Recommended Reward</span>
                                    </div>
                                    <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                                        <p className="text-lg font-medium text-primary text-center">
                                            {output.recommended_reward}
                                        </p>
                                    </div>
                                </div>

                                {/* Customer Segment */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-card/50 border border-border/50 rounded-xl p-4 shadow-sm">
                                        <div className="flex items-center gap-2 mb-2">
                                            <User className="h-4 w-4 text-primary" />
                                            <span className="text-sm font-semibold">Segment</span>
                                        </div>
                                        <p className="text-lg font-medium">{output.segment}</p>
                                    </div>
                                    <div className="bg-card/50 border border-border/50 rounded-xl p-4 shadow-sm">
                                        <div className="flex items-center gap-2 mb-2">
                                            <TrendingUp className="h-4 w-4 text-primary" />
                                            <span className="text-sm font-semibold">RFM Score</span>
                                        </div>
                                        <p className="text-lg font-medium">{output.rfm_score}</p>
                                    </div>
                                </div>

                                {output.history && output.history.length > 0 && (
                                    <div className="bg-card/50 border border-border/50 rounded-xl p-4 shadow-sm">
                                        <div className="flex items-center gap-2 mb-2">
                                            <History className="h-4 w-4 text-primary" />
                                            <span className="text-sm font-semibold">History</span>
                                        </div>
                                        <p className="text-sm text-muted-foreground">{output.history.length} historical records found.</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
                                <div className="text-center space-y-3">
                                    <div className="flex justify-center">
                                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/10 to-purple-500/10 flex items-center justify-center">
                                            <Gift className="h-6 w-6 text-primary/50" />
                                        </div>
                                    </div>
                                    <p>Enter customer ID to optimize loyalty</p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
