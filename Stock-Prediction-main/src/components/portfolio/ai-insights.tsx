import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, PieChart, ShieldAlert, BarChart } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function AIInsights() {
    return (
        <Card className="bg-primary/5 border-primary/20 hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <CardTitle className="flex items-center gap-2">
                        <Lightbulb className="h-6 w-6 text-primary" />
                        <span>AI-Powered Insights</span>
                    </CardTitle>
                    <div className="text-right">
                        <p className="text-xs text-muted-foreground">Confidence Score</p>
                        <p className="text-lg font-bold text-primary">92%</p>
                    </div>
                </div>
                <CardDescription>Smart analysis of your portfolio's health.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                    <PieChart className="h-5 w-5 mt-0.5 text-primary/80 flex-shrink-0" />
                    <div>
                        <h4 className="font-semibold">Concentration Risk</h4>
                        <p className="text-muted-foreground">
                            Your portfolio shows high concentration in the <Badge variant="secondary">Technology</Badge> sector (62.6%).
                            Consider diversifying into other sectors like Healthcare or Finance to reduce risk.
                        </p>
                    </div>
                </div>
                 <div className="flex items-start gap-3">
                    <ShieldAlert className="h-5 w-5 mt-0.5 text-primary/80 flex-shrink-0" />
                    <div>
                        <h4 className="font-semibold">Risk Profile</h4>
                        <p className="text-muted-foreground">
                           Your portfolio's Beta of 1.35 indicates higher volatility than the market, classifying it as <Badge variant="destructive" className="bg-red-500/20 text-red-400 border-red-500/30">High Risk</Badge>.
                        </p>
                    </div>
                </div>
                 <div className="flex items-start gap-3">
                    <BarChart className="h-5 w-5 mt-0.5 text-primary/80 flex-shrink-0" />
                    <div>
                        <h4 className="font-semibold">Performance Drivers</h4>
                        <p className="text-muted-foreground">
                            <span className="font-medium text-chart-1">NVDA</span> is your top performer, contributing over 40% of your total gains.
                            Monitor its performance closely as it heavily influences your overall return.
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
