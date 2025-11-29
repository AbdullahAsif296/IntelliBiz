"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    Loader2,
    Sparkles,
    AlertTriangle,
    CheckCircle2,
    ClipboardList,
    Calendar,
    ShoppingBag,
    User,
    MessageSquare
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ProactiveSurveyResponse {
    survey_trigger: boolean;
    survey_type: string;
    priority: string;
    reason: string;
    questions: string[];
    timestamp: string;
}

export function ProactiveSurveyForm() {
    // Form fields
    const [lastPurchase, setLastPurchase] = useState("Wireless Earbuds");
    const [lastSurveyDate, setLastSurveyDate] = useState("2025-09-20");
    const [recentActivity, setRecentActivity] = useState("Support chat with negative sentiment");
    const [userId, setUserId] = useState("user123");

    // State
    const [output, setOutput] = useState<ProactiveSurveyResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        if (!lastPurchase || !lastSurveyDate || !recentActivity || !userId) {
            setError("All fields are required");
            return;
        }

        setIsLoading(true);
        setOutput(null);
        setError(null);

        try {
            const response = await fetch('https://proactive-survey-agent.vercel.app/analyze', {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    last_purchase: lastPurchase,
                    last_survey_date: lastSurveyDate,
                    recent_activity: recentActivity,
                    user_id: userId
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
        setLastPurchase("");
        setLastSurveyDate("");
        setRecentActivity("");
        setUserId("");
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
                    This form sends data to the Proactive Survey Agent API at{" "}
                    <code className="text-xs bg-muted px-1 py-0.5 rounded">proactive-survey-agent.vercel.app</code>
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
                            Survey Trigger Analysis
                        </CardTitle>
                        <CardDescription>Analyze user behavior to trigger proactive surveys</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6 flex-1">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="user-id" className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    User ID
                                </Label>
                                <Input
                                    id="user-id"
                                    placeholder="e.g. user123"
                                    value={userId}
                                    onChange={(e) => setUserId(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="last-purchase" className="flex items-center gap-2">
                                    <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                                    Last Purchase
                                </Label>
                                <Input
                                    id="last-purchase"
                                    placeholder="e.g. Wireless Earbuds"
                                    value={lastPurchase}
                                    onChange={(e) => setLastPurchase(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="last-survey-date" className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    Last Survey Date
                                </Label>
                                <Input
                                    id="last-survey-date"
                                    type="date"
                                    value={lastSurveyDate}
                                    onChange={(e) => setLastSurveyDate(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="recent-activity" className="flex items-center gap-2">
                                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                                    Recent Activity
                                </Label>
                                <Textarea
                                    id="recent-activity"
                                    placeholder="e.g. Support chat with negative sentiment"
                                    value={recentActivity}
                                    onChange={(e) => setRecentActivity(e.target.value)}
                                    className="min-h-[100px] resize-none"
                                />
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
                                        Analyze & Generate
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
                        <CardDescription>AI-generated survey strategy</CardDescription>
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
                                    <p className="text-sm font-medium">Analyzing user behavior...</p>
                                </div>
                            </div>
                        ) : output ? (
                            <div className="space-y-6">
                                {/* Status Badge */}
                                <div className="flex items-center justify-between">
                                    <div className="flex gap-2">
                                        <Badge variant={output.survey_trigger ? "default" : "secondary"} className={output.survey_trigger ? "bg-green-500 hover:bg-green-600" : ""}>
                                            {output.survey_trigger ? "Trigger Survey" : "Do Not Survey"}
                                        </Badge>
                                        <Badge variant="outline" className="capitalize border-primary/20 text-primary">
                                            {output.priority} Priority
                                        </Badge>
                                    </div>
                                    <span className="text-xs text-muted-foreground">
                                        {new Date(output.timestamp).toLocaleTimeString()}
                                    </span>
                                </div>

                                {/* Reason */}
                                <div className="bg-card/50 border border-border/50 rounded-xl p-4 shadow-sm">
                                    <Label className="text-xs font-semibold uppercase text-muted-foreground mb-2 block">Reasoning</Label>
                                    <p className="text-sm">{output.reason}</p>
                                </div>

                                {/* Survey Details */}
                                {output.survey_trigger && (
                                    <>
                                        <div className="space-y-2">
                                            <Label className="text-xs font-semibold uppercase text-muted-foreground">Survey Type</Label>
                                            <div className="flex items-center gap-2 p-2 bg-muted/30 rounded border border-border/30">
                                                <ClipboardList className="h-4 w-4 text-primary" />
                                                <span className="text-sm font-medium">{output.survey_type}</span>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <Label className="text-xs font-semibold uppercase text-muted-foreground">Generated Questions</Label>
                                            <div className="space-y-2">
                                                {output.questions.map((question, i) => (
                                                    <div key={i} className="flex gap-3 p-3 bg-card/80 border border-border/50 rounded-lg shadow-sm">
                                                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                                                            {i + 1}
                                                        </div>
                                                        <p className="text-sm">{question}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
                                <div className="text-center space-y-3">
                                    <div className="flex justify-center">
                                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/10 to-purple-500/10 flex items-center justify-center">
                                            <Sparkles className="h-6 w-6 text-primary/50" />
                                        </div>
                                    </div>
                                    <p>Run the analysis to see survey recommendations</p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
