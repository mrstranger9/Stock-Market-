'use client';
import { Area, AreaChart, ResponsiveContainer } from 'recharts';

interface SparklineChartProps {
  data: { value: number }[];
  color: string;
}

export default function SparklineChart({ data, color }: SparklineChartProps) {
  const gradientId = `sparkline-gradient-${color.replace(/[^a-zA-Z0-9]/g, '')}`;

  return (
    <div className="w-full h-10">
      <ResponsiveContainer>
        <AreaChart data={data}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.4} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            fill={`url(#${gradientId})`}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
