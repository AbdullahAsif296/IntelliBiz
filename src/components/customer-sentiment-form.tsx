"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Loader2,
    Sparkles,
    AlertTriangle,
    CheckCircle2,
    MessageSquare,
    ThumbsUp,
    Repeat,
    Globe,
    Hash,
    User,
    Calendar,
    BarChart3,
    BrainCircuit
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface Emotion {
    emotion: string;
    score: number;
}

interface CustomerSentimentResponse {
    sentiment_label: string;
    sentiment_score: number;
    emotion_analysis: Emotion[];
    engagement_prediction: string;
    topic_extracted: string[];
    region: string;
    recommendation: string;
    database_status: string;
    langgraph_status: string;
    timestamp: string;
}

export function CustomerSentimentForm() {
    // Form fields
    const [userId, setUserId] = useState("user_1234");
    const [platform, setPlatform] = useState("twitter");
    const [timestamp, setTimestamp] = useState("2025-10-21T13:45:00Z");
    const [text, setText] = useState("The new product launch blew my mind! So innovative 🔥 #TechTrends");
    const [hashtags, setHashtags] = useState("TechTrends");
    const [likes, setLikes] = useState("542");
    const [retweets, setRetweets] = useState("120");
    const [country, setCountry] = useState("Germany");

    // State
    const [output, setOutput] = useState<CustomerSentimentResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        if (!userId || !text) {
            setError("User ID and Text are required");
            return;
        }

        setIsLoading(true);
        setOutput(null);
        setError(null);

        try {
            // Parse hashtags string into array
            const hashtagsArray = hashtags.split(',').map(tag => tag.trim()).filter(tag => tag !== "");

            const response = await fetch('https://customer-sentiment-agent-g5gd.onrender.com/analyze', {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user: userId,
                    platform,
                    timestamp,
                    text,
                    hashtags: hashtagsArray,
                    likes: parseInt(likes) || 0,
                    retweets: parseInt(retweets) || 0,
                    country
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
        setUserId("");
        setPlatform("twitter");
        setTimestamp(new Date().toISOString());
        setText("");
        setHashtags("");
        setLikes("0");
        setRetweets("0");
        setCountry("");
        setOutput(null);
        setError(null);
    };

    const getSentimentColor = (label: string) => {
        switch (label.toLowerCase()) {
            case 'positive': return 'bg-green-500 hover:bg-green-600';
            case 'negative': return 'bg-red-500 hover:bg-red-600';
            default: return 'bg-yellow-500 hover:bg-yellow-600';
        }
    };

    return (
        <div className="space-y-6">
            {/* API Status Indicator */}
            <Alert className="border-primary/20 bg-gradient-to-r from-primary/5 to-purple-500/5">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <AlertTitle className="text-sm font-semibold">Live API Integration</AlertTitle>
                <AlertDescription className="text-xs text-muted-foreground">
                    This form sends data to the Customer Sentiment Agent API at{" "}
                    <code className="text-xs bg-muted px-1 py-0.5 rounded">customer-sentiment-agent-g5gd.onrender.com</code>
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
                            Sentiment Analysis Input
                        </CardTitle>
                        <CardDescription>Analyze customer feedback from various platforms</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6 flex-1 overflow-y-auto max-h-[calc(100vh-20rem)]">
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="user-id" className="flex items-center gap-2">
                                        <User className="h-4 w-4 text-muted-foreground" />
                                        User ID
                                    </Label>
                                    <Input
                                        id="user-id"
                                        value={userId}
                                        onChange={(e) => setUserId(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="platform" className="flex items-center gap-2">
                                        <Globe className="h-4 w-4 text-muted-foreground" />
                                        Platform
                                    </Label>
                                    <Select value={platform} onValueChange={setPlatform}>
                                        <SelectTrigger id="platform">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="twitter">Twitter</SelectItem>
                                            <SelectItem value="facebook">Facebook</SelectItem>
                                            <SelectItem value="instagram">Instagram</SelectItem>
                                            <SelectItem value="linkedin">LinkedIn</SelectItem>
                                            <SelectItem value="email">Email</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="timestamp" className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    Timestamp
                                </Label>
                                <Input
                                    id="timestamp"
                                    value={timestamp}
                                    onChange={(e) => setTimestamp(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="text" className="flex items-center gap-2">
                                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                                    Content / Text
                                </Label>
                                <Textarea
                                    id="text"
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    className="min-h-[100px] resize-none"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="hashtags" className="flex items-center gap-2">
                                    <Hash className="h-4 w-4 text-muted-foreground" />
                                    Hashtags (comma separated)
                                </Label>
                                <Input
                                    id="hashtags"
                                    value={hashtags}
                                    onChange={(e) => setHashtags(e.target.value)}
                                    placeholder="TechTrends, Innovation"
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="likes" className="flex items-center gap-2">
                                        <ThumbsUp className="h-4 w-4 text-muted-foreground" />
                                        Likes
                                    </Label>
                                    <Input
                                        id="likes"
                                        type="number"
                                        value={likes}
                                        onChange={(e) => setLikes(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="retweets" className="flex items-center gap-2">
                                        <Repeat className="h-4 w-4 text-muted-foreground" />
                                        Retweets
                                    </Label>
                                    <Input
                                        id="retweets"
                                        type="number"
                                        value={retweets}
                                        onChange={(e) => setRetweets(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="country" className="flex items-center gap-2">
                                        <Globe className="h-4 w-4 text-muted-foreground" />
                                        Country
                                    </Label>
                                    <Input
                                        id="country"
                                        value={country}
                                        onChange={(e) => setCountry(e.target.value)}
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
                                        Analyzing...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="mr-2 h-4 w-4" />
                                        Analyze Sentiment
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
                        <CardDescription>AI-generated sentiment & insights</CardDescription>
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
                                    <p className="text-sm font-medium">Processing sentiment analysis...</p>
                                </div>
                            </div>
                        ) : output ? (
                            <div className="space-y-6">
                                {/* Top Stats */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-card/50 border border-border/50 rounded-xl p-4 shadow-sm flex flex-col items-center justify-center gap-2">
                                        <span className="text-xs font-semibold uppercase text-muted-foreground">Sentiment</span>
                                        <Badge className={`text-base px-4 py-1 capitalize ${getSentimentColor(output.sentiment_label)}`}>
                                            {output.sentiment_label}
                                        </Badge>
                                        <span className="text-xs text-muted-foreground">Score: {output.sentiment_score}</span>
                                    </div>
                                    <div className="bg-card/50 border border-border/50 rounded-xl p-4 shadow-sm flex flex-col items-center justify-center gap-2">
                                        <span className="text-xs font-semibold uppercase text-muted-foreground">Engagement</span>
                                        <Badge variant="outline" className="text-base px-4 py-1 capitalize border-primary/20 text-primary">
                                            {output.engagement_prediction}
                                        </Badge>
                                        <span className="text-xs text-muted-foreground">Prediction</span>
                                    </div>
                                </div>

                                {/* Recommendation */}
                                <div className="bg-card/50 border border-border/50 rounded-xl p-4 shadow-sm">
                                    <div className="flex items-center gap-2 mb-2">
                                        <BrainCircuit className="h-4 w-4 text-primary" />
                                        <Label className="text-xs font-semibold uppercase text-muted-foreground">Recommendation</Label>
                                    </div>
                                    <p className="text-sm font-medium">{output.recommendation}</p>
                                </div>

                                {/* Emotion Analysis */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                                        <Label className="text-xs font-semibold uppercase text-muted-foreground">Emotion Analysis</Label>
                                    </div>
                                    <div className="space-y-2">
                                        {output.emotion_analysis.map((emotion, i) => (
                                            <div key={i} className="space-y-1">
                                                <div className="flex justify-between text-xs">
                                                    <span className="capitalize">{emotion.emotion}</span>
                                                    <span>{(emotion.score * 100).toFixed(1)}%</span>
                                                </div>
                                                <div className="h-2 w-full bg-muted/50 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-primary to-purple-500"
                                                        style={{ width: `${emotion.score * 100}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Topics */}
                                <div className="space-y-2">
                                    <Label className="text-xs font-semibold uppercase text-muted-foreground">Extracted Topics</Label>
                                    <div className="flex flex-wrap gap-2">
                                        {output.topic_extracted.map((topic, i) => (
                                            <Badge key={i} variant="secondary" className="bg-muted/50 hover:bg-muted/70">
                                                #{topic}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                {/* Footer Info */}
                                <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-4 border-t border-border/30">
                                    <div className="flex gap-2">
                                        <span>Region: {output.region}</span>
                                        <span>•</span>
                                        <span>Status: {output.langgraph_status}</span>
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
                                    <p>Run the analysis to see sentiment insights</p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
