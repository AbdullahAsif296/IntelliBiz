"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Loader2,
    Send,
    Mail,
    User,
    Tag,
    AlertCircle,
    CheckCircle2,
    History,
    RefreshCcw
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface EmailRecord {
    email_id: string;
    subject: string;
    body_preview: string;
    sent_at: string;
    category: string;
    to: string;
    influencer_name: string;
    body: string;
    priority: string;
    delivery_status: string;
}

interface SendEmailResponse {
    status: string;
    task_id: string;
    email_content: {
        to: string;
        subject: string;
        body: string;
        sent_at: string;
    };
    tracking_info: {
        email_id: string;
        delivery_status: string;
        db_status: string;
    };
}

export function InfluencerEngagementForm() {
    // Form State
    const [name, setName] = useState("John Doe");
    const [email, setEmail] = useState("john@example.com");
    const [subject, setSubject] = useState("Collaboration Opportunity");
    const [description, setDescription] = useState("We'd like to discuss a partnership.");
    const [category, setCategory] = useState("meeting");
    const [priority, setPriority] = useState("high");

    // UI State
    const [isSending, setIsSending] = useState(false);
    const [sendResult, setSendResult] = useState<SendEmailResponse | null>(null);
    const [sendError, setSendError] = useState<string | null>(null);

    // History State
    const [emailHistory, setEmailHistory] = useState<EmailRecord[]>([]);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);
    const [historyError, setHistoryError] = useState<string | null>(null);

    const handleSendEmail = async () => {
        setIsSending(true);
        setSendResult(null);
        setSendError(null);

        try {
            const response = await fetch('/api/proxy/influencer/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    request_type: "send_email",
                    influencer: { name, email },
                    email_details: { subject, description, category },
                    meta: { priority }
                })
            });

            if (!response.ok) throw new Error(`API error: ${response.status}`);
            const data = await response.json();
            setSendResult(data);
            // Refresh history after sending
            fetchHistory();
        } catch (err) {
            setSendError(err instanceof Error ? err.message : "Failed to send email");
        } finally {
            setIsSending(false);
        }
    };

    const fetchHistory = async () => {
        setIsLoadingHistory(true);
        setHistoryError(null);
        try {
            const response = await fetch('/api/proxy/influencer/emails');
            if (!response.ok) throw new Error(`API error: ${response.status}`);
            const data = await response.json();
            if (data.status === "success" && Array.isArray(data.emails)) {
                setEmailHistory(data.emails);
            }
        } catch (err) {
            setHistoryError(err instanceof Error ? err.message : "Failed to load history");
        } finally {
            setIsLoadingHistory(false);
        }
    };

    // Load history on mount
    useEffect(() => {
        fetchHistory();
    }, []);

    const getPriorityColor = (p: string) => {
        switch (p.toLowerCase()) {
            case 'high': return 'destructive';
            case 'medium': return 'secondary';
            default: return 'outline';
        }
    };

    return (
        <div className="space-y-6">
            <Tabs defaultValue="compose" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="compose">Compose Outreach</TabsTrigger>
                    <TabsTrigger value="history">Email History</TabsTrigger>
                </TabsList>

                {/* Compose Tab */}
                <TabsContent value="compose" className="space-y-4">
                    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Mail className="h-5 w-5 text-primary" />
                                Draft & Send Email
                            </CardTitle>
                            <CardDescription>
                                AI-powered outreach generation and delivery
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {sendError && (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>Error</AlertTitle>
                                    <AlertDescription>{sendError}</AlertDescription>
                                </Alert>
                            )}

                            {sendResult && (
                                <Alert className="border-green-500/50 bg-green-500/10 text-green-600">
                                    <CheckCircle2 className="h-4 w-4" />
                                    <AlertTitle>Success</AlertTitle>
                                    <AlertDescription>
                                        Email queued successfully! Task ID: {sendResult.task_id}
                                    </AlertDescription>
                                </Alert>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Influencer Name</Label>
                                    <div className="relative">
                                        <User className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            className="pl-8"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Email Address</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            className="pl-8"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Subject Line</Label>
                                <Input
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Description / Context</Label>
                                <Textarea
                                    className="min-h-[100px]"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Category</Label>
                                    <Select value={category} onValueChange={setCategory}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="meeting">Meeting Request</SelectItem>
                                            <SelectItem value="collaboration">Collaboration</SelectItem>
                                            <SelectItem value="sponsorship">Sponsorship</SelectItem>
                                            <SelectItem value="follow_up">Follow Up</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Priority</Label>
                                    <Select value={priority} onValueChange={setPriority}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="high">High</SelectItem>
                                            <SelectItem value="medium">Medium</SelectItem>
                                            <SelectItem value="low">Low</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <Button
                                className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                                onClick={handleSendEmail}
                                disabled={isSending}
                            >
                                {isSending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <Send className="mr-2 h-4 w-4" />
                                        Generate & Send Email
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* History Tab */}
                <TabsContent value="history">
                    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <History className="h-5 w-5 text-primary" />
                                    Sent Emails
                                </CardTitle>
                                <CardDescription>
                                    Track all outreach campaigns
                                </CardDescription>
                            </div>
                            <Button variant="ghost" size="icon" onClick={fetchHistory} disabled={isLoadingHistory}>
                                <RefreshCcw className={`h-4 w-4 ${isLoadingHistory ? 'animate-spin' : ''}`} />
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {historyError && (
                                <Alert variant="destructive" className="mb-4">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>Error</AlertTitle>
                                    <AlertDescription>{historyError}</AlertDescription>
                                </Alert>
                            )}

                            {isLoadingHistory && emailHistory.length === 0 ? (
                                <div className="flex justify-center py-8">
                                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                                </div>
                            ) : emailHistory.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    No emails sent yet.
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {emailHistory.map((email) => (
                                        <div
                                            key={email.email_id}
                                            className="p-4 rounded-lg border border-border/50 bg-card/30 hover:bg-card/50 transition-colors space-y-3"
                                        >
                                            <div className="flex justify-between items-start">
                                                <div className="space-y-1">
                                                    <h4 className="font-semibold text-sm">{email.subject}</h4>
                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                        <User className="h-3 w-3" />
                                                        {email.influencer_name} ({email.to})
                                                    </div>
                                                </div>
                                                <Badge variant={getPriorityColor(email.priority) as any}>
                                                    {email.priority}
                                                </Badge>
                                            </div>

                                            <div className="text-xs bg-muted/50 p-2 rounded text-muted-foreground line-clamp-2">
                                                {email.body_preview}
                                            </div>

                                            <div className="flex justify-between items-center text-xs text-muted-foreground pt-2 border-t border-border/30">
                                                <div className="flex items-center gap-2">
                                                    <Tag className="h-3 w-3" />
                                                    <span className="capitalize">{email.category}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className={`h-2 w-2 rounded-full ${email.delivery_status === 'queued' ? 'bg-yellow-500' : 'bg-green-500'}`}></span>
                                                    <span className="capitalize">{email.delivery_status}</span>
                                                    <span>• {new Date(email.sent_at).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
