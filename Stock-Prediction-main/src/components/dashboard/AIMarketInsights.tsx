import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, TrendingUp, Zap, Shield, TrendingDown, ChevronsRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function AIMarketInsights() {
    return (
        <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <CardTitle className="flex items-center gap-2">
                        <Lightbulb className="h-6 w-6 text-primary" />
                        <span>AI Market Insights</span>
                    </CardTitle>
                </div>
                <CardDescription>AI-driven analysis of current market conditions.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
                <div className="flex items-start justify-between p-3 rounded-lg bg-background/50">
                    <div>
                        <p className="text-muted-foreground text-xs">Recommended Action</p>
                        <p className="font-bold text-lg text-chart-1 flex items-center gap-1">
                            <TrendingUp className="h-5 w-5" />
                            <span>CAUTIOUS BUY</span>
                        </p>
                    </div>
                     <div className="text-right">
                        <p className="text-xs text-muted-foreground">Confidence</p>
                        <p className="text-lg font-bold text-primary">85%</p>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <TrendingUp className="h-4 w-4" />
                            <span>Trend Strength</span>
                        </div>
                        <Badge variant="outline" className="text-chart-1 border-chart-1/50">Bullish</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <ChevronsRight className="h-4 w-4" />
                            <span>Volume Signal</span>
                        </div>
                        <Badge variant="outline" className="text-chart-1 border-chart-1/50">Accumulation</Badge>
                    </div>
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Zap className="h-4 w-4" />
                            <span>Volatility</span>
                        </div>
                        <Badge variant="outline" className="text-yellow-400 border-yellow-400/50">Moderate</Badge>
                    </div>
                </div>
                <div className="space-y-2 pt-2">
                    <p className="text-muted-foreground flex items-center gap-2 text-xs"><Shield className="h-4 w-4" /> SUGGESTED SECTORS</p>
                    <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">Technology</Badge>
                        <Badge variant="secondary">Healthcare</Badge>
                        <Badge variant="secondary">Renewable Energy</Badge>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
