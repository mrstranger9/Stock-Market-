'use client';
import { Pie, PieChart, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';


const chartConfig = {
    value: { label: 'Value' },
    cash: { label: 'Cash', color: 'hsl(var(--chart-3))' },
    equities: { label: 'Equities', color: 'hsl(var(--chart-4))' },
} satisfies ChartConfig;

interface PortfolioAllocationChartProps {
    data: { name: string; value: number; fill: string }[];
}

export default function PortfolioAllocationChart({ data }: PortfolioAllocationChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Asset Allocation</CardTitle>
        <CardDescription>Breakdown of cash vs. invested equities.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] w-full">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip cursor={false} content={<ChartTooltipContent hideLabel nameKey="name" formatter={(value) => `$${Number(value).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}`}/>} />
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  strokeWidth={5}
                  stroke="hsl(var(--card))"
                  cornerRadius={5}
                >
                    {data.map((entry) => (
                        <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                    ))}
                </Pie>
                <ChartLegend content={<ChartLegendContent />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
