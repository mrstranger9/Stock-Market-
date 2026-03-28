'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, History, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';

import type { Trade } from '@/components/backtesting/trade-history-table';
import BacktestResultsDashboard from '@/components/backtesting/backtest-results-dashboard';
import TradeHistoryTable from '@/components/backtesting/trade-history-table';
import StrategyComparison from '@/components/backtesting/strategy-comparison';
import StrategyVisualizationChart, { type CandlestickData, type SignalMarker } from '@/components/backtesting/strategy-visualization-chart';


const backtestingSchema = z.object({
  symbol: z.string().min(1, 'Stock symbol is required.').toUpperCase(),
  initialCapital: z.coerce.number().min(1, 'Initial capital must be greater than 0.'),
  dateRange: z.object({
    from: z.date({required_error: "Start date is required."}),
    to: z.date({required_error: "End date is required."}),
  }),
});

export type BacktestResults = {
    totalReturn: number;
    winRate: number;
    sharpeRatio: number;
    maxDrawdown: number;
    totalTrades: number;
    profitFactor: number;
    initialCapital: number;
    finalPortfolioValue: number;
    equityCurve: { date: string, portfolio: number, benchmark: number }[];
    trades: Trade[];
    sortinoRatio: number;
    calmarRatio: number;
    avgTradeReturn: number;
    maxConsecutiveLosses: number;
    candlestickData: CandlestickData[];
    signals: SignalMarker[];
};

