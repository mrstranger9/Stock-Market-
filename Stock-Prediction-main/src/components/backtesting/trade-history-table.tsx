'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

export type Trade = {
    date: string;
    action: 'BUY' | 'SELL';
    price: number;
    quantity: number;
    profitLoss: number;
    portfolioValue: number;
}

interface TradeHistoryTableProps {
    trades: Trade[];
}

export default function TradeHistoryTable({ trades }: TradeHistoryTableProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Trade History</CardTitle>
                <CardDescription>A log of all trades executed during the backtest.</CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="w-full overflow-auto h-96">
                    <Table>
                        <TableHeader className="sticky top-0 bg-card">
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Action</TableHead>
                                <TableHead className="text-right">Price</TableHead>
                                <TableHead className="text-right">Quantity</TableHead>
                                <TableHead className="text-right">Profit/Loss ($)</TableHead>
                                <TableHead className="text-right">Portfolio Value</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                             {trades.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center h-24">No trades were executed during this backtest.</TableCell>
                                </TableRow>
                            ) : (
                                trades.map((trade, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{new Date(trade.date).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <span className={cn('font-semibold', {
                                                'text-chart-1': trade.action === 'BUY',
                                                'text-chart-2': trade.action === 'SELL'
                                            })}>{trade.action}</span>
                                        </TableCell>
                                        <TableCell className="text-right">${trade.price.toFixed(2)}</TableCell>
                                        <TableCell className="text-right">{trade.quantity}</TableCell>
                                        <TableCell className={cn('text-right', {
                                            'text-chart-1': trade.profitLoss > 0,
                                            'text-chart-2': trade.profitLoss < 0,
                                            'text-muted-foreground': trade.profitLoss === 0,
                                        })}>
                                            {trade.profitLoss.toFixed(2)}
                                        </TableCell>
                                        <TableCell className="text-right">${trade.portfolioValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
