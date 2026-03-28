"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useMarketData, INDIAN_STOCKS } from "@/lib/market-simulator";
import { PriceTag } from "@/components/ui/price-tag";
import { ChangeBadge } from "@/components/ui/change-badge";
import { SignalBadge } from "@/components/ui/signal-badge";
import { StockDetailModal } from "@/components/market-data/stock-detail-modal";
import { Search, SlidersHorizontal, ArrowUpRight, TrendingUp, TrendingDown, Clock } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function MarketDataPage() {
  const { marketData, isMarketOpen } = useMarketData();
  const [selectedStock, setSelectedStock] = useState<any>(null);

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8 w-full max-w-[1600px] mx-auto pb-10">
        
        {/* TOP: Index Overview */}
        <div>
          <h2 className="text-2xl font-black mb-4 flex items-center gap-3">
             Market Indices
             <span className="text-[10px] font-bold bg-[#00D4AA]/10 text-[#00D4AA] px-2 py-0.5 rounded border border-[#00D4AA]/20 uppercase tracking-widest flex items-center gap-1.5">
               <span className="w-1.5 h-1.5 rounded-full bg-[#00D4AA] animate-pulse"></span> NSE Live
             </span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 overflow-x-auto hide-scrollbar pb-2">
             {[
               { name: "NIFTY 50", val: 22450.00, chg: 0.43 },
               { name: "SENSEX", val: 73820.00, chg: 0.38 },
               { name: "BANK NIFTY", val: 48930.50, chg: -0.12 },
               { name: "NIFTY IT", val: 34120.00, chg: 1.24 },
               { name: "NIFTY PHARMA", val: 18450.00, chg: 0.85 }
             ].map((idx, i) => (
               <div key={i} className="glass-card rounded-xl p-4 border border-white/5 whitespace-nowrap">
                 <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">{idx.name}</div>
                 <div className="font-mono text-lg font-bold text-white leading-none mb-2">{idx.val.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                 <ChangeBadge value={idx.chg} className="px-1" />
               </div>
             ))}
          </div>
        </div>

        {/* SECTION 2: Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="glass-card rounded-2xl border border-white/5 flex flex-col">
            <div className="p-4 border-b border-white/5 flex gap-4 text-sm font-bold bg-[#080E19]/50">
               <button className="text-[#00D4AA] relative">Top Gainers <div className="absolute -bottom-4 left-0 w-full h-0.5 bg-[#00D4AA] rounded-t-full shadow-[0_0_8px_#00D4AA]"></div></button>
               <button className="text-gray-500 hover:text-white transition-colors">Top Losers</button>
               <button className="text-gray-500 hover:text-white transition-colors">Volume</button>
            </div>
            <div className="p-2 flex-1">
               {INDIAN_STOCKS.slice(0, 5).map((stock, i) => {
                 const data = marketData[stock.symbol];
                 if (!data) return null;
                 return (
                   <div key={i} className="flex items-center justify-between p-3 hover:bg-white/[0.02] rounded-xl transition-colors cursor-pointer group" onClick={() => setSelectedStock(data)}>
                      <div className="flex items-center gap-3">
                         <div className="w-6 text-center font-bold text-gray-600 text-xs">{i+1}</div>
                         <div>
                           <div className="font-bold text-sm text-gray-200 group-hover:text-white transition-colors">{stock.symbol.split('.')[0]}</div>
                           <div className="text-[10px] font-medium text-gray-500 w-24 truncate">{stock.name}</div>
                         </div>
                      </div>
                      <div className="text-right flex flex-col items-end">
                         <PriceTag value={data.price} prev={data.prevClose} className="text-sm border border-transparent group-hover:bg-[#00D4AA]/5 group-hover:text-[#00D4AA]" />
                         <ChangeBadge value={data.changePercent} className="mt-1 opacity-80" />
                      </div>
                   </div>
                 )
               })}
            </div>
          </div>

          <div className="glass-card rounded-2xl border border-white/5 p-5">
             <div className="flex justify-between items-center mb-5">
               <h3 className="font-bold text-sm uppercase tracking-wider text-gray-400">Sector Flow (Heatmap)</h3>
               <SlidersHorizontal className="w-4 h-4 text-gray-500" />
             </div>
             <div className="grid grid-cols-3 gap-2 h-64">
                <div className="col-span-2 row-span-2 rounded-xl bg-gradient-to-br from-[#00D4AA]/30 to-[#00D4AA]/10 p-3 relative overflow-hidden group cursor-pointer border border-[#00D4AA]/20">
                   <div className="font-bold tracking-tight text-white mb-1">Financial Services</div>
                   <div className="text-xs font-mono font-bold text-[#00D4AA]">+1.24%</div>
                </div>
                <div className="col-span-1 row-span-1 rounded-xl bg-gradient-to-br from-[#FF4D6D]/30 to-[#FF4D6D]/10 p-3 relative overflow-hidden group cursor-pointer border border-[#FF4D6D]/20">
                   <div className="font-bold text-xs tracking-tight text-white mb-0.5">IT</div>
                   <div className="text-[10px] font-mono font-bold text-[#FF4D6D]">-0.8%</div>
                </div>
                <div className="col-span-1 row-span-1 rounded-xl bg-gradient-to-br from-[#00D4AA]/10 to-[#00D4AA]/5 p-3 relative overflow-hidden group cursor-pointer border border-[#00D4AA]/10">
                   <div className="font-bold text-xs tracking-tight text-white mb-0.5">Energy</div>
                   <div className="text-[10px] font-mono font-bold text-[#00D4AA]">+0.4%</div>
                </div>
             </div>
          </div>
          
          <div className="glass-card rounded-2xl border border-white/5 p-5">
             <h3 className="font-bold text-sm uppercase tracking-wider text-gray-400 mb-6 flex items-center gap-2">
               Market Breadth
             </h3>
             <div className="space-y-4">
                <div>
                   <div className="flex justify-between text-xs font-bold mb-1.5">
                     <span className="text-[#00D4AA]">Advances (1,245)</span>
                     <span className="text-[#FF4D6D]">Declines (840)</span>
                   </div>
                   <div className="w-full bg-[#FF4D6D]/20 rounded-full h-2.5 overflow-hidden flex">
                      <div className="bg-[#00D4AA] h-full" style={{ width: '60%' }}></div>
                   </div>
                </div>
                <div className="text-xs font-bold text-gray-500 text-center py-2">
                   A/D Ratio: <span className="text-white font-mono">1.48</span>
                </div>
             </div>
             <div className="h-px bg-white/5 my-5"></div>
             <div>
                <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Inst. Activity (Daily Provisional)</h4>
                <div className="space-y-3">
                   <div className="flex justify-between items-center">
                     <span className="text-sm font-bold text-gray-300">FII / FPI</span>
                     <span className="text-sm font-bold text-[#00D4AA]">+₹1,450.2 Cr</span>
                   </div>
                   <div className="flex justify-between items-center">
                     <span className="text-sm font-bold text-gray-300">DII</span>
                     <span className="text-sm font-bold text-[#FF4D6D]">-₹842.5 Cr</span>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* SECTION 3: Full Table */}
        <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
          <div className="p-5 border-b border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#080E19]/80">
            <div className="flex gap-6 text-sm font-bold">
               <button className="text-white relative">NSE Equities <div className="absolute -bottom-[22px] left-0 w-full h-0.5 bg-[#00D4AA] rounded-t-full shadow-[0_0_8px_#00D4AA]"></div></button>
               <button className="text-gray-500 hover:text-white transition-colors">Currency</button>
               <button className="text-gray-500 hover:text-white transition-colors">Commodities</button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input type="text" placeholder="Search symbol or company..." className="bg-[#060B14] border border-white/10 rounded-lg pl-9 pr-4 py-1.5 text-xs focus:outline-none focus:border-[#00D4AA]/50 w-full md:w-64" />
            </div>
          </div>
          <div className="w-full overflow-x-auto">
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="text-[10px] text-gray-500 uppercase tracking-widest bg-white/[0.02] border-b border-white/5 font-bold">
                <tr>
                  <th className="px-5 py-3">Symbol</th>
                  <th className="px-5 py-3 text-right">LTP (₹)</th>
                  <th className="px-5 py-3 text-right">Change</th>
                  <th className="px-5 py-3 text-right">Open</th>
                  <th className="px-5 py-3 text-right">High</th>
                  <th className="px-5 py-3 text-right">Low</th>
                  <th className="px-5 py-3 text-right">Volume</th>
                  <th className="px-5 py-3 text-center">AI Signal</th>
                  <th className="px-5 py-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {INDIAN_STOCKS.map((stock, i) => {
                  const data = marketData[stock.symbol];
                  if (!data) return null;
                  return (
                    <tr key={stock.symbol} className="hover:bg-white/[0.04] transition-colors cursor-pointer group" onClick={() => setSelectedStock(data)}>
                      <td className="px-5 py-4">
                         <div className="font-bold text-white tracking-tight">{stock.symbol.split('.')[0]}</div>
                         <div className="text-[10px] font-medium text-gray-500">{stock.name}</div>
                      </td>
                      <td className="px-5 py-4 text-right">
                         <PriceTag value={data.price} prev={data.prevClose} className="group-hover:text-[#00D4AA] transition-colors" />
                      </td>
                      <td className="px-5 py-4 text-right">
                         <ChangeBadge value={data.changePercent} />
                      </td>
                      <td className="px-5 py-4 text-right font-mono font-bold text-gray-300">₹{(data.price * 0.995).toFixed(2)}</td>
                      <td className="px-5 py-4 text-right font-mono font-bold text-[#00D4AA]">₹{data.dayHigh.toFixed(2)}</td>
                      <td className="px-5 py-4 text-right font-mono font-bold text-[#FF4D6D]">₹{data.dayLow.toFixed(2)}</td>
                      <td className="px-5 py-4 text-right font-mono text-gray-400">{(data.volume / 100000).toFixed(2)}L</td>
                      <td className="px-5 py-4 text-center">
                         <SignalBadge type={i % 3 === 0 ? 'BUY' : i % 5 === 0 ? 'SELL' : 'HOLD'} className="px-3" />
                      </td>
                      <td className="px-5 py-4 text-center">
                         <button className="text-[#00D4AA] font-bold text-xs bg-[#00D4AA]/10 hover:bg-[#00D4AA]/20 px-3 py-1.5 rounded-lg transition-colors border border-[#00D4AA]/20">
                           Analyze
                         </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      <StockDetailModal 
        stock={selectedStock} 
        isOpen={!!selectedStock} 
        onClose={() => setSelectedStock(null)} 
      />
    </DashboardLayout>
  );
}