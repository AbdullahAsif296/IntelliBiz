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
    Eye,
    TrendingUp,
    Clock,
    Target,
    ExternalLink,
    Plus,
    X
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface Ad {
    [key: string]: any; // Flexible structure for ad data
}

interface AdCollectionResponse {
    success: boolean;
    message: string;
    ads: Ad[];
    total_collected: number;
    total_preprocessed: number;
    total_classified: number;
    execution_time_seconds: number;
    timestamp: string;
    error?: string;
}

export function CompetitorAdDetectorForm() {
    const [keywords, setKeywords] = useState<string[]>(["Nike", "Adidas"]);
    const [newKeyword, setNewKeyword] = useState("");
    const [maxResults, setMaxResults] = useState("20");
    const [platform, setPlatform] = useState("mock");
    const [output, setOutput] = useState<AdCollectionResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAddKeyword = () => {
        if (newKeyword.trim() && !keywords.includes(newKeyword.trim())) {
            setKeywords([...keywords, newKeyword.trim()]);
            setNewKeyword("");
        }
    };

    const handleRemoveKeyword = (keywordToRemove: string) => {
        setKeywords(keywords.filter(k => k !== keywordToRemove));
    };

    const handleSubmit = async () => {
        if (keywords.length === 0) {
            setError("At least one keyword is required");
            return;
        }

        setIsLoading(true);
        setOutput(null);
        setError(null);

        try {
            // Create AbortController for client-side timeout (55s to match server timeout with buffer)
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 55000);

            try {
                const response = await fetch('/api/proxy/competitor-ad-detector', {
                    method: 'POST',
                    headers: {
                        'accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        keywords: keywords,
                        max_results: parseInt(maxResults) || 20,
                        platform: platform
                    }),
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                if (!response.ok) {
                    const errorData = await response.json();
                    // Provide more helpful error messages
                    let errorMessage = errorData.error || `API error: ${response.status}`;
                    
                    if (response.status === 504 || errorData.timeout) {
                        errorMessage = "Request timed out. Ad collection can take 15-60 seconds. Try reducing the number of keywords or max_results, then try again.";
                    } else if (response.status === 503 || errorData.networkError) {
                        errorMessage = "The ad detection service is currently unavailable. Please try again in a few moments.";
                    } else if (response.status === 502) {
                        errorMessage = "The ad detection API returned an error. Please check your input and try again.";
                    }
                    
                    throw new Error(errorMessage);
                }

                const data = await response.json();
                setOutput(data);
            } catch (fetchError: any) {
                clearTimeout(timeoutId);
                
                if (fetchError.name === 'AbortError') {
                    throw new Error("Request timed out. Ad collection can take a while. Please try with fewer keywords or lower max_results.");
                }
                
                throw fetchError;
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred while detecting ads");
        } finally {
            setIsLoading(false);
        }
    };

    const clearForm = () => {
        setKeywords(["Nike", "Adidas"]);
        setNewKeyword("");
        setMaxResults("20");
        setPlatform("mock");
        setOutput(null);
        setError(null);
    };

    const formatExecutionTime = (seconds: number) => {
        if (seconds < 60) {
            return `${seconds.toFixed(1)}s`;
        }
        const mins = Math.floor(seconds / 60);
        const secs = (seconds % 60).toFixed(1);
        return `${mins}m ${secs}s`;
    };

    const renderAdContent = (ad: Ad, index: number) => {
        // Try to extract common ad fields
        const title = ad.title || ad.headline || ad.name || `Ad ${index + 1}`;
        const description = ad.description || ad.text || ad.body || "";
        const url = ad.url || ad.link || ad.landing_page || "";
        const platform = ad.platform || ad.source || "Unknown";
        const adType = ad.type || ad.ad_type || "Unknown";

        return (
            <div key={index} className="bg-card/50 border border-border/50 rounded-xl p-4 shadow-sm space-y-3 hover:shadow-md hover:border-primary/30 transition-all duration-300">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="text-xs shrink-0">
                                #{index + 1}
                            </Badge>
                            <h4 className="font-semibold text-sm truncate">{title}</h4>
                        </div>
                        {description && (
                            <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{description}</p>
                        )}
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                            <Badge variant="secondary" className="text-xs">{platform}</Badge>
                            <Badge variant="outline" className="text-xs">{adType}</Badge>
                            {url && (
                                <a
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary hover:underline flex items-center gap-1"
                                >
                                    <span className="truncate max-w-[200px]">{url}</span>
                                    <ExternalLink className="h-3 w-3 shrink-0" />
                                </a>
                            )}
                        </div>
                    </div>
                    {url && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="shrink-0 h-8 w-8 p-0"
                            onClick={() => window.open(url, '_blank')}
                        >
                            <ExternalLink className="h-4 w-4" />
                        </Button>
                    )}
                </div>
                {/* Display additional ad data if available */}
                {Object.keys(ad).length > 0 && (
                    <details className="text-xs">
                        <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                            View raw data
                        </summary>
                        <pre className="mt-2 p-2 bg-muted/50 rounded text-xs overflow-auto max-h-32">
                            {JSON.stringify(ad, null, 2)}
                        </pre>
                    </details>
                )}
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {/* API Status Indicator */}
            <Alert className="border-primary/20 bg-gradient-to-r from-primary/5 to-purple-500/5">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <AlertTitle className="text-sm font-semibold">Live API Integration</AlertTitle>
                <AlertDescription className="text-xs text-muted-foreground">
                    This form connects to the Ad Intelligence Agent at{" "}
                    <code className="text-xs bg-muted px-1 py-0.5 rounded">spm-project-final.onrender.com</code>
                    <br />
                    <span className="text-yellow-600 dark:text-yellow-400 mt-1 block">
                        ⚠️ Note: Ad collection can take 15-60 seconds. Please be patient and avoid refreshing the page.
                    </span>
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
                            Ad Detection Configuration
                        </CardTitle>
                        <CardDescription>Enter keywords to detect competitor ads</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6 flex-1 flex flex-col">
                        <div className="space-y-4 flex-1">
                            {/* Keywords Input */}
                            <div className="space-y-2">
                                <Label htmlFor="keywords" className="flex items-center gap-2">
                                    <Target className="h-4 w-4 text-muted-foreground" />
                                    Keywords *
                                </Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="keywords"
                                        value={newKeyword}
                                        onChange={(e) => setNewKeyword(e.target.value)}
                                        placeholder="Enter keyword (e.g., Nike)"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                handleAddKeyword();
                                            }
                                        }}
                                    />
                                    <Button
                                        type="button"
                                        onClick={handleAddKeyword}
                                        disabled={!newKeyword.trim() || keywords.includes(newKeyword.trim())}
                                        size="sm"
                                        variant="outline"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                                {keywords.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {keywords.map((keyword) => (
                                            <Badge
                                                key={keyword}
                                                variant="secondary"
                                                className="text-xs flex items-center gap-1"
                                            >
                                                {keyword}
                                                <button
                                                    onClick={() => handleRemoveKeyword(keyword)}
                                                    className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                                <p className="text-xs text-muted-foreground">
                                    Add keywords to search for competitor ads. Click on badges to remove.
                                </p>
                            </div>

                            {/* Max Results */}
                            <div className="space-y-2">
                                <Label htmlFor="max-results">Max Results</Label>
                                <Input
                                    id="max-results"
                                    type="number"
                                    min="1"
                                    max="100"
                                    value={maxResults}
                                    onChange={(e) => setMaxResults(e.target.value)}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Maximum number of ads to collect (1-100)
                                </p>
                            </div>

                            {/* Platform */}
                            <div className="space-y-2">
                                <Label htmlFor="platform">Platform</Label>
                                <Input
                                    id="platform"
                                    value={platform}
                                    onChange={(e) => setPlatform(e.target.value)}
                                    placeholder="e.g., mock, facebook, google"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Platform to collect ads from (default: mock)
                                </p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-4 mt-auto border-t border-border/50">
                            <Button
                                onClick={handleSubmit}
                                disabled={isLoading || keywords.length === 0}
                                className="flex-1 bg-gradient-to-r from-primary via-purple-500 to-blue-500 hover:from-primary/90 hover:via-purple-500/90 hover:to-blue-500/90 text-white shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Detecting Ads...
                                    </>
                                ) : (
                                    <>
                                        <Eye className="mr-2 h-4 w-4" />
                                        Detect Ads
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
                            Ad Detection Results
                        </CardTitle>
                        <CardDescription>Collected competitor ads and analytics</CardDescription>
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
                                    <p className="text-sm font-medium">Collecting and analyzing ads...</p>
                                    <p className="text-xs text-muted-foreground text-center max-w-xs">
                                        This process can take 15-60 seconds depending on the number of keywords and results requested.
                                        <br />
                                        <span className="text-yellow-600 dark:text-yellow-400 mt-1 block">
                                            Please do not refresh the page.
                                        </span>
                                    </p>
                                </div>
                            </div>
                        ) : output ? (
                            output.success === false ? (
                                <Alert className="border-destructive/50 bg-destructive/5">
                                    <AlertTriangle className="h-4 w-4 text-destructive" />
                                    <AlertDescription className="text-xs text-destructive/80">
                                        {output.error || output.message || "An error occurred"}
                                    </AlertDescription>
                                </Alert>
                            ) : (
                                <div className="space-y-6">
                                    {/* Summary Stats */}
                                    <div className="bg-card/50 border border-border/50 rounded-xl p-6 shadow-sm">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/10 to-purple-500/10 flex items-center justify-center">
                                                    <Eye className="h-6 w-6 text-primary" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-lg">Ad Collection</h3>
                                                    <p className="text-xs text-muted-foreground">{output.message || "Successfully collected ads"}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-primary">{output.total_collected || 0}</div>
                                                <p className="text-xs text-muted-foreground mt-1">Collected</p>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-primary">{output.total_preprocessed || 0}</div>
                                                <p className="text-xs text-muted-foreground mt-1">Preprocessed</p>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-primary">{output.total_classified || 0}</div>
                                                <p className="text-xs text-muted-foreground mt-1">Classified</p>
                                            </div>
                                        </div>
                                        {output.execution_time_seconds && (
                                            <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-border/50">
                                                <Clock className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-xs text-muted-foreground">
                                                    Execution time: {formatExecutionTime(output.execution_time_seconds)}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Ads List */}
                                    {output.ads && output.ads.length > 0 ? (
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2">
                                                <TrendingUp className="h-4 w-4 text-primary" />
                                                <h4 className="text-sm font-semibold">Detected Ads ({output.ads.length})</h4>
                                            </div>
                                            <div className="space-y-3 max-h-[500px] overflow-y-auto">
                                                {output.ads.map((ad, index) => renderAdContent(ad, index))}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="bg-card/50 border border-border/50 rounded-xl p-8 text-center">
                                            <Eye className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                                            <p className="text-sm text-muted-foreground">No ads found for the specified keywords</p>
                                        </div>
                                    )}

                                    {/* Timestamp */}
                                    {output.timestamp && (
                                        <div className="text-xs text-muted-foreground text-center pt-2 border-t border-border/50">
                                            Collected at: {new Date(output.timestamp).toLocaleString()}
                                        </div>
                                    )}
                                </div>
                            )
                        ) : (
                            <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
                                <div className="text-center space-y-3">
                                    <div className="flex justify-center">
                                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/10 to-purple-500/10 flex items-center justify-center">
                                            <Eye className="h-6 w-6 text-primary/50" />
                                        </div>
                                    </div>
                                    <p>Enter keywords to detect competitor ads</p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

