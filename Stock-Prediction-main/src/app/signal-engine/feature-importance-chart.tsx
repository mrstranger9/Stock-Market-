'use client';
import type { AISignalGenerationOutput } from "@/ai/flows/ai-signal-generation-flow";
import { Activity, BarChart3, GitCommitHorizontal, MoveHorizontal, Scaling, Waves } from "lucide-react";
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";

interface FeatureImportanceChartProps {
    featureImportance: AISignalGenerationOutput['featureImportance'];
}

const indicatorInfo = {
    RSI: { icon: Activity, description: "Relative Strength Index: A momentum oscillator that measures the speed and change of price movements." },
    MACD: { icon: GitCommitHorizontal, description: "Moving Average Convergence Divergence: A trend-following momentum indicator that shows the relationship between two moving averages of a security’s price." },
    Volume: { icon: BarChart3, description: "Trading Volume: The number of shares or contracts traded in a security or market during a given period." },
    MovingAverage: { icon: Waves, description: "Moving Average: An indicator used to identify the direction of a trend by smoothing out price data to create a constantly updated average price." },
    BollingerBands: { icon: MoveHorizontal, description: "Bollinger Bands: A type of statistical chart characterizing the prices and volatility over time of a financial instrument or commodity." },
    ATR: { icon: Scaling, description: "Average True Range: A technical analysis volatility indicator, which takes into account the current high/low range as well as any gap from the previous day's close." },
};

export default function FeatureImportanceChart({ featureImportance }: FeatureImportanceChartProps) {
    const data = Object.entries(featureImportance)
        .map(([name, value]) => ({ name, value, ...indicatorInfo[name as keyof typeof indicatorInfo] }))
        .sort((a, b) => b.value - a.value);

    return (
        <TooltipProvider>
            <div className="space-y-4">
                {data.map((item) => (
                    <UITooltip key={item.name} delayDuration={0}>
                        <TooltipTrigger asChild>
                            <div className="space-y-1 group">
                                <div className="flex items-center justify-between gap-4 text-sm">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <item.icon className="h-4 w-4" />
                                        <span>{item.name}</span>
                                    </div>
                                    <span className="font-semibold text-foreground">{item.value.toFixed(1)}%</span>
                                </div>
                                <Progress value={item.value} className="h-2 [&>*]:bg-primary transition-all duration-300 group-hover:h-3" />
                            </div>
                        </TooltipTrigger>
                        <TooltipContent side="top" align="start">
                            <p className="max-w-xs">{item.description}</p>
                        </TooltipContent>
                    </UITooltip>
                ))}
            </div>
        </TooltipProvider>
    );
}
