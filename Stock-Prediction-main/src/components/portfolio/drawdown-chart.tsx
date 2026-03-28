'use client';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

const chartConfig = {
    drawdown: {
        label: 'Drawdown',
        color: 'hsl(var(--chart-2))', // red
    },
} satisfies ChartConfig;

interface DrawdownChartProps {
    data: { date: string; drawdown: number }[];
}

export default function DrawdownChart({ data }: DrawdownChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Drawdown Curve</CardTitle>
        <CardDescription>Portfolio value reduction from its peak.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] w-full">
            <ChartContainer config={chartConfig} className="h-full w-full">
                <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorDrawdown" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--color-drawdown)" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="var(--color-drawdown)" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.5)" />
                    <XAxis 
                        dataKey="date" 
                        tickLine={false} 
                        axisLine={false} 
                        tickMargin={8} 
                        tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short' })} 
                    />
                    <YAxis 
                        tickLine={false} 
                        axisLine={false} 
                        tickMargin={8} 
                        tickFormatter={(value) => `${(Number(value) * 100).toFixed(0)}%`} 
                        domain={[0, 'dataMax']}
                        yAxisId="left"
                    />
                    <Tooltip 
                        cursor={{stroke: "hsl(var(--border))", strokeWidth: 1, strokeDasharray: "3 3"}}
                        content={<ChartTooltipContent 
                            indicator="dot" 
                            formatter={(value) => `${(Number(value) * 100).toFixed(2)}%`}
                        />} 
                    />
                    <Area yAxisId="left" type="monotone" dataKey="drawdown" stroke="var(--color-drawdown)" strokeWidth={2} fillOpacity={1} fill="url(#colorDrawdown)" />
                </AreaChart>
            </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