export default function BacktestingClient() {
    const [isLoading, setIsLoading] = useState(false);
    const [backtestResults, setBacktestResults] = useState<BacktestResults | null>(null);
    const { toast } = useToast();
    const [hasMounted, setHasMounted] = useState(false);
    const [selectedStrategy, setSelectedStrategy] = useState('');
    const [submittedValues, setSubmittedValues] = useState<z.infer<typeof backtestingSchema> | null>(null);

    const form = useForm<z.infer<typeof backtestingSchema>>({
        resolver: zodResolver(backtestingSchema),
        defaultValues: {
            symbol: 'AAPL',
            initialCapital: 10000,
            dateRange: {
                from: undefined,
                to: undefined,
            },
        },
    });

    useEffect(() => {
        setHasMounted(true);
        form.setValue('dateRange', {
            from: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
            to: new Date(),
        });
    }, [form]);

    function calculateEMA(data: number[], period: number) {
        if (data.length < period) return data[data.length - 1];
        const k = 2 / (period + 1);
        let ema = data[0];
        for (let i = 1; i < data.length; i++) {
            ema = (data[i] * k) + (ema * (1 - k));
        }
        return ema;
    }

    async function runBacktestSimulation(symbol: string, initialCapital: number, history: any[]) {
        setIsLoading(true);
        setBacktestResults(null);
        
        const trades: Trade[] = [];
        const equityCurve: { date: string; portfolio: number, benchmark: number }[] = [];
        const candlestickData: CandlestickData[] = [];
        const signalsForChart: SignalMarker[] = [];

        let cash = initialCapital;
        let shares = 0;
        let portfolioValue = initialCapital;
        let avgBuyPrice = 0;
        
        let wins = 0;
        let totalProfitLoss = 0;
        let consecutiveLosses = 0;
        let maxConsecutiveLosses = 0;
        let grossProfit = 0;
        let grossLoss = 0;

        const benchmarkInitialPrice = history[0].close;
        const shortPeriod = 9;
        const longPeriod = 21;

        // Process day by day for "real-time" feel
        for (let i = 0; i < history.length; i++) {
            const day = history[i];
            const dateString = day.time;
            const close = day.close;

            candlestickData.push(day);
            
            // Benchmark simulation (Buy and Hold)
            const benchmarkValue = (initialCapital / benchmarkInitialPrice) * close;

            // Strategy logic (EMA Crossover)
            if (i >= longPeriod) {
                const recentCloses = history.slice(0, i + 1).map(d => d.close);
                const shortEma = calculateEMA(recentCloses.slice(-shortPeriod), shortPeriod);
                const longEma = calculateEMA(recentCloses.slice(-longPeriod), longPeriod);
                
                const prevRecentCloses = history.slice(0, i).map(d => d.close);
                const prevShortEma = calculateEMA(prevRecentCloses.slice(-shortPeriod), shortPeriod);
                const prevLongEma = calculateEMA(prevRecentCloses.slice(-longPeriod), longPeriod);

                // Buy: Golden Cross (Short EMA crosses above Long EMA)
                if (prevShortEma <= prevLongEma && shortEma > longEma && cash > close) {
                    const quantity = Math.floor(cash / close);
                    if (quantity > 0) {
                        shares += quantity;
                        avgBuyPrice = close;
                        cash -= quantity * close;
                        trades.push({ date: dateString, action: 'BUY', price: close, quantity, profitLoss: 0, portfolioValue: cash + shares * close });
                        signalsForChart.push({
                            time: dateString,
                            position: 'belowBar',
                            color: 'hsl(var(--chart-1))',
                            shape: 'arrowUp',
                            text: `BUY @ ${close.toFixed(2)}`
                        });
                    }
                } 
                // Sell: Death Cross (Short EMA crosses below Long EMA)
                else if (prevShortEma >= prevLongEma && shortEma < longEma && shares > 0) {
                    const quantity = shares;
                    const profitLoss = (close - avgBuyPrice) * quantity;

                    if (profitLoss > 0) {
                        wins++;
                        grossProfit += profitLoss;
                        consecutiveLosses = 0;
                    } else {
                        grossLoss += Math.abs(profitLoss);
                        consecutiveLosses++;
                        maxConsecutiveLosses = Math.max(maxConsecutiveLosses, consecutiveLosses);
                    }
                    totalProfitLoss += profitLoss;
                    cash += quantity * close;
                    shares = 0;
                    trades.push({ date: dateString, action: 'SELL', price: close, quantity, profitLoss, portfolioValue: cash });
                    signalsForChart.push({
                        time: dateString,
                        position: 'aboveBar',
                        color: 'hsl(var(--chart-2))',
                        shape: 'arrowDown',
                        text: `SELL @ ${close.toFixed(2)}`
                    });
                }
            }

            portfolioValue = cash + shares * close;
            equityCurve.push({ date: dateString, portfolio: parseFloat(portfolioValue.toFixed(2)), benchmark: parseFloat(benchmarkValue.toFixed(2)) });

            // Update state periodically for real-time feel (every 10 days of data or so)
            if (i % 10 === 0 || i === history.length - 1) {
                const totalSellTrades = trades.filter(t => t.action === 'SELL').length;
                const winRate = totalSellTrades > 0 ? (wins / totalSellTrades) * 100 : 0;
                
                const currentEquityCurve = [...equityCurve];
                const maxDrawdownValue = currentEquityCurve.reduce((max, point, index) => {
                    const peak = Math.max(...currentEquityCurve.slice(0, index + 1).map(p => p.portfolio));
                    const drawdown = (peak - point.portfolio) / peak;
                    return Math.max(max, drawdown);
                }, 0);

                const totalReturn = ((portfolioValue - initialCapital) / initialCapital) * 100;
                const sharpeRatio = (totalReturn / 100) / (maxDrawdownValue * 1.5 + 0.1) * 1.2;

                setBacktestResults({
                    totalReturn,
                    winRate,
                    sharpeRatio: isNaN(sharpeRatio) ? 0 : sharpeRatio,
                    maxDrawdown: -maxDrawdownValue,
                    totalTrades: trades.length,
                    profitFactor: grossLoss > 0 ? grossProfit / grossLoss : (grossProfit > 0 ? 100 : 0),
                    initialCapital,
                    finalPortfolioValue: portfolioValue,
                    equityCurve: currentEquityCurve,
                    trades: [...trades],
                    sortinoRatio: sharpeRatio * 1.2,
                    calmarRatio: maxDrawdownValue > 0 ? (totalReturn / 12) / maxDrawdownValue : 0,
                    avgTradeReturn: totalSellTrades > 0 ? totalProfitLoss / totalSellTrades : 0,
                    maxConsecutiveLosses,
                    candlestickData: [...candlestickData],
                    signals: [...signalsForChart],
                });

                // Add a small delay for visualization effect if it's very fast
                if (history.length > 50) {
                    await new Promise(resolve => setTimeout(resolve, 50));
                }
            }
        }

        setIsLoading(false);
        toast({
            title: 'Backtest Complete',
            description: `Backtest for ${symbol} using EMA Crossover Strategy is finished.`,
        });
    }

    async function onSubmit(values: z.infer<typeof backtestingSchema>) {
        setIsLoading(true);
        setBacktestResults(null);
        setSubmittedValues(values);
        setSelectedStrategy('EMA Crossover Strategy');

        try {
            const startStr = format(values.dateRange.from, "yyyy-MM-dd");
            const endStr = format(values.dateRange.to, "yyyy-MM-dd");
            
            const response = await fetch(`http://localhost:8000/api/backtest/history?symbol=${values.symbol}&start=${startStr}&end=${endStr}`);
            const history = await response.json();

            if (history.error) {
                throw new Error(history.error);
            }

            if (!Array.isArray(history) || history.length === 0) {
                throw new Error("No data received from backend.");
            }

            await runBacktestSimulation(values.symbol, values.initialCapital, history);
        } catch (error: any) {
            console.error('Backtest failed:', error);
            setIsLoading(false);
            toast({
                variant: 'destructive',
                title: 'Backtest Failed',
                description: error.message || 'There was a problem running the backtest.',
            });
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold">Backtesting Engine</h1>
                    <p className="text-muted-foreground mt-2">Test your trading strategies against historical market data.</p>
                </div>
                {backtestResults && (
                    <Button variant="outline" onClick={() => setBacktestResults(null)}>
                        Run New Backtest
                    </Button>
                )}
            </div>
            
            <div>
                {isLoading ? (
                    <div
                        className="flex flex-col items-center justify-center min-h-[500px] space-y-4"
                    >
                        <Loader2 className="h-16 w-16 animate-spin text-primary" />
                        <p className="text-xl font-semibold">Running Backtest...</p>
                        <p className="text-muted-foreground">Please wait while we simulate your strategy.</p>
                    </div>
                ) : backtestResults && submittedValues ? (
                    <div
                        className="space-y-8"
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle>Backtest Results: {selectedStrategy} on {submittedValues.symbol}</CardTitle>
                                <CardDescription>
                                    Backtesting ({submittedValues.dateRange.from && format(submittedValues.dateRange.from, "LLL dd, y")} - {submittedValues.dateRange.to && format(submittedValues.dateRange.to, "LLL dd, y")})
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <BacktestResultsDashboard results={backtestResults} />
                            </CardContent>
                        </Card>
                        
                        <StrategyVisualizationChart 
                            symbol={submittedValues.symbol}
                            candlestickData={backtestResults.candlestickData}
                            signals={backtestResults.signals}
                        />

                        <TradeHistoryTable trades={backtestResults.trades} />
                        
                        <StrategyComparison />

                    </div>
                ) : (
                     <div>
                        <Card>
                            <CardHeader>
                                <CardTitle>Run a New Backtest</CardTitle>
                                <CardDescription>Configure the parameters for your backtest.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <FormField
                                                control={form.control}
                                                name="symbol"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Stock Symbol</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="e.g., AAPL" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="initialCapital"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Initial Capital ($)</FormLabel>
                                                        <FormControl>
                                                            <Input type="number" placeholder="e.g., 10000" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="dateRange"
                                                render={({ field }) => (
                                                    <FormItem className="flex flex-col md:col-span-2">
                                                        <FormLabel>Date range</FormLabel>
                                                        <Popover>
                                                            <PopoverTrigger asChild>
                                                                <Button
                                                                    id="date"
                                                                    variant={"outline"}
                                                                    className={cn(
                                                                        "w-full justify-start text-left font-normal",
                                                                        !field.value?.from && "text-muted-foreground"
                                                                    )}
                                                                >
                                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                                    {hasMounted && field.value?.from && field.value?.to ? (
                                                                        <>
                                                                            {format(field.value.from, "LLL dd, y")} -{" "}
                                                                            {format(field.value.to, "LLL dd, y")}
                                                                        </>
                                                                    ) : (
                                                                        <span>Pick a date range</span>
                                                                    )}
                                                                </Button>
                                                            </PopoverTrigger>
                                                            <PopoverContent className="w-auto p-0" align="start">
                                                                <Calendar
                                                                    initialFocus
                                                                    mode="range"
                                                                    defaultMonth={field.value?.from}
                                                                    selected={field.value.from && field.value.to ? {from: field.value.from, to: field.value.to} : undefined}
                                                                    onSelect={(range) => field.onChange(range)}
                                                                    numberOfMonths={2}
                                                                />
                                                            </PopoverContent>
                                                        </Popover>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div className="flex justify-end">
                                            <Button type="submit" className="w-full sm:w-auto" disabled={isLoading || !hasMounted}>
                                                <History className="mr-2 h-4 w-4" />
                                                Run Backtest
                                            </Button>
                                        </div>
                                    </form>
                                </Form>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
}
