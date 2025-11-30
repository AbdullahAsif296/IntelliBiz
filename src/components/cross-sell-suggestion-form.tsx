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
    Search,
    ShoppingCart,
    TrendingUp,
    Package,
    RefreshCw,
    Info
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface Recommendation {
    product_id: string;
    name: string;
    category: string;
    price: number;
    confidence_score: number;
    reason: string;
    source: string;
}

interface RecommendResponse {
    status: string;
    request_id?: string;
    session_id?: string;
    agent_id?: string;
    product_id?: string;
    ml_enabled?: boolean;
    count?: number;
    recommendations?: Recommendation[];
    timestamp?: string;
    message?: string;
}

interface SearchResult {
    product_id: string;
    name: string;
    category: string;
    price: number;
    description?: string;
    rating?: number;
}

interface SearchResponse {
    status: string;
    query?: string;
    results?: SearchResult[];
    count?: number;
    timestamp?: string;
    message?: string;
}

interface StatusResponse {
    status: string;
    agent_metadata?: {
        agent_id: string;
        agent_name: string;
        version: string;
        capabilities: string[];
        ml_enabled: boolean;
    };
    memory_sessions?: number;
    total_products?: number;
    ml_model_loaded?: boolean;
    timestamp?: string;
    message?: string;
}

