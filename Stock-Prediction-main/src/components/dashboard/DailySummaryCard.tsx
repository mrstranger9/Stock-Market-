import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDown, ArrowUp, Bot, Calendar } from "lucide-react";

export default function DailySummaryCard() {
    return (
        <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-6 w-6" />
                    <span>Daily Summary</span>
                </CardTitle>
                <CardDescription>Key events from today's trading session.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
                <div className="flex justify-between items-center">
                    <span className="text-muted-foreground flex items-center gap-2"><Bot className="h-4 w-4" /> Signals Today</span>
                    <span className="font-semibold text-lg">8</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Best Trade</span>
                    <div className="flex items-center gap-2 font-semibold text-chart-1">
                        <ArrowUp className="h-4 w-4" />
                        <span>NVDA (+4.2%)</span>
                    </div>
                </div>
                 <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Worst Trade</span>
                     <div className="flex items-center gap-2 font-semibold text-chart-2">
                        <ArrowDown className="h-4 w-4" />
                        <span>TSLA (-1.8%)</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
