"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Loader2,
    Sparkles,
    AlertTriangle,
    CheckCircle2,
    FileText,
    BarChart3,
    Presentation,
    Download,
    Target,
    Layers,
    Lightbulb
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ContentGapResponse {
    status: string;
    message?: string;
    // Assuming structure based on description, actual response structure might vary
    // We will fetch /package after run to get full data
}

interface AnalysisPackage {
    recommendations: Array<{
        topic: string;
        priority: string;
        reason: string;
    }>;
    gaps: Array<{
        topic: string;
        current_coverage: string;
        competitor_coverage: string;
    }>;
    metrics: {
        precision: number;
        recall: number;
        f1_score: number;
    };
    stats: {
        total_documents: number;
        analyzed_topics: number;
    };
}

const DEFAULT_DELIVERABLES = [
    "Prioritized list of actionable content recommendations",
    "AI-generated Content Gap Analysis Report",
    "Visual dashboards and performance charts",
    "Model evaluation metrics (precision, recall, F1-score)",
    "Stakeholder presentation and final report"
];

const DEFAULT_FORMATS = [
    "PDF Report",
    "Dashboard Visualization",
    "Presentation Slides"
];

export function ContentGapForm() {
    // Form fields
    const [accuracy, setAccuracy] = useState(">= 80%");
    const [minRecommendations, setMinRecommendations] = useState("10");
    const [selectedDeliverables, setSelectedDeliverables] = useState<string[]>(DEFAULT_DELIVERABLES);
    const [selectedFormats, setSelectedFormats] = useState<string[]>(DEFAULT_FORMATS);

    // State
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [analysisData, setAnalysisData] = useState<any | null>(null); // Flexible type for now
    const [runStatus, setRunStatus] = useState<string | null>(null);

    const API_BASE_URL = "https://busked-schematically-amiyah.ngrok-free.dev";

    const handleDeliverableToggle = (item: string) => {
        setSelectedDeliverables(prev =>
            prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
        );
    };

    const handleFormatToggle = (item: string) => {
        setSelectedFormats(prev =>
            prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
        );
    };

    const handleRunAnalysis = async () => {
        setIsLoading(true);
        setError(null);
        setAnalysisData(null);
        setRunStatus("Initializing analysis...");

        try {
            // 1. Trigger Analysis
            const runResponse = await fetch(`${API_BASE_URL}/run`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true'
                },
                body: JSON.stringify({
                    deliverables: selectedDeliverables,
                    expected_accuracy: accuracy,
                    recommendation_count_min: parseInt(minRecommendations),
                    report_format: selectedFormats
                })
            });

            if (!runResponse.ok) {
                throw new Error(`Analysis trigger failed: ${runResponse.status}`);
            }

            setRunStatus("Fetching results...");

            // 2. Fetch Results (Package)
            // We'll try to fetch the package immediately. In a real scenario, we might need to poll.
            // Assuming the POST /run is synchronous or fast enough for this demo.
            // If not, we might need to fetch separate endpoints.

            // Let's fetch recommendations and gaps separately to be safe/modular
            const [recsRes, gapsRes, metricsRes] = await Promise.all([
                fetch(`${API_BASE_URL}/recommendations`, { headers: { 'ngrok-skip-browser-warning': 'true' } }),
                fetch(`${API_BASE_URL}/gaps`, { headers: { 'ngrok-skip-browser-warning': 'true' } }),
                fetch(`${API_BASE_URL}/metrics`, { headers: { 'ngrok-skip-browser-warning': 'true' } })
            ]);

            if (recsRes.ok && gapsRes.ok) {
                const recommendations = await recsRes.json();
                const gaps = await gapsRes.json();
                const metrics = metricsRes.ok ? await metricsRes.json() : null;

                setAnalysisData({
                    recommendations,
                    gaps,
                    metrics
                });
                setRunStatus("Complete");
            } else {
                // Fallback to package if individual endpoints fail or if that's the preferred way
                const packageRes = await fetch(`${API_BASE_URL}/package`, { headers: { 'ngrok-skip-browser-warning': 'true' } });
                if (packageRes.ok) {
                    const pkg = await packageRes.json();
                    setAnalysisData(pkg);
                    setRunStatus("Complete");
                } else {
                    throw new Error("Failed to retrieve analysis results");
                }
            }

        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
            setRunStatus("Failed");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownload = (type: 'pdf' | 'pptx' | 'package') => {
        window.open(`${API_BASE_URL}/download/${type}`, '_blank');
    };

    return (
        <div className="space-y-6">
            {/* API Status Indicator */}
            <Alert className="border-primary/20 bg-gradient-to-r from-primary/5 to-purple-500/5">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <AlertTitle className="text-sm font-semibold">Live API Integration</AlertTitle>
                <AlertDescription className="text-xs text-muted-foreground">
                    This form connects to the Content Gap Analysis Agent at{" "}
                    <code className="text-xs bg-muted px-1 py-0.5 rounded">busked-schematically-amiyah.ngrok-free.dev</code>
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
                {/* Configuration Form */}
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-lg h-full flex flex-col">
                    <CardHeader className="border-b border-border/50 bg-gradient-to-r from-card to-card/80">
                        <CardTitle className="flex items-center gap-3">
                            <div className="h-8 w-1 rounded-full bg-gradient-to-b from-primary via-purple-500 to-blue-500"></div>
                            Analysis Configuration
                        </CardTitle>
                        <CardDescription>Configure parameters for content gap analysis</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6 flex-1 overflow-y-auto max-h-[calc(100vh-20rem)]">
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="accuracy">Expected Accuracy</Label>
                                    <Input
                                        id="accuracy"
                                        value={accuracy}
                                        onChange={(e) => setAccuracy(e.target.value)}
                                        placeholder=">= 80%"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="min-recs">Min Recommendations</Label>
                                    <Input
                                        id="min-recs"
                                        type="number"
                                        value={minRecommendations}
                                        onChange={(e) => setMinRecommendations(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label>Deliverables</Label>
                                <div className="space-y-2">
                                    {DEFAULT_DELIVERABLES.map((item) => (
                                        <div key={item} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`del-${item}`}
                                                checked={selectedDeliverables.includes(item)}
                                                onCheckedChange={() => handleDeliverableToggle(item)}
                                            />
                                            <label
                                                htmlFor={`del-${item}`}
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                            >
                                                {item}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label>Report Format</Label>
                                <div className="flex flex-wrap gap-4">
                                    {DEFAULT_FORMATS.map((item) => (
                                        <div key={item} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`fmt-${item}`}
                                                checked={selectedFormats.includes(item)}
                                                onCheckedChange={() => handleFormatToggle(item)}
                                            />
                                            <label
                                                htmlFor={`fmt-${item}`}
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                            >
                                                {item}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-4 mt-auto border-t border-border/50">
                            <Button
                                onClick={handleRunAnalysis}
                                disabled={isLoading}
                                className="flex-1 bg-gradient-to-r from-primary via-purple-500 to-blue-500 hover:from-primary/90 hover:via-purple-500/90 hover:to-blue-500/90 text-white shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        {runStatus || "Running..."}
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="mr-2 h-4 w-4" />
                                        Run Analysis
                                    </>
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Output Section */}
                <Card className="border-border/50 bg-gradient-to-br from-muted/30 via-muted/20 to-card/50 backdrop-blur-sm shadow-lg h-full flex flex-col">
                    <CardHeader className="border-b border-border/50 bg-gradient-to-r from-card/80 to-card/60 shrink-0">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-3">
                                    <div className="h-8 w-1 rounded-full bg-gradient-to-b from-green-500 via-emerald-500 to-teal-500"></div>
                                    Analysis Results
                                </CardTitle>
                                <CardDescription>Gaps, recommendations & metrics</CardDescription>
                            </div>
                            {analysisData && (
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" onClick={() => handleDownload('pdf')}>
                                        <FileText className="h-4 w-4 mr-2" /> PDF
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={() => handleDownload('pptx')}>
                                        <Presentation className="h-4 w-4 mr-2" /> PPTX
                                    </Button>
                                </div>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-y-auto p-0">
                        {isLoading ? (
                            <div className="flex h-full items-center justify-center text-muted-foreground p-6">
                                <div className="flex flex-col items-center gap-4">
                                    <div className="relative">
                                        <div className="h-16 w-16 rounded-full bg-gradient-to-r from-primary via-purple-500 to-blue-500 opacity-20 animate-pulse"></div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                        </div>
                                    </div>
                                    <p className="text-sm font-medium">{runStatus}</p>
                                </div>
                            </div>
                        ) : analysisData ? (
                            <Tabs defaultValue="recommendations" className="h-full flex flex-col">
                                <div className="px-6 pt-4">
                                    <TabsList className="w-full justify-start">
                                        <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                                        <TabsTrigger value="gaps">Content Gaps</TabsTrigger>
                                        <TabsTrigger value="metrics">Metrics</TabsTrigger>
                                    </TabsList>
                                </div>

                                <TabsContent value="recommendations" className="flex-1 overflow-y-auto p-6 space-y-4">
                                    {Array.isArray(analysisData.recommendations) && analysisData.recommendations.length > 0 ? (
                                        analysisData.recommendations.map((rec: any, i: number) => (
                                            <div key={i} className="bg-card/50 border border-border/50 rounded-xl p-4 shadow-sm space-y-2">
                                                <div className="flex justify-between items-start">
                                                    <h4 className="font-semibold text-sm">{rec.topic || `Recommendation ${i + 1}`}</h4>
                                                    <Badge variant="outline">{rec.priority || 'Medium'}</Badge>
                                                </div>
                                                <p className="text-sm text-muted-foreground">{rec.reason || rec.description || "No description provided."}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center text-muted-foreground py-8">No recommendations found.</div>
                                    )}
                                </TabsContent>

                                <TabsContent value="gaps" className="flex-1 overflow-y-auto p-6 space-y-4">
                                    {Array.isArray(analysisData.gaps) && analysisData.gaps.length > 0 ? (
                                        analysisData.gaps.map((gap: any, i: number) => (
                                            <div key={i} className="bg-card/50 border border-border/50 rounded-xl p-4 shadow-sm flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <Target className="h-5 w-5 text-destructive/70" />
                                                    <div>
                                                        <h4 className="font-semibold text-sm">{gap.topic || `Gap ${i + 1}`}</h4>
                                                        <p className="text-xs text-muted-foreground">Current Coverage: {gap.current_coverage || 'Low'}</p>
                                                    </div>
                                                </div>
                                                <Badge variant="secondary">Gap</Badge>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center text-muted-foreground py-8">No gaps detected.</div>
                                    )}
                                </TabsContent>

                                <TabsContent value="metrics" className="flex-1 overflow-y-auto p-6">
                                    {analysisData.metrics ? (
                                        <div className="grid grid-cols-2 gap-4">
                                            {Object.entries(analysisData.metrics).map(([key, value]: [string, any]) => {
                                                // Handle different value types
                                                let displayValue: string;
                                                if (typeof value === 'number') {
                                                    displayValue = value <= 1 ? (value * 100).toFixed(1) + '%' : value.toString();
                                                } else if (typeof value === 'object' && value !== null) {
                                                    // Convert object to formatted string
                                                    displayValue = JSON.stringify(value, null, 2);
                                                } else {
                                                    displayValue = String(value ?? 'N/A');
                                                }
                                                
                                                return (
                                                    <div key={key} className="bg-card/50 border border-border/50 rounded-xl p-4 shadow-sm flex flex-col items-center justify-center gap-2">
                                                        <span className="text-xs font-semibold uppercase text-muted-foreground">{key.replace(/_/g, ' ')}</span>
                                                        {typeof value === 'object' && value !== null ? (
                                                            <pre className="text-xs font-mono text-primary whitespace-pre-wrap text-center w-full">
                                                                {displayValue}
                                                            </pre>
                                                        ) : (
                                                            <span className="text-2xl font-bold text-primary">
                                                                {displayValue}
                                                            </span>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="text-center text-muted-foreground py-8">No metrics available.</div>
                                    )}
                                </TabsContent>
                            </Tabs>
                        ) : (
                            <div className="flex h-full items-center justify-center text-muted-foreground text-sm p-6">
                                <div className="text-center space-y-3">
                                    <div className="flex justify-center">
                                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/10 to-purple-500/10 flex items-center justify-center">
                                            <Layers className="h-6 w-6 text-primary/50" />
                                        </div>
                                    </div>
                                    <p>Configure and run analysis to see results</p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