export function CrossSellSuggestionForm() {
    // Recommendation form state
    const [productId, setProductId] = useState("");
    const [userId, setUserId] = useState("");
    const [sessionId, setSessionId] = useState("");
    const [limit, setLimit] = useState("3");
    const [useMl, setUseMl] = useState(true);

    // Search form state
    const [searchQuery, setSearchQuery] = useState("");

    // Results state
    const [recommendations, setRecommendations] = useState<RecommendResponse | null>(null);
    const [searchResults, setSearchResults] = useState<SearchResponse | null>(null);
    const [agentStatus, setAgentStatus] = useState<StatusResponse | null>(null);

    // UI state
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState("recommend");

    const handleGetRecommendations = async () => {
        setIsLoading(true);
        setError(null);
        setRecommendations(null);

        try {
            const response = await fetch('/api/proxy/cross-sell', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    endpoint: 'recommend',
                    product_id: productId,
                    user_id: userId || undefined,
                    session_id: sessionId || undefined,
                    limit: parseInt(limit) || 3,
                    use_ml: useMl
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `API error: ${response.status}`);
            }

            const data = await response.json();
            setRecommendations(data);
            if (data.session_id && !sessionId) {
                setSessionId(data.session_id);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearchProducts = async () => {
        setIsLoading(true);
        setError(null);
        setSearchResults(null);

        try {
            const response = await fetch('/api/proxy/cross-sell', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    endpoint: 'search',
                    query: searchQuery,
                    session_id: sessionId || undefined
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `API error: ${response.status}`);
            }

            const data = await response.json();
            setSearchResults(data);
            if (data.session_id && !sessionId) {
                setSessionId(data.session_id);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGetStatus = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/proxy/cross-sell?endpoint=status', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `API error: ${response.status}`);
            }

            const data = await response.json();
            setAgentStatus(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    const getConfidenceColor = (score: number) => {
        if (score >= 0.7) return "text-green-500";
        if (score >= 0.4) return "text-yellow-500";
        return "text-orange-500";
    };

    const getConfidenceBadge = (score: number) => {
        if (score >= 0.7) return "default";
        if (score >= 0.4) return "secondary";
        return "outline";
    };

    return (
        <div className="space-y-6">
            {/* API Status Indicator */}
            <Alert className="border-primary/20 bg-gradient-to-r from-primary/5 to-purple-500/5">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <AlertTitle className="text-sm font-semibold">Live API Integration</AlertTitle>
                <AlertDescription className="text-xs text-muted-foreground">
                    This form connects to the Cross-Sell Suggestion Agent at{" "}
                    <code className="text-xs bg-muted px-1 py-0.5 rounded">cross-sell-suggestion-agent.onrender.com</code>
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
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="recommend">Get Recommendations</TabsTrigger>
                    <TabsTrigger value="search">Search Products</TabsTrigger>
                    <TabsTrigger value="status">Agent Status</TabsTrigger>
                </TabsList>

                {/* Get Recommendations Tab */}
                <TabsContent value="recommend" className="space-y-6">
                    <div className="grid gap-6 lg:grid-cols-2">
                        <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-lg h-full flex flex-col">
                            <CardHeader className="border-b border-border/50 bg-gradient-to-r from-card to-card/80">
                                <CardTitle className="flex items-center gap-3">
                                    <div className="h-8 w-1 rounded-full bg-gradient-to-b from-primary via-purple-500 to-blue-500"></div>
                                    Recommendation Request
                                </CardTitle>
                                <CardDescription>Get product recommendations based on a product ID</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-4 flex-1 flex flex-col">
                                <div className="space-y-4 flex-1">
                                    <div className="space-y-2">
                                        <Label htmlFor="product-id">Product ID *</Label>
                                        <Input
                                            id="product-id"
                                            value={productId}
                                            onChange={(e) => setProductId(e.target.value)}
                                            placeholder="e.g., prod_1, prod_UK22399"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="user-id">User ID (Optional)</Label>
                                        <Input
                                            id="user-id"
                                            value={userId}
                                            onChange={(e) => setUserId(e.target.value)}
                                            placeholder="e.g., customer_1000"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="session-id">Session ID (Optional)</Label>
                                        <Input
                                            id="session-id"
                                            value={sessionId}
                                            onChange={(e) => setSessionId(e.target.value)}
                                            placeholder="Auto-generated if not provided"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="limit">Limit</Label>
                                            <Input
                                                id="limit"
                                                type="number"
                                                min="1"
                                                max="20"
                                                value={limit}
                                                onChange={(e) => setLimit(e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="use-ml" className="flex items-center gap-2">
                                                <Checkbox
                                                    id="use-ml"
                                                    checked={useMl}
                                                    onCheckedChange={(checked) => setUseMl(checked as boolean)}
                                                />
                                                Use ML
                                            </Label>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-2 pt-4 mt-auto border-t border-border/50">
                                    <Button
                                        onClick={handleGetRecommendations}
                                        disabled={isLoading || !productId.trim()}
                                        className="flex-1 bg-gradient-to-r from-primary via-purple-500 to-blue-500 hover:from-primary/90 hover:via-purple-500/90 hover:to-blue-500/90 text-white shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300"
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Getting Recommendations...
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles className="mr-2 h-4 w-4" />
                                                Get Recommendations
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-border/50 bg-gradient-to-br from-muted/30 via-muted/20 to-card/50 backdrop-blur-sm shadow-lg h-full flex flex-col">
                            <CardHeader className="border-b border-border/50 bg-gradient-to-r from-card/80 to-card/60 shrink-0">
                                <CardTitle className="flex items-center gap-3">
                                    <div className="h-8 w-1 rounded-full bg-gradient-to-b from-green-500 via-emerald-500 to-teal-500"></div>
                                    Recommendations
                                </CardTitle>
                                <CardDescription>AI-powered product suggestions</CardDescription>
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
                                            <p className="text-sm font-medium">Analyzing products...</p>
                                        </div>
                                    </div>
                                ) : recommendations ? (
                                    recommendations.status === 'error' ? (
                                        <Alert className="border-destructive/50 bg-destructive/5">
                                            <AlertTriangle className="h-4 w-4 text-destructive" />
                                            <AlertDescription className="text-xs text-destructive/80">
                                                {recommendations.message || "An error occurred"}
                                            </AlertDescription>
                                        </Alert>
                                    ) : (
                                        <div className="space-y-4">
                                            {recommendations.agent_id && (
                                                <div className="flex items-center justify-between text-sm text-muted-foreground pb-2 border-b border-border/50">
                                                    <span>Agent: {recommendations.agent_id}</span>
                                                    {recommendations.ml_enabled && (
                                                        <Badge variant="outline" className="text-xs">ML Enabled</Badge>
                                                    )}
                                                </div>
                                            )}
                                            {recommendations.recommendations && recommendations.recommendations.length > 0 ? (
                                                recommendations.recommendations.map((rec, i) => (
                                                    <div key={i} className="bg-card/50 border border-border/50 rounded-xl p-4 shadow-sm space-y-3">
                                                        <div className="flex justify-between items-start">
                                                            <div className="flex-1">
                                                                <h4 className="font-semibold text-sm mb-1">{rec.name}</h4>
                                                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                                    <Badge variant="outline" className="text-xs">{rec.category}</Badge>
                                                                    <span className="font-medium text-primary">${rec.price.toFixed(2)}</span>
                                                                </div>
                                                            </div>
                                                            <Badge variant={getConfidenceBadge(rec.confidence_score) as any} className="text-xs">
                                                                {Math.round(rec.confidence_score * 100)}%
                                                            </Badge>
                                                        </div>
                                                        <p className="text-xs text-muted-foreground">{rec.reason}</p>
                                                        <div className="flex items-center gap-2 text-xs">
                                                            <Package className="h-3 w-3 text-muted-foreground" />
                                                            <span className="text-muted-foreground">ID: {rec.product_id}</span>
                                                            <span className="text-muted-foreground">•</span>
                                                            <span className="text-muted-foreground">Source: {rec.source}</span>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="text-center text-muted-foreground py-8">No recommendations found.</div>
                                            )}
                                        </div>
                                    )
                                ) : (
                                    <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
                                        <div className="text-center space-y-3">
                                            <div className="flex justify-center">
                                                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/10 to-purple-500/10 flex items-center justify-center">
                                                    <ShoppingCart className="h-6 w-6 text-primary/50" />
                                                </div>
                                            </div>
                                            <p>Enter a product ID to get recommendations</p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Search Products Tab */}
                <TabsContent value="search" className="space-y-6">
                    <div className="grid gap-6 lg:grid-cols-2">
                        <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-lg h-full flex flex-col">
                            <CardHeader className="border-b border-border/50 bg-gradient-to-r from-card to-card/80">
                                <CardTitle className="flex items-center gap-3">
                                    <div className="h-8 w-1 rounded-full bg-gradient-to-b from-primary via-purple-500 to-blue-500"></div>
                                    Product Search
                                </CardTitle>
                                <CardDescription>Search for products in the catalog</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-4 flex-1 flex flex-col">
                                <div className="space-y-4 flex-1">
                                    <div className="space-y-2">
                                        <Label htmlFor="search-query">Search Query *</Label>
                                        <Input
                                            id="search-query"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="e.g., backpack, laptop, smartphone"
                                        />
                                    </div>
                                    {sessionId && (
                                        <div className="space-y-2">
                                            <Label htmlFor="search-session-id">Session ID</Label>
                                            <Input
                                                id="search-session-id"
                                                value={sessionId}
                                                onChange={(e) => setSessionId(e.target.value)}
                                                disabled
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-2 pt-4 mt-auto border-t border-border/50">
                                    <Button
                                        onClick={handleSearchProducts}
                                        disabled={isLoading || !searchQuery.trim()}
                                        className="flex-1 bg-gradient-to-r from-primary via-purple-500 to-blue-500 hover:from-primary/90 hover:via-purple-500/90 hover:to-blue-500/90 text-white shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300"
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Searching...
                                            </>
                                        ) : (
                                            <>
                                                <Search className="mr-2 h-4 w-4" />
                                                Search Products
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-border/50 bg-gradient-to-br from-muted/30 via-muted/20 to-card/50 backdrop-blur-sm shadow-lg h-full flex flex-col">
                            <CardHeader className="border-b border-border/50 bg-gradient-to-r from-card/80 to-card/60 shrink-0">
                                <CardTitle className="flex items-center gap-3">
                                    <div className="h-8 w-1 rounded-full bg-gradient-to-b from-green-500 via-emerald-500 to-teal-500"></div>
                                    Search Results
                                </CardTitle>
                                <CardDescription>Found products matching your query</CardDescription>
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
                                            <p className="text-sm font-medium">Searching products...</p>
                                        </div>
                                    </div>
                                ) : searchResults ? (
                                    searchResults.status === 'error' ? (
                                        <Alert className="border-destructive/50 bg-destructive/5">
                                            <AlertTriangle className="h-4 w-4 text-destructive" />
                                            <AlertDescription className="text-xs text-destructive/80">
                                                {searchResults.message || "An error occurred"}
                                            </AlertDescription>
                                        </Alert>
                                    ) : (
                                        <div className="space-y-4">
                                            {searchResults.query && (
                                                <div className="text-sm text-muted-foreground pb-2 border-b border-border/50">
                                                    Results for: <span className="font-medium">{searchResults.query}</span>
                                                    {searchResults.count !== undefined && (
                                                        <span className="ml-2">({searchResults.count} found)</span>
                                                    )}
                                                </div>
                                            )}
                                            {searchResults.results && searchResults.results.length > 0 ? (
                                                searchResults.results.map((result, i) => (
                                                    <div key={i} className="bg-card/50 border border-border/50 rounded-xl p-4 shadow-sm space-y-2">
                                                        <div className="flex justify-between items-start">
                                                            <div className="flex-1">
                                                                <h4 className="font-semibold text-sm mb-1">{result.name}</h4>
                                                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                                    <Badge variant="outline" className="text-xs">{result.category}</Badge>
                                                                    <span className="font-medium text-primary">${result.price.toFixed(2)}</span>
                                                                    {result.rating && (
                                                                        <>
                                                                            <span className="text-muted-foreground">•</span>
                                                                            <span className="text-muted-foreground">⭐ {result.rating.toFixed(1)}</span>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {result.description && (
                                                            <p className="text-xs text-muted-foreground line-clamp-2">{result.description}</p>
                                                        )}
                                                        <div className="flex items-center gap-2 text-xs">
                                                            <Package className="h-3 w-3 text-muted-foreground" />
                                                            <span className="text-muted-foreground">ID: {result.product_id}</span>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="text-center text-muted-foreground py-8">No products found.</div>
                                            )}
                                        </div>
                                    )
                                ) : (
                                    <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
                                        <div className="text-center space-y-3">
                                            <div className="flex justify-center">
                                                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/10 to-purple-500/10 flex items-center justify-center">
                                                    <Search className="h-6 w-6 text-primary/50" />
                                                </div>
                                            </div>
                                            <p>Enter a search query to find products</p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Agent Status Tab */}
                <TabsContent value="status" className="space-y-6">
                    <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-lg">
                        <CardHeader className="border-b border-border/50 bg-gradient-to-r from-card to-card/80">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-3">
                                        <div className="h-8 w-1 rounded-full bg-gradient-to-b from-primary via-purple-500 to-blue-500"></div>
                                        Agent Status
                                    </CardTitle>
                                    <CardDescription>Check the status and capabilities of the Cross-Sell Suggestion Agent</CardDescription>
                                </div>
                                <Button
                                    onClick={handleGetStatus}
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
                                        <p className="text-sm font-medium">Loading status...</p>
                                    </div>
                                </div>
                            ) : agentStatus ? (
                                agentStatus.status === 'error' ? (
                                    <Alert className="border-destructive/50 bg-destructive/5">
                                        <AlertTriangle className="h-4 w-4 text-destructive" />
                                        <AlertDescription className="text-xs text-destructive/80">
                                            {agentStatus.message || "An error occurred"}
                                        </AlertDescription>
                                    </Alert>
                                ) : (
                                    <div className="space-y-6">
                                        {agentStatus.agent_metadata && (
                                            <div className="space-y-4">
                                                <div className="bg-card/50 border border-border/50 rounded-xl p-4 shadow-sm">
                                                    <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                                                        <Info className="h-4 w-4 text-primary" />
                                                        Agent Information
                                                    </h3>
                                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                                        <div>
                                                            <span className="text-muted-foreground">Agent ID:</span>
                                                            <p className="font-medium">{agentStatus.agent_metadata.agent_id}</p>
                                                        </div>
                                                        <div>
                                                            <span className="text-muted-foreground">Version:</span>
                                                            <p className="font-medium">{agentStatus.agent_metadata.version}</p>
                                                        </div>
                                                        <div className="col-span-2">
                                                            <span className="text-muted-foreground">Name:</span>
                                                            <p className="font-medium">{agentStatus.agent_metadata.agent_name}</p>
                                                        </div>
                                                        <div className="col-span-2">
                                                            <span className="text-muted-foreground">ML Enabled:</span>
                                                            <Badge variant={agentStatus.agent_metadata.ml_enabled ? "default" : "outline"} className="ml-2">
                                                                {agentStatus.agent_metadata.ml_enabled ? "Yes" : "No"}
                                                            </Badge>
                                                        </div>
                                                        {agentStatus.agent_metadata.capabilities && (
                                                            <div className="col-span-2">
                                                                <span className="text-muted-foreground">Capabilities:</span>
                                                                <div className="flex flex-wrap gap-2 mt-2">
                                                                    {agentStatus.agent_metadata.capabilities.map((cap, i) => (
                                                                        <Badge key={i} variant="secondary" className="text-xs">
                                                                            {cap}
                                                                        </Badge>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        <div className="grid grid-cols-3 gap-4">
                                            {agentStatus.memory_sessions !== undefined && (
                                                <div className="bg-card/50 border border-border/50 rounded-xl p-4 shadow-sm text-center">
                                                    <p className="text-2xl font-bold text-primary">{agentStatus.memory_sessions}</p>
                                                    <p className="text-xs text-muted-foreground mt-1">Active Sessions</p>
                                                </div>
                                            )}
                                            {agentStatus.total_products !== undefined && (
                                                <div className="bg-card/50 border border-border/50 rounded-xl p-4 shadow-sm text-center">
                                                    <p className="text-2xl font-bold text-primary">{agentStatus.total_products.toLocaleString()}</p>
                                                    <p className="text-xs text-muted-foreground mt-1">Total Products</p>
                                                </div>
                                            )}
                                            {agentStatus.ml_model_loaded !== undefined && (
                                                <div className="bg-card/50 border border-border/50 rounded-xl p-4 shadow-sm text-center">
                                                    <p className="text-2xl font-bold text-primary">{agentStatus.ml_model_loaded ? "✓" : "✗"}</p>
                                                    <p className="text-xs text-muted-foreground mt-1">ML Model</p>
                                                </div>
                                            )}
                                        </div>
                                        {agentStatus.status && (
                                            <div className="bg-card/50 border border-border/50 rounded-xl p-4 shadow-sm">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-medium">Status:</span>
                                                    <Badge variant={agentStatus.status === 'operational' ? 'default' : 'secondary'}>
                                                        {agentStatus.status}
                                                    </Badge>
                                                </div>
                                            </div>
                                        )}
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
                                        <p>Click Refresh to check agent status</p>
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

