"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { SignalBadge } from "@/components/ui/signal-badge";
import { INDIAN_STOCKS } from "@/lib/market-simulator";
import { Zap, Target, ShieldAlert, Cpu, Activity, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SignalEnginePage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setResult(null);
    
    // Simulate AI inference delay
    setTimeout(() => {
      setIsGenerating(false);
      setResult({
        type: Math.random() > 0.5 ? 'BUY' : 'SELL',
        confidence: Math.floor(Math.random() * 15) + 80,
        entry: 1450.25,
        target: 1520.50,
        sl: 1410.00,
        reasoning: "The Genkit ensemble model detected a high confluence bridging multiple timeframes. RSI divergence on the 4H chart paired against an anomalous volume spike at the VWAP indicates institutional accumulation. The sentiment score from recent news sits at 0.82 (Highly Bullish)."
      });
    }, 2500);
  };

  return (
    <DashboardLayout>
      <div className="w-full max-w-5xl mx-auto pb-10">
        
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00D4AA] to-blue-600 flex items-center justify-center text-[#060B14] shadow-[0_0_20px_rgba(0,212,170,0.5)]">
               <Cpu className="w-5 h-5 text-white" />
             </div>
             AI Signal Engine
          </h1>
          <p className="text-gray-400 font-medium mt-2">Generate predictive execution strategies via Random Forest models</p>
        </div>

        {/* Configuration Form */}
        <div className="glass-card rounded-2xl border border-white/5 p-6 md:p-8 mb-8 bg-[#080E19]/80">
           <form onSubmit={handleGenerate}>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                
                <div className="space-y-3">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Asset Target</label>
                  <select className="w-full bg-[#060B14] border border-white/10 rounded-xl py-3 px-4 text-white font-bold focus:outline-none focus:border-[#00D4AA]/50 focus:ring-1 focus:ring-[#00D4AA]/50 appearance-none">
                    {INDIAN_STOCKS.map(s => <option key={s.symbol} value={s.symbol}>{s.symbol.split('.')[0]} - {s.name}</option>)}
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Timeframe</label>
                  <select className="w-full bg-[#060B14] border border-white/10 rounded-xl py-3 px-4 text-white font-bold focus:outline-none focus:border-[#00D4AA]/50 focus:ring-1 focus:ring-[#00D4AA]/50 appearance-none">
                    <option value="intraday">Intraday (1D)</option>
                    <option value="swing">Swing (1W - 2W)</option>
                    <option value="positional">Positional (1M - 3M)</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Risk Profile</label>
                  <select className="w-full bg-[#060B14] border border-white/10 rounded-xl py-3 px-4 text-white font-bold focus:outline-none focus:border-[#00D4AA]/50 focus:ring-1 focus:ring-[#00D4AA]/50 appearance-none">
                    <option value="conservative">Conservative</option>
                    <option value="moderate">Moderate</option>
                    <option value="aggressive">Aggressive</option>
                  </select>
                </div>

             </div>

             <button 
               type="submit" 
               disabled={isGenerating}
               className="w-full md:w-auto px-10 py-3.5 bg-white text-[#060B14] font-black rounded-xl hover:bg-gray-100 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
             >
               {isGenerating ? (
                  <>
                    <Zap className="w-5 h-5 animate-pulse text-[#00D4AA]" />
                    Processing Alpha Models...
                  </>
               ) : (
                  <>
                    <Zap className="w-5 h-5" /> Run AI Inference
                  </>
               )}
             </button>
           </form>
        </div>

        {/* Results Section */}
        {result && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
             
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Primary Card */}
                <div className={cn(
                  "rounded-3xl p-8 border shadow-2xl relative overflow-hidden flex flex-col justify-center",
                  result.type === 'BUY' ? "bg-gradient-to-br from-[#00D4AA]/10 to-[#060B14] border-[#00D4AA]/30" : "bg-gradient-to-br from-[#FF4D6D]/10 to-[#060B14] border-[#FF4D6D]/30"
                )}>
                   <div className="flex justify-between items-start mb-8 z-10">
                     <div>
                       <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Generated Signal</h4>
                       <div className={cn(
                         "text-6xl font-black tracking-tighter leading-none",
                         result.type === 'BUY' ? "text-[#00D4AA]" : "text-[#FF4D6D]"
                       )}>
                         {result.type}
                       </div>
                     </div>
                     <div className="text-right">
                       <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1 mt-1">Confidence</h4>
                       <div className="text-3xl font-mono font-bold text-white">{result.confidence}%</div>
                     </div>
                   </div>

                   <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-6 z-10">
                     <div>
                       <div className="text-[10px] text-gray-500 font-bold uppercase mb-1">Entry Range</div>
                       <div className="text-lg font-mono font-bold text-white tracking-tight">₹{result.entry.toFixed(2)}</div>
                     </div>
                     <div>
                       <div className="text-[10px] text-gray-500 font-bold uppercase mb-1 flex items-center gap-1"><Target className="w-3 h-3 text-[#00D4AA]" /> Target</div>
                       <div className="text-lg font-mono font-bold text-[#00D4AA] tracking-tight">₹{result.target.toFixed(2)}</div>
                     </div>
                     <div>
                       <div className="text-[10px] text-gray-500 font-bold uppercase mb-1 flex items-center gap-1"><ShieldAlert className="w-3 h-3 text-[#FF4D6D]" /> Stop Loss</div>
                       <div className="text-lg font-mono font-bold text-[#FF4D6D] tracking-tight">₹{result.sl.toFixed(2)}</div>
                     </div>
                   </div>

                   <div className={cn("absolute -top-32 -right-32 w-96 h-96 rounded-full blur-[80px] opacity-20 pointer-events-none", result.type === 'BUY' ? "bg-[#00D4AA]" : "bg-[#FF4D6D]")}></div>
                </div>

                {/* Analysis / Features */}
                <div className="space-y-6">
                  <div className="glass-card rounded-2xl border border-white/5 p-6 h-1/2">
                    <h3 className="font-bold text-sm uppercase tracking-wider text-gray-400 mb-4 border-b border-white/5 pb-3 flex items-center gap-2">
                       <Activity className="w-4 h-4 text-blue-400" /> Feature Importance Matrix
                    </h3>
                    <div className="space-y-3 mt-4">
                       {[
                         { n: 'RSI divergence (14d)', w: 34 },
                         { n: 'MACD Histogram', w: 28 },
                         { n: 'Volume Delta Profile', w: 18 },
                         { n: 'Genkit Sentiment API', w: 12 },
                       ].map((f, i) => (
                         <div key={i}>
                           <div className="flex justify-between text-xs font-bold text-gray-300 mb-1">
                             <span>{f.n}</span>
                             <span>{f.w}%</span>
                           </div>
                           <div className="w-full bg-[#060B14] rounded-full h-1.5 border border-white/5">
                             <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${f.w}%` }}></div>
                           </div>
                         </div>
                       ))}
                    </div>
                  </div>

                  <div className="glass-card rounded-2xl border border-[#00D4AA]/10 p-6 bg-[#00D4AA]/5 h-1/2 overflow-auto">
                    <h3 className="font-bold text-sm uppercase tracking-wider text-[#00D4AA] mb-3 flex items-center gap-2">
                       <Info className="w-4 h-4" /> AI Synthesis Rationale
                    </h3>
                    <p className="text-sm font-medium text-gray-300 leading-relaxed">
                      {result.reasoning}
                    </p>
                  </div>
                </div>
             </div>

          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
