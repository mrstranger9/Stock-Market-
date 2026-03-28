'use client';
import { Pie, PieChart, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

const data = [
  { sector: 'tech', value: 35, fill: 'var(--color-tech)' },
  { sector: 'healthcare', value: 20, fill: 'var(--color-healthcare)' },
  { sector: 'finance', value: 18, fill: 'var(--color-finance)' },
  { sector: 'consumer', value: 15, fill: 'var(--color-consumer)' },
  { sector: 'energy', value: 12, fill: 'var(--color-energy)' },
];

const chartConfig = {
    value: { label: 'Value' },
    tech: { label: 'Tech', color: 'hsl(var(--chart-4))' }, // Blue
    healthcare: { label: 'Healthcare', color: 'hsl(var(--chart-1))' }, // Green
    finance: { label: 'Finance', color: 'hsl(262, 80%, 58%)' }, // Purple
    consumer: { label: 'Consumer', color: 'hsl(var(--chart-2))' }, // Red
    energy: { label: 'Energy', color: 'hsl(var(--chart-3))' }, // Yellow
} satisfies ChartConfig;

export default function SectorAllocationChart() {
  const sortedData = [...data].sort((a, b) => b.value - a.value);

  return (
    <div className="w-full">
        <div className="h-[200px] w-full">
            <ChartContainer config={chartConfig} className="h-full w-full">
                <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Tooltip cursor={false} content={<ChartTooltipContent hideLabel nameKey="sector" formatter={(value) => `${value}%`} />} />
                    <Pie
                        data={data}
                        dataKey="value"
                        nameKey="sector"
                        innerRadius={60}
                        strokeWidth={3}
                        stroke="hsl(var(--card))"
                        cornerRadius={5}
                    >
                        {data.map((entry) => (
                            <Cell key={`cell-${entry.sector}`} fill={entry.fill} />
                        ))}
                    </Pie>
                </PieChart>
                </ResponsiveContainer>
            </ChartContainer>
        </div>
        <div className="mt-4 flex flex-col gap-2.5">
            {sortedData.map((entry) => {
                const configEntry = chartConfig[entry.sector as keyof typeof chartConfig];
                return (
                    <div key={entry.sector} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                            <span
                                className="h-2.5 w-2.5 rounded-full"
                                style={{ backgroundColor: configEntry.color }}
                            />
                            <span className="text-muted-foreground">{configEntry.label}</span>
                        </div>
                        <span className="font-semibold text-foreground">{entry.value}%</span>
                    </div>
                );
            })}
        </div>
    </div>
  );
}
