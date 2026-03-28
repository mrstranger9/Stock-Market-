import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUp, ArrowDown, Scale, TrendingUp, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function PortfolioSummary() {
    const portfolioReturn = 52.3;
    const benchmarkReturn = 28.7;
    const outperformance = portfolioReturn - benchmarkReturn;
    
    return (
        <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Scale className="h-6 w-6" />
                    <span>Portfolio Summary</span>
                </CardTitle>
                <CardDescription>Key metrics for your investment portfolio.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
                <div className="flex justify-between items-center">
                    <span className="text-muted-foreground flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Risk Level</span>
                    <Badge variant="destructive" className="bg-red-500/20 text-red-400 border-red-500/30">High</Badge>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-muted-foreground flex items-center gap-2"><TrendingUp className="h-4 w-4" /> vs. S&P 500</span>
                    <span className="font-semibold text-chart-1">+{outperformance.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Best Performer</span>
                    <div className="flex items-center gap-2 font-semibold text-chart-1">
                        <ArrowUp className="h-4 w-4" />
                        <span>NVDA (+26.5%)</span>
                    </div>
                </div>
                 <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Worst Performer</span>
                     <div className="flex items-center gap-2 font-semibold text-chart-2">
                        <ArrowDown className="h-4 w-4" />
                        <span>TSLA (-10.2%)</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
