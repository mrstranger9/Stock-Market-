"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useMarketData, INDIAN_STOCKS } from "@/lib/market-simulator";
import { PriceTag } from "@/components/ui/price-tag";
import { ChangeBadge } from "@/components/ui/change-badge";
import { Search, Plus, Trash2, GripVertical, Info, FileStack } from "lucide-react";
import { cn } from "@/lib/utils";
import { Line } from "react-chartjs-2";

export default function WatchlistPage() {
  const { marketData } = useMarketData();
  const [activeList, setActiveList] = useState("My Stocks");
  const [selectedStock, setSelectedStock] = useState<string | null>(INDIAN_STOCKS[0].symbol);

  const lists = ["My Stocks", "Nifty 50", "FMCG Watch", "High Beta"];

  const chartData = {
    labels: Array.from({ length: 24 }).map((_, i) => i.toString()),
    datasets: [{
      fill: true,
      data: Array.from({ length: 24 }).map(() => Math.random() * 100 + 1000),
      borderColor: '#00D4AA',
      backgroundColor: 'rgba(0, 212, 170, 0.1)',
      tension: 0.4,
      pointRadius: 0,
      borderWidth: 2,
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { x: { display: false }, y: { display: false } }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row gap-6 w-full max-w-[1600px] mx-auto h-[calc(100vh-120px)] pb-6">
        
        {/* Left Panel: Watchlist Manager */}
        <div className="w-full md:w-[40%] lg:w-[35%] flex flex-col gap-4">
          <div className="glass-card rounded-2xl border border-white/5 flex flex-col h-full overflow-hidden">
            
            {/* Watchlist Tabs */}
            <div className="flex border-b border-white/5 bg-[#080E19]/80 overflow-x-auto hide-scrollbar p-2 gap-2">
              {lists.map(t => (
                <button 
                  key={t}
                  onClick={() => setActiveList(t)}
                  className={cn(
                    "px-4 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap",
                    activeList === t ? "bg-white/10 text-white shadow-sm border border-white/10" : "text-gray-500 hover:text-white"
                  )}
                >
                  {t}
                </button>
              ))}
              <button className="px-3 py-1.5 text-xs font-bold text-[#00D4AA] opacity-80 hover:opacity-100 flex items-center gap-1 border border-dashed border-[#00D4AA]/30 rounded-lg shrink-0">
                <Plus className="w-3 h-3" /> Create
              </button>
            </div>

            {/* Search */}
            <div className="p-4 border-b border-white/5">
               <div className="relative">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                 <input type="text" placeholder="Add symbol..." className="w-full bg-[#060B14] border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-[#00D4AA]/50" />
               </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-2 scrollbar-hide">
              {INDIAN_STOCKS.map((stock, i) => {
                const data = marketData[stock.symbol];
                if (!data) return null;
                const isSelected = selectedStock === stock.symbol;

                return (
                  <div 
                    key={stock.symbol} 
                    onClick={() => setSelectedStock(stock.symbol)}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-xl transition-colors cursor-pointer mb-2 group",
                      isSelected ? "bg-[#00D4AA]/5 border border-[#00D4AA]/20" : "hover:bg-white/[0.02] border border-transparent"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <GripVertical className="w-4 h-4 text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab hover:text-white" />
                      <div>
                        <div className={cn("font-bold text-sm tracking-tight", isSelected ? "text-white" : "text-gray-300 group-hover:text-white")}>
                          {stock.symbol.split('.')[0]}
                        </div>
                        <div className="text-[10px] text-gray-500 font-medium truncate w-24">{stock.name}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <PriceTag value={data.price} prev={data.prevClose} className="text-sm block" />
                        <ChangeBadge value={data.changePercent} />
                      </div>
                      <button className="text-gray-600 hover:text-[#FF4D6D] hover:bg-[#FF4D6D]/10 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Right Panel: Active Details */}
        <div className="flex-1">
          {selectedStock ? (
            <div className="glass-card rounded-2xl border border-white/5 h-full flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
               <div className="p-6 border-b border-white/5 bg-[#080E19]/80 flex justify-between items-start">
                 <div>
                   <h2 className="text-3xl font-black text-white mb-1 flex items-center gap-3">
                     {selectedStock.split('.')[0]}
                     <span className="text-[10px] font-bold bg-[#00D4AA]/10 text-[#00D4AA] px-2 py-0.5 rounded border border-[#00D4AA]/20 uppercase">EQ</span>
                   </h2>
                   <p className="text-gray-400 text-sm font-medium">{INDIAN_STOCKS.find(s => s.symbol === selectedStock)?.name}</p>
                 </div>
                 
                 <div className="flex flex-col items-end">
                   <PriceTag value={marketData[selectedStock]?.price || 0} prev={marketData[selectedStock]?.prevClose} className="text-4xl text-white block mb-1" />
                   <ChangeBadge value={marketData[selectedStock]?.changePercent || 0} className="text-sm px-2 py-1" />
                 </div>
               </div>

               <div className="p-6 flex-1 flex flex-col">
                  {/* Action Buttons */}
                  <div className="flex gap-4 mb-8">
                     <button className="flex-1 bg-[#00D4AA] hover:bg-[#00D4AA]/90 text-[#060B14] font-black py-3 rounded-xl shadow-[0_0_15px_rgba(0,212,170,0.3)] transition-all flex justify-center items-center gap-2">
                       QUICK BUY
                     </button>
                     <button className="flex-1 bg-[#FF4D6D] hover:bg-[#FF4D6D]/90 text-white font-black py-3 rounded-xl shadow-[0_0_15px_rgba(255,77,109,0.3)] transition-all flex justify-center items-center gap-2">
                       QUICK SELL
                     </button>
                     <button className="w-12 h-12 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl flex items-center justify-center transition-colors">
                       <FileStack className="w-5 h-5 text-gray-300" />
                     </button>
                  </div>

                  {/* Intraday Chart */}
                  <div className="h-64 w-full bg-[#060B14]/50 border border-white/5 rounded-xl p-4 mb-8">
                     <div className="flex justify-between items-center mb-4">
                       <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">1D Intraday Trend</span>
                       <span className="text-[10px] font-mono text-gray-600 bg-white/5 px-1.5 py-0.5 rounded">1m timeframe</span>
                     </div>
                     <div className="h-48 w-full relative">
                        <Line data={chartData} options={chartOptions} />
                     </div>
                  </div>

                  {/* Quick Stats Grid */}
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-white/5 pb-2">Key Intraday Levels</h3>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-[#080E19] border border-white/5 p-4 rounded-xl">
                      <div className="text-xs text-gray-500 font-bold mb-1">Open</div>
                      <div className="font-mono font-bold text-white tracking-tight text-lg">₹{(marketData[selectedStock]?.prevClose * 1.001 || 0).toFixed(2)}</div>
                    </div>
                    <div className="bg-[#080E19] border border-white/5 p-4 rounded-xl">
                      <div className="text-xs text-gray-500 font-bold mb-1">Day High</div>
                      <div className="font-mono font-bold text-[#00D4AA] tracking-tight text-lg">₹{(marketData[selectedStock]?.dayHigh || 0).toFixed(2)}</div>
                    </div>
                    <div className="bg-[#080E19] border border-white/5 p-4 rounded-xl">
                      <div className="text-xs text-gray-500 font-bold mb-1">Day Low</div>
                      <div className="font-mono font-bold text-[#FF4D6D] tracking-tight text-lg">₹{(marketData[selectedStock]?.dayLow || 0).toFixed(2)}</div>
                    </div>
                    <div className="bg-[#080E19] border border-white/5 p-4 rounded-xl">
                      <div className="text-xs text-gray-500 font-bold mb-1">Volume (Shares)</div>
                      <div className="font-mono font-bold text-gray-300 tracking-tight text-lg">{(marketData[selectedStock]?.volume || 0).toLocaleString()}</div>
                    </div>
                  </div>
               </div>
            </div>
          ) : (
             <div className="glass-card rounded-2xl border border-white/5 h-full flex flex-col items-center justify-center text-gray-500">
               <Info className="w-12 h-12 mb-4 opacity-50 text-gray-600" />
               <p className="font-medium text-lg">Select a stock to view details</p>
             </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
}
