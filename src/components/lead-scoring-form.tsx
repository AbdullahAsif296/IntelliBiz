"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
    User,
    RefreshCw,
    Info,
    TrendingUp,
    Activity,
    Brain
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface LeadScoringResponse {
    lead_id: string;
    conversion_score: number;
    risk_category: string;
    timestamp: string;
    model_version: string;
    error?: string;
    message?: string;
}

interface HealthResponse {
    status: string;
    database_connected: boolean;
    model_available: boolean;
    uptime_seconds: number;
    timestamp: string;
    error?: string;
}

interface InfoResponse {
    model_version: string;
    model_metrics: {
        auc_score: number;
        precision_top20: number;
        recall_top20: number;
    };
    total_leads_scored: number;
    feedback_samples_collected: number;
    last_training_timestamp: string;
    features_used: string[];
    system_status: string;
    retraining_status: {
        is_retraining: boolean;
        feedback_count: number;
        retraining_threshold: number;
        ready_for_retraining: boolean;
        last_check_time: string;
        last_retrain_time: string;
    };
    error?: string;
}

interface RetrainResponse {
    status: string;
    old_version?: string;
    new_version?: string;
    old_auc?: number;
    new_auc?: number;
    improvement?: number;
    feedback_count?: number;
    timestamp?: string;
    message?: string;
    error?: string;
    details?: string[];
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
    const [actualOutcome, setActualOutcome] = useState<boolean | null>(null);
    const [provideFeedback, setProvideFeedback] = useState(false);

    // State
    const [output, setOutput] = useState<LeadScoringResponse | null>(null);
    const [healthStatus, setHealthStatus] = useState<HealthResponse | null>(null);
    const [systemInfo, setSystemInfo] = useState<InfoResponse | null>(null);
    const [retrainResult, setRetrainResult] = useState<RetrainResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState("score");

