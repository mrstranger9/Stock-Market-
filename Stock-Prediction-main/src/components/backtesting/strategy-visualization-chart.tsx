'use client';
import { createChart, ColorType, LineStyle, IChartApi, ISeriesApi } from 'lightweight-charts';
import React, { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// Lightweight Charts expects data in this format
export interface CandlestickData {
    time: string; // "YYYY-MM-DD"
    open: number;
    high: number;
    low: number;
    close: number;
}

export interface SignalMarker {
    time: string; // "YYYY-MM-DD"
    position: 'aboveBar' | 'belowBar';
    color: string;
    shape: 'arrowUp' | 'arrowDown';
    text: string;
}

interface StrategyVisualizationChartProps {
    symbol: string;
    candlestickData: CandlestickData[];
    signals: SignalMarker[];
}

const chartOptions = (theme: string | undefined) => ({
    layout: {
        background: {
            type: ColorType.Solid,
            color: theme === 'dark' ? '#111827' : '#FFFFFF',
        },
        textColor: theme === 'dark' ? '#D1D5DB' : '#1F2937',
    },
    grid: {
        vertLines: {
            color: theme === 'dark' ? 'rgba(75, 85, 99, 0.5)' : 'rgba(229, 231, 235, 0.5)',
            style: LineStyle.Dashed,
        },
        horzLines: {
            color: theme === 'dark' ? 'rgba(75, 85, 99, 0.5)' : 'rgba(229, 231, 235, 0.5)',
            style: LineStyle.Dashed,
        },
    },
    crosshair: {
        mode: 1, // Magnet mode
    },
    rightPriceScale: {
        borderColor: theme === 'dark' ? '#374151' : '#D1D5DB',
    },
    timeScale: {
        borderColor: theme === 'dark' ? '#374151' : '#D1D5DB',
    },
});

export default function StrategyVisualizationChart({ symbol, candlestickData, signals }: StrategyVisualizationChartProps) {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const { theme } = useTheme();

    useEffect(() => {
        const chartContainer = chartContainerRef.current;
        if (!chartContainer || candlestickData.length === 0 || chartContainer.clientHeight === 0) {
            return;
        }

        // Ensure data is in the correct format with numbers
        const formattedData = candlestickData.map(d => ({
            time: d.time,
            open: Number(d.open),
            high: Number(d.high),
            low: Number(d.low),
            close: Number(d.close),
        }));

        // Helper to get computed CSS variables for colors
        const getComputedColor = (variable: string) => {
            if (typeof window === 'undefined') return '';
            
            // Create a temporary element to resolve the CSS variable to a computed color (e.g., rgb)
            const tempEl = document.createElement('div');
            tempEl.style.color = `hsl(var(${variable}))`;
            tempEl.style.display = 'none';
            document.body.appendChild(tempEl);
            
            const computedColor = getComputedStyle(tempEl).color;
            
            document.body.removeChild(tempEl);
            
            return computedColor;
        };
        
        const upColor = getComputedColor('--chart-1');
        const downColor = getComputedColor('--chart-2');

        const chart = createChart(chartContainer, {
            ...chartOptions(theme),
            width: chartContainer.clientWidth,
            height: chartContainer.clientHeight,
        });

        const candlestickSeries = chart.addCandlestickSeries({
            upColor,
            downColor,
            borderVisible: false,
            wickUpColor: upColor,
            wickDownColor: downColor,
        });

        candlestickSeries.setData(formattedData);

        // Resolve marker colors from CSS variables to actual HSL values
        const resolvedSignals = signals.map(signal => ({
            ...signal,
            color: signal.shape === 'arrowUp' ? upColor : downColor,
        }));

        candlestickSeries.setMarkers(resolvedSignals);
        
        chart.timeScale().fitContent();
        
        const handleResize = () => {
            if (chartContainerRef.current) {
                chart.applyOptions({ width: chartContainerRef.current.clientWidth });
            }
        };

        window.addEventListener('resize', handleResize);
        
        return () => {
            window.removeEventListener('resize', handleResize);
            chart.remove();
        };
    }, [candlestickData, signals, theme]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Candlestick Strategy Visualization - {symbol}</CardTitle>
                <CardDescription>Interactive OHLC chart with trade signals. Use your mouse to scroll and zoom.</CardDescription>
            </CardHeader>
            <CardContent className="p-2 pt-0">
                <div ref={chartContainerRef} className="w-full h-[400px]" />
            </CardContent>
        </Card>
    );
}
