"use client";

import { useMarketData, INDIAN_STOCKS } from "@/lib/market-simulator";
import { ChangeBadge } from "../ui/change-badge";
import { PriceTag } from "../ui/price-tag";

export function TickerTape() {
  const { marketData } = useMarketData();
  
  // Duplicate array 3 times for a seamless CSS infinite marquee
  const items = [...INDIAN_STOCKS, ...INDIAN_STOCKS, ...INDIAN_STOCKS];

  return (
    <div className="w-full bg-[#060B14] border-b border-white/5 h-10 overflow-hidden flex items-center relative z-40 shadow-sm">
      <div className="flex w-[300%] animate-ticker whitespace-nowrap items-center h-full hover:[animation-play-state:paused] cursor-default">
        {items.map((stock, i) => {
          const data = marketData[stock.symbol];
          if (!data) return null;
          
          return (
            <div key={`${stock.symbol}-${i}`} className="inline-flex items-center px-6 border-r border-white/5 shrink-0 gap-3 group">
              <span className="font-bold text-sm text-gray-400 group-hover:text-white transition-colors">{stock.symbol.split('.')[0]}</span>
              <PriceTag value={data.price} prev={data.prevClose} className="text-sm font-medium text-gray-200" />
              <ChangeBadge value={data.changePercent} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
