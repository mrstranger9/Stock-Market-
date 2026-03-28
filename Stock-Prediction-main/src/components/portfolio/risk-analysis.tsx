import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, ChevronsDown, Activity, Thermometer } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function RiskAnalysis() {
    return (
        <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Shield className="h-6 w-6" />
                    <span>Risk Analysis</span>
                </CardTitle>
                <CardDescription>Understanding your portfolio's risk exposure.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 text-sm">
                 <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <h4 className="font-semibold flex items-center gap-2"><Thermometer className="h-4 w-4 text-muted-foreground" />Risk Score</h4>
                        <span className="font-bold text-lg text-chart-2">High</span>
                    </div>
                    <Progress value={85} className="h-2 [&>*]:bg-chart-2" />
                    <p className="text-xs text-muted-foreground">Based on volatility, concentration, and asset quality.</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="space-y-1 rounded-md bg-muted/50 p-3">
                        <h4 className="font-semibold flex items-center justify-center gap-2 text-xs text-muted-foreground"><Activity className="h-4 w-4" />Beta</h4>
                        <p className="text-lg font-bold">1.35</p>
                    </div>
                    <div className="space-y-1 rounded-md bg-muted/50 p-3">
                        <h4 className="font-semibold flex items-center justify-center gap-2 text-xs text-muted-foreground"><ChevronsDown className="h-4 w-4" />Max Drawdown</h4>
                        <p className="text-lg font-bold text-chart-2">-11.4%</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
