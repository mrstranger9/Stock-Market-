'use client';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

const chartConfig = {
    portfolio: {
        label: 'Strategy',
        color: 'hsl(var(--chart-4))',
    },
    benchmark: {
        label: 'Benchmark',
        color: 'hsl(var(--muted-foreground))',
    },
} satisfies ChartConfig;

interface EquityCurveChartProps {
    data: { date: string; portfolio: number; benchmark: number }[];
    height?: number;
}

export default function EquityCurveChart({ data, height = 300 }: EquityCurveChartProps) {
  return (
    <div style={{ height: `${height}px` }} className="w-full">
        <ChartContainer config={chartConfig} className="h-full w-full">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <defs>
                    <linearGradient id="colorPortfolio" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-portfolio)" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="var(--color-portfolio)" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorBenchmark" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-benchmark)" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="var(--color-benchmark)" stopOpacity={0}/>
                    </linearGradient>
                    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.5)" />
                <XAxis 
                    dataKey="date" 
                    tickLine={false} 
                    axisLine={false} 
                    tickMargin={8} 
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} 
                />
                <YAxis 
                    tickLine={false} 
                    axisLine={false} 
                    tickMargin={8} 
                    tickFormatter={(value) => `$${Number(value)/1000}k`} 
                />
                <Tooltip 
                    cursor={{stroke: "hsl(var(--border))", strokeWidth: 2, strokeDasharray: "3 3"}}
                    content={<ChartTooltipContent indicator="dot" />} 
                />
                <Area style={{ filter: "url(#glow)" }} type="monotone" dataKey="portfolio" stroke="var(--color-portfolio)" strokeWidth={2} fillOpacity={1} fill="url(#colorPortfolio)" />
                <Area type="monotone" dataKey="benchmark" stroke="var(--color-benchmark)" strokeDasharray="5 5" strokeWidth={2} fillOpacity={1} fill="url(#colorBenchmark)" />
            </AreaChart>
        </ChartContainer>
    </div>
  );
}
