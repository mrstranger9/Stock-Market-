'use client';
import { useEffect, useState } from 'react';
import StrategyVisualizationChart, { type CandlestickDataPoint, type SignalMarker } from '@/components/backtesting/strategy-visualization-chart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MetricCard } from '@/components/dashboard/metric-card';
import { DollarSign, Percent, TrendingUp, TrendingDown, Clock } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

type BarDataPoint = {
    x: Date;
    y: number;
};

type StockData = {
    candlestickData: CandlestickDataPoint[];
    volumeData: BarDataPoint[];
    rsiData: BarDataPoint[];
    signals: SignalMarker[];
};

// Mock data generation functions
function generateMockStockData(symbol: string): StockData {
    const candlestickData: CandlestickDataPoint[] = [];
    const volumeData: BarDataPoint[] = [];
    const rsiData: BarDataPoint[] = [];
    const signals: SignalMarker[] = [];

    let lastClose = Math.random() * 250 + 50;
    
    const today = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(today.getFullYear() - 1);

    for (let d = new Date(oneYearAgo); d <= today; d.setDate(d.getDate() + 1)) {
        const date = new Date(d);
        const open = parseFloat((lastClose * (1 + (Math.random() - 0.5) * 0.02)).toFixed(2));
        const high = parseFloat((Math.max(open, lastClose) * (1 + Math.random() * 0.015)).toFixed(2));
        const low = parseFloat((Math.min(open, lastClose) * (1 - Math.random() * 0.015)).toFixed(2));
        const close = parseFloat((open * (1 + (Math.random() - 0.5) * 0.025)).toFixed(2));
        lastClose = close;

        candlestickData.push({ x: date, y: [open, high, low, close] });
        volumeData.push({ x: date, y: Math.floor(Math.random() * 50000000) + 10000000 });
        rsiData.push({ x: date, y: Math.random() * 70 + 15 });

        // Add some random signals
        if (Math.random() < 0.03) {
            const isBuy = Math.random() > 0.5;
            signals.push({
                x: date.getTime(),
                y: close,
                label: {
                    text: isBuy ? `Buy @ ${close.toFixed(2)}` : `Sell @ ${close.toFixed(2)}`,
                    borderColor: isBuy ? 'hsl(var(--chart-1))' : 'hsl(var(--chart-2))',
                    style: {
                        color: '#fff',
                        background: isBuy ? 'hsl(var(--chart-1))' : 'hsl(var(--chart-2))',
                    },
                },
                icon: {
                    type: isBuy ? 'triangle' : 'triangle-down',
                    size: 8,
                    fillColor: isBuy ? 'hsl(var(--chart-1))' : 'hsl(var(--chart-2))',
                    strokeColor: '#fff',
                },
            });
        }
    }

    return { candlestickData, volumeData, rsiData, signals };
}

export default function StockDetailsClient({ symbol }: { symbol: string }) {
    const [stockData, setStockData] = useState<StockData | null>(null);
    const [loading, setLoading] = useState(true);
    const [marketCap, setMarketCap] = useState('');

    useEffect(() => {
        setLoading(true);
        // Simulate data fetching
        setTimeout(() => {
            const data = generateMockStockData(symbol);
            setStockData(data);
            setMarketCap(`${(Math.random() * 2000 + 500).toFixed(1)}B`);
            setLoading(false);
        }, 1500);
    }, [symbol]);

    const latestPrice = stockData?.candlestickData[stockData.candlestickData.length - 1].y[3] || 0;
    const prevPrice = stockData?.candlestickData[stockData.candlestickData.length - 2]?.y[3] || 0;
    const change = latestPrice - prevPrice;
    const changePercent = prevPrice > 0 ? (change / prevPrice) * 100 : 0;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">{symbol} Stock Analysis</h1>
                <p className="text-muted-foreground mt-2">Detailed market data for {symbol}.</p>
            </div>
            
            {loading ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                    {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-[126px]" />)}
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                    <MetricCard
                        title="Current Price"
                        value={`$${latestPrice.toFixed(2)}`}
                        icon={DollarSign}
                        change={`${change.toFixed(2)} (${changePercent.toFixed(2)}%)`}
                        changeColor={change >= 0 ? 'text-chart-1' : 'text-chart-2'}
                    />
                     <MetricCard
                        title="Day High"
                        value={`$${stockData?.candlestickData[stockData.candlestickData.length - 1].y[1].toFixed(2)}`}
                        icon={TrendingUp}
                    />
                     <MetricCard
                        title="Day Low"
                        value={`$${stockData?.candlestickData[stockData.candlestickData.length - 1].y[2].toFixed(2)}`}
                        icon={TrendingDown}
                    />
                     <MetricCard
                        title="Volume"
                        value={`${((stockData?.volumeData[stockData.volumeData.length-1].y || 0) / 1000000).toFixed(2)}M`}
                        icon={Clock}
                    />
                    <MetricCard
                        title="Market Cap"
                        value={marketCap}
                        icon={Percent}
                    />
                </div>
            )}

            {loading ? (
                <Skeleton className="h-[600px] w-full" />
            ) : stockData && (
                <StrategyVisualizationChart 
                    symbol={symbol}
                    candlestickData={stockData.candlestickData}
                    signals={stockData.signals}
                />
            )}
        </div>
    );
}
