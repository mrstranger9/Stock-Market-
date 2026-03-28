"use client";

import { useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

export function EquityCurve({ timeRange }: { timeRange: string }) {
  // Generate dummy data based on timeRange
  const dataPoints = timeRange === '1D' ? 24 : timeRange === '1W' ? 7 : timeRange === '1M' ? 30 : 180;
  
  const labels = Array.from({ length: dataPoints }).map((_, i) => `${i}`);
  
  const portfolioData = useMemo(() => {
    let val = 400000;
    return Array.from({ length: dataPoints }).map(() => {
      val = val * (1 + (Math.random() * 0.02 - 0.008));
      return val;
    });
  }, [dataPoints]);

  const benchmarkData = useMemo(() => {
    let val = 400000;
    return Array.from({ length: dataPoints }).map(() => {
      val = val * (1 + (Math.random() * 0.015 - 0.007));
      return val;
    });
  }, [dataPoints]);

  const data = {
    labels,
    datasets: [
      {
        fill: true,
        label: 'My Portfolio',
        data: portfolioData,
        borderColor: '#00D4AA',
        backgroundColor: 'rgba(0, 212, 170, 0.1)',
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 6,
      },
      {
        fill: false,
        label: 'NIFTY 50 Benchmark',
        data: benchmarkData,
        borderColor: '#3b82f6',
        borderDash: [5, 5],
        tension: 0.4,
        borderWidth: 1.5,
        pointRadius: 0,
        pointHoverRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
        align: 'end' as const,
        labels: {
          color: '#9ca3af',
          usePointStyle: true,
          boxWidth: 8,
          font: { family: "'DM Sans', sans-serif", weight: 'bold' as const, size: 11 }
        }
      },
      tooltip: {
        backgroundColor: '#0F1928',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: function(context: any) {
             let label = context.dataset.label || '';
             if (label) {
                 label += ': ';
             }
             if (context.parsed.y !== null) {
                 label += new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(context.parsed.y);
             }
             return label;
          }
        }
      }
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
        },
        ticks: {
          color: '#6b7280',
          font: { family: "'DM Mono', monospace", size: 10 },
          callback: function(value: any) {
            return '₹' + (value / 1000).toFixed(0) + 'k';
          }
        },
        border: { display: false }
      },
    },
  };

  return (
    <div className="w-full h-full relative">
      <div className="absolute top-2 left-6 z-10">
        <div className="inline-flex items-center gap-2 bg-[#00D4AA]/10 text-[#00D4AA] border border-[#00D4AA]/20 px-3 py-1.5 rounded-full text-xs font-bold shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00D4AA] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00D4AA]"></span>
          </span>
          +8.2% vs benchmark
        </div>
      </div>
      <Line options={options} data={data} />
    </div>
  );
}
