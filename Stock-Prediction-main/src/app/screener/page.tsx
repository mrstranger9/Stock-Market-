"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Filter, Play, Save, Settings2, ShieldQuestion } from "lucide-react";

export default function ScreenerPage() {
  return (
    <DashboardLayout>
      <div className="w-full max-w-7xl mx-auto pb-10">
        
        <div className="mb-8 flex justify-between items-end border-b border-white/5 pb-6">
          <div>
            <h1 className="text-3xl font-black text-white flex items-center gap-3">
               <Filter className="w-7 h-7 text-[#00D4AA]" /> Market Screener
            </h1>
            <p className="text-gray-400 font-medium mt-2">Filter and identify setups based on 50+ technical/fundamental criteria.</p>
          </div>
          <div className="flex gap-3">
             <button className="bg-white/5 border border-white/10 text-white font-bold px-4 py-2 rounded-xl text-sm flex items-center gap-2 hover:bg-white/10 transition">
               <Save className="w-4 h-4" /> Save Preset
             </button>
             <button className="bg-[#00D4AA] text-[#060B14] font-black px-6 py-2 rounded-xl flex items-center gap-2 hover:bg-[#00D4AA]/90 shadow-[0_0_15px_rgba(0,212,170,0.3)] transition">
               <Play className="w-4 h-4" /> Run Screen
             </button>
          </div>
        </div>

        <div className="flex gap-6">
           {/* Sidebar Filters */}
           <div className="w-64 shrink-0 space-y-6">
              <div className="space-y-3">
                 <h4 className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-2 flex items-center gap-2"><Settings2 className="w-3 h-3"/> Active Filters</h4>
                 
                 <div className="bg-[#080E19] border border-white/5 rounded-xl p-3">
                   <div className="text-xs font-bold text-gray-400 mb-1">Market Cap</div>
                   <div className="text-sm text-white font-bold">&gt; ₹10,000 Cr</div>
                 </div>
                 
                 <div className="bg-[#080E19] border border-white/5 rounded-xl p-3">
                   <div className="text-xs font-bold text-gray-400 mb-1">RSI (14)</div>
                   <div className="text-sm text-[#00D4AA] font-bold">Oversold (&lt; 30)</div>
                 </div>

                 <div className="bg-[#080E19] border border-white/5 rounded-xl p-3">
                   <div className="text-xs font-bold text-gray-400 mb-1">MACD Crossover</div>
                   <div className="text-sm text-[#00D4AA] font-bold">Bullish</div>
                 </div>
                 
                 <button className="w-full border border-dashed border-[#00D4AA]/30 text-[#00D4AA] font-bold text-xs py-2 rounded-lg hover:bg-[#00D4AA]/10 transition-colors">
                   + Add Filter
                 </button>
              </div>
           </div>

           {/* Results Area */}
           <div className="flex-1 glass-card rounded-2xl border border-white/5 flex flex-col items-center justify-center min-h-[500px] text-gray-500">
              <ShieldQuestion className="w-16 h-16 text-gray-600 mb-4 opacity-50" />
              <h3 className="text-xl font-bold text-gray-300 mb-2">Configure filters to run</h3>
              <p className="text-sm font-medium">Select criteria from the panel to discover institutional setups.</p>
           </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
