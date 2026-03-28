"use client";

import { useMarketData, INDIAN_STOCKS } from "@/lib/market-simulator";
import { PriceTag } from "../ui/price-tag";
import { ChangeBadge } from "../ui/change-badge";
import { SignalBadge } from "../ui/signal-badge";
import { ArrowUpRight } from "lucide-react";

export function LiveStocksTable() {
  const { marketData } = useMarketData();
  
  // Assign dummy signals based on index for variety
  const getDummySignal = (i: number) => {
    if (i % 3 === 0) return { type: 'BUY' as const, conf: 94 };
    if (i % 4 === 0) return { type: 'SELL' as const, conf: 88 };
    return { type: 'HOLD' as const, conf: 65 };
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-[10px] text-gray-500 uppercase tracking-widest bg-white/[0.02] border-y border-white/5 font-bold">
          <tr>
            <th className="px-4 py-3 font-bold">Symbol</th>
            <th className="px-4 py-3 font-bold text-right">Price (₹)</th>
            <th className="px-4 py-3 font-bold text-right">Change</th>
            <th className="px-4 py-3 font-bold text-right">Volume</th>
            <th className="px-4 py-3 font-bold text-center">AI Signal</th>
            <th className="px-4 py-3 font-bold text-center">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {INDIAN_STOCKS.map((stock, i) => {
            const data = marketData[stock.symbol];
            if (!data) return null;
            const signal = getDummySignal(i);

            return (
              <tr key={stock.symbol} className="hover:bg-white/[0.02] transition-colors group cursor-pointer">
                <td className="px-4 py-3">
                  <div className="font-bold text-gray-200 group-hover:text-white transition-colors">{stock.symbol.split('.')[0]}</div>
                  <div className="text-[10px] text-gray-500 hidden sm:block truncate w-32">{stock.name}</div>
                </td>
                <td className="px-4 py-3 text-right">
                  <PriceTag value={data.price} prev={data.prevClose} />
                </td>
                <td className="px-4 py-3 text-right">
                  <ChangeBadge value={data.changePercent} />
                </td>
                <td className="px-4 py-3 text-right font-mono text-gray-400">
                  {(data.volume / 100000).toFixed(2)}L
                </td>
                <td className="px-4 py-3 text-center">
                  <SignalBadge type={signal.type} confidence={signal.conf} />
                </td>
                <td className="px-4 py-3 text-center">
                  <button className="text-gray-500 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors">
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
