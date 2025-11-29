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
    Target,
    MapPin,
    Briefcase,
    Mail,
    MousePointer,
    Download,
    Clock,
    User
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface LeadScoringResponse {
    lead_id: string;
    conversion_score: number;
    risk_category: string;
    timestamp: string;
    model_version: string;
}

export function LeadScoringForm() {
    // Form fields
    const [leadId, setLeadId] = useState("LEAD-12345");
    const [age, setAge] = useState("35");
    const [location, setLocation] = useState("New York");
    const [industry, setIndustry] = useState("Technology");
    const [emailOpens, setEmailOpens] = useState("15");
    const [websiteVisits, setWebsiteVisits] = useState("10");
    const [contentDownloads, setContentDownloads] = useState("5");
    const [daysSinceContact, setDaysSinceContact] = useState("7");
    const [leadSource, setLeadSource] = useState("Webinar");

    // State
    const [output, setOutput] = useState<LeadScoringResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        if (!leadId) {
            setError("Lead ID is required");
            return;
        }

        setIsLoading(true);
        setOutput(null);
        setError(null);

        try {
            const response = await fetch('https://lead-scoring-agent-production.up.railway.app/score', {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    lead_id: leadId,
                    age: parseInt(age) || 0,
                    location,
                    industry,
                    email_opens: parseInt(emailOpens) || 0,
                    website_visits: parseInt(websiteVisits) || 0,
                    content_downloads: parseInt(contentDownloads) || 0,
                    days_since_contact: parseInt(daysSinceContact) || 0,
                    lead_source: leadSource,
                    actual_outcome: null
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
        setLeadId("");
        setAge("");
        setLocation("");
        setIndustry("");
        setEmailOpens("0");
        setWebsiteVisits("0");
        setContentDownloads("0");
        setDaysSinceContact("0");
        setLeadSource("");
        setOutput(null);
        setError(null);
    };

    const getScoreColor = (score: number) => {
        if (score >= 0.7) return "text-green-500";
        if (score >= 0.4) return "text-yellow-500";
        return "text-red-500";
    };

    const getRiskBadgeVariant = (risk: string) => {
        switch (risk.toLowerCase()) {
            case 'low': return 'default'; // Greenish usually, or we can style manually
            case 'medium': return 'secondary';
            case 'high': return 'destructive';
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
                    This form sends data to the Lead Scoring Agent API at{" "}
                    <code className="text-xs bg-muted px-1 py-0.5 rounded">lead-scoring-agent-production.up.railway.app</code>
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
                            Lead Scoring Input
                        </CardTitle>
                        <CardDescription>Evaluate lead potential and conversion risk</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6 flex-1 overflow-y-auto max-h-[calc(100vh-20rem)]">
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="lead-id" className="flex items-center gap-2">
                                        <Target className="h-4 w-4 text-muted-foreground" />
                                        Lead ID
                                    </Label>
                                    <Input
                                        id="lead-id"
                                        value={leadId}
                                        onChange={(e) => setLeadId(e.target.value)}
                                        placeholder="LEAD-12345"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lead-source" className="flex items-center gap-2">
                                        <Target className="h-4 w-4 text-muted-foreground" />
                                        Source
                                    </Label>
                                    <Select value={leadSource} onValueChange={setLeadSource}>
                                        <SelectTrigger id="lead-source">
                                            <SelectValue placeholder="Select source" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Webinar">Webinar</SelectItem>
                                            <SelectItem value="Website">Website</SelectItem>
                                            <SelectItem value="Referral">Referral</SelectItem>
                                            <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                                            <SelectItem value="Cold Call">Cold Call</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="age" className="flex items-center gap-2">
                                        <User className="h-4 w-4 text-muted-foreground" />
                                        Age
                                    </Label>
                                    <Input
                                        id="age"
                                        type="number"
                                        value={age}
                                        onChange={(e) => setAge(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="location" className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                        Location
                                    </Label>
                                    <Input
                                        id="location"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="industry" className="flex items-center gap-2">
                                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                                    Industry
                                </Label>
                                <Input
                                    id="industry"
                                    value={industry}
                                    onChange={(e) => setIndustry(e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email-opens" className="flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                        Email Opens
                                    </Label>
                                    <Input
                                        id="email-opens"
                                        type="number"
                                        value={emailOpens}
                                        onChange={(e) => setEmailOpens(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="website-visits" className="flex items-center gap-2">
                                        <MousePointer className="h-4 w-4 text-muted-foreground" />
                                        Website Visits
                                    </Label>
                                    <Input
                                        id="website-visits"
                                        type="number"
                                        value={websiteVisits}
                                        onChange={(e) => setWebsiteVisits(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="content-downloads" className="flex items-center gap-2">
                                        <Download className="h-4 w-4 text-muted-foreground" />
                                        Downloads
                                    </Label>
                                    <Input
                                        id="content-downloads"
                                        type="number"
                                        value={contentDownloads}
                                        onChange={(e) => setContentDownloads(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="days-since-contact" className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                        Days Since Contact
                                    </Label>
                                    <Input
                                        id="days-since-contact"
                                        type="number"
                                        value={daysSinceContact}
                                        onChange={(e) => setDaysSinceContact(e.target.value)}
                                    />
                                </div>
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
                                        Scoring...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="mr-2 h-4 w-4" />
                                        Calculate Score
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
                            Scoring Results
                        </CardTitle>
                        <CardDescription>AI-generated lead qualification</CardDescription>
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
                                    <p className="text-sm font-medium">Calculating conversion probability...</p>
                                </div>
                            </div>
                        ) : output ? (
                            <div className="space-y-8">
                                {/* Score Display */}
                                <div className="flex flex-col items-center justify-center py-6">
                                    <div className="relative h-40 w-40 flex items-center justify-center">
                                        {/* Circular Progress Background */}
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
                                                className={getScoreColor(output.conversion_score)}
                                                strokeWidth="8"
                                                strokeDasharray={251.2}
                                                strokeDashoffset={251.2 * (1 - output.conversion_score)}
                                                strokeLinecap="round"
                                                stroke="currentColor"
                                                fill="transparent"
                                                r="40"
                                                cx="50"
                                                cy="50"
                                            />
                                        </svg>
                                        <div className="absolute flex flex-col items-center">
                                            <span className={`text-4xl font-bold ${getScoreColor(output.conversion_score)}`}>
                                                {(output.conversion_score * 100).toFixed(0)}%
                                            </span>
                                            <span className="text-xs text-muted-foreground uppercase tracking-wider">Probability</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Risk Category */}
                                <div className="bg-card/50 border border-border/50 rounded-xl p-6 shadow-sm flex flex-col items-center justify-center gap-3">
                                    <span className="text-sm font-semibold uppercase text-muted-foreground">Risk Category</span>
                                    <Badge variant={getRiskBadgeVariant(output.risk_category) as any} className="text-lg px-6 py-1.5 capitalize">
                                        {output.risk_category} Risk
                                    </Badge>
                                    <p className="text-xs text-muted-foreground text-center max-w-[200px]">
                                        Based on engagement metrics and demographic data.
                                    </p>
                                </div>

                                {/* Footer Info */}
                                <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-4 border-t border-border/30">
                                    <div className="flex gap-2">
                                        <span>ID: {output.lead_id}</span>
                                        <span>•</span>
                                        <span>Model v{output.model_version}</span>
                                    </div>
                                    <span>{new Date(output.timestamp).toLocaleString()}</span>
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
                                    <p>Enter lead details to generate a score</p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
