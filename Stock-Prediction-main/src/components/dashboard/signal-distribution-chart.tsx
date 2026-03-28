'use client';
import { useMemo } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

const chartData = [
  { signal: 'buy', count: 45, fill: 'var(--color-buy)' },
  { signal: 'sell', count: 25, fill: 'var(--color-sell)' },
  { signal: 'hold', count: 30, fill: 'var(--color-hold)' },
];

const chartConfig = {
  count: {
    label: "Signals",
  },
  buy: {
    label: "Buy",
    color: "hsl(var(--chart-1))",
  },
  sell: {
    label: "Sell",
    color: "hsl(var(--chart-2))",
  },
  hold: {
    label: "Hold",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig

export default function SignalDistributionChart() {
  const totalSignals = useMemo(() => chartData.reduce((acc, curr) => acc + curr.count, 0), []);

  return (
    <div className="w-full">
      <div className="h-[200px]">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square h-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={chartData}
                dataKey="count"
                nameKey="signal"
                innerRadius={60}
                strokeWidth={5}
                stroke="hsl(var(--card))"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
      <div className="mt-6 flex items-center justify-center gap-x-8 text-sm">
        {chartData.map((item) => {
          const percentage = (item.count / totalSignals) * 100;
          const config = chartConfig[item.signal as keyof typeof chartConfig];

          return (
            <div
              key={item.signal}
              className="flex items-center gap-2"
            >
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: config.color }}
              />
              <div className="flex items-baseline gap-1">
                <span className="font-semibold uppercase text-foreground">
                  {config.label}
                </span>
                <span className="text-muted-foreground">
                  ({percentage.toFixed(0)}%)
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
