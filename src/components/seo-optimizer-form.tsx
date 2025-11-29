"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Loader2,
    Search,
    BarChart3,
    CheckCircle2,
    AlertTriangle,
    FileText,
    Globe,
    Type,
    List,
    TrendingUp
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

interface SeoAnalysisResponse {
    status: string;
    analysis: {
        overall_score: number;
        keyword_analysis: {
            keywords: Record<string, { count: number; density: number; status: string }>;
            total_words: number;
        };
        readability: {
            score: number;
            level: string;
        };
        meta_tags: {
            title: { present: boolean; status: string };
            description: { present: boolean; status: string };
        };
        recommendations: Array<{
            type: string;
            priority: string;
            suggestion: string;
        }>;
    };
}

export function SeoOptimizerForm() {
    const [url, setUrl] = useState("https://example.com/blog/seo-tips-2025");
    const [title, setTitle] = useState("10 Best SEO Tips for 2025");
    const [content, setContent] = useState("SEO is crucial for website visibility. Search engine optimization helps your content rank better in search results. Good SEO practices include keyword research, quality content creation, and proper meta tags.");
    const [focusKeyword, setFocusKeyword] = useState("SEO");
    const [output, setOutput] = useState<SeoAnalysisResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        setIsLoading(true);
        setOutput(null);
        setError(null);

        try {
            const response = await fetch('/api/proxy/seo', {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content: {
                        title: title,
                        body: content
                    },
                    url: url,
                    task_id: `task-${Date.now()}`,
                    config: {
                        focus_keyword: focusKeyword,
                        analysis_depth: "standard"
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

    const clearForm = () => {
        setUrl("");
        setTitle("");
        setContent("");
        setFocusKeyword("");
        setOutput(null);
        setError(null);
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return "text-green-500";
        if (score >= 60) return "text-yellow-500";
        return "text-red-500";
    };

    const getPriorityBadge = (priority: string) => {
        switch (priority.toLowerCase()) {
            case 'high': return 'destructive';
            case 'medium': return 'secondary';
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
                    This form sends data to the SEO Optimizer API at{" "}
                    <code className="text-xs bg-muted px-1 py-0.5 rounded">seo-optimizer-agent.onrender.com</code>
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
                            SEO Content Analysis
                        </CardTitle>
                        <CardDescription>Analyze content for SEO optimization and readability</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6 flex-1 flex flex-col">
                        <div className="space-y-4 flex-1">
                            <div className="space-y-2">
                                <Label htmlFor="url" className="flex items-center gap-2">
                                    <Globe className="h-4 w-4 text-muted-foreground" />
                                    Page URL
                                </Label>
                                <Input
                                    id="url"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    placeholder="https://example.com/page"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="focus-keyword" className="flex items-center gap-2">
                                    <Search className="h-4 w-4 text-muted-foreground" />
                                    Focus Keyword
                                </Label>
                                <Input
                                    id="focus-keyword"
                                    value={focusKeyword}
                                    onChange={(e) => setFocusKeyword(e.target.value)}
                                    placeholder="e.g., SEO tips"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="title" className="flex items-center gap-2">
                                    <Type className="h-4 w-4 text-muted-foreground" />
                                    Page Title
                                </Label>
                                <Input
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Page Title"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="content" className="flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                    Content Body
                                </Label>
                                <Textarea
                                    id="content"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="Paste your content here..."
                                    className="min-h-[150px]"
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
                                        <BarChart3 className="mr-2 h-4 w-4" />
                                        Analyze Content
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
                        <CardDescription>Optimization score and recommendations</CardDescription>
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
                                    <p className="text-sm font-medium">Analyzing content SEO...</p>
                                </div>
                            </div>
                        ) : output && output.analysis ? (
                            <div className="space-y-6">
                                {/* Overall Score */}
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
                                                className={getScoreColor(output.analysis.overall_score || 0)}
                                                strokeWidth="8"
                                                strokeDasharray={251.2}
                                                strokeDashoffset={251.2 * (1 - (output.analysis.overall_score || 0) / 100)}
                                                strokeLinecap="round"
                                                stroke="currentColor"
                                                fill="transparent"
                                                r="40"
                                                cx="50"
                                                cy="50"
                                            />
                                        </svg>
                                        <div className="absolute flex flex-col items-center">
                                            <span className={`text-3xl font-bold ${getScoreColor(output.analysis.overall_score || 0)}`}>
                                                {output.analysis.overall_score || 0}
                                            </span>
                                            <span className="text-xs text-muted-foreground uppercase tracking-wider">Score</span>
                                        </div>
                                    </div>
                                    <div className="w-full space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span>Readability Score</span>
                                            <span className="font-medium">{output.analysis.readability?.score || 0}</span>
                                        </div>
                                        <Progress value={output.analysis.readability?.score || 0} className="h-2" />
                                        <p className="text-xs text-center text-muted-foreground mt-1">
                                            Level: {output.analysis.readability?.level || 'N/A'}
                                        </p>
                                    </div>
                                </div>

                                {/* Meta Tags Status */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-card/50 border border-border/50 rounded-xl p-4 shadow-sm">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Type className="h-4 w-4 text-primary" />
                                            <span className="text-sm font-semibold">Title Tag</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {output.analysis.meta_tags?.title?.present ? (
                                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                            ) : (
                                                <AlertTriangle className="h-4 w-4 text-red-500" />
                                            )}
                                            <span className="text-sm capitalize">{String(output.analysis.meta_tags?.title?.status || 'unknown')}</span>
                                        </div>
                                    </div>
                                    <div className="bg-card/50 border border-border/50 rounded-xl p-4 shadow-sm">
                                        <div className="flex items-center gap-2 mb-2">
                                            <FileText className="h-4 w-4 text-primary" />
                                            <span className="text-sm font-semibold">Meta Description</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {output.analysis.meta_tags?.description?.present ? (
                                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                            ) : (
                                                <AlertTriangle className="h-4 w-4 text-red-500" />
                                            )}
                                            <span className="text-sm capitalize">{String(output.analysis.meta_tags?.description?.status || 'unknown')}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Keyword Analysis */}
                                <div className="bg-card/50 border border-border/50 rounded-xl p-4 shadow-sm">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Search className="h-4 w-4 text-primary" />
                                        <span className="text-sm font-semibold">Keyword Analysis</span>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-xs text-muted-foreground">
                                            <span>Total Words: {output.analysis.keyword_analysis?.total_words || 0}</span>
                                        </div>
                                        {output.analysis.keyword_analysis?.keywords && Object.entries(output.analysis.keyword_analysis.keywords).map(([keyword, data]) => (
                                            <div key={keyword} className="flex items-center justify-between bg-muted/30 p-2 rounded-lg">
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-sm">{keyword}</span>
                                                    <span className="text-xs text-muted-foreground">Density: {typeof data === 'object' ? data.density : 0}%</span>
                                                </div>
                                                <span className={`px-2 py-1 rounded text-xs ${(typeof data === 'object' && data.status === 'optimal') ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                                                    {typeof data === 'object' ? String(data.status) : 'unknown'}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Recommendations */}
                                <div className="bg-card/50 border border-border/50 rounded-xl p-4 shadow-sm">
                                    <div className="flex items-center gap-2 mb-3">
                                        <List className="h-4 w-4 text-primary" />
                                        <span className="text-sm font-semibold">Recommendations</span>
                                    </div>
                                    <div className="space-y-3">
                                        {output.analysis.recommendations?.map((rec, idx) => (
                                            <div key={idx} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/30 transition-colors">
                                                <span className="px-2 py-1 rounded text-xs bg-secondary text-secondary-foreground shrink-0 mt-0.5 uppercase">
                                                    {String(rec.priority)}
                                                </span>
                                                <div className="space-y-1">
                                                    <p className="text-sm">{rec.suggestion}</p>
                                                    <p className="text-xs text-muted-foreground capitalize">{rec.type.replace('_', ' ')}</p>
                                                </div>
                                            </div>
                                        ))}
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
                                    <p>Enter content details to get SEO analysis</p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
