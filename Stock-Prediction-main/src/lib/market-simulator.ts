"use client";

import { useState, useEffect } from 'react';

export const INDIAN_STOCKS = [
  { symbol: 'RELIANCE.NS', basePrice: 2847.00, name: 'Reliance Industries' },
  { symbol: 'HDFCBANK.NS', basePrice: 1642.00, name: 'HDFC Bank' },
  { symbol: 'TCS.NS', basePrice: 3892.00, name: 'Tata Consultancy Services' },
  { symbol: 'INFY.NS', basePrice: 1456.00, name: 'Infosys' },
  { symbol: 'ICICIBANK.NS', basePrice: 1089.00, name: 'ICICI Bank' },
  { symbol: 'SBIN.NS', basePrice: 782.00, name: 'State Bank of India' },
  { symbol: 'BHARTIARTL.NS', basePrice: 1654.00, name: 'Bharti Airtel' },
  { symbol: 'BAJFINANCE.NS', basePrice: 6892.00, name: 'Bajaj Finance' },
  { symbol: 'HINDUNILVR.NS', basePrice: 2341.00, name: 'Hindustan Unilever' },
  { symbol: 'LT.NS', basePrice: 3456.00, name: 'Larsen & Toubro' },
];

export type MarketData = {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  flash: 'up' | 'down' | null;
  dayHigh: number;
  dayLow: number;
  prevClose: number;
};

export function useMarketData() {
  const [data, setData] = useState<Record<string, MarketData>>(() => {
    const initialState: Record<string, MarketData> = {};
    INDIAN_STOCKS.forEach((stock, i) => {
      initialState[stock.symbol] = {
        symbol: stock.symbol,
        name: stock.name,
        price: stock.basePrice,
        prevClose: stock.basePrice * 0.99,
        change: stock.basePrice - (stock.basePrice * 0.99),
        changePercent: ((stock.basePrice - (stock.basePrice * 0.99)) / (stock.basePrice * 0.99)) * 100,
        volume: 1500000 + (i * 250000),
        flash: null,
        dayHigh: stock.basePrice * 1.01,
        dayLow: stock.basePrice * 0.98,
      };
    });
    return initialState;
  });

  const [isMarketOpen] = useState(true);

  useEffect(() => {
    if (!isMarketOpen) return;

    const interval = setInterval(() => {
      setData(prev => {
        const next = { ...prev };
        
        const stocksToUpdate = INDIAN_STOCKS
          .sort(() => 0.5 - Math.random())
          .slice(0, Math.floor(Math.random() * 4) + 2);

        for (const key in next) {
          next[key] = { ...next[key], flash: null };
        }

        stocksToUpdate.forEach(stock => {
          const current = next[stock.symbol];
          const volatility = 0.004;
          const pctChange = (Math.random() * volatility * 2) - volatility;
          const priceChange = current.price * pctChange;
          
          const newPrice = Number((current.price + priceChange).toFixed(2));
          const netChange = newPrice - current.prevClose;
          const netChangePercent = (netChange / current.prevClose) * 100;
          
          next[stock.symbol] = {
            ...current,
            price: newPrice,
            change: Number(netChange.toFixed(2)),
            changePercent: Number(netChangePercent.toFixed(2)),
            volume: current.volume + Math.floor(Math.random() * 10000),
            flash: priceChange > 0 ? 'up' : 'down',
            dayHigh: Math.max(current.dayHigh, newPrice),
            dayLow: Math.min(current.dayLow, newPrice),
          };
        });

        return next;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isMarketOpen]);

  return { marketData: data, isMarketOpen };
}

export function usePortfolioData() {
  const { marketData } = useMarketData();
  
  const baseInvestment = 450000;
  const relChange = marketData['RELIANCE.NS']?.changePercent || 0;
  const hdfcChange = marketData['HDFCBANK.NS']?.changePercent || 0;
  
  const avgChange = (relChange * 0.6) + (hdfcChange * 0.4);
  const currentPnl = baseInvestment * (avgChange / 100);
  const currentValue = baseInvestment + currentPnl + 21110;

  return {
    totalValue: currentValue,
    dailyPnl: currentPnl + 11240,
    dailyPnlPercent: ((currentPnl + 11240) / baseInvestment) * 100,
    activePositions: 7,
    accuracy: 87.3,
    pendingAlerts: 3
  };
}
