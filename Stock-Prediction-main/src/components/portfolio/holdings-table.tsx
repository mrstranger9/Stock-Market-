'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp } from "lucide-react";
import SparklineChart from "../dashboard/SparklineChart";

const holdings = [
  { symbol: 'AAPL', name: 'Apple Inc.', quantity: 50, avgBuyPrice: 150.25, currentPrice: 172.25, dailyChange: 1.12, allocation: 25.1, sparklineData: [{value: 4}, {value: 8}, {value: 5}, {value: 10}, {value: 7}, {value: 12}, {value: 14}] },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', quantity: 10, avgBuyPrice: 750.80, currentPrice: 950.02, dailyChange: 2.75, allocation: 27.8, sparklineData: [{value: 3}, {value: 4}, {value: 6}, {value: 5}, {value: 8}, {value: 9}, {value: 11}] },
  { symbol: 'TSLA', name: 'Tesla, Inc.', quantity: 30, avgBuyPrice: 200.50, currentPrice: 180.01, dailyChange: -1.37, allocation: 15.8, sparklineData: [{value: 10}, {value: 8}, {value: 9}, {value: 6}, {value: 7}, {value: 5}, {value: 4}] },
  { symbol: 'MSFT', name: 'Microsoft Corp.', quantity: 25, avgBuyPrice: 380.10, currentPrice: 425.22, dailyChange: -0.42, allocation: 31.3, sparklineData: [{value: 8}, {value: 8}, {value: 9}, {value: 7}, {value: 8}, {value: 7}, {value: 8}] },
];

export default function HoldingsTable() {
    const getSparklineColor = (change: number) => {
        return change >= 0 ? 'hsl(var(--chart-1))' : 'hsl(var(--chart-2))';
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Your Holdings</CardTitle>
                <CardDescription>Detailed breakdown of your current stock positions.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="w-full overflow-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Stock</TableHead>
                                <TableHead className="text-right">Market Price</TableHead>
                                <TableHead className="text-right">Daily Change</TableHead>
                                <TableHead className="w-[120px] text-right">7-Day Trend</TableHead>
                                <TableHead className="text-right">Quantity</TableHead>
                                <TableHead className="text-right">Profit/Loss</TableHead>
                                <TableHead className="text-right">Weight</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {holdings.map((holding) => {
                                const profitLoss = (holding.currentPrice - holding.avgBuyPrice) * holding.quantity;
                                const isProfit = profitLoss >= 0;
                                return (
                                    <TableRow key={holding.symbol} className="hover:bg-muted/50">
                                        <TableCell>
                                            <div className="font-medium">{holding.symbol}</div>
                                            <div className="text-xs text-muted-foreground">{holding.name}</div>
                                        </TableCell>
                                        <TableCell className="text-right font-medium">${holding.currentPrice.toFixed(2)}</TableCell>
                                        <TableCell className={cn("text-right font-medium", holding.dailyChange >= 0 ? "text-chart-1" : "text-chart-2")}>
                                            {holding.dailyChange.toFixed(2)}%
                                        </TableCell>
                                        <TableCell>
                                            <SparklineChart data={holding.sparklineData} color={getSparklineColor(holding.dailyChange)} />
                                        </TableCell>
                                        <TableCell className="text-right">{holding.quantity}</TableCell>
                                        <TableCell className={cn("text-right font-medium", isProfit ? "text-chart-1" : "text-chart-2")}>
                                            <div className="flex items-center justify-end gap-1">
                                                {isProfit ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                                                <span>{isProfit ? '+' : '-'}${Math.abs(profitLoss).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">{holding.allocation.toFixed(1)}%</TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
