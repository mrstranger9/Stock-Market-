"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Copy, TrendingUp, TrendingDown, Layers } from "lucide-react";

export default function OptionsChainPage() {
  const strikes = [22400, 22450, 22500, 22550, 22600, 22650, 22700];

  return (
    <DashboardLayout>
      <div className="w-full max-w-7xl mx-auto pb-10">
        
        <div className="mb-8 border-b border-white/5 pb-6 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black text-white flex items-center gap-3">
               <Layers className="w-8 h-8 text-[#00D4AA]" /> Options Chain
            </h1>
            <p className="text-gray-400 font-medium mt-2">Advanced derivatives data with real-time implied volatility and Greeks</p>
          </div>
          <div className="flex gap-2">
             <select className="bg-[#080E19] border border-white/10 text-white font-bold px-4 py-2 rounded-xl text-sm focus:outline-none focus:border-[#00D4AA]/50 appearance-none">
                <option>NIFTY 50</option>
                <option>BANKNIFTY</option>
                <option>RELIANCE</option>
             </select>
             <select className="bg-[#080E19] border border-white/10 text-[#00D4AA] font-bold px-4 py-2 rounded-xl text-sm focus:outline-none focus:border-[#00D4AA]/50 appearance-none">
                <option>27 Mar 2026</option>
                <option>03 Apr 2026</option>
             </select>
          </div>
        </div>

        <div className="glass-card rounded-2xl border border-white/5 p-1 w-full overflow-hidden">
           <div className="w-full overflow-x-auto hide-scrollbar">
             <table className="w-full text-sm text-center">
               <thead className="bg-[#080E19] border-b border-white/5">
                 <tr>
                    <th colSpan={4} className="px-4 py-3 text-xs font-bold text-[#00D4AA] uppercase tracking-widest border-r border-[#00D4AA]/20 bg-[#00D4AA]/5">CALLS</th>
                    <th className="px-4 py-3 text-xs font-black text-white bg-white/5">STRIKE</th>
                    <th colSpan={4} className="px-4 py-3 text-xs font-bold text-[#FF4D6D] uppercase tracking-widest border-l border-[#FF4D6D]/20 bg-[#FF4D6D]/5">PUTS</th>
                 </tr>
                 <tr className="text-[10px] text-gray-500 font-bold uppercase tracking-wider bg-white/[0.02] border-b border-white/5">
                    <th className="py-2 px-2 font-mono">OI (Lacs)</th>
                    <th className="py-2 px-2 font-mono">Volume</th>
                    <th className="py-2 px-2 font-mono">IV</th>
                    <th className="py-2 px-4 text-right border-r border-white/5">LTP</th>
                    
                    <th className="py-2 px-4 bg-white/5 text-gray-300">PRICE</th>
                    
                    <th className="py-2 px-4 text-left border-l border-white/5">LTP</th>
                    <th className="py-2 px-2 font-mono">IV</th>
                    <th className="py-2 px-2 font-mono">Volume</th>
                    <th className="py-2 px-2 font-mono">OI (Lacs)</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                 {strikes.map((s, i) => {
                   const isITMCall = s < 22550;
                   const isITMPut = s > 22550;
                   return (
                     <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                        <td className={`p-3 font-mono text-gray-400 ${isITMCall ? 'bg-amber-500/5' : ''}`}>{(Math.random() * 50).toFixed(1)}</td>
                        <td className={`p-3 font-mono text-gray-500 ${isITMCall ? 'bg-amber-500/5' : ''}`}>{Math.floor(Math.random() * 200000)}</td>
                        <td className={`p-3 font-mono text-[#00D4AA] ${isITMCall ? 'bg-amber-500/5' : ''}`}>{(Math.random() * 25 + 10).toFixed(2)}</td>
                        <td className={`p-3 text-right font-mono font-bold text-white border-r border-white/5 ${isITMCall ? 'bg-amber-500/5' : ''}`}>
                          ₹{isITMCall ? (100 + (22550 - s)).toFixed(1) : (Math.random() * 50).toFixed(1)}
                        </td>
                        
                        <td className="p-3 font-black text-white bg-white/[0.03] text-base group-hover:bg-white/10 transition-colors cursor-pointer">{s}</td>
                        
                        <td className={`p-3 text-left font-mono font-bold text-white border-l border-white/5 ${isITMPut ? 'bg-amber-500/5' : ''}`}>
                          ₹{isITMPut ? (100 + (s - 22550)).toFixed(1) : (Math.random() * 50).toFixed(1)}
                        </td>
                        <td className={`p-3 font-mono text-[#FF4D6D] ${isITMPut ? 'bg-amber-500/5' : ''}`}>{(Math.random() * 25 + 10).toFixed(2)}</td>
                        <td className={`p-3 font-mono text-gray-500 ${isITMPut ? 'bg-amber-500/5' : ''}`}>{Math.floor(Math.random() * 200000)}</td>
                        <td className={`p-3 font-mono text-gray-400 ${isITMPut ? 'bg-amber-500/5' : ''}`}>{(Math.random() * 50).toFixed(1)}</td>
                     </tr>
                   )
                 })}
               </tbody>
             </table>
           </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
