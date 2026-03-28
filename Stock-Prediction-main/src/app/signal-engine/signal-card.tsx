'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { AISignalGenerationOutput } from "@/ai/flows/ai-signal-generation-flow";
import { Shield, Sparkles } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";

interface SignalCardProps {
    stockSymbol: string;
    signalOutput: AISignalGenerationOutput;
}

const mockChartData = [
  { value: 150 }, { value: 152 }, { value: 151 }, { value: 155 }, { value: 154 },
  { value: 158 }, { value: 160 }, { value: 159 }, { value: 162 }, { value: 165 },
];


export default function SignalCard({ stockSymbol, signalOutput }: SignalCardProps) {
    const { signal, confidenceScore, modelUsed } = signalOutput;

    const signalInfo = {
        BUY: {
            label: "Strong Bullish Signal",
            color: "hsl(var(--chart-1))",
            glow: "shadow-[0_0_20px_hsl(var(--chart-1)/0.5)]",
            borderColor: "border-chart-1/50",
            textColor: "text-chart-1",
            progressColor: "bg-chart-1"
        },
        SELL: {
            label: "Strong Bearish Signal",
            color: "hsl(var(--chart-2))",
            glow: "shadow-[0_0_20px_hsl(var(--chart-2)/0.5)]",
            borderColor: "border-chart-2/50",
            textColor: "text-chart-2",
            progressColor: "bg-chart-2"
        },
        HOLD: {
            label: "Neutral Signal",
            color: "hsl(var(--chart-3))",
            glow: "shadow-[0_0_20px_hsl(var(--chart-3)/0.5)]",
            borderColor: "border-chart-3/50",
            textColor: "text-chart-3",
            progressColor: "bg-chart-3"
        },
    }[signal];
    
    const riskInfo = confidenceScore > 85 ? { level: "Low", color: "text-chart-1" } :
                   confidenceScore > 60 ? { level: "Medium", color: "text-chart-3" } :
                   { level: "High", color: "text-chart-2" };

    return (
        <Card className={cn("flex flex-col transition-all duration-300", signalInfo.borderColor, signalInfo.glow)}>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <CardDescription>AI Signal for {stockSymbol}</CardDescription>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Sparkles className="h-3 w-3 text-primary" />
                        <span>Powered by {modelUsed}</span>
                    </div>
                </div>
                <CardTitle className="text-7xl font-black" style={{ color: signalInfo.color }}>
                    {signal}
                </CardTitle>
                <CardDescription className="font-semibold" style={{ color: signalInfo.color }}>{signalInfo.label}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow space-y-6">
                <div className="h-16 w-full">
                    <ResponsiveContainer>
                        <AreaChart data={mockChartData}>
                            <defs>
                                <linearGradient id="signalCardChartGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={signalInfo.color} stopOpacity={0.4} />
                                    <stop offset="95%" stopColor={signalInfo.color} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke={signalInfo.color}
                                strokeWidth={2}
                                fill="url(#signalCardChartGradient)"
                                isAnimationActive={false}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
                 <div className="space-y-2">
                    <div className="flex justify-between items-baseline">
                        <p className="text-sm font-medium">Confidence Score</p>
                        <p className="text-2xl font-semibold">{confidenceScore.toFixed(1)}%</p>
                    </div>
                    <Progress value={confidenceScore} className="h-2" indicatorClassName={signalInfo.progressColor} />
                </div>
                 <div className="flex items-center justify-between rounded-lg border bg-background/50 p-3">
                    <div className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-muted-foreground" />
                        <p className="font-medium">Signal Risk Level</p>
                    </div>
                    <p className={cn("font-bold text-lg", riskInfo.color)}>{riskInfo.level}</p>
                </div>

            </CardContent>
        </Card>
    );
}
