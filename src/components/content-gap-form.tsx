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
    Lightbulb,
    TrendingUp,
    TrendingDown,
    Search,
    Filter,
    ArrowUp,
    ArrowDown,
    Info,
    Zap,
    Award,
    AlertCircle
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
    const [searchQuery, setSearchQuery] = useState("");
    const [priorityFilter, setPriorityFilter] = useState<string>("all");
    const [sortBy, setSortBy] = useState<string>("default");

    const API_BASE_URL = "https://busked-schematically-amiyah.ngrok-free.dev";

    // Helper function to normalize API response data
    const normalizeRecommendations = (data: any): any[] => {
        if (!data) return [];
        
        // If it's already an array, return it
        if (Array.isArray(data)) {
            return data.map((item: any) => ({
                topic: item.topic || item.title || item.name || item.subject || item.content_topic || 'Untitled Topic',
                priority: item.priority || item.urgency || item.importance || 'Medium',
                reason: item.reason || item.description || item.details || item.explanation || item.rationale || item.why || item.recommendation || '',
                // Include all other fields for debugging
                ...item
            }));
        }
        
        // If it's an object, check for common array properties
        if (typeof data === 'object') {
            if (data.recommendations && Array.isArray(data.recommendations)) {
                return normalizeRecommendations(data.recommendations);
            }
            if (data.data && Array.isArray(data.data)) {
                return normalizeRecommendations(data.data);
            }
            if (data.items && Array.isArray(data.items)) {
                return normalizeRecommendations(data.items);
            }
        }
        
        return [];
    };

    const normalizeGaps = (data: any): any[] => {
        if (!data) return [];
        
        // If it's already an array, return it
        if (Array.isArray(data)) {
            return data.map((item: any) => ({
                topic: item.topic || item.title || item.name || item.subject || item.content_topic || item.gap_topic || 'Untitled Gap',
                current_coverage: item.current_coverage || item.coverage || item.current || item.our_coverage || 'Low',
                competitor_coverage: item.competitor_coverage || item.competitor || item.competition_coverage || item.their_coverage || 'High',
                gap_type: item.gap_type || item.type || item.category || '',
                opportunity: item.opportunity || item.potential || item.impact || '',
                // Include all other fields
                ...item
            }));
        }
        
        // If it's an object, check for common array properties
        if (typeof data === 'object') {
            if (data.gaps && Array.isArray(data.gaps)) {
                return normalizeGaps(data.gaps);
            }
            if (data.data && Array.isArray(data.data)) {
                return normalizeGaps(data.data);
            }
            if (data.items && Array.isArray(data.items)) {
                return normalizeGaps(data.items);
            }
        }
        
        return [];
    };

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
            // 1. Trigger Analysis via proxy
            const runResponse = await fetch('/api/proxy/content-gap', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'run',
                    deliverables: selectedDeliverables,
                    expected_accuracy: accuracy,
                    recommendation_count_min: parseInt(minRecommendations),
                    report_format: selectedFormats
                })
            });

            if (!runResponse.ok) {
                const errorData = await runResponse.json().catch(() => ({}));
                throw new Error(errorData.error || `Analysis trigger failed: ${runResponse.status}`);
            }

            setRunStatus("Fetching results...");

            // 2. Fetch Results - Try package first (most complete), then fallback to individual endpoints
            const packageRes = await fetch('/api/proxy/content-gap?endpoint=package');
            
            if (packageRes.ok) {
                const pkg = await packageRes.json();
                console.log('Package response:', pkg); // Debug log
                
                setAnalysisData({
                    recommendations: normalizeRecommendations(pkg.recommendations || pkg),
                    gaps: normalizeGaps(pkg.gaps || pkg),
                    metrics: pkg.metrics || pkg.metrics_data || null,
                    stats: pkg.stats || pkg.statistics || null,
                    raw: pkg // Keep raw data for debugging
                });
                setRunStatus("Complete");
            } else {
                // Fallback to individual endpoints
                setRunStatus("Fetching individual results...");
                
            const [recsRes, gapsRes, metricsRes] = await Promise.all([
                    fetch('/api/proxy/content-gap?endpoint=recommendations'),
                    fetch('/api/proxy/content-gap?endpoint=gaps'),
                    fetch('/api/proxy/content-gap?endpoint=metrics')
                ]);

                const recommendations = recsRes.ok ? await recsRes.json() : null;
                const gaps = gapsRes.ok ? await gapsRes.json() : null;
                const metrics = metricsRes.ok ? await metricsRes.json() : null;

                console.log('Individual responses:', { recommendations, gaps, metrics }); // Debug log

                setAnalysisData({
                    recommendations: normalizeRecommendations(recommendations),
                    gaps: normalizeGaps(gaps),
                    metrics: metrics,
                    raw: { recommendations, gaps, metrics } // Keep raw data
                });
                setRunStatus("Complete");
            }

        } catch (err) {
            console.error('Analysis error:', err);
            setError(err instanceof Error ? err.message : "An error occurred");
            setRunStatus("Failed");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownload = (type: 'pdf' | 'pptx' | 'package') => {
        window.open(`${API_BASE_URL}/download/${type}`, '_blank');
    };

    // Helper to get priority color
    const getPriorityColor = (priority: string) => {
        const p = priority?.toLowerCase() || 'medium';
        if (p.includes('high') || p.includes('urgent') || p.includes('critical')) {
            return 'bg-red-500/10 text-red-600 border-red-500/20';
        } else if (p.includes('low') || p.includes('minor')) {
            return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
        }
        return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
    };

    // Helper to get coverage color
    const getCoverageColor = (coverage: string) => {
        const c = coverage?.toLowerCase() || 'low';
        if (c.includes('high') || c.includes('excellent') || c.includes('strong')) {
            return 'text-green-600';
        } else if (c.includes('medium') || c.includes('moderate') || c.includes('fair')) {
            return 'text-yellow-600';
        }
        return 'text-red-600';
    };

    // Filter and sort recommendations
    const getFilteredRecommendations = () => {
        if (!Array.isArray(analysisData?.recommendations)) return [];
        
        let filtered = [...analysisData.recommendations];
        
        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter((rec: any) => {
                const topic = (rec.topic || rec.title || rec.name || '').toLowerCase();
                const desc = (rec.reason || rec.description || rec.details || '').toLowerCase();
                return topic.includes(query) || desc.includes(query);
            });
        }
        
        // Priority filter
        if (priorityFilter !== 'all') {
            filtered = filtered.filter((rec: any) => {
                const priority = (rec.priority || rec.urgency || 'medium').toLowerCase();
                return priority.includes(priorityFilter.toLowerCase());
            });
        }
        
        // Sort
        if (sortBy === 'priority') {
            filtered.sort((a: any, b: any) => {
                const priorityOrder: { [key: string]: number } = { 'high': 3, 'urgent': 4, 'critical': 5, 'medium': 2, 'low': 1 };
                const aP = priorityOrder[(a.priority || 'medium').toLowerCase()] || 2;
                const bP = priorityOrder[(b.priority || 'medium').toLowerCase()] || 2;
                return bP - aP;
            });
        }
        
        return filtered;
    };

    // Filter and sort gaps
    const getFilteredGaps = () => {
        if (!Array.isArray(analysisData?.gaps)) return [];
        
        let filtered = [...analysisData.gaps];
        
        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter((gap: any) => {
                const topic = (gap.topic || gap.title || gap.name || '').toLowerCase();
                return topic.includes(query);
            });
        }
        
        return filtered;
    };

    return (
        <div className="space-y-6">
            {/* API Status Indicator */}
            <Alert className="border-primary/20 bg-gradient-to-r from-primary/5 to-purple-500/5">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <AlertTitle className="text-sm font-semibold">Live API Integration</AlertTitle>
                <AlertDescription className="text-xs text-muted-foreground">
                    This form connects to the Content Gap Analysis Agent via proxy route. All available fields from the API response will be displayed.
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
                    
                    {/* Summary Statistics */}
                    {analysisData && (
                        <div className="px-6 pt-4 pb-2 border-b border-border/30">
                            <div className="grid grid-cols-3 gap-3">
                                <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-lg p-3">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Lightbulb className="h-4 w-4 text-blue-600" />
                                        <span className="text-xs font-medium text-muted-foreground">Recommendations</span>
                                    </div>
                                    <div className="text-2xl font-bold text-blue-600">
                                        {Array.isArray(analysisData.recommendations) ? analysisData.recommendations.length : 0}
                                    </div>
                                </div>
                                <div className="bg-gradient-to-br from-red-500/10 to-red-600/5 border border-red-500/20 rounded-lg p-3">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Target className="h-4 w-4 text-red-600" />
                                        <span className="text-xs font-medium text-muted-foreground">Content Gaps</span>
                                    </div>
                                    <div className="text-2xl font-bold text-red-600">
                                        {Array.isArray(analysisData.gaps) ? analysisData.gaps.length : 0}
                                    </div>
                                </div>
                                <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 rounded-lg p-3">
                                    <div className="flex items-center gap-2 mb-1">
                                        <BarChart3 className="h-4 w-4 text-purple-600" />
                                        <span className="text-xs font-medium text-muted-foreground">Metrics</span>
                                    </div>
                                    <div className="text-2xl font-bold text-purple-600">
                                        {analysisData.metrics ? Object.keys(analysisData.metrics).length : 0}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
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
                                        <TabsTrigger value="recommendations" className="flex items-center gap-2">
                                            <Lightbulb className="h-4 w-4" />
                                            Recommendations
                                            {Array.isArray(analysisData.recommendations) && (
                                                <Badge variant="secondary" className="ml-1">
                                                    {analysisData.recommendations.length}
                                                </Badge>
                                            )}
                                        </TabsTrigger>
                                        <TabsTrigger value="gaps" className="flex items-center gap-2">
                                            <Target className="h-4 w-4" />
                                            Content Gaps
                                            {Array.isArray(analysisData.gaps) && (
                                                <Badge variant="secondary" className="ml-1">
                                                    {analysisData.gaps.length}
                                                </Badge>
                                            )}
                                        </TabsTrigger>
                                        <TabsTrigger value="metrics" className="flex items-center gap-2">
                                            <BarChart3 className="h-4 w-4" />
                                            Metrics
                                        </TabsTrigger>
                                    </TabsList>
                                </div>

                                <TabsContent value="recommendations" className="flex-1 overflow-y-auto p-6 space-y-4">
                                    {/* Search and Filter Controls */}
                                    <div className="flex flex-col sm:flex-row gap-3 mb-4">
                                        <div className="relative flex-1">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                placeholder="Search recommendations..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="pl-9"
                                            />
                                        </div>
                                        <div className="flex gap-2">
                                            <select
                                                value={priorityFilter}
                                                onChange={(e) => setPriorityFilter(e.target.value)}
                                                className="px-3 py-2 text-sm border border-border rounded-md bg-background"
                                            >
                                                <option value="all">All Priorities</option>
                                                <option value="high">High Priority</option>
                                                <option value="medium">Medium Priority</option>
                                                <option value="low">Low Priority</option>
                                            </select>
                                            <select
                                                value={sortBy}
                                                onChange={(e) => setSortBy(e.target.value)}
                                                className="px-3 py-2 text-sm border border-border rounded-md bg-background"
                                            >
                                                <option value="default">Default Order</option>
                                                <option value="priority">Sort by Priority</option>
                                            </select>
                                        </div>
                                    </div>
                                    {(() => {
                                        const filteredRecs = getFilteredRecommendations();
                                        return filteredRecs.length > 0 ? (
                                            <>
                                                {filteredRecs.length < (analysisData.recommendations?.length || 0) && (
                                                    <div className="text-xs text-muted-foreground mb-2">
                                                        Showing {filteredRecs.length} of {analysisData.recommendations?.length || 0} recommendations
                                                    </div>
                                                )}
                                                {filteredRecs.map((rec: any, i: number) => {
                                                    // Extract all possible text fields
                                                    const description = rec.reason || rec.description || rec.details || rec.explanation || rec.rationale || rec.why || rec.recommendation || rec.content || '';
                                                    const topic = rec.topic || rec.title || rec.name || rec.subject || rec.content_topic || `Recommendation ${i + 1}`;
                                                    const priority = rec.priority || rec.urgency || rec.importance || 'Medium';
                                                    
                                                    // Get any additional fields
                                                    const additionalFields = Object.entries(rec)
                                                        .filter(([key]) => !['topic', 'title', 'name', 'subject', 'content_topic', 'priority', 'urgency', 'importance', 'reason', 'description', 'details', 'explanation', 'rationale', 'why', 'recommendation', 'content'].includes(key))
                                                        .filter(([_, value]) => value !== null && value !== undefined && value !== '')
                                                        .map(([key, value]) => ({ key, value }));

                                                    return (
                                                        <div key={i} className="group bg-gradient-to-br from-card/80 to-card/50 border border-border/50 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 space-y-3">
                                                            <div className="flex justify-between items-start gap-3">
                                                                <div className="flex items-start gap-3 flex-1">
                                                                    <div className="mt-1 p-2 rounded-lg bg-primary/10">
                                                                        <Lightbulb className="h-4 w-4 text-primary" />
                                                                    </div>
                                                                    <div className="flex-1">
                                                                        <h4 className="font-semibold text-base mb-1 text-foreground">{topic}</h4>
                                                                        {description && (
                                                                            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{description}</p>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <Badge className={`shrink-0 ${getPriorityColor(priority)} border`}>
                                                                    {priority}
                                                                </Badge>
                                                            </div>
                                                            {additionalFields.length > 0 && (
                                                                <details className="pt-2 border-t border-border/30">
                                                                    <summary className="cursor-pointer text-xs font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                                                                        <Info className="h-3 w-3" />
                                                                        Additional Details ({additionalFields.length})
                                                                    </summary>
                                                                    <div className="mt-2 space-y-2 pl-4">
                                                                        {additionalFields.map(({ key, value }) => (
                                                                            <div key={key} className="text-xs">
                                                                                <span className="font-medium text-muted-foreground capitalize">{key.replace(/_/g, ' ')}:</span>{' '}
                                                                                <span className="text-muted-foreground">
                                                                                    {typeof value === 'object' ? (
                                                                                        <pre className="mt-1 text-xs bg-muted/50 p-2 rounded overflow-auto">
                                                                                            {JSON.stringify(value, null, 2)}
                                                                                        </pre>
                                                                                    ) : (
                                                                                        String(value)
                                                                                    )}
                                                                                </span>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </details>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </>
                                        ) : (
                                            <div className="text-center text-muted-foreground py-12">
                                                <div className="flex flex-col items-center gap-3">
                                                    <div className="p-3 rounded-full bg-muted/50">
                                                        <Search className="h-6 w-6 text-muted-foreground/50" />
                                                    </div>
                                                    <p className="font-medium">No recommendations found</p>
                                                    {(searchQuery || priorityFilter !== 'all') && (
                                                        <p className="text-xs">Try adjusting your filters</p>
                                                    )}
                                                    {analysisData.raw && (
                                                        <details className="mt-4 text-left">
                                                            <summary className="cursor-pointer text-xs text-primary hover:underline">Debug: View raw response</summary>
                                                            <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-auto max-h-40">
                                                                {JSON.stringify(analysisData.raw, null, 2)}
                                                            </pre>
                                                        </details>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })()}
                                </TabsContent>

                                <TabsContent value="gaps" className="flex-1 overflow-y-auto p-6 space-y-4">
                                    {/* Search Control */}
                                    <div className="mb-4">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                placeholder="Search gaps..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="pl-9"
                                            />
                                        </div>
                                    </div>
                                    
                                    {(() => {
                                        const filteredGaps = getFilteredGaps();
                                        return filteredGaps.length > 0 ? (
                                            <>
                                                {filteredGaps.length < (analysisData.gaps?.length || 0) && (
                                                    <div className="text-xs text-muted-foreground mb-2">
                                                        Showing {filteredGaps.length} of {analysisData.gaps?.length || 0} gaps
                                                    </div>
                                                )}
                                                {filteredGaps.map((gap: any, i: number) => {
                                                    const topic = gap.topic || gap.title || gap.name || gap.subject || gap.content_topic || gap.gap_topic || `Gap ${i + 1}`;
                                                    const currentCoverage = gap.current_coverage || gap.coverage || gap.current || gap.our_coverage || 'Low';
                                                    const competitorCoverage = gap.competitor_coverage || gap.competitor || gap.competition_coverage || gap.their_coverage || '';
                                                    
                                                    // Get any additional fields
                                                    const additionalFields = Object.entries(gap)
                                                        .filter(([key]) => !['topic', 'title', 'name', 'subject', 'content_topic', 'gap_topic', 'current_coverage', 'coverage', 'current', 'our_coverage', 'competitor_coverage', 'competitor', 'competition_coverage', 'their_coverage'].includes(key))
                                                        .filter(([_, value]) => value !== null && value !== undefined && value !== '')
                                                        .map(([key, value]) => ({ key, value }));

                                                    return (
                                                        <div key={i} className="group bg-gradient-to-br from-card/80 to-card/50 border border-red-500/20 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 space-y-3">
                                                            <div className="flex items-start justify-between gap-3">
                                                                <div className="flex items-start gap-3 flex-1">
                                                                    <div className="mt-1 p-2 rounded-lg bg-red-500/10">
                                                                        <Target className="h-4 w-4 text-red-600" />
                                                                    </div>
                                                                    <div className="flex-1">
                                                                        <h4 className="font-semibold text-base mb-2 text-foreground">{topic}</h4>
                                                                        <div className="space-y-2">
                                                                            <div className="flex items-center gap-2">
                                                                                <span className="text-xs font-medium text-muted-foreground">Current Coverage:</span>
                                                                                <Badge variant="outline" className={`text-xs ${getCoverageColor(currentCoverage)}`}>
                                                                                    {currentCoverage}
                                                                                </Badge>
                                                                            </div>
                                                                            {competitorCoverage && (
                                                                                <div className="flex items-center gap-2">
                                                                                    <TrendingUp className="h-3 w-3 text-muted-foreground" />
                                                                                    <span className="text-xs font-medium text-muted-foreground">Competitor:</span>
                                                                                    <Badge variant="outline" className="text-xs text-green-600">
                                                                                        {competitorCoverage}
                                                                                    </Badge>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <Badge variant="destructive" className="shrink-0">Gap</Badge>
                                                            </div>
                                                            {additionalFields.length > 0 && (
                                                                <details className="pt-2 border-t border-border/30">
                                                                    <summary className="cursor-pointer text-xs font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                                                                        <Info className="h-3 w-3" />
                                                                        Additional Details ({additionalFields.length})
                                                                    </summary>
                                                                    <div className="mt-2 space-y-2 pl-4">
                                                                        {additionalFields.map(({ key, value }) => (
                                                                            <div key={key} className="text-xs">
                                                                                <span className="font-medium text-muted-foreground capitalize">{key.replace(/_/g, ' ')}:</span>{' '}
                                                                                <span className="text-muted-foreground">
                                                                                    {typeof value === 'object' ? (
                                                                                        <pre className="mt-1 text-xs bg-muted/50 p-2 rounded overflow-auto">
                                                                                            {JSON.stringify(value, null, 2)}
                                                                                        </pre>
                                                                                    ) : (
                                                                                        String(value)
                                                                                    )}
                                                                                </span>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </details>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </>
                                        ) : (
                                            <div className="text-center text-muted-foreground py-12">
                                                <div className="flex flex-col items-center gap-3">
                                                    <div className="p-3 rounded-full bg-muted/50">
                                                        <Target className="h-6 w-6 text-muted-foreground/50" />
                                                    </div>
                                                    <p className="font-medium">No gaps detected</p>
                                                    {searchQuery && (
                                                        <p className="text-xs">Try adjusting your search</p>
                                                    )}
                                                    {analysisData.raw && (
                                                        <details className="mt-4 text-left">
                                                            <summary className="cursor-pointer text-xs text-primary hover:underline">Debug: View raw response</summary>
                                                            <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-auto max-h-40">
                                                                {JSON.stringify(analysisData.raw, null, 2)}
                                                            </pre>
                                                        </details>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })()}
                                </TabsContent>

                                <TabsContent value="metrics" className="flex-1 overflow-y-auto p-6">
                                    {analysisData.metrics ? (
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {Object.entries(analysisData.metrics).map(([key, value]: [string, any]) => {
                                                // Handle different value types
                                                let displayValue: string;
                                                    let isPercentage = false;
                                                    let numericValue: number | null = null;
                                                    
                                                if (typeof value === 'number') {
                                                        numericValue = value;
                                                        if (value <= 1 && value >= 0) {
                                                            displayValue = (value * 100).toFixed(1) + '%';
                                                            isPercentage = true;
                                                        } else {
                                                            displayValue = value.toFixed(2);
                                                        }
                                                } else if (typeof value === 'object' && value !== null) {
                                                    displayValue = JSON.stringify(value, null, 2);
                                                } else {
                                                    displayValue = String(value ?? 'N/A');
                                                }
                                                    
                                                    // Determine color based on value
                                                    let bgColor = 'from-blue-500/10 to-blue-600/5 border-blue-500/20 text-blue-600';
                                                    if (isPercentage && numericValue !== null) {
                                                        if (numericValue >= 0.8) {
                                                            bgColor = 'from-green-500/10 to-green-600/5 border-green-500/20 text-green-600';
                                                        } else if (numericValue >= 0.6) {
                                                            bgColor = 'from-yellow-500/10 to-yellow-600/5 border-yellow-500/20 text-yellow-600';
                                                        } else {
                                                            bgColor = 'from-red-500/10 to-red-600/5 border-red-500/20 text-red-600';
                                                        }
                                                }
                                                
                                                return (
                                                        <div key={key} className={`bg-gradient-to-br ${bgColor} border rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200`}>
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <BarChart3 className="h-4 w-4" />
                                                                <span className="text-xs font-semibold uppercase text-muted-foreground">
                                                                    {key.replace(/_/g, ' ')}
                                                                </span>
                                                            </div>
                                                        {typeof value === 'object' && value !== null ? (
                                                                <pre className="text-xs font-mono whitespace-pre-wrap text-foreground bg-muted/30 p-3 rounded mt-2 overflow-auto max-h-40">
                                                                {displayValue}
                                                            </pre>
                                                        ) : (
                                                                <div className="flex items-baseline gap-1">
                                                                    <span className="text-3xl font-bold">
                                                                {displayValue}
                                                            </span>
                                                                    {isPercentage && numericValue !== null && (
                                                                        <div className="ml-2">
                                                                            {numericValue >= 0.8 ? (
                                                                                <Award className="h-4 w-4 text-green-600" />
                                                                            ) : numericValue >= 0.6 ? (
                                                                                <AlertCircle className="h-4 w-4 text-yellow-600" />
                                                                            ) : (
                                                                                <AlertTriangle className="h-4 w-4 text-red-600" />
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                            </div>
                                            
                                            {/* Stats Section */}
                                            {analysisData.stats && (
                                                <div className="mt-6 pt-6 border-t border-border/30">
                                                    <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                                                        <Layers className="h-4 w-4" />
                                                        Analysis Statistics
                                                    </h3>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        {Object.entries(analysisData.stats).map(([key, value]: [string, any]) => (
                                                            <div key={key} className="bg-muted/30 border border-border/50 rounded-lg p-4">
                                                                <div className="text-xs font-medium text-muted-foreground mb-1 capitalize">
                                                                    {key.replace(/_/g, ' ')}
                                                                </div>
                                                                <div className="text-2xl font-bold text-foreground">
                                                                    {typeof value === 'number' ? value.toLocaleString() : String(value)}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="text-center text-muted-foreground py-12">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="p-3 rounded-full bg-muted/50">
                                                    <BarChart3 className="h-6 w-6 text-muted-foreground/50" />
                                                </div>
                                                <p className="font-medium">No metrics available</p>
                                            </div>
                                        </div>
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
