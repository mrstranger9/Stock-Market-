"use client";

import { useEffect, useRef } from "react";
import { useMarketData } from "@/lib/market-simulator";
import { useToast } from "@/hooks/use-toast";

export function RealtimeAlerts() {
  const { marketData } = useMarketData();
  const { toast } = useToast();
  const mountedRef = useRef(false);

  useEffect(() => {
    // Wait for initial render to avoid SSR hydration gaps
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }

    const stocks = Object.values(marketData);
    
    // Simulate algorithmic alerts on ticking data
    stocks.forEach(stock => {
      // 5% chance to trigger an alert if stock is moving
      if (stock.flash && Math.random() > 0.95) {
        if (stock.flash === 'up') {
          toast({
            title: `🚀 ${stock.symbol} Bullish Breakout`,
            description: `Aggressive buying detected. Volume surging as price clears resistance level to ₹${stock.price.toFixed(2)}`,
            duration: 8000,
          });
        } else if (stock.flash === 'down') {
          toast({
            title: `⚠️ ${stock.symbol} High Selling Pressure`,
            description: `Institutional block orders executed. Price slid rapidly down to ₹${stock.price.toFixed(2)}`,
            variant: "destructive",
            duration: 8000,
          });
        }
      }
    });

  }, [marketData, toast]);

  return null;
}
