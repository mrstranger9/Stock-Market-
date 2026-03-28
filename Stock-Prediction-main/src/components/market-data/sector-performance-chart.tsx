'use client'

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart'

const data = [
  { sector: 'Tech', change: 2.1, fill: 'hsl(var(--chart-1))' },
  { sector: 'Healthcare', change: 1.5, fill: 'hsl(var(--chart-1))' },
  { sector: 'Industrials', change: 0.8, fill: 'hsl(var(--chart-1))' },
  { sector: 'Financials', change: -0.5, fill: 'hsl(var(--chart-2))' },
  { sector: 'Energy', change: -1.2, fill: 'hsl(var(--chart-2))' },
  { sector: 'Utilities', change: 0.2, fill: 'hsl(var(--chart-1))' },
].sort((a,b) => b.change - a.change);

export default function SectorPerformanceChart() {
  return (
    <Card className="hover:shadow-xl hover:border-primary/20 transition-all">
      <CardHeader>
        <CardTitle>Sector Performance</CardTitle>
        <CardDescription>Today's performance by market sector.</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-[220px] w-full">
          <ChartContainer config={{}} className="h-full w-full">
            <ResponsiveContainer>
              <BarChart data={data} layout="vertical" margin={{ left: 10, right: 10 }}>
                <XAxis type="number" hide />
                <YAxis
                  dataKey="sector"
                  type="category"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  width={80}
                />
                <Tooltip
                  cursor={{ fill: 'hsl(var(--accent))' }}
                  content={<ChartTooltipContent
                    formatter={(value) => `${(value as number).toFixed(1)}%`}
                    indicator="dot"
                  />}
                />
                <Bar dataKey="change" radius={4}>
                  {data.map((entry) => (
                    <Cell key={`cell-${entry.sector}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  )
}
