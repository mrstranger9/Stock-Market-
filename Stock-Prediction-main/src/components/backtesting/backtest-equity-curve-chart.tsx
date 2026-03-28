'use client';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

const chartConfig = {
    portfolio: {
        label: 'Portfolio Value',
        color: 'hsl(var(--chart-4))',
    },
} satisfies ChartConfig;

interface BacktestEquityCurveChartProps {
    data: { date: string; portfolio: number }[];
}

export default function BacktestEquityCurveChart({ data }: BacktestEquityCurveChartProps) {
  return (
    <div className="h-[350px] w-full">
        <ChartContainer config={chartConfig} className="h-full w-full">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <defs>
                    <linearGradient id="colorPortfolio" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-portfolio)" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="var(--color-portfolio)" stopOpacity={0}/>
                    </linearGradient>
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
                    domain={['dataMin', 'dataMax']}
                />
                <Tooltip 
                    cursor={{stroke: "hsl(var(--border))", strokeWidth: 1, strokeDasharray: "3 3"}}
                    content={<ChartTooltipContent indicator="dot" />} 
                />
                <Area type="monotone" dataKey="portfolio" stroke="var(--color-portfolio)" strokeWidth={2} fillOpacity={1} fill="url(#colorPortfolio)" />
            </AreaChart>
        </ChartContainer>
    </div>
  );
}
