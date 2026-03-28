'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, PieChart, ShieldAlert, TrendingUp, BarChart, FilePieChart, RefreshCcw, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function AIPortfolioReport() {
    return (
        <Card className="bg-primary/5 border-primary/20 hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <CardTitle className="flex items-center gap-2">
                        <Lightbulb className="h-6 w-6 text-primary" />
                        <span>AI Portfolio Report</span>
                    </CardTitle>
                     <div className="text-right">
                        <p className="text-xs text-muted-foreground">Overall Score</p>
                        <p className="text-2xl font-bold text-primary">7.8/10</p>
                    </div>
                </div>
                <CardDescription>Smart analysis of your portfolio's health and rebalancing suggestions.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 text-sm">

                <div className="grid grid-cols-3 gap-4">
                     <ScoreItem title="Risk" score={82} scoreColor="hsl(var(--chart-2))" />
                     <ScoreItem title="Growth" score={88} scoreColor="hsl(var(--chart-1))" />
                     <ScoreItem title="Diversification" score={65} scoreColor="hsl(var(--chart-3))" />
                </div>
                
                 <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2 text-muted-foreground"><RefreshCcw className="h-4 w-4" /> AI Rebalance Suggestions</h4>
                    <div className="space-y-3">
                       <SuggestionItem 
                            action="Reduce" 
                            stock="NVDA" 
                            reason="High concentration (27.8%)"
                            color="text-yellow-400"
                        />
                        <SuggestionItem 
                            action="Increase" 
                            stock="Healthcare Sector" 
                            reason="Currently under-allocated"
                            color="text-green-400"
                        />
                        <SuggestionItem 
                            action="Consider" 
                            stock="MSFT" 
                            reason="Strong growth potential but nearing over-concentration"
                            color="text-blue-400"
                        />
                    </div>
                </div>
                <Button className="w-full" disabled><Zap className="mr-2 h-4 w-4" /> Auto-Apply Suggestions</Button>

            </CardContent>
        </Card>
    );
}

function ScoreItem({ title, score, scoreColor }: { title: string, score: number, scoreColor: string }) {
    return (
        <div className="flex flex-col items-center space-y-2 rounded-lg bg-background/50 p-3">
            <span className="text-xs text-muted-foreground">{title}</span>
            <div className="relative h-16 w-16">
                <svg className="h-full w-full" viewBox="0 0 36 36">
                    <path
                        className="stroke-current text-muted/20"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        strokeWidth="3"
                    />
                    <path
                        className="stroke-current"
                        style={{ color: scoreColor }}
                        strokeWidth="3"
                        strokeDasharray={`${score}, 100`}
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                    />
                </svg>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <span className="text-base font-bold">{score}</span>
                </div>
            </div>
        </div>
    );
}

function SuggestionItem({ action, stock, reason, color }: { action: string, stock: string, reason: string, color: string}) {
    return (
        <div className="flex items-center justify-between rounded-md bg-background/50 p-2 pl-3">
            <div>
                <span className={cn("font-semibold", color)}>{action}</span>
                <span className="font-medium text-foreground ml-1.5">{stock}</span>
                <p className="text-xs text-muted-foreground">{reason}</p>
            </div>
             <Button variant="ghost" size="sm">Details</Button>
        </div>
    )
}
