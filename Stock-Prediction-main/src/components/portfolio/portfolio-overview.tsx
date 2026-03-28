'use client';
import { Card } from "@/components/ui/card";
import { Area, AreaChart, ResponsiveContainer, Tooltip } from 'recharts';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from "@/lib/utils";

// Mock Data
const totalValue = 152345.67;
const investedAmount = 100000;
const todaysPnl = 2285.19;
const totalReturn = ((totalValue - investedAmount) / investedAmount) * 100;
const sparklineData = [
    { value: 145000 }, { value: 146000 }, { value: 145500 }, { value: 147000 },
    { value: 148500 }, { value: 149000 }, { value: 150500 }, { value: 152345 },
];

export default function PortfolioOverview() {
    return (
        <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-center">
                <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Total Portfolio Value</p>
                    <p className="text-3xl font-bold">${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
                <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Today's Profit/Loss</p>
                    <div className={cn("flex items-center gap-2", todaysPnl >= 0 ? "text-chart-1" : "text-chart-2")}>
                        <p className="text-3xl font-bold">
                            {todaysPnl >= 0 ? '+' : '-'}${Math.abs(todaysPnl).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                        {todaysPnl >= 0 ? <ArrowUp className="h-6 w-6" /> : <ArrowDown className="h-6 w-6" />}
                    </div>
                </div>
                <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Total Gain</p>
                    <p className="text-3xl font-bold text-chart-1">+{totalReturn.toFixed(2)}%</p>
                    <p className="text-xs text-muted-foreground">Invested: ${investedAmount.toLocaleString()} | Current: ${totalValue.toLocaleString()}</p>
                </div>
                <div className="h-16 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={sparklineData}>
                            <defs>
                                <linearGradient id="sparkline" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.4}/>
                                    <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <Tooltip
                                contentStyle={{
                                    background: "hsl(var(--background))",
                                    border: "1px solid hsl(var(--border))",
                                    borderRadius: "var(--radius)",
                                }}
                                itemStyle={{ color: "hsl(var(--foreground))" }}
                                labelFormatter={() => ''}
                                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Value']}
                            />
                            <Area type="monotone" dataKey="value" stroke="hsl(var(--chart-1))" fill="url(#sparkline)" strokeWidth={2} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </Card>
    );
}