    const handleScoreLead = async () => {
        if (!leadId.trim()) {
            setError("Lead ID is required");
            return;
        }

        setIsLoading(true);
        setOutput(null);
        setError(null);

        try {
            const response = await fetch('/api/proxy/lead-scoring', {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    endpoint: 'score',
                    lead_id: leadId,
                    age: parseInt(age) || 0,
                    location,
                    industry,
                    email_opens: parseInt(emailOpens) || 0,
                    website_visits: parseInt(websiteVisits) || 0,
                    content_downloads: parseInt(contentDownloads) || 0,
                    days_since_contact: parseInt(daysSinceContact) || 0,
                    lead_source: leadSource,
                    actual_outcome: provideFeedback ? actualOutcome : null
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || errorData.message || `API error: ${response.status}`);
            }

            const data = await response.json();
            setOutput(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    const handleHealthCheck = async () => {
        setIsLoading(true);
        setError(null);
        setHealthStatus(null);

        try {
            const response = await fetch('/api/proxy/lead-scoring?endpoint=health', {
                method: 'GET',
                headers: {
                    'accept': 'application/json',
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || errorData.message || `API error: ${response.status}`);
            }

            const data = await response.json();
            setHealthStatus(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGetInfo = async () => {
        setIsLoading(true);
        setError(null);
        setSystemInfo(null);

        try {
            const response = await fetch('/api/proxy/lead-scoring?endpoint=info', {
                method: 'GET',
                headers: {
                    'accept': 'application/json',
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || errorData.message || `API error: ${response.status}`);
            }

            const data = await response.json();
            setSystemInfo(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    const handleRetrain = async () => {
        setIsLoading(true);
        setError(null);
        setRetrainResult(null);

        try {
            const response = await fetch('/api/proxy/lead-scoring', {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    endpoint: 'retrain'
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || errorData.message || `API error: ${response.status}`);
            }

            const data = await response.json();
            setRetrainResult(data);
            // Refresh info after retraining
            setTimeout(() => handleGetInfo(), 1000);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    const clearForm = () => {
        setLeadId("LEAD-12345");
        setAge("35");
        setLocation("New York");
        setIndustry("Technology");
        setEmailOpens("15");
        setWebsiteVisits("10");
        setContentDownloads("5");
        setDaysSinceContact("7");
        setLeadSource("Webinar");
        setActualOutcome(null);
        setProvideFeedback(false);
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
            case 'high': return 'default';
            case 'medium': return 'secondary';
            case 'low': return 'outline';
            default: return 'outline';
        }
    };

    const formatUptime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        if (hours > 0) return `${hours}h ${minutes}m`;
        if (minutes > 0) return `${minutes}m ${secs}s`;
        return `${secs}s`;
    };

    return (
        <div className="space-y-6">
            {/* API Status Indicator */}
            <Alert className="border-primary/20 bg-gradient-to-r from-primary/5 to-purple-500/5">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <AlertTitle className="text-sm font-semibold">Live API Integration</AlertTitle>
                <AlertDescription className="text-xs text-muted-foreground">
                    This form connects to the Lead Scoring Agent API via a secure proxy. Features: Real-time scoring, adaptive learning, model retraining.
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

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="score">Score Lead</TabsTrigger>
                    <TabsTrigger value="health">Health Check</TabsTrigger>
                    <TabsTrigger value="info">System Info</TabsTrigger>
                    <TabsTrigger value="retrain">Retrain Model</TabsTrigger>
                </TabsList>

                {/* Score Lead Tab */}
                <TabsContent value="score" className="space-y-6">
                    <div className="grid gap-6 lg:grid-cols-2">
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
                                                Lead ID *
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
                                                Source *
                                            </Label>
                                            <Select value={leadSource} onValueChange={setLeadSource}>
                                                <SelectTrigger id="lead-source">
                                                    <SelectValue placeholder="Select source" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Webinar">Webinar</SelectItem>
                                                    <SelectItem value="Cold Call">Cold Call</SelectItem>
                                                    <SelectItem value="Referral">Referral</SelectItem>
                                                    <SelectItem value="Advertisement">Advertisement</SelectItem>
                                                    <SelectItem value="Organic">Organic</SelectItem>
                                                    <SelectItem value="Trade Show">Trade Show</SelectItem>
                                                    <SelectItem value="Email Campaign">Email Campaign</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="age" className="flex items-center gap-2">
                                                <User className="h-4 w-4 text-muted-foreground" />
                                                Age (18-100) *
                                            </Label>
                                            <Input
                                                id="age"
                                                type="number"
                                                min="18"
                                                max="100"
                                                value={age}
                                                onChange={(e) => setAge(e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="location" className="flex items-center gap-2">
                                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                                Location *
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
                                            Industry *
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
                                                Email Opens (0-100) *
                                            </Label>
                                            <Input
                                                id="email-opens"
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={emailOpens}
                                                onChange={(e) => setEmailOpens(e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="website-visits" className="flex items-center gap-2">
                                                <MousePointer className="h-4 w-4 text-muted-foreground" />
                                                Website Visits (0-100) *
                                            </Label>
                                            <Input
                                                id="website-visits"
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={websiteVisits}
                                                onChange={(e) => setWebsiteVisits(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="content-downloads" className="flex items-center gap-2">
                                                <Download className="h-4 w-4 text-muted-foreground" />
                                                Downloads (0-50) *
                                            </Label>
                                            <Input
                                                id="content-downloads"
                                                type="number"
                                                min="0"
                                                max="50"
                                                value={contentDownloads}
                                                onChange={(e) => setContentDownloads(e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="days-since-contact" className="flex items-center gap-2">
                                                <Clock className="h-4 w-4 text-muted-foreground" />
                                                Days Since Contact (0-365) *
                                            </Label>
                                            <Input
                                                id="days-since-contact"
                                                type="number"
                                                min="0"
                                                max="365"
                                                value={daysSinceContact}
                                                onChange={(e) => setDaysSinceContact(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    {/* Feedback Section */}
                                    <div className="space-y-3 pt-2 border-t border-border/50">
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="provide-feedback"
                                                checked={provideFeedback}
                                                onCheckedChange={(checked) => setProvideFeedback(checked as boolean)}
                                            />
                                            <Label htmlFor="provide-feedback" className="text-sm font-medium cursor-pointer">
                                                Provide feedback (actual outcome) for adaptive learning
                                            </Label>
                                        </div>
                                        {provideFeedback && (
                                            <div className="space-y-2 pl-6">
                                                <Label>Actual Outcome</Label>
                                                <div className="flex gap-2">
                                                    <Button
                                                        type="button"
                                                        variant={actualOutcome === true ? "default" : "outline"}
                                                        size="sm"
                                                        onClick={() => setActualOutcome(true)}
                                                    >
                                                        Converted
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant={actualOutcome === false ? "default" : "outline"}
                                                        size="sm"
                                                        onClick={() => setActualOutcome(false)}
                                                    >
                                                        Lost
                                                    </Button>
                                                </div>
                                                <p className="text-xs text-muted-foreground">
                                                    Providing feedback helps the model learn and improve accuracy
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2 pt-4 mt-auto border-t border-border/50">
                                    <Button
                                        onClick={handleScoreLead}
                                        disabled={isLoading || !leadId.trim()}
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
                                    output.error ? (
                                        <Alert className="border-destructive/50 bg-destructive/5">
                                            <AlertTriangle className="h-4 w-4 text-destructive" />
                                            <AlertDescription className="text-xs text-destructive/80">
                                                {output.error || output.message || "An error occurred"}
                                            </AlertDescription>
                                        </Alert>
                                    ) : (
                                        <div className="space-y-8">
                                            {/* Score Display */}
                                            <div className="flex flex-col items-center justify-center py-6">
                                                <div className="relative h-40 w-40 flex items-center justify-center">
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
                                    )
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
                </TabsContent>

                {/* Health Check Tab */}
                <TabsContent value="health" className="space-y-6">
                    <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-lg">
                        <CardHeader className="border-b border-border/50 bg-gradient-to-r from-card to-card/80">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-3">
                                        <div className="h-8 w-1 rounded-full bg-gradient-to-b from-primary via-purple-500 to-blue-500"></div>
                                        Agent Health Status
                                    </CardTitle>
                                    <CardDescription>Check system availability and operational status</CardDescription>
                                </div>
                                <Button
                                    onClick={handleHealthCheck}
                                    disabled={isLoading}
                                    variant="outline"
                                    size="sm"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Checking...
                                        </>
                                    ) : (
                                        <>
                                            <RefreshCw className="mr-2 h-4 w-4" />
                                            Check Health
                                        </>
                                    )}
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            {isLoading ? (
                                <div className="flex items-center justify-center py-12 text-muted-foreground">
                                    <div className="flex flex-col items-center gap-4">
                                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                        <p className="text-sm font-medium">Checking health status...</p>
                                    </div>
                                </div>
                            ) : healthStatus ? (
                                healthStatus.error ? (
                                    <Alert className="border-destructive/50 bg-destructive/5">
                                        <AlertTriangle className="h-4 w-4 text-destructive" />
                                        <AlertDescription className="text-xs text-destructive/80">
                                            {healthStatus.error}
                                        </AlertDescription>
                                    </Alert>
                                ) : (
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-card/50 border border-border/50 rounded-xl p-4 shadow-sm">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-sm font-semibold">Status</span>
                                                    <Badge variant={healthStatus.status === 'healthy' ? 'default' : 'destructive'}>
                                                        {healthStatus.status}
                                                    </Badge>
                                                </div>
                                            </div>
                                            <div className="bg-card/50 border border-border/50 rounded-xl p-4 shadow-sm">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-sm font-semibold">Uptime</span>
                                                    <span className="text-lg font-bold text-primary">
                                                        {formatUptime(healthStatus.uptime_seconds)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-card/50 border border-border/50 rounded-xl p-4 shadow-sm text-center">
                                                <div className="flex items-center justify-center gap-2 mb-2">
                                                    <Activity className="h-4 w-4 text-primary" />
                                                    <span className="text-sm font-semibold">Database</span>
                                                </div>
                                                <Badge variant={healthStatus.database_connected ? 'default' : 'destructive'}>
                                                    {healthStatus.database_connected ? 'Connected' : 'Disconnected'}
                                                </Badge>
                                            </div>
                                            <div className="bg-card/50 border border-border/50 rounded-xl p-4 shadow-sm text-center">
                                                <div className="flex items-center justify-center gap-2 mb-2">
                                                    <Brain className="h-4 w-4 text-primary" />
                                                    <span className="text-sm font-semibold">Model</span>
                                                </div>
                                                <Badge variant={healthStatus.model_available ? 'default' : 'destructive'}>
                                                    {healthStatus.model_available ? 'Available' : 'Unavailable'}
                                                </Badge>
                                            </div>
                                        </div>
                                        <div className="text-xs text-muted-foreground text-center pt-2 border-t border-border/50">
                                            Last checked: {new Date(healthStatus.timestamp).toLocaleString()}
                                        </div>
                                    </div>
                                )
                            ) : (
                                <div className="flex items-center justify-center py-12 text-muted-foreground text-sm">
                                    <div className="text-center space-y-3">
                                        <div className="flex justify-center">
                                            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/10 to-purple-500/10 flex items-center justify-center">
                                                <Activity className="h-6 w-6 text-primary/50" />
                                            </div>
                                        </div>
                                        <p>Click "Check Health" to verify agent status</p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* System Info Tab */}
                <TabsContent value="info" className="space-y-6">
                    <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-lg">
                        <CardHeader className="border-b border-border/50 bg-gradient-to-r from-card to-card/80">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-3">
                                        <div className="h-8 w-1 rounded-full bg-gradient-to-b from-primary via-purple-500 to-blue-500"></div>
                                        System Information
                                    </CardTitle>
                                    <CardDescription>Model metrics, feedback status, and retraining information</CardDescription>
                                </div>
                                <Button
                                    onClick={handleGetInfo}
                                    disabled={isLoading}
                                    variant="outline"
                                    size="sm"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Loading...
                                        </>
                                    ) : (
                                        <>
                                            <RefreshCw className="mr-2 h-4 w-4" />
                                            Refresh
                                        </>
                                    )}
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            {isLoading ? (
                                <div className="flex items-center justify-center py-12 text-muted-foreground">
                                    <div className="flex flex-col items-center gap-4">
                                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                        <p className="text-sm font-medium">Loading system information...</p>
                                    </div>
                                </div>
                            ) : systemInfo ? (
                                systemInfo.error ? (
                                    <Alert className="border-destructive/50 bg-destructive/5">
                                        <AlertTriangle className="h-4 w-4 text-destructive" />
                                        <AlertDescription className="text-xs text-destructive/80">
                                            {systemInfo.error}
                                        </AlertDescription>
                                    </Alert>
                                ) : (
                                    <div className="space-y-6">
                                        {/* Model Metrics */}
                                        <div className="bg-card/50 border border-border/50 rounded-xl p-6 shadow-sm">
                                            <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
                                                <Brain className="h-4 w-4 text-primary" />
                                                Model Metrics
                                            </h3>
                                            <div className="grid grid-cols-3 gap-4">
                                                <div className="text-center">
                                                    <p className="text-xs text-muted-foreground mb-1">AUC Score</p>
                                                    <p className="text-2xl font-bold text-primary">
                                                        {systemInfo.model_metrics.auc_score.toFixed(4)}
                                                    </p>
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-xs text-muted-foreground mb-1">Precision (Top 20%)</p>
                                                    <p className="text-2xl font-bold text-primary">
                                                        {systemInfo.model_metrics.precision_top20.toFixed(2)}
                                                    </p>
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-xs text-muted-foreground mb-1">Recall (Top 20%)</p>
                                                    <p className="text-2xl font-bold text-primary">
                                                        {systemInfo.model_metrics.recall_top20.toFixed(2)}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="mt-4 pt-4 border-t border-border/50">
                                                <p className="text-xs text-muted-foreground">
                                                    Model Version: <span className="font-medium">{systemInfo.model_version}</span>
                                                </p>
                                            </div>
                                        </div>

                                        {/* Statistics */}
                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="bg-card/50 border border-border/50 rounded-xl p-4 shadow-sm text-center">
                                                <p className="text-2xl font-bold text-primary">{systemInfo.total_leads_scored}</p>
                                                <p className="text-xs text-muted-foreground mt-1">Total Leads Scored</p>
                                            </div>
                                            <div className="bg-card/50 border border-border/50 rounded-xl p-4 shadow-sm text-center">
                                                <p className="text-2xl font-bold text-primary">{systemInfo.feedback_samples_collected}</p>
                                                <p className="text-xs text-muted-foreground mt-1">Feedback Samples</p>
                                            </div>
                                            <div className="bg-card/50 border border-border/50 rounded-xl p-4 shadow-sm text-center">
                                                <p className="text-xs text-muted-foreground mb-1">System Status</p>
                                                <Badge variant={systemInfo.system_status === 'operational' ? 'default' : 'secondary'}>
                                                    {systemInfo.system_status}
                                                </Badge>
                                            </div>
                                        </div>

                                        {/* Retraining Status */}
                                        <div className="bg-card/50 border border-border/50 rounded-xl p-6 shadow-sm">
                                            <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
                                                <TrendingUp className="h-4 w-4 text-primary" />
                                                Retraining Status
                                            </h3>
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-muted-foreground">Ready for Retraining</span>
                                                    <Badge variant={systemInfo.retraining_status.ready_for_retraining ? 'default' : 'secondary'}>
                                                        {systemInfo.retraining_status.ready_for_retraining ? 'Yes' : 'No'}
                                                    </Badge>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-muted-foreground">Currently Retraining</span>
                                                    <Badge variant={systemInfo.retraining_status.is_retraining ? 'default' : 'outline'}>
                                                        {systemInfo.retraining_status.is_retraining ? 'Yes' : 'No'}
                                                    </Badge>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-muted-foreground">Feedback Count</span>
                                                    <span className="text-sm font-medium">
                                                        {systemInfo.retraining_status.feedback_count} / {systemInfo.retraining_status.retraining_threshold}
                                                    </span>
                                                </div>
                                                {systemInfo.retraining_status.last_retrain_time && (
                                                    <div className="pt-2 border-t border-border/50">
                                                        <p className="text-xs text-muted-foreground">
                                                            Last Retrain: {new Date(systemInfo.retraining_status.last_retrain_time).toLocaleString()}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Features Used */}
                                        <div className="bg-card/50 border border-border/50 rounded-xl p-4 shadow-sm">
                                            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                                                <Info className="h-4 w-4 text-primary" />
                                                Features Used
                                            </h3>
                                            <div className="flex flex-wrap gap-2">
                                                {systemInfo.features_used.map((feature, i) => (
                                                    <Badge key={i} variant="outline" className="text-xs">
                                                        {feature}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )
                            ) : (
                                <div className="flex items-center justify-center py-12 text-muted-foreground text-sm">
                                    <div className="text-center space-y-3">
                                        <div className="flex justify-center">
                                            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/10 to-purple-500/10 flex items-center justify-center">
                                                <Info className="h-6 w-6 text-primary/50" />
                                            </div>
                                        </div>
                                        <p>Click "Refresh" to load system information</p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Retrain Model Tab */}
                <TabsContent value="retrain" className="space-y-6">
                    <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-lg">
                        <CardHeader className="border-b border-border/50 bg-gradient-to-r from-card to-card/80">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-3">
                                        <div className="h-8 w-1 rounded-full bg-gradient-to-b from-primary via-purple-500 to-blue-500"></div>
                                        Manual Model Retraining
                                    </CardTitle>
                                    <CardDescription>Trigger model retraining if sufficient feedback is available (requires 50+ samples)</CardDescription>
                                </div>
                                <Button
                                    onClick={handleRetrain}
                                    disabled={isLoading}
                                    className="bg-gradient-to-r from-primary via-purple-500 to-blue-500 hover:from-primary/90 hover:via-purple-500/90 hover:to-blue-500/90 text-white"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Retraining...
                                        </>
                                    ) : (
                                        <>
                                            <Brain className="mr-2 h-4 w-4" />
                                            Retrain Model
                                        </>
                                    )}
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            {isLoading ? (
                                <div className="flex items-center justify-center py-12 text-muted-foreground">
                                    <div className="flex flex-col items-center gap-4">
                                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                        <p className="text-sm font-medium">Retraining model... This may take 2-3 minutes.</p>
                                    </div>
                                </div>
                            ) : retrainResult ? (
                                retrainResult.error ? (
                                    <Alert className="border-destructive/50 bg-destructive/5">
                                        <AlertTriangle className="h-4 w-4 text-destructive" />
                                        <AlertTitle className="text-sm font-semibold text-destructive">Retraining Failed</AlertTitle>
                                        <AlertDescription className="text-xs text-destructive/80">
                                            {retrainResult.error}
                                            {retrainResult.details && (
                                                <ul className="mt-2 list-disc list-inside">
                                                    {retrainResult.details.map((detail, i) => (
                                                        <li key={i}>{detail}</li>
                                                    ))}
                                                </ul>
                                            )}
                                        </AlertDescription>
                                    </Alert>
                                ) : retrainResult.status === 'success' ? (
                                    <div className="space-y-6">
                                        <Alert className="border-green-500/50 bg-green-500/5">
                                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                                            <AlertTitle className="text-sm font-semibold text-green-500">Retraining Successful</AlertTitle>
                                            <AlertDescription className="text-xs text-green-500/80">
                                                {retrainResult.message}
                                            </AlertDescription>
                                        </Alert>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-card/50 border border-border/50 rounded-xl p-4 shadow-sm">
                                                <p className="text-xs text-muted-foreground mb-1">Version Upgrade</p>
                                                <p className="text-lg font-bold text-primary">
                                                    v{retrainResult.old_version} → v{retrainResult.new_version}
                                                </p>
                                            </div>
                                            <div className="bg-card/50 border border-border/50 rounded-xl p-4 shadow-sm">
                                                <p className="text-xs text-muted-foreground mb-1">AUC Improvement</p>
                                                <p className="text-lg font-bold text-green-500">
                                                    +{retrainResult.improvement?.toFixed(4)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-card/50 border border-border/50 rounded-xl p-4 shadow-sm">
                                                <p className="text-xs text-muted-foreground mb-1">Old AUC</p>
                                                <p className="text-lg font-bold">{retrainResult.old_auc?.toFixed(4)}</p>
                                            </div>
                                            <div className="bg-card/50 border border-border/50 rounded-xl p-4 shadow-sm">
                                                <p className="text-xs text-muted-foreground mb-1">New AUC</p>
                                                <p className="text-lg font-bold text-primary">{retrainResult.new_auc?.toFixed(4)}</p>
                                            </div>
                                        </div>
                                        <div className="text-xs text-muted-foreground text-center pt-2 border-t border-border/50">
                                            Retrained at: {retrainResult.timestamp && new Date(retrainResult.timestamp).toLocaleString()}
                                        </div>
                                    </div>
                                ) : (
                                    <Alert className="border-yellow-500/50 bg-yellow-500/5">
                                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                                        <AlertTitle className="text-sm font-semibold text-yellow-500">No Improvement</AlertTitle>
                                        <AlertDescription className="text-xs text-yellow-500/80">
                                            {retrainResult.message}
                                        </AlertDescription>
                                    </Alert>
                                )
                            ) : (
                                <div className="flex items-center justify-center py-12 text-muted-foreground text-sm">
                                    <div className="text-center space-y-3">
                                        <div className="flex justify-center">
                                            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/10 to-purple-500/10 flex items-center justify-center">
                                                <Brain className="h-6 w-6 text-primary/50" />
                                            </div>
                                        </div>
                                        <p>Click "Retrain Model" to trigger manual retraining</p>
                                        <p className="text-xs text-muted-foreground">Requires 50+ feedback samples</p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
