"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Save } from "lucide-react";

export default function SettingsPage() {
    return (
        <div className="space-y-6 max-w-4xl">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">
                    Configure your agent platform preferences and API connections.
                </p>
            </div>

            <Separator />

            <div className="grid gap-6">
                {/* API Configuration */}
                <Card>
                    <CardHeader>
                        <CardTitle>API Configuration</CardTitle>
                        <CardDescription>
                            Configure endpoints for your deployed agents. Each agent can have its own API endpoint.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="base-url">Base API URL</Label>
                            <Input
                                id="base-url"
                                placeholder="https://api.yourdomain.com"
                                defaultValue=""
                            />
                            <p className="text-xs text-muted-foreground">
                                The base URL for all agent API endpoints.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="api-key">API Key</Label>
                            <Input
                                id="api-key"
                                type="password"
                                placeholder="Enter your API key"
                                defaultValue=""
                            />
                            <p className="text-xs text-muted-foreground">
                                Your authentication key for accessing the agent APIs.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Agent Status */}
                <Card>
                    <CardHeader>
                        <CardTitle>Agent Status</CardTitle>
                        <CardDescription>
                            Overview of your deployed agents and their connection status.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between py-2">
                                <div className="space-y-0.5">
                                    <p className="text-sm font-medium">Market Trend Monitor</p>
                                    <p className="text-xs text-muted-foreground">Last updated: 2 hours ago</p>
                                </div>
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                    Connected
                                </Badge>
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between py-2">
                                <div className="space-y-0.5">
                                    <p className="text-sm font-medium">Competitor Tracker</p>
                                    <p className="text-xs text-muted-foreground">Last updated: 5 hours ago</p>
                                </div>
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                    Connected
                                </Badge>
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between py-2">
                                <div className="space-y-0.5">
                                    <p className="text-sm font-medium">Customer Sentiment</p>
                                    <p className="text-xs text-muted-foreground">Configuration required</p>
                                </div>
                                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                                    Pending
                                </Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Preferences */}
                <Card>
                    <CardHeader>
                        <CardTitle>Preferences</CardTitle>
                        <CardDescription>
                            Customize your platform experience.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="timeout">Request Timeout (seconds)</Label>
                            <Input
                                id="timeout"
                                type="number"
                                placeholder="30"
                                defaultValue="30"
                            />
                            <p className="text-xs text-muted-foreground">
                                Maximum time to wait for agent responses.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="retry">Max Retry Attempts</Label>
                            <Input
                                id="retry"
                                type="number"
                                placeholder="3"
                                defaultValue="3"
                            />
                            <p className="text-xs text-muted-foreground">
                                Number of times to retry failed requests.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end">
                    <Button size="lg">
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                    </Button>
                </div>
            </div>
        </div>
    );
}
