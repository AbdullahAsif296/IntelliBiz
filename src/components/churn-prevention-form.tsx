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
    User,
    Calendar,
    Phone,
    Wifi,
    Shield,
    Database,
    Tv,
    FileText,
    CreditCard,
    DollarSign,
    TrendingUp,
    AlertCircle
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ChurnPredictionResponse {
    status: string;
    prediction: {
        customer_id: string;
        churn_probability: number;
        will_churn: boolean;
        risk_category: string;
        confidence: string;
        top_risk_factors: string[];
        recommendation: {
            action: string;
            priority: string;
            discount: string;
            duration: string;
            suggestions: string[];
            customer_insights: string[];
        };
        timestamp: string;
    };
    request_type: string;
    recommendation_level: string;
    timestamp: string;
}

export function ChurnPreventionForm() {
    // Customer Information
    const [customerId, setCustomerId] = useState("CUST-001");
    const [gender, setGender] = useState("Male");
    const [seniorCitizen, setSeniorCitizen] = useState("0");
    const [partner, setPartner] = useState("Yes");
    const [dependents, setDependents] = useState("No");
    const [tenure, setTenure] = useState("12");

    // Services
    const [phoneService, setPhoneService] = useState("Yes");
    const [multipleLines, setMultipleLines] = useState("No");
    const [internetService, setInternetService] = useState("Fiber optic");
    const [onlineSecurity, setOnlineSecurity] = useState("No");
    const [onlineBackup, setOnlineBackup] = useState("Yes");
    const [deviceProtection, setDeviceProtection] = useState("No");
    const [techSupport, setTechSupport] = useState("No");
    const [streamingTV, setStreamingTV] = useState("Yes");
    const [streamingMovies, setStreamingMovies] = useState("No");

    // Contract & Billing
    const [contract, setContract] = useState("Month-to-month");
    const [paperlessBilling, setPaperlessBilling] = useState("Yes");
    const [paymentMethod, setPaymentMethod] = useState("Electronic check");
    const [monthlyCharges, setMonthlyCharges] = useState("70.5");
    const [totalCharges, setTotalCharges] = useState("850");

    // Prediction Settings
    const [predictionType, setPredictionType] = useState("standard");
    const [recommendationType, setRecommendationType] = useState("balanced");

    // State
    const [output, setOutput] = useState<ChurnPredictionResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        if (!customerId) {
            setError("Customer ID is required");
            return;
        }

        setIsLoading(true);
        setOutput(null);
        setError(null);

        try {
            const response = await fetch('https://spmproject-production.up.railway.app/api/v1/predict', {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    customer: {
                        gender,
                        SeniorCitizen: parseInt(seniorCitizen),
                        Partner: partner,
                        Dependents: dependents,
                        tenure: parseInt(tenure),
                        PhoneService: phoneService,
                        MultipleLines: multipleLines,
                        InternetService: internetService,
                        OnlineSecurity: onlineSecurity,
                        OnlineBackup: onlineBackup,
                        DeviceProtection: deviceProtection,
                        TechSupport: techSupport,
                        StreamingTV: streamingTV,
                        StreamingMovies: streamingMovies,
                        Contract: contract,
                        PaperlessBilling: paperlessBilling,
                        PaymentMethod: paymentMethod,
                        MonthlyCharges: parseFloat(monthlyCharges),
                        TotalCharges: parseFloat(totalCharges),
                        customerID: customerId
                    },
                    prediction_type: predictionType,
                    recommendation_type: recommendationType
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
        setCustomerId("");
        setGender("Male");
        setSeniorCitizen("0");
        setPartner("No");
        setDependents("No");
        setTenure("0");
        setPhoneService("No");
        setMultipleLines("No");
        setInternetService("No");
        setOnlineSecurity("No");
        setOnlineBackup("No");
        setDeviceProtection("No");
        setTechSupport("No");
        setStreamingTV("No");
        setStreamingMovies("No");
        setContract("Month-to-month");
        setPaperlessBilling("No");
        setPaymentMethod("Electronic check");
        setMonthlyCharges("0");
        setTotalCharges("0");
        setOutput(null);
        setError(null);
    };

    const getRiskColor = (risk: string) => {
        switch (risk.toLowerCase()) {
            case 'low': return "text-green-500";
            case 'medium': return "text-yellow-500";
            case 'high': return "text-red-500";
            default: return "text-gray-500";
        }
    };

    const getRiskBadgeVariant = (risk: string) => {
        switch (risk.toLowerCase()) {
            case 'low': return 'default';
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
                    This form sends data to the Churn Prediction API at{" "}
                    <code className="text-xs bg-muted px-1 py-0.5 rounded">spmproject-production.up.railway.app</code>
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
                            Customer Churn Analysis
                        </CardTitle>
                        <CardDescription>Predict customer churn risk and get retention recommendations</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6 flex-1 overflow-y-auto max-h-[calc(100vh-20rem)]">
                        <div className="space-y-4">
                            {/* Customer Information */}
                            <div className="space-y-3">
                                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Customer Information</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="customer-id" className="flex items-center gap-2">
                                            <User className="h-4 w-4 text-muted-foreground" />
                                            Customer ID
                                        </Label>
                                        <Input
                                            id="customer-id"
                                            value={customerId}
                                            onChange={(e) => setCustomerId(e.target.value)}
                                            placeholder="CUST-001"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="gender" className="flex items-center gap-2">
                                            <User className="h-4 w-4 text-muted-foreground" />
                                            Gender
                                        </Label>
                                        <Select value={gender} onValueChange={setGender}>
                                            <SelectTrigger id="gender">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Male">Male</SelectItem>
                                                <SelectItem value="Female">Female</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="senior" className="flex items-center gap-2">
                                            Senior Citizen
                                        </Label>
                                        <Select value={seniorCitizen} onValueChange={setSeniorCitizen}>
                                            <SelectTrigger id="senior">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="0">No</SelectItem>
                                                <SelectItem value="1">Yes</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="partner">Partner</Label>
                                        <Select value={partner} onValueChange={setPartner}>
                                            <SelectTrigger id="partner">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Yes">Yes</SelectItem>
                                                <SelectItem value="No">No</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="dependents">Dependents</Label>
                                        <Select value={dependents} onValueChange={setDependents}>
                                            <SelectTrigger id="dependents">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Yes">Yes</SelectItem>
                                                <SelectItem value="No">No</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="tenure" className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        Tenure (months)
                                    </Label>
                                    <Input
                                        id="tenure"
                                        type="number"
                                        value={tenure}
                                        onChange={(e) => setTenure(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Services */}
                            <div className="space-y-3">
                                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Services</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="phone" className="flex items-center gap-2">
                                            <Phone className="h-4 w-4 text-muted-foreground" />
                                            Phone Service
                                        </Label>
                                        <Select value={phoneService} onValueChange={setPhoneService}>
                                            <SelectTrigger id="phone">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Yes">Yes</SelectItem>
                                                <SelectItem value="No">No</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="multiple-lines">Multiple Lines</Label>
                                        <Select value={multipleLines} onValueChange={setMultipleLines}>
                                            <SelectTrigger id="multiple-lines">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Yes">Yes</SelectItem>
                                                <SelectItem value="No">No</SelectItem>
                                                <SelectItem value="No phone service">No phone service</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="internet" className="flex items-center gap-2">
                                        <Wifi className="h-4 w-4 text-muted-foreground" />
                                        Internet Service
                                    </Label>
                                    <Select value={internetService} onValueChange={setInternetService}>
                                        <SelectTrigger id="internet">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="DSL">DSL</SelectItem>
                                            <SelectItem value="Fiber optic">Fiber optic</SelectItem>
                                            <SelectItem value="No">No</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="security" className="flex items-center gap-2">
                                            <Shield className="h-4 w-4 text-muted-foreground" />
                                            Online Security
                                        </Label>
                                        <Select value={onlineSecurity} onValueChange={setOnlineSecurity}>
                                            <SelectTrigger id="security">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Yes">Yes</SelectItem>
                                                <SelectItem value="No">No</SelectItem>
                                                <SelectItem value="No internet service">No internet service</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="backup" className="flex items-center gap-2">
                                            <Database className="h-4 w-4 text-muted-foreground" />
                                            Online Backup
                                        </Label>
                                        <Select value={onlineBackup} onValueChange={setOnlineBackup}>
                                            <SelectTrigger id="backup">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Yes">Yes</SelectItem>
                                                <SelectItem value="No">No</SelectItem>
                                                <SelectItem value="No internet service">No internet service</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="device-protection">Device Protection</Label>
                                        <Select value={deviceProtection} onValueChange={setDeviceProtection}>
                                            <SelectTrigger id="device-protection">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Yes">Yes</SelectItem>
                                                <SelectItem value="No">No</SelectItem>
                                                <SelectItem value="No internet service">No internet service</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="tech-support">Tech Support</Label>
                                        <Select value={techSupport} onValueChange={setTechSupport}>
                                            <SelectTrigger id="tech-support">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Yes">Yes</SelectItem>
                                                <SelectItem value="No">No</SelectItem>
                                                <SelectItem value="No internet service">No internet service</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="streaming-tv" className="flex items-center gap-2">
                                            <Tv className="h-4 w-4 text-muted-foreground" />
                                            Streaming TV
                                        </Label>
                                        <Select value={streamingTV} onValueChange={setStreamingTV}>
                                            <SelectTrigger id="streaming-tv">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Yes">Yes</SelectItem>
                                                <SelectItem value="No">No</SelectItem>
                                                <SelectItem value="No internet service">No internet service</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="streaming-movies">Streaming Movies</Label>
                                        <Select value={streamingMovies} onValueChange={setStreamingMovies}>
                                            <SelectTrigger id="streaming-movies">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Yes">Yes</SelectItem>
                                                <SelectItem value="No">No</SelectItem>
                                                <SelectItem value="No internet service">No internet service</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>

                            {/* Contract & Billing */}
                            <div className="space-y-3">
                                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Contract & Billing</h3>
                                <div className="space-y-2">
                                    <Label htmlFor="contract" className="flex items-center gap-2">
                                        <FileText className="h-4 w-4 text-muted-foreground" />
                                        Contract
                                    </Label>
                                    <Select value={contract} onValueChange={setContract}>
                                        <SelectTrigger id="contract">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Month-to-month">Month-to-month</SelectItem>
                                            <SelectItem value="One year">One year</SelectItem>
                                            <SelectItem value="Two year">Two year</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="paperless">Paperless Billing</Label>
                                        <Select value={paperlessBilling} onValueChange={setPaperlessBilling}>
                                            <SelectTrigger id="paperless">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Yes">Yes</SelectItem>
                                                <SelectItem value="No">No</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="payment" className="flex items-center gap-2">
                                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                                            Payment Method
                                        </Label>
                                        <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                                            <SelectTrigger id="payment">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Electronic check">Electronic check</SelectItem>
                                                <SelectItem value="Mailed check">Mailed check</SelectItem>
                                                <SelectItem value="Bank transfer (automatic)">Bank transfer (automatic)</SelectItem>
                                                <SelectItem value="Credit card (automatic)">Credit card (automatic)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="monthly-charges" className="flex items-center gap-2">
                                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                                            Monthly Charges
                                        </Label>
                                        <Input
                                            id="monthly-charges"
                                            type="number"
                                            step="0.01"
                                            value={monthlyCharges}
                                            onChange={(e) => setMonthlyCharges(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="total-charges">Total Charges</Label>
                                        <Input
                                            id="total-charges"
                                            type="number"
                                            step="0.01"
                                            value={totalCharges}
                                            onChange={(e) => setTotalCharges(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Prediction Settings */}
                            <div className="space-y-3">
                                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Analysis Settings</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="prediction-type">Prediction Type</Label>
                                        <Select value={predictionType} onValueChange={setPredictionType}>
                                            <SelectTrigger id="prediction-type">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="standard">Standard</SelectItem>
                                                <SelectItem value="detailed">Detailed</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="recommendation-type">Recommendation Type</Label>
                                        <Select value={recommendationType} onValueChange={setRecommendationType}>
                                            <SelectTrigger id="recommendation-type">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="conservative">Conservative</SelectItem>
                                                <SelectItem value="balanced">Balanced</SelectItem>
                                                <SelectItem value="aggressive">Aggressive</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
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
                                        Predict Churn
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
                            Churn Prediction Results
                        </CardTitle>
                        <CardDescription>AI-powered customer retention insights</CardDescription>
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
                                    <p className="text-sm font-medium">Analyzing customer data...</p>
                                </div>
                            </div>
                        ) : output ? (
                            <div className="space-y-6">
                                {/* Churn Probability */}
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
                                                className={getRiskColor(output.prediction.risk_category)}
                                                strokeWidth="8"
                                                strokeDasharray={251.2}
                                                strokeDashoffset={251.2 * (1 - output.prediction.churn_probability)}
                                                strokeLinecap="round"
                                                stroke="currentColor"
                                                fill="transparent"
                                                r="40"
                                                cx="50"
                                                cy="50"
                                            />
                                        </svg>
                                        <div className="absolute flex flex-col items-center">
                                            <span className={`text-4xl font-bold ${getRiskColor(output.prediction.risk_category)}`}>
                                                {(output.prediction.churn_probability * 100).toFixed(1)}%
                                            </span>
                                            <span className="text-xs text-muted-foreground uppercase tracking-wider">Churn Risk</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Risk Category & Will Churn */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-card/50 border border-border/50 rounded-xl p-4 shadow-sm flex flex-col items-center justify-center gap-2">
                                        <span className="text-xs font-semibold uppercase text-muted-foreground">Risk Category</span>
                                        <Badge variant={getRiskBadgeVariant(output.prediction.risk_category) as any} className="text-base px-4 py-1 capitalize">
                                            {output.prediction.risk_category}
                                        </Badge>
                                    </div>
                                    <div className="bg-card/50 border border-border/50 rounded-xl p-4 shadow-sm flex flex-col items-center justify-center gap-2">
                                        <span className="text-xs font-semibold uppercase text-muted-foreground">Will Churn</span>
                                        <Badge variant={output.prediction.will_churn ? "destructive" : "default"} className="text-base px-4 py-1">
                                            {output.prediction.will_churn ? "Yes" : "No"}
                                        </Badge>
                                    </div>
                                </div>

                                {/* Confidence */}
                                <div className="bg-card/50 border border-border/50 rounded-xl p-4 shadow-sm">
                                    <div className="flex items-center gap-2 mb-2">
                                        <TrendingUp className="h-4 w-4 text-primary" />
                                        <span className="text-sm font-semibold">Confidence Level</span>
                                    </div>
                                    <Badge variant="outline" className="text-sm">
                                        {output.prediction.confidence}
                                    </Badge>
                                </div>

                                {/* Top Risk Factors */}
                                <div className="bg-card/50 border border-border/50 rounded-xl p-4 shadow-sm">
                                    <div className="flex items-center gap-2 mb-3">
                                        <AlertCircle className="h-4 w-4 text-yellow-500" />
                                        <span className="text-sm font-semibold">Top Risk Factors</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {output.prediction.top_risk_factors.map((factor, idx) => (
                                            <Badge key={idx} variant="secondary" className="text-xs">
                                                {factor}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                {/* Recommendations */}
                                <div className="bg-card/50 border border-border/50 rounded-xl p-4 shadow-sm">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Sparkles className="h-4 w-4 text-primary" />
                                        <span className="text-sm font-semibold">Recommendations</span>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-muted-foreground">Action:</span>
                                            <Badge variant="outline">{output.prediction.recommendation.action}</Badge>
                                        </div>
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-muted-foreground">Priority:</span>
                                            <Badge variant={output.prediction.recommendation.priority === "High" ? "destructive" : "secondary"}>
                                                {output.prediction.recommendation.priority}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-muted-foreground">Discount:</span>
                                            <span className="font-medium">{output.prediction.recommendation.discount}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-muted-foreground">Duration:</span>
                                            <span className="font-medium">{output.prediction.recommendation.duration}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Suggestions */}
                                <div className="bg-card/50 border border-border/50 rounded-xl p-4 shadow-sm">
                                    <div className="flex items-center gap-2 mb-3">
                                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                                        <span className="text-sm font-semibold">Action Suggestions</span>
                                    </div>
                                    <ul className="space-y-2 text-xs text-muted-foreground">
                                        {output.prediction.recommendation.suggestions.map((suggestion, idx) => (
                                            <li key={idx} className="flex items-start gap-2">
                                                <span className="text-primary mt-0.5">•</span>
                                                <span>{suggestion}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Customer Insights */}
                                <div className="bg-card/50 border border-border/50 rounded-xl p-4 shadow-sm">
                                    <div className="flex items-center gap-2 mb-3">
                                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                                        <span className="text-sm font-semibold">Customer Insights</span>
                                    </div>
                                    <ul className="space-y-2 text-xs text-muted-foreground">
                                        {output.prediction.recommendation.customer_insights.map((insight, idx) => (
                                            <li key={idx} className="flex items-start gap-2">
                                                <span className="text-orange-500 mt-0.5">•</span>
                                                <span>{insight}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Footer Info */}
                                <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-4 border-t border-border/30">
                                    <div className="flex gap-2">
                                        <span>ID: {output.prediction.customer_id}</span>
                                        <span>•</span>
                                        <span>{output.request_type} / {output.recommendation_level}</span>
                                    </div>
                                    <span>{new Date(output.prediction.timestamp).toLocaleString()}</span>
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
                                    <p>Enter customer details to predict churn risk</p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
