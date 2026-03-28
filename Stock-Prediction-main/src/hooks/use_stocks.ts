'use client';
import { useEffect, useState, useRef } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────
export type StockData = {
  symbol: string;       // full Yahoo ticker e.g. "RELIANCE.NS"
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: string;
  marketCap: string;
  sparklineData: { value: number }[];
  timestamp: number;
};

/** Strips exchange suffix for clean UI display: "RELIANCE.NS" → "RELIANCE" */
export const displaySymbol = (symbol: string) => symbol.split('.')[0];

type UseStocksReturn = {
  stocks: StockData[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
};

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:8000';

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useStocks(): UseStocksReturn {
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const esRef = useRef<EventSource | null>(null);

  useEffect(() => {
    let isMounted = true;

    // 1. Initial snapshot (fast, no wait for SSE cycle)
    fetch(`${BACKEND_URL}/api/stocks`)
      .then((r) => r.json())
      .then((data: StockData[]) => {
        if (!isMounted) return;
        setStocks(data);
        setLastUpdated(new Date());
        setLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(`Could not reach backend: ${err.message}`);
        setLoading(false);
      });

    // 2. Live stream (pushes every ~15 s from backend)
    const es = new EventSource(`${BACKEND_URL}/api/stocks/live/stream`);
    esRef.current = es;

    es.onmessage = (event) => {
      if (!isMounted) return;
      try {
        const data: StockData[] = JSON.parse(event.data);
        setStocks(data);
        setLastUpdated(new Date());
        setError(null);
      } catch {
        // ignore parse errors
      }
    };

    es.onerror = () => {
      if (!isMounted) return;
      setError('Live stream disconnected – retrying…');
    };

    return () => {
      isMounted = false;
      es.close();
    };
  }, []);

  return { stocks, loading, error, lastUpdated };
}